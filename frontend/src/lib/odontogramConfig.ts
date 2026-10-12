export interface ProcedureItem {
  id: string;
  procedureCode: string;
  name: string;
  surfaces: string[];
  status: string;
  priceInCents: number;
  completedAt?: string;
}

export interface ToothItem {
  toothNumber: number;
  condition: string;
  customConditionLabel?: string;
  notes?: string;
  procedures: ProcedureItem[];
}

export interface CatalogProcedure {
  id: string;
  name: string;
  category: string;
  priceInCents: number;
  description?: string;
}

export interface PatientInfo {
  id: string;
  fullName: string;
  documentCpf: string;
  birthDate: string;
  phoneNumber: string;
  email?: string;
}

export interface ProgressNoteItem {
  id: string;
  professionalName: string;
  text: string;
  isSigned: boolean;
  digitalSignatureHash?: string;
  signedAt?: string;
  createdAt: string;
}

// FDI 32 Adult Teeth: 11-18, 21-28, 31-38, 41-48 (excluindo decimais de 9)
export const Q1_TEETH = [11, 12, 13, 14, 15, 16, 17, 18];
export const Q2_TEETH = [21, 22, 23, 24, 25, 26, 27, 28];
export const Q3_TEETH = [31, 32, 33, 34, 35, 36, 37, 38];
export const Q4_TEETH = [41, 42, 43, 44, 45, 46, 47, 48];

export const ORDERED_TEETH_11_TO_48 = [
  ...Q1_TEETH,
  ...Q2_TEETH,
  ...Q3_TEETH,
  ...Q4_TEETH,
];

// Visual anatomical arch arrangement
export const UPPER_RIGHT_TEETH = [18, 17, 16, 15, 14, 13, 12, 11];
export const UPPER_LEFT_TEETH = [21, 22, 23, 24, 25, 26, 27, 28];
export const LOWER_RIGHT_TEETH = [48, 47, 46, 45, 44, 43, 42, 41];
export const LOWER_LEFT_TEETH = [31, 32, 33, 34, 35, 36, 37, 38];

export const ALL_TEETH_NUMBERS = ORDERED_TEETH_11_TO_48;

export const QUADRANT_INFO: Record<string, { label: string; arch: string; teeth: number[] }> = {
  Q1: { label: 'Q1: Superior Direito', arch: 'Maxila (Direita)', teeth: Q1_TEETH },
  Q2: { label: 'Q2: Superior Esquerdo', arch: 'Maxila (Esquerda)', teeth: Q2_TEETH },
  Q3: { label: 'Q3: Inferior Esquerdo', arch: 'Mandíbula (Esquerda)', teeth: Q3_TEETH },
  Q4: { label: 'Q4: Inferior Direito', arch: 'Mandíbula (Direita)', teeth: Q4_TEETH },
};

export const TOOTH_NAMES: Record<number, string> = {
  // Quadrante 1 (Superior Direito)
  18: '3º Molar Sup. Dir. (Siso)',
  17: '2º Molar Superior Direito',
  16: '1º Molar Superior Direito',
  15: '2º Pré-Molar Sup. Direito',
  14: '1º Pré-Molar Sup. Direito',
  13: 'Canino Superior Direito',
  12: 'Incisivo Lateral Sup. Dir.',
  11: 'Incisivo Central Sup. Dir.',

  // Quadrante 2 (Superior Esquerdo)
  21: 'Incisivo Central Sup. Esq.',
  22: 'Incisivo Lateral Sup. Esq.',
  23: 'Canino Superior Esquerdo',
  24: '1º Pré-Molar Sup. Esquerdo',
  25: '2º Pré-Molar Sup. Esquerdo',
  26: '1º Molar Superior Esquerdo',
  27: '2º Molar Superior Esquerdo',
  28: '3º Molar Sup. Esq. (Siso)',

  // Quadrante 4 (Inferior Direito)
  48: '3º Molar Inf. Dir. (Siso)',
  47: '2º Molar Inferior Direito',
  46: '1º Molar Inferior Direito',
  45: '2º Pré-Molar Inf. Direito',
  44: '1º Pré-Molar Inf. Direito',
  43: 'Canino Inferior Direito',
  42: 'Incisivo Lateral Inf. Dir.',
  41: 'Incisivo Central Inf. Dir.',

  // Quadrante 3 (Inferior Esquerdo)
  31: 'Incisivo Central Inf. Esq.',
  32: 'Incisivo Lateral Inf. Esq.',
  33: 'Canino Inferior Esquerdo',
  34: '1º Pré-Molar Inf. Esquerdo',
  35: '2º Pré-Molar Inf. Esquerdo',
  36: '1º Molar Inferior Esquerdo',
  37: '2º Molar Inferior Esquerdo',
  38: '3º Molar Inf. Esq. (Siso)',
};

export const CONDITIONS: Record<
  string,
  {
    label: string;
    badgeBg: string;
    textColor: string;
    borderColor: string;
    cardBg: string;
    dotBg: string;
  }
