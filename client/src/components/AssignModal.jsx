import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Truck, UserCheck, ShieldCheck, AlertCircle, X, CheckCircle2 } from 'lucide-react';

export const AssignModal = ({ booking, onClose, onAssigned }) => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const res = await api.checkAvailability({
          departureDateTime: booking.departureDateTime,
          returnDateTime: booking.returnDateTime,
          passengerCount: booking.passengerCount
        });

        if (res.success) {
          setVehicles(res.vehicles || []);
          setDrivers(res.drivers || []);

          // Auto-select first suitable available vehicle
          const suitable = (res.vehicles || []).find((v) => v.isAvailable);
          if (suitable) setSelectedVehicle(suitable._id || suitable.id);

          const availDriver = (res.drivers || []).find((d) => d.isAvailable);
          if (availDriver) setSelectedDriver(availDriver._id || availDriver.id);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch available fleet');
      } finally {
        setLoading(false);
      }
    };

    if (booking) {
      fetchAvailability();
    }
  }, [booking]);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedVehicle || !selectedDriver) {
      alert('Please select both a vehicle and a driver.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await api.assignVehicleAndDriver(
        booking._id || booking.id,
        selectedVehicle,
        selectedDriver,
        remarks || `Approved and allocated by Transport Office.`
      );

      if (res.success) {
        onAssigned(res.booking);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Assignment failed due to conflict');
    } finally {
      setSubmitting(false);
    }
  };

  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200 border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase">
              Transport Allocation Desk
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Assign Vehicle & Driver • {booking.bookingRef}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trip Overview Pill */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs grid grid-cols-2 gap-2">
          <div>
            <span className="text-slate-400 font-medium">Department & Faculty:</span>
            <p className="font-bold text-slate-800">
              {booking.department} • {booking.faculty?.name || 'Faculty Member'}
            </p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Destination & Passengers:</span>
            <p className="font-bold text-slate-800">
              {booking.destination} ({booking.passengerCount} Passengers)
            </p>
          </div>
          <div className="col-span-2 text-slate-500 border-t border-slate-200 pt-1.5 font-mono text-[11px]">
            🕒 {new Date(booking.departureDateTime).toLocaleString()} → {new Date(booking.returnDateTime).toLocaleString()}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAssign} className="space-y-4 text-xs">
          {/* Vehicle Select */}
          <div>
            <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-blue-600" />
              Select Available Fleet Vehicle:
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              disabled={loading}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose Vehicle --</option>
              {vehicles.map((v) => (
                <option
                  key={v._id || v.id}
                  value={v._id || v.id}
                  disabled={!v.isAvailable}
                >
                  {v.registrationNumber} — {v.model} ({v.capacity} Seats, {v.fuelType}){' '}
                  {v.isAvailable ? '✅ Available' : `❌ ${v.conflictReason}`}
                </option>
              ))}
            </select>
          </div>

          {/* Driver Select */}
          <div>
            <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              Select Available Driver:
            </label>
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              disabled={loading}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose Driver --</option>
              {drivers.map((d) => (
                <option
                  key={d._id || d.id}
                  value={d._id || d.id}
                  disabled={!d.isAvailable}
                >
                  {d.name} (License: {d.licenseNumber} - {d.licenseCategory}, Ph: {d.phone}){' '}
                  {d.isAvailable ? '✅ Available' : `❌ ${d.conflictReason}`}
                </option>
              ))}
            </select>
          </div>

          {/* Admin Remarks */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Transport Office Remarks / Instructions:
            </label>
            <input
              type="text"
              placeholder="e.g. Clean vehicle dispatched. Fuel voucher issued."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loading || !selectedVehicle || !selectedDriver}
              className="px-5 py-2.5 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? 'Confirming Allocation...' : 'Confirm Vehicle & Driver Allocation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
