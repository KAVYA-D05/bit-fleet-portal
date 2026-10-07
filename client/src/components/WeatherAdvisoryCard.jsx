import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Sun,
  CloudRain,
  CloudFog,
  CloudLightning,
  Compass,
  Wind,
  Droplets,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Info,
  X,
  MapPin,
  Calendar,
  ThermometerSun,
  ShieldAlert
} from 'lucide-react';

export const WeatherAdvisoryCard = ({ destination = 'Coimbatore', departureDateTime = null, autoShowModal = false }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      if (!destination || !departureDateTime) return;
      setLoading(true);
      try {
        const res = await api.getWeatherAdvisory(destination, departureDateTime);
        if (res.success && isMounted) {
          setWeatherData(res.weather);
          if (autoShowModal && res.weather.status === 'CAUTION') {
            setShowModal(true);
          }
        }
      } catch (err) {
        console.warn('Failed to load weather advisory:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timeout = setTimeout(fetchWeather, 350);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [destination, departureDateTime]);

  if (loading) {
    return (
      <div className="p-3.5 bg-blue-50/50 border border-blue-200/70 rounded-xl flex items-center gap-3 animate-pulse text-xs text-blue-800">
        <Sun className="w-4 h-4 text-amber-500 animate-spin" />
        <span>Checking meteorological conditions & road visibility for {destination}...</span>
      </div>
    );
  }

  if (!weatherData) return null;

  const isGood = weatherData.status === 'GOOD';

  return (
    <>
      {/* Inline Weather Intelligence Banner */}
      <div
        className={`p-4 rounded-2xl border transition-all text-xs space-y-3 ${
          isGood
            ? 'bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-emerald-50/80 border-emerald-300 text-emerald-950 shadow-2xs'
            : 'bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-50 border-amber-300 text-amber-950 shadow-2xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl text-white shadow-sm flex-shrink-0 ${
                isGood
                  ? 'bg-emerald-600 ring-4 ring-emerald-100'
                  : 'bg-amber-600 ring-4 ring-amber-100 animate-pulse'
              }`}
            >
              {isGood ? <Sun className="w-5 h-5 text-amber-200" /> : <CloudFog className="w-5 h-5 text-amber-100" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isGood
                      ? 'bg-emerald-200 text-emerald-900 border border-emerald-400'
                      : 'bg-amber-200 text-amber-950 border border-amber-400'
                  }`}
                >
                  {isGood ? '☀️ WEATHER: GOOD TO TRAVEL' : '⚠️ WEATHER CAUTION ADVISORY'}
                </span>
                <span className="font-bold text-slate-800 text-xs">
                  {weatherData.tempC}°C • {weatherData.condition}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {weatherData.advisoryDescription}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-transform active:scale-95 flex-shrink-0 cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              isGood
                ? 'bg-white hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-600 hover:bg-amber-700 text-white border-amber-500'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Safety Advisory</span>
          </button>
        </div>

        {/* Live Weather Metrics Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-center">
          <div className="bg-white/80 p-2 rounded-xl border border-slate-200/80">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">RAIN PROBABILITY</span>
            <span className="font-mono font-bold text-slate-800 text-xs">{weatherData.rainProb}%</span>
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-slate-200/80">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">ROAD VISIBILITY</span>
            <span className="font-mono font-bold text-slate-800 text-xs">{weatherData.visibilityKm} KM</span>
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-slate-200/80">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">WIND SPEED</span>
            <span className="font-mono font-bold text-slate-800 text-xs">{weatherData.windKmph} km/h</span>
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-slate-200/80">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">SAFETY INDEX</span>
            <span className={`font-mono font-black text-xs ${isGood ? 'text-emerald-700' : 'text-amber-700'}`}>
              {weatherData.safetyIndex}
            </span>
          </div>
        </div>
      </div>

      {/* Pop-up Weather Advisory & Road Safety Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200/90 space-y-5 animate-in zoom-in-95 duration-150 font-sans">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-2xl text-white shadow-md ${
                    isGood ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}
                >
                  {isGood ? <Sun className="w-6 h-6 text-amber-200" /> : <CloudFog className="w-6 h-6 text-amber-100" />}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    BIT METEOROLOGICAL DISPATCH CO-PILOT
                  </span>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mt-1">
                    Weather Condition: {weatherData.destination}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    📅 Date: {weatherData.formattedDate} ({weatherData.formattedTime})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Highlight Banner */}
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                isGood
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-sm">
                {isGood ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                )}
                <span>{weatherData.advisoryTitle}</span>
              </div>
              <p className="text-xs opacity-90 leading-relaxed">
                {weatherData.advisoryDescription}
              </p>
            </div>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block">TEMPERATURE</span>
                <span className="text-base font-black text-slate-900 font-mono">{weatherData.tempC}°C</span>
                <span className="text-[10px] text-slate-500 block">{weatherData.condition}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block">PRECIPITATION</span>
                <span className="text-base font-black text-blue-700 font-mono">{weatherData.rainProb}%</span>
                <span className="text-[10px] text-slate-500 block">Rain Probability</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block">VISIBILITY</span>
                <span className="text-base font-black text-slate-900 font-mono">{weatherData.visibilityKm} KM</span>
                <span className="text-[10px] text-slate-500 block">Road Clarity</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block">SAFETY INDEX</span>
                <span className={`text-base font-black font-mono ${isGood ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {weatherData.safetyIndex}
                </span>
                <span className="text-[10px] text-slate-500 block">Highway Driving</span>
              </div>
            </div>

            {/* Driver Precautions & Safety Checklist */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Driver & Vehicle Safety Guidelines for this Trip:
              </h4>
              <ul className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-700">
                {weatherData.driverTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                BIT Sathyamangalam Transit Meteorological Desk
              </span>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                Acknowledge & Continue
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};