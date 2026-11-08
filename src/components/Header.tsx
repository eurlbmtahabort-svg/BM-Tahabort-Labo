import React, { useState } from 'react';
import { Globe, ShieldCheck, Search, LogOut, Menu, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
    setShowLangDropdown(false);
  };

  const currentLang = i18n.language || 'fr';

  return (
    <header className="h-16 bg-[#2D2D2D] text-white px-4 md:px-6 flex items-center justify-between border-b border-neutral-700 shrink-0 sticky top-0 z-30 shadow-md">
      {/* Brand & Logo + Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 text-neutral-300 hover:text-white md:hidden focus:outline-none"
          title={t('header.openMenu')}
        >
          <Menu className="w-6 h-6 text-[#FF8C00]" />
        </button>

        <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[#FF8C00] flex items-center justify-center font-bold text-white text-base md:text-lg shadow-inner shrink-0">
          LT
        </div>
        <div>
          <h1 className="text-xs md:text-base font-bold tracking-wide flex flex-col md:flex-row md:items-center">
            <span>{t('header.labName')}</span>
            <span className="text-[#FF8C00] font-normal text-[10px] md:text-xs md:ms-2 px-1.5 py-0.2 bg-neutral-800 rounded w-fit mt-0.5 md:mt-0">{t('header.version')}</span>
          </h1>
          <p className="text-[10px] md:text-xs text-neutral-400 font-arabic hidden sm:block">
            {t('header.subtitle')}
          </p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden lg:flex items-center bg-neutral-800 rounded-lg px-3 py-1.5 w-64 xl:w-80 border border-neutral-700">
        <Search className="w-4 h-4 text-neutral-400 me-2 shrink-0" />
        <input 
          type="text" 
          placeholder={t('header.search')}
          className="bg-transparent text-xs text-white placeholder-neutral-400 focus:outline-none w-full"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Compliance Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 rounded-full text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t('header.standards')}</span>
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-md text-xs font-medium text-neutral-200 transition-colors"
            title="Changer de langue / Change language"
          >
            <Globe className="w-3.5 h-3.5 text-[#FF8C00]" />
            <span className="uppercase font-mono">{currentLang}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {showLangDropdown && (
            <div className="absolute end-0 mt-2 w-36 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl py-1 z-50 text-xs">
              <button
                onClick={() => changeLanguage('fr')}
                className={`w-full text-start px-3 py-2 hover:bg-neutral-700 flex items-center justify-between ${currentLang === 'fr' ? 'text-[#FF8C00] font-bold bg-neutral-700/50' : 'text-neutral-200'}`}
              >
                <span>Français</span>
                <span className="font-mono text-[10px]">FR</span>
              </button>
              <button
                onClick={() => changeLanguage('ar')}
                className={`w-full text-start px-3 py-2 hover:bg-neutral-700 flex items-center justify-between ${currentLang === 'ar' ? 'text-[#FF8C00] font-bold bg-neutral-700/50' : 'text-neutral-200'}`}
              >
                <span>العربية</span>
                <span className="font-mono text-[10px]">AR</span>
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`w-full text-start px-3 py-2 hover:bg-neutral-700 flex items-center justify-between ${currentLang === 'en' ? 'text-[#FF8C00] font-bold bg-neutral-700/50' : 'text-neutral-200'}`}
              >
                <span>English</span>
                <span className="font-mono text-[10px]">EN</span>
              </button>
            </div>
          )}
        </div>

        {/* Lab Director Profile & Logout */}
        <div className="flex items-center gap-2 md:gap-3 ps-2 border-s border-neutral-700">
          <div className="w-8 h-8 rounded-full bg-neutral-700 border border-[#FF8C00] flex items-center justify-center text-xs font-bold text-[#FF8C00] shrink-0">
            {user ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'MT'}
          </div>
          <div className="hidden sm:block text-start">
            <p className="text-xs font-semibold leading-tight">{user?.name || t('header.director')}</p>
            <p className="text-[10px] text-neutral-400">{user?.role || t('header.role')}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 bg-neutral-800 hover:bg-rose-950 text-neutral-300 hover:text-rose-300 rounded transition-colors"
            title={t('header.logout')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
