import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import { useClinic } from '../../context/ClinicContext';
import { X, Plus, Minus, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';

interface StockAdjustModalProps {
  item: InventoryItem;
  onClose: () => void;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({ item, onClose }) => {
  const { adjustStockQuantity } = useClinic();

  const [mode, setMode] = useState<'add' | 'deduct'>('add');
  const [quantity, setQuantity] = useState<number>(10);
  const [reason, setReason] = useState<string>('Received new stock shipment');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    const delta = mode === 'add' ? quantity : -quantity;
    adjustStockQuantity(item.id, delta, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-600" />
              <span>Quick Medicine Stock Update</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Item: <strong className="text-slate-800">{item.name}</strong>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Current Stock Banner */}
          <div className="p-3 rounded-xl bg-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 font-medium">Batch No:</span>
              <span className="font-bold text-slate-700 ml-1">{item.batchNo}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Current In-Stock:</span>
              <span className="font-bold text-base text-slate-900 ml-1.5">{item.stockQuantity} {item.unit}</span>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('add');
                setReason('Received new stock shipment');
              }}
              className={`py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                mode === 'add' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>+ Stock In (Add)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('deduct');
                setReason('Chairside treatment consumption');
              }}
              className={`py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                mode === 'deduct' 
                  ? 'bg-rose-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>- Stock Out (Remove)</span>
            </button>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity to {mode === 'add' ? 'Add' : 'Deduct'} ({item.unit})
            </label>
            <input
              type="number"
              min="1"
              max={mode === 'deduct' ? item.stockQuantity : 10000}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 text-base font-bold rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-center"
              required
            />
            <p className="text-[11px] text-slate-500 text-center mt-1">
              New stock level will be: <strong className="text-slate-900">
                {mode === 'add' ? item.stockQuantity + quantity : Math.max(0, item.stockQuantity - quantity)} {item.unit}
              </strong>
            </p>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason / Remark
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none bg-white font-medium"
            >
              {mode === 'add' ? (
                <>
                  <option value="Received new stock shipment">Received new stock shipment</option>
                  <option value="Restock from distributor">Restock from distributor</option>
                  <option value="Inventory count correction">Inventory count correction (+)</option>
                  <option value="Sample kit from manufacturer">Sample kit from manufacturer</option>
                </>
              ) : (
                <>
                  <option value="Chairside treatment consumption">Chairside treatment consumption</option>
                  <option value="Expired / Damaged disposal">Expired / Damaged disposal</option>
                  <option value="Inventory audit adjustment">Inventory audit adjustment (-)</option>
                  <option value="Sterilization defect">Sterilization defect</option>
                </>
              )}
            </select>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-md transition-all ${
                mode === 'add' 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Update Stock ({mode === 'add' ? `+${quantity}` : `-${quantity}`})
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
