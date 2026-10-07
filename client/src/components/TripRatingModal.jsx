import React, { useState } from 'react';
import { api } from '../services/api';
import {
  Star,
  X,
  MessageSquare,
  HelpCircle,
  Truck,
  CheckCircle2,
  DollarSign,
  Fuel,
  Receipt,
  Award,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const TripRatingModal = ({ booking, onClose, onRatingSubmitted }) => {
  const [driverRating, setDriverRating] = useState(booking.rating?.driverRating || 5);
  const [vehicleRating, setVehicleRating] = useState(booking.rating?.vehicleRating || 5);
  const [overallRating, setOverallRating] = useState(booking.rating?.overallRating || 5);
  const [remarks, setRemarks] = useState(booking.rating?.remarks || '');
  const [querySuggestion, setQuerySuggestion] = useState(booking.rating?.querySuggestion || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Long Distance Calculations
  const dest = (booking.destination || '').toLowerCase();
  let distanceKm = 80;
  let tollAmt = 65;

  if (dest.includes('bengaluru') || dest.includes('bangalore')) {
    distanceKm = 270;
    tollAmt = 240;
  } else if (dest.includes('chennai')) {
    distanceKm = 460;
    tollAmt = 420;
  } else if (dest.includes('salem')) {
    distanceKm = 120;
    tollAmt = 160;
  } else if (dest.includes('madurai')) {
    distanceKm = 230;
    tollAmt = 210;
  } else if (dest.includes('ooty')) {
    distanceKm = 105;
    tollAmt = 65;
  } else if (dest.includes('mysore') || dest.includes('mysuru')) {
    distanceKm = 135;
    tollAmt = 90;
  } else if (dest.includes('coimbatore')) {
    distanceKm = 70;
    tollAmt = 65;
  }

  const roundTripKm = distanceKm * 2;
  const isLongDistance = roundTripKm >= 120;
  const driverBataAllowance = isLongDistance ? 500 : 0;
  const mileage = booking.assignedVehicle?.fuelEfficiencyKmpl || 6;
  const fuelExpense = Math.round((roundTripKm / mileage) * 102);
  const totalCost = fuelExpense + (tollAmt * 2) + driverBataAllowance;

  const handleStarClick = (setter, val) => {
    setter(val);
  };

  const renderStarSelector = (label, value, setter) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-xs font-bold text-slate-700">{label}</span>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => handleStarClick(setter, star)}
            className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
          >
            <Star
              className={`w-5 h-5 ${
                star <= value
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300 hover:text-amber-200'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-mono font-bold text-slate-600 ml-1">
          {value}.0 / 5.0
        </span>
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.submitTripRating(booking._id || booking.id, {
        driverRating,
        vehicleRating,
        overallRating,
        remarks,
        querySuggestion
      });

      if (res.success) {
        onRatingSubmitted(res.booking);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150 font-sans">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-bit-navy via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded border border-amber-400/30">
                {booking.bookingRef}
              </span>
              <h3 className="font-extrabold text-base text-slate-100 mt-0.5 flex items-center gap-1.5">
                Trip Completion Rating & Feedback
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Trip Summary Pill */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <p className="font-bold text-slate-900 text-sm">
                Destination: {booking.destination}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Driver: <strong>{booking.assignedDriver?.name || 'Murugan K'}</strong> • Vehicle: <strong>{booking.assignedVehicle?.model || 'Tata Starbus'}</strong>
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 uppercase">
              Drop-off Completed
            </span>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 1. Star Rating Section */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 text-blue-700 border-b border-slate-100 pb-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                Service & Experience Ratings
              </h4>

              {renderStarSelector('Driver Punctuality & Driving Skill', driverRating, setDriverRating)}
              {renderStarSelector('Vehicle Condition & Cleanliness', vehicleRating, setVehicleRating)}
              {renderStarSelector('Overall Trip Satisfaction', overallRating, setOverallRating)}
            </div>

            {/* 2. Long Distance Allowance & Financial Expense Card */}
            <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/70 p-4 rounded-2xl border border-amber-200/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-amber-700" />
                  Trip Expenditure & Long-Distance Allowance
                </h4>
                {isLongDistance && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200 text-amber-900 border border-amber-300">
                    Long Distance (&gt;100 KM)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs pt-1">
                <div className="bg-white/80 p-2 rounded-xl border border-amber-200/70">
                  <span className="text-[10px] text-slate-500 font-semibold block">TOTAL RUNNING</span>
                  <strong className="font-mono text-slate-800 text-sm">{roundTripKm} KM</strong>
                </div>

                <div className="bg-white/80 p-2 rounded-xl border border-amber-200/70">
                  <span className="text-[10px] text-slate-500 font-semibold block">FUEL EXPENSE</span>
                  <strong className="font-mono text-slate-800 text-sm">₹{fuelExpense}</strong>
                </div>

                <div className="bg-white/80 p-2 rounded-xl border border-amber-200/70">
                  <span className="text-[10px] text-slate-500 font-semibold block">TOLL CHARGES</span>
                  <strong className="font-mono text-slate-800 text-sm">₹{tollAmt * 2}</strong>
                </div>

                <div className="bg-white/80 p-2 rounded-xl border border-amber-200/70">
                  <span className="text-[10px] text-slate-500 font-semibold block">DRIVER BATA</span>
                  <strong className="font-mono text-amber-800 text-sm font-bold">
                    {driverBataAllowance > 0 ? `₹${driverBataAllowance}` : '₹0 (Local)'}
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-200/60">
                <span className="text-amber-900 font-medium">Department Total Billing Amount:</span>
                <strong className="text-sm font-black font-mono text-amber-950">
                  ₹{totalCost.toLocaleString()} INR
                </strong>
              </div>
            </div>

            {/* 3. Remarks & Suggestions */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Remarks & Suggestions (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Share any feedback on vehicle AC, seating comfort, route suggestions..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs font-medium"
              />
            </div>

            {/* 4. Query / Complaint Box */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Query / Assistance Request to Transport Office (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Any queries regarding toll receipts, delay notes, or accounting reimbursement..."
                value={querySuggestion}
                onChange={(e) => setQuerySuggestion(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs font-medium"
              />
            </div>

            {/* Submit Toolbar */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                {submitting ? 'Saving Review...' : 'Submit Rating & Feedback'}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
