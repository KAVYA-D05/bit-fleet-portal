import React, { useState } from 'react';
import { api } from '../services/api';
import { Gauge, Fuel, Receipt, CheckCircle, X, AlertCircle } from 'lucide-react';

export const TripLogModal = ({ booking, mode, onClose, onUpdated }) => {
  const isStartMode = mode === 'START';

  const [odometer, setOdometer] = useState(
    isStartMode
      ? booking.assignedVehicle?.currentOdometer || 0
      : (booking.tripLog?.startOdometer || booking.assignedVehicle?.currentOdometer || 0) + 120
  );
  const [fuelLiters, setFuelLiters] = useState(0);
  const [fuelAmount, setFuelAmount] = useState(0);
  const [tollAmount, setTollAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isStartMode) {
        const res = await api.startTrip(booking._id || booking.id, Number(odometer));
        if (res.success) {
          onUpdated(res.booking);
          onClose();
        }
      } else {
        const res = await api.completeTrip({
          bookingId: booking._id || booking.id,
          endOdometer: Number(odometer),
          fuelConsumedLiters: Number(fuelLiters),
          fuelExpenseAmount: Number(fuelAmount),
          tollExpenses: Number(tollAmount),
          driverNotes: notes
        });
        if (res.success) {
          onUpdated(res.booking);
          onClose();
        }
      }
    } catch (err) {
      setError(err.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl text-white ${isStartMode ? 'bg-blue-600' : 'bg-emerald-600'}`}>
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isStartMode ? 'Start Trip & Log Odometer' : 'Complete Trip & Log Summary'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">{booking.bookingRef}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* Odometer Input */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              {isStartMode ? 'Current Starting Odometer (KM):' : 'Final Trip Ending Odometer (KM):'}
            </label>
            <div className="relative">
              <input
                type="number"
                required
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 pl-8"
              />
              <Gauge className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
            </div>
            {!isStartMode && booking.tripLog?.startOdometer && (
              <p className="text-[11px] text-slate-500 mt-1">
                Started at: <span className="font-mono font-bold text-slate-700">{booking.tripLog.startOdometer} KM</span> | 
                Calculated Distance: <span className="font-mono font-bold text-emerald-700">{Math.max(0, odometer - booking.tripLog.startOdometer)} KM</span>
              </p>
            )}
          </div>

          {!isStartMode && (
            <>
              {/* Fuel logs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fuel Pumped (Liters):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={fuelLiters}
                    onChange={(e) => setFuelLiters(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fuel Cost (₹):</label>
                  <input
                    type="number"
                    step="1"
                    value={fuelAmount}
                    onChange={(e) => setFuelAmount(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Tolls */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Fastag / Toll Charges (₹):</label>
                <input
                  type="number"
                  value={tollAmount}
                  onChange={(e) => setTollAmount(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Driver Remarks / Vehicle Condition:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Return on time, no breakdowns, vehicle cleaned."
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2 font-bold text-white rounded-xl shadow flex items-center gap-1.5 ${
                isStartMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {submitting ? 'Saving...' : isStartMode ? 'Start Trip' : 'Finalize & Complete'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
