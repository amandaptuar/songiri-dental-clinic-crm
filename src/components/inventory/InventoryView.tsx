import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { InventoryItem } from '../../types';
import { 
  Pill, 
  PackagePlus, 
  Search, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Filter, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface InventoryViewProps {
  onOpenNewStock: () => void;
  onEditStock: (item: InventoryItem) => void;
  onAdjustStock: (item: InventoryItem) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  onOpenNewStock,
  onEditStock,
  onAdjustStock
}) => {
  const { 
    inventory, 
    deleteInventoryItem, 
    lowStockCount, 
    expiringStockCount, 
    settings,
    searchQuery, 
    setSearchQuery 
  } = useClinic();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [onlyLowStock, setOnlyLowStock] = useState<boolean>(false);
  const [onlyExpiring, setOnlyExpiring] = useState<boolean>(false);

  // Stats
  const totalValuation = inventory.reduce((sum, item) => sum + (item.stockQuantity * item.costPrice), 0);
  const totalRetailValuation = inventory.reduce((sum, item) => sum + (item.stockQuantity * item.sellingPrice), 0);

  // Filter
  const filteredInventory = inventory.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchSearch = 
      item.name.toLowerCase().includes(q) ||
      item.itemCode.toLowerCase().includes(q) ||
      item.batchNo.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.manufacturer && item.manufacturer.toLowerCase().includes(q));

    const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchLow = !onlyLowStock || item.stockQuantity <= item.minStockAlert;

    let matchExpiring = true;
    if (onlyExpiring) {
      const exp = new Date(item.expiryDate).getTime();
      const now = new Date().getTime();
      const diffDays = (exp - now) / (1000 * 3600 * 24);
      matchExpiring = diffDays <= 90;
    }

    return matchSearch && matchCategory && matchLow && matchExpiring;
  });

  const getExpiryStatus = (dateStr: string) => {
    const exp = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((exp - now) / (1000 * 3600 * 24));

    if (diffDays < 0) {
      return { label: `Expired ${Math.abs(diffDays)}d ago`, color: 'bg-rose-100 text-rose-800 border-rose-300 font-bold' };
    } else if (diffDays <= 60) {
      return { label: `Expiring in ${diffDays}d`, color: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold' };
    } else {
      return { label: dateStr, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="w-full space-y-4">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">Medicine & Dental Stock Inventory</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {inventory.length} Stock SKUs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time pharmacy stock tracking, batch numbers, expiry warnings, and instant stock update.
          </p>
        </div>

        <button
          onClick={onOpenNewStock}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-amber-600/30 transition-all hover:shadow-lg"
        >
          <PackagePlus className="w-4 h-4" />
          <span>+ Add Medicine / Stock Item</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Catalog SKUs</span>
            <Pill className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{inventory.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Pharmaceuticals & Consumables</div>
        </div>

        <div 
          onClick={() => {
            setOnlyLowStock(!onlyLowStock);
            setOnlyExpiring(false);
          }}
          className={`p-4 rounded-2xl border shadow-sm cursor-pointer transition-all ${
            onlyLowStock 
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-300' 
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-rose-700">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{lowStockCount}</div>
          <div className="text-[11px] text-rose-500 mt-1">
            {onlyLowStock ? 'Showing low stock items (Click to clear)' : 'Items below reorder level'}
          </div>
        </div>

        <div 
          onClick={() => {
            setOnlyExpiring(!onlyExpiring);
            setOnlyLowStock(false);
          }}
          className={`p-4 rounded-2xl border shadow-sm cursor-pointer transition-all ${
            onlyExpiring 
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300' 
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-amber-700">
            <span>Expiring &lt; 90 Days</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">{expiringStockCount}</div>
          <div className="text-[11px] text-amber-600 mt-1">
            {onlyExpiring ? 'Showing near-expiry (Click to clear)' : 'Batch monitoring alert'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Stock Valuation</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {settings.currencySymbol}{Math.round(totalValuation).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Retail: {settings.currencySymbol}{Math.round(totalRetailValuation).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine name, code, batch or brand..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-600">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Analgesics">Analgesics</option>
              <option value="Anesthetics">Anesthetics</option>
              <option value="Composites">Composites</option>
              <option value="Consumables">Consumables</option>
              <option value="Impression">Impression</option>
              <option value="Surgical">Surgical</option>
              <option value="Preventive">Preventive</option>
            </select>
          </div>

          {(onlyLowStock || onlyExpiring || categoryFilter !== 'All') && (
            <button
              onClick={() => {
                setOnlyLowStock(false);
                setOnlyExpiring(false);
                setCategoryFilter('All');
              }}
              className="text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-xl border border-rose-200 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Item & Category</th>
                <th className="py-3.5 px-4">Batch / Manufacturer</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Unit Pricing</th>
                <th className="py-3.5 px-4 text-right">Quick Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => {
                  const isLow = item.stockQuantity <= item.minStockAlert;
                  const expStatus = getExpiryStatus(item.expiryDate);
                  const stockPercent = Math.min(100, Math.round((item.stockQuantity / (item.minStockAlert * 2)) * 100));

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Category */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-mono font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                            {item.itemCode}
                          </span>
                          <span className="px-2 py-0.5 rounded-full font-medium bg-sky-50 text-sky-700 border border-sky-100">
                            {item.category}
                          </span>
                        </div>
                      </td>

                      {/* Batch & Brand */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-semibold text-slate-700">{item.batchNo}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.manufacturer || 'Standard'}</div>
                      </td>

                      {/* Expiry */}
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] border ${expStatus.color}`}>
                          {expStatus.label}
                        </span>
                      </td>

                      {/* Stock Level Bar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-bold ${isLow ? 'text-rose-600' : 'text-slate-800'}`}>
                            {item.stockQuantity} {item.unit}
                          </span>
                          {isLow && (
                            <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-bold text-[10px] animate-pulse">
                              LOW
                            </span>
                          )}
                        </div>
                        {/* Progress meter */}
                        <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                          <div 
                            className={`h-full rounded-full ${
                              isLow ? 'bg-rose-500' : stockPercent < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.max(8, stockPercent)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          Alert threshold: {item.minStockAlert} {item.unit}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">
                          {settings.currencySymbol}{item.sellingPrice.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Cost: {settings.currencySymbol}{item.costPrice.toLocaleString()}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* 1-Click Adjust Stock */}
                          <button
                            onClick={() => onAdjustStock(item)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-semibold text-xs flex items-center space-x-1 shadow-sm transition-all"
                            title="Quick Stock Update (+ / -)"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                            <span>Update Stock</span>
                          </button>

                          <button
                            onClick={() => onEditStock(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            title="Edit Stock Details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete ${item.name} from inventory?`)) {
                                deleteInventoryItem(item.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Delete Stock Item"
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
                    <Pill className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No stock items match your criteria</p>
                    <p className="text-xs text-slate-400 mt-0.5">Click "+ Add Medicine / Stock Item" to create a new entry.</p>
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
