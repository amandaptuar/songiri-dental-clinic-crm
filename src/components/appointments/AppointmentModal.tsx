import React, { useState } from 'react';
import { Appointment, Patient } from '../../types';
import { useClinic } from '../../context/ClinicContext';
import { standardProcedures } from '../../data/mockData';
import { X, Calendar, Clock, User, Stethoscope, Armchair } from 'lucide-react';

interface AppointmentModalProps {
  initialPatient?: Patient | null;
  onClose: () => void;
}

const timeSlots = [
  '09:30 AM - 10:00 AM',
  '10:00 AM - 10:30 AM',
  '10:30 AM - 11:15 AM',
  '11:15 AM - 12:00 PM',
  '12:00 PM - 12:45 PM',
  '02:30 PM - 03:15 PM',
  '03:15 PM - 04:00 PM',
  '04:00 PM - 04:45 PM',
  '04:45 PM - 05:30 PM',
  '05:30 PM - 06:15 PM',
  '06:15 PM - 07:00 PM',
  '07:00 PM - 07:45 PM'
];

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ initialPatient, onClose }) => {
  const { patients, addAppointment, settings } = useClinic();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatient?.id || (patients[0]?.id || ''));
  const [appointmentDate, setAppointmentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>(timeSlots[1]);
  const [treatmentType, setTreatmentType] = useState<string>(standardProcedures[0].name);
  const [customTreatment, setCustomTreatment] = useState<string>('');
  const [dentalChair, setDentalChair] = useState<string>('Chair 1 (Main Operatory)');
  const [notes, setNotes] = useState<string>('');
  const [doctorName, setDoctorName] = useState<string>(settings.doctorName.split(',')[0]);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    addAppointment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      phone: selectedPatient.phone,
      appointmentDate,
      timeSlot,
      doctorName,
      treatmentType: customTreatment.trim() ? customTreatment.trim() : treatmentType,
      dentalChair,
      status: 'Scheduled',
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span>Schedule Dental Appointment</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Book a chair slot, assign doctor and reserve operatory
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Patient Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Select Patient
              </span>
              {selectedPatient && (
                <span className="text-sky-600 font-medium">{selectedPatient.phone}</span>
              )}
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none bg-white font-medium text-slate-800"
              required
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.patientId}) - {p.phone}
                </option>
              ))}
            </select>
            {selectedPatient?.allergies && (
              <p className="text-[11px] text-rose-600 font-semibold mt-1">
                ⚠️ Patient Allergy: {selectedPatient.allergies}
              </p>
            )}
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Appointment Date
              </label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none bg-white font-medium"
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dental Chair & Doctor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Armchair className="w-3.5 h-3.5 text-slate-400" /> Dental Chair
              </label>
              <select
                value={dentalChair}
                onChange={(e) => setDentalChair(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none bg-white font-medium"
              >
                <option value="Chair 1 (Main Operatory)">Chair 1 (Main Operatory)</option>
                <option value="Chair 2 (Cosmetic Suite)">Chair 2 (Cosmetic Suite)</option>
                <option value="Chair 3 (Orthodontics & Scan)">Chair 3 (Orthodontics & Scan)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5 text-slate-400" /> Treating Doctor
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none"
              />
            </div>
          </div>

          {/* Procedure / Treatment Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Planned Dental Procedure
            </label>
            <select
              value={treatmentType}
              onChange={(e) => setTreatmentType(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none bg-white font-medium mb-2"
            >
              {standardProcedures.map(p => (
                <option key={p.name} value={p.name}>
                  {p.name} ({settings.currencySymbol}{p.price})
                </option>
              ))}
              <option value="Other">Other / Custom Treatment...</option>
            </select>

            {treatmentType === 'Other' && (
              <input
                type="text"
                value={customTreatment}
                onChange={(e) => setCustomTreatment(e.target.value)}
                placeholder="Type specific dental treatment..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-teal-300 focus:ring-2 focus:ring-teal-100 outline-none mt-1"
                required
              />
            )}
          </div>

          {/* Clinical Prep Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Chairside Instructions / Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Keep local infiltration ready. Patient prefers lower volume suction."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white shadow-md shadow-teal-600/30 transition-all"
            >
              Confirm Appointment
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
