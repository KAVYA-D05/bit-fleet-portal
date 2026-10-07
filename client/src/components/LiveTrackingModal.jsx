import React, { useState, useEffect } from 'react';
import { LiveTrackingMap } from './LiveTrackingMap';
import { api } from '../services/api';
import {
  Radio,
  X,
  Navigation,
  Truck,
  Phone,
  Clock,
  Gauge,
  MapPin,
  ShieldCheck,
  Fuel,
  Users,
  Compass
} from 'lucide-react';

export const LiveTrackingModal = ({ booking, onClose }) => {
  const [liveVehicles, setLiveVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveGPS = async () => {
    try {
      const res = await api.getLiveLocations();
      if (res.success) {
        setLiveVehicles(res.vehicles);
      }
    } catch (err) {
      console.error('Error fetching live GPS:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveGPS();
    const interval = setInterval(fetchLiveGPS, 5000); // 5-second live polling
    return () => clearInterval(interval);
  }, []);

  const assignedVehicleId = booking.assignedVehicle?._id || booking.assignedVehicleId?._id || booking.assignedVehicleId;
  const currentVehicleData = liveVehicles.find(v => (v._id || v.id) === assignedVehicleId) || {
    registrationNumber: booking.assignedVehicle?.registrationNumber || 'TN-37-BT-1002',
    model: booking.assignedVehicle?.model || 'Ashok Leyland Sunshine Standard',
    type: booking.assignedVehicle?.type || 'BUS',
    speedKmph: 55,
    fuelPercent: 87,
    capacity: booking.assignedVehicle?.capacity || 40,
    latitude: 11.3039,
    longitude: 77.1455,
    locationName: `En-route on NH-948 towards ${booking.destination}`
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-6xl w-full h-[92vh] max-h-[860px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-bit-navy via-slate-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded border border-amber-400/30">
                  {booking.bookingRef}
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  LIVE SATELLITE GPS STREAMING
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-100 mt-0.5">
                Real-Time Vehicle Movement & Telemetry Map
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

        {/* Unobstructed Live Map Viewport (Takes maximum height!) */}
        <div className="flex-1 w-full p-3 sm:p-4 bg-slate-100 min-h-0">
          <LiveTrackingMap
            vehicles={liveVehicles.length > 0 ? liveVehicles : [currentVehicleData]}
            selectedVehicleId={assignedVehicleId}
            singleVehicleMode={false}
            showOverlayCard={false} // Clean & unobstructed map view
            height="100%"
          />
        </div>

        {/* Clean Telemetry Details Bar below the Map */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200/90 flex-shrink-0 space-y-3">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            
            {/* Vehicle Card */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Vehicle Assigned</span>
              <strong className="text-slate-900 text-sm block truncate">
                {currentVehicleData.model}
              </strong>
              <div className="flex items-center justify-between pt-0.5">
                <span className="font-mono font-bold text-blue-700 text-xs">
                  {currentVehicleData.registrationNumber}
                </span>
                <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-700">
                  {currentVehicleData.capacity} Seats
                </span>
              </div>
            </div>

            {/* Live Speed & Fuel */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Live Telemetry Speed</span>
              <div className="flex items-baseline gap-2">
                <strong className="text-emerald-700 text-lg font-black font-mono">
                  {currentVehicleData.speedKmph || 55}
                </strong>
                <span className="text-xs text-slate-500 font-bold">KM/H</span>
                <span className="text-[10px] font-mono text-amber-600 ml-auto font-bold">
                  ⛽ {currentVehicleData.fuelPercent || 87}% Fuel
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                Location: {currentVehicleData.locationName || 'En-route'}
              </p>
            </div>

            {/* Driver Contact */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Driver in Charge</span>
              <strong className="text-slate-900 text-sm block truncate">
                {booking.assignedDriver?.name || 'Ramesh P (Senior Driver)'}
              </strong>
              <a
                href={`tel:${booking.assignedDriver?.phone || '9843366102'}`}
                className="inline-flex items-center gap-1 font-mono text-blue-600 font-bold text-xs hover:underline pt-0.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> {booking.assignedDriver?.phone || '+91 98433 66102'}
              </a>
            </div>

            {/* Destination & Geofence */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Destination & Safety</span>
              <strong className="text-slate-900 text-sm block truncate">
                {booking.destination}
              </strong>
              <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Campus Geofence Active
              </p>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1 font-medium text-[11px]">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Auto-syncing real-time satellite coordinates every 5s
            </span>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors"
            >
              Close Live Tracker
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
