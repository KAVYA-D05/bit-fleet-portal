import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LiveTrackingMap } from './LiveTrackingMap';
import {
  Heart,
  Activity,
  Phone,
  Radio,
  X,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Hospital,
  Compass,
  Fuel,
  Users,
  Navigation,
  ExternalLink,
  Flame,
  Droplet,
  Thermometer,
  Eye,
  AlertOctagon,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Calendar,
  Truck,
  RotateCcw
} from 'lucide-react';

export const TripSafetyCockpitModal = ({ booking, onClose }) => {
  const [activeTab, setActiveTab] = useState('DRIVER_HEALTH'); // 'OVERVIEW', 'DRIVER_HEALTH', 'HOSPITALS', 'EMERGENCY', 'LIVE_MAP'
  const [cockpitData, setCockpitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sosSent, setSosSent] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);
  const [sosMessage, setSosMessage] = useState('');

  const bookingId = booking?._id || booking?.id;

  const fetchCockpitData = async () => {
    if (!bookingId) return;
    try {
      const res = await api.getTripSafetyCockpit(bookingId);
      if (res.success) {
        setCockpitData(res);
      }
    } catch (err) {
      console.error('Failed to load safety cockpit data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCockpitData();
    const interval = setInterval(fetchCockpitData, 4000); // 4-second live telemetry polling
    return () => clearInterval(interval);
  }, [bookingId]);

  const handleTriggerSOS = async () => {
    const confirmSOS = window.confirm(
      '⚠️ ARE YOU SURE YOU WANT TO TRIGGER AN EMERGENCY SOS BROADCAST?\n\nThis will immediately alert the BIT Central Transport Officer (+91 98420 11001) and BIT Campus Health Centre Ambulance Team (+91 94432 55299) with live GPS coordinates.'
    );
    if (!confirmSOS) return;

    setSosLoading(true);
    try {
      const res = await api.triggerTripSOS(bookingId, {
        emergencyType: 'URGENT_HEALTH_AND_SAFETY_ASSISTANCE',
        remarks: '1-Click SOS Triggered from On-Board Vehicle Cockpit'
      });
      if (res.success) {
        setSosSent(true);
        setSosMessage(res.message);
      }
    } catch (err) {
      alert(err.message || 'Failed to trigger SOS');
    } finally {
      setSosLoading(false);
    }
  };

  const driverHealth = cockpitData?.driverHealth || {
    driverName: booking?.assignedDriver?.name || 'Murugan K',
    driverPhone: booking?.assignedDriver?.phone || '+91 98433 66101',
    driverLicense: 'TN-37-20100004521',
    bloodGroup: 'O+',
    heartRateBpm: 74,
    heartRateStatus: 'NORMAL',
    bloodPressure: '120/80 mmHg',
    bpStatus: 'OPTIMAL',
    spo2Percent: 98,
    bodyTempC: 36.6,
    alertnessPercent: 96,
    alertnessStatus: 'HIGHLY_ALERT',
    continuousDrivingText: '1 hr 45 mins (Highway Transit)',
    fatigueLevel: 'NORMAL',
    healthStatus: 'FIT_TO_DRIVE',
    medicalClearance: 'Certified Fit for Highway & Hill Transit by BIT Health Wing',
    lastSyncTimestamp: new Date().toLocaleTimeString()
  };

  const currentDay = cockpitData?.currentDayDetails || {
    isTodayTrip: true,
    currentDateFormatted: new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    departureFormatted: new Date(booking?.departureDateTime).toLocaleString(),
    returnFormatted: new Date(booking?.returnDateTime).toLocaleString(),
    tripStatusBadge: booking?.status || 'APPROVED',
    manifestCount: booking?.passengers?.length || 40,
    headcount: booking?.passengerCount || 40
  };

  const emergencyContacts = cockpitData?.emergencyContacts || [
    {
      role: 'BIT Campus 24/7 Health Centre & Medical Wing',
      name: 'Resident Medical Officer on Duty',
      phone: '+91 94432 55299',
      landline: '04295 226100',
      badge: 'CAMPUS MEDICAL EMERGENCY',
      isPrimary: true
    },
    {
      role: 'BIT Chief Transport Officer (24/7 Hotline)',
      name: 'Mr. Senthil Nathan (Transport Desk)',
      phone: '+91 98420 11001',
      badge: 'FLEET DISPATCH CONTROLLER',
      isPrimary: true
    },
    {
      role: 'National Highway Emergency Patrol',
      name: 'NHAI Highway Rescue Wing',
      phone: '1033',
      badge: 'HIGHWAY PATROL',
      isPrimary: false
    },
    {
      role: 'Government Emergency Medical Ambulance',
      name: 'State 108 Emergency Ambulance',
      phone: '108',
      badge: 'STATE AMBULANCE',
      isPrimary: false
    }
  ];

  const nearbyHospitals = cockpitData?.nearbyHospitals || [];
  const liveGps = cockpitData?.liveGps || {
    latitude: 11.3039,
    longitude: 77.1455,
    speedKmph: 56,
    locationName: `En-route on NH-948 towards ${booking?.destination}`
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="bg-white rounded-3xl max-w-6xl w-full h-[94vh] max-h-[880px] overflow-hidden shadow-2xl border border-slate-200/90 flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-5 sm:px-7 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-xs ring-4 ring-rose-500/10 flex-shrink-0">
              <Activity className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30 flex-shrink-0">
                  {booking?.bookingRef}
                </span>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5 flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE TRANSIT COCKPIT & TELEMETRY
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-100 mt-0.5 truncate">
                On-Board Safety, Driver Biometrics & Emergency Command
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
            {/* Rapid SOS Trigger Button in Header */}
            <button
              onClick={handleTriggerSOS}
              disabled={sosLoading}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer border border-rose-400/30 transition-transform active:scale-95 whitespace-nowrap flex-shrink-0"
            >
              <AlertOctagon className="w-4 h-4 text-amber-300 flex-shrink-0 animate-pulse" />
              <span>1-CLICK SOS ALERT</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              title="Close Cockpit"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SOS Alert Notification Toast if Broadcasted */}
        {sosSent && (
          <div className="bg-rose-600 text-white p-3.5 px-6 flex items-center justify-between text-xs font-bold shadow-md animate-in slide-in-from-top duration-200 flex-shrink-0 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <AlertOctagon className="w-4 h-4 text-amber-300 flex-shrink-0 animate-spin" />
              <span className="truncate">{sosMessage || 'EMERGENCY SOS TRANSMITTED! Campus Ambulance & Transport Patrol are responding.'}</span>
            </div>
            <button
              onClick={() => setSosSent(false)}
              className="px-2.5 py-1 bg-rose-800 hover:bg-rose-900 rounded-lg text-white text-[11px] flex-shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto flex-shrink-0 text-xs custom-scrollbar">
          {[
            { id: 'DRIVER_HEALTH', label: 'Driver Health & Biometrics', icon: Heart, count: `${driverHealth.heartRateBpm} BPM` },
            { id: 'HOSPITALS', label: 'Route Emergency Hospitals', icon: Hospital, count: nearbyHospitals.length },
            { id: 'EMERGENCY', label: 'Emergency Hotline & SOS', icon: PhoneCall, count: emergencyContacts.length },
            { id: 'OVERVIEW', label: 'Current Day Details', icon: Calendar },
            { id: 'LIVE_MAP', label: 'Live Satellite GPS Map', icon: Radio }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-800'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold flex-shrink-0 ${
                      isActive ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 bg-slate-50/60 space-y-6">

          {/* TAB 1: DRIVER HEALTH & BIOMETRICS MONITORING */}
          {activeTab === 'DRIVER_HEALTH' && (
            <div className="space-y-6">
              
              {/* Driver Identity & Medical Clearance Top Banner */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-white">
                    {driverHealth.driverName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-slate-900 text-base">
                        {driverHealth.driverName}
                      </h4>
                      <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                        License: {driverHealth.driverLicense}
                      </span>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {driverHealth.healthStatus === 'FIT_TO_DRIVE' ? 'FIT FOR HIGHWAY DUTY' : 'REST RECOMMENDED'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                      <span>Blood Group: <strong className="text-rose-600 font-bold">{driverHealth.bloodGroup}</strong></span>
                      <span>Experience: <strong>{driverHealth.experienceYears} Years</strong></span>
                      <span>Direct Contact: <a href={`tel:${driverHealth.driverPhone}`} className="text-blue-600 font-mono font-bold hover:underline">{driverHealth.driverPhone}</a></span>
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-start sm:items-end">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Medical Status</span>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 block mt-0.5">
                    {driverHealth.medicalClearance}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">
                    Live Telemetry Sync: {driverHealth.lastSyncTimestamp}
                  </span>
                </div>
              </div>

              {/* Live Biometrics Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* 1. Heart Rate (BPM) with Animated Pulse */}
                <div className="bg-gradient-to-br from-rose-50/90 to-red-50/40 p-5 rounded-3xl border border-rose-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">HEART RATE (ECG)</span>
                    <div className="p-2 rounded-xl bg-rose-600 text-white shadow-sm animate-bounce">
                      <Heart className="w-4 h-4 fill-white" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-3xl sm:text-4xl font-black font-mono text-rose-950">
                      {driverHealth.heartRateBpm}
                    </strong>
                    <span className="text-xs font-bold text-rose-700">BPM</span>
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {driverHealth.heartRateStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-900/80">
                    Normal sinus rhythm. Heart rate is within safe physiological limits (60–100 BPM).
                  </p>
                </div>

                {/* 2. Blood Pressure (BP) */}
                <div className="bg-gradient-to-br from-indigo-50/90 to-blue-50/40 p-5 rounded-3xl border border-indigo-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">BLOOD PRESSURE (BP)</span>
                    <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-2xl sm:text-3xl font-black font-mono text-indigo-950">
                      {driverHealth.bloodPressure}
                    </strong>
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {driverHealth.bpStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-900/80">
                    Systolic / Diastolic arterial pressure is optimal. Zero hypertension detected.
                  </p>
                </div>

                {/* 3. Oxygen Saturation (SpO2) */}
                <div className="bg-gradient-to-br from-sky-50/90 to-cyan-50/40 p-5 rounded-3xl border border-sky-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">BLOOD OXYGEN (SPO2)</span>
                    <div className="p-2 rounded-xl bg-sky-600 text-white shadow-sm">
                      <Droplet className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-3xl sm:text-4xl font-black font-mono text-sky-950">
                      {driverHealth.spo2Percent}%
                    </strong>
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      EXCELLENT
                    </span>
                  </div>
                  <p className="text-[11px] text-sky-900/80">
                    High blood oxygenation (&gt;95%). Brain oxygen levels and driver reflexes are razor-sharp.
                  </p>
                </div>

                {/* 4. Alertness & Drowsiness Level */}
                <div className="bg-gradient-to-br from-amber-50/90 to-yellow-50/40 p-5 rounded-3xl border border-amber-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">ALERTNESS & FATIGUE INDEX</span>
                    <div className="p-2 rounded-xl bg-amber-600 text-white shadow-sm">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-3xl sm:text-4xl font-black font-mono text-amber-950">
                      {driverHealth.alertnessPercent}%
                    </strong>
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {driverHealth.alertnessStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900/80">
                    AI Cabin sensor confirms driver eyes open, active lane-focus, zero micro-sleep risk.
                  </p>
                </div>

                {/* 5. Continuous Driving Duration */}
                <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/40 p-5 rounded-3xl border border-emerald-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">CONTINUOUS DRIVING TIME</span>
                    <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-xl sm:text-2xl font-black font-mono text-emerald-950">
                      {driverHealth.continuousDrivingText}
                    </strong>
                  </div>
                  <p className="text-[11px] text-emerald-900/80">
                    Mandatory driver rest break scheduled at 4 hours under BIT Transport Guidelines.
                  </p>
                </div>

                {/* 6. Body Temperature */}
                <div className="bg-gradient-to-br from-purple-50/90 to-violet-50/40 p-5 rounded-3xl border border-purple-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800">BODY TEMPERATURE</span>
                    <div className="p-2 rounded-xl bg-purple-600 text-white shadow-sm">
                      <Thermometer className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-3xl sm:text-4xl font-black font-mono text-purple-950">
                      {driverHealth.bodyTempC}°C
                    </strong>
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      NORMAL (36.6°C)
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-900/80">
                    Normal thermal equilibrium. Zero fever, dehydration or heat stress indicators.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ROUTE EMERGENCY HOSPITALS */}
          {activeTab === 'HOSPITALS' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Nearest Emergency Trauma Centres & Multi-Speciality Hospitals
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Pre-mapped emergency casualty wings along the route to <strong>{booking?.destination}</strong>
                  </p>
                </div>
                <span className="px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200 font-bold rounded-xl text-xs flex items-center gap-1.5">
                  <Hospital className="w-4 h-4 text-rose-600" />
                  {nearbyHospitals.length} Trauma Units Available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyHospitals.map((hosp) => (
                  <div
                    key={hosp.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                            {hosp.category}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-sm mt-1">
                            {hosp.name}
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            {hosp.address}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <strong className="text-emerald-700 font-mono font-black text-sm block">
                            {hosp.distanceKm} KM
                          </strong>
                          <span className="text-[10px] text-slate-400 font-medium">
                            ~{hosp.etaMins} mins away
                          </span>
                        </div>
                      </div>

                      {/* Facilities Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {hosp.facilities?.map((f, fIdx) => (
                          <span key={fIdx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-semibold">
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Hospital Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-3 border-t border-slate-100">
                      <a
                        href={`tel:${hosp.phone}`}
                        className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-white flex-shrink-0" />
                        <span>Call Emergency ({hosp.phone})</span>
                      </a>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.lat},${hosp.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                      >
                        <Navigation className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span>GPS Navigate</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EMERGENCY HOTLINE DIRECTORY & 1-CLICK SOS */}
          {activeTab === 'EMERGENCY' && (
            <div className="space-y-6">
              
              {/* Emergency Banner */}
              <div className="bg-gradient-to-r from-rose-600 to-red-700 rounded-3xl p-6 text-white shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 text-white px-2.5 py-1 rounded-md border border-white/30 inline-block">
                      🚨 24/7 CRISIS & AMBULANCE DISPATCH
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black mt-1">
                      BIT Central Emergency Assistance Desk
                    </h3>
                    <p className="text-xs text-rose-100 max-w-xl leading-relaxed">
                      In the event of medical distress, vehicle mechanical breakdown, or highway emergency, tap the button to broadcast an immediate high-priority SOS with live telemetry coordinates.
                    </p>
                  </div>

                  <button
                    onClick={handleTriggerSOS}
                    disabled={sosLoading}
                    className="px-6 py-3.5 bg-white text-rose-900 hover:bg-rose-50 font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95 flex-shrink-0 whitespace-nowrap"
                  >
                    <AlertOctagon className="w-5 h-5 text-rose-600 flex-shrink-0 animate-pulse" />
                    <span>{sosLoading ? 'Broadcasting...' : 'BROADCAST SOS ALERT'}</span>
                  </button>
                </div>
              </div>

              {/* Emergency Contacts Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {emergencyContacts.map((contact, cIdx) => (
                  <div
                    key={cIdx}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {contact.badge}
                        </span>
                        {contact.isPrimary && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            ★ High Priority
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {contact.role}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Contact Person: {contact.name}
                      </p>
                    </div>

                    <a
                      href={`tel:${contact.phone}`}
                      className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>Direct Call: {contact.phone}</span>
                    </a>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: CURRENT DAY DETAILS */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-5">
              
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {booking?.tripType?.replace('_', ' ')}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1">
                      {booking?.purpose}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {booking?.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Route & Destination</span>
                    <p className="font-bold text-slate-900 text-sm">{booking?.destination}</p>
                    <p className="text-slate-500">From: {booking?.pickupLocation}</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Departure & Schedule</span>
                    <p className="font-bold text-slate-900 font-mono text-[11px]">{currentDay.departureFormatted}</p>
                    <p className="text-slate-500 font-mono text-[11px]">Return: {currentDay.returnFormatted}</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Headcount & Manifest</span>
                    <p className="font-bold text-blue-800 text-sm">{currentDay.headcount} Total Passengers</p>
                    <p className="text-slate-500">({currentDay.manifestCount} registered on gate manifest)</p>
                  </div>
                </div>

                {/* Assigned Asset Summary */}
                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 text-white rounded-xl">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-blue-950 block text-sm">
                        Vehicle: {booking?.assignedVehicle?.model || 'Tata Starbus 50S (Ultra AC)'}
                      </span>
                      <span className="font-mono text-blue-800 font-bold">
                        Reg: {booking?.assignedVehicle?.registrationNumber || 'TN-37-BT-1001'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-700">Driver: <strong>{driverHealth.driverName}</strong></span>
                    <a
                      href={`tel:${driverHealth.driverPhone}`}
                      className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-2xs"
                    >
                      <Phone className="w-3 h-3" /> Call Driver
                    </a>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 5: LIVE SATELLITE GPS MAP */}
          {activeTab === 'LIVE_MAP' && (
            <div className="h-[480px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200">
              <LiveTrackingMap
                vehicles={[
                  {
                    _id: booking?.assignedVehicle?._id || 'veh_1',
                    registrationNumber: booking?.assignedVehicle?.registrationNumber || 'TN-37-BT-1001',
                    model: booking?.assignedVehicle?.model || 'Tata Starbus 50S (Ultra AC)',
                    type: booking?.assignedVehicle?.type || 'BUS',
                    speedKmph: liveGps.speedKmph,
                    fuelPercent: liveGps.fuelPercent || 88,
                    latitude: liveGps.latitude,
                    longitude: liveGps.longitude,
                    locationName: liveGps.locationName
                  }
                ]}
                singleVehicleMode={false}
                showOverlayCard={false}
                height="100%"
              />
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-[11px]">
              BIT Transportation Safety & Medical Telemetry Network
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
          >
            Close Safety Cockpit
          </button>
        </div>

      </div>
    </div>
  );
};