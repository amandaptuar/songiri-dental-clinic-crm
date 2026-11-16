import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Settings, 
  Database, 
  Building, 
  Stethoscope, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Download, 
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    supabaseConnected, 
    isConnectingSupabase, 
    verifySupabase, 
    resetToDemo,
    showToast,
    patients,
    appointments,
    inventory,
    invoices 
  } = useClinic();

  const [formData, setFormData] = useState({ ...settings });
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(settings.supabaseUrl || '');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(settings.supabaseAnonKey || '');
  const [copiedSchema, setCopiedSchema] = useState(false);

  const handleSaveClinicProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleTestAndSaveSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifySupabase(supabaseUrlInput, supabaseKeyInput);
  };

  const handleCopySchema = () => {
    const sqlSchema = `-- DENTACARE OS SUPABASE SCHEMA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(20) NOT NULL,
  phone VARCHAR(25) NOT NULL,
  email VARCHAR(100),
  blood_group VARCHAR(10),
  allergies TEXT,
  medical_history TEXT,
  address TEXT,
  emergency_contact VARCHAR(100),
  dental_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  batch_no VARCHAR(50) NOT NULL,
  expiry_date DATE NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  min_stock_alert INT NOT NULL DEFAULT 10,
  cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  unit VARCHAR(50) NOT NULL DEFAULT 'Strips',
  manufacturer VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_no VARCHAR(50) UNIQUE NOT NULL,
  patient_id UUID REFERENCES patients(id),
  patient_name VARCHAR(150) NOT NULL,
  phone VARCHAR(25) NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  doctor_name VARCHAR(100) NOT NULL,
  treatment_type VARCHAR(150) NOT NULL,
  dental_chair VARCHAR(50) DEFAULT 'Chair 1',
  status VARCHAR(50) DEFAULT 'Scheduled',
  notes TEXT
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_no VARCHAR(50) UNIQUE NOT NULL,
  patient_id UUID REFERENCES patients(id),
  patient_name VARCHAR(150) NOT NULL,
  phone VARCHAR(25),
  doctor_name VARCHAR(100) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  tax_percent DECIMAL(5, 2) DEFAULT 0,
  grand_total DECIMAL(10, 2) NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  balance_due DECIMAL(10, 2) NOT NULL,
  payment_mode VARCHAR(50),
  payment_status VARCHAR(50),
  invoice_date DATE NOT NULL
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all_patients" ON patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_inventory" ON inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_appointments" ON appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_invoices" ON invoices FOR ALL USING (true) WITH CHECK (true);`;

    navigator.clipboard.writeText(sqlSchema);
    setCopiedSchema(true);
    showToast('SQL Schema copied to clipboard! Paste it into Supabase SQL editor.');
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  const handleExportBackup = () => {
    const backupData = {
      settings,
      patients,
      appointments,
      inventory,
      invoices,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dentacare-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Clinic database exported successfully!');
  };

  return (
    <div className="w-full space-y-4">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">Settings & Supabase Cloud Database</h1>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              supabaseConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {supabaseConnected ? 'Supabase Connected' : 'Local Storage Fallback Active'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure your clinic profile, print headers, and connect Supabase database for persistent cloud synchronization.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportBackup}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Backup</span>
          </button>
        </div>
      </div>

      {/* Supabase Integration Card */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Supabase PostgreSQL Cloud Database</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  supabaseConnected ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-900'
                }`}>
                  {supabaseConnected ? 'CONNECTED' : 'NOT CONNECTED (USING LOCAL STORE)'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Connect your free Supabase database project for secure multi-device synchronization.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopySchema}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center space-x-1.5 border border-white/20 transition-all shrink-0"
          >
            <Copy className="w-4 h-4" />
            <span>{copiedSchema ? 'SQL Copied!' : 'Copy Supabase SQL Schema'}</span>
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleTestAndSaveSupabase} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={supabaseUrlInput}
                onChange={(e) => setSupabaseUrlInput(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Supabase Anon / Public API Key
              </label>
              <input
                type="password"
                value={supabaseKeyInput}
                onChange={(e) => setSupabaseKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-400">
              * Don't have a Supabase key yet? The system runs in <strong>offline-first local mode</strong> with all data saved automatically!
            </div>

            <button
              type="submit"
              disabled={isConnectingSupabase}
              className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center space-x-1.5 disabled:opacity-50 transition-all"
            >
              {isConnectingSupabase ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Connection...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Connect & Save Supabase</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Clinic Profile Editor */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="pb-3 border-b border-slate-100 flex items-center space-x-2">
          <Building className="w-5 h-5 text-sky-600" />
          <h2 className="text-base font-bold text-slate-900">Clinic Profile & Doctor Information</h2>
        </div>

        <form onSubmit={handleSaveClinicProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Clinic Name</label>
              <input
                type="text"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 outline-none font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline / Speciality</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Chief Doctor Name & Degrees</label>
              <input
                type="text"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Medical Registration Number</label>
              <input
                type="text"
                value={formData.regNumber}
                onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Clinic Phone / Reception</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Clinic Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Address on Invoices</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN (Optional)</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Currency Symbol</label>
                <input
                  type="text"
                  value={formData.currencySymbol}
                  onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Operatory Chairs</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.chairsCount}
                  onChange={(e) => setFormData({ ...formData, chairsCount: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 outline-none font-bold"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all demo data back to clean state?')) {
                  resetToDemo();
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
            >
              Reset to Demo Data
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-md flex items-center space-x-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Clinic Profile</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
