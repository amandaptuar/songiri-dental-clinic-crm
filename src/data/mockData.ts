import { Patient, Appointment, InventoryItem, Invoice, ClinicSettings } from '../types';

export const initialClinicSettings: ClinicSettings = {
  clinicName: 'Songiri Dental Clinic & Implant Center',
  tagline: 'Multi-Speciality Advanced Painless Dentistry & Smile Studio',
  doctorName: 'Dr. Amit Songiri, BDS, MDS (Endodontist & Implantologist)',
  regNumber: 'DENT-REG-84920 / MH-2018',
  phone: '+91 98765 43210',
  email: 'care@songiridental.com',
  address: 'Shop 104-106, Sunrise Healthcare Arcade, Station Road, Pune, Maharashtra 411001',
  gstin: '27AAAAA0000A1Z5',
  currencySymbol: '₹',
  chairsCount: 3,
  supabaseUrl: '',
  supabaseAnonKey: ''
};

export const standardProcedures = [
  { name: 'Comprehensive Dental Consultation & Checkup', price: 500, category: 'Consultation' },
  { name: 'Digital Intraoral X-Ray (RVG per tooth)', price: 300, category: 'Diagnostic' },
  { name: 'Full Mouth Scaling & Polishing (Ultrasonic)', price: 1500, category: 'Preventive' },
  { name: 'Composite Tooth-Colored Filling (Class I/II)', price: 1200, category: 'Restorative' },
  { name: 'Root Canal Treatment (RCT - Anterior)', price: 3500, category: 'Endodontics' },
  { name: 'Root Canal Treatment (RCT - Molar)', price: 4500, category: 'Endodontics' },
  { name: 'Porcelain Fused to Metal (PFM) Crown', price: 4000, category: 'Prosthodontics' },
  { name: 'Full Zirconia Premium Ceramic Crown', price: 7500, category: 'Prosthodontics' },
  { name: 'Simple Tooth Extraction', price: 1000, category: 'Surgery' },
  { name: 'Surgical Impaction / Wisdom Tooth Removal', price: 5500, category: 'Surgery' },
  { name: 'Dental Implant (Titanium with Abutment)', price: 25000, category: 'Implantology' },
  { name: 'In-Office Laser Teeth Whitening (Bleaching)', price: 8000, category: 'Cosmetic' },
  { name: 'Clear Aligner Consultation & 3D Scan', price: 2000, category: 'Orthodontics' },
  { name: 'Periodontal Deep Curettage (Per Quadrant)', price: 2500, category: 'Periodontics' },
  { name: 'Pediatric Pulpectomy & SS Crown', price: 3200, category: 'Pediatric' }
];

