import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { PassengerManifestEditor } from '../components/PassengerManifestEditor';
import { ConflictAlert } from '../components/ConflictAlert';
import { WeatherAdvisoryCard } from '../components/WeatherAdvisoryCard';
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  Sun,
  CloudFog
} from 'lucide-react';

export const NewBooking = ({ onBookingCreated, setActiveTab }) => {
  const { user } = useAuth();

  const getDefaultDates = () => {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(9, 0, 0, 0);

    const end = new Date(start);
    end.setHours(18, 0, 0, 0);

    const formatLocal = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    return {
      departure: formatLocal(start),
      returnTime: formatLocal(end)
    };
  };

  const defaultDates = getDefaultDates();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    tripType: 'FIELD_TRIP',
    purpose: 'Industrial Visit & Technology Exhibition for Final Year Students',
    pickupLocation: 'BIT Main Gate & Admin Porch',
    destination: 'CODISSIA Trade Fair Complex, Coimbatore',
    departureDateTime: defaultDates.departure,
    returnDateTime: defaultDates.returnTime,
    passengerCount: 40,
    preferredVehicleType: 'BUS',
    budgetCode: `BIT-DEPT-${user?.department || 'CSE'}-2026`
  });

  const [passengers, setPassengers] = useState([
    {
      name: user?.name || 'Kavya S',
      identifier: user?.employeeId || '7376221CS101',
      type: 'FACULTY',
      department: user?.department || 'CSE',
      contact: user?.phone || '9840112233',
      emergencyContact: '9840112230'
    }
  ]);

  const [availabilityData, setAvailabilityData] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyAvailability = async () => {
      if (!formData.departureDateTime || !formData.returnDateTime) return;

      const dep = new Date(formData.departureDateTime);
      const ret = new Date(formData.returnDateTime);
      if (dep >= ret) return;

      setCheckingAvailability(true);
      try {
        const res = await api.checkAvailability({
          departureDateTime: formData.departureDateTime,
          returnDateTime: formData.returnDateTime,
          passengerCount: formData.passengerCount,
          preferredVehicleType: formData.preferredVehicleType
        });

        if (res.success) {
          setAvailabilityData(res);
        }
      } catch (err) {
        console.warn('Availability check error:', err);
      } finally {
        setCheckingAvailability(false);
      }
    };

    const timeout = setTimeout(verifyAvailability, 400);
    return () => clearTimeout(timeout);
  }, [formData.departureDateTime, formData.returnDateTime, formData.passengerCount, formData.preferredVehicleType]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError(null);

    if (currentStep === 1) {
      if (!formData.destination || !formData.purpose) {
        setError('Please enter both Destination and Purpose of Travel.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const dep = new Date(formData.departureDateTime);
      const ret = new Date(formData.returnDateTime);

      if (dep >= ret) {
        setError('Departure date and time must be earlier than return date and time.');
        return;
      }
      if (Number(formData.passengerCount) < 1) {
        setError('Passenger count must be at least 1.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        passengers
      };

      const res = await api.createBooking(payload);

      if (res.success) {
        onBookingCreated(res.booking);
        setActiveTab('my-bookings');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit booking request.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Trip & Destination' },
    { num: 2, label: 'Schedule & Sizing' },
    { num: 3, label: 'Passenger Manifest' },
    { num: 4, label: 'Review & Submit' }
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            STAFF / FACULTY REQUISITION WIZARD
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">
            Requisition for Institutional Fleet Vehicle
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Official Visits, Conferences & Student Field Excursions with Passenger Manifests
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full custom-scrollbar">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                currentStep === s.num
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : currentStep > s.num
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span>{s.num}.</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Multi-Step Form Card (Full-Width) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 w-full">
        
        {/* STEP 1: Purpose & Destination */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-blue-600" />
              Step 1: Purpose & Destination Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Trip Category *</label>
                <select
                  value={formData.tripType}
                  onChange={(e) => handleChange('tripType', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="FIELD_TRIP">Field Trip / Student Excursion</option>
                  <option value="INDUSTRIAL_VISIT">Industrial Visit (IV)</option>
                  <option value="OFFICIAL_VISIT">Faculty Official Institutional Visit</option>
                  <option value="CONFERENCE">Conference / Paper Presentation</option>
                  <option value="GUEST_PICKUP">VIP Guest / Resource Person Pickup</option>
                  <option value="RESEARCH_EXPEDITION">Research Expedition / Survey</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Pickup Location on Campus *</label>
                <input
                  type="text"
                  value={formData.pickupLocation}
                  onChange={(e) => handleChange('pickupLocation', e.target.value)}
                  placeholder="e.g. BIT Main Gate, Admin Porch, Guest House"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1.5">Destination Address / Organization *</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => handleChange('destination', e.target.value)}
                  placeholder="e.g. Infosys SEZ Keeranatham / CODISSIA Coimbatore"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1.5">Detailed Purpose of Travel *</label>
                <textarea
                  rows={3}
                  value={formData.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  placeholder="Explain the academic or administrative objective of this trip..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Timings & Sizing + Real-time Conflict Engine */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-4 h-4 text-blue-600" />
              Step 2: Schedule, Sizing & Real-Time Availability Check
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Departure Date & Time *</label>
                <input
                  type="datetime-local"
                  value={formData.departureDateTime}
                  onChange={(e) => handleChange('departureDateTime', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Expected Return Date & Time *</label>
                <input
                  type="datetime-local"
                  value={formData.returnDateTime}
                  onChange={(e) => handleChange('returnDateTime', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Total Passenger Count (Headcount) *</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.passengerCount}
                  onChange={(e) => handleChange('passengerCount', Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Preferred Vehicle Classification</label>
                <select
                  value={formData.preferredVehicleType}
                  onChange={(e) => handleChange('preferredVehicleType', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="ANY">Any Suitable Vehicle (Transport Office Discretion)</option>
                  <option value="BUS">College Bus (40-50 Seater - Field Trips)</option>
                  <option value="MINI_BUS">Mini Bus / Traveller (26 Seater)</option>
                  <option value="VAN">Executive Van / Urbania (16 Seater)</option>
                  <option value="SUV">SUV (Innova / Scorpio - Faculty Visit)</option>
                  <option value="SEDAN">Sedan (Dzire / Tigor EV - 4-5 Seater)</option>
                </select>
              </div>
            </div>

            {/* Travel Date Weather Condition Pop-up Advisory */}
            <div className="pt-2">
              <WeatherAdvisoryCard
                destination={formData.destination}
                departureDateTime={formData.departureDateTime}
              />
            </div>

            {/* Live Conflict & Availability Banner */}
            <div className="pt-1">
              <ConflictAlert availabilityData={availabilityData} loading={checkingAvailability} />
            </div>
          </div>
        )}

        {/* STEP 3: Passenger Manifest */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <Users className="w-4 h-4 text-blue-600" />
              Step 3: Student & Faculty Passenger Manifest
            </h3>

            <PassengerManifestEditor
              passengers={passengers}
              setPassengers={setPassengers}
              expectedCount={formData.passengerCount}
              department={user?.department || 'CSE'}
            />
          </div>
        )}

        {/* STEP 4: Review & Final Submission */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Step 4: Requisition Summary & Institutional Approval Routing
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">APPLICANT FACULTY:</span>
                  <span className="font-bold text-slate-900">{user?.name} ({user?.department})</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">CATEGORY:</span>
                  <span className="font-bold text-slate-900">{formData.tripType?.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">TOTAL PASSENGERS:</span>
                  <span className="font-bold text-blue-800">{formData.passengerCount} Pax ({passengers.length} on Manifest)</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">DESTINATION & ROUTE:</span>
                  <span className="font-bold text-slate-900">{formData.pickupLocation} → {formData.destination}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">VEHICLE CLASS:</span>
                  <span className="font-bold text-slate-900">{formData.preferredVehicleType}</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2.5 font-mono text-[11px] text-slate-600">
                🕒 Departure: {new Date(formData.departureDateTime).toLocaleString()} <br />
                🕒 Return: {new Date(formData.returnDateTime).toLocaleString()}
              </div>

              <div className="border-t border-slate-200 pt-2.5 text-slate-700">
                <strong>Purpose:</strong> {formData.purpose}
              </div>
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
              ℹ️ Upon submission, this request will be routed directly to the <strong>BIT Central Transport Office</strong> for vehicle reservation and driver assignment.
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : <div />}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              Continue to Step {currentStep + 1} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Submitting Request...' : 'Submit Vehicle Requisition'}
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
