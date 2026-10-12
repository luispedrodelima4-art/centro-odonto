'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Plus, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  Tag, 
  DollarSign, 
  ChevronRight, 
  Smile, 
  ShieldCheck, 
  Trash2,
  Edit3,
  Layers,
  Search
} from 'lucide-react';
import { 
  CatalogProcedure, 
  CONDITIONS, 
  ORDERED_TEETH_11_TO_48,
  Q1_TEETH, 
  Q2_TEETH, 
  Q3_TEETH, 
  Q4_TEETH, 
  SURFACES, 
  TOOTH_NAMES, 
  ToothItem,
  getConditionConfig
} from '../lib/odontogramConfig';

interface ToothModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialToothNumber?: number;
  catalog: CatalogProcedure[];
  existingTeeth: ToothItem[];
  onSaveToothAppointment: (
    toothNumber: number, 
    condition: string, 
    surfaces: string[], 
    procedure?: {
      name: string;
      priceInCents: number;
      notes?: string;
    },
    customConditionLabel?: string
  ) => Promise<void>;
  onRemoveToothAppointment?: (toothNumber: number) => void;
  onRemoveProcedure?: (toothNumber: number, procedureId: string) => void;
}

export function ToothModal({
  isOpen,
  onClose,
  initialToothNumber,
  catalog,
  existingTeeth,
  onSaveToothAppointment,
  onRemoveToothAppointment,
  onRemoveProcedure,
}: ToothModalProps) {
  // Tooth selection state
  const [selectedToothNum, setSelectedToothNum] = useState<number>(initialToothNumber || 16);
  const [viewMode, setViewMode] = useState<'quadrants' | 'all'>('quadrants');
  const [activeQuadrant, setActiveQuadrant] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q1');
  
  // Clinical condition / state state
  const [selectedCondition, setSelectedCondition] = useState<string>('CARIOUS');
  const [customConditionText, setCustomConditionText] = useState<string>('');
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>(['O']);
  
  // Procedure linkage state
  const [includeProcedure, setIncludeProcedure] = useState<boolean>(true);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>(catalog[0]?.id || '');
  const [procedureNotes, setProcedureNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when opened or initial tooth changes
  useEffect(() => {
    if (initialToothNumber) {
      setSelectedToothNum(initialToothNumber);
      if (initialToothNumber >= 11 && initialToothNumber <= 18) setActiveQuadrant('Q1');
      else if (initialToothNumber >= 21 && initialToothNumber <= 28) setActiveQuadrant('Q2');
      else if (initialToothNumber >= 31 && initialToothNumber <= 38) setActiveQuadrant('Q3');
      else if (initialToothNumber >= 41 && initialToothNumber <= 48) setActiveQuadrant('Q4');

      const existing = existingTeeth.find((t) => t.toothNumber === initialToothNumber);
      if (existing) {
        setSelectedCondition(existing.condition !== 'SOUND' ? existing.condition : 'CARIOUS');
        setCustomConditionText(existing.customConditionLabel || '');
        const allSurfs = Array.from(new Set(existing.procedures.flatMap((p) => p.surfaces)));
        setSelectedSurfaces(allSurfs.length > 0 ? allSurfs : ['O']);
      }
    } else {
      setSelectedToothNum(16);
      setActiveQuadrant('Q1');
      setSelectedCondition('CARIOUS');
      setCustomConditionText('');
      setSelectedSurfaces(['O']);
    }

    if (catalog.length > 0 && !selectedCatalogId) {
      setSelectedCatalogId(catalog[0].id);
    }
  }, [initialToothNumber, isOpen, catalog, existingTeeth]);

  if (!isOpen) return null;

  const currentToothRecord = existingTeeth.find((t) => t.toothNumber === selectedToothNum);
  const toothName = TOOTH_NAMES[selectedToothNum] ?? `Dente ${selectedToothNum}`;
  const conditionConfig = getConditionConfig(selectedCondition, customConditionText);
  const selectedProcedureItem = catalog.find((c) => c.id === selectedCatalogId) || catalog[0];

  const isExistingTooth = currentToothRecord && (
    currentToothRecord.condition !== 'SOUND' || 
    currentToothRecord.procedures.length > 0 ||
    !!currentToothRecord.customConditionLabel
  );

  const toggleSurface = (code: string) => {
    setSelectedSurfaces((prev) =>
      prev.includes(code) ? prev.filter((s) => s !== code) : [...prev, code]
    );
  };

  const handleSelectTooth = (num: number) => {
    setSelectedToothNum(num);
    if (num >= 11 && num <= 18) setActiveQuadrant('Q1');
    else if (num >= 21 && num <= 28) setActiveQuadrant('Q2');
    else if (num >= 31 && num <= 38) setActiveQuadrant('Q3');
    else if (num >= 41 && num <= 48) setActiveQuadrant('Q4');

    // If tooth already has state, preload it
    const existing = existingTeeth.find((t) => t.toothNumber === num);
    if (existing && existing.condition !== 'SOUND') {
      setSelectedCondition(existing.condition);
      setCustomConditionText(existing.customConditionLabel || '');
      const allSurfs = Array.from(new Set(existing.procedures.flatMap((p) => p.surfaces)));
      if (allSurfs.length > 0) setSelectedSurfaces(allSurfs);
    }
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const procData = includeProcedure && selectedProcedureItem ? {
        name: selectedProcedureItem.name,
        priceInCents: selectedProcedureItem.priceInCents,
        notes: procedureNotes.trim() || undefined,
      } : undefined;

      const customLabel = selectedCondition === 'CUSTOM' ? (customConditionText.trim() || 'Outro Diagnóstico') : undefined;

      await onSaveToothAppointment(
        selectedToothNum,
        selectedCondition,
        selectedSurfaces,
        procData,
        customLabel
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = () => {
    if (onRemoveToothAppointment) {
      onRemoveToothAppointment(selectedToothNum);
      onClose();
    }
  };

  const getQuadrantTeeth = () => {
    switch (activeQuadrant) {
      case 'Q1': return Q1_TEETH;
      case 'Q2': return Q2_TEETH;
      case 'Q3': return Q3_TEETH;
      case 'Q4': return Q4_TEETH;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white border border-[#EAE4DC] rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE4DC]">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#F6EFE6] border border-[#DCBF9E] flex items-center justify-center font-mono font-extrabold text-xl text-[#8B623B] shadow-sm">
              {selectedToothNum}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#362312] flex items-center gap-2">
                {isExistingTooth ? 'Editar Estado do Dente' : 'Criar & Lançar Estado do Dente'}
                {isExistingTooth && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F6EFE6] text-[#8B623B] border border-[#DCBF9E]">
                    Já Lançado
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#78695C] mt-0.5">
                {toothName} &bull; Notação FDI (11 a 48, sem 9s)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. SELEÇÃO DO DENTE (Apenas aparece nesta tela!) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#52361D] uppercase tracking-wider flex items-center gap-1.5">
              <span>1. Escolha o Dente para Lançar:</span>
              <span className="text-[#8B623B] font-mono font-black text-sm">#{selectedToothNum}</span>
            </label>
            <div className="flex items-center gap-1 bg-[#FAF8F5] p-0.5 rounded-xl border border-[#EAE4DC] text-[10px]">
              <button
                type="button"
                onClick={() => setViewMode('quadrants')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'quadrants' ? 'bg-[#8B623B] text-white shadow-sm' : 'text-[#78695C]'
                }`}
              >
                Por Quadrantes
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'all' ? 'bg-[#8B623B] text-white shadow-sm' : 'text-[#78695C]'
                }`}
              >
                Ver Todos (32 Dentes)
              </button>
            </div>
          </div>

          {viewMode === 'quadrants' ? (
            <>
              {/* Quadrant tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#FAF8F5] rounded-2xl border border-[#EAE4DC]">
                <button
                  type="button"
                  onClick={() => setActiveQuadrant('Q1')}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all ${
                    activeQuadrant === 'Q1'
                      ? 'bg-[#8B623B] text-white shadow-sm'
                      : 'text-[#78695C] hover:text-[#362312]'
                  }`}
                >
                  Q1: Sup. Dir. (11-18)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveQuadrant('Q2')}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all ${
                    activeQuadrant === 'Q2'
                      ? 'bg-[#8B623B] text-white shadow-sm'
                      : 'text-[#78695C] hover:text-[#362312]'
                  }`}
                >
                  Q2: Sup. Esq. (21-28)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveQuadrant('Q3')}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all ${
                    activeQuadrant === 'Q3'
                      ? 'bg-[#8B623B] text-white shadow-sm'
                      : 'text-[#78695C] hover:text-[#362312]'
                  }`}
                >
                  Q3: Inf. Esq. (31-38)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveQuadrant('Q4')}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all ${
                    activeQuadrant === 'Q4'
                      ? 'bg-[#8B623B] text-white shadow-sm'
                      : 'text-[#78695C] hover:text-[#362312]'
                  }`}
                >
                  Q4: Inf. Dir. (41-48)
                </button>
              </div>

              {/* 8 Teeth Buttons in Active Quadrant */}
              <div className="grid grid-cols-8 gap-2 pt-1">
                {getQuadrantTeeth().map((num) => {
                  const isSelected = selectedToothNum === num;
                  const hasExisting = existingTeeth.some(
                    (t) => t.toothNumber === num && (t.condition !== 'SOUND' || t.procedures.length > 0 || !!t.customConditionLabel)
                  );

                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSelectTooth(num)}
                      className={`py-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center relative ${
                        isSelected
                          ? 'bg-[#8B623B] text-white border-[#8B623B] shadow-md ring-2 ring-[#DCBF9E]'
                          : hasExisting
                          ? 'bg-rose-50 text-rose-800 border-rose-300 hover:border-rose-400'
                          : 'bg-white text-[#362312] border-[#EAE4DC] hover:border-[#DCBF9E] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <span className="font-mono font-bold text-sm block">{num}</span>
                      {hasExisting && (
                        <span 
                          className={`w-2 h-2 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-rose-500'}`} 
                          title="Dente já lançado no prontuário"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* All 32 Teeth Grid View */
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] space-y-2">
              <div className="text-[10px] font-bold text-[#78695C] uppercase tracking-wider">
                Maxila (Arcada Superior: 18 a 11 &bull; 21 a 28)
              </div>
              <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
                {[18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28].map((num) => {
                  const isSelected = selectedToothNum === num;
                  const hasExisting = existingTeeth.some(
                    (t) => t.toothNumber === num && (t.condition !== 'SOUND' || t.procedures.length > 0)
                  );
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSelectTooth(num)}
                      className={`py-1.5 rounded-lg border font-mono font-bold text-xs transition-all ${
                        isSelected
                          ? 'bg-[#8B623B] text-white border-[#8B623B] ring-2 ring-[#DCBF9E]'
                          : hasExisting
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-white text-[#362312] border-[#EAE4DC] hover:border-[#DCBF9E]'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              <div className="text-[10px] font-bold text-[#78695C] uppercase tracking-wider pt-1">
                Mandíbula (Arcada Inferior: 48 a 41 &bull; 31 a 38)
              </div>
              <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
                {[48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38].map((num) => {
                  const isSelected = selectedToothNum === num;
                  const hasExisting = existingTeeth.some(
                    (t) => t.toothNumber === num && (t.condition !== 'SOUND' || t.procedures.length > 0)
                  );
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSelectTooth(num)}
                      className={`py-1.5 rounded-lg border font-mono font-bold text-xs transition-all ${
                        isSelected
                          ? 'bg-[#8B623B] text-white border-[#8B623B] ring-2 ring-[#DCBF9E]'
                          : hasExisting
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-white text-[#362312] border-[#EAE4DC] hover:border-[#DCBF9E]'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. CRIAR / DEFINIR O ESTADO DO DENTE */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-[#52361D] uppercase tracking-wider">
            2. Estado Clínico / Diagnóstico do Dente {selectedToothNum}:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'CARIOUS', label: 'Cariado (Tratar)', color: 'border-rose-300 text-rose-800 bg-rose-50/60' },
              { id: 'RESTORED', label: 'Restaurado', color: 'border-[#DCBF9E] text-[#8B623B] bg-[#F6EFE6]/60' },
              { id: 'ENDODONTICALLY_TREATED', label: 'Canal Tratado', color: 'border-amber-300 text-amber-900 bg-amber-50/60' },
              { id: 'IMPLANT', label: 'Implante Dentário', color: 'border-stone-300 text-stone-800 bg-stone-50' },
              { id: 'CROWN', label: 'Coroa Protética', color: 'border-[#DCBF9E] text-[#8B623B] bg-[#FAF8F5]' },
              { id: 'FRACTURED', label: 'Fratura / Trinca', color: 'border-orange-300 text-orange-900 bg-orange-50/60' },
              { id: 'VENEER', label: 'Faceta / Lente', color: 'border-teal-300 text-teal-900 bg-teal-50/60' },
              { id: 'MOBILITY', label: 'Mobilidade', color: 'border-purple-300 text-purple-900 bg-purple-50/60' },
              { id: 'MISSING', label: 'Ausente', color: 'border-stone-300 text-stone-600 bg-stone-100' },
              { id: 'EXTRACTED', label: 'Extraído', color: 'border-stone-300 text-stone-600 bg-stone-100' },
              { id: 'SOUND', label: 'Hígido (Sadio)', color: 'border-emerald-300 text-emerald-800 bg-emerald-50/60' },
              { id: 'CUSTOM', label: 'Outro Estado...', color: 'border-[#DCBF9E] text-[#8B623B] bg-[#F6EFE6]' },
            ].map((c) => {
              const active = selectedCondition === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCondition(c.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                    active
                      ? `${c.color} ring-2 ring-[#8B623B] shadow-sm`
                      : 'bg-white text-[#78695C] border-[#EAE4DC] hover:border-[#DCBF9E]'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Campo de texto para Criar Estado Personalizado */}
          {selectedCondition === 'CUSTOM' && (
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#DCBF9E] space-y-1.5 animate-in fade-in">
              <label className="text-[11px] font-bold text-[#8B623B] uppercase tracking-wider block">
                Nome do Estado Clínico Personalizado:
              </label>
              <input
                type="text"
                value={customConditionText}
                onChange={(e) => setCustomConditionText(e.target.value)}
                placeholder="Ex: Desgaste severo por bruxismo, Dente incluso, Giroversão, Raiz residual..."
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCBF9E] text-xs font-semibold text-[#362312] placeholder-[#A89C91] focus:outline-none focus:ring-2 focus:ring-[#8B623B]"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* 3. FACES ANATÔMICAS */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#52361D] uppercase tracking-wider">
            3. Faces Acometidas no Dente {selectedToothNum} (Opcional):
          </label>
          <div className="flex flex-wrap gap-2">
            {SURFACES.map((surf) => {
              const active = selectedSurfaces.includes(surf.code);
              return (
                <button
                  key={surf.code}
                  type="button"
                  onClick={() => toggleSurface(surf.code)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#F6EFE6] text-[#8B623B] border-[#8B623B] ring-1 ring-[#8B623B] shadow-sm'
                      : 'bg-white text-[#78695C] border-[#EAE4DC] hover:border-[#DCBF9E]'
                  }`}
                >
                  <span className="font-mono font-bold mr-1 text-[#8B623B]">{surf.code}</span>
                  {surf.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Procedimentos já existentes no dente (se houver) */}
        {currentToothRecord && currentToothRecord.procedures.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] space-y-2">
            <span className="text-[11px] font-bold text-[#78695C] uppercase tracking-wider block">
              Procedimentos já registrados neste dente:
            </span>
            <div className="space-y-1.5">
              {currentToothRecord.procedures.map((p) => (
                <div 
                  key={p.id}
                  className="p-2 rounded-xl bg-white border border-[#EAE4DC] flex items-center justify-between text-xs"
                >
                  <div className="truncate">
                    <span className="font-semibold text-[#362312]">{p.name}</span>
                    {p.surfaces.length > 0 && (
                      <span className="ml-1.5 text-[10px] text-[#8B623B] font-mono font-bold">
                        ({p.surfaces.join('')})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-700">
                      R$ {(p.priceInCents / 100).toFixed(2)}
                    </span>
                    {onRemoveProcedure && (
                      <button
                        type="button"
                        onClick={() => onRemoveProcedure(selectedToothNum, p.id)}
                        className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remover este procedimento do dente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. VINCULAR PROCEDIMENTO DA TABELA DA CLÍNICA */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#52361D] uppercase tracking-wider flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeProcedure}
                onChange={(e) => setIncludeProcedure(e.target.checked)}
                className="w-4 h-4 rounded text-[#8B623B] focus:ring-[#8B623B] cursor-pointer"
              />
              4. Vincular Novo Procedimento da Clínica
            </label>
            <span className="text-[11px] text-[#78695C]">Honorários em R$</span>
          </div>

          {includeProcedure && (
            <div className="space-y-2.5 pt-1 animate-in fade-in">
              <select
                value={selectedCatalogId}
                onChange={(e) => setSelectedCatalogId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EAE4DC] text-xs font-medium text-[#362312] focus:outline-none focus:border-[#8B623B] cursor-pointer"
              >
                {catalog.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} &bull; R$ {(item.priceInCents / 100).toFixed(2)}
                  </option>
                ))}
              </select>

              {selectedProcedureItem && (
                <div className="p-3 rounded-xl bg-white border border-[#EAE4DC] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8B623B] block">
                      {selectedProcedureItem.category}
                    </span>
                    <span className="text-[#362312] font-semibold">
                      {selectedProcedureItem.name}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-sm text-emerald-700 whitespace-nowrap ml-2">
                    R$ {(selectedProcedureItem.priceInCents / 100).toFixed(2)}
                  </span>
                </div>
              )}

              <input
                type="text"
                value={procedureNotes}
                onChange={(e) => setProcedureNotes(e.target.value)}
                placeholder="Observações do procedimento (ex: Resina nanohíbrida A2, isolamento absoluto)..."
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#EAE4DC] text-xs text-[#362312] placeholder-[#A89C91] focus:outline-none focus:border-[#8B623B]"
              />
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#EAE4DC]">
          <div>
            {isExistingTooth && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Desmarcar Dente (Tornar Sadio)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78695C] hover:text-[#362312]"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#8B623B] hover:bg-[#6F4B2B] text-white shadow-md shadow-[#8B623B]/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              Salvar Estado no Dente {selectedToothNum}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
