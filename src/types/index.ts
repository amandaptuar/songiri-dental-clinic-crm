export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';

export type Gender = 'Male' | 'Female' | 'Other';

export interface ToothRecord {
  toothNumber: number; // 11 to 48 (FDI notation)
  condition: 'Healthy' | 'Decayed' | 'Missing' | 'Filled' | 'Crown' | 'Root Canal' | 'Extraction Needed';
  notes?: string;
  updatedAt?: string;
}

export interface Patient {
  id: string;
  patientId: string; // e.g. DEN-2025-001
  fullName: string;
  age: number;
  gender: Gender;
  phone: string;
  email?: string;
  bloodGroup: BloodGroup;
  allergies?: string; // e.g. Penicillin, Sulfa, Latex
  medicalHistory?: string; // e.g. Diabetes, Hypertension, Bleeding Disorder
  address?: string;
  emergencyContact?: string;
  dentalNotes?: string;
  dentalChart?: ToothRecord[];
  createdAt: string;
  totalVisits?: number;
  lastVisit?: string;
}

export type AppointmentStatus = 'Scheduled' | 'Confirmed' | 'In-Chair' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  appointmentNo: string;
  patientId: string;
  patientName: string;
  phone: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. 10:00 AM - 10:30 AM
  doctorName: string;
  treatmentType: string;
  dentalChair: string; // e.g. Chair 1, Chair 2, VIP Suite
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  itemCode: string; // e.g. MED-001
  name: string;
  category: 'Antibiotics' | 'Analgesics' | 'Anesthetics' | 'Composites' | 'Consumables' | 'Surgical' | 'Impression' | 'Preventive';
  batchNo: string;
  expiryDate: string; // YYYY-MM-DD
  stockQuantity: number;
  minStockAlert: number;
  costPrice: number;
  sellingPrice: number;
  unit: string; // Strips, Bottles, Box, Units, Ampoules, Syringes
  manufacturer?: string;
  lastUpdated: string;
}

export interface InvoiceItem {
  id: string;
  type: 'procedure' | 'medicine';
  name: string;
  toothNumber?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  inventoryItemId?: string;
}

export type PaymentMode = 'Cash' | 'UPI / QR' | 'Card' | 'Net Banking' | 'Insurance' | 'Split';
export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid';

export interface Invoice {
  id: string;
  invoiceNo: string; // e.g. INV-2025-001
  patientId: string;
  patientName: string;
  phone: string;
  doctorName: string;
  invoiceDate: string; // YYYY-MM-DD
  items: InvoiceItem[];
  subtotal: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
}

export interface ClinicSettings {
  clinicName: string;
  tagline: string;
  doctorName: string;
  regNumber: string;
  phone: string;
  email: string;
  address: string;
  gstin: string;
  currencySymbol: string;
  chairsCount: number;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}
