import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { TripLogModal } from '../components/TripLogModal';
import { GatePassModal } from '../components/GatePassModal';
import {
  Gauge,
  Truck,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  PlayCircle,
  CheckCircle2,
  Printer,
  Fuel,
  Receipt
} from 'lucide-react';

export const DriverDesk = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [driverProfile, setDriverProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTripModal, setActiveTripModal] = useState(null); // { booking, mode: 'START' | 'COMPLETE' }
  const [selectedGatePass, setSelectedGatePass] = useState(null);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await api.getMyAssignedTrips();
      if (res.success) {
        setTrips(res.trips);
        setDriverProfile(res.driver);
      }
    } catch (err) {
      console.error('Error fetching driver trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Driver Identity Card */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
            <Gauge className="w-8 h-8 text-amber-200" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded text-amber-100">
              BIT Fleet Driver Terminal
            </span>
            <h2 className="text-xl font-bold mt-0.5">{driverProfile?.name || user?.name || 'Driver Operator'}</h2>
            <p className="text-xs text-amber-100/90 font-mono">
              License: {driverProfile?.licenseNumber || 'TN-37-20100004521'} ({driverProfile?.licenseCategory || 'HMV/ALL'}) • Phone: {driverProfile?.phone || user?.phone}
            </p>
          </div>
        </div>

        <button
          onClick={fetchTrips}
          className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/30 backdrop-blur-sm"
        >
          ↻ Refresh Trip Queue
        </button>
      </div>

      {/* Trips Queue */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-600" />
          My Assigned Institutional Trips & Excursions ({trips.length})
        </h3>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200">
            Loading assigned trips...
          </div>
        ) : trips.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
            No active trips currently assigned to your roster.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trips.map((b) => (
              <div
                key={b._id || b.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {b.bookingRef}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1.5">{b.tripType?.replace('_', ' ')}</h4>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        b.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800 animate-pulse'
                          : b.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {b.status === 'APPROVED' ? 'READY FOR DISPATCH' : b.status}
                    </span>
                  </div>

                  {/* Route & Faculty Info */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                    <p className="font-medium text-slate-800">
                      <strong>Faculty In-Charge:</strong> {b.faculty?.name} ({b.faculty?.department}) — Ph: <strong>{b.faculty?.phone}</strong>
                    </p>
                    <p className="flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      {b.pickupLocation} → {b.destination}
                    </p>
                    <p className="font-mono text-[11px] text-slate-500">
                      🕒 {new Date(b.departureDateTime).toLocaleString()} → {new Date(b.returnDateTime).toLocaleString()}
                    </p>
                  </div>

                  {/* Vehicle Assigned */}
                  {b.assignedVehicle && (
                    <div className="flex items-center justify-between text-xs p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                      <span className="font-bold text-blue-900 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-600" />
                        {b.assignedVehicle.model} ({b.assignedVehicle.registrationNumber})
                      </span>
                      <span className="font-mono text-[11px] text-blue-700">
                        Odo: {b.assignedVehicle.currentOdometer?.toLocaleString()} KM
                      </span>
                    </div>
                  )}

                  {/* Completed Trip Log Stats if available */}
                  {b.tripLog && (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-900 space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>Distance: {b.tripLog.totalDistanceKm} KM</span>
                        <span>Fuel: {b.tripLog.fuelConsumedLiters || 0} L (₹{b.tripLog.fuelExpenseAmount || 0})</span>
                      </div>
                      {b.tripLog.driverNotes && (
                        <p className="text-[11px] italic text-emerald-800">
                          Notes: "{b.tripLog.driverNotes}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Driver Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedGatePass(b)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" /> Gate Pass
                  </button>

                  <div className="flex items-center gap-2">
                    {b.status === 'APPROVED' && (
                      <button
                        onClick={() => setActiveTripModal({ booking: b, mode: 'START' })}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
                      >
                        <PlayCircle className="w-4 h-4" /> Start Trip (Log KM)
                      </button>
                    )}

                    {b.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => setActiveTripModal({ booking: b, mode: 'COMPLETE' })}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 animate-bounce"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Complete Trip & Close Log
                      </button>
                    )}

                    {b.status === 'COMPLETED' && (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Trip Finalized
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trip Log Modal */}
      {activeTripModal && (
        <TripLogModal
          booking={activeTripModal.booking}
          mode={activeTripModal.mode}
          onClose={() => setActiveTripModal(null)}
          onUpdated={() => {
            fetchTrips();
            setActiveTripModal(null);
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

    </div>
  );
};
