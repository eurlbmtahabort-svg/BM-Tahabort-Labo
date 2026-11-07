import React, { useState } from 'react';
import { FlaskConical, Globe, Bell, ShieldCheck, Search, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const [lang, setLang] = useState<'fr' | 'ar'>('fr');
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-[#2D2D2D] text-white px-4 md:px-6 flex items-center justify-between border-b border-neutral-700 shrink-0 sticky top-0 z-30 shadow-md">
      {/* Brand & Logo + Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 text-neutral-300 hover:text-white md:hidden focus:outline-none"
          title="Ouvrir le menu"
        >
          <Menu className="w-6 h-6 text-[#FF8C00]" />
        </button>

        <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[#FF8C00] flex items-center justify-center font-bold text-white text-base md:text-lg shadow-inner shrink-0">
          LT
        </div>
        <div>
          <h1 className="text-xs md:text-base font-bold tracking-wide flex flex-col md:flex-row md:items-center">
            <span>LABO TAHABORT</span>
            <span className="text-[#FF8C00] font-normal text-[10px] md:text-xs md:ml-2 px-1.5 py-0.2 bg-neutral-800 rounded w-fit mt-0.5 md:mt-0">LT-LIMS v0.1</span>
          </h1>
          <p className="text-[10px] md:text-xs text-neutral-400 font-arabic hidden sm:block">
            {lang === 'fr' ? 'Laboratoire de Contrôle Qualité & Géotechnique' : 'مخابر تحابورت لمراقبة الجودة والجيوتقنية'}
          </p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden lg:flex items-center bg-neutral-800 rounded-lg px-3 py-1.5 w-64 xl:w-80 border border-neutral-700">
        <Search className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
        <input 
          type="text" 
          placeholder={lang === 'fr' ? "Rechercher échantillon, PV..." : "بحث عن عينة، محضر..."}
          className="bg-transparent text-xs text-white placeholder-neutral-400 focus:outline-none w-full"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Compliance Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 rounded-full text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Normes NA & EN Actives</span>
        </div>

        {/* Language Toggle */}
        <button 
          onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
          className="flex items-center gap-1 px-2 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-md text-xs font-medium text-neutral-200 transition-colors"
          title="Changer de langue"
        >
          <Globe className="w-3.5 h-3.5 text-[#FF8C00]" />
          <span>{lang === 'fr' ? 'AR' : 'FR'}</span>
        </button>

        {/* Lab Director Profile & Logout */}
        <div className="flex items-center gap-2 md:gap-3 pl-2 border-l border-neutral-700">
          <div className="w-8 h-8 rounded-full bg-neutral-700 border border-[#FF8C00] flex items-center justify-center text-xs font-bold text-[#FF8C00] shrink-0">
            {user ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'MT'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold leading-tight">{user?.name || 'Dr. M. Tahabort'}</p>
            <p className="text-[10px] text-neutral-400">{user?.role || 'Directeur Labo'}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 bg-neutral-800 hover:bg-rose-950 text-neutral-300 hover:text-rose-300 rounded transition-colors"
            title="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
