'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Tag, 
  Search, 
  Check, 
  DollarSign,
  Edit2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { CatalogProcedure } from '../lib/odontogramConfig';

interface ProcedureCatalogViewProps {
  catalog: CatalogProcedure[];
  onAddProcedureToCatalog: (name: string, category: string, priceInCents: number, description?: string) => Promise<void>;
  onDeleteProcedure?: (id: string) => void;
  onEditProcedure?: (id: string, name: string, category: string, priceInCents: number, description?: string) => void;
}

export function ProcedureCatalogView({
  catalog,
  onAddProcedureToCatalog,
  onDeleteProcedure,
  onEditProcedure,
}: ProcedureCatalogViewProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddForm, setShowAddForm] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('RESTORATIVE');
  const [priceReal, setPriceReal] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = Array.from(new Set(catalog.map((c) => c.category)));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !priceReal) return;

    // Normalize price: handles 180, 180.00, 180,00, R$ 180
    const cleanPrice = priceReal.replace(/[^\d,\.]/g, '').replace(',', '.');
    const priceCents = Math.round(parseFloat(cleanPrice) * 100);
    if (isNaN(priceCents) || priceCents < 0) return;

    try {
      setIsSubmitting(true);
      await onAddProcedureToCatalog(name.trim(), category, priceCents, description.trim());
      setName('');
      setPriceReal('');
      setDescription('');
      setShowAddForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = catalog.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return item.name.toLowerCase().includes(q) || (item.description ?? '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="p-5 rounded-3xl bg-white border border-[#EAE4DC] flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-[#362312] flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#8B623B]" />
            Tabela Própria de Procedimentos da Clínica
          </h2>
          <p className="text-xs text-[#78695C] mt-0.5">
            Cadastre os serviços e honorários próprios da sua clínica em R$, sem burocracia de códigos externos.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-[#A67C52] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar procedimento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] text-xs text-[#362312] placeholder-[#A89C91] focus:outline-none focus:border-[#8B623B]"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] text-xs text-[#52361D] focus:outline-none focus:border-[#8B623B] cursor-pointer"
          >
            <option value="ALL">Todas Especialidades</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#8B623B] hover:bg-[#6F4B2B] text-white shadow-md shadow-[#8B623B]/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Novo Procedimento
          </button>
        </div>
      </div>

      {/* Add Procedure Form Modal / Drawer */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#DCBF9E] space-y-4 animate-in fade-in shadow-md">
          <h4 className="text-sm font-bold text-[#362312] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B623B]" />
            Cadastrar Novo Procedimento na Tabela da Clínica
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs text-[#52361D] font-semibold mb-1">Nome do Procedimento</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Restauração Resina Fotopolimerizável Composta"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#EAE4DC] text-xs text-[#362312] focus:outline-none focus:border-[#8B623B]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#52361D] font-semibold mb-1">Preço Próprio (R$)</label>
              <input
                type="text"
                required
                value={priceReal}
                onChange={(e) => setPriceReal(e.target.value)}
                placeholder="Ex: 220,00"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#EAE4DC] text-xs text-[#362312] focus:outline-none focus:border-[#8B623B] font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#52361D] font-semibold mb-1">Especialidade Odontológica</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#EAE4DC] text-xs text-[#362312] focus:outline-none focus:border-[#8B623B]"
              >
                <option value="RESTORATIVE">Dentística / Restauração</option>
                <option value="ENDODONTICS">Endodontia (Canal)</option>
                <option value="SURGERY">Cirurgia / Extração</option>
                <option value="PROSTHESIS">Prótese Dentária</option>
                <option value="IMPLANT">Implantodontia</option>
                <option value="PREVENTIVE">Prevenção / Profilaxia</option>
                <option value="AESTHETICS">Estética / Clareamento</option>
                <option value="PERIODONTICS">Periodontia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#52361D] font-semibold mb-1">Observações de Material (Opcional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Inclui material estético e isolamento absoluto"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#EAE4DC] text-xs text-[#362312] focus:outline-none focus:border-[#8B623B]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78695C] hover:text-[#362312]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#8B623B] hover:bg-[#6F4B2B] text-white shadow-sm disabled:opacity-50"
            >
              Salvar na Tabela da Clínica
            </button>
          </div>
        </form>
      )}

      {/* Procedures Table */}
      <div className="border border-[#EAE4DC] rounded-3xl bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F5] text-[#78695C] uppercase text-[10px] font-semibold border-b border-[#EAE4DC]">
            <tr>
              <th className="py-3 px-4">Procedimento</th>
              <th className="py-3 px-4">Especialidade</th>
              <th className="py-3 px-4">Descrição / Detalhes</th>
              <th className="py-3 px-4 text-right">Valor Padrão</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE4DC] text-[#362312]">
            {filtered.map((proc) => (
              <tr key={proc.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-xs text-[#362312]">
                  {proc.name}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F6EFE6] text-[#6F4B2B] border border-[#DCBF9E]/60">
                    {proc.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500 text-xs max-w-xs truncate">
                  {proc.description || '-'}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-emerald-700">
                  R$ {(proc.priceInCents / 100).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
