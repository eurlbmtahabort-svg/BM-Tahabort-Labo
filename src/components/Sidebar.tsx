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
  Building2 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
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
    <aside className="w-64 bg-[#1E1E1E] text-neutral-300 flex flex-col border-r border-neutral-800 shrink-0 select-none">
      {/* Lab Banner / Location */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-900/50">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
          <Building2 className="w-4 h-4 text-[#FF8C00]" />
          <span>Béjaïa · Alger · Sétif</span>
        </div>
        <p className="text-[11px] text-neutral-500 mt-1">Accréditation ALGERAC ISO 17025</p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
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
  );
};
