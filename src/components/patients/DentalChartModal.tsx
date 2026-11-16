import React, { useState } from 'react';
import { Patient, ToothRecord } from '../../types';
import { useClinic } from '../../context/ClinicContext';
import { X, Check, AlertCircle, Save } from 'lucide-react';

interface DentalChartModalProps {
  patient: Patient;
  onClose: () => void;
}

const toothConditions: Array<{ label: ToothRecord['condition']; color: string; border: string; bg: string }> = [
  { label: 'Healthy', color: 'text-emerald-700', border: 'border-emerald-300', bg: 'bg-emerald-500' },
  { label: 'Decayed', color: 'text-rose-700', border: 'border-rose-400', bg: 'bg-rose-500' },
  { label: 'Missing', color: 'text-slate-500', border: 'border-slate-300', bg: 'bg-slate-400' },
  { label: 'Filled', color: 'text-sky-700', border: 'border-sky-300', bg: 'bg-sky-500' },
  { label: 'Crown', color: 'text-purple-700', border: 'border-purple-300', bg: 'bg-purple-500' },
  { label: 'Root Canal', color: 'text-amber-700', border: 'border-amber-400', bg: 'bg-amber-500' },
  { label: 'Extraction Needed', color: 'text-orange-700', border: 'border-orange-400', bg: 'bg-orange-600' },
];

export const DentalChartModal: React.FC<DentalChartModalProps> = ({ patient, onClose }) => {
  const { updateDentalChart } = useClinic();
  const [selectedTooth, setSelectedTooth] = useState<number>(11);
  const [selectedCondition, setSelectedCondition] = useState<ToothRecord['condition']>('Healthy');
  const [toothNotes, setToothNotes] = useState<string>('');

  // Dental FDI notation quadrants
  // Upper Right: 18 to 11 | Upper Left: 21 to 28
  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  
  // Lower Right: 48 to 41 | Lower Left: 31 to 38
  const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41];
  const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];

  const getToothRecord = (toothNum: number): ToothRecord | undefined => {
    return patient.dentalChart?.find(t => t.toothNumber === toothNum);
  };

  const getToothCondition = (toothNum: number): ToothRecord['condition'] => {
    const rec = getToothRecord(toothNum);
    return rec ? rec.condition : 'Healthy';
  };

  const handleSelectTooth = (num: number) => {
    setSelectedTooth(num);
    const rec = getToothRecord(num);
    if (rec) {
      setSelectedCondition(rec.condition);
      setToothNotes(rec.notes || '');
    } else {
      setSelectedCondition('Healthy');
      setToothNotes('');
    }
  };

  const handleSaveTooth = () => {
    updateDentalChart(patient.id, selectedTooth, selectedCondition, toothNotes);
  };

  // Render tooth icon
  const renderToothButton = (num: number) => {
    const condition = getToothCondition(num);
    const isSelected = selectedTooth === num;
    const condConfig = toothConditions.find(c => c.label === condition) || toothConditions[0];

    return (
      <button
        key={num}
        onClick={() => handleSelectTooth(num)}
        type="button"
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all relative ${
          isSelected 
            ? 'ring-2 ring-sky-500 scale-105 bg-sky-50 shadow-md' 
            : 'hover:bg-slate-100 bg-white border border-slate-200'
        }`}
      >
        <span className="text-[11px] font-bold text-slate-700">{num}</span>
        {/* Visual Tooth Silhouette */}
        <div className="relative my-1">
          <svg className="w-6 h-7 text-slate-300" viewBox="0 0 24 28" fill="none">
            <path 
              d="M6 4C6 2.5 8 1 12 1C16 1 18 2.5 18 4C19 8 20 13 18 19C17 22 15 26 14 27C13 28 12.5 25 12 23C11.5 25 11 28 10 27C9 26 7 22 6 19C4 13 5 8 6 4Z" 
              fill="currentColor" 
            />
          </svg>
          {/* Status dot */}
          <span className={`absolute inset-x-1.5 top-1.5 h-3 rounded-full ${condConfig.bg} opacity-90`} />
        </div>
        <span className={`text-[9px] font-semibold truncate max-w-[46px] ${condConfig.color}`}>
          {condition.split(' ')[0]}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Interactive Dental Chart (32 Teeth)</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700">
                FDI Notation
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Patient: <strong className="text-slate-800">{patient.fullName}</strong> ({patient.patientId}) • {patient.age}y / {patient.gender}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Legend */}
          <div className="flex flex-wrap gap-2 text-xs">
            {toothConditions.map(c => (
              <div key={c.label} className="flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                <span className={`w-2.5 h-2.5 rounded-full ${c.bg}`} />
                <span className="font-medium text-slate-700">{c.label}</span>
              </div>
            ))}
          </div>

          {/* Dental Arch View */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            {/* UPPER ARCH */}
            <div className="mb-6">
              <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Maxillary (Upper) Arch
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Upper Right */}
                <div className="flex items-center justify-end space-x-1.5 border-r border-slate-300 pr-3">
                  {upperRight.map(renderToothButton)}
                </div>
                {/* Upper Left */}
                <div className="flex items-center justify-start space-x-1.5 pl-3">
                  {upperLeft.map(renderToothButton)}
                </div>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 px-4 mt-1">
                <span>Patient's Right (Quadrant 1)</span>
                <span>Midline</span>
                <span>Patient's Left (Quadrant 2)</span>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-300 my-4" />

            {/* LOWER ARCH */}
            <div>
              <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Mandibular (Lower) Arch
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Lower Right */}
                <div className="flex items-center justify-end space-x-1.5 border-r border-slate-300 pr-3">
                  {lowerRight.map(renderToothButton)}
                </div>
                {/* Lower Left */}
                <div className="flex items-center justify-start space-x-1.5 pl-3">
                  {lowerLeft.map(renderToothButton)}
                </div>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 px-4 mt-1">
                <span>Patient's Right (Quadrant 4)</span>
                <span>Midline</span>
                <span>Patient's Left (Quadrant 3)</span>
              </div>
            </div>
          </div>

          {/* Tooth Editor Section */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-500 font-medium">Selected Tooth</span>
                <div className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>Tooth #{selectedTooth}</span>
                  <span className="text-xs font-normal text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedTooth >= 11 && selectedTooth <= 18 && 'Maxillary Right'}
                    {selectedTooth >= 21 && selectedTooth <= 28 && 'Maxillary Left'}
                    {selectedTooth >= 31 && selectedTooth <= 38 && 'Mandibular Left'}
                    {selectedTooth >= 41 && selectedTooth <= 48 && 'Mandibular Right'}
                  </span>
                </div>
              </div>

              {/* Status pills selector */}
              <div className="flex flex-wrap gap-1.5">
                {toothConditions.map(c => {
                  const isActive = selectedCondition === c.label;
                  return (
                    <button
                      key={c.label}
                      onClick={() => setSelectedCondition(c.label)}
                      type="button"
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                        isActive 
                          ? `${c.bg} text-white shadow-sm ring-2 ring-offset-1 ring-sky-500` 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                value={toothNotes}
                onChange={(e) => setToothNotes(e.target.value)}
                placeholder="Clinical observation for this tooth (e.g. Mesial cavity, Periapical abscess, Crown fit, etc.)..."
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
              />
              <button
                onClick={handleSaveTooth}
                className="w-full sm:w-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center space-x-2 shrink-0 shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Tooth Status</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
