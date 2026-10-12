'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Clock, 
  User, 
  Sparkles, 
  CheckCircle2, 
  FileCheck 
} from 'lucide-react';
import { ProgressNoteItem } from '../lib/odontogramConfig';

interface ClinicalNotesTimelineProps {
  notes: ProgressNoteItem[];
  onAddNote: (text: string) => Promise<void>;
  onSignNote: (noteId: string) => Promise<void>;
}

export function ClinicalNotesTimeline({
  notes,
  onAddNote,
  onSignNote,
}: ClinicalNotesTimelineProps) {
  const [newText, setNewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signingId, setSigningId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddNote(newText.trim());
      setNewText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSign = async (id: string) => {
    try {
      setSigningId(id);
      await onSignNote(id);
    } finally {
      setSigningId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* New Note Creator Box */}
      <div className="p-5 rounded-3xl bg-white border border-[#EAE4DC] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F6EFE6] text-[#8B623B] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#362312]">
                Registrar Nova Evolução Clínica
              </h3>
              <p className="text-[11px] text-[#78695C]">
                Descreva os procedimentos realizados, queixas do paciente e condutas adotadas.
              </p>
            </div>
          </div>
          <span className="text-[11px] text-[#78695C] font-mono">
            Dr. Carlos Eduardo &bull; CRO-SP 123456
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            rows={3}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Ex: Paciente compareceu para realização de restauração no elemento 16. Anestesia infiltrativa local (Articaína 4%). Preparo cavitário classe I, isolamento relativo, aplicação de ácido fosfórico 37% por 15s, adesivo e resina composta A2 fotopolimerizada em camadas. Ajuste oclusal e polimento satisfatórios."
            className="w-full p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] text-xs text-[#362312] placeholder-[#A89C91] focus:outline-none focus:border-[#8B623B] resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#78695C] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Todas as notas são lacradas digitalmente com hash criptográfico SHA-256.
            </span>

            <button
              type="submit"
              disabled={isSubmitting || !newText.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#8B623B] hover:bg-[#6F4B2B] text-white shadow-md shadow-[#8B623B]/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Salvar Evolução no Prontuário
            </button>
          </div>
        </form>
      </div>

      {/* Historical Notes Timeline */}
      <div className="space-y-3.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#78695C] px-1 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#8B623B]" />
          Histórico de Evoluções Clínicas do Paciente
        </h4>

        {notes.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#78695C] rounded-3xl bg-white border border-dashed border-[#DCBF9E]">
            Nenhuma evolução clínica registrada ainda.
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`p-5 rounded-3xl border transition-all ${
                note.isSigned
                  ? 'bg-white border-[#EAE4DC] shadow-sm'
                  : 'bg-[#FAF8F5] border-amber-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-[#EAE4DC]">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-[#362312]">
                    {note.professionalName}
                  </span>
                  <span className="text-[11px] text-[#78695C]">&bull;</span>
                  <span className="text-[11px] text-[#78695C]">
                    {note.signedAt || 'Registrado hoje'}
                  </span>
                </div>

                {note.isSigned ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Assinado Digitalmente & Lacrado
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={signingId === note.id}
                    onClick={() => handleSign(note.id)}
                    className="px-3 py-1 rounded-xl text-[11px] font-bold bg-[#8B623B] hover:bg-[#6F4B2B] text-white flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Lock className="w-3 h-3" />
                    Assinar com SHA-256
                  </button>
                )}
              </div>

              <p className="text-xs text-[#362312] leading-relaxed whitespace-pre-line font-normal">
                {note.text}
              </p>

              {note.isSigned && note.digitalSignatureHash && (
                <div className="mt-3 pt-2.5 border-t border-[#EAE4DC] flex items-center justify-between text-[10px] text-[#78695C]">
                  <span className="flex items-center gap-1">
                    <FileCheck className="w-3 h-3 text-emerald-600" />
                    Assinatura Criptográfica Válida (CFO/CFM):
                  </span>
                  <span className="font-mono text-[#8B623B] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EAE4DC]">
                    {note.digitalSignatureHash}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