> = {
  SOUND: {
    label: 'Hígido (Sadio)',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    textColor: 'text-emerald-800',
    borderColor: 'border-stone-200 hover:border-emerald-300',
    cardBg: 'bg-white',
    dotBg: 'bg-emerald-500',
  },
  CARIOUS: {
    label: 'Cariado (Tratar)',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    textColor: 'text-rose-800',
    borderColor: 'border-rose-200 hover:border-rose-400',
    cardBg: 'bg-rose-50/30',
    dotBg: 'bg-rose-500',
  },
  RESTORED: {
    label: 'Restaurado',
    badgeBg: 'bg-brown-50 text-brown-800 border-brown-200',
    textColor: 'text-brown-800',
    borderColor: 'border-brown-200 hover:border-brown-400',
    cardBg: 'bg-brown-50/20',
    dotBg: 'bg-brown-600',
  },
  MISSING: {
    label: 'Ausente',
    badgeBg: 'bg-stone-100 text-stone-600 border-stone-200',
    textColor: 'text-stone-600',
    borderColor: 'border-stone-200',
    cardBg: 'bg-stone-50',
    dotBg: 'bg-stone-400',
  },
  ENDODONTICALLY_TREATED: {
    label: 'Canal Tratado',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-200 hover:border-amber-400',
    cardBg: 'bg-amber-50/20',
    dotBg: 'bg-amber-600',
  },
  IMPLANT: {
    label: 'Implante',
    badgeBg: 'bg-stone-100 text-stone-800 border-stone-300',
    textColor: 'text-stone-800',
    borderColor: 'border-stone-300 hover:border-stone-400',
    cardBg: 'bg-stone-50/50',
    dotBg: 'bg-stone-700',
  },
  CROWN: {
    label: 'Coroa Protética',
    badgeBg: 'bg-brown-100 text-brown-900 border-brown-300',
    textColor: 'text-brown-900',
    borderColor: 'border-brown-300 hover:border-brown-400',
    cardBg: 'bg-brown-50/30',
    dotBg: 'bg-brown-700',
  },
  EXTRACTED: {
    label: 'Extraído',
    badgeBg: 'bg-stone-100 text-stone-500 border-stone-200',
    textColor: 'text-stone-500',
    borderColor: 'border-stone-200',
    cardBg: 'bg-stone-50',
    dotBg: 'bg-stone-400',
  },
  FRACTURED: {
    label: 'Fratura / Trinca',
    badgeBg: 'bg-orange-50 text-orange-900 border-orange-200',
    textColor: 'text-orange-900',
    borderColor: 'border-orange-200 hover:border-orange-400',
    cardBg: 'bg-orange-50/20',
    dotBg: 'bg-orange-600',
  },
  VENEER: {
    label: 'Faceta / Lente',
    badgeBg: 'bg-teal-50 text-teal-900 border-teal-200',
    textColor: 'text-teal-900',
    borderColor: 'border-teal-200 hover:border-teal-400',
    cardBg: 'bg-teal-50/20',
    dotBg: 'bg-teal-600',
  },
  MOBILITY: {
    label: 'Mobilidade Dentária',
    badgeBg: 'bg-purple-50 text-purple-900 border-purple-200',
    textColor: 'text-purple-900',
    borderColor: 'border-purple-200 hover:border-purple-400',
    cardBg: 'bg-purple-50/20',
    dotBg: 'bg-purple-600',
  },
  CUSTOM: {
    label: 'Outro Diagnóstico',
    badgeBg: 'bg-[#F6EFE6] text-[#8B623B] border-[#DCBF9E]',
    textColor: 'text-[#8B623B]',
    borderColor: 'border-[#DCBF9E] hover:border-[#8B623B]',
    cardBg: 'bg-[#F6EFE6]/30',
    dotBg: 'bg-[#8B623B]',
  },
};

export function getConditionConfig(conditionKey: string, customLabel?: string) {
  if (customLabel && (conditionKey === 'CUSTOM' || !CONDITIONS[conditionKey])) {
    return {
      label: customLabel,
      badgeBg: 'bg-[#F6EFE6] text-[#8B623B] border-[#DCBF9E]',
      textColor: 'text-[#8B623B]',
      borderColor: 'border-[#DCBF9E] hover:border-[#8B623B]',
      cardBg: 'bg-[#F6EFE6]/30',
      dotBg: 'bg-[#8B623B]',
    };
  }
  return CONDITIONS[conditionKey] || {
    label: customLabel || conditionKey,
    badgeBg: 'bg-[#F6EFE6] text-[#8B623B] border-[#DCBF9E]',
    textColor: 'text-[#8B623B]',
    borderColor: 'border-[#DCBF9E]',
    cardBg: 'bg-white',
    dotBg: 'bg-[#8B623B]',
  };
}

export const SURFACES = [
  { code: 'V', name: 'Vestibular' },
  { code: 'M', name: 'Mesial' },
  { code: 'O', name: 'Oclusal/Incisal' },
  { code: 'D', name: 'Distal' },
  { code: 'L', name: 'Lingual/Palatina' },
];
