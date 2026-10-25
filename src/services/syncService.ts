import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  UserProfile,
  Task,
  FocusSession,
  YouTubeLecture,
  RoadmapMilestone,
  CybersecurityModule,
  ProjectItem,
  PlacementTracker,
} from '../types';

export interface SyncedAppState {
  userId: string;
  profile: UserProfile;
  tasks: Task[];
  focusSessions: FocusSession[];
  youtubeLectures: YouTubeLecture[];
  milestones: RoadmapMilestone[];
  cyberModules: CybersecurityModule[];
  projects: ProjectItem[];
  placementTracker: PlacementTracker;
  lastSyncedAt: string;
  clientVersion: string;
}

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error' | 'local_only';

class FirestoreSyncService {
  private syncTimeout: number | null = null;
  private unsubscribeSnapshot: (() => void) | null = null;
  private lastPushedTimestamp: number = 0;
  private listeners: Set<(status: SyncStatus, lastSyncTime?: string) => void> = new Set();
  private currentStatus: SyncStatus = 'local_only';
  private lastSyncedTimeStr: string | null = null;

  public subscribeStatus(listener: (status: SyncStatus, lastSyncTime?: string) => void) {
    this.listeners.add(listener);
    listener(this.currentStatus, this.lastSyncedTimeStr || undefined);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyStatus(status: SyncStatus, lastSyncTime?: string) {
    this.currentStatus = status;
    if (lastSyncTime) this.lastSyncedTimeStr = lastSyncTime;
    this.listeners.forEach((l) => l(status, this.lastSyncedTimeStr || undefined));
  }

  /**
   * Schedule an automatic debounced push of local state to Firestore
   */
  public pushStateDebounced(
    userId: string,
    state: Omit<SyncedAppState, 'userId' | 'lastSyncedAt' | 'clientVersion'>,
    delayMs = 1200
  ) {
    if (!userId || userId.startsWith('guest-')) {
      this.notifyStatus('local_only');
      return;
    }

    if (this.syncTimeout) {
      window.clearTimeout(this.syncTimeout);
    }

    this.notifyStatus('syncing');

    this.syncTimeout = window.setTimeout(async () => {
      await this.pushStateImmediately(userId, state);
    }, delayMs);
  }

  /**
   * Immediately push state to Firestore
   */
  public async pushStateImmediately(
    userId: string,
    state: Omit<SyncedAppState, 'userId' | 'lastSyncedAt' | 'clientVersion'>
  ): Promise<boolean> {
    if (!userId || userId.startsWith('guest-')) {
      this.notifyStatus('local_only');
      return false;
    }

    const path = `users/${userId}/app_state/current`;
    try {
      const nowStr = new Date().toISOString();
      const payload: SyncedAppState = {
        ...state,
        userId,
        lastSyncedAt: nowStr,
        clientVersion: '3.1.0',
      };

      this.lastPushedTimestamp = Date.now();
      await setDoc(doc(db, 'users', userId, 'app_state', 'current'), payload, { merge: true });

      this.notifyStatus('synced', nowStr);
      return true;
    } catch (err: unknown) {
      console.error('Firestore real-time push sync error:', err);
      this.notifyStatus('error');
      try {
        handleFirestoreError(err, OperationType.WRITE, path);
      } catch (handled) {
        // Logged formatted error
      }
      return false;
    }
  }

  /**
   * Subscribe to remote real-time updates from other devices / sessions
   */
  public listenRemoteState(
    userId: string,
    onRemoteUpdate: (remoteState: SyncedAppState) => void
  ): () => void {
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
      this.unsubscribeSnapshot = null;
    }

    if (!userId || userId.startsWith('guest-')) {
      this.notifyStatus('local_only');
      return () => {};
    }

    const stateDocRef = doc(db, 'users', userId, 'app_state', 'current');
    const path = `users/${userId}/app_state/current`;

    this.unsubscribeSnapshot = onSnapshot(
      stateDocRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          return;
        }

        const data = snapshot.data() as SyncedAppState;
        if (!data || !data.lastSyncedAt) return;

        // Ignore updates that were pushed by this client in the last 2 seconds
        const remoteTime = new Date(data.lastSyncedAt).getTime();
        if (Date.now() - this.lastPushedTimestamp < 2500) {
          return;
        }

        this.notifyStatus('synced', data.lastSyncedAt);
        onRemoteUpdate(data);
      },
      (error) => {
        console.warn('Real-time sync onSnapshot listener error:', error);
        this.notifyStatus('error');
        try {
          handleFirestoreError(error, OperationType.GET, path);
        } catch {}
      }
    );

    return () => {
      if (this.unsubscribeSnapshot) {
        this.unsubscribeSnapshot();
        this.unsubscribeSnapshot = null;
      }
    };
  }

  /**
   * Pull latest remote state on sign-in
   */
  public async pullInitialRemoteState(userId: string): Promise<SyncedAppState | null> {
    if (!userId || userId.startsWith('guest-')) return null;
    const path = `users/${userId}/app_state/current`;
    try {
      this.notifyStatus('syncing');
      const snap = await getDoc(doc(db, 'users', userId, 'app_state', 'current'));
      if (snap.exists()) {
        const data = snap.data() as SyncedAppState;
        this.notifyStatus('synced', data.lastSyncedAt);
        return data;
      }
      this.notifyStatus('synced');
      return null;
    } catch (err) {
      console.warn('Pull initial state error:', err);
      this.notifyStatus('error');
      try {
        handleFirestoreError(err, OperationType.GET, path);
      } catch {}
      return null;
    }
  }
}

export const syncService = new FirestoreSyncService();
