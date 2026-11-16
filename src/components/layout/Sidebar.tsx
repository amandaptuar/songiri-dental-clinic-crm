import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Pill, 
  Receipt, 
  ChevronRight,
  Stethoscope
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { 
    activeTab, 
    setActiveTab, 
    settings, 
    lowStockCount, 
    todayAppointmentsCount 
  } = useClinic();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'patients',
      label: 'Patient Entry',
      icon: Users,
      badge: null
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      badge: todayAppointmentsCount > 0 ? `${todayAppointmentsCount} today` : null,
      badgeColor: 'bg-sky-100 text-sky-700 font-semibold'
    },
    {
      id: 'inventory',
      label: 'Medicine Stock',
      icon: Pill,
      badge: lowStockCount > 0 ? `${lowStockCount} low` : null,
      badgeColor: 'bg-rose-100 text-rose-700 font-semibold'
    },
    {
      id: 'billing',
      label: 'Billing & Invoices',
      icon: Receipt,
      badge: null
    }
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-slate-900 text-white transition-all duration-200 ease-in-out border-r border-slate-800 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 bg-slate-950/40 shrink-0">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center shrink-0 shadow-sm">
            <svg 
              className="w-5 h-5 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2C8 2 6 5 6 9c0 3.5 1.5 6 3 9.5 1 2 2 3.5 3 3.5s2-1.5 3-3.5c1.5-3.5 3-6 3-9.5 0-4-2-7-6-7z"/>
              <path d="M10 9a2 2 0 1 0 4 0"/>
            </svg>
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-sm text-white tracking-tight truncate">
                DentaCare OS
              </span>
              <span className="text-[11px] font-medium text-slate-400 truncate">
                {settings.clinicName.split(' ')[0]} Dental ERP
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden md:block"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Clinical Modules
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center ${
                collapsed ? 'justify-center px-0' : 'justify-between px-3'
              } py-2.5 rounded-lg text-xs font-semibold transition-colors group relative ${
                isActive 
                  ? 'bg-sky-600 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                }`} />
                {!collapsed && <span>{item.label}</span>}
              </div>

              {!collapsed && item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                  {item.badge}
                </span>
              )}

              {/* Tooltip on collapsed hover */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-xs rounded shadow-md border border-slate-700 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                  {item.label}
                  {item.badge && <span className="ml-1 text-sky-400">({item.badge})</span>}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Doctor Info Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-sky-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
            DR
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-slate-200 truncate">
                {settings.doctorName.split(',')[0]}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                <Stethoscope className="w-2.5 h-2.5 text-sky-400" /> Chief Surgeon
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
