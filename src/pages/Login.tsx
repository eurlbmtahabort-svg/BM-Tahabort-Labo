import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FlaskConical, Lock, User, ShieldCheck, Building2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('labo2026');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#FF8000] text-white rounded-xl flex items-center justify-center font-bold text-2xl mx-auto shadow-inner">
            LT
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            LABO TAHABORT
          </h1>
          <p className="text-xs text-neutral-400 font-arabic">
            مخابر تحابورت لمراقبة الجودة والجيوتقنية
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-800 text-[#FF8000] rounded-full text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>LT-LIMS v0.1 • Cloudflare D1 Auth</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-lg text-center font-medium">
              Identifiants incorrects. Utilisez admin / labo2026.
            </div>
          )}

          <div>
            <label className="block text-neutral-400 mb-1">Nom d'utilisateur / Matricule</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-[#FF8000]"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-[#FF8000]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#FF8000] hover:bg-[#e07b00] text-white rounded-lg font-semibold shadow transition-colors text-sm"
          >
            Se Connecter au LIMS
          </button>
        </form>

        {/* Test Credentials Hint Box */}
        <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-400 text-[11px] space-y-1">
          <p className="font-semibold text-neutral-300">Identifiants de test démo:</p>
          <div className="flex justify-between font-mono">
            <span>Utilisateur: <strong className="text-white">admin</strong></span>
            <span>Mot de passe: <strong className="text-[#FF8000]">labo2026</strong></span>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-neutral-500">
          Document non reproductible sans autorisation • Normes NA & EN
        </div>
      </div>
    </div>
  );
};
