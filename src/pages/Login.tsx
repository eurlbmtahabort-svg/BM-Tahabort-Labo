import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ShieldCheck, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { t, i18n } = useTranslation();
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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const currentLang = i18n.language || 'fr';

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 relative">
      {/* Language Switcher top right on login */}
      <div className="absolute top-6 end-6 flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg p-1 text-xs">
        <Globe className="w-4 h-4 text-[#FF8000] ms-2" />
        {(['fr', 'ar', 'en'] as const).map((lng) => (
          <button
            key={lng}
            onClick={() => changeLanguage(lng)}
            className={`px-2.5 py-1 rounded font-mono uppercase transition-colors ${
              currentLang === lng ? 'bg-[#FF8000] text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {lng}
          </button>
        ))}
      </div>

      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#FF8000] text-white rounded-xl flex items-center justify-center font-bold text-2xl mx-auto shadow-inner">
            LT
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t('login.title')}
          </h1>
          <p className="text-xs text-neutral-400 font-arabic">
            {t('login.subtitle')}
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-800 text-[#FF8000] rounded-full text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('login.badge')}</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-lg text-center font-medium">
              {t('login.error')}
            </div>
          )}

          <div>
            <label className="block text-neutral-400 mb-1">{t('login.usernameLabel')}</label>
            <div className="relative">
              <User className="absolute start-3 top-2.5 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg ps-9 pe-3 py-2.5 text-white focus:outline-none focus:border-[#FF8000]"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">{t('login.passwordLabel')}</label>
            <div className="relative">
              <Lock className="absolute start-3 top-2.5 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg ps-9 pe-3 py-2.5 text-white focus:outline-none focus:border-[#FF8000]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#FF8000] hover:bg-[#e07b00] text-white rounded-lg font-semibold shadow transition-colors text-sm"
          >
            {t('login.submit')}
          </button>
        </form>

        {/* Test Credentials Hint Box */}
        <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-400 text-[11px] space-y-1">
          <p className="font-semibold text-neutral-300">{t('login.demoHint')}</p>
          <div className="flex justify-between font-mono">
            <span>{t('login.userHint')} <strong className="text-white">admin</strong></span>
            <span>{t('login.passHint')} <strong className="text-[#FF8000]">labo2026</strong></span>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-neutral-500">
          {t('login.copyright')}
        </div>
      </div>
    </div>
  );
};
