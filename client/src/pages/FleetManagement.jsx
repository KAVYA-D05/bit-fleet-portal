import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LiveTrackingMap } from '../components/LiveTrackingMap';
import {
  Truck,
  Users,
  Plus,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Fuel,
  Gauge,
  Calendar,
  X,
  Radio,
  MapPin,
  Navigation,
  Compass,
  Phone
} from 'lucide-react';

export const FleetManagement = () => {
  const [activeTab, setActiveTab] = useState('GPS_MAP');
  const [vehicles, setVehicles] = useState([]);
  const [liveVehicles, setLiveVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedVehicleForGps, setSelectedVehicleForGps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);

  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    registrationNumber: '',
    model: '',
    type: 'BUS',
    capacity: 40,
    fuelType: 'DIESEL',
    currentOdometer: 15000,
    fuelEfficiencyKmpl: 6.0
  });

  // New driver form state
  const [newDriver, setNewDriver] = useState({
    name: '',
    licenseNumber: '',
    licenseCategory: 'ALL',
    phone: '',
    experienceYears: 5
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vRes, dRes, liveRes] = await Promise.all([
        api.getVehicles(),
        api.getDrivers(),
        api.getLiveLocations()
      ]);
      if (vRes.success) setVehicles(vRes.vehicles);
      if (dRes.success) setDrivers(dRes.drivers);
      if (liveRes.success) setLiveVehicles(liveRes.vehicles);
    } catch (err) {
      console.error('Error fetching fleet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(async () => {
      try {
        const liveRes = await api.getLiveLocations();
        if (liveRes.success) setLiveVehicles(liveRes.vehicles);
      } catch (e) {
        // silent polling catch
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleMaintenance = async (vehicle) => {
    const newStatus = vehicle.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
    try {
      const res = await api.updateVehicle(vehicle._id || vehicle.id, { status: newStatus });
      if (res.success) {
        fetchData();
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  const handleCreateVehicle = async (e) => {
    e.preventDefault();
    try {
      const res = await api.addVehicle(newVehicle);
      if (res.success) {
        setShowAddVehicleModal(false);
        setNewVehicle({
          registrationNumber: '',
          model: '',
          type: 'BUS',
          capacity: 40,
          fuelType: 'DIESEL',
          currentOdometer: 15000,
          fuelEfficiencyKmpl: 6.0
        });
        fetchData();
      }
    } catch (err) {
      alert(err.message || 'Failed to add vehicle');
    }
  };

  const handleCreateDriver = async (e) => {
    e.preventDefault();
    try {
      const res = await api.addDriver(newDriver);
      if (res.success) {
        setShowAddDriverModal(false);
        setNewDriver({
          name: '',
          licenseNumber: '',
          licenseCategory: 'ALL',
          phone: '',
          experienceYears: 5
        });
        fetchData();
      }
    } catch (err) {
      alert(err.message || 'Failed to add driver');
    }
  };

  const onRoadCount = liveVehicles.filter(v => v.status === 'ON_TRIP' || (v.speedKmph || 0) > 0).length;
  const inDepotCount = liveVehicles.filter(v => v.status === 'AVAILABLE' && (v.speedKmph || 0) === 0).length;

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            Institutional Transport Management Desk
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">
            Live GPS Tracking & Fleet Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time satellite GPS tracking, speed telemetry, fleet maintenance and driver roster
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'VEHICLES' && (
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Fleet Vehicle
            </button>
          )}

          {activeTab === 'DRIVERS' && (
            <button
              onClick={() => setShowAddDriverModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Register Driver
            </button>
          )}

          {activeTab === 'GPS_MAP' && (
            <button
              onClick={fetchData}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              ↻ Refresh GPS Feed
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setActiveTab('GPS_MAP')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'GPS_MAP'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Radio className="w-4 h-4 text-amber-300 animate-pulse" />
          Live GPS Map Command Center ({liveVehicles.length} Tracked)
        </button>

        <button
          onClick={() => setActiveTab('VEHICLES')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'VEHICLES'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" /> Fleet Inventory ({vehicles.length})
        </button>

        <button
          onClick={() => setActiveTab('DRIVERS')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'DRIVERS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" /> Driver Roster ({drivers.length})
        </button>
      </div>

      {/* TAB 1: Live GPS Map Command Center */}
      {activeTab === 'GPS_MAP' && (
        <div className="space-y-4 w-full">
          
          {/* Quick Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Total GPS Units</p>
                <h4 className="text-2xl font-black text-slate-900 font-mono mt-1">{liveVehicles.length}</h4>
                <p className="text-[10px] text-emerald-600 font-semibold">100% Signal Locked</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                📡
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Vehicles In Transit</p>
                <h4 className="text-2xl font-black text-blue-600 font-mono mt-1">{onRoadCount}</h4>
                <p className="text-[10px] text-blue-600 font-semibold">Live Moving on Highway</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                🛣️
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Campus Depot Standby</p>
                <h4 className="text-2xl font-black text-emerald-600 font-mono mt-1">{inDepotCount}</h4>
                <p className="text-[10px] text-emerald-600 font-semibold">Ready for Dispatch</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                🏛️
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Active Speed Alerts</p>
                <h4 className="text-2xl font-black text-emerald-600 font-mono mt-1">0</h4>
                <p className="text-[10px] text-slate-500 font-semibold">All Drivers Within Limit</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                🛡️
              </div>
            </div>
          </div>

          {/* Interactive Leaflet Map View */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            
            {/* Live Map Canvas (3 columns on large screen) */}
            <div className="lg:col-span-3">
              <LiveTrackingMap
                vehicles={liveVehicles}
                selectedVehicleId={selectedVehicleForGps?._id || selectedVehicleForGps?.id}
                onSelectVehicle={(veh) => setSelectedVehicleForGps(veh)}
                height="540px"
              />
            </div>

            {/* Live Vehicle Fleet Telemetry Roster List (1 col) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col space-y-3 max-h-[540px] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="font-bold text-xs text-slate-800">
                  Live Fleet Vehicles
                </h4>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {liveVehicles.length} Units
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {liveVehicles.map((v) => {
                  const isSelected = (selectedVehicleForGps?._id || selectedVehicleForGps?.id) === (v._id || v.id);
                  const isMoving = (v.speedKmph || 0) > 0;

                  return (
                    <div
                      key={v._id || v.id}
                      onClick={() => setSelectedVehicleForGps(v)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                          : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono font-bold text-[11px] text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {v.registrationNumber}
                          </span>
                          <h5 className="font-bold text-slate-800 text-xs mt-1">
                            {v.model}
                          </h5>
                        </div>

                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            isMoving
                              ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                              : v.status === 'MAINTENANCE'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isMoving ? `${v.speedKmph} KM/H` : v.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate">
                        📍 {v.locationName || 'BIT Sathyamangalam Depot'}
                      </p>

                      {v.activeBooking && (
                        <div className="text-[10px] font-semibold text-blue-800 bg-blue-100/60 px-2 py-1 rounded">
                          Trip: {v.activeBooking.destination}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: Fleet Inventory */}
      {activeTab === 'VEHICLES' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
          {vehicles.map((v) => (
            <div
              key={v._id || v.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      {v.registrationNumber}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-2.5">{v.model}</h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      v.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : v.status === 'MAINTENANCE'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Capacity</span>
                    <strong className="text-slate-800 font-bold">{v.capacity} Seats</strong> ({v.type})
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Fuel</span>
                    <strong className="text-slate-800 font-bold">{v.fuelType}</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Odometer</span>
                    <strong className="font-mono text-slate-800">{v.currentOdometer?.toLocaleString()} KM</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Efficiency</span>
                    <strong className="text-slate-800">{v.fuelEfficiencyKmpl} km/l</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Campus Depot</span>
                <button
                  onClick={() => handleToggleMaintenance(v)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                    v.status === 'MAINTENANCE'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  {v.status === 'MAINTENANCE' ? 'Mark Available' : 'Send to Maintenance'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Driver Roster */}
      {activeTab === 'DRIVERS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
          {drivers.map((d) => (
            <div
              key={d._id || d.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{d.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">License: {d.licenseNumber}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    d.status === 'AVAILABLE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {d.status}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <p><strong>License Class:</strong> <span className="font-mono font-bold text-blue-800">{d.licenseCategory}</span></p>
                <p><strong>Contact Phone:</strong> <span className="font-mono">{d.phone}</span></p>
                <p><strong>Experience:</strong> {d.experienceYears} Years • ⭐ {d.rating || 4.8} / 5</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Add Vehicle to BIT Fleet
              </h3>
              <button onClick={() => setShowAddVehicleModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Registration Number *</label>
                <input
                  type="text"
                  required
                  placeholder="TN-37-BT-9999"
                  value={newVehicle.registrationNumber}
                  onChange={(e) => setNewVehicle({ ...newVehicle, registrationNumber: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono uppercase focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Make & Model *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Starbus 50S AC"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Classification</label>
                  <select
                    value={newVehicle.type}
                    onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BUS">Bus</option>
                    <option value="MINI_BUS">Mini Bus</option>
                    <option value="VAN">Van</option>
                    <option value="SUV">SUV</option>
                    <option value="SEDAN">Sedan</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Seating Capacity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newVehicle.capacity}
                    onChange={(e) => setNewVehicle({ ...newVehicle, capacity: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fuel Type</label>
                  <select
                    value={newVehicle.fuelType}
                    onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DIESEL">Diesel</option>
                    <option value="PETROL">Petrol</option>
                    <option value="ELECTRIC">Electric (EV)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Odometer (KM)</label>
                  <input
                    type="number"
                    value={newVehicle.currentOdometer}
                    onChange={(e) => setNewVehicle({ ...newVehicle, currentOdometer: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
      {showAddDriverModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Register Driver in Roster
              </h3>
              <button onClick={() => setShowAddDriverModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDriver} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Driver Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. Kumaravel"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">License Number *</label>
                <input
                  type="text"
                  required
                  placeholder="TN-37-20190001928"
                  value={newDriver.licenseNumber}
                  onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono uppercase focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">License Class</label>
                  <select
                    value={newDriver.licenseCategory}
                    onChange={(e) => setNewDriver({ ...newDriver, licenseCategory: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All (Heavy & Light)</option>
                    <option value="HMV">Heavy Motor Vehicle (HMV/Bus)</option>
                    <option value="LMV">Light Motor Vehicle (LMV/Car)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="9842100000"
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Experience (Years)</label>
                <input
                  type="number"
                  value={newDriver.experienceYears}
                  onChange={(e) => setNewDriver({ ...newDriver, experienceYears: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDriverModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md"
                >
                  Register Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
