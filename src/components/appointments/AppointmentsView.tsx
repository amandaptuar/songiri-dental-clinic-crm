import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Appointment, AppointmentStatus, Patient } from '../../types';
import { 
  Calendar, 
  CalendarPlus, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MessageSquare, 
  Armchair, 
  Trash2, 
  Receipt,
  Play,
  RotateCcw
} from 'lucide-react';

interface AppointmentsViewProps {
  onOpenNewAppointment: () => void;
  onCreateBillForPatient: (patient: Patient) => void;
  onViewPatient: (patient: Patient) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  onOpenNewAppointment,
  onCreateBillForPatient,
  onViewPatient
}) => {
  const { appointments, updateAppointmentStatus, deleteAppointment, patients, settings, showToast } = useClinic();
  
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [dateFilter, setDateFilter] = useState<'today' | 'tomorrow' | 'all' | 'custom'>('today');
  const [customDate, setCustomDate] = useState<string>(todayStr);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [chairFilter, setChairFilter] = useState<string>('All');

  // Filter logic
  const filteredAppointments = appointments.filter(apt => {
    let matchDate = true;
    if (dateFilter === 'today') matchDate = apt.appointmentDate === todayStr;
    else if (dateFilter === 'tomorrow') matchDate = apt.appointmentDate === tomorrowStr;
    else if (dateFilter === 'custom') matchDate = apt.appointmentDate === customDate;

    let matchStatus = statusFilter === 'All' || apt.status === statusFilter;
    let matchChair = chairFilter === 'All' || apt.dentalChair.includes(chairFilter);

    return matchDate && matchStatus && matchChair;
  });

  // WhatsApp reminder generator
  const sendWhatsAppReminder = (apt: Appointment) => {
    const cleanPhone = apt.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${apt.patientName}, this is a reminder for your dental appointment at ${settings.clinicName} on ${apt.appointmentDate} at ${apt.timeSlot} with ${apt.doctorName} for ${apt.treatmentType}. Please arrive 5 minutes early. For queries call ${settings.phone}.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    showToast(`WhatsApp reminder opened for ${apt.patientName}!`, 'info');
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'In-Chair':
        return 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse font-bold';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
      case 'Confirmed':
        return 'bg-sky-100 text-sky-800 border-sky-300 font-semibold';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full space-y-4">
      
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">Appointments & Operatory Queue</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
              {filteredAppointments.length} Bookings
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chairside scheduling, live patient queue status, and automatic WhatsApp confirmations.
          </p>
        </div>

        <button
          onClick={onOpenNewAppointment}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-teal-600/30 transition-all hover:shadow-lg"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>+ Book Appointment</span>
        </button>
      </div>

      {/* Operatory Chairs Live Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {['Chair 1 (Main Operatory)', 'Chair 2 (Cosmetic Suite)', 'Chair 3 (Orthodontics & Scan)'].map((chairName, idx) => {
          const currentInChair = appointments.find(
            a => a.appointmentDate === todayStr && a.status === 'In-Chair' && a.dentalChair.includes(`Chair ${idx + 1}`)
          );
          const nextScheduled = appointments.find(
            a => a.appointmentDate === todayStr && a.status === 'Confirmed' && a.dentalChair.includes(`Chair ${idx + 1}`)
          );

          return (
            <div 
              key={chairName}
              className={`p-4 rounded-2xl border transition-all ${
                currentInChair 
                  ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-xl ${currentInChair ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                    <Armchair className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs">Chair #{idx + 1}</h3>
                    <p className="text-[10px] text-slate-400">{chairName.split('(')[1]?.replace(')', '') || 'Operatory'}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  currentInChair 
                    ? 'bg-amber-500 text-white animate-pulse' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {currentInChair ? 'OCCUPIED' : 'READY / IDLE'}
                </span>
              </div>

              {currentInChair ? (
                <div className="mt-2 pt-2 border-t border-amber-200/80 text-xs">
                  <div className="font-semibold text-amber-950 flex items-center justify-between">
                    <span>{currentInChair.patientName}</span>
                    <span className="text-[10px] text-amber-700">{currentInChair.timeSlot}</span>
                  </div>
                  <p className="text-[11px] text-amber-800 truncate mt-0.5">{currentInChair.treatmentType}</p>
                  <button
                    onClick={() => updateAppointmentStatus(currentInChair.id, 'Completed')}
                    className="mt-2 w-full py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                  >
                    Mark Procedure Completed
                  </button>
                </div>
              ) : (
                <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  {nextScheduled ? (
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Next Patient:</span>
                      <div className="font-medium text-slate-700">{nextScheduled.patientName} ({nextScheduled.timeSlot})</div>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">No immediate patient in queue</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Date & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {/* Date Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setDateFilter('today')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              dateFilter === 'today' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateFilter('tomorrow')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              dateFilter === 'tomorrow' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tomorrow
          </button>
          <button
            onClick={() => setDateFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              dateFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setDateFilter('custom')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              dateFilter === 'custom' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pick Date
          </button>
        </div>

        {dateFilter === 'custom' && (
          <input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 font-medium"
          />
        )}

        {/* Chair & Status Selectors */}
        <div className="flex items-center space-x-2">
          <select
            value={chairFilter}
            onChange={(e) => setChairFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none"
          >
            <option value="All">All Chairs</option>
            <option value="Chair 1">Chair 1</option>
            <option value="Chair 2">Chair 2</option>
            <option value="Chair 3">Chair 3</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In-Chair">In-Chair</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => {
            const patientObj = patients.find(p => p.id === apt.patientId);

            return (
              <div 
                key={apt.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Time & Chair & Patient */}
                <div className="flex items-start space-x-3.5">
                  <div className="text-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Time</span>
                    <span className="text-xs font-bold text-slate-800">{apt.timeSlot.split(' - ')[0]}</span>
                    <span className="text-[10px] text-slate-500 block">{apt.appointmentDate}</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span 
                        onClick={() => patientObj && onViewPatient(patientObj)}
                        className="text-sm font-bold text-slate-900 hover:text-teal-600 cursor-pointer"
                      >
                        {apt.patientName}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">({apt.appointmentNo})</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusBadge(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-teal-700 mt-0.5">
                      {apt.treatmentType}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Armchair className="w-3 h-3 text-slate-400" />
                        {apt.dentalChair}
                      </span>
                      <span>• Doctor: {apt.doctorName}</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {apt.phone}
                      </span>
                      {apt.notes && (
                        <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {apt.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Interactive Actions */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* WhatsApp Reminder Button */}
                  <button
                    onClick={() => sendWhatsAppReminder(apt)}
                    className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 border border-emerald-200 text-xs font-medium flex items-center space-x-1"
                    title="Send WhatsApp Reminder"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>

                  {/* Status Toggle Buttons */}
                  {apt.status !== 'In-Chair' && apt.status !== 'Completed' && (
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'In-Chair')}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm flex items-center space-x-1 transition-all"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Seat in Chair</span>
                    </button>
                  )}

                  {apt.status === 'In-Chair' && (
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm flex items-center space-x-1 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Finish Treatment</span>
                    </button>
                  )}

                  {/* Generate Bill Button */}
                  {patientObj && (
                    <button
                      onClick={() => onCreateBillForPatient(patientObj)}
                      className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold flex items-center space-x-1 transition-all"
                      title="Bill Patient"
                    >
                      <Receipt className="w-3.5 h-3.5 text-sky-600" />
                      <span>Create Bill</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm(`Remove appointment for ${apt.patientName}?`)) {
                        deleteAppointment(apt.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Cancel Booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
            <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No appointments scheduled for this selection</p>
            <p className="text-xs text-slate-400 mt-1">Click "+ Book Appointment" above to schedule a chair visit.</p>
          </div>
        )}
      </div>

    </div>
  );
};
