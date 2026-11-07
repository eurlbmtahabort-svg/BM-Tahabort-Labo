import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Box, 
  Layers, 
  Mountain, 
  TestTube2, 
  Users, 
  FileText, 
  BookOpen, 
  Building2,
  X 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/', label: 'Tableau de Bord', icon: LayoutDashboard },
    { to: '/samples', label: 'Échantillons & Réception', icon: TestTube2 },
    { to: '/concrete', label: 'Béton (NA 16002)', icon: Box },
    { to: '/asphalt', label: 'Enrobés (NA 5031)', icon: Layers },
    { to: '/base-layer', label: 'Couches de Base (GNT)', icon: Mountain },
    { to: '/clients', label: 'Clients & Chantiers', icon: Users },
    { to: '/reports', label: 'Procès-Verbaux (PV)', icon: FileText },
    { to: '/standards', label: 'Normes NA & EN', icon: BookOpen },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#1E1E1E] text-neutral-300 flex flex-col border-r border-neutral-800 shrink-0 select-none
        transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Drawer Header */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-900/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
              <Building2 className="w-4 h-4 text-[#FF8C00]" />
              <span>Béjaïa · Alger · Sétif</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-0.5">Accréditation ALGERAC ISO 17025</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white md:hidden rounded-lg bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" onClick={() => { if (window.innerWidth < 768) onClose(); }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#FF8C00] text-white font-semibold shadow-sm'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Lab Status Widget */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/40 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400">Chambres Climatiques</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              20.1°C / 98% HR
            </span>
          </div>
          <p className="text-[10px] text-neutral-500">Presse Hydraulique 3000kN: Calibrée</p>
        </div>
      </aside>
    </>
  );
};
