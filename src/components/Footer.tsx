import React from 'react';
import { ShieldAlert, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="h-12 bg-[#2D2D2D] border-t border-neutral-700 text-neutral-400 px-6 flex items-center justify-between text-xs shrink-0 select-none">
      <div className="flex items-center gap-2 font-medium text-neutral-300">
        <span>Labo Tahabort – LT-LIMS v0.1</span>
        <span className="text-neutral-600">|</span>
        <span className="text-neutral-400 font-arabic">مخابر تحابورت</span>
      </div>

      <div className="flex items-center gap-2 text-amber-500/90 text-[11px]">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
        <span className="tracking-wide">Document non reproductible sans autorisation</span>
      </div>

      <div className="hidden md:flex items-center gap-2 text-[11px] text-neutral-500">
        <Cpu className="w-3.5 h-3.5 text-[#FF8C00]" />
        <span>Algérie Standards NA / EN 12390</span>
      </div>
    </footer>
  );
};
