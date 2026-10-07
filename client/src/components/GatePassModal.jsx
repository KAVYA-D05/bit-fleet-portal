import React from 'react';
import { Printer, X, ShieldCheck, Truck, Users, MapPin, Calendar } from 'lucide-react';

export const GatePassModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl space-y-6 border border-slate-200 print:p-0 print:border-none print:shadow-none">
        
        {/* Modal Action Controls (Hidden when printing) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>Official Gate Pass & Travel Manifest</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="border-2 border-slate-800 p-6 rounded-xl space-y-5 bg-white text-slate-900">
          
          {/* Institutional Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
            <h2 className="text-lg font-black tracking-tight text-slate-950 uppercase">
              Bannari Amman Institute of Technology
            </h2>
            <p className="text-[10px] text-slate-600 font-semibold uppercase">
              An Autonomous Institution • Affiliated to Anna University • Sathyamangalam - 638401
            </p>
            <div className="inline-block bg-slate-900 text-white font-extrabold text-xs px-4 py-1 rounded mt-1 tracking-wider uppercase">
              OFFICIAL VEHICLE MOVEMENT PASS & TRAVEL MANIFEST
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-300">
            <div>
              <span className="text-slate-500 font-semibold block text-[10px]">PASS / BOOKING REF:</span>
              <span className="font-mono font-bold text-blue-800 text-sm">{booking.bookingRef}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[10px]">TRIP CATEGORY:</span>
              <span className="font-bold text-slate-900">{booking.tripType?.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[10px]">STATUS:</span>
              <span className="font-bold text-emerald-700 uppercase">{booking.status}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[10px]">DEPARTMENT & FACULTY:</span>
              <span className="font-bold text-slate-900">
                {booking.faculty?.name} ({booking.department})
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[10px]">FACULTY CONTACT:</span>
              <span className="font-mono font-bold text-slate-800">{booking.faculty?.phone || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[10px]">TOTAL HEADCOUNT:</span>
              <span className="font-bold text-slate-900">{booking.passengerCount} Persons</span>
            </div>
          </div>

          {/* Journey & Vehicle Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="border border-slate-200 p-3 rounded-lg space-y-1">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                <MapPin className="w-3.5 h-3.5 text-rose-600" /> Route & Timing
              </h5>
              <p><strong>Pickup:</strong> {booking.pickupLocation}</p>
              <p><strong>Destination:</strong> {booking.destination}</p>
              <p><strong>Departure:</strong> {new Date(booking.departureDateTime).toLocaleString()}</p>
              <p><strong>Est. Return:</strong> {new Date(booking.returnDateTime).toLocaleString()}</p>
              <p><strong>Purpose:</strong> {booking.purpose}</p>
            </div>

            <div className="border border-slate-200 p-3 rounded-lg space-y-1">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                <Truck className="w-3.5 h-3.5 text-blue-600" /> Assigned Vehicle & Driver
              </h5>
              <p>
                <strong>Vehicle No:</strong>{' '}
                <span className="font-mono font-bold text-indigo-900">
                  {booking.assignedVehicle?.registrationNumber || 'Not Yet Allocated'}
                </span>
              </p>
              <p><strong>Model:</strong> {booking.assignedVehicle?.model || '—'}</p>
              <p><strong>Driver:</strong> {booking.assignedDriver?.name || '—'}</p>
              <p><strong>Driver Phone:</strong> {booking.assignedDriver?.phone || '—'}</p>
              <p><strong>Driver License:</strong> {booking.assignedDriver?.licenseNumber || '—'}</p>
            </div>
          </div>

          {/* Passenger Manifest */}
          <div>
            <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5 mb-1.5">
              <Users className="w-3.5 h-3.5 text-slate-700" /> Passenger Manifest ({booking.passengers?.length || 0} Listed)
            </h5>
            <table className="w-full text-left text-[11px] border border-slate-300">
              <thead className="bg-slate-200 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="py-1 px-2">#</th>
                  <th className="py-1 px-2">Roll / Staff ID</th>
                  <th className="py-1 px-2">Passenger Full Name</th>
                  <th className="py-1 px-2">Type</th>
                  <th className="py-1 px-2">Emergency Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {booking.passengers?.map((p, idx) => (
                  <tr key={idx}>
                    <td className="py-1 px-2 font-mono">{idx + 1}</td>
                    <td className="py-1 px-2 font-mono font-bold">{p.identifier}</td>
                    <td className="py-1 px-2">{p.name}</td>
                    <td className="py-1 px-2">{p.type}</td>
                    <td className="py-1 px-2 font-mono">{p.emergencyContact || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures & Security Sign-off Block */}
          <div className="grid grid-cols-4 gap-2 pt-8 text-[10px] text-center border-t border-slate-300 font-semibold">
            <div>
              <div className="h-8"></div>
              <p className="border-t border-slate-400 pt-1">Faculty In-Charge</p>
            </div>
            <div>
              <div className="h-8"></div>
              <p className="border-t border-slate-400 pt-1">Head of Department</p>
            </div>
            <div>
              <div className="h-8"></div>
              <p className="border-t border-slate-400 pt-1">Transport Officer</p>
            </div>
            <div>
              <div className="h-8"></div>
              <p className="border-t border-slate-400 pt-1">Main Gate Security</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
