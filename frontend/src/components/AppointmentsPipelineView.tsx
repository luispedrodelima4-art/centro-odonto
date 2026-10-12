'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ChevronRight, 
  Plus, 
  Sparkles,
  Stethoscope,
  Smile
} from 'lucide-react';

export interface AppointmentCard {
  id: string;
  patientName: string;
  time: string;
  dentistName: string;
  procedureSummary: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_RECEPTION' | 'IN_CONSULTATION' | 'COMPLETED';
}

const INITIAL_APPOINTMENTS: AppointmentCard[] = [
  {
    id: 'app-1',
    patientName: 'Mariana Silva Costa',
    time: '14:00',
    dentistName: 'Dr. Carlos Eduardo',
    procedureSummary: 'Avaliação & Restauração 16',
    status: 'IN_CONSULTATION',
  },
  {
    id: 'app-2',
    patientName: 'Roberto de Andrade',
    time: '14:45',
    dentistName: 'Dr. Carlos Eduardo',
    procedureSummary: 'Limpeza & Profilaxia Completa',
    status: 'IN_RECEPTION',
  },
  {
    id: 'app-3',
    patientName: 'Ana Clara Fernandes',
    time: '15:30',
    dentistName: 'Dr. Carlos Eduardo',
    procedureSummary: 'Manutenção de Aparelho Ortodôntico',
    status: 'CONFIRMED',
  },
  {
    id: 'app-4',
    patientName: 'Lucas Gabriel Moreira',
    time: '16:15',
    dentistName: 'Dr. Carlos Eduardo',
    procedureSummary: 'Avaliação Inicial de Canal (Endodontia)',
    status: 'SCHEDULED',
  },
  {
    id: 'app-5',
    patientName: 'Beatriz Almeida',
    time: '11:00',
    dentistName: 'Dr. Carlos Eduardo',
    procedureSummary: 'Exodontia Simples Dente 38',
    status: 'COMPLETED',
  },
];

interface AppointmentsPipelineViewProps {
  onOpenPatientRecord?: (patientName: string) => void;
}

export function AppointmentsPipelineView({ onOpenPatientRecord }: AppointmentsPipelineViewProps) {
  const [appointments, setAppointments] = useState<AppointmentCard[]>(INITIAL_APPOINTMENTS);

  const moveStatus = (id: string, newStatus: AppointmentCard['status']) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  const columns = [
    {
      key: 'SCHEDULED',
      title: '1. Agendados',
      desc: 'Aguardando confirmação',
      borderColor: 'border-stone-200',
      bgColor: 'bg-stone-50/50',
      badge: 'bg-stone-100 text-stone-700',
    },
    {
      key: 'CONFIRMED',
      title: '2. Confirmados',
      desc: 'Confirmado por WhatsApp',
      borderColor: 'border-[#DCBF9E]',
      bgColor: 'bg-[#FAF8F5]',
      badge: 'bg-[#F6EFE6] text-[#8B623B]',
    },
    {
      key: 'IN_RECEPTION',
      title: '3. Na Recepção',
      desc: 'Aguardando na sala de espera',
      borderColor: 'border-amber-200',
      bgColor: 'bg-amber-50/30',
      badge: 'bg-amber-100 text-amber-800',
    },
    {
      key: 'IN_CONSULTATION',
      title: '4. Na Cadeira (Em Consulta)',
      desc: 'Atendimento clínico em curso',
      borderColor: 'border-[#8B623B]',
      bgColor: 'bg-[#F6EFE6]/50',
      badge: 'bg-[#8B623B] text-white',
    },
    {
      key: 'COMPLETED',
      title: '5. Concluídos',
      desc: 'Consulta finalizada',
      borderColor: 'border-emerald-200',
      bgColor: 'bg-emerald-50/30',
      badge: 'bg-emerald-100 text-emerald-800',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-white border border-[#EAE4DC] flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-[#362312] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#8B623B]" />
            Esteira de Atendimento & Recepção (Kanban Operacional)
          </h2>
          <p className="text-xs text-[#78695C] mt-0.5">
            Acompanhe o fluxo da clínica em tempo real: da chegada na recepção até a alta na cadeira odontológica.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#52361D] bg-[#FAF8F5] px-3.5 py-2 rounded-2xl border border-[#EAE4DC]">
          <Clock className="w-4 h-4 text-[#8B623B]" />
          <span>Agenda do Dia: <strong>Hoje, 12 de Outubro</strong></span>
        </div>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {columns.map((col) => {
          const colItems = appointments.filter((a) => a.status === col.key);

          return (
            <div
              key={col.key}
              className={`p-4 rounded-3xl border flex flex-col justify-between min-h-[480px] bg-white ${col.borderColor} shadow-sm`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold text-[#362312]">{col.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.badge}`}>
                    {colItems.length}
                  </span>
                </div>
                <p className="text-[10px] text-[#78695C] mb-3">{col.desc}</p>

                <div className="space-y-2.5">
                  {colItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] hover:border-[#8B623B] transition-all shadow-sm space-y-2 group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[#8B623B] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.time}
                        </span>
                        <span className="text-[10px] text-[#78695C] truncate max-w-[90px]">
                          {item.dentistName}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#362312] leading-tight group-hover:text-[#8B623B] transition-colors">
                        {item.patientName}
                      </h4>

                      <div className="text-[11px] text-[#52361D] bg-white p-2 rounded-xl border border-[#EAE4DC]/80 font-medium">
                        {item.procedureSummary}
                      </div>

                      {/* Workflow action buttons */}
                      <div className="pt-2 border-t border-[#EAE4DC] flex items-center justify-between gap-1 text-[10px]">
                        {onOpenPatientRecord && (
                          <button
                            type="button"
                            onClick={() => onOpenPatientRecord(item.patientName)}
                            className="text-[#8B623B] hover:text-[#6F4B2B] font-bold"
                          >
                            Ver Prontuário
                          </button>
                        )}

                        {col.key === 'SCHEDULED' && (
                          <button
                            type="button"
                            onClick={() => moveStatus(item.id, 'CONFIRMED')}
                            className="px-2.5 py-1 rounded-xl bg-[#F6EFE6] hover:bg-[#EBDCCB] text-[#52361D] font-bold ml-auto transition-colors"
                          >
                            Confirmar
                          </button>
                        )}

                        {col.key === 'CONFIRMED' && (
                          <button
                            type="button"
                            onClick={() => moveStatus(item.id, 'IN_RECEPTION')}
                            className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold ml-auto transition-colors"
                          >
                            Chegou
                          </button>
                        )}

                        {col.key === 'IN_RECEPTION' && (
                          <button
                            type="button"
                            onClick={() => moveStatus(item.id, 'IN_CONSULTATION')}
                            className="px-2.5 py-1 rounded-xl bg-[#8B623B] hover:bg-[#6F4B2B] text-white font-bold ml-auto flex items-center gap-1 shadow-sm transition-all"
                          >
                            <Stethoscope className="w-3 h-3" /> Chamar
                          </button>
                        )}

                        {col.key === 'IN_CONSULTATION' && (
                          <button
                            type="button"
                            onClick={() => moveStatus(item.id, 'COMPLETED')}
                            className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold ml-auto flex items-center gap-1 shadow-sm transition-all"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Concluir
                          </button>
                        )}

                        {col.key === 'COMPLETED' && (
                          <span className="text-emerald-700 font-bold ml-auto flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Atendido
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