export const initialPatients: Patient[] = [
  {
    id: 'p-1',
    patientId: 'DEN-2025-001',
    fullName: 'Rajesh Sharma',
    age: 42,
    gender: 'Male',
    phone: '+91 98234 11223',
    email: 'rajesh.sharma@gmail.com',
    bloodGroup: 'B+',
    allergies: 'Penicillin (Severe Rash)',
    medicalHistory: 'Type 2 Diabetes (HbA1c 6.8), Controlled Hypertension',
    address: 'B-402, Green Glen Residency, Aundh, Pune',
    emergencyContact: 'Sunita Sharma (Wife) - +91 98234 11224',
    dentalNotes: 'Severe pain on lower right first molar (#46). Deep dentinal caries with pulpal involvement.',
    dentalChart: [
      { toothNumber: 46, condition: 'Decayed', notes: 'Deep distal cavity, needs RCT' },
      { toothNumber: 16, condition: 'Filled', notes: 'Composite restoration intact' },
      { toothNumber: 38, condition: 'Missing', notes: 'Extracted in 2021' }
    ],
    createdAt: '2025-01-10T10:30:00Z',
    totalVisits: 3,
    lastVisit: '2025-02-14'
  },
  {
    id: 'p-2',
    patientId: 'DEN-2025-002',
    fullName: 'Pooja Kulkarni',
    age: 29,
    gender: 'Female',
    phone: '+91 97654 88990',
    email: 'pooja.kulkarni@techcorp.in',
    bloodGroup: 'O+',
    allergies: 'None reported',
    medicalHistory: 'No systemic illness',
    address: 'Flat 12, Marvel Blossom, Baner, Pune',
    emergencyContact: 'Rohan Kulkarni (Brother) - +91 97654 88995',
    dentalNotes: 'Desires aesthetic smile correction & teeth whitening before wedding.',
    dentalChart: [
      { toothNumber: 11, condition: 'Healthy' },
      { toothNumber: 21, condition: 'Healthy' },
      { toothNumber: 24, condition: 'Decayed', notes: 'Incipient occlusal pit caries' }
    ],
    createdAt: '2025-01-15T11:00:00Z',
    totalVisits: 2,
    lastVisit: '2025-02-15'
  },
  {
    id: 'p-3',
    patientId: 'DEN-2025-003',
    fullName: 'Vikramaditya Patil',
    age: 55,
    gender: 'Male',
    phone: '+91 94220 54321',
    email: 'vpatil.constructions@gmail.com',
    bloodGroup: 'A+',
    allergies: 'Sulfa Drugs',
    medicalHistory: 'Mild Hypertension (takes Telmisartan 40mg), Smoker (10 yrs)',
    address: 'Plot 88, Model Colony, Shivajinagar, Pune',
    emergencyContact: 'Meena Patil - +91 94220 54322',
    dentalNotes: 'Generalized chronic periodontitis, heavy calculus buildup, mobility Grade 1 on #31, #41.',
    dentalChart: [
      { toothNumber: 31, condition: 'Extraction Needed', notes: 'Grade II mobility' },
      { toothNumber: 41, condition: 'Extraction Needed', notes: 'Severe bone loss' },
      { toothNumber: 36, condition: 'Missing', notes: 'Old extraction space' }
    ],
    createdAt: '2025-01-20T14:15:00Z',
    totalVisits: 4,
    lastVisit: '2025-02-12'
  },
  {
    id: 'p-4',
    patientId: 'DEN-2025-004',
    fullName: 'Ananya Deshmukh',
    age: 19,
    gender: 'Female',
    phone: '+91 99221 67890',
    email: 'ananya.deshmukh@uni.edu',
    bloodGroup: 'AB+',
    allergies: 'Latex allergy',
    medicalHistory: 'None',
    address: 'Saket Hostel, FC Road, Pune',
    emergencyContact: 'Dr. Deshmukh (Father) - +91 99221 67899',
    dentalNotes: 'Orthodontic evaluation. Class II Division 1 malocclusion with crowded upper arch.',
    dentalChart: [
      { toothNumber: 14, condition: 'Healthy' },
      { toothNumber: 24, condition: 'Healthy' }
    ],
    createdAt: '2025-02-01T09:45:00Z',
    totalVisits: 1,
    lastVisit: '2025-02-01'
  },
  {
    id: 'p-5',
    patientId: 'DEN-2025-005',
    fullName: 'Mohammed Farooq',
    age: 36,
    gender: 'Male',
    phone: '+91 98900 12345',
    email: 'farooq.mohd@outlook.com',
    bloodGroup: 'O-',
    allergies: 'None',
    medicalHistory: 'Gastric Acidity',
    address: 'Camp Cantonment, MG Road, Pune',
    emergencyContact: 'Ayesha Farooq - +91 98900 12349',
    dentalNotes: 'Post crown cementation follow-up on tooth #26. Occlusion verified.',
    dentalChart: [
      { toothNumber: 26, condition: 'Crown', notes: 'Zirconia crown seated' }
    ],
    createdAt: '2025-02-05T16:20:00Z',
    totalVisits: 3,
    lastVisit: '2025-02-16'
  }
];

