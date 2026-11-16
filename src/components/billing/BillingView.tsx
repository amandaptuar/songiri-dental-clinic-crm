import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Invoice, Patient } from '../../types';
import { 
  Receipt, 
  Plus, 
  Search, 
  Printer, 
  DollarSign, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Filter,
  ArrowUpRight
} from 'lucide-react';

interface BillingViewProps {
  onOpenNewInvoice: () => void;
  onPrintInvoice: (invoice: Invoice) => void;
  onViewPatient: (patient: Patient) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  onOpenNewInvoice,
  onPrintInvoice,
  onViewPatient
}) => {
  const { invoices, patients, deleteInvoice, updateInvoicePayment, settings, searchQuery, setSearchQuery } = useClinic();
  
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | null>(null);
  const [additionalPayment, setAdditionalPayment] = useState<number>(0);
  const [paymentNote, setPaymentNote] = useState<string>('');

  // Financial KPI totals
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalPending = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  // Filter
  const filteredInvoices = invoices.filter(inv => {
    const q = searchQuery.toLowerCase();
    const matchSearch = 
      inv.invoiceNo.toLowerCase().includes(q) ||
      inv.patientName.toLowerCase().includes(q) ||
      inv.phone.toLowerCase().includes(q) ||
      inv.items.some(item => item.name.toLowerCase().includes(q));

    const matchStatus = statusFilter === 'All' || inv.paymentStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice || additionalPayment <= 0) return;

    updateInvoicePayment(paymentModalInvoice.id, additionalPayment, paymentNote);
    setPaymentModalInvoice(null);
    setAdditionalPayment(0);
    setPaymentNote('');
  };

  return (
    <div className="w-full space-y-4">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">Billing, Invoices & Collections</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {invoices.length} Invoices
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate itemized dental invoices, record cash/UPI payments, and print thermal / A4 receipts.
          </p>
        </div>

        <button
          onClick={onOpenNewInvoice}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/30 transition-all hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Bill</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Invoiced</span>
            <Receipt className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {settings.currencySymbol}{totalInvoiced.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all dental procedures & meds</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
            <span>Collections Received</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            {settings.currencySymbol}{totalCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            Cash, UPI & Card payments deposited
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-rose-700 text-xs font-semibold">
            <span>Pending Receivables</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">
            {settings.currencySymbol}{totalPending.toLocaleString()}
          </div>
          <div className="text-[11px] text-rose-500 mt-1">
            Outstanding balance across patients
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice #, patient, phone or treatment..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-medium text-slate-600">Payment Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none"
          >
            <option value="All">All Invoices</option>
            <option value="Paid">Paid in Full</option>
            <option value="Partial">Partial Payment</option>
            <option value="Unpaid">Unpaid / Due</option>
          </select>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Invoice # & Date</th>
                <th className="py-3.5 px-4">Patient Profile</th>
                <th className="py-3.5 px-4">Billed Items</th>
                <th className="py-3.5 px-4">Amount & Mode</th>
                <th className="py-3.5 px-4">Status & Balance</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => {
                  const patientObj = patients.find(p => p.id === inv.patientId);

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Invoice # & Date */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900 text-sm">{inv.invoiceNo}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{inv.invoiceDate}</div>
                      </td>

                      {/* Patient */}
                      <td className="py-3 px-4">
                        <div 
                          onClick={() => patientObj && onViewPatient(patientObj)}
                          className="font-bold text-slate-900 hover:text-sky-600 cursor-pointer"
                        >
                          {inv.patientName}
                        </div>
                        <div className="text-[11px] text-slate-400">{inv.phone}</div>
                      </td>

                      {/* Billed Items */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="truncate font-medium text-slate-700">
                          {inv.items.map(i => i.name).join(', ')}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {inv.items.length} line {inv.items.length === 1 ? 'item' : 'items'}
                        </div>
                      </td>

                      {/* Financials */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {settings.currencySymbol}{inv.grandTotal.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Mode: <span className="font-medium text-slate-700">{inv.paymentMode}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            inv.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                            inv.paymentStatus === 'Partial' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                            'bg-rose-100 text-rose-800 font-bold'
                          }`}>
                            {inv.paymentStatus}
                          </span>
                        </div>
                        {inv.balanceDue > 0 && (
                          <div className="text-[11px] font-bold text-rose-600 mt-1">
                            Due: {settings.currencySymbol}{inv.balanceDue.toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Record Payment for Partial */}
                          {inv.balanceDue > 0 && (
                            <button
                              onClick={() => {
                                setPaymentModalInvoice(inv);
                                setAdditionalPayment(inv.balanceDue);
                              }}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-[11px] font-semibold flex items-center space-x-1"
                              title="Record Pending Payment"
                            >
                              <span>+ Pay</span>
                            </button>
                          )}

                          {/* Print Invoice */}
                          <button
                            onClick={() => onPrintInvoice(inv)}
                            className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg transition-colors"
                            title="Print / View Receipt"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete invoice ${inv.invoiceNo}?`)) {
                                deleteInvoice(inv.id);
                              }
                            }}
                            className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Invoice"
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
                    <Receipt className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No invoices found</p>
                    <p className="text-xs text-slate-400 mt-1">Click "+ Create New Bill" to generate a patient invoice.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-5 animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-slate-900">Record Balance Payment</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Invoice #{paymentModalInvoice.invoiceNo} • {paymentModalInvoice.patientName}
            </p>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Amount Received ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  min="1"
                  max={paymentModalInvoice.balanceDue}
                  value={additionalPayment}
                  onChange={(e) => setAdditionalPayment(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Remaining balance due will be: {settings.currencySymbol}
                  {Math.max(0, paymentModalInvoice.balanceDue - additionalPayment)}
                </span>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Payment Remarks</label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="e.g. Cleared remaining balance via Cash"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-sm"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
