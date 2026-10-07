import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Shield, Truck, Users, Sparkles } from 'lucide-react';

export const RoleSwitcher = () => {
  const { user, role, demoSwitch, personas } = useAuth();

  const rolePresets = [
    {
      roleKey: 'FACULTY',
      label: 'Faculty (Dr. Rajesh)',
      dept: 'CSE Dept',
      icon: Users,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      email: 'rajeshkumar@bitsathy.ac.in'
    },
    {
      roleKey: 'ADMIN',
      label: 'Transport Officer / Admin',
      dept: 'Fleet Transport Office',
      icon: Shield,
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      email: 'transport.admin@bitsathy.ac.in'
    },
    {
      roleKey: 'DRIVER',
      label: 'Driver (Murugan K)',
      dept: 'Heavy Fleet Operator',
      icon: Truck,
      color: 'bg-amber-600 hover:bg-amber-700 text-white',
      email: 'murugan.driver@bitsathy.ac.in'
    }
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 shadow-inner">
      <div className="flex items-center gap-2 text-slate-300">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-slate-200 tracking-wide uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Interactive Demo Switcher:
        </span>
        <span className="text-slate-400 hidden sm:inline">
          Active Persona: <strong className="text-amber-300">{user?.name || 'Guest'}</strong> ({role})
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {rolePresets.map((preset) => {
          const Icon = preset.icon;
          const isActive = user?.email === preset.email || (role === preset.roleKey && !user?.email);

          return (
            <button
              key={preset.roleKey}
              onClick={() => demoSwitch(preset.email)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all shadow-sm ${
                isActive
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 font-bold scale-105'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
