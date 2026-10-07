import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Truck,
  MapPin,
  Navigation,
  Gauge,
  Fuel,
  Radio,
  Clock,
  Compass,
  AlertTriangle,
  Layers,
  ChevronDown,
  ChevronUp,
  Maximize2
} from 'lucide-react';

const BIT_CAMPUS_COORDS = [11.5034, 77.2774];

// Custom HTML Pin Generator for Leaflet
const createVehicleIcon = (vehicle, isSelected) => {
  const isMoving = (vehicle.speedKmph || 0) > 0;
  const color = isMoving ? '#2563eb' : vehicle.status === 'MAINTENANCE' ? '#e11d48' : '#059669';
  const ringColor = isMoving ? 'rgba(37, 99, 235, 0.4)' : 'rgba(5, 150, 105, 0.3)';

  const iconHtml = `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
      ${isMoving ? `<div style="position: absolute; width: 42px; height: 42px; top: -5px; border-radius: 50%; background: ${ringColor}; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
      <div style="
        width: 32px; 
        height: 32px; 
        border-radius: 50%; 
        background: ${color}; 
        border: 2.5px solid #ffffff; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.3); 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: #ffffff; 
        font-weight: bold; 
        font-size: 14px;
        z-index: 10;
        ${isSelected ? 'transform: scale(1.2); border-color: #facc15;' : ''}
      ">
        🚗
      </div>
      <div style="
        margin-top: 2px; 
        background: #0f172a; 
        color: #f8fafc; 
        padding: 2px 6px; 
        border-radius: 5px; 
        font-size: 9px; 
        font-weight: 800; 
        font-family: monospace; 
        white-space: nowrap; 
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        border: 1px solid rgba(255,255,255,0.2);
        z-index: 10;
      ">
        ${vehicle.registrationNumber}
      </div>
      <div style="
        width: 0; 
        height: 0; 
        border-left: 4px solid transparent; 
        border-right: 4px solid transparent; 
        border-top: 5px solid #0f172a; 
        margin-top: -1px;
      "></div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-vehicle-marker',
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

const createCampusIcon = () => {
  const iconHtml = `
    <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
      <div style="width: 36px; height: 36px; border-radius: 10px; background: #1e3a8a; border: 2.5px solid #fbbf24; box-shadow: 0 4px 12px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: #fbbf24; font-size: 16px;">
        🏛️
      </div>
      <div style="margin-top: 2px; background: #1e3a8a; color: #fef08a; padding: 2px 5px; border-radius: 5px; font-size: 9px; font-weight: 900; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.3); border: 1px solid #fbbf24;">
        BIT CAMPUS (HQ)
      </div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-campus-marker',
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

export const LiveTrackingMap = ({
  vehicles = [],
  selectedVehicleId = null,
  onSelectVehicle = () => {},
  singleVehicleMode = false,
  showOverlayCard = false, // Default to clean unobstructed map!
  height = '520px'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const routePolylinesGroupRef = useRef(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isOverlayMinimized, setIsOverlayMinimized] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: BIT_CAMPUS_COORDS,
        zoom: 11,
        zoomControl: false,
        attributionControl: false
      });

      // OpenStreetMap Standard Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Custom Zoom Control top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      routePolylinesGroupRef.current = L.layerGroup().addTo(map);

      // Add BIT Campus HQ Marker
      L.marker(BIT_CAMPUS_COORDS, { icon: createCampusIcon() })
        .bindPopup(`
          <div style="padding: 4px; font-family: sans-serif;">
            <strong style="color: #1e3a8a; font-size: 13px;">Bannari Amman Institute of Technology</strong><br/>
            <span style="font-size: 11px; color: #64748b;">Central Transport Hub & Main Bus Depot</span><br/>
            <span style="font-size: 10px; font-family: monospace; color: #0284c7;">11.5034° N, 77.2774° E • Sathyamangalam</span>
          </div>
        `)
        .addTo(markersGroupRef.current);

      mapInstanceRef.current = map;
    }
  }, []);

  // Update vehicle markers & route lines when data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersGroupRef.current || !routePolylinesGroupRef.current) return;

    markersGroupRef.current.clearLayers();
    routePolylinesGroupRef.current.clearLayers();

    // Re-add BIT Campus HQ Marker
    L.marker(BIT_CAMPUS_COORDS, { icon: createCampusIcon() })
      .bindPopup(`
        <div style="padding: 4px; font-family: sans-serif;">
          <strong style="color: #1e3a8a; font-size: 13px;">Bannari Amman Institute of Technology</strong><br/>
          <span style="font-size: 11px; color: #64748b;">Central Transport Hub & Main Bus Depot</span><br/>
          <span style="font-size: 10px; font-family: monospace; color: #0284c7;">11.5034° N, 77.2774° E • Sathyamangalam</span>
        </div>
      `)
      .addTo(markersGroupRef.current);

    const targetList = singleVehicleMode
      ? vehicles.filter(v => (v._id || v.id) === selectedVehicleId)
      : vehicles;

    const latLngsToFit = [BIT_CAMPUS_COORDS];

    targetList.forEach((v) => {
      if (!v.latitude || !v.longitude) return;

      const isSelected = (v._id || v.id) === selectedVehicleId;
      const marker = L.marker([v.latitude, v.longitude], {
        icon: createVehicleIcon(v, isSelected)
      });

      marker.on('click', () => {
        setSelectedVehicle(v);
        onSelectVehicle(v);
      });

      const popupContent = `
        <div style="padding: 6px; font-family: sans-serif; min-width: 180px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
            <strong style="color: #0f172a; font-size: 13px;">${v.model}</strong>
            <span style="font-size: 10px; font-weight: bold; padding: 2px 5px; border-radius: 4px; background: ${v.speedKmph > 0 ? '#dcfce7; color: #166534;' : '#f1f5f9; color: #475569;'}">${v.speedKmph > 0 ? 'ON ROAD' : 'DEPOT'}</span>
          </div>
          <div style="font-size: 11px; color: #334155; space-y: 2px;">
            <p><strong>Reg:</strong> <span style="font-family: monospace; font-weight: bold; color: #1d4ed8;">${v.registrationNumber}</span> (${v.type})</p>
            <p><strong>Live Speed:</strong> <span style="font-family: monospace; font-weight: bold; color: ${v.speedKmph > 60 ? '#dc2626' : '#059669'};">${v.speedKmph || 0} km/h</span></p>
            <p><strong>Location:</strong> ${v.locationName || 'En-route'}</p>
            ${v.activeBooking ? `<p style="margin-top: 4px; padding-top: 4px; border-top: 1px dashed #cbd5e1; color: #1e3a8a;"><strong>Trip:</strong> ${v.activeBooking.destination} (${v.activeBooking.passengerCount} Pax)</p>` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(markersGroupRef.current);

      latLngsToFit.push([v.latitude, v.longitude]);

      // Draw highway dashed route line from BIT Sathyamangalam
      if (v.activeBooking && v.latitude && v.longitude) {
        const polyline = L.polyline([BIT_CAMPUS_COORDS, [v.latitude, v.longitude]], {
          color: '#2563eb',
          weight: 4,
          opacity: 0.85,
          dashArray: '6, 8',
          lineCap: 'round'
        });
        polyline.addTo(routePolylinesGroupRef.current);
      }
    });

    // Auto-fit bounds so map and route are perfectly framed
    if (selectedVehicleId) {
      const selected = vehicles.find(v => (v._id || v.id) === selectedVehicleId);
      if (selected && selected.latitude && selected.longitude) {
        setSelectedVehicle(selected);
        const bounds = L.latLngBounds([BIT_CAMPUS_COORDS, [selected.latitude, selected.longitude]]);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13, animate: true });
      }
    } else if (latLngsToFit.length > 1) {
      const bounds = L.latLngBounds(latLngsToFit);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [vehicles, selectedVehicleId, singleVehicleMode]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-900 flex flex-col">
      
      {/* Map Canvas (Expands fully with zero clipping) */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-0 flex-1" />

      {/* Floating GPS Telemetry Header */}
      <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md rounded-xl px-3 py-2 shadow-md border border-slate-200/80 flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-2xs">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
        </div>
        <div>
          <h4 className="font-bold text-xs text-slate-900 leading-tight">
            BIT Live Satellite GPS
          </h4>
          <p className="text-[9px] text-slate-500 font-mono">
            HQ: 11.5034° N, 77.2774° E
          </p>
        </div>
      </div>

      {/* Recenter Campus Button */}
      <button
        onClick={() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView(BIT_CAMPUS_COORDS, 11, { animate: true });
            setSelectedVehicle(null);
          }
        }}
        className="absolute top-3 right-14 z-10 px-3 py-1.5 bg-white/95 hover:bg-white text-slate-800 rounded-xl shadow-md border border-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
      >
        <Compass className="w-3.5 h-3.5 text-blue-600" />
        Recenter HQ
      </button>

      {/* Optional In-Map Telemetry Card (Only shown if showOverlayCard is true) */}
      {showOverlayCard && selectedVehicle && (
        <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 text-white backdrop-blur-md rounded-xl p-3 shadow-xl border border-slate-700/80 max-w-xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-bold text-amber-300">
              {selectedVehicle.registrationNumber}
            </span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
              {selectedVehicle.speedKmph || 0} KM/H
            </span>
          </div>
          <p className="text-[11px] text-slate-300 truncate">
            📍 {selectedVehicle.locationName || 'En-route'}
          </p>
        </div>
      )}

    </div>
  );
};
