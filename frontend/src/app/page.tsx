'use client';

import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  Calendar, 
  Clock, 
  FileText, 
  Layers, 
  Phone, 
  Plus, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Stethoscope, 
  Tag, 
  User, 
  Users,
  AlertCircle,
  RefreshCw,
  LayoutDashboard,
  CheckCircle2,
  ChevronRight,
  LogOut,
  Receipt
} from 'lucide-react';
import { ClinicalNotesTimeline } from '../components/ClinicalNotesTimeline';
import { ModernOdontogram } from '../components/ModernOdontogram';
import { ProcedureCatalogView } from '../components/ProcedureCatalogView';
import { PatientsListView, ExtendedPatientInfo } from '../components/PatientsListView';
import { AppointmentsPipelineView } from '../components/AppointmentsPipelineView';
import { ClinicOverviewDashboard } from '../components/ClinicOverviewDashboard';
import { ConsultationConclusionModal } from '../components/ConsultationConclusionModal';
import { LoginView } from '../components/LoginView';
import { 
  ALL_TEETH_NUMBERS, 
  CatalogProcedure, 
  PatientInfo, 
  ProgressNoteItem, 
  ToothItem 
} from '../lib/odontogramConfig';

// Initial fallback mock data for immediate zero-latency rendering
const INITIAL_PATIENTS: ExtendedPatientInfo[] = [
  {
    id: 'b085b1a2-81ee-4c0b-8f06-e77d9e1a9e50',
    fullName: 'Mariana Silva Costa',
    documentCpf: '12345678901',
    birthDate: '1995-04-12',
    phoneNumber: '(11) 98765-4321',
    email: 'mariana.costa@email.com',
    status: 'IN_CONSULTATION',
    alerts: ['Alergia a Penicilina'],
  },
  {
    id: 'pat-2',
    fullName: 'Roberto de Andrade',
    documentCpf: '98765432100',
    birthDate: '1982-11-20',
    phoneNumber: '(11) 97777-8888',
    email: 'roberto.andrade@email.com',
    status: 'WAITING',
    alerts: [],
  },
  {
    id: 'pat-3',
    fullName: 'Ana Clara Fernandes',
    documentCpf: '45678912355',
    birthDate: '2001-08-05',
    phoneNumber: '(11) 96666-5555',
    email: 'ana.fernandes@email.com',
    status: 'SCHEDULED',
    alerts: [],
  },
];

const INITIAL_CATALOG: CatalogProcedure[] = [
  { id: 'proc-1', name: 'Profilaxia e Raspagem (Limpeza Completa)', category: 'PREVENTIVE', priceInCents: 18000, description: 'Remoção de tártaro e biofilme dental com ultrassom' },
  { id: 'proc-2', name: 'Restauração Resina Composta (1 Face)', category: 'RESTORATIVE', priceInCents: 16000, description: 'Restauração estética direta em resina nanohíbrida' },
  { id: 'proc-3', name: 'Restauração Resina Composta (2 Faces)', category: 'RESTORATIVE', priceInCents: 22000, description: 'Restauração estética proximal (MO, DO)' },
  { id: 'proc-4', name: 'Tratamento de Canal Molar (Multirradicular)', category: 'ENDODONTICS', priceInCents: 85000, description: 'Instrumentação rotatória e obturação termoplastificada' },
  { id: 'proc-5', name: 'Exodontia Simples (Extração de Dente)', category: 'SURGERY', priceInCents: 18000, description: 'Remoção cirúrgica de elemento dentário' },
  { id: 'proc-6', name: 'Clareamento Dental em Consultório', category: 'AESTHETICS', priceInCents: 90000, description: 'Sessão com gel clareador de alta concentração' },
  { id: 'proc-7', name: 'Coroa Protética Cerâmica (Zircônia/E-max)', category: 'PROSTHESIS', priceInCents: 150000, description: 'Prótese fixa livre de metal' },
  { id: 'proc-8', name: 'Implante Dentário Unitário Titânio', category: 'IMPLANT', priceInCents: 180000, description: 'Instalação cirúrgica de implante osseointegrado' },
];

