import React, { useState } from 'react';
import { Users, Plus, Trash2, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

export const PassengerManifestEditor = ({ passengers, setPassengers, expectedCount, department = 'CSE' }) => {
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [newPassenger, setNewPassenger] = useState({
    name: '',
    identifier: '',
    type: 'STUDENT',
    department: department,
    contact: '',
    emergencyContact: ''
  });

  const handleAddSingle = (e) => {
    e.preventDefault();
    if (!newPassenger.name || !newPassenger.identifier) {
      alert('Student/Staff Name and Roll No / ID are required.');
      return;
    }

    setPassengers([...passengers, { ...newPassenger, department }]);
    setNewPassenger({
      name: '',
      identifier: '',
      type: 'STUDENT',
      department: department,
      contact: '',
      emergencyContact: ''
    });
  };

  const handleRemove = (index) => {
    setPassengers(passengers.filter((_, idx) => idx !== index));
  };

  const handleBulkProcess = () => {
    if (!bulkInput.trim()) return;

    // Parse lines: RollNumber, Name, Contact, EmergencyContact
    const lines = bulkInput.split('\n');
    const parsed = [];

    lines.forEach((line) => {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 2 && parts[0] && parts[1]) {
        parsed.push({
          identifier: parts[0],
          name: parts[1],
          type: parts[0].toUpperCase().startsWith('BIT') ? 'FACULTY' : 'STUDENT',
          department: department,
          contact: parts[2] || '',
          emergencyContact: parts[3] || ''
        });
      }
    });

    if (parsed.length > 0) {
      setPassengers([...passengers, ...parsed]);
      setBulkInput('');
      setShowBulkModal(false);
    } else {
      alert('Could not parse entries. Use format: RollNo, Full Name, Contact, Emergency Contact');
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h4 className="font-bold text-slate-800 text-sm">
            Passenger & Field Trip Manifest ({passengers.length} added)
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {expectedCount > 0 && (
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 ${
                passengers.length >= expectedCount
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {passengers.length >= expectedCount ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              {passengers.length} of {expectedCount} required passengers listed
            </span>
          )}

          <button
            type="button"
            onClick={() => setShowBulkModal(true)}
            className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Bulk Paste Manifest
          </button>
        </div>
      </div>

      {/* Inline Quick Add Form */}
      <form onSubmit={handleAddSingle} className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
        <input
          type="text"
          placeholder="Roll No / Staff ID *"
          value={newPassenger.identifier}
          onChange={(e) => setNewPassenger({ ...newPassenger, identifier: e.target.value })}
          className="px-2.5 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 font-medium"
        />
        <input
          type="text"
          placeholder="Passenger Full Name *"
          value={newPassenger.name}
          onChange={(e) => setNewPassenger({ ...newPassenger, name: e.target.value })}
          className="px-2.5 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 font-medium sm:col-span-2"
        />
        <input
          type="text"
          placeholder="Emergency Contact Phone"
          value={newPassenger.emergencyContact}
          onChange={(e) => setNewPassenger({ ...newPassenger, emergencyContact: e.target.value })}
          className="px-2.5 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 font-medium"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-3 py-2 flex items-center justify-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </form>

      {/* Manifest Table */}
      {passengers.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4 bg-white rounded-lg border border-dashed border-slate-200">
          No passengers added yet. Add individual student details or click "Bulk Paste Manifest".
        </p>
      ) : (
        <div className="max-h-52 overflow-y-auto custom-scrollbar border border-slate-200 rounded-lg bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 sticky top-0 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Roll / Emp ID</th>
                <th className="py-2 px-3">Full Name</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Emergency Contact</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {passengers.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2 px-3 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-2 px-3 font-semibold text-slate-900 font-mono">{p.identifier}</td>
                  <td className="py-2 px-3 font-medium">{p.name}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        p.type === 'FACULTY'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {p.type}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-500 font-mono">{p.emergencyContact || '—'}</td>
                  <td className="py-2 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Bulk Paste Student / Passenger List
            </h3>
            <p className="text-xs text-slate-500">
              Paste lines in CSV format (one per line): <br />
              <code className="text-blue-600 font-mono font-semibold">
                RollNumber, Student Name, Contact Phone, Emergency Contact Phone
              </code>
            </p>

            <textarea
              rows={6}
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder="7376221CS101, Kavya S, 9840112233, 9840112230&#10;7376221CS102, Arun Prasath, 9840112234, 9840112231&#10;7376221CS103, Dinesh Kumar, 9840112235, 9840112232"
              className="w-full text-xs font-mono p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none custom-scrollbar"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkProcess}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
              >
                Import Passengers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
