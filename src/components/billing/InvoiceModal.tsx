import React, { useState } from 'react';
import { Invoice, InvoiceItem, Patient } from '../../types';
import { useClinic } from '../../context/ClinicContext';
import { standardProcedures } from '../../data/mockData';
import { X, Receipt, Plus, Trash2, Pill, Stethoscope, DollarSign, User } from 'lucide-react';

interface InvoiceModalProps {
  initialPatient?: Patient | null;
  onClose: () => void;
  onSaved?: (invoice: Invoice) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ initialPatient, onClose, onSaved }) => {
  const { patients, inventory, createInvoice, settings } = useClinic();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatient?.id || (patients[0]?.id || ''));
  const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [doctorName, setDoctorName] = useState<string>(settings.doctorName.split(',')[0]);
  
  // Invoice line items
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: `item-${Date.now()}-1`,
      type: 'procedure',
      name: standardProcedures[0].name,
      quantity: 1,
      unitPrice: standardProcedures[0].price,
      totalPrice: standardProcedures[0].price
    }
  ]);

  // Financials
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<Invoice['paymentMode']>('UPI / QR');
  const [notes, setNotes] = useState<string>('');

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // Math
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const taxAmount = (subtotal - discountAmount) * (taxPercent / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount + taxAmount);
  const balanceDue = Math.max(0, grandTotal - amountPaid);
  const paymentStatus: Invoice['paymentStatus'] = balanceDue === 0 ? 'Paid' : amountPaid > 0 ? 'Partial' : 'Unpaid';

  // Add Procedure line
  const handleAddProcedure = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${items.length + 1}`,
      type: 'procedure',
      name: standardProcedures[2].name, // Scaling
      toothNumber: '',
      quantity: 1,
      unitPrice: standardProcedures[2].price,
      totalPrice: standardProcedures[2].price
    };
    setItems([...items, newItem]);
  };

  // Add Medicine from inventory line
  const handleAddMedicine = () => {
    const availableMed = inventory[0];
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${items.length + 1}`,
      type: 'medicine',
      name: availableMed ? availableMed.name : 'Prescription Medicine',
      quantity: 1,
      unitPrice: availableMed ? availableMed.sellingPrice : 100,
      totalPrice: availableMed ? availableMed.sellingPrice : 100,
      inventoryItemId: availableMed ? availableMed.id : undefined
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(i => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(i => {
      if (i.id !== id) return i;
      const updated = { ...i, [field]: value };

      if (field === 'quantity' || field === 'unitPrice') {
        updated.totalPrice = (updated.quantity || 1) * (updated.unitPrice || 0);
      }

      // If medicine selector changed
      if (field === 'inventoryItemId') {
        const med = inventory.find(m => m.id === value);
        if (med) {
          updated.name = med.name;
          updated.unitPrice = med.sellingPrice;
          updated.totalPrice = updated.quantity * med.sellingPrice;
        }
      }

      // If procedure preset changed
      if (field === 'name' && updated.type === 'procedure') {
        const proc = standardProcedures.find(p => p.name === value);
        if (proc) {
          updated.unitPrice = proc.price;
          updated.totalPrice = updated.quantity * proc.price;
        }
      }

      return updated;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const created = createInvoice({
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      phone: selectedPatient.phone,
      doctorName,
      invoiceDate,
      items,
      subtotal,
      discountAmount,
      taxPercent,
      taxAmount,
      grandTotal,
      amountPaid,
      balanceDue,
      paymentMode,
      paymentStatus,
      notes
    }, true);

    if (onSaved) onSaved(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <span>Create Patient Invoice / Bill</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bill dental procedures and dispense medicines with automated stock deduction
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Top Row: Patient & Date & Doctor */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Select Patient
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none bg-white font-medium"
                required
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.patientId})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor</label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Billed Items (Procedures & Dispensed Medicines)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleAddProcedure}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Procedure</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 flex items-center space-x-1"
                >
                  <Pill className="w-3.5 h-3.5" />
                  <span>+ Dispense Medicine</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2.5">
              {items.map((item, idx) => (
                <div 
                  key={item.id} 
                  className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 text-xs shadow-sm"
                >
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className="font-bold text-slate-400">#{idx + 1}</span>
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                      item.type === 'procedure' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.type === 'procedure' ? 'Procedure' : 'Medicine'}
                    </span>
                  </div>

                  {/* Name Selector */}
                  <div className="flex-1 w-full">
                    {item.type === 'procedure' ? (
                      <select
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium outline-none"
                      >
                        {standardProcedures.map(p => (
                          <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    ) : (
                      <select
                        value={item.inventoryItemId || ''}
                        onChange={(e) => handleItemChange(item.id, 'inventoryItemId', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium outline-none"
                      >
                        {inventory.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name} (Stock: {m.stockQuantity} {m.unit})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Tooth Number (for procedures) */}
                  {item.type === 'procedure' && (
                    <div className="w-20 shrink-0">
                      <input
                        type="text"
                        placeholder="Tooth #"
                        value={item.toothNumber || ''}
                        onChange={(e) => handleItemChange(item.id, 'toothNumber', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-center outline-none"
                        title="e.g. 16, 21, 46"
                      />
                    </div>
                  )}

                  {/* Qty */}
                  <div className="w-16 shrink-0">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-center font-semibold outline-none"
                    />
                  </div>

                  {/* Unit Price */}
                  <div className="w-24 shrink-0">
                    <input
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-right font-medium outline-none"
                    />
                  </div>

                  {/* Total */}
                  <div className="w-24 text-right font-bold text-slate-800 shrink-0">
                    {settings.currencySymbol}{item.totalPrice.toLocaleString()}
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={items.length <= 1}
                    className="p-1 text-slate-300 hover:text-rose-500 disabled:opacity-30 shrink-0 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Calculation Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Left: Payment Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Discount Amount ({settings.currencySymbol})</label>
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tax / GST (%)</label>
                  <select
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-none bg-white"
                  >
                    <option value="0">0% (Nil)</option>
                    <option value="5">5% GST</option>
                    <option value="12">12% GST</option>
                    <option value="18">18% GST</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-none bg-white font-medium"
                  >
                    <option value="UPI / QR">UPI / QR (PhonePe/GPay)</option>
                    <option value="Cash">Cash Counter</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Insurance">Insurance TPA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Amount Paid Now ({settings.currencySymbol})</span>
                  <button
                    type="button"
                    onClick={() => setAmountPaid(grandTotal)}
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    Pay Full
                  </button>
                </label>
                <input
                  type="number"
                  min="0"
                  max={grandTotal}
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Right: Totals Breakdown */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2">
              <div className="space-y-1.5 border-b border-slate-100 pb-2">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>{settings.currencySymbol}{subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount:</span>
                    <span>-{settings.currencySymbol}{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {taxAmount > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Tax ({taxPercent}%):</span>
                    <span>+{settings.currencySymbol}{taxAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-base font-bold text-slate-900">
                  <span>Grand Total:</span>
                  <span>{settings.currencySymbol}{grandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold text-emerald-600">
                  <span>Paid Now:</span>
                  <span>{settings.currencySymbol}{amountPaid.toLocaleString()}</span>
                </div>
                <div className={`flex justify-between font-bold ${balanceDue > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                  <span>Balance Due:</span>
                  <span>{settings.currencySymbol}{balanceDue.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                  paymentStatus === 'Partial' ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  Status: {paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>

          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Receipt Remarks / Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid via PhonePe QR at counter. RCT Step 2 scheduled next week."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none"
            />
          </div>

          {/* Action Buttons */}
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
              className="px-6 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/30 transition-all"
            >
              Generate & Save Bill
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
