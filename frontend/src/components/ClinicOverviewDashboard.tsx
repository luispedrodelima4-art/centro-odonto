'use client';

import React from 'react';
import { 
  Activity, 
  Calendar, 
  Users, 
  Tag, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  Stethoscope, 
  AlertCircle, 
  Smile, 
  FileText 
} from 'lucide-react';

interface ClinicOverviewDashboardProps {
  onNavigate: (module: 'patients' | 'clinical-record' | 'procedures' | 'schedule') => void;
  activePatientName: string;
}

export function ClinicOverviewDashboard({
  onNavigate,
  activePatientName,
}: ClinicOverviewDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-white via-[#FAF8F5] to-[#F6EFE6] border border-[#EAE4DC] flex flex-wrap items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#F6EFE6] text-[#8B623B] border border-[#DCBF9E] uppercase tracking-wider">
              Centro Odonto &bull; Gestão Médica Integrada
            </span>
            <span className="text-xs text-[#78695C] font-semibold">Dr. Carlos Eduardo (CRO-SP 123456)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#362312] tracking-tight">
            Painel Executivo & Fluxos da Clínica
          </h2>
          <p className="text-xs text-[#52361D] leading-relaxed">
            Bem-vindo ao cockpit operacional da clínica. Acompanhe a esteira de atendimento da recepção até a cadeira odontológica com o prontuário dos dentes 11 a 48.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('clinical-record')}
            className="px-6 py-3 rounded-2xl text-xs font-bold bg-[#8B623B] hover:bg-[#6F4B2B] text-white shadow-lg shadow-[#8B623B]/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Stethoscope className="w-4 h-4" />
            Atender {activePatientName}
          </button>
        </div>
      </div>

      {/* Quick KPI stats in warm clinical white/brown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#EAE4DC] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-semibold text-[#78695C] uppercase tracking-wider block">Pacientes Hoje</span>
            <span className="text-2xl font-bold text-[#362312] font-mono">5</span>
            <span className="text-[10px] text-[#8B623B] font-semibold block mt-0.5">1 em consulta agora</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#F6EFE6] flex items-center justify-center text-[#8B623B]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EAE4DC] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-semibold text-[#78695C] uppercase tracking-wider block">Na Recepção</span>
            <span className="text-2xl font-bold text-amber-800 font-mono">1</span>
            <span className="text-[10px] text-[#78695C] block mt-0.5">Roberto de Andrade</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EAE4DC] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-semibold text-[#78695C] uppercase tracking-wider block">Total Orçado (Mês)</span>
            <span className="text-xl font-bold text-emerald-800 font-mono">R$ 4.850,00</span>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Procedimentos aprovados</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EAE4DC] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-semibold text-[#78695C] uppercase tracking-wider block">Tabela da Clínica</span>
            <span className="text-2xl font-bold text-[#362312] font-mono">12</span>
            <span className="text-[10px] text-[#8B623B] font-semibold block mt-0.5">Procedimentos próprios</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#F6EFE6] flex items-center justify-center text-[#8B623B]">
            <Tag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Guide to Clinic Flows */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAE4DC] space-y-4 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-[#362312] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B623B]" />
            Guia dos Fluxos do Consultório
          </h3>
          <p className="text-xs text-[#78695C] mt-0.5">
            Clique em qualquer fluxo para acessar e demonstrar ao expert de domínio:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Card 1: Cockpit Clínico 11 a 48 */}
          <div
            onClick={() => onNavigate('clinical-record')}
            className="p-5 rounded-3xl bg-[#FAF8F5] border border-[#DCBF9E]/80 hover:border-[#8B623B] transition-all cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-md"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#F6EFE6] text-[#8B623B] flex items-center justify-center mb-3">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#362312] group-hover:text-[#8B623B] transition-colors">
                1. Dentes & Prontuário (11 a 48)
              </h4>
              <p className="text-[11px] text-[#78695C] mt-1 leading-relaxed">
                A tela principal da cadeira odontológica: lista direta dos 32 dentes (FDI), condições clínicas, faces e lançamento de tratamentos.
              </p>
            </div>
            <span className="text-[11px] text-[#8B623B] font-bold flex items-center gap-1 mt-4">
              Acessar Cockpit Clínico <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 2: Gestão de Pacientes */}
          <div
            onClick={() => onNavigate('patients')}
            className="p-5 rounded-3xl bg-[#FAF8F5] border border-[#EAE4DC] hover:border-[#8B623B] transition-all cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-md"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#F6EFE6] text-[#8B623B] flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#362312] group-hover:text-[#8B623B] transition-colors">
                2. Pacientes & Cadastros
              </h4>
              <p className="text-[11px] text-[#78695C] mt-1 leading-relaxed">
                Cadastro de pacientes com CPF, telefone, alertas de saúde e histórico clínico para atendimento.
              </p>
            </div>
            <span className="text-[11px] text-[#8B623B] font-bold flex items-center gap-1 mt-4">
              Ver Pacientes <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 3: Esteira de Atendimento */}
          <div
            onClick={() => onNavigate('schedule')}
            className="p-5 rounded-3xl bg-[#FAF8F5] border border-[#EAE4DC] hover:border-[#8B623B] transition-all cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-md"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#362312] group-hover:text-amber-800 transition-colors">
                3. Esteira & Recepção (Kanban)
              </h4>
              <p className="text-[11px] text-[#78695C] mt-1 leading-relaxed">
                Fluxo completo da recepção: Agendado &rarr; Confirmado &rarr; Na Sala de Espera &rarr; Na Cadeira &rarr; Concluído.
              </p>
            </div>
            <span className="text-[11px] text-[#8B623B] font-bold flex items-center gap-1 mt-4">
              Ver Esteira do Dia <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 4: Tabela da Clínica */}
          <div
            onClick={() => onNavigate('procedures')}
            className="p-5 rounded-3xl bg-[#FAF8F5] border border-[#EAE4DC] hover:border-[#8B623B] transition-all cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-md"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Tag className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#362312] group-hover:text-emerald-800 transition-colors">
                4. Tabela da Clínica
              </h4>
              <p className="text-[11px] text-[#78695C] mt-1 leading-relaxed">
                Catálogo de serviços e preços próprios da clínica em R$, sem códigos burocráticos TUSS.
              </p>
            </div>
            <span className="text-[11px] text-[#8B623B] font-bold flex items-center gap-1 mt-4">
              Ver Tabela de Preços <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