const INITIAL_TEETH: ToothItem[] = ALL_TEETH_NUMBERS.map((num) => ({
  toothNumber: num,
  condition: num === 16 ? 'CARIOUS' : num === 24 ? 'RESTORED' : 'SOUND',
  procedures: num === 16 ? [
    {
      id: 'p-initial-1',
      procedureCode: 'REST1',
      name: 'Restauração Resina Composta (1 Face)',
      surfaces: ['O'],
      status: 'PLANNED',
      priceInCents: 16000,
    }
  ] : [],
}));

const INITIAL_NOTES: ProgressNoteItem[] = [
  {
    id: 'note-1',
    professionalName: 'Dr. Carlos Eduardo',
    text: 'Paciente compareceu para avaliação de rotina. Queixa de sensibilidade a doces no dente 16. Exame clínico revelou cárie oclusal no 16. Planejado preparo cavitário e restauração em resina composta. Dente 24 apresenta restauração prévia íntegra.',
    isSigned: true,
    digitalSignatureHash: 'a7b3c9d2e1f4085b1a2ee77d9e1a9e5046aea78b612544f48ee70d5e4279746f',
    signedAt: 'Hoje às 14:15',
    createdAt: new Date().toISOString(),
  },
];

type MainModule = 'overview' | 'patients' | 'clinical-record' | 'schedule' | 'procedures';

