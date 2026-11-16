# 🦷 DentaCare OS - Professional Dental Clinic Management Software

A modern, full-featured Dental ERP & Clinic Practice Management Web Software built with **React**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

Designed with **zero dead space**, an executive operatory dashboard, responsive sidebar, real-time chair monitor, interactive 32-teeth dental chart, medicine stock tracking with automated deduction, appointment queue management with WhatsApp reminders, and professional printable tax invoices/receipts with UPI QR code.

---

## 🚀 Key Modules & Features

### 1. 📊 Executive Dashboard (Zero Dead Space)
- **Top Metric KPI Cards**: Today's Appointments, Total Active Patients, Medicine Low Stock Alerts, Today's Collections & Revenue.
- **Fast 1-Click Action Bar**: `+ Patient`, `+ Appointment`, `+ Stock In`, `+ New Bill`.
- **Operatory Chairs Live Monitor**: Real-time status for Chair 1 (Main Operatory), Chair 2 (Cosmetic Suite), Chair 3 (Orthodontics & Diagnostic 3D Scan).
- **Today's Patient Queue**: Interactive time slot agenda with instant "Seat in Chair" and "Finish Treatment" buttons.
- **Medicine Stock Watch**: Proactive widget showing medicines below reorder threshold with 1-click `+ Restock`.
- **Clinical Services Mix**: Visual breakdown of Endodontics, Prophylaxis, Prosthodontics, and Surgical procedures.
- **Recent Invoices Ledger**: Quick transaction list with 1-click receipt printing.

### 2. 👤 Patient Entry & Clinical Records
- **Comprehensive Patient Registration**: Full Name, Age, Gender, Phone, Email, Blood Group, Address, Emergency Contact.
- **Critical Medical Alert System**: High-visibility warning badges for Drug Allergies (Penicillin, Sulfa, Latex) and Systemic Conditions (Diabetes, Hypertension, Bleeding issues).
- **🦷 Interactive 32-Teeth Dental Chart**:
  - FDI two-digit numbering system (Teeth 11–18, 21–28 for upper arch; 48–41, 31–38 for lower arch).
  - Color-coded conditions: **Healthy (Green)**, **Decayed (Red)**, **Filled (Blue)**, **Crown (Purple)**, **Root Canal (Amber)**, **Extraction Needed (Orange)**, **Missing (Gray)**.
  - Per-tooth clinical notes and procedure tracking.
- **Patient File Modal**: Complete appointment history, billing ledger, and total visit counters.

### 3. 📅 Appointments & Queue Scheduling
- **Chairside Slot Scheduling**: 30-minute to 45-minute dental intervals.
- **Operatory Chair Allocation**: Assign to specific operatory chairs (Chair 1, Chair 2, Chair 3).
- **Doctor Assignment & Treatment Planning**: Select procedure from standard dental catalog or type custom treatment.
- **1-Click WhatsApp Reminders**: Automatically launches WhatsApp Web/App with pre-composed professional appointment reminder message for the patient.
- **Queue Status Transitions**: `Scheduled` ➔ `Confirmed` ➔ `In-Chair` ➔ `Completed` (with immediate option to create bill).

### 4. 💊 Medicine Stock Update & Pharmacy Inventory
- **Real-Time Stock Catalog**: Track antibiotics, analgesics, anesthetics, composites, impression materials, and surgical consumables.
- **Batch & Expiry Monitoring**: Automatic alert banners for items expiring within 90 days or expired items.
- **Threshold Warnings**: Visual progress bars highlighting medicines falling below the minimum reorder quantity.
- **1-Click +/- Stock Update Modal**: Quick restock from distributor or record chairside consumption with audit reason.
- **Inventory Valuation**: Automatic calculation of purchase cost vs. billed retail valuation.

### 5. 🧾 Billing, Invoicing & Receipts
- **Itemized Bill Creation**:
  - Add dental procedures with tooth numbers from standard clinic price list.
  - **Automated Inventory Stock Deduction**: When dispensing prescription medicines in a bill, the stock quantity is automatically decremented from the pharmacy inventory.
- **Discounts & Taxes**: Configurable flat discount, percentage discount, and GST calculation.
- **Flexible Payments**: Cash Counter, UPI / QR (GPay / PhonePe / Paytm), Card POS, Net Banking, Insurance TPA.
- **Payment Status**: Automatic tracking of `Paid`, `Partial` (record pending payment anytime), and `Unpaid`.
- **🖨️ Professional Printable Invoice / Receipt Modal**:
  - Doctor qualifications, registration number, clinic logo, and GSTIN.
  - Itemized table with tooth numbers, unit price, and quantities.
  - **UPI QR Code Simulator**: Patients can scan and pay directly from their mobile phone.
  - Doctor signature & clinic authorization section.
  - Formatted for direct browser printing (Clean A4 or Thermal Receipt print).

### 6. ⚡ Supabase Database Integration
- **Hybrid Offline-First / Cloud Architecture**:
  - Works instantly out of the box with LocalStorage persistence (no setup required to start using!).
  - Fully compatible with **Supabase PostgreSQL** for persistent multi-device cloud storage.
- **Full Database Schema**: Complete SQL script in `supabase/schema.sql` covering `patients`, `inventory`, `appointments`, `invoices`, `invoice_items`, `patient_dental_chart`, and `clinic_settings`.
- **In-App Cloud Settings UI**: Paste your Supabase Project URL and Anon Key directly in the UI under **Settings & Cloud** to verify and connect!

---

## 🛠️ How to Run the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser at the local URL (usually `http://localhost:5173`).

### 3. Production Build
```bash
npm run build
```

---

## 🗄️ Setting up Supabase Database

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository (or click **"Copy Supabase SQL Schema"** inside the app under **Settings & Cloud**) and click **Run**.
4. Go to **Project Settings > API**, copy your **Project URL** and **anon public key**.
5. Paste them into the app under **Settings & Cloud > Connect Supabase** (or put them in a `.env` file as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
