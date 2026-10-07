import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Truck, Bell, LogOut, Menu, X, Shield, Sparkles, Building2, User } from 'lucide-react';

export const Navbar = ({ onOpenGatePass, onToggleMobileSidebar, isMobileSidebarOpen }) => {
  const { user, role, logout, notification } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getRoleBadgeStyle = (r) => {
    switch (r) {
      case 'ADMIN':
        return 'bg-amber-400/20 text-amber-300 border-amber-400/30';
      case 'FACULTY':
        return 'bg-blue-400/20 text-blue-200 border-blue-400/30';
      case 'DRIVER':
        return 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30';
      default:
        return 'bg-slate-700 text-slate-200 border-slate-600';
    }
  };

  return (
    <>
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-xs w-full backdrop-blur-md">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Mobile Toggle + BIT Branding */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Mobile Hamburger Toggle Button */}
              <button
                onClick={onToggleMobileSidebar}
                className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle navigation menu"
              >
                {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* BIT Logo Badge */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 flex items-center justify-center text-white shadow-sm ring-1 ring-blue-400/30 flex-shrink-0">
                  <Truck className="w-5 h-5 text-amber-300" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                      BIT <span className="text-amber-400 font-semibold tracking-normal">FLEET PORTAL</span>
                    </h1>
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      Sathyamangalam
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium hidden md:block leading-tight">
                    Centralized Vehicle Fleet & Trip Requisitions
                  </p>
                </div>
              </div>
            </div>

            {/* Right: User Identity Badge & Logout */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2.5">
                {/* User Avatar Circle */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-700 shadow-xs">
                  {getInitials(user?.name)}
                </div>

                <div className="flex flex-col text-right">
                  <span className="text-xs sm:text-sm font-bold text-slate-100 leading-tight">
                    {user?.name || 'Staff User'}
                  </span>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      {user?.department || 'BIT'}
                    </span>
                    <span className={`px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded border ${getRoleBadgeStyle(role)}`}>
                      {role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center pl-2 sm:pl-3 border-l border-slate-800">
                <button
                  onClick={logout}
                  title="Sign out of BIT Fleet Portal"
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/70 text-slate-400 hover:text-rose-300 transition-all border border-slate-700/80 hover:border-rose-800 cursor-pointer group"
                >
                  <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Global Notification Toast */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-3 border ${
              notification.type === 'success'
                ? 'bg-slate-900 border-emerald-500/50 text-emerald-200 shadow-emerald-950/20'
                : notification.type === 'error'
                ? 'bg-slate-900 border-rose-500/50 text-rose-200 shadow-rose-950/20'
                : 'bg-slate-900 border-blue-500/50 text-blue-200 shadow-blue-950/20'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              notification.type === 'success' ? 'bg-emerald-400' : notification.type === 'error' ? 'bg-rose-400' : 'bg-blue-400'
            } animate-pulse`} />
            <span>{notification.msg}</span>
          </div>
        </div>
      )}
    </>
  );
};

