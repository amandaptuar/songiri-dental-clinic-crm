import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Patient } from '../../types';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  CalendarPlus, 
  Receipt, 
  Eye, 
  AlertTriangle,
  Phone,
  Smile,
  Activity
} from 'lucide-react';

interface PatientListProps {
  onOpenNewPatient: () => void;
  onEditPatient: (p: Patient) => void;
  onViewDetails: (p: Patient) => void;
  onOpenDentalChart: (p: Patient) => void;
  onBookAppointment: (p: Patient) => void;
  onCreateBill: (p: Patient) => void;
}

export const PatientList: React.FC<PatientListProps> = ({
  onOpenNewPatient,
  onEditPatient,
  onViewDetails,
  onOpenDentalChart,
  onBookAppointment,
  onCreateBill
}) => {
  const { patients, deletePatient, searchQuery, setSearchQuery } = useClinic();
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      patient.fullName.toLowerCase().includes(q) ||
      patient.phone.toLowerCase().includes(q) ||
      patient.patientId.toLowerCase().includes(q) ||
      (patient.allergies && patient.allergies.toLowerCase().includes(q));

    const matchesBlood = bloodGroupFilter === 'All' || patient.bloodGroup === bloodGroupFilter;

    return matchesSearch && matchesBlood;
  });

  return (
    <div className="w-full space-y-4">
      
      {/* Top Banner & Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">Patient Entry & Records</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
              {filteredPatients.length} Patients
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage patient registrations, medical histories, tooth charting, and clinical visit files.
          </p>
        </div>

        <button
          onClick={onOpenNewPatient}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-sky-600/30 transition-all hover:shadow-lg"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Register New Patient</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, phone or allergy..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-600">Blood Group:</span>
          <select
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none"
          >
            <option value="All">All Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Patient Profile</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Medical Alert / Allergy</th>
                <th className="py-3.5 px-4">Dental Chart Status</th>
                <th className="py-3.5 px-4">Visits</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  const chartCount = patient.dentalChart?.length || 0;
                  const hasAllergy = Boolean(patient.allergies && patient.allergies.toLowerCase() !== 'none' && patient.allergies.toLowerCase() !== 'none reported');

                  return (
                    <tr 
                      key={patient.id} 
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onViewDetails(patient)}
                    >
                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-100 to-sky-200 text-sky-800 font-bold flex items-center justify-center shrink-0">
                            {patient.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm group-hover:text-sky-600 transition-colors">
                              {patient.fullName}
                            </div>
                            <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-100">
                                {patient.patientId}
                              </span>
                              <span>• {patient.age}y / {patient.gender}</span>
                              <span className="font-semibold text-rose-600">({patient.bloodGroup})</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {patient.phone}
                          </span>
                          {patient.address && (
                            <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                              {patient.address}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Medical Alert */}
                      <td className="py-3 px-4">
                        {hasAllergy ? (
                          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span className="truncate max-w-[170px]">{patient.allergies}</span>
                          </div>
                        ) : patient.medicalHistory ? (
                          <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
                            <span className="truncate max-w-[170px]">{patient.medicalHistory}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No alerts</span>
                        )}
                      </td>

                      {/* Dental Chart */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onOpenDentalChart(patient)}
                          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors font-medium text-[11px]"
                          title="Open Interactive 32-Teeth Chart"
                        >
                          <Smile className="w-3.5 h-3.5 text-sky-600" />
                          <span>{chartCount > 0 ? `${chartCount} Teeth Marked` : 'View Chart'}</span>
                        </button>
                      </td>

                      {/* Visits */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-700">{patient.totalVisits || 1}</span>
                        <span className="text-[11px] text-slate-400 block">
                          Last: {patient.lastVisit || 'Recent'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onBookAppointment(patient)}
                            className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 hover:text-teal-800 transition-colors"
                            title="Book Appointment"
                          >
                            <CalendarPlus className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onCreateBill(patient)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                            title="Generate Bill"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onEditPatient(patient)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            title="Edit Patient"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete patient ${patient.fullName}?`)) {
                                deletePatient(patient.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Delete Patient"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <UserPlus className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No patients found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try a different search query or register a new patient.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
