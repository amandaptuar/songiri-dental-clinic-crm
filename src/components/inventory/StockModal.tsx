import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import { useClinic } from '../../context/ClinicContext';
import { X, Pill, DollarSign, Calendar, AlertTriangle } from 'lucide-react';

interface StockModalProps {
  item?: InventoryItem | null;
  onClose: () => void;
}

const categories: InventoryItem['category'][] = [
  'Antibiotics',
  'Analgesics',
  'Anesthetics',
  'Composites',
  'Consumables',
  'Surgical',
  'Impression',
  'Preventive'
];

export const StockModal: React.FC<StockModalProps> = ({ item, onClose }) => {
  const { addInventoryItem, updateInventoryItem, settings } = useClinic();

  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: (item?.category || 'Antibiotics') as InventoryItem['category'],
    batchNo: item?.batchNo || '',
    expiryDate: item?.expiryDate || '',
    stockQuantity: item?.stockQuantity !== undefined ? item.stockQuantity : 20,
    minStockAlert: item?.minStockAlert !== undefined ? item.minStockAlert : 10,
    costPrice: item?.costPrice !== undefined ? item.costPrice : 0,
    sellingPrice: item?.sellingPrice !== undefined ? item.sellingPrice : 0,
    unit: item?.unit || 'Strips',
    manufacturer: item?.manufacturer || ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) errs.name = 'Medicine / Consumable Name is required';
    if (!formData.batchNo.trim()) errs.batchNo = 'Batch number is required';
    if (!formData.expiryDate) errs.expiryDate = 'Expiry date is required';
    if (formData.sellingPrice < 0) errs.sellingPrice = 'Enter valid selling price';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (item) {
      updateInventoryItem({
        ...item,
        ...formData
      });
    } else {
      addInventoryItem(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-amber-600" />
              <span>{item ? 'Update Medicine / Stock Item' : 'Add New Medicine or Consumable'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {item ? `Modifying stock code ${item.itemCode}` : 'Track dental pharmaceuticals, restorative materials, and supplies'}
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
          
          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Item / Medicine Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Amoxicillin + Clavulanate 625mg or Filtek Composite"
                className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                  errors.name ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                } focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none bg-white font-medium"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Batch & Expiry Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Batch Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.batchNo}
                onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                placeholder="e.g. AUG-2024-X"
                className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                  errors.batchNo ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                } focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Expiry Date <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className={`w-full px-3.5 py-2 text-sm rounded-xl border ${
                  errors.expiryDate ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                } focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none font-medium`}
              />
            </div>
          </div>

          {/* Quantities & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Stock Qty</label>
              <input
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Min Reorder Alert</label>
              <input
                type="number"
                min="1"
                value={formData.minStockAlert}
                onChange={(e) => setFormData({ ...formData, minStockAlert: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-rose-600 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unit of Measure</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none bg-white font-medium"
              >
                <option value="Strips">Strips</option>
                <option value="Bottles">Bottles</option>
                <option value="Box">Box</option>
                <option value="Ampoules">Ampoules</option>
                <option value="Syringes">Syringes</option>
                <option value="Packs">Packs</option>
                <option value="Units">Units</option>
              </select>
            </div>
          </div>

          {/* Cost Price & Selling Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Purchase / Cost Price ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Retail / Billed Price ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Manufacturer / Supplier */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Manufacturer / Brand / Supplier
            </label>
            <input
              type="text"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              placeholder="e.g. 3M ESPE, Septodont, GSK, Abbott, Sun Pharma"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
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
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md shadow-amber-600/30 transition-all"
            >
              {item ? 'Save Changes' : 'Add to Medicine Stock'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
