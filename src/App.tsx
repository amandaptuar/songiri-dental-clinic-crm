import React, { useState } from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { PatientList } from './components/patients/PatientList';
import { PatientModal } from './components/patients/PatientModal';
import { PatientDetailsModal } from './components/patients/PatientDetailsModal';
import { DentalChartModal } from './components/patients/DentalChartModal';
import { AppointmentsView } from './components/appointments/AppointmentsView';
import { AppointmentModal } from './components/appointments/AppointmentModal';
import { InventoryView } from './components/inventory/InventoryView';
import { StockModal } from './components/inventory/StockModal';
import { StockAdjustModal } from './components/inventory/StockAdjustModal';
import { BillingView } from './components/billing/BillingView';
import { InvoiceModal } from './components/billing/InvoiceModal';
import { InvoicePrintModal } from './components/billing/InvoicePrintModal';
import { SettingsView } from './components/settings/SettingsView';
import { ToastContainer } from './components/common/ToastContainer';
import { Patient, Appointment, InventoryItem, Invoice } from './types';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useClinic();
  const [collapsed, setCollapsed] = useState(false);

  // Modals state
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState<Patient | null>(null);

  const [patientDetailsOpen, setPatientDetailsOpen] = useState(false);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState<Patient | null>(null);

  const [dentalChartOpen, setDentalChartOpen] = useState(false);
  const [selectedPatientForChart, setSelectedPatientForChart] = useState<Patient | null>(null);

  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] = useState<Patient | null>(null);

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedStockForEdit, setSelectedStockForEdit] = useState<InventoryItem | null>(null);

  const [stockAdjustModalOpen, setStockAdjustModalOpen] = useState(false);
  const [selectedStockForAdjust, setSelectedStockForAdjust] = useState<InventoryItem | null>(null);

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedPatientForInvoice, setSelectedPatientForInvoice] = useState<Patient | null>(null);

  const [invoicePrintOpen, setInvoicePrintOpen] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);

  // Handlers
  const handleOpenNewPatient = () => {
    setSelectedPatientForEdit(null);
    setPatientModalOpen(true);
  };

  const handleEditPatient = (p: Patient) => {
    setSelectedPatientForEdit(p);
    setPatientModalOpen(true);
  };

  const handleViewPatientDetails = (p: Patient) => {
    setSelectedPatientForDetails(p);
    setPatientDetailsOpen(true);
  };

  const handleOpenDentalChart = (p: Patient) => {
    setSelectedPatientForChart(p);
    setDentalChartOpen(true);
  };

  const handleBookAppointment = (p?: Patient | null) => {
    setSelectedPatientForAppointment(p || null);
    setAppointmentModalOpen(true);
  };

  const handleOpenNewStock = () => {
    setSelectedStockForEdit(null);
    setStockModalOpen(true);
  };

  const handleEditStock = (item: InventoryItem) => {
    setSelectedStockForEdit(item);
    setStockModalOpen(true);
  };

  const handleAdjustStock = (item: InventoryItem) => {
    setSelectedStockForAdjust(item);
    setStockAdjustModalOpen(true);
  };

  const handleCreateBill = (p?: Patient | null) => {
    setSelectedPatientForInvoice(p || null);
    setInvoiceModalOpen(true);
  };

  const handlePrintInvoice = (inv: Invoice) => {
    setSelectedInvoiceForPrint(inv);
    setInvoicePrintOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Page Content Wrapper with proper left padding to avoid any overflow */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-200 min-w-0 ${
          collapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        {/* Header */}
        <Header
          collapsed={collapsed}
          onOpenNewPatient={handleOpenNewPatient}
          onOpenNewAppointment={() => handleBookAppointment(null)}
          onOpenNewStock={handleOpenNewStock}
          onOpenNewInvoice={() => handleCreateBill(null)}
        />

        {/* Main Content Area */}
        <main className="flex-1 pt-20 pb-8 px-4 md:px-6 w-full min-w-0">
          <div className="w-full min-w-0">
            {activeTab === 'dashboard' && (
              <Dashboard
                onOpenNewPatient={handleOpenNewPatient}
                onOpenNewAppointment={() => handleBookAppointment(null)}
                onOpenNewStock={handleOpenNewStock}
                onOpenNewInvoice={() => handleCreateBill(null)}
                onViewPatient={handleViewPatientDetails}
                onPrintInvoice={handlePrintInvoice}
                onAdjustStock={handleAdjustStock}
              />
            )}

            {activeTab === 'patients' && (
              <PatientList
                onOpenNewPatient={handleOpenNewPatient}
                onEditPatient={handleEditPatient}
                onViewDetails={handleViewPatientDetails}
                onOpenDentalChart={handleOpenDentalChart}
                onBookAppointment={handleBookAppointment}
                onCreateBill={handleCreateBill}
              />
            )}

            {activeTab === 'appointments' && (
              <AppointmentsView
                onOpenNewAppointment={() => handleBookAppointment(null)}
                onCreateBillForPatient={handleCreateBill}
                onViewPatient={handleViewPatientDetails}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryView
                onOpenNewStock={handleOpenNewStock}
                onEditStock={handleEditStock}
                onAdjustStock={handleAdjustStock}
              />
            )}

            {activeTab === 'billing' && (
              <BillingView
                onOpenNewInvoice={() => handleCreateBill(null)}
                onPrintInvoice={handlePrintInvoice}
                onViewPatient={handleViewPatientDetails}
              />
            )}
          </div>
        </main>
      </div>

      {/* MODALS */}
      {patientModalOpen && (
        <PatientModal
          patient={selectedPatientForEdit}
          onClose={() => setPatientModalOpen(false)}
        />
      )}

      {patientDetailsOpen && selectedPatientForDetails && (
        <PatientDetailsModal
          patient={selectedPatientForDetails}
          onClose={() => setPatientDetailsOpen(false)}
          onOpenDentalChart={handleOpenDentalChart}
          onBookAppointment={handleBookAppointment}
          onCreateBill={handleCreateBill}
        />
      )}

      {dentalChartOpen && selectedPatientForChart && (
        <DentalChartModal
          patient={selectedPatientForChart}
          onClose={() => setDentalChartOpen(false)}
        />
      )}

      {appointmentModalOpen && (
        <AppointmentModal
          initialPatient={selectedPatientForAppointment}
          onClose={() => setAppointmentModalOpen(false)}
        />
      )}

      {stockModalOpen && (
        <StockModal
          item={selectedStockForEdit}
          onClose={() => setStockModalOpen(false)}
        />
      )}

      {stockAdjustModalOpen && selectedStockForAdjust && (
        <StockAdjustModal
          item={selectedStockForAdjust}
          onClose={() => setStockAdjustModalOpen(false)}
        />
      )}

      {invoiceModalOpen && (
        <InvoiceModal
          initialPatient={selectedPatientForInvoice}
          onClose={() => setInvoiceModalOpen(false)}
          onSaved={(inv) => handlePrintInvoice(inv)}
        />
      )}

      {invoicePrintOpen && selectedInvoiceForPrint && (
        <InvoicePrintModal
          invoice={selectedInvoiceForPrint}
          onClose={() => setInvoicePrintOpen(false)}
        />
      )}

      {/* Toast alerts */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <ClinicProvider>
      <MainAppContent />
    </ClinicProvider>
  );
}

export default App;
