import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BRAND_CONFIG } from '../config/brand';
import { Button } from '../components/common/Button';
import { SEOHead } from '../components/common/SEOHead';
import { Crest } from '../components/common/Crest';
import { PitchLines } from '../components/common/PitchLines';
import { SEO, ADMIN_SIDEBAR } from '../config/content';

// Inline login-page labels — referenced only by this file
const L = {
  subtitle: 'Store Owner Portal',
  emailLabel: 'Admin Email',
  passwordLabel: 'Password',
  submitLabel: 'Sign In to Console',
  demoNote: (email) =>
    <>For local demo, sign in with <span className="font-mono text-zinc-300">{email}</span> and any password.</>,
};

export function AdminLogin() {
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  if (user && isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-[15px] text-white placeholder-zinc-500 focus:outline-none focus:border-brand-glow transition-colors';

  return (
    <div className="admin-shell relative overflow-hidden min-h-screen bg-turf text-zinc-100 flex flex-col justify-center items-center p-4 sm:p-6">
      <SEOHead title={SEO.adminLogin.title} />
      <PitchLines className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] max-w-none text-chalk/[0.07] pointer-events-none" />

      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700/70 rounded-2xl p-7 sm:p-9 shadow-2xl">
        <div className="flex items-center gap-3.5 mb-8">
          <Crest className="w-11 h-12" tone="light" />
          <div className="leading-none">
            <h1 className="font-display text-4xl font-black uppercase tracking-wide text-white">
              {BRAND_CONFIG.name}
            </h1>
            <p className="text-sm text-zinc-400 mt-1.5">{L.subtitle}</p>
          </div>
        </div>

        {error && (
          <div role="alert" className="mb-6 p-3.5 rounded-lg bg-red-950/50 border border-red-500/40 flex items-start gap-3 text-red-200 text-sm">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-semibold text-zinc-200 mb-1.5">
              {L.emailLabel}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ADMIN_SIDEBAR.fallbackEmail}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-semibold text-zinc-200 mb-1.5">
              {L.passwordLabel}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={inputClass}
              />
            </div>
          </div>

          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2" icon={ArrowRight}>
            {L.submitLabel}
          </Button>
        </form>

        <p className="mt-7 pt-5 border-t border-zinc-800 text-xs text-zinc-400 leading-relaxed">
          {L.demoNote(ADMIN_SIDEBAR.fallbackEmail)}
        </p>
      </div>
    </div>
  );
}
