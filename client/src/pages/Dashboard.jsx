import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Truck,
  Users,
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  TrendingUp,
  MapPin,
  FileText,
  ShieldCheck,
  ArrowRight,
  Activity,
  Navigation,
  Compass
} from 'lucide-react';

export const Dashboard = ({ setActiveTab, onSelectBooking }) => {
  const { user, role } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.getDashboardStats(),
          api.getBookings({ limit: 5 })
        ]);

        if (statsRes.success) setStats(statsRes.stats);
        if (bookingsRes.success) setRecentBookings(bookingsRes.bookings.slice(0, 5));
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [role]);

  const kpis = [
    {
      label: 'Available Vehicles',
      value: stats ? `${stats.availableVehicles} / ${stats.totalVehicles}` : '—',
      subtext: `${stats?.fleetUtilizationRate || 0}% Fleet Utilization`,
      icon: Truck,
      color: 'from-blue-600 to-indigo-600',
      borderAccent: 'border-blue-500/20'
    },
    {
      label: 'Pending Approvals',
      value: stats?.pendingBookings || 0,
      subtext: 'Awaiting Transport Action',
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      borderAccent: 'border-amber-500/20'
    },
    {
      label: 'Active Trips Today',
      value: (stats?.inProgressBookings || 0) + (stats?.approvedBookings || 0),
      subtext: `${stats?.inProgressBookings || 0} currently on road`,
      icon: CalendarCheck,
      color: 'from-emerald-500 to-teal-600',
      borderAccent: 'border-emerald-500/20'
    },
    {
      label: 'Completed Excursions',
      value: stats?.completedBookings || 0,
      subtext: `${(stats?.totalDistanceKm || 0).toLocaleString()} KM logged`,
      icon: TrendingUp,
      color: 'from-purple-600 to-indigo-700',
      borderAccent: 'border-purple-500/20'
    }
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden border border-slate-800/80">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>BIT Centralized Fleet Dispatch & Safety Management</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome, {user?.name || 'Staff Member'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Centralized institutional transport requisitions, automated time-overlap conflict resolution, live GPS telemetry, and driver health telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {role === 'FACULTY' && (
              <button
                onClick={() => setActiveTab('new-booking')}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Book New Trip
              </button>
            )}
            {role === 'ADMIN' && (
              <button
                onClick={() => setActiveTab('admin-approvals')}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Review Pending Requests
              </button>
            )}
            {role === 'DRIVER' && (
              <button
                onClick={() => setActiveTab('driver-desk')}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Truck className="w-4 h-4" /> View My Trips & Odometer
              </button>
            )}
          </div>
        </div>

        <div className="absolute right-0 -bottom-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between card-hover"
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500">{kpi.label}</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {kpi.value}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">{kpi.subtext}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-xs flex-shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid (2:1 split) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
        
        {/* Recent Bookings Queue (2 cols) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 tracking-tight">
                <FileText className="w-4 h-4 text-blue-600" />
                {role === 'FACULTY' ? 'My Recent Trip Requests' : 'Recent Institutional Fleet Bookings'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time booking statuses and assigned vehicle numbers
              </p>
            </div>
            <button
              onClick={() => setActiveTab(role === 'FACULTY' ? 'my-bookings' : 'admin-approvals')}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
              Loading recent booking records...
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No recent bookings found.
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div
                  key={b._id || b.id}
                  onClick={() => onSelectBooking(b)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                        {b.bookingRef}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {b.tripType?.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        ({b.department} • {b.passengerCount} Pax)
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 line-clamp-1 font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <strong className="text-slate-900">{b.destination}</strong>
                      <span className="text-slate-400">—</span>
                      <span className="text-slate-500">{b.purpose}</span>
                    </p>

                    <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(b.departureDateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        b.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : b.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-300'
                          : b.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-700 border border-blue-300'
                          : b.status === 'COMPLETED'
                          ? 'bg-purple-50 text-purple-700 border border-purple-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Operational Notice Box (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3 tracking-tight">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            BIT Fleet Dispatch Protocol
          </h3>

          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="p-3.5 bg-blue-50/60 border border-blue-200/60 rounded-xl space-y-1">
              <span className="font-bold text-blue-950 block text-xs">1. Conflict Prevention Engine</span>
              <p className="text-[11px] text-blue-900/80 leading-relaxed">
                All requests automatically run interval checks to prevent double booking of buses, vans, and drivers.
              </p>
            </div>

            <div className="p-3.5 bg-amber-50/60 border border-amber-200/60 rounded-xl space-y-1">
              <span className="font-bold text-amber-950 block text-xs">2. Passenger Safety Manifest</span>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">
                Field excursions mandate attaching student emergency contacts prior to gate checkout.
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/60 rounded-xl space-y-1">
              <span className="font-bold text-emerald-950 block text-xs">3. Driver Health & Safety Cockpit</span>
              <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                Live biometric telemetry (BPM, BP, $SpO_2$) and route emergency hospital lookup active during transit.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

