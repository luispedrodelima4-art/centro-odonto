'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  ChevronRight, 
  Phone, 
  Mail, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Stethoscope
} from 'lucide-react';
import { PatientInfo } from '../lib/odontogramConfig';

export interface ExtendedPatientInfo extends PatientInfo {
  status?: 'IN_CONSULTATION' | 'WAITING' | 'SCHEDULED' | 'IDLE';
  alerts?: string[];
  lastVisit?: string;
}

interface PatientsListViewProps {
  patients: ExtendedPatientInfo[];
  selectedPatientId?: string;
  onSelectPatient: (patient: ExtendedPatientInfo) => void;
  onCreatePatient?: (patientData: Omit<PatientInfo, 'id'>) => Promise<void>;
}

export function PatientsListView({
  patients,
  selectedPatientId,
  onSelectPatient,
  onCreatePatient,
}: PatientsListViewProps) {
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('1995-04-12');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = patients.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.fullName.toLowerCase().includes(q) || p.documentCpf.includes(q);
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !cpf.trim()) return;

    try {
      setIsSubmitting(true);
      if (onCreatePatient) {
        await onCreatePatient({
          fullName: fullName.trim(),
          documentCpf: cpf.replace(/\D/g, ''),
          birthDate,
          phoneNumber: phone.trim() || '(11) 98765-4321',
          email: email.trim() || undefined,
        });
      }
      setShowCreateModal(false);
      setFullName('');
      setCpf('');
      setPhone('');
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'IN_CONSULTATION':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F6EFE6] text-[#8B623B] border border-[#DCBF9E] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B623B] animate-pulse" />
            Na Cadeira (Em Atendimento)
          </span>
        );
      case 'WAITING':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Na Recepção
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
            Prontuário Ativo
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="p-5 rounded-3xl bg-white border border-[#EAE4DC] flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-[#362312] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#8B623B]" />
            Manejo de Pacientes & Cadastros
          </h2>
          <p className="text-xs text-[#78695C] mt-0.5">
            Selecione um paciente para abrir o prontuário odontológico com os dentes 11 a 48.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-[#A67C52] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome ou CPF..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] text-xs text-[#362312] placeholder-[#A89C91] focus:outline-none focus:border-[#8B623B]"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#8B623B] hover:bg-[#6F4B2B] text-white shadow-md shadow-[#8B623B]/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Novo Paciente
          </button>
        </div>
      </div>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const isSelected = selectedPatientId === p.id;
          return (
            <div
              key={p.id}
              onClick={() => onSelectPatient(p)}
              className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'bg-white border-[#8B623B] shadow-md shadow-[#8B623B]/10 ring-2 ring-[#8B623B]'
                  : 'bg-white border-[#EAE4DC] hover:border-[#DCBF9E] hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F6EFE6] border border-[#DCBF9E]/60 flex items-center justify-center font-bold text-[#8B623B] text-base shadow-sm group-hover:bg-[#8B623B] group-hover:text-white transition-all">
                    {p.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  {getStatusBadge(p.status)}
                </div>

                <h3 className="text-sm font-bold text-[#362312] group-hover:text-[#8B623B] transition-colors">
                  {p.fullName}
                </h3>
                <div className="text-xs text-[#78695C] space-y-1 mt-2">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-stone-400">CPF:</span>
                    <span className="text-[#362312] font-semibold">{p.documentCpf}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#8B623B]" />
                    <span>{p.phoneNumber || '(11) 98765-4321'}</span>
                  </div>
                </div>

                {p.alerts && p.alerts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#EAE4DC] flex flex-wrap gap-1">
                    {p.alerts.map((al, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        {al}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#EAE4DC] flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#78695C]">
                  {isSelected ? 'Paciente Ativo na Cadeira' : 'Clique para atender'}
                </span>
                <span className="text-xs font-bold text-[#8B623B] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Abrir Prontuário <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Patient Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-lg bg-white border border-[#EAE4DC] rounded-3xl shadow-2xl p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-[#362312] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#8B623B]" />
              Cadastrar Novo Paciente na Clínica
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#52361D] mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Carlos Eduardo de Oliveira"
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] text-xs text-[#362312] focus:outline-none focus:border-[#8B623B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#52361D] mb-1">CPF (apenas números)</label>
                <input
                  type="text"
                  required
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="12345678900"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] text-xs text-[#362312] focus:outline-none focus:border-[#8B623B] font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#52361D] mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] text-xs text-[#362312] focus:outline-none focus:border-[#8B623B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#52361D] mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] text-xs text-[#362312] focus:outline-none focus:border-[#8B623B]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#52361D] mb-1">E-mail (Opcional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="paciente@email.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] text-xs text-[#362312] focus:outline-none focus:border-[#8B623B]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE4DC]">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78695C] hover:text-[#362312]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#8B623B] hover:bg-[#6F4B2B] text-white disabled:opacity-50"
              >
                Salvar Paciente
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
