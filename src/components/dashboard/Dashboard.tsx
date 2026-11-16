import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Patient, Appointment, Invoice, InventoryItem } from '../../types';
import { 
  Users, 
  Calendar, 
  Pill, 
  Receipt, 
  TrendingUp, 
  AlertTriangle, 
  Armchair, 
  CheckCircle2, 
  UserPlus, 
  CalendarPlus, 
  PackagePlus, 
  Printer, 
  ArrowUpRight, 
  MessageSquare,
  Activity,
  Stethoscope,
  Smile,
  Clock,
  ChevronRight
} from 'lucide-react';

interface DashboardProps {
  onOpenNewPatient: () => void;
  onOpenNewAppointment: () => void;
  onOpenNewStock: () => void;
  onOpenNewInvoice: () => void;
  onViewPatient: (p: Patient) => void;
  onPrintInvoice: (inv: Invoice) => void;
  onAdjustStock: (item: InventoryItem) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenNewPatient,
  onOpenNewAppointment,
  onOpenNewStock,
  onOpenNewInvoice,
  onViewPatient,
  onPrintInvoice,
  onAdjustStock
}) => {
  const { 
    patients, 
    appointments, 
    inventory, 
    invoices, 
    settings, 
    lowStockCount, 
    expiringStockCount, 
    updateAppointmentStatus,
    setActiveTab 
  } = useClinic();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.appointmentDate === todayStr);
  const inChairApt = todayAppointments.find(a => a.status === 'In-Chair');
  const completedToday = todayAppointments.filter(a => a.status === 'Completed').length;

  // Revenue stats
  const todayInvoices = invoices.filter(i => i.invoiceDate === todayStr);
  const todayRevenue = todayInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalCollections = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalPending = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  // Low stock medicines
  const lowStockItems = inventory.filter(i => i.stockQuantity <= i.minStockAlert);

  // WhatsApp helper
  const sendWhatsAppReminder = (apt: Appointment) => {
    const cleanPhone = apt.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${apt.patientName}, this is an appointment reminder from ${settings.clinicName} for ${apt.appointmentDate} at ${apt.timeSlot} with ${apt.doctorName}.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="w-full space-y-4">
      
      {/* 1. Clean Professional Clinic Header & Quick Action Bar */}
      <div className="w-full bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {settings.clinicName}
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Clinic Open
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Doctor: <strong className="text-slate-700">{settings.doctorName.split(',')[0]}</strong></span>
            <span>•</span>
            <span>Today's Date: <strong className="text-slate-700">{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</strong></span>
            <span>•</span>
            <span className="text-sky-700 font-medium">{todayAppointments.length} Appointments Scheduled</span>
          </p>
        </div>

        {/* 4 Direct Clinical Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={onOpenNewPatient}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Patient Entry</span>
          </button>

          <button
            onClick={onOpenNewAppointment}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>+ Book Slot</span>
          </button>

          <button
            onClick={onOpenNewStock}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
          >
            <PackagePlus className="w-4 h-4" />
            <span>+ Stock Update</span>
          </button>

          <button
            onClick={onOpenNewInvoice}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
          >
            <Receipt className="w-4 h-4" />
            <span>+ Create Bill</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 KPI Metrics - High density, full width */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Today's Appointments */}
        <div 
          onClick={() => setActiveTab('appointments')}
          className="bg-white p-4 rounded-xl border border-slate-200 border-l-4 border-l-teal-600 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Today's Appointments</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{todayAppointments.length}</span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {completedToday} Completed
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            {inChairApt ? `In-Chair: ${inChairApt.patientName}` : 'All operatory chairs on schedule'}
          </p>
        </div>

        {/* Card 2: Total Registered Patients */}
        <div 
          onClick={() => setActiveTab('patients')}
          className="bg-white p-4 rounded-xl border border-slate-200 border-l-4 border-l-sky-600 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Patients Registered</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{patients.length}</span>
            <span className="text-xs font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              Active Records
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            With medical alerts & tooth charts
          </p>
        </div>

        {/* Card 3: Medicine Stock Watch */}
        <div 
          onClick={() => setActiveTab('inventory')}
          className={`bg-white p-4 rounded-xl border border-slate-200 border-l-4 ${lowStockCount > 0 ? 'border-l-rose-500' : 'border-l-emerald-600'} shadow-xs hover:border-slate-300 transition-all cursor-pointer`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Medicine Stock Alerts</span>
            <Pill className={`w-4 h-4 ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`} />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {lowStockCount}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded border ${
              lowStockCount > 0 
                ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {lowStockCount > 0 ? 'Low Stock Warning' : 'Normal'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            {inventory.length} SKUs in stock ({expiringStockCount} near expiry)
          </p>
        </div>

        {/* Card 4: Collections & Billing */}
        <div 
          onClick={() => setActiveTab('billing')}
          className="bg-white p-4 rounded-xl border border-slate-200 border-l-4 border-l-emerald-600 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Today's Collections</span>
            <Receipt className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {settings.currencySymbol}{todayRevenue.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {todayInvoices.length} Bills Today
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            Total Collections: {settings.currencySymbol}{totalCollections.toLocaleString()} (Pending: {settings.currencySymbol}{totalPending.toLocaleString()})
          </p>
        </div>
      </div>

      {/* 3. Operatory Chairs Strip - Clean medical software look */}
      <div className="w-full bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Armchair className="w-4 h-4 text-sky-700" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Operatory Dental Chairs
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {settings.chairsCount} Operatory Chairs Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Chair 1 */}
          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/40">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">Chair 1 • Main Operatory</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                OCCUPIED
              </span>
            </div>
            <div className="mt-1.5 text-xs text-slate-700">
              <div className="font-semibold text-slate-900">Rajesh Sharma (DEN-2025-001)</div>
              <div className="text-[11px] text-amber-900">Root Canal Treatment (Step 1)</div>
              <div className="text-[10px] text-slate-500 mt-0.5">10:00 AM Slot • Dr. Amit Songiri</div>
            </div>
          </div>

          {/* Chair 2 */}
          <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/40">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">Chair 2 • Cosmetic Suite</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                READY / NEXT
              </span>
            </div>
            <div className="mt-1.5 text-xs text-slate-700">
              <div className="font-semibold text-slate-900">Pooja Kulkarni (DEN-2025-002)</div>
              <div className="text-[11px] text-emerald-900">In-Office Laser Teeth Whitening</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Confirmed for 11:30 AM</div>
            </div>
          </div>

          {/* Chair 3 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">Chair 3 • Orthodontics & Scan</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
                AVAILABLE
              </span>
            </div>
            <div className="mt-1.5 text-xs text-slate-600">
              <div className="font-medium text-slate-800">Sterilization Completed</div>
              <div className="text-[11px] text-slate-500">Digital 3D Intraoral Scanner Ready</div>
              <div className="text-[10px] text-sky-700 mt-0.5 font-medium">Ready for next walk-in / consult</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Full-Width 2-Column Operational Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column (7 cols): Today's Patient Queue Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">Today's Patient Queue ({todayAppointments.length})</h2>
            </div>
            <button
              onClick={() => setActiveTab('appointments')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3 space-y-2 flex-1 overflow-y-auto">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((apt) => {
                const patientObj = patients.find(p => p.id === apt.patientId);

                return (
                  <div 
                    key={apt.id}
                    className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-center px-2 py-1 bg-slate-100 rounded border border-slate-200 shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 block">TIME</span>
                        <span className="text-xs font-bold text-slate-800">{apt.timeSlot.split(' - ')[0]}</span>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span 
                            onClick={() => patientObj && onViewPatient(patientObj)}
                            className="font-bold text-slate-900 hover:text-sky-700 cursor-pointer"
                          >
                            {apt.patientName}
                          </span>
                          <span className={`px-2 py-0.2 rounded text-[10px] font-semibold border ${
                            apt.status === 'In-Chair' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                            apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {apt.status}
                          </span>
                        </div>

                        <div className="text-[11px] text-teal-800 font-medium mt-0.5">
                          {apt.treatmentType}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {apt.dentalChair} • {apt.doctorName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={() => sendWhatsAppReminder(apt)}
                        className="p-1.5 rounded text-emerald-700 hover:bg-emerald-50 border border-emerald-200"
                        title="Send WhatsApp Reminder"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      {apt.status !== 'In-Chair' && apt.status !== 'Completed' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'In-Chair')}
                          className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] transition-colors"
                        >
                          Seat
                        </button>
                      )}

                      {apt.status === 'In-Chair' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors"
                        >
                          Finish
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No appointments booked for today.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Medicine Stock Watch & Procedures */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Medicine Stock Watch Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Medicine Stock Alerts ({lowStockItems.length})
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('inventory')}
                className="text-xs font-semibold text-amber-700 hover:underline"
              >
                Stock View
              </button>
            </div>

            <div className="space-y-2">
              {lowStockItems.length > 0 ? (
                lowStockItems.map(item => (
                  <div key={item.id} className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/50 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-rose-700">
                        In Stock: <strong>{item.stockQuantity} {item.unit}</strong> (Alert at {item.minStockAlert})
                      </div>
                    </div>
                    <button
                      onClick={() => onAdjustStock(item)}
                      className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold rounded text-[11px] transition-colors"
                    >
                      + Restock
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All medicine stock levels are healthy.</span>
                </div>
              )}
            </div>
          </div>

          {/* Clinical Procedure Volume */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-sky-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Clinical Services Distribution
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">Monthly</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Root Canal Treatment (RCT)</span>
                  <span className="font-bold text-slate-900">38%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: '38%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Full Mouth Scaling & Polishing</span>
                  <span className="font-bold text-slate-900">26%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full" style={{ width: '26%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Crowns & Restorations</span>
                  <span className="font-bold text-slate-900">20%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Tooth Extractions & Implants</span>
                  <span className="font-bold text-slate-900">16%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full" style={{ width: '16%' }} />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 5. Recent Invoices Ledger - Full Width Table */}
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Recent Invoices & Transactions</h2>
          </div>
          <button
            onClick={() => setActiveTab('billing')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
          >
            <span>Billing Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Billed Items</th>
                <th className="py-2.5 px-3">Total Amount</th>
                <th className="py-2.5 px-3">Mode</th>
                <th className="py-2.5 px-3">Payment Status</th>
                <th className="py-2.5 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.slice(0, 5).map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{inv.invoiceNo}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">{inv.patientName}</td>
                  <td className="py-2.5 px-3 text-slate-500">{inv.invoiceDate}</td>
                  <td className="py-2.5 px-3 text-slate-600 truncate max-w-xs">{inv.items.map(i => i.name).join(', ')}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    {settings.currencySymbol}{inv.grandTotal.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{inv.paymentMode}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      inv.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      inv.paymentStatus === 'Partial' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onPrintInvoice(inv)}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
                      title="Print Receipt"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
