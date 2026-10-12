'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  DollarSign, 
  Receipt, 
  Calendar, 
  CreditCard, 
  Sparkles, 
  QrCode, 
  FileText, 
  Clock, 
  Printer, 
  User,
  ShieldCheck
} from 'lucide-react';
import { ToothItem } from '../lib/odontogramConfig';

interface ConsultationConclusionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientCpf: string;
  dentistName: string;
  teeth: ToothItem[];
  onConfirmConclusion: (summary: {
    totalInCents: number;
    paymentMethod: string;
    notes: string;
    nextAppointment?: string;
  }) => void;
}

export function ConsultationConclusionModal({
  isOpen,
  onClose,
  patientName,
  patientCpf,
  dentistName,
  teeth,
  onConfirmConclusion,
}: ConsultationConclusionModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH'>('PIX');
  const [returnNotes, setReturnNotes] = useState('Procedimento concluído sem intercorrências. Recomendado retorno em 6 meses para profilaxia preventiva.');
  const [nextAppointmentDate, setNextAppointmentDate] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');

  if (!isOpen) return null;

  // Gather all procedures on all teeth
  const completedProcedures = teeth.flatMap((tooth) =>
    tooth.procedures.map((proc) => ({
      ...proc,
      toothNumber: tooth.toothNumber,
    }))
  );

  const totalInCents = completedProcedures.reduce(
    (sum, p) => sum + (p.priceInCents || 0),
    0
  );

  const handleFinish = () => {
    const generatedReceipt = `CO-${Date.now().toString().slice(-6)}`;
    setReceiptNumber(generatedReceipt);
    setIsCompleted(true);
    onConfirmConclusion({
      totalInCents,
      paymentMethod,
      notes: returnNotes,
      nextAppointment: nextAppointmentDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-[#EAE4DC] rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {!isCompleted ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE4DC]">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F6EFE6] text-[#8B623B] flex items-center justify-center shadow-sm">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#362312]">
                    Concluir Atendimento & Fechamento da Consulta
                  </h3>
                  <p className="text-xs text-[#78695C]">
                    Revisão dos procedimentos clínicos executados e liquidação financeira.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient & Dentist Info Bar */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#78695C] block">Paciente</span>
                <span className="font-bold text-[#362312] text-sm">{patientName}</span>
                <span className="text-[11px] text-[#78695C] font-mono block">CPF: {patientCpf}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#78695C] block">Profissional Responsável</span>
                <span className="font-semibold text-[#52361D]">{dentistName}</span>
                <span className="text-[10px] text-emerald-700 font-medium block flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Assinatura digital válida
                </span>
              </div>
            </div>

            {/* Procedures Summary Table */}
            <div>
              <span className="text-xs font-bold text-[#52361D] uppercase tracking-wider block mb-2">
                1. Procedimentos Executados Nesta Sessão:
              </span>
              {completedProcedures.length === 0 ? (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-dashed border-[#DCBF9E] text-center text-xs text-[#78695C]">
                  Nenhum procedimento com custo foi lançado nesta consulta (apenas avaliação clínica).
                </div>
              ) : (
                <div className="border border-[#EAE4DC] rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-[#78695C] font-semibold uppercase text-[10px] border-b border-[#EAE4DC]">
                      <tr>
                        <th className="py-2.5 px-3">Dente (FDI)</th>
                        <th className="py-2.5 px-3">Procedimento</th>
                        <th className="py-2.5 px-3">Faces</th>
                        <th className="py-2.5 px-3 text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE4DC] text-[#362312]">
                      {completedProcedures.map((proc, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF8F5]/60">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#8B623B]">
                            {proc.toothNumber}
                          </td>
                          <td className="py-2.5 px-3 font-medium">
                            {proc.name}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px]">
                            {proc.surfaces && proc.surfaces.length > 0 ? proc.surfaces.join('') : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                            R$ {(proc.priceInCents / 100).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#FAF8F5] border-t border-[#EAE4DC]">
                      <tr>
                        <td colSpan={3} className="py-3 px-3 font-bold text-right text-xs text-[#52361D]">
                          Total da Consulta:
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-extrabold text-base text-emerald-700">
                          R$ {(totalInCents / 100).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div>
              <span className="text-xs font-bold text-[#52361D] uppercase tracking-wider block mb-2">
                2. Forma de Liquidação Financeira:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PIX')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'PIX'
                      ? 'bg-[#F6EFE6] border-[#8B623B] text-[#52361D] shadow-sm ring-1 ring-[#8B623B]'
                      : 'bg-white border-[#EAE4DC] text-[#78695C] hover:border-[#DCBF9E]'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-[#8B623B]" />
                  <span>Pix Instantâneo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'CREDIT_CARD'
                      ? 'bg-[#F6EFE6] border-[#8B623B] text-[#52361D] shadow-sm ring-1 ring-[#8B623B]'
                      : 'bg-white border-[#EAE4DC] text-[#78695C] hover:border-[#DCBF9E]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#8B623B]" />
                  <span>Cartão de Crédito</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('DEBIT_CARD')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'DEBIT_CARD'
                      ? 'bg-[#F6EFE6] border-[#8B623B] text-[#52361D] shadow-sm ring-1 ring-[#8B623B]'
                      : 'bg-white border-[#EAE4DC] text-[#78695C] hover:border-[#DCBF9E]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#8B623B]" />
                  <span>Cartão de Débito</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'CASH'
                      ? 'bg-[#F6EFE6] border-[#8B623B] text-[#52361D] shadow-sm ring-1 ring-[#8B623B]'
                      : 'bg-white border-[#EAE4DC] text-[#78695C] hover:border-[#DCBF9E]'
                  }`}
                >
                  <DollarSign className="w-5 h-5 text-[#8B623B]" />
                  <span>Dinheiro em Espécie</span>
                </button>
              </div>
            </div>

            {/* Post-Care & Return Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#52361D] mb-1">
                  Orientações Pós-Consulta / Cuidados
                </label>
                <input
                  type="text"
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] text-xs text-[#362312] focus:outline-none focus:border-[#8B623B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#52361D] mb-1">
                  Data Prevista de Retorno (Opcional)
                </label>
                <input
                  type="date"
                  value={nextAppointmentDate}
                  onChange={(e) => setNextAppointmentDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] text-xs text-[#362312] focus:outline-none focus:border-[#8B623B]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAE4DC]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#78695C] hover:text-[#362312] hover:bg-stone-100 transition-colors"
              >
                Voltar à Consulta
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#8B623B] hover:bg-[#6F4B2B] text-white shadow-lg shadow-[#8B623B]/20 flex items-center gap-2 transition-all hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" />
                Concluir Atendimento & Emitir Recibo
              </button>
            </div>
          </>
        ) : (
          /* Receipt / Confirmation Screen */
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F6EFE6] text-[#8B623B] border border-[#DCBF9E]/60 uppercase tracking-wider">
                Consulta Finalizada com Sucesso
              </span>
              <h3 className="text-xl font-bold text-[#362312] mt-2">
                Atendimento Concluído & Faturado!
              </h3>
              <p className="text-xs text-[#78695C] mt-1">
                Recibo Nº <strong className="font-mono text-[#8B623B]">{receiptNumber}</strong> emitido e vinculado ao prontuário.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] text-left text-xs space-y-3 max-w-md mx-auto">
              <div className="flex justify-between border-b border-[#EAE4DC] pb-2">
                <span className="text-[#78695C]">Paciente:</span>
                <span className="font-bold text-[#362312]">{patientName}</span>
              </div>
              <div className="flex justify-between border-b border-[#EAE4DC] pb-2">
                <span className="text-[#78695C]">Dentista:</span>
                <span className="font-bold text-[#362312]">{dentistName}</span>
              </div>
              <div className="flex justify-between border-b border-[#EAE4DC] pb-2">
                <span className="text-[#78695C]">Forma de Pagamento:</span>
                <span className="font-bold text-[#8B623B]">{paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-sm text-[#52361D]">Valor Total Pago:</span>
                <span className="font-mono font-extrabold text-base text-emerald-700">
                  R$ {(totalInCents / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-[#DCBF9E] text-xs font-semibold text-[#52361D] hover:bg-[#F6EFE6] flex items-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Imprimir Recibo
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#8B623B] hover:bg-[#6F4B2B] text-white text-xs font-bold shadow-md shadow-[#8B623B]/20"
              >
                Fechar & Voltar à Agenda
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
