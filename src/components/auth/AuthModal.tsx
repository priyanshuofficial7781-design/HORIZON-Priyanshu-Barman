import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { X, LogIn, UserPlus, Sparkles, Shield, Mail, Lock, User, LogOut } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    user,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    loginAsGuest,
    logout,
    authError,
  } = useHorizon();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setLocalError(null);
    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, name);
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl border border-[#8B5CFF]/30 bg-[#0B1228] p-6 shadow-2xl shadow-[#8B5CFF]/20 text-slate-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If user is already logged in */}
        {user ? (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#8B5CFF] to-[#35D9FF] p-[2px] shadow-lg">
              <div className="w-full h-full rounded-full bg-[#050816] flex items-center justify-center text-xl font-bold">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold">{user.displayName || 'Horizon Scholar'}</h3>
              <p className="text-sm text-slate-400 mt-1">{user.email || 'Guest Session'}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {user.isAnonymous ? 'Guest Mode Active' : 'Authenticated Cloud Account'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left text-xs text-slate-300 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Account ID:</span>
                <span className="font-mono">{user.uid.slice(0, 12)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cloud Sync:</span>
                <span className="text-emerald-400">Active</span>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                await logout();
                setAuthModalOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 transition-colors font-medium text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out from Horizon
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CFF] to-[#35D9FF] flex items-center justify-center shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Horizon Scholar Authentication</h3>
                <p className="text-xs text-slate-400">Sync metrics, focus arena, and roadmaps</p>
              </div>
            </div>

            {/* Error Banner */}
            {(authError || localError) && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                {localError || authError}
              </div>
            )}

            {/* Google One-Click Login */}
            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full mb-4 flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-colors shadow-md cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google Account
            </button>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative bg-[#0B1228] px-3 text-xs text-slate-500 uppercase tracking-wider font-mono">
                or email login
              </span>
            </div>

            {/* Mode Toggle */}
            <div className="grid grid-cols-2 gap-1 p-1 mb-4 rounded-xl bg-white/5 border border-white/10">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  mode === 'signin'
                    ? 'bg-[#8B5CFF] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  mode === 'register'
                    ? 'bg-[#8B5CFF] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priyanshu Barman"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[#8B5CFF] text-white placeholder-slate-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@horizon.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[#8B5CFF] text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[#8B5CFF] text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-white font-semibold text-sm hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer shadow-lg shadow-[#8B5CFF]/20"
              >
                {submitting
                  ? 'Connecting...'
                  : mode === 'signin'
                  ? 'Sign In to Workspace'
                  : 'Register Account'}
              </button>
            </form>

            {/* Guest Mode */}
            <div className="mt-4 pt-3 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={loginAsGuest}
                className="text-xs text-slate-400 hover:text-white transition-colors underline decoration-dotted"
              >
                Continue as Guest (Instant Offline Access)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
