# Implementation Plan - Multi-Page YouTube Continuation Crawler (100+ to 500 Videos) & Enhanced Cinema Controls

Scale playlist extraction beyond YouTube's 100-video initial page limit using an automated InnerTube continuation token crawler in `server.ts` supporting up to 500 videos, auto-jumping to specific videos in playlist links, pre-caching the Apna College Java/Web series, and adding milestone badges with notes export.

---

## User Review Required

> [!IMPORTANT]
> **InnerTube Continuation Architecture**: YouTube only embeds the first 100 videos in raw playlist HTML. To retrieve videos 101 to 500+, `server.ts` will extract YouTube's web client `INNERTUBE_API_KEY` and continuation tokens, issuing batched `POST /youtubei/v1/browse` requests until the entire playlist is assembled.

- **Initial Video Auto-Jump**: Links like `https://youtu.be/VTLCoHnyACE?list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt` contain both a video ID (`VTLCoHnyACE`) and playlist ID (`PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt`). The system will parse both and immediately auto-focus that exact video in the cinema player and queue.
- **Pre-Cached Showcase**: The specified Apna College series (`PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt`) will also be pre-compiled into `CURATED_PLAYLISTS` for instant access.

---

## Proposed Changes

### 1. Server-Side Multi-Batch Continuation Crawler

#### [server.ts](file:///server.ts)
- Upgrade `/api/youtube/playlist` endpoint:
  - Extract `INNERTUBE_API_KEY` and client version from the initial playlist HTML.
  - Parse first 100 `playlistVideoRenderer` items.
  - Inspect `continuationItemRenderer` for `continuationCommand.token`.
  - Loop continuation requests to `https://www.youtube.com/youtubei/v1/browse?key=${apiKey}`:
    - Pass client context (`WEB`, version `2.20240401.01.00`).
    - Parse `onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems`.
    - Append next batches (items 101-200, 201-300...) up to 500 videos maximum.
  - Extract optional `initialVideoId` from incoming link parameter and return `{ targetVideoId, playlist }`.
  - In-memory cache with 2-hour TTL to prevent redundant upstream requests.

---

### 2. Curated Series Expansion

#### [src/data/curatedPlaylists.ts](file:///src/data/curatedPlaylists.ts)
- Add the complete **Apna College Complete Java Placement & DSA Course** (`PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt`):
  - Pre-cached with complete video lessons (Java Foundations, Loops, Functions, Time Complexity, Arrays, Strings, Bit Manipulation, Recursion, Backtracking, OOPs, ArrayList, LinkedList, Stacks, Queues, Greedy, Binary Trees, BST, Heaps, Hashing, Tries, Graphs, DP).
  - Categorized under `Java & Placement DSA`.

---

### 3. Context & Auto-Jump Routing

#### [src/context/HorizonContext.tsx](file:///src/context/HorizonContext.tsx)
- Enhance URL parser:
  - Extract both `playlistId` and `videoId` when URLs have both (e.g. `youtu.be/VIDEO?list=PLAYLIST` or `youtube.com/watch?v=VIDEO&list=PLAYLIST`).
- Update `addCustomYouTubePlaylist`:
  - Pass `initialVideoId` to automatically set `activePlaylistVideoIndex` to the matched video upon extraction.
- Add `refreshPlaylist(playlistId: string)`:
  - Clears cache and re-crawls the playlist to pull newly uploaded creator videos.

---

### 4. YouTube Cinema UI Upgrades

#### [src/components/features/YouTubeCinema.tsx](file:///src/components/features/YouTubeCinema.tsx)
- **Live Progress Counter**:
  - Displays real-time progress while extracting: *"Extracting episodes (100 / 140+ loaded)..."*.
- **Quarter Milestone Badges**:
  - Badges at 25%, 50%, 75%, and 100% completion with celebration banner upon completing quarters.
- **Sync / Refresh Button**:
  - Re-syncs the current playlist to pull new episodes directly from YouTube.
- **Export Notes Feature**:
  - One-click "Export Playlist Notes (.md)" button to download all timestamped notes across episodes.
- **Native Player Synchronization**:
  - Syncs iframe parameters so YouTube's embedded series widget and the custom sidebar remain synchronized.

---

## Verification Plan

### Automated Build & Compilation
- Run `compile_applet` to verify TypeScript clean build.
- Run `lint_applet` to ensure zero lint errors.

### Manual Verification Steps
1. **Link Verification (`PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt`)**:
   - Paste `https://youtu.be/VTLCoHnyACE?list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt`.
   - Verify that the total video count exceeds 100 (loads all 100+ videos, scrollable to the end).
   - Verify that the player auto-jumps to `VTLCoHnyACE` in the queue upon import.
2. **Continuation Crawler Test**:
   - Test any arbitrary public playlist with 120+ videos.
   - Verify backend continues fetching beyond item 100.
3. **Milestone & Export Test**:
   - Mark episodes to cross 25%; verify milestone badge displays.
   - Click "Export Notes (.md)"; verify Markdown file download is triggered.
