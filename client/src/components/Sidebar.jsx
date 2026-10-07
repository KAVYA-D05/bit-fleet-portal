import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CalendarPlus,
  BookmarkCheck,
  CheckSquare,
  Truck,
  Users2,
  BarChart3,
  Gauge,
  ShieldCheck,
  X,
  Radio,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, onCloseMobile }) => {
  const { role, user } = useAuth();

  const getNavItems = () => {
    const common = [
      { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    ];

    if (role === 'FACULTY') {
      return [
        ...common,
        { id: 'new-booking', label: 'Book Vehicle (Trip)', icon: CalendarPlus, highlight: true },
        { id: 'my-bookings', label: 'My Bookings & Gate Pass', icon: BookmarkCheck },
      ];
    }

    if (role === 'ADMIN') {
      return [
        ...common,
        { id: 'admin-approvals', label: 'Approvals & Allocation', icon: CheckSquare, badge: 'Desk' },
        { id: 'fleet-management', label: 'Fleet & Driver Management', icon: Truck },
        { id: 'all-bookings', label: 'All Institutional Trips', icon: BookmarkCheck },
        { id: 'analytics', label: 'Analytics & Audit Logs', icon: BarChart3 },
      ];
    }

    if (role === 'DRIVER') {
      return [
        ...common,
        { id: 'driver-desk', label: 'Assigned Trips & Odometer', icon: Gauge, highlight: true },
      ];
    }

    return common;
  };

  const navItems = getNavItems();

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 space-y-6">
      <div className="space-y-6">
        
        {/* Mobile Header */}
        <div className="flex items-center justify-between md:hidden border-b border-slate-100 pb-3">
          <span className="font-extrabold text-sm text-slate-900 tracking-tight">Navigation Menu</span>
          <button onClick={onCloseMobile} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              {role === 'ADMIN' ? 'TRANSPORT ADMIN DESK' : 'STAFF / FACULTY DESK'}
            </p>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer relative group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      isActive ? 'bg-blue-700 text-blue-100 border-blue-500' : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Institution Info Card */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl p-4 border border-slate-200/80 text-xs text-slate-600 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs">Safety Protocol</span>
            </div>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Real-time overlap conflict engine & driver telemetry tracking active for all dispatches.
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-200/70">
            <span>Helpline Ext:</span>
            <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
              405 / 406
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center font-medium">
        Bannari Amman Institute of Technology &copy; 2026
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-shrink-0 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] shadow-2xs flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-150">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

