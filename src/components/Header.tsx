import React, { useState } from 'react';
import { FlaskConical, Globe, Bell, ShieldCheck, Search } from 'lucide-react';

export const Header: React.FC = () => {
  const [lang, setLang] = useState<'fr' | 'ar'>('fr');

  return (
    <header className="h-16 bg-[#2D2D2D] text-white px-6 flex items-center justify-between border-b border-neutral-700 shrink-0 sticky top-0 z-30 shadow-md">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#FF8C00] flex items-center justify-center font-bold text-white text-lg shadow-inner">
          LT
        </div>
        <div>
          <h1 className="text-base font-bold tracking-wide">
            LABO TAHABORT <span className="text-[#FF8C00] font-normal text-xs ml-2 px-2 py-0.5 bg-neutral-800 rounded">LT-LIMS v0.1</span>
          </h1>
          <p className="text-xs text-neutral-400 font-arabic">
            {lang === 'fr' ? 'Laboratoire de Contrôle Qualité & Géotechnique' : 'مخابق تحابورت لمراقبة الجودة وهندسة المدنیة'}
          </p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center bg-neutral-800 rounded-lg px-3 py-1.5 w-80 border border-neutral-700">
        <Search className="w-4 h-4 text-neutral-400 mr-2" />
        <input 
          type="text" 
          placeholder={lang === 'fr' ? "Rechercher échantillon, PV, chantier..." : "بحث عن عينة، محضر، ورش..."}
          className="bg-transparent text-xs text-white placeholder-neutral-400 focus:outline-none w-full"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Compliance Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 rounded-full text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Normes NA & EN Actives</span>
        </div>

        {/* Language Toggle */}
        <button 
          onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-md text-xs font-medium text-neutral-200 transition-colors"
          title="Changer de langue / تغيير اللغة"
        >
          <Globe className="w-3.5 h-3.5 text-[#FF8C00]" />
          <span>{lang === 'fr' ? 'العربية' : 'Français'}</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-md text-neutral-300 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF8C00] rounded-full"></span>
          </button>
        </div>

        {/* Lab Director Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-neutral-700">
          <div className="w-8 h-8 rounded-full bg-neutral-700 border border-[#FF8C00] flex items-center justify-center text-xs font-bold text-[#FF8C00]">
            MT
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold leading-tight">Dr. M. Tahabort</p>
            <p className="text-[10px] text-neutral-400">Directeur Labo</p>
          </div>
        </div>
      </div>
    </header>
  );
};
