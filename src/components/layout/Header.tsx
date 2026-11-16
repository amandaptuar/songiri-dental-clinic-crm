import React, { useState, useRef, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Search, 
  Plus, 
  Bell, 
  UserPlus, 
  CalendarPlus, 
  Receipt, 
  PackagePlus, 
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  collapsed: boolean;
  onOpenNewPatient: () => void;
  onOpenNewAppointment: () => void;
  onOpenNewStock: () => void;
  onOpenNewInvoice: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  collapsed, 
  onOpenNewPatient, 
  onOpenNewAppointment, 
  onOpenNewStock, 
  onOpenNewInvoice 
}) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    lowStockCount, 
    setActiveTab, 
    settings,
    supabaseConnected 
  } = useClinic();

  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const quickMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (quickMenuRef.current && !quickMenuRef.current.contains(e.target as Node)) {
        setShowQuickMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header 
      className={`fixed top-0 right-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all duration-300 flex items-center justify-between px-6 ${
        collapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patient name, phone, medicine or invoice..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-transparent focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3.5">
        {/* Real-time Clock & Clinic Date */}
        <div className="hidden lg:flex items-center space-x-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-sky-600" />
          <span>
            {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            {' • '}
            {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Notifications & Low Stock Warning */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors relative"
            title="Notifications & Stock Alerts"
          >
            <Bell className="w-5 h-5" />
            {lowStockCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-ping" />
            )}
            {lowStockCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-sm text-slate-800">Alerts & Stock Warnings</span>
                <span className="text-[10px] font-medium bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                  {lowStockCount} Low Items
                </span>
              </div>
              <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                {lowStockCount > 0 ? (
                  <div 
                    onClick={() => {
                      setActiveTab('inventory');
                      setShowNotifMenu(false);
                    }}
                    className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-100/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-rose-900">
                          {lowStockCount} Medicines below minimum threshold!
                        </p>
                        <p className="text-[11px] text-rose-700 mt-0.5">
                          Click here to open Medicine Stock and reorder.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-500 text-xs flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    All inventory stock levels are healthy!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        <div className="relative" ref={quickMenuRef}>
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-sky-600/30 transition-all hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Action</span>
          </button>

          {showQuickMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Creation
              </div>
              
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onOpenNewPatient();
                }}
                className="w-full flex items-center space-x-3 px-3.5 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-sky-100 text-sky-600">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-xs">Patient Entry</div>
                  <div className="text-[10px] text-slate-400">Register new patient</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onOpenNewAppointment();
                }}
                className="w-full flex items-center space-x-3 px-3.5 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-teal-100 text-teal-600">
                  <CalendarPlus className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-xs">Book Appointment</div>
                  <div className="text-[10px] text-slate-400">Schedule chair slot</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onOpenNewStock();
                }}
                className="w-full flex items-center space-x-3 px-3.5 py-2 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
                  <PackagePlus className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-xs">Medicine Stock</div>
                  <div className="text-[10px] text-slate-400">Add or restock items</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onOpenNewInvoice();
                }}
                className="w-full flex items-center space-x-3 px-3.5 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                  <Receipt className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-xs">Create Bill / Invoice</div>
                  <div className="text-[10px] text-slate-400">Bill procedures & medicines</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
