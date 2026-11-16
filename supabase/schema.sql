-- ==============================================================================
-- DENTACARE OS - DENTAL CLINIC MANAGEMENT SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. DEN-2025-001
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. INVENTORY / MEDICINE STOCK TABLE
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g. Antibiotics, Analgesics, Anesthetics, Composites, Surgical, Consumables
    batch_no VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    min_stock_alert INT NOT NULL DEFAULT 10,
    cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    unit VARCHAR(50) NOT NULL DEFAULT 'Strips', -- Strips, Bottles, Box, Units, Ampoules
    manufacturer VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_no VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(150) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL, -- e.g. 10:00 AM - 10:30 AM
    doctor_name VARCHAR(100) NOT NULL,
    treatment_type VARCHAR(150) NOT NULL, -- e.g. Root Canal, Scaling, Extraction, Consultation
    dental_chair VARCHAR(50) DEFAULT 'Chair 1',
    status VARCHAR(50) DEFAULT 'Scheduled', -- Scheduled, Confirmed, In-Chair, Completed, Cancelled
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. INVOICES / BILLING TABLE
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_no VARCHAR(50) UNIQUE NOT NULL, -- e.g. INV-2025-001
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    patient_name VARCHAR(150) NOT NULL,
    phone VARCHAR(25),
    doctor_name VARCHAR(100) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    tax_percent DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    grand_total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    amount_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    balance_due DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    payment_mode VARCHAR(50) DEFAULT 'Cash', -- Cash, UPI, Card, Net Banking, Split
    payment_status VARCHAR(50) DEFAULT 'Paid', -- Paid, Partial, Unpaid
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. INVOICE ITEMS (PROCEDURES & MEDICINES BILLED)
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- 'procedure' or 'medicine'
    item_name VARCHAR(150) NOT NULL,
    tooth_number VARCHAR(20),
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    inventory_item_id UUID REFERENCES inventory(id) ON DELETE SET NULL
);

-- 7. PATIENT DENTAL TOOTH RECORDS
CREATE TABLE IF NOT EXISTS patient_dental_chart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    tooth_number INT NOT NULL, -- 11-48 or 1-32
    condition VARCHAR(50) NOT NULL, -- Healthy, Decayed, Missing, Filled, Crown, RCT, Extraction Needed
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. CLINIC SETTINGS TABLE
CREATE TABLE IF NOT EXISTS clinic_settings (
    id INT PRIMARY KEY DEFAULT 1,
    clinic_name VARCHAR(150) DEFAULT 'Songiri Dental Clinic & Implant Center',
    tagline VARCHAR(200) DEFAULT 'Advanced Painless Dentistry & Smile Design',
    doctor_name VARCHAR(150) DEFAULT 'Dr. Amit Songiri, BDS, MDS (Oral & Maxillofacial)',
    reg_number VARCHAR(100) DEFAULT 'DENT-REG-84920',
    phone VARCHAR(50) DEFAULT '+91 98765 43210',
    email VARCHAR(100) DEFAULT 'contact@songiridental.com',
    address TEXT DEFAULT '104, Sunrise Healthcare Hub, Near Central Square, Main Road',
    gstin VARCHAR(50) DEFAULT '27AAAAA0000A1Z5',
    currency_symbol VARCHAR(10) DEFAULT '₹',
    chairs_count INT DEFAULT 3
);

-- INSERT INITIAL CLINIC SETTINGS
INSERT INTO clinic_settings (id, clinic_name, tagline, doctor_name)
VALUES (1, 'Songiri Dental Clinic & Implant Center', 'Advanced Painless Dentistry & Smile Design', 'Dr. Amit Songiri, BDS, MDS')
ON CONFLICT (id) DO NOTHING;

-- RLS (ROW LEVEL SECURITY) POLICIES
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_dental_chart ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;

-- Allow anon read/write for seamless single-clinic use
CREATE POLICY "Allow anon all on patients" ON patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on inventory" ON inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on appointments" ON appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on invoices" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on invoice_items" ON invoice_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on patient_dental_chart" ON patient_dental_chart FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on clinic_settings" ON clinic_settings FOR ALL USING (true) WITH CHECK (true);
