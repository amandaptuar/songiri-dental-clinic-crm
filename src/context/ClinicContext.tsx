import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Patient, 
  Appointment, 
  InventoryItem, 
  Invoice, 
  ClinicSettings, 
  AppointmentStatus,
  ToothRecord 
} from '../types';
import { 
  initialPatients, 
  initialAppointments, 
  initialInventory, 
  initialInvoices, 
  initialClinicSettings 
} from '../data/mockData';
import { supabase, initSupabaseClient, testSupabaseConnection } from '../lib/supabase';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface ClinicContextType {
  patients: Patient[];
  appointments: Appointment[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  settings: ClinicSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Patient Actions
  addPatient: (patient: Omit<Patient, 'id' | 'patientId' | 'createdAt'>) => Patient;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
  updateDentalChart: (patientId: string, toothNumber: number, condition: ToothRecord['condition'], notes?: string) => void;
  
  // Appointment Actions
  addAppointment: (appointment: Omit<Appointment, 'id' | 'appointmentNo' | 'createdAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  deleteAppointment: (id: string) => void;
  
  // Inventory Actions
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'itemCode' | 'lastUpdated'>) => InventoryItem;
  updateInventoryItem: (item: InventoryItem) => void;
  adjustStockQuantity: (id: string, change: number, reason?: string) => void;
  deleteInventoryItem: (id: string) => void;
  
  // Billing Actions
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNo' | 'createdAt'>, deductStock?: boolean) => Invoice;
  updateInvoicePayment: (id: string, amountPaid: number, notes?: string) => void;
  deleteInvoice: (id: string) => void;
  
  // Settings Actions
  updateSettings: (newSettings: Partial<ClinicSettings>) => void;
  resetToDemo: () => void;
  
  // Supabase Status
  supabaseConnected: boolean;
  isConnectingSupabase: boolean;
  verifySupabase: (url: string, key: string) => Promise<{ success: boolean; message: string }>;
  
  // Notifications / Alerts
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
  lowStockCount: number;
  expiringStockCount: number;
  todayAppointmentsCount: number;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or mock
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('dentacare_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('dentacare_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('dentacare_inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('dentacare_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [settings, setSettings] = useState<ClinicSettings>(() => {
    const saved = localStorage.getItem('dentacare_settings');
    const base = saved ? JSON.parse(saved) : initialClinicSettings;
    const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
    const envKey = (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
    return {
      ...base,
      supabaseUrl: localStorage.getItem('dentacare_supabase_url') || envUrl || base.supabaseUrl || '',
      supabaseAnonKey: localStorage.getItem('dentacare_supabase_anon_key') || envKey || base.supabaseAnonKey || ''
    };
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);
  const [isConnectingSupabase, setIsConnectingSupabase] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Show Toast
  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('dentacare_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('dentacare_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('dentacare_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('dentacare_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('dentacare_settings', JSON.stringify(settings));
  }, [settings]);

  // Initial Supabase health check if credentials provided
  useEffect(() => {
    const checkConn = async () => {
      if (settings.supabaseUrl && settings.supabaseAnonKey && supabase) {
        setIsConnectingSupabase(true);
        const res = await testSupabaseConnection(supabase);
        setSupabaseConnected(res.success);
        setIsConnectingSupabase(false);
      }
    };
    checkConn();
  }, []);

  const verifySupabase = async (url: string, key: string) => {
    setIsConnectingSupabase(true);
    const client = initSupabaseClient(url, key);
    const result = await testSupabaseConnection(client);
    setSupabaseConnected(result.success);
    setIsConnectingSupabase(false);
    if (result.success) {
      setSettings(prev => ({ ...prev, supabaseUrl: url, supabaseAnonKey: key }));
      showToast('Connected to Supabase successfully!', 'success');
    } else {
      showToast(result.message, 'error');
    }
    return result;
  };

  // 1. Patient Actions
  const addPatient = (newPat: Omit<Patient, 'id' | 'patientId' | 'createdAt'>): Patient => {
    const id = `pat-${Date.now()}`;
    const nextNum = patients.length + 1;
    const patientId = `DEN-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`;
    const patient: Patient = {
      ...newPat,
      id,
      patientId,
      createdAt: new Date().toISOString(),
      totalVisits: 1,
      lastVisit: new Date().toISOString().split('T')[0],
      dentalChart: newPat.dentalChart || []
    };
    setPatients(prev => [patient, ...prev]);
    showToast(`Patient ${patient.fullName} (${patient.patientId}) registered successfully!`);
    return patient;
  };

  const updatePatient = (updated: Patient) => {
    setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
    showToast(`Patient ${updated.fullName} details updated!`);
  };

  const deletePatient = (id: string) => {
    const pat = patients.find(p => p.id === id);
    setPatients(prev => prev.filter(p => p.id !== id));
    showToast(`Patient ${pat?.fullName || id} removed.`, 'info');
  };

  const updateDentalChart = (patientId: string, toothNumber: number, condition: ToothRecord['condition'], notes?: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;
      const currentChart = p.dentalChart || [];
      const existingIdx = currentChart.findIndex(t => t.toothNumber === toothNumber);
      let updatedChart: ToothRecord[];
      if (existingIdx >= 0) {
        updatedChart = [...currentChart];
        updatedChart[existingIdx] = {
          toothNumber,
          condition,
          notes: notes !== undefined ? notes : updatedChart[existingIdx].notes,
          updatedAt: new Date().toISOString()
        };
      } else {
        updatedChart = [...currentChart, { toothNumber, condition, notes, updatedAt: new Date().toISOString() }];
      }
      return { ...p, dentalChart: updatedChart };
    }));
    showToast(`Tooth #${toothNumber} condition updated to ${condition}!`);
  };

  // 2. Appointment Actions
  const addAppointment = (newApt: Omit<Appointment, 'id' | 'appointmentNo' | 'createdAt'>): Appointment => {
    const id = `apt-${Date.now()}`;
    const nextNum = appointments.length + 1001;
    const appointmentNo = `APT-${nextNum}`;
    const apt: Appointment = {
      ...newApt,
      id,
      appointmentNo,
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [apt, ...prev]);

    // Also update patient's total visits and last visit date
    setPatients(prev => prev.map(p => {
      if (p.id === newApt.patientId) {
        return {
          ...p,
          totalVisits: (p.totalVisits || 0) + 1,
          lastVisit: newApt.appointmentDate
        };
      }
      return p;
    }));

    showToast(`Appointment ${apt.appointmentNo} booked for ${apt.patientName}!`);
    return apt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    showToast(`Appointment status updated to ${status}.`);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    showToast('Appointment removed.', 'info');
  };

  // 3. Inventory Actions
  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'itemCode' | 'lastUpdated'>): InventoryItem => {
    const id = `inv-${Date.now()}`;
    const codePrefix = item.category.substring(0, 3).toUpperCase();
    const itemCode = `${codePrefix}-${Math.floor(100 + Math.random() * 900)}`;
    const newItem: InventoryItem = {
      ...item,
      id,
      itemCode,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setInventory(prev => [newItem, ...prev]);
    showToast(`Item ${newItem.name} added to stock!`);
    return newItem;
  };

  const updateInventoryItem = (item: InventoryItem) => {
    setInventory(prev => prev.map(i => i.id === item.id ? { ...item, lastUpdated: new Date().toISOString().split('T')[0] } : i));
    showToast(`Stock item ${item.name} updated.`);
  };

  const adjustStockQuantity = (id: string, change: number, reason?: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.stockQuantity + change);
        return {
          ...item,
          stockQuantity: newQty,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
    showToast(`Stock quantity adjusted (${change > 0 ? `+${change}` : change}) ${reason ? `[${reason}]` : ''}`);
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
    showToast('Inventory item deleted.', 'info');
  };

  // 4. Billing Actions
  const createInvoice = (invData: Omit<Invoice, 'id' | 'invoiceNo' | 'createdAt'>, deductStock = true): Invoice => {
    const id = `inv-${Date.now()}`;
    const nextNum = invoices.length + 101;
    const invoiceNo = `INV-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`;
    const invoice: Invoice = {
      ...invData,
      id,
      invoiceNo,
      createdAt: new Date().toISOString()
    };
    setInvoices(prev => [invoice, ...prev]);

    // Automatically deduct stock for any dispensed medicines
    if (deductStock) {
      invData.items.forEach(item => {
        if (item.type === 'medicine' && item.inventoryItemId) {
          adjustStockQuantity(item.inventoryItemId, -item.quantity, `Billed in ${invoiceNo}`);
        }
      });
    }

    showToast(`Invoice ${invoice.invoiceNo} generated for ${invoice.patientName}!`);
    return invoice;
  };

  const updateInvoicePayment = (id: string, amountPaid: number, notes?: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        const totalPaid = Math.min(inv.grandTotal, inv.amountPaid + amountPaid);
        const newBalance = Math.max(0, inv.grandTotal - totalPaid);
        const paymentStatus = newBalance === 0 ? 'Paid' : totalPaid > 0 ? 'Partial' : 'Unpaid';
        return {
          ...inv,
          amountPaid: totalPaid,
          balanceDue: newBalance,
          paymentStatus,
          notes: notes ? `${inv.notes || ''} | ${notes}` : inv.notes
        };
      }
      return inv;
    }));
    showToast(`Payment of ₹${amountPaid} recorded.`);
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
    showToast('Invoice deleted.', 'info');
  };

  // 5. Settings Actions
  const updateSettings = (newSettings: Partial<ClinicSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Clinic settings updated successfully!');
  };

  const resetToDemo = () => {
    setPatients(initialPatients);
    setAppointments(initialAppointments);
    setInventory(initialInventory);
    setInvoices(initialInvoices);
    setSettings(initialClinicSettings);
    localStorage.clear();
    showToast('Reset all data to fresh clinical demo state!', 'info');
  };

  // Derived alert counts
  const lowStockCount = inventory.filter(i => i.stockQuantity <= i.minStockAlert).length;
  const expiringStockCount = inventory.filter(i => {
    const exp = new Date(i.expiryDate).getTime();
    const now = new Date().getTime();
    const diffDays = (exp - now) / (1000 * 3600 * 24);
    return diffDays <= 90; // expiring within 90 days
  }).length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointmentsCount = appointments.filter(a => a.appointmentDate === todayStr).length;

  return (
    <ClinicContext.Provider value={{
      patients,
      appointments,
      inventory,
      invoices,
      settings,
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      addPatient,
      updatePatient,
      deletePatient,
      updateDentalChart,
      addAppointment,
      updateAppointmentStatus,
      deleteAppointment,
      addInventoryItem,
      updateInventoryItem,
      adjustStockQuantity,
      deleteInventoryItem,
      createInvoice,
      updateInvoicePayment,
      deleteInvoice,
      updateSettings,
      resetToDemo,
      supabaseConnected,
      isConnectingSupabase,
      verifySupabase,
      toasts,
      showToast,
      dismissToast,
      lowStockCount,
      expiringStockCount,
      todayAppointmentsCount
    }}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
