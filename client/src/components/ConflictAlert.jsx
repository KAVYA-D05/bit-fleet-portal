import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, Clock, Sparkles } from 'lucide-react';

export const ConflictAlert = ({ availabilityData, loading }) => {
  if (loading) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 animate-pulse text-xs text-slate-500">
        <Clock className="w-4 h-4 text-blue-600 animate-spin" />
        <span>Evaluating vehicle fleet schedules using mathematical interval algorithm...</span>
      </div>
    );
  }

  if (!availabilityData) return null;

  const { hasAvailableFleet, hasAvailableDrivers, summary, timeWindow, vehicles } = availabilityData;

  return (
    <div
      className={`p-4 rounded-xl border transition-all text-xs space-y-3 ${
        hasAvailableFleet
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          : 'bg-amber-50 border-amber-300 text-amber-950'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {hasAvailableFleet ? (
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-amber-600 text-white">
              <AlertTriangle className="w-4 h-4" />
            </div>
          )}
          <div>
            <h4 className="font-bold text-sm">
              {hasAvailableFleet
                ? 'Fleet Available — Zero Mathematical Conflict Detected'
                : 'Limited Fleet Availability Warning'}
            </h4>
            <p className="text-[11px] opacity-80">
              Trip Window: {timeWindow?.durationHours} hrs duration • Formula:{' '}
              <code className="font-mono bg-white/70 px-1 py-0.5 rounded text-[10px] font-bold">
                ReqStart &lt; ExistEnd && ReqEnd &gt; ExistStart
              </code>
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full font-bold text-[11px] border ${
            hasAvailableFleet
              ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
              : 'bg-amber-100 border-amber-300 text-amber-900'
          }`}
        >
          {summary?.availableVehicles} of {summary?.totalVehicles} Vehicles Free
        </span>
      </div>

      {/* Available fleet type breakdown badges */}
      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-emerald-200/60">
        {vehicles?.map((v) => (
          <span
            key={v._id || v.id}
            className={`px-2 py-0.5 rounded-md text-[10px] font-medium border flex items-center gap-1 ${
              v.isAvailable
                ? 'bg-white text-slate-700 border-slate-200 shadow-2xs'
                : 'bg-slate-100 text-slate-400 border-slate-200 line-through opacity-70'
            }`}
            title={v.isAvailable ? `Available: ${v.capacity} Seats` : v.conflictReason}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                v.isAvailable ? 'bg-emerald-500' : 'bg-rose-400'
              }`}
            />
            {v.model.split(' ')[0]} ({v.capacity}s)
          </span>
        ))}
      </div>
    </div>
  );
};
