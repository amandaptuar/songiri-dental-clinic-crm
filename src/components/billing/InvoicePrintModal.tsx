import React from 'react';
import { Invoice, Patient } from '../../types';
import { useClinic } from '../../context/ClinicContext';
import { X, Printer, Download, Share2, CheckCircle2 } from 'lucide-react';

interface InvoicePrintModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({ invoice, onClose }) => {
  const { settings, patients } = useClinic();
  const patient = patients.find(p => p.id === invoice.patientId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Bar with Print Controls */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50 no-print">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice Receipt Preview</span>
            <span className="font-mono text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              {invoice.invoiceNo}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div id="printable-invoice" className="p-8 bg-white text-slate-900 text-xs">
          
          {/* Clinic Header */}
          <div className="flex items-start justify-between border-b-2 border-sky-600 pb-5">
            <div className="space-y-1">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-lg">
                  🦷
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {settings.clinicName}
                </h1>
              </div>
              <p className="text-[11px] font-medium text-slate-500">{settings.tagline}</p>
              <p className="text-[11px] text-slate-600 pt-1">
                <strong>{settings.doctorName}</strong> | Reg No: {settings.regNumber}
              </p>
              <p className="text-[10px] text-slate-500 max-w-md">{settings.address}</p>
              <p className="text-[10px] text-slate-500">
                Phone: <strong>{settings.phone}</strong> | Email: {settings.email}
              </p>
            </div>

            <div className="text-right space-y-1">
              <div className="inline-block px-3 py-1 rounded-lg bg-sky-100 text-sky-900 font-bold text-xs uppercase tracking-wider">
                TAX INVOICE / RECEIPT
              </div>
              <p className="text-sm font-bold text-slate-900 mt-2">
                Invoice #: <span className="font-mono text-sky-700">{invoice.invoiceNo}</span>
              </p>
              <p className="text-[11px] text-slate-600">
                Date: <strong>{invoice.invoiceDate}</strong>
              </p>
              {settings.gstin && (
                <p className="text-[10px] text-slate-500">
                  GSTIN: <span className="font-mono">{settings.gstin}</span>
                </p>
              )}
            </div>
          </div>

          {/* Patient Details & Doctor */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Billed To (Patient):
              </span>
              <p className="text-sm font-bold text-slate-900">{invoice.patientName}</p>
              <p className="text-[11px] text-slate-600">
                Patient ID: <strong>{patient?.patientId || 'DEN-PAT'}</strong> • {patient?.age ? `${patient.age}y / ${patient.gender}` : ''}
              </p>
              <p className="text-[11px] text-slate-600">Phone: {invoice.phone}</p>
              {patient?.address && <p className="text-[10px] text-slate-500">{patient.address}</p>}
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Payment Details:
              </span>
              <p className="text-[11px] text-slate-700">
                Mode: <strong className="text-slate-900">{invoice.paymentMode}</strong>
              </p>
              <p className="text-[11px] text-slate-700">
                Status: <strong className={invoice.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}>
                  {invoice.paymentStatus.toUpperCase()}
                </strong>
              </p>
              <p className="text-[11px] text-slate-700">
                Treating Doctor: <strong>{invoice.doctorName}</strong>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Description / Dental Procedure</th>
                  <th className="py-2 px-2 text-center">Tooth #</th>
                  <th className="py-2 px-2 text-center">Qty</th>
                  <th className="py-2 px-2 text-right">Unit Price</th>
                  <th className="py-2 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className="text-xs">
                    <td className="py-2.5 px-2 font-bold text-slate-400">{index + 1}</td>
                    <td className="py-2.5 px-2">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="block text-[10px] text-slate-400 capitalize">
                        {item.type === 'procedure' ? 'Dental Procedure' : 'Pharmacy Dispensed'}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono font-medium text-slate-700">
                      {item.toothNumber ? `#${item.toothNumber}` : '-'}
                    </td>
                    <td className="py-2.5 px-2 text-center font-medium text-slate-700">{item.quantity}</td>
                    <td className="py-2.5 px-2 text-right text-slate-700">
                      {settings.currencySymbol}{item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-slate-900">
                      {settings.currencySymbol}{item.totalPrice.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & QR Code */}
          <div className="border-t-2 border-slate-200 pt-4 grid grid-cols-12 gap-4">
            {/* Left: Notes & UPI QR Box */}
            <div className="col-span-7 space-y-2">
              {invoice.notes && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  <strong>Notes:</strong> {invoice.notes}
                </div>
              )}
              
              {/* Payment QR simulator */}
              <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-50 border border-slate-200 max-w-sm">
                <div className="w-14 h-14 bg-white border border-slate-300 rounded-lg p-1 flex items-center justify-center shrink-0">
                  {/* Stylized QR icon */}
                  <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm10 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm2-2h2v2h-2v-2z" />
                  </svg>
                </div>
                <div className="text-[10px] text-slate-600">
                  <p className="font-bold text-slate-900">Scan & Pay via UPI</p>
                  <p>GPay / PhonePe / Paytm / BHIM</p>
                  <p className="font-mono text-sky-700 mt-0.5">UPI: songiridental@okhdfcbank</p>
                </div>
              </div>

              <p className="text-[9px] text-slate-400">
                * This is a computer generated clinic invoice. Medicines once sold cannot be returned.
              </p>
            </div>

            {/* Right: Numbers */}
            <div className="col-span-5 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{settings.currencySymbol}{invoice.subtotal.toLocaleString()}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount:</span>
                  <span>-{settings.currencySymbol}{invoice.discountAmount.toLocaleString()}</span>
                </div>
              )}
              {invoice.taxAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({invoice.taxPercent}%):</span>
                  <span>+{settings.currencySymbol}{invoice.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-b border-slate-300 py-1.5">
                <span>Grand Total:</span>
                <span>{settings.currencySymbol}{invoice.grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-emerald-700">
                <span>Amount Paid:</span>
                <span>{settings.currencySymbol}{invoice.amountPaid.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between font-bold ${invoice.balanceDue > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                <span>Balance Due:</span>
                <span>{settings.currencySymbol}{invoice.balanceDue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-end justify-between text-[11px]">
            <div>
              <p className="text-slate-400 text-[10px]">Patient / Caregiver Signature</p>
              <div className="w-36 border-b border-slate-300 mt-6" />
            </div>

            <div className="text-right">
              <div className="font-bold text-slate-800">{settings.doctorName.split(',')[0]}</div>
              <p className="text-[10px] text-slate-500">Authorized Signatory / Dental Surgeon</p>
              <div className="w-40 border-b border-slate-300 mt-4 ml-auto" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