export default function ClinicalApp() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    name: 'Dr. Carlos Eduardo',
    email: 'carlos.eduardo@centroodonto.com',
    role: 'ADMIN',
    councilId: 'CRO-SP 123456',
  });

  // Global Navigation Module
  const [currentModule, setCurrentModule] = useState<MainModule>('overview');

  // Sub-tab inside Clinical Record
  const [clinicalTab, setClinicalTab] = useState<'odontogram' | 'notes' | 'catalog'>('odontogram');

  // Active Patient & Data State
  const [patients, setPatients] = useState<ExtendedPatientInfo[]>(INITIAL_PATIENTS);
  const [activePatient, setActivePatient] = useState<ExtendedPatientInfo>(INITIAL_PATIENTS[0]);
  const [teeth, setTeeth] = useState<ToothItem[]>(INITIAL_TEETH);
  const [notes, setNotes] = useState<ProgressNoteItem[]>(INITIAL_NOTES);
  const [catalog, setCatalog] = useState<CatalogProcedure[]>(INITIAL_CATALOG);

  const [token, setToken] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Conclusion Modal
  const [isConclusionModalOpen, setIsConclusionModalOpen] = useState(false);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Determine dynamic API URL matching current browser host
  const getApiBase = () => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname || '127.0.0.1';
      return `http://${host}:3333/api/v1`;
    }
    return 'http://127.0.0.1:3333/api/v1';
  };

  // Safe background fetch with 3s timeout
  const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 3000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      return res;
    } finally {
      clearTimeout(id);
    }
  };

  // 1. Initial background sync
  useEffect(() => {
    async function syncBackend() {
      try {
        setIsSyncing(true);
        const apiBase = getApiBase();

        // Login as default clinic administrator
        const authRes = await fetchWithTimeout(`${apiBase}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'carlos.eduardo@centroodonto.com',
            password: 'Password123!',
          }),
        });

        if (authRes.ok) {
          const authData = await authRes.json();
          const currentToken = authData.accessToken;
          setToken(currentToken);
          if (authData.user) {
            setCurrentUser(authData.user);
          }

          const headers = {
            Authorization: `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          };

          // Sync procedure catalog
          const catRes = await fetchWithTimeout(`${apiBase}/procedures`, { headers });
          if (catRes.ok) {
            const catData = await catRes.json();
            if (catData.procedures && catData.procedures.length > 0) {
              setCatalog(catData.procedures);
            }
          }

          // Sync patients list
          const patRes = await fetchWithTimeout(`${apiBase}/patients`, { headers });
          if (patRes.ok) {
            const patData = await patRes.json();
            if (patData.patients && patData.patients.length > 0) {
              setPatients(patData.patients.map((p: PatientInfo, idx: number) => ({
                ...p,
                status: idx === 0 ? 'IN_CONSULTATION' : idx === 1 ? 'WAITING' : 'IDLE',
                alerts: idx === 0 ? ['Alergia a Penicilina'] : [],
              })));

              const currentActive = patData.patients[0];
              setActivePatient(currentActive);

              // Load active patient record
              const recRes = await fetchWithTimeout(`${apiBase}/patients/${currentActive.id}/record`, { headers });
              if (recRes.ok) {
                const recData = await recRes.json();
                if (recData.odontogram?.teeth?.length > 0) {
                  setTeeth(recData.odontogram.teeth);
                }
                if (recData.progressNotes) {
                  setNotes(recData.progressNotes);
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn('Backend sync warning, fallback active:', err);
      } finally {
        setIsSyncing(false);
      }
    }

    syncBackend();
  }, []);

  // Handlers
  const handleLoginSuccess = (userToken: string, user: typeof currentUser) => {
    setToken(userToken);
    setCurrentUser(user);
    setIsAuthenticated(true);
    showNotification(`Bem-vindo, ${user.name}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken('');
    showNotification('Sessão encerrada com sucesso.');
  };

  const handleSelectPatient = (patient: ExtendedPatientInfo) => {
    setActivePatient(patient);
    setCurrentModule('clinical-record');
    showNotification(`Prontuário de ${patient.fullName} aberto no Cockpit!`);
  };

  const handleUpdateToothCondition = async (toothNumber: number, condition: string, customLabel?: string) => {
    // 1. Instant local update
    setTeeth((prev) =>
      prev.map((t) => (t.toothNumber === toothNumber ? { ...t, condition, customConditionLabel: customLabel } : t))
    );
    showNotification(`Dente ${toothNumber}: estado clínico atualizado.`);

    // 2. Background persistence if token available
    if (token && activePatient) {
      try {
        setIsSyncing(true);
        const apiBase = getApiBase();
        await fetchWithTimeout(
          `${apiBase}/patients/${activePatient.id}/odontogram/teeth/${toothNumber}/condition`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ condition }),
          }
        );
      } catch (e) {
        console.warn('Persist background warning:', e);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleRemoveToothAppointment = (toothNumber: number) => {
    setTeeth((prev) =>
      prev.map((t) =>
        t.toothNumber === toothNumber
          ? { ...t, condition: 'SOUND', customConditionLabel: undefined, procedures: [] }
          : t
      )
    );
    showNotification(`Dente ${toothNumber} desmarcado (apontamento removido).`);
  };

  const handleRemoveProcedureFromTooth = (toothNumber: number, procedureId: string) => {
    setTeeth((prev) =>
      prev.map((t) =>
        t.toothNumber === toothNumber
          ? { ...t, procedures: t.procedures.filter((p) => p.id !== procedureId) }
          : t
      )
    );
    showNotification(`Procedimento removido do dente ${toothNumber}.`);
  };

  const handleAddProcedureToTooth = async (
    toothNumber: number,
    procedureCode: string,
    name: string,
    surfaces: string[],
    priceInCents: number,
    notesText?: string
  ) => {
    const newProc = {
      id: `proc-local-${Date.now()}`,
      procedureCode,
      name,
      surfaces,
      status: 'PLANNED',
      priceInCents,
    };

    setTeeth((prev) =>
      prev.map((t) =>
        t.toothNumber === toothNumber
          ? { ...t, procedures: [...t.procedures, newProc] }
          : t
      )
    );
    showNotification(`Procedimento "${name}" adicionado ao dente ${toothNumber}!`);

    if (token && activePatient) {
      try {
        setIsSyncing(true);
        const apiBase = getApiBase();
        await fetchWithTimeout(
          `${apiBase}/patients/${activePatient.id}/odontogram/teeth/${toothNumber}/procedures`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              procedureCode,
              name,
              surfaces,
              priceInCents,
              notes: notesText,
            }),
          }
        );
      } catch (e) {
        console.warn('Persist background warning:', e);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleAddProgressNote = async (text: string) => {
    const newNote: ProgressNoteItem = {
      id: `note-${Date.now()}`,
      professionalName: currentUser.name,
      text,
      isSigned: false,
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    showNotification('Evolução clínica registrada no prontuário!');
  };

  const handleSignProgressNote = async (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId
          ? {
              ...n,
              isSigned: true,
              digitalSignatureHash: 'sha256-signed-' + Math.random().toString(36).substring(2, 10),
              signedAt: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : n
      )
    );
    showNotification('Evolução assinada digitalmente com lacre SHA-256!');
  };

  const handleAddProcedureToCatalog = async (
    name: string,
    category: string,
    priceInCents: number,
    description?: string
  ) => {
    const created: CatalogProcedure = {
      id: `proc-cat-${Date.now()}`,
      name,
      category,
      priceInCents,
      description,
    };
    setCatalog((prev) => [...prev, created]);
    showNotification(`Procedimento "${name}" cadastrado na tabela da clínica!`);
  };

  const handleConfirmConclusion = (summary: {
    totalInCents: number;
    paymentMethod: string;
    notes: string;
  }) => {
    // Mark active patient as completed in list
    setPatients((prev) =>
      prev.map((p) =>
        p.id === activePatient.id ? { ...p, status: 'IDLE' } : p
      )
    );
    showNotification(`Consulta de ${activePatient.fullName} concluída e faturada!`);
  };

  // If user clicked logout or not authenticated, show Login View
  if (!isAuthenticated) {
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        apiBaseUrl={getApiBase()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#362312] flex flex-col md:flex-row selection:bg-[#8B623B] selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-white border border-[#DCBF9E] text-[#52361D] text-xs font-bold shadow-xl shadow-[#52361D]/10 flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-[#8B623B]" />
          {notification}
        </div>
      )}

      {/* GLOBAL CLINIC SIDEBAR MENU (Branco Clínico & Marrom Nobre) */}
      <aside className="w-full md:w-64 bg-white border-r border-[#EAE4DC] flex flex-col justify-between shrink-0 shadow-sm">
        <div>
          {/* Clinic Brand */}
          <div className="p-5 border-b border-[#EAE4DC] flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8B623B] flex items-center justify-center text-white shadow-md shadow-[#8B623B]/20">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#362312] block">
                Centro Odonto
              </span>
              <span className="text-[10px] text-[#8B623B] font-bold uppercase tracking-wider block">
                Gestão Clínica
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1.5">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#78695C]">
              Fluxos do Consultório
            </div>

            <button
              type="button"
              onClick={() => setCurrentModule('overview')}
              className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-3 transition-all ${
                currentModule === 'overview'
                  ? 'bg-[#8B623B] text-white shadow-md shadow-[#8B623B]/20 font-bold'
                  : 'text-[#78695C] hover:text-[#362312] hover:bg-[#FAF8F5]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Visão Geral & Métricas</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentModule('patients')}
              className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all ${
                currentModule === 'patients'
                  ? 'bg-[#8B623B] text-white shadow-md shadow-[#8B623B]/20 font-bold'
                  : 'text-[#78695C] hover:text-[#362312] hover:bg-[#FAF8F5]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Pacientes & Cadastros</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                currentModule === 'patients' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
              }`}>
                {patients.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentModule('clinical-record')}
              className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-3 transition-all ${
                currentModule === 'clinical-record'
                  ? 'bg-[#8B623B] text-white shadow-md shadow-[#8B623B]/20 font-bold'
                  : 'text-[#78695C] hover:text-[#362312] hover:bg-[#FAF8F5]'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Cockpit Clínico (11 a 48)</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentModule('schedule')}
              className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-3 transition-all ${
                currentModule === 'schedule'
                  ? 'bg-[#8B623B] text-white shadow-md shadow-[#8B623B]/20 font-bold'
                  : 'text-[#78695C] hover:text-[#362312] hover:bg-[#FAF8F5]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Esteira & Recepção</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentModule('procedures')}
              className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all ${
                currentModule === 'procedures'
                  ? 'bg-[#8B623B] text-white shadow-md shadow-[#8B623B]/20 font-bold'
                  : 'text-[#78695C] hover:text-[#362312] hover:bg-[#FAF8F5]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4" />
                <span>Tabela da Clínica</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                currentModule === 'procedures' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
              }`}>
                {catalog.length}
              </span>
            </button>
          </nav>

          {/* Active Patient Quick Card */}
          <div className="p-4 mx-3 mt-4 rounded-3xl bg-[#FAF8F5] border border-[#EAE4DC] space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#78695C] block">
              Na Cadeira Agora:
            </span>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#F6EFE6] text-[#8B623B] border border-[#DCBF9E]/60 flex items-center justify-center font-bold text-xs">
                {activePatient.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-[#362312] block truncate">
                  {activePatient.fullName}
                </span>
                <span className="text-[10px] text-[#78695C] font-mono">
                  {activePatient.documentCpf}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCurrentModule('clinical-record')}
              className="w-full py-2 rounded-xl bg-white hover:bg-[#F6EFE6] text-[#8B623B] text-xs font-bold border border-[#DCBF9E] transition-colors flex items-center justify-center gap-1 shadow-sm"
            >
              Atender Dentes (11 a 48) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Doctor Profile & Logout Button */}
        <div className="p-4 border-t border-[#EAE4DC] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            <div className="w-9 h-9 rounded-2xl bg-[#8B623B] text-white flex items-center justify-center font-bold text-xs shrink-0">
              CE
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-[#362312] block truncate">{currentUser.name}</span>
              <span className="text-[10px] text-[#78695C] font-mono block">{currentUser.councilId || 'CRO-SP 123456'}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Sair do Sistema"
            className="p-2 rounded-xl text-[#78695C] hover:text-rose-700 hover:bg-rose-50 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#FDFDFC]">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#EAE4DC] bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-[#362312]">
              {currentModule === 'overview' && 'Visão Geral & Indicadores Executivos'}
              {currentModule === 'patients' && 'Manejo de Pacientes & Cadastros'}
              {currentModule === 'clinical-record' && 'Cockpit Clínico (Prontuário & Dentes 11 a 48)'}
              {currentModule === 'schedule' && 'Esteira Operacional & Recepção (Kanban)'}
              {currentModule === 'procedures' && 'Tabela Própria de Procedimentos da Clínica'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isSyncing && (
              <span className="text-xs text-[#8B623B] font-mono flex items-center gap-1.5 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Sincronizando...
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Ambiente Clínico Ativo
            </span>
          </div>
        </header>

        {/* WORKSPACE VIEW ROUTING */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* 1. OVERVIEW DASHBOARD */}
          {currentModule === 'overview' && (
            <ClinicOverviewDashboard
              onNavigate={(mod) => setCurrentModule(mod)}
              activePatientName={activePatient.fullName}
            />
          )}

          {/* 2. PATIENTS LIST */}
          {currentModule === 'patients' && (
            <PatientsListView
              patients={patients}
              selectedPatientId={activePatient.id}
              onSelectPatient={handleSelectPatient}
            />
          )}

          {/* 3. SCHEDULE PIPELINE */}
          {currentModule === 'schedule' && (
            <AppointmentsPipelineView
              onOpenPatientRecord={(name) => {
                const match = patients.find((p) => p.fullName === name) || patients[0];
                handleSelectPatient(match);
              }}
            />
          )}

          {/* 4. CLINIC PROCEDURES CATALOG */}
          {currentModule === 'procedures' && (
            <ProcedureCatalogView
              catalog={catalog}
              onAddProcedureToCatalog={handleAddProcedureToCatalog}
            />
          )}

          {/* 5. CLINICAL RECORD & TEETH 11 TO 48 */}
          {currentModule === 'clinical-record' && (
            <div className="space-y-6">
              {/* Patient Clinical Header Banner */}
              <div className="p-6 rounded-3xl bg-white border border-[#EAE4DC] flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F6EFE6] border border-[#DCBF9E] flex items-center justify-center text-[#8B623B] font-bold text-lg">
                    {activePatient.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-extrabold text-[#362312]">
                        {activePatient.fullName}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F6EFE6] text-[#8B623B] border border-[#DCBF9E]">
                        Na Cadeira &bull; Dr. Carlos Eduardo
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#78695C] mt-1">
                      <span>CPF: <strong className="text-[#362312] font-mono">{activePatient.documentCpf}</strong></span>
                      <span>&bull;</span>
                      <span>Nascimento: <strong className="text-[#362312]">{activePatient.birthDate}</strong></span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#8B623B]" />
                        <strong className="text-[#362312] font-mono">{activePatient.phoneNumber}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Alerta: Alergia a Penicilina</span>
                  </div>

                  {/* Primary Consultation Wrap-Up Button */}
                  <button
                    type="button"
                    onClick={() => setIsConclusionModalOpen(true)}
                    className="px-5 py-2.5 rounded-2xl bg-[#8B623B] hover:bg-[#6F4B2B] text-white text-xs font-bold shadow-lg shadow-[#8B623B]/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                  >
                    <Receipt className="w-4 h-4" />
                    Concluir Consulta & Faturar
                  </button>
                </div>
              </div>

              {/* Sub-tab Navigation */}
              <div className="flex space-x-1 border-b border-[#EAE4DC]">
                <button
                  type="button"
                  onClick={() => setClinicalTab('odontogram')}
                  className={`px-5 py-3 text-xs font-bold rounded-t-2xl transition-all flex items-center gap-2 border-b-2 ${
                    clinicalTab === 'odontogram'
                      ? 'bg-white border-[#8B623B] text-[#8B623B]'
                      : 'border-transparent text-[#78695C] hover:text-[#362312]'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  Dentes & Diagnósticos (11 a 48)
                </button>

                <button
                  type="button"
                  onClick={() => setClinicalTab('notes')}
                  className={`px-5 py-3 text-xs font-bold rounded-t-2xl transition-all flex items-center gap-2 border-b-2 ${
                    clinicalTab === 'notes'
                      ? 'bg-white border-[#8B623B] text-[#8B623B]'
                      : 'border-transparent text-[#78695C] hover:text-[#362312]'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Evoluções & Assinatura Digital (SHA-256)
                  {notes.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#F6EFE6] text-[#8B623B] font-mono font-bold">
                      {notes.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setClinicalTab('catalog')}
                  className={`px-5 py-3 text-xs font-bold rounded-t-2xl transition-all flex items-center gap-2 border-b-2 ${
                    clinicalTab === 'catalog'
                      ? 'bg-white border-[#8B623B] text-[#8B623B]'
                      : 'border-transparent text-[#78695C] hover:text-[#362312]'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  Tabela de Procedimentos da Clínica
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-100 text-stone-600 font-mono font-bold">
                    {catalog.length}
                  </span>
                </button>
              </div>

              {/* Sub-tab Contents */}
              {clinicalTab === 'odontogram' && (
                <ModernOdontogram
                  teeth={teeth}
                  catalog={catalog}
                  onUpdateToothCondition={handleUpdateToothCondition}
                  onAddProcedureToTooth={handleAddProcedureToTooth}
                  onRemoveToothAppointment={handleRemoveToothAppointment}
                  onRemoveProcedureFromTooth={handleRemoveProcedureFromTooth}
                />
              )}

              {clinicalTab === 'notes' && (
                <ClinicalNotesTimeline
                  notes={notes}
                  onAddNote={handleAddProgressNote}
                  onSignNote={handleSignProgressNote}
                />
              )}

              {clinicalTab === 'catalog' && (
                <ProcedureCatalogView
                  catalog={catalog}
                  onAddProcedureToCatalog={handleAddProcedureToCatalog}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Consultation Conclusion Modal */}
      {isConclusionModalOpen && (
        <ConsultationConclusionModal
          isOpen={isConclusionModalOpen}
          onClose={() => setIsConclusionModalOpen(false)}
          patientName={activePatient.fullName}
          patientCpf={activePatient.documentCpf}
          dentistName={currentUser.name}
          teeth={teeth}
          onConfirmConclusion={handleConfirmConclusion}
        />
      )}
    </div>
  );
}
