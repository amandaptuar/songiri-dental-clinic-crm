import React from 'react';
import { Patient } from '../../types';
import { useClinic } from '../../context/ClinicContext';
import { 
  X, 
  Calendar, 
  Receipt, 
  AlertTriangle, 
  HeartPulse, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2,
  CalendarPlus,
  ReceiptText
} from 'lucide-react';

interface PatientDetailsModalProps {
  patient: Patient;
  onClose: () => void;
  onOpenDentalChart: (p: Patient) => void;
  onBookAppointment: (p: Patient) => void;
  onCreateBill: (p: Patient) => void;
}

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  patient,
  onClose,
  onOpenDentalChart,
  onBookAppointment,
  onCreateBill
}) => {
  const { appointments, invoices, settings } = useClinic();

  const patientAppointments = appointments.filter(a => a.patientId === patient.id);
  const patientInvoices = invoices.filter(i => i.patientId === patient.id);

  const totalSpent = patientInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalBalance = patientInvoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-teal-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
              {patient.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900">{patient.fullName}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  {patient.patientId}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  {patient.bloodGroup}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {patient.age} yrs • {patient.gender} • Registered {new Date(patient.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Medical Alerts Banner */}
          {(patient.allergies || patient.medicalHistory) && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row gap-3">
              {patient.allergies && (
                <div className="flex items-start space-x-2 text-xs text-amber-900 flex-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Drug Allergies:</span> {patient.allergies}
                  </div>
                </div>
              )}
              {patient.medicalHistory && (
                <div className="flex items-start space-x-2 text-xs text-amber-900 flex-1 border-t sm:border-t-0 sm:border-l border-amber-200 pt-2 sm:pt-0 sm:pl-3">
                  <HeartPulse className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Medical History:</span> {patient.medicalHistory}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Visits</span>
              <p className="text-lg font-bold text-slate-800">{patient.totalVisits || patientAppointments.length || 1}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Billed</span>
              <p className="text-lg font-bold text-slate-800">{settings.currencySymbol}{totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Balance Due</span>
              <p className={`text-lg font-bold ${totalBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {settings.currencySymbol}{totalBalance.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Teeth Recorded</span>
              <p className="text-lg font-bold text-sky-600">{patient.dentalChart?.length || 0} / 32</p>
            </div>
          </div>

          {/* Contact Details & Address */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-700">
              <Phone className="w-4 h-4 text-sky-600" />
              <span><strong>Phone:</strong> {patient.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700">
              <Mail className="w-4 h-4 text-teal-600" />
              <span><strong>Email:</strong> {patient.email || 'Not provided'}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span><strong>Address:</strong> {patient.address || 'Not specified'}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span><strong>Emergency:</strong> {patient.emergencyContact || 'None'}</span>
            </div>
          </div>

          {/* Dental Notes / Chief Complaint */}
          {patient.dentalNotes && (
            <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100 text-xs">
              <span className="font-semibold text-sky-950 block mb-1">Clinical Observation / Notes:</span>
              <p className="text-slate-700 leading-relaxed">{patient.dentalNotes}</p>
            </div>
          )}

          {/* Appointments History */}
          <div>
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Appointment History ({patientAppointments.length})</span>
            </h3>
            {patientAppointments.length > 0 ? (
              <div className="space-y-2">
                {patientAppointments.map(apt => (
                  <div key={apt.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{apt.treatmentType}</div>
                      <div className="text-[11px] text-slate-500">{apt.appointmentDate} • {apt.timeSlot} • {apt.dentalChair}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-medium ${
                      apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      apt.status === 'In-Chair' ? 'bg-amber-100 text-amber-800 font-bold' :
                      'bg-sky-100 text-sky-800'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No past appointments recorded.</p>
            )}
          </div>

          {/* Billing & Invoice History */}
          <div>
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Bills & Payments ({patientInvoices.length})
            </h3>
            {patientInvoices.length > 0 ? (
              <div className="space-y-2">
                {patientInvoices.map(inv => (
                  <div key={inv.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{inv.invoiceNo} • {inv.invoiceDate}</div>
                      <div className="text-[11px] text-slate-500">{inv.items.map(i => i.name).join(', ')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{settings.currencySymbol}{inv.grandTotal.toLocaleString()}</div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        inv.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                        inv.paymentStatus === 'Partial' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {inv.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No billing history yet.</p>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={() => {
              onClose();
              onOpenDentalChart(patient);
            }}
            className="px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center space-x-2 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Interactive 32-Teeth Chart</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onBookAppointment(patient);
              }}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5"
            >
              <CalendarPlus className="w-4 h-4 text-teal-600" />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onCreateBill(patient);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm"
            >
              <ReceiptText className="w-4 h-4" />
              <span>Create Bill</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
