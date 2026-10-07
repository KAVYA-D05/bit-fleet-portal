import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { GatePassModal } from '../components/GatePassModal';
import { LiveTrackingModal } from '../components/LiveTrackingModal';
import { TripRatingModal } from '../components/TripRatingModal';
import { TripSafetyCockpitModal } from '../components/TripSafetyCockpitModal';
import {
  BookmarkCheck,
  Printer,
  Truck,
  Users,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  XCircle,
  X,
  AlertTriangle,
  Radio,
  Navigation,
  Star,
  Award,
  DollarSign,
  MessageSquareQuote,
  Activity,
  Heart,
  Hospital,
  ShieldCheck
} from 'lucide-react';

export const MyBookings = ({ onOpenNewBooking }) => {
  const { user, showNotification } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [selectedGatePass, setSelectedGatePass] = useState(null);
  const [selectedLiveTrackingBooking, setSelectedLiveTrackingBooking] = useState(null);
  const [selectedRatingBooking, setSelectedRatingBooking] = useState(null);
  const [selectedCockpitBooking, setSelectedCockpitBooking] = useState(null);
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getBookings();
      if (res.success) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      setCancelError('Please enter a cancellation reason.');
      return;
    }

    setCancelling(true);
    setCancelError('');

    try {
      const res = await api.cancelBooking(selectedBookingToCancel._id || selectedBookingToCancel.id, cancelReason);
      if (res.success) {
        showNotification(res.message || 'Booking cancelled successfully. Transport Admin notified.', 'info');
        setSelectedBookingToCancel(null);
        setCancelReason('');
        fetchBookings();
      }
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const filteredBookings = filter === 'ALL'
    ? bookings
    : bookings.filter((b) => b.status === filter);

  return (
    <div className="w-full space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            TRIP TRACKING & REVIEWS
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">
            My Vehicle Bookings & Requisitions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track real-time GPS, submit drop-off ratings & queries, view allowances and download Gate Passes
          </p>
        </div>

        <button
          onClick={onOpenNewBooking}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
        >
          + Request New Vehicle
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['ALL', 'PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              filter === tab
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Bookings Responsive Fluid Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200 w-full">
          Loading booking records from MongoDB...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300 w-full">
          No bookings found under this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 w-full">
          {filteredBookings.map((b) => (
            <div
              key={b._id || b.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      {b.bookingRef}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-2">
                      {b.tripType?.replace('_', ' ')}
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      b.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : b.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : b.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : b.status === 'COMPLETED'
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  <strong>Purpose:</strong> {b.purpose}
                </p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs space-y-1.5">
                  <p className="flex items-center gap-1.5 text-slate-800 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <strong>Route:</strong> {b.pickupLocation} → {b.destination}
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    {new Date(b.departureDateTime).toLocaleString()} → {new Date(b.returnDateTime).toLocaleString()}
                  </p>
                </div>

                {/* Rating & Review details if already submitted */}
                {b.rating && (
                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs space-y-1.5 text-amber-950">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1 text-amber-900">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        Rating: {b.rating.overallRating}.0 / 5.0 (Driver: {b.rating.driverRating}★, Bus: {b.rating.vehicleRating}★)
                      </span>
                      {b.financials?.totalTripCost > 0 && (
                        <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                          ₹{b.financials.totalTripCost.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {b.rating.remarks && (
                      <p className="italic text-slate-700 text-[11px]">
                        "{b.rating.remarks}"
                      </p>
                    )}
                  </div>
                )}

                {/* If Cancelled, show Cancellation Reason */}
                {b.status === 'CANCELLED' && b.cancellationReason && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs space-y-1 text-rose-900">
                    <span className="font-bold flex items-center gap-1 text-rose-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Cancellation Reason:
                    </span>
                    <p className="italic text-rose-950 font-medium">
                      "{b.cancellationReason}"
                    </p>
                  </div>
                )}

                {/* Assigned Asset Details if Approved / In Progress */}
                {(b.status === 'APPROVED' || b.status === 'IN_PROGRESS') && b.assignedVehicle && (
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-950 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-600" />
                        {b.assignedVehicle.model} ({b.assignedVehicle.registrationNumber})
                      </span>
                      <span className="text-[11px] font-semibold text-blue-800">
                        Driver: {b.assignedDriver?.name} ({b.assignedDriver?.phone})
                      </span>
                    </div>
                  </div>
                )}

                {b.status === 'PENDING' && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">
                    ⏳ Waiting for Transport Office vehicle and driver assignment.
                  </p>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-slate-100 gap-3">
                <span className="text-[11px] text-slate-500 font-medium">
                  {b.passengerCount} Pax ({b.passengers?.length || 0} Listed)
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* Rating & Drop-off Feedback Button for Completed / In-Progress trips */}
                  {(b.status === 'COMPLETED' || b.status === 'IN_PROGRESS' || b.status === 'APPROVED') && (
                    <button
                      onClick={() => setSelectedRatingBooking(b)}
                      className={`px-3 py-1.5 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95 whitespace-nowrap ${
                        b.rating
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 flex-shrink-0 ${b.rating ? 'fill-amber-500 text-amber-500' : 'text-white'}`} />
                      <span>{b.rating ? 'View Rating' : 'Rate Trip'}</span>
                    </button>
                  )}

                  {/* Driver Health, Emergency Hospitals & Live Cockpit Monitor */}
                  {(b.status === 'APPROVED' || b.status === 'IN_PROGRESS' || b.status === 'COMPLETED') && (
                    <button
                      onClick={() => setSelectedCockpitBooking(b)}
                      className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                      title="Inspect Live Driver Heart Rate, Blood Pressure, Emergency Hospitals & Safety Hotline"
                    >
                      <Activity className="w-3.5 h-3.5 text-rose-200 flex-shrink-0 animate-pulse" />
                      <span>Health Cockpit</span>
                    </button>
                  )}

                  {/* Live GPS Tracking Button */}
                  {(b.status === 'APPROVED' || b.status === 'IN_PROGRESS') && (
                    <button
                      onClick={() => setSelectedLiveTrackingBooking(b)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                    >
                      <Radio className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 animate-pulse" />
                      <span>Live GPS</span>
                    </button>
                  )}

                  {/* Cancel Booking Button for Pending or Approved trips */}
                  {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                    <button
                      onClick={() => {
                        setSelectedBookingToCancel(b);
                        setCancelReason('');
                        setCancelError('');
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                      <span>Cancel</span>
                    </button>
                  )}

                  {b.status !== 'CANCELLED' && (
                    <button
                      onClick={() => setSelectedGatePass(b)}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>Gate Pass</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Driver Health, Live Telemetry, Emergency Hospitals & Cockpit Modal */}
      {selectedCockpitBooking && (
        <TripSafetyCockpitModal
          booking={selectedCockpitBooking}
          onClose={() => setSelectedCockpitBooking(null)}
        />
      )}

      {/* Trip Rating & Feedback Modal */}
      {selectedRatingBooking && (
        <TripRatingModal
          booking={selectedRatingBooking}
          onClose={() => setSelectedRatingBooking(null)}
          onRatingSubmitted={() => {
            showNotification('Rating, remarks and long-distance allowance recorded successfully!', 'success');
            fetchBookings();
          }}
        />
      )}

      {/* Real-time GPS Tracking Modal */}
      {selectedLiveTrackingBooking && (
        <LiveTrackingModal
          booking={selectedLiveTrackingBooking}
          onClose={() => setSelectedLiveTrackingBooking(null)}
        />
      )}

      {/* Cancel Booking Reason Modal */}
      {selectedBookingToCancel && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base">
                  Cancel Trip Requisition
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingToCancel(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <p><strong>Booking Ref:</strong> <span className="font-mono text-blue-700 font-bold">{selectedBookingToCancel.bookingRef}</span></p>
              <p><strong>Destination:</strong> {selectedBookingToCancel.destination}</p>
              <p className="text-[11px] text-slate-500 font-mono">
                🕒 {new Date(selectedBookingToCancel.departureDateTime).toLocaleString()}
              </p>
            </div>

            {cancelError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{cancelError}</span>
              </div>
            )}

            <form onSubmit={handleCancelSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Reason for Cancellation *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Academic schedule change, guest visit cancelled, exam clash..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  This reason will be recorded and notified to the Transport Administrator. Allocated vehicles and drivers will be freed immediately.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedBookingToCancel(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="px-5 py-2 font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Gate Pass Modal */}
      {selectedGatePass && (
        <GatePassModal
          booking={selectedGatePass}
          onClose={() => setSelectedGatePass(null)}
        />
      )}

    </div>
  );
};
