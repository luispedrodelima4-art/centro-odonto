'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  Layers, 
  Search, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Smile, 
  ShieldCheck, 
  Plus, 
  DollarSign,
  Edit2,
  Trash2,
  Stethoscope,
  Filter,
  FileCheck2
} from 'lucide-react';
import { 
  CatalogProcedure, 
  CONDITIONS, 
  TOOTH_NAMES, 
  ToothItem,
  getConditionConfig 
} from '../lib/odontogramConfig';
import { ToothModal } from './ToothModal';

interface ModernOdontogramProps {
  teeth: ToothItem[];
  catalog: CatalogProcedure[];
  onUpdateToothCondition: (toothNumber: number, condition: string, customLabel?: string) => Promise<void>;
  onAddProcedureToTooth: (
    toothNumber: number, 
    procedureCode: string, 
    name: string, 
    surfaces: string[], 
    priceInCents: number,
    notes?: string
  ) => Promise<void>;
  onRemoveToothAppointment?: (toothNumber: number) => void;
  onRemoveProcedureFromTooth?: (toothNumber: number, procedureId: string) => void;
}

export function ModernOdontogram({
  teeth,
  catalog,
  onUpdateToothCondition,
  onAddProcedureToTooth,
  onRemoveToothAppointment,
  onRemoveProcedureFromTooth,
}: ModernOdontogramProps) {
  const [selectedToothToEdit, setSelectedToothToEdit] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedQuadrantFilter, setSelectedQuadrantFilter] = useState<string>('ALL');

  // Filter ONLY teeth that have active clinical appointments (not SOUND or have procedures or custom condition)
  const launchedTeeth = teeth.filter(
    (t) => t.condition !== 'SOUND' || t.procedures.length > 0 || (t.customConditionLabel && t.customConditionLabel.trim().length > 0)
  );

  // Quadrant helper
  const getQuadrantForTooth = (num: number) => {
    if (num >= 11 && num <= 18) return { code: 'Q1', name: 'Sup. Dir. (Maxila)' };
    if (num >= 21 && num <= 28) return { code: 'Q2', name: 'Sup. Esq. (Maxila)' };
    if (num >= 31 && num <= 38) return { code: 'Q3', name: 'Inf. Esq. (Mandíbula)' };
    if (num >= 41 && num <= 48) return { code: 'Q4', name: 'Inf. Dir. (Mandíbula)' };
    return { code: 'Arcada', name: 'Geral' };
  };

  // Filtered launched teeth (by search or quadrant)
  const filteredLaunchedTeeth = launchedTeeth.filter((t) => {
    const q = getQuadrantForTooth(t.toothNumber).code;
    if (selectedQuadrantFilter !== 'ALL' && q !== selectedQuadrantFilter) return false;

    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    const toothNumMatch = t.toothNumber.toString().includes(term);
    const toothNameMatch = (TOOTH_NAMES[t.toothNumber] || '').toLowerCase().includes(term);
    const conditionMatch = (t.customConditionLabel || t.condition || '').toLowerCase().includes(term);
    const procedureMatch = t.procedures.some((p) => p.name.toLowerCase().includes(term));

    return toothNumMatch || toothNameMatch || conditionMatch || procedureMatch;
  });

  // Total budget calculation from launched procedures
  const totalBudgetInCents = launchedTeeth.reduce((sum, tooth) => {
    return sum + tooth.procedures.reduce((procSum, p) => procSum + (p.priceInCents || 0), 0);
  }, 0);

  const totalProceduresCount = launchedTeeth.reduce((sum, tooth) => sum + tooth.procedures.length, 0);

  const handleOpenNewToothModal = () => {
    setSelectedToothToEdit(undefined as any);
    setIsModalOpen(true);
  };

  const handleOpenEditToothModal = (num: number) => {
    setSelectedToothToEdit(num);
    setIsModalOpen(true);
  };

  const handleSaveToothAppointment = async (
    toothNumber: number,
    condition: string,
    surfaces: string[],
    procedure?: {
      name: string;
      priceInCents: number;
      notes?: string;
    },
    customLabel?: string
  ) => {
    // 1. Update condition
    await onUpdateToothCondition(toothNumber, condition, customLabel);

    // 2. Add procedure if present
    if (procedure) {
      await onAddProcedureToTooth(
        toothNumber,
        `PROC-${toothNumber}`,
        procedure.name,
        surfaces,
        procedure.priceInCents,
        procedure.notes
      );
    }
  };

  const handleRemoveTooth = (toothNumber: number) => {
    if (onRemoveToothAppointment) {
      onRemoveToothAppointment(toothNumber);
    } else {
      onUpdateToothCondition(toothNumber, 'SOUND');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Overview & Primary Action */}
      <div className="p-6 md:p-7 rounded-3xl bg-white border border-[#EAE4DC] flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#F6EFE6] text-[#8B623B] border border-[#DCBF9E] uppercase tracking-wider">
              Prontuário Odontológico &bull; Estados & Apontamentos Lançados
            </span>
            <span className="text-xs text-[#78695C] font-semibold">Notação FDI (11 a 48)</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#362312] mt-1">
            Dentes Lançados no Paciente
          </h2>
          <p className="text-xs text-[#78695C] mt-0.5">
            A lista exibe <strong>apenas os dentes com estado ou procedimento registrado</strong>. A lista completa de dentes aparece no momento do lançamento.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick budget badge */}
          <div className="px-4 py-2 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#78695C] block">
              Total em Tratamento
            </span>
            <span className="font-mono font-bold text-base text-emerald-700 block">
              R$ {(totalBudgetInCents / 100).toFixed(2)}
            </span>
          </div>

          {/* Primary Action Button: Criar Estado do Dente */}
          <button
            type="button"
            onClick={handleOpenNewToothModal}
            className="px-5 py-3 rounded-2xl bg-[#8B623B] hover:bg-[#6F4B2B] text-white text-xs font-bold shadow-lg shadow-[#8B623B]/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Criar Estado do Dente
          </button>
        </div>
      </div>

      {/* 2. Lista Apenas dos Dentes Lançados */}
      {launchedTeeth.length === 0 ? (
        /* Empty State: Nenhum dente lançado */
        <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-[#DCBF9E] space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F6EFE6] text-[#8B623B] flex items-center justify-center">
            <Smile className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-[#362312]">
              Nenhum dente lançado neste paciente
            </h3>
            <p className="text-xs text-[#78695C] leading-relaxed">
              Todos os 32 dentes (11 a 48) encontram-se atualmente <strong>hígidos (sadios)</strong>. Para lançar uma cárie, restauração, canal, extração ou estado personalizado, clique no botão abaixo.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenNewToothModal}
            className="px-6 py-2.5 rounded-2xl bg-[#8B623B] hover:bg-[#6F4B2B] text-white text-xs font-bold shadow-md shadow-[#8B623B]/20 inline-flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Criar Primeiro Estado do Dente
          </button>
        </div>
      ) : (
        /* Active Launched Teeth Table */
        <div className="rounded-3xl border border-[#EAE4DC] bg-white overflow-hidden shadow-sm space-y-0">
          {/* Controls Bar: Search & Quadrant Filter */}
          <div className="p-4 bg-[#FAF8F5] border-b border-[#EAE4DC] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#362312] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#8B623B]" />
                {launchedTeeth.length} {launchedTeeth.length === 1 ? 'Dente Lançado' : 'Dentes Lançados'}
                {totalProceduresCount > 0 && (
                  <span className="text-[11px] text-[#78695C] font-normal">
                    &bull; {totalProceduresCount} {totalProceduresCount === 1 ? 'procedimento' : 'procedimentos'}
                  </span>
                )}
              </span>

              {/* Quadrant quick pill filters */}
              <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-xl border border-[#EAE4DC] text-[10px]">
                {['ALL', 'Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setSelectedQuadrantFilter(q)}
                    className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                      selectedQuadrantFilter === q
                        ? 'bg-[#8B623B] text-white shadow-sm'
                        : 'text-[#78695C] hover:text-[#362312]'
                    }`}
                  >
                    {q === 'ALL' ? 'Todos' : q}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#A89C91] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Buscar dente, estado..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#EAE4DC] text-xs text-[#362312] placeholder-[#A89C91] focus:outline-none focus:border-[#8B623B] w-40 sm:w-48"
                />
              </div>

              <button
                type="button"
                onClick={handleOpenNewToothModal}
                className="px-3 py-1.5 rounded-xl bg-[#8B623B] hover:bg-[#6F4B2B] text-white text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Lançar Outro Dente
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#78695C] uppercase font-semibold text-[10px] tracking-wider border-b border-[#EAE4DC]">
                <tr>
                  <th className="py-3 px-4 w-16">FDI</th>
                  <th className="py-3 px-4 min-w-[200px]">Elemento & Arcada</th>
                  <th className="py-3 px-4 min-w-[170px]">Estado Clínico / Diagnóstico</th>
                  <th className="py-3 px-4 min-w-[100px]">Faces</th>
                  <th className="py-3 px-4 min-w-[240px]">Procedimentos Vinculados</th>
                  <th className="py-3 px-4 text-right min-w-[110px]">Honorários</th>
                  <th className="py-3 px-4 text-center w-36">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE4DC] text-[#362312]">
                {filteredLaunchedTeeth.map((tooth) => {
                  const num = tooth.toothNumber;
                  const config = getConditionConfig(tooth.condition, tooth.customConditionLabel);
                  const name = TOOTH_NAMES[num] ?? `Dente ${num}`;
                  const quadrant = getQuadrantForTooth(num);

                  const toothSurfaces = Array.from(
                    new Set(tooth.procedures.flatMap((p) => p.surfaces))
                  );

                  const toothTotalCents = tooth.procedures.reduce(
                    (acc, p) => acc + (p.priceInCents || 0),
                    0
                  );

                  return (
                    <tr
                      key={num}
                      className="hover:bg-[#FAF8F5]/60 transition-colors group"
                    >
                      {/* 1. FDI Number badge */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleOpenEditToothModal(num)}
                          className="w-10 h-10 rounded-2xl bg-[#F6EFE6] hover:bg-[#8B623B] border border-[#DCBF9E] hover:border-[#8B623B] flex items-center justify-center font-mono font-extrabold text-base text-[#52361D] hover:text-white transition-all shadow-sm"
                          title="Clique para editar o estado deste dente"
                        >
                          {num}
                        </button>
                      </td>

                      {/* 2. Anatomical Name & Region */}
                      <td className="py-3.5 px-4">
                        <div 
                          onClick={() => handleOpenEditToothModal(num)}
                          className="font-bold text-[#362312] text-xs group-hover:text-[#8B623B] transition-colors cursor-pointer"
                        >
                          {name}
                        </div>
                        <div className="text-[11px] text-[#78695C] flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[#8B623B] font-bold">{quadrant.code}</span>
                          <span>&bull;</span>
                          <span>{quadrant.name}</span>
                        </div>
                      </td>

                      {/* 3. Condition Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${config.badgeBg}`}>
                          <span className={`w-2 h-2 rounded-full ${config.dotBg}`} />
                          {config.label}
                        </span>
                      </td>

                      {/* 4. Faces Envolvidas */}
                      <td className="py-3.5 px-4">
                        {toothSurfaces.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {toothSurfaces.map((s) => (
                              <span
                                key={s}
                                className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F6EFE6] text-[#8B623B] border border-[#DCBF9E]"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[#A89C91] text-[11px] italic">-</span>
                        )}
                      </td>

                      {/* 5. Procedures from clinic catalog */}
                      <td className="py-3.5 px-4">
                        {tooth.procedures.length > 0 ? (
                          <div className="space-y-1.5">
                            {tooth.procedures.map((p) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC]"
                              >
                                <div className="truncate">
                                  <span className="font-medium text-[#362312]">{p.name}</span>
                                  {p.surfaces.length > 0 && (
                                    <span className="ml-1.5 text-[10px] text-[#8B623B] font-mono font-bold">
                                      ({p.surfaces.join('')})
                                    </span>
                                  )}
                                </div>
                                <span className="font-mono text-[11px] font-bold text-emerald-700 whitespace-nowrap">
                                  R$ {(p.priceInCents / 100).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[#A89C91] text-xs italic">Apenas estado clínico (sem procedimento faturado)</span>
                        )}
                      </td>

                      {/* 6. Subtotal (R$) */}
                      <td className="py-3.5 px-4 text-right">
                        <span className={`font-mono text-xs font-bold ${toothTotalCents > 0 ? 'text-emerald-700' : 'text-[#A89C91]'}`}>
                          {toothTotalCents > 0 ? `R$ ${(toothTotalCents / 100).toFixed(2)}` : 'R$ 0,00'}
                        </span>
                      </td>

                      {/* 7. Action Buttons */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditToothModal(num)}
                            className="p-1.5 rounded-xl bg-[#F6EFE6] hover:bg-[#8B623B] text-[#52361D] hover:text-white transition-colors"
                            title="Editar estado ou adicionar procedimento neste dente"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveTooth(num)}
                            className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Desmarcar dente (tornar hígido/sadio)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Tooth Launch & State Creation Modal (Lista 11 a 48 só aparece aqui!) */}
      {isModalOpen && (
        <ToothModal
          isOpen={isModalOpen}
          initialToothNumber={selectedToothToEdit || 16}
          catalog={catalog}
          existingTeeth={teeth}
          onClose={() => setIsModalOpen(false)}
          onSaveToothAppointment={handleSaveToothAppointment}
          onRemoveToothAppointment={handleRemoveTooth}
          onRemoveProcedure={onRemoveProcedureFromTooth}
        />
      )}
    </div>
  );
}