export const initialInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    itemCode: 'MED-AMX-500',
    name: 'Amoxicillin & Potassium Clavulanate (Augmentin 625mg)',
    category: 'Antibiotics',
    batchNo: 'AUG24089',
    expiryDate: '2026-08-30',
    stockQuantity: 45,
    minStockAlert: 20,
    costPrice: 120.00,
    sellingPrice: 185.00,
    unit: 'Strips (10 tabs)',
    manufacturer: 'GSK Pharma',
    lastUpdated: '2025-02-10'
  },
  {
    id: 'inv-2',
    itemCode: 'MED-KTR-10',
    name: 'Ketorolac Tromethamine 10mg (Ketorol-DT)',
    category: 'Analgesics',
    batchNo: 'KT9942',
    expiryDate: '2026-11-15',
    stockQuantity: 8, // LOW STOCK TRIGGER
    minStockAlert: 25,
    costPrice: 42.00,
    sellingPrice: 75.00,
    unit: 'Strips (15 tabs)',
    manufacturer: 'Dr. Reddy Labs',
    lastUpdated: '2025-02-14'
  },
  {
    id: 'inv-3',
    itemCode: 'MED-LIG-2',
    name: 'Lignocaine 2% with Adrenaline (1:80,000) Cartridges',
    category: 'Anesthetics',
    batchNo: 'LG2024-X',
    expiryDate: '2025-04-10', // EXPIRING SOON
    stockQuantity: 14,
    minStockAlert: 20,
    costPrice: 15.00,
    sellingPrice: 35.00,
    unit: 'Ampoules (1.8ml)',
    manufacturer: 'Septodont India',
    lastUpdated: '2025-02-12'
  },
  {
    id: 'inv-4',
    itemCode: 'MAT-CMP-FL',
    name: '3M Filtek Z350 XT Universal Composite Syringe (Shade A2)',
    category: 'Composites',
    batchNo: '3MF-8821',
    expiryDate: '2027-01-30',
    stockQuantity: 6,
    minStockAlert: 5,
    costPrice: 1450.00,
    sellingPrice: 2200.00,
    unit: 'Syringe (4g)',
    manufacturer: '3M ESPE Oral Care',
    lastUpdated: '2025-02-01'
  },
  {
    id: 'inv-5',
    itemCode: 'MED-MET-400',
    name: 'Metronidazole 400mg (Flagyl)',
    category: 'Antibiotics',
    batchNo: 'MET7712',
    expiryDate: '2026-05-20',
    stockQuantity: 50,
    minStockAlert: 15,
    costPrice: 22.00,
    sellingPrice: 40.00,
    unit: 'Strips (15 tabs)',
    manufacturer: 'Abbott Healthcare',
    lastUpdated: '2025-01-25'
  },
  {
    id: 'inv-6',
    itemCode: 'MED-CHX-02',
    name: 'Chlorhexidine Gluconate 0.2% Antiseptic Mouthwash (Hexidine)',
    category: 'Preventive',
    batchNo: 'HEX-4091',
    expiryDate: '2026-09-30',
    stockQuantity: 28,
    minStockAlert: 10,
    costPrice: 85.00,
    sellingPrice: 135.00,
    unit: 'Bottles (160ml)',
    manufacturer: 'ICPA Health',
    lastUpdated: '2025-02-08'
  },
  {
    id: 'inv-7',
    itemCode: 'CON-NDL-30G',
    name: 'Dispovan Dental Needles 30G Short (Disposable)',
    category: 'Consumables',
    batchNo: 'HMD-99120',
    expiryDate: '2028-06-30',
    stockQuantity: 5, // LOW STOCK TRIGGER
    minStockAlert: 20,
    costPrice: 220.00,
    sellingPrice: 350.00,
    unit: 'Box (100 pcs)',
    manufacturer: 'HMD India',
    lastUpdated: '2025-02-15'
  },
  {
    id: 'inv-8',
    itemCode: 'MAT-ALGIN',
    name: 'Zhermack Tropicalgin High Precision Dental Alginate',
    category: 'Impression',
    batchNo: 'ZH-AL221',
    expiryDate: '2026-10-15',
    stockQuantity: 12,
    minStockAlert: 4,
    costPrice: 380.00,
    sellingPrice: 600.00,
    unit: 'Packs (453g)',
    manufacturer: 'Zhermack Dental',
    lastUpdated: '2025-01-30'
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-1',
    appointmentNo: 'APT-1001',
    patientId: 'p-1',
    patientName: 'Rajesh Sharma',
    phone: '+91 98234 11223',
    appointmentDate: new Date().toISOString().split('T')[0], // Today
    timeSlot: '10:00 AM - 10:45 AM',
    doctorName: 'Dr. Amit Songiri',
    treatmentType: 'Root Canal Treatment (Step 1 - Biomechanical Prep)',
    dentalChair: 'Chair 1 (Main Operatory)',
    status: 'In-Chair',
    notes: 'Penicillin allergy noted. Patient given local anesthesia.',
    createdAt: '2025-02-15T09:00:00Z'
  },
  {
    id: 'apt-2',
    appointmentNo: 'APT-1002',
    patientId: 'p-2',
    patientName: 'Pooja Kulkarni',
    phone: '+91 97654 88990',
    appointmentDate: new Date().toISOString().split('T')[0], // Today
    timeSlot: '11:30 AM - 12:15 PM',
    doctorName: 'Dr. Amit Songiri',
    treatmentType: 'In-Office Laser Teeth Whitening (Bleaching)',
    dentalChair: 'Chair 2 (Cosmetic Suite)',
    status: 'Confirmed',
    notes: 'Scaling completed last week. Pre-bleach shade recorded: A3.5.',
    createdAt: '2025-02-15T10:15:00Z'
  },
  {
    id: 'apt-3',
    appointmentNo: 'APT-1003',
    patientId: 'p-3',
    patientName: 'Vikramaditya Patil',
    phone: '+91 94220 54321',
    appointmentDate: new Date().toISOString().split('T')[0], // Today
    timeSlot: '03:00 PM - 03:45 PM',
    doctorName: 'Dr. Amit Songiri',
    treatmentType: 'Deep Periodontal Curettage & Irrigation',
    dentalChair: 'Chair 1 (Main Operatory)',
    status: 'Scheduled',
    notes: 'Check BP prior to local infiltration.',
    createdAt: '2025-02-15T11:30:00Z'
  },
  {
    id: 'apt-4',
    appointmentNo: 'APT-1004',
    patientId: 'p-4',
    patientName: 'Ananya Deshmukh',
    phone: '+91 99221 67890',
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    timeSlot: '04:30 PM - 05:15 PM',
    doctorName: 'Dr. Amit Songiri',
    treatmentType: 'Orthodontic 3D Digital Scan & Aligner Plan',
    dentalChair: 'Chair 3 (Orthodontics)',
    status: 'Scheduled',
    notes: 'Aligner mock simulation ready on scanner.',
    createdAt: '2025-02-15T14:00:00Z'
  },
  {
    id: 'apt-5',
    appointmentNo: 'APT-1005',
    patientId: 'p-5',
    patientName: 'Mohammed Farooq',
    phone: '+91 98900 12345',
    appointmentDate: new Date().toISOString().split('T')[0], // Today
    timeSlot: '05:30 PM - 06:00 PM',
    doctorName: 'Dr. Amit Songiri',
    treatmentType: 'Post-Op Crown Bite Check',
    dentalChair: 'Chair 2 (Cosmetic Suite)',
    status: 'Scheduled',
    notes: 'Check articulating paper marks for premature contacts.',
    createdAt: '2025-02-16T08:00:00Z'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNo: 'INV-2025-089',
    patientId: 'p-1',
    patientName: 'Rajesh Sharma',
    phone: '+91 98234 11223',
    doctorName: 'Dr. Amit Songiri',
    invoiceDate: '2025-02-14',
    items: [
      {
        id: 'item-1',
        type: 'procedure',
        name: 'Comprehensive Dental Consultation & Checkup',
        quantity: 1,
        unitPrice: 500,
        totalPrice: 500
      },
      {
        id: 'item-2',
        type: 'procedure',
        name: 'Digital Intraoral X-Ray (RVG per tooth)',
        toothNumber: '46',
        quantity: 1,
        unitPrice: 300,
        totalPrice: 300
      },
      {
        id: 'item-3',
        type: 'medicine',
        name: 'Amoxicillin & Potassium Clavulanate (Augmentin 625mg)',
        quantity: 1,
        unitPrice: 185,
        totalPrice: 185,
        inventoryItemId: 'inv-1'
      }
    ],
    subtotal: 985,
    discountAmount: 85,
    taxPercent: 0,
    taxAmount: 0,
    grandTotal: 900,
    amountPaid: 900,
    balanceDue: 0,
    paymentMode: 'UPI / QR',
    paymentStatus: 'Paid',
    notes: 'Paid via PhonePe QR at reception counter.',
    createdAt: '2025-02-14T11:45:00Z'
  },
  {
    id: 'inv-102',
    invoiceNo: 'INV-2025-090',
    patientId: 'p-5',
    patientName: 'Mohammed Farooq',
    phone: '+91 98900 12345',
    doctorName: 'Dr. Amit Songiri',
    invoiceDate: '2025-02-15',
    items: [
      {
        id: 'item-4',
        type: 'procedure',
        name: 'Full Zirconia Premium Ceramic Crown',
        toothNumber: '26',
        quantity: 1,
        unitPrice: 7500,
        totalPrice: 7500
      },
      {
        id: 'item-5',
        type: 'medicine',
        name: 'Chlorhexidine Gluconate 0.2% Antiseptic Mouthwash (Hexidine)',
        quantity: 1,
        unitPrice: 135,
        totalPrice: 135,
        inventoryItemId: 'inv-6'
      }
    ],
    subtotal: 7635,
    discountAmount: 135,
    taxPercent: 0,
    taxAmount: 0,
    grandTotal: 7500,
    amountPaid: 5000,
    balanceDue: 2500,
    paymentMode: 'Card',
    paymentStatus: 'Partial',
    notes: 'Balance ₹2500 promised on post-cementation review.',
    createdAt: '2025-02-15T17:10:00Z'
  },
  {
    id: 'inv-103',
    invoiceNo: 'INV-2025-091',
    patientId: 'p-2',
    patientName: 'Pooja Kulkarni',
    phone: '+91 97654 88990',
    doctorName: 'Dr. Amit Songiri',
    invoiceDate: '2025-02-16',
    items: [
      {
        id: 'item-6',
        type: 'procedure',
        name: 'Full Mouth Scaling & Polishing (Ultrasonic)',
        quantity: 1,
        unitPrice: 1500,
        totalPrice: 1500
      }
    ],
    subtotal: 1500,
    discountAmount: 0,
    taxPercent: 0,
    taxAmount: 0,
    grandTotal: 1500,
    amountPaid: 1500,
    paymentMode: 'Cash',
    paymentStatus: 'Paid',
    balanceDue: 0,
    notes: 'Cash receipt #442 issued.',
    createdAt: '2025-02-16T12:30:00Z'
  }
];
