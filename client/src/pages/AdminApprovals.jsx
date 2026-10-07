import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AssignModal } from '../components/AssignModal';
import { GatePassModal } from '../components/GatePassModal';
import { TripSafetyCockpitModal } from '../components/TripSafetyCockpitModal';
import {
  CheckSquare,
  Truck,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Bell,
  Star,
  Receipt,
  MessageSquare,
  HelpCircle,
  Activity,
  Heart
} from 'lucide-react';

export const AdminApprovals = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('PENDING');
  const [selectedForAssign, setSelectedForAssign] = useState(null);
  const [selectedGatePass, setSelectedGatePass] = useState(null);
  const [selectedCockpitBooking, setSelectedCockpitBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getBookings();
      if (res.success) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Error fetching admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleQuickApprove = async (bookingId) => {
    try {
      const res = await api.handleApproval(bookingId, 'APPROVE', 'Approved by Chief Transport Officer');
      if (res.success) {
        fetchBookings();
      }
    } catch (err) {
      alert(err.message || 'Approval failed');
    }
  };

  const handleReject = async (bookingId) => {
    const reason = prompt('Please enter reason for rejection / rescheduling requirement:');
    if (reason === null) return;

    try {
      const res = await api.handleApproval(bookingId, 'REJECT', reason || 'Rejected due to transport unavailability');
      if (res.success) {
        fetchBookings();
      }
    } catch (err) {
      alert(err.message || 'Rejection failed');
    }
  };

  const handleReviewFeedback = async (bookingId, defaultAction = '') => {
    const action = defaultAction || prompt(
      'Enter Transport Office Decision for Further Trips (e.g., "Cleared for Next Trip", "Scheduled for Depot Maintenance", "Driver VIP Outstation Roster"):',
      'Vehicle & Driver Cleared for Next Scheduled Trip'
    );
    if (!action) return;

    try {
      const res = await api.reviewTripFeedback(bookingId, action);
      if (res.success) {
        fetchBookings();
      }
    } catch (err) {
      alert(err.message || 'Failed to record feedback review');
    }
  };

  const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED');
  const ratedBookings = bookings.filter((b) => b.rating);
  const unreviewedFeedback = bookings.filter((b) => b.rating && !b.rating.adminReviewed);

  const filtered = filter === 'ALL'
    ? bookings
    : filter === 'FEEDBACK'
    ? ratedBookings
    : bookings.filter((b) => b.status === filter);

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Transport Office Authority Desk
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">
            Requisition Verification & Vehicle Allocation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify trip purpose, run conflict algorithm, assign vehicles, review driver ratings & audit trip allowances
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchBookings}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
          >
            ↻ Refresh Queue
          </button>
        </div>
      </div>

      {/* Transport Admin Notification Alert for Faculty Trip Ratings & Further Trip Readiness */}
      {unreviewedFeedback.length > 0 && filter !== 'FEEDBACK' && (
        <div className="bg-gradient-to-r from-amber-50 via-indigo-50/50 to-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl flex-shrink-0 shadow-sm">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <p className="font-bold text-amber-950 text-sm">
                🔔 Transport Alert: {unreviewedFeedback.length} Completed Trip Rating(s) with Actions for Further Trips
              </p>
              <p className="text-[11px] text-slate-700 mt-0.5 line-clamp-1">
                Latest: <strong>{unreviewedFeedback[0].bookingRef}</strong> — Recommendation: <em>"{unreviewedFeedback[0].rating?.adminActionRecommendation || 'Review and take action before further trip dispatch'}"</em>
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilter('FEEDBACK')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex-shrink-0 cursor-pointer shadow-sm transition-transform active:scale-95"
          >
            Review Feedback & Plan Trips
          </button>
        </div>
      )}

      {/* Transport Admin Notification Alert for Cancelled Bookings */}
      {cancelledBookings.length > 0 && filter !== 'CANCELLED' && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-900 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600 text-white rounded-xl flex-shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-rose-950">
                Notice: {cancelledBookings.length} Trip Requisition(s) Cancelled by Staff
              </p>
              <p className="text-[11px] text-rose-800">
                Latest: <strong>{cancelledBookings[0].bookingRef}</strong> — Reason: "{cancelledBookings[0].cancellationReason || 'Staff cancellation'}"
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilter('CANCELLED')}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex-shrink-0 cursor-pointer"
          >
            View Cancelled Trips
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'PENDING', label: 'Pending Verification' },
          { id: 'APPROVED', label: 'Approved & Allocated' },
          { id: 'IN_PROGRESS', label: 'On Road / In Progress' },
          { id: 'COMPLETED', label: 'Completed Trips & Reviews' },
          { id: 'FEEDBACK', label: `⭐ Feedback & Further Trips (${ratedBookings.length})` },
          { id: 'CANCELLED', label: `Cancelled (${cancelledBookings.length})` },
          { id: 'ALL', label: 'All Requisitions' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings Queue */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200 w-full">
          Loading transport requisitions from MongoDB...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300 w-full">
          No requisitions currently in {filter} status.
        </div>
      ) : (
        <div className="space-y-4 w-full">
          {filtered.map((b) => (
            <div
              key={b._id || b.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs hover:shadow-md transition-all space-y-4 ${
                b.status === 'CANCELLED' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200/90'
              }`}
            >
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    {b.bookingRef}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {b.faculty?.name || 'Staff Member'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    (Dept of {b.department} • Ph: {b.faculty?.phone || '—'} • {b.faculty?.email})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-semibold">
                    {b.tripType?.replace('_', ' ')}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      b.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : b.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : b.status === 'COMPLETED'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>

              {/* Details & Manifest Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5 lg:col-span-2">
                  <p className="text-slate-800 font-medium">
                    <strong>Purpose:</strong> {b.purpose}
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <strong>Route:</strong> {b.pickupLocation} → {b.destination}
                  </p>
                  <p className="text-slate-500 font-mono text-[11px]">
                    🕒 {new Date(b.departureDateTime).toLocaleString()} → {new Date(b.returnDateTime).toLocaleString()}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Headcount & Sizing
                  </span>
                  <p className="font-bold text-slate-900">
                    {b.passengerCount} Total Passengers
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Preferred: <strong className="text-slate-700">{b.preferredVehicleType}</strong>
                  </p>
                  <p className="text-[11px] text-blue-600 font-semibold">
                    📋 {b.passengers?.length || 0} passengers detailed on manifest
                  </p>
                </div>
              </div>

              {/* Faculty Drop-Off Rating & Remarks Display */}
              {b.rating && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs space-y-2 text-amber-950">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-amber-900 text-sm">
                        Faculty Trip Review: {b.rating.overallRating}.0 / 5.0
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-amber-800">
                      <span>Driver Skill: {b.rating.driverRating}★</span>
                      <span>Bus Cleanliness: {b.rating.vehicleRating}★</span>
                    </div>
                  </div>

                  {b.rating.remarks && (
                    <p className="text-[11px] text-slate-700">
                      <strong>Remarks / Feedback:</strong> "{b.rating.remarks}"
                    </p>
                  )}

                  {b.rating.querySuggestion && (
                    <p className="text-[11px] text-blue-900 bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                      <strong>Query / Assistance Request:</strong> "{b.rating.querySuggestion}"
                    </p>
                  )}

                  {/* Automated Action Recommendation for Further Trips */}
                  <div className="p-3 bg-white/95 rounded-xl border border-amber-300/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        ⚡ Action Recommendation for Further Trips
                      </span>
                      {b.rating.adminReviewed ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-300">
                          ✓ Action Recorded
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-full border border-amber-300 animate-pulse">
                          ● Action Pending
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[11px] font-medium text-slate-800">
                      {b.rating.adminActionRecommendation || 'Review feedback and verify vehicle/driver readiness for future trips.'}
                    </p>

                    {b.rating.adminReviewed && b.rating.adminActionTaken && (
                      <div className="text-[11px] text-emerald-900 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200 font-semibold">
                        <strong>Logged Decision:</strong> {b.rating.adminActionTaken} {b.rating.reviewedAt ? `(${new Date(b.rating.reviewedAt).toLocaleDateString()})` : ''}
                      </div>
                    )}

                    {/* 1-Click Action Buttons for Future Trips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => handleReviewFeedback(b._id || b.id, 'Vehicle & Driver Cleared for Next Scheduled Trip (Optimal Performance)')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] cursor-pointer shadow-2xs"
                      >
                        ✓ Clear for Next Trip
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReviewFeedback(b._id || b.id, '🛠️ Depot Maintenance & HVAC Inspection Scheduled before Next Dispatch')}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px] cursor-pointer shadow-2xs"
                      >
                        🛠️ Schedule Depot Maintenance
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReviewFeedback(b._id || b.id, '⭐ Driver Assigned to VIP Outstation Preferred Roster')}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[10px] cursor-pointer shadow-2xs"
                      >
                        ⭐ VIP Outstation Roster
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReviewFeedback(b._id || b.id)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[10px] cursor-pointer border border-slate-200"
                      >
                        Custom Note...
                      </button>
                    </div>
                  </div>

                  {/* Long-Distance Allowance & Trip Expense Breakdown */}
                  {b.financials && b.financials.totalTripCost > 0 && (
                    <div className="bg-white/80 p-3 rounded-xl border border-amber-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs mt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">ROUND TRIP</span>
                        <strong className="font-mono text-slate-800">{b.financials.totalDistanceKm} KM</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">FUEL EXPENSE</span>
                        <strong className="font-mono text-slate-800">₹{b.financials.fuelExpense}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">DRIVER BATA</span>
                        <strong className="font-mono text-amber-700">₹{b.financials.driverBataAllowance}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">TOTAL EXPENSE</span>
                        <strong className="font-mono text-slate-900 font-black">₹{b.financials.totalTripCost.toLocaleString()}</strong>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* If Cancelled, Display Staff Cancellation Notification */}
              {b.status === 'CANCELLED' && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-rose-800">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Staff Cancellation Notice & Reason:</span>
                  </div>
                  <p className="italic font-semibold text-rose-950 text-sm">
                    "{b.cancellationReason || 'Cancelled by staff'}"
                  </p>
                </div>
              )}

              {/* Assigned Vehicle & Driver Info */}
              {b.status === 'APPROVED' && b.assignedVehicle && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-600 text-white rounded-lg">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-emerald-950 block">
                        Allocated: {b.assignedVehicle.model} ({b.assignedVehicle.registrationNumber})
                      </span>
                      <span className="text-[11px] text-emerald-800">
                        Driver: <strong>{b.assignedDriver?.name}</strong> (Ph: {b.assignedDriver?.phone})
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedForAssign(b)}
                    className="text-xs text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
                  >
                    Re-assign / Modify Asset
                  </button>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  {b.status !== 'CANCELLED' && (
                    <button
                      onClick={() => setSelectedGatePass(b)}
                      className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>Gate Pass</span>
                    </button>
                  )}

                  {(b.status === 'APPROVED' || b.status === 'IN_PROGRESS' || b.status === 'COMPLETED') && (
                    <button
                      onClick={() => setSelectedCockpitBooking(b)}
                      className="px-3.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                      title="Inspect Driver Heart Rate, Blood Pressure, Emergency Hospitals & Live Telemetry"
                    >
                      <Activity className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 animate-pulse" />
                      <span>Safety Cockpit & Health</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {b.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleReject(b._id || b.id)}
                        className="px-4 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => setSelectedForAssign(b)}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Truck className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                        <span>Assign Vehicle & Driver</span>
                      </button>
                    </>
                  )}

                  {b.status === 'APPROVED' && (
                    <button
                      onClick={() => setSelectedForAssign(b)}
                      className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>Re-assign Asset</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Assign Modal */}
      {selectedForAssign && (
        <AssignModal
          booking={selectedForAssign}
          onClose={() => setSelectedForAssign(null)}
          onAssigned={() => {
            fetchBookings();
            setSelectedForAssign(null);
          }}
        />
      )}

      {/* Gate Pass Modal */}
      {selectedGatePass && (
        <GatePassModal
          booking={selectedGatePass}
          onClose={() => setSelectedGatePass(null)}
        />
      )}

      {/* Trip Safety & Driver Health Telemetry Cockpit Modal */}
      {selectedCockpitBooking && (
        <TripSafetyCockpitModal
          booking={selectedCockpitBooking}
          onClose={() => setSelectedCockpitBooking(null)}
        />
      )}

    </div>
  );
};
