import React, { useState } from 'react';
import { X, Building2, Plus, Phone, MapPin, Globe, Package } from 'lucide-react';
import { Lead, WebsiteStatus } from '../types';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLead: (leadData: Partial<Lead>) => Promise<void>;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  isOpen,
  onClose,
  onSaveLead,
}) => {
  if (!isOpen) return null;

  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState('Mercadinho / Mercearia');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [websiteStatus, setWebsiteStatus] = useState<WebsiteStatus>('none');
  const [needsInventoryControl, setNeedsInventoryControl] = useState(true);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const whatsapp = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
      const needsWeb = websiteStatus !== 'active';
      const score = needsWeb && needsInventoryControl ? 92 : needsWeb ? 85 : 70;

      await onSaveLead({
        businessName,
        ownerName: ownerName || 'Proprietário(a)',
        category,
        city,
        state,
        neighborhood,
        address: address || `${neighborhood}, ${city} - ${state}`,
        phone: cleanPhone,
        whatsapp,
        websiteStatus,
        needsWebsite: needsWeb,
        needsInventoryControl,
        painPoints: [
          needsWeb ? 'Não possui site com vitrine digital' : 'Site existente com baixa conversão',
          needsInventoryControl ? 'Necessita de controle ágil de itens e saídas no balcão (App-CIC)' : 'Controle manual básico'
        ],
        qualificationScore: score,
        qualificationGrade: score >= 90 ? 'A (Altíssima)' : 'B (Boa)',
        isQualified: true,
        qualificationSummary: `Comércio cadastrado manualmente em ${city}/${state}. Identificada carência de presença web e/ou controle móvel de saídas via App-CIC.`,
        suggestedPitch: `Olá ${ownerName || 'amigo(a)'}! Vimos o destaque da ${businessName} em ${city}. Criamos soluções completas para comércios locais: sites modernos e o App-CIC para controle ágil de estoque no balcão. Gostaria de conhecer?`,
        status: 'novo',
        dispatchStatus: 'pendente',
        salesNotes: notes || 'Cadastrado manualmente no sistema',
      });
      onClose();
    } catch (err) {
      console.error('Erro ao salvar lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Cadastrar Novo Lead Manualmente</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nome do Estabelecimento / Comércio:</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Ex: Pastelaria Ponto de Ouro, Mecânica Express"
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nome do Responsável:</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Ex: Carlos Oliveira"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Telefone / WhatsApp:</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 11987654321"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Categoria:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Mercadinho / Mercearia">Mercadinho / Mercearia</option>
                <option value="Autopeças / Oficina">Autopeças / Oficina</option>
                <option value="Restaurante / Lanchonete">Restaurante / Lanchonete</option>
                <option value="Padaria">Padaria</option>
                <option value="Depósito de Bebidas / Materiais">Depósito de Bebidas / Materiais</option>
                <option value="Loja de Roupas">Loja de Roupas</option>
                <option value="Barbearia / Salão">Barbearia / Salão</option>
                <option value="Pet Shop">Pet Shop</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cidade / Estado:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Cidade"
                  className="flex-1 p-2.5 border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="UF"
                  className="w-12 text-center p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bairro:</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ex: Santana, Centro"
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Presença Web Atual:</label>
              <select
                value={websiteStatus}
                onChange={(e) => setWebsiteStatus(e.target.value as WebsiteStatus)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="none">Sem Site (Apenas ponto físico)</option>
                <option value="social_only">Apenas Redes Sociais</option>
                <option value="outdated">Site Desatualizado</option>
                <option value="active">Site Ativo</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 p-2.5 rounded-lg border border-purple-200 bg-purple-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={needsInventoryControl}
              onChange={(e) => setNeedsInventoryControl(e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded"
            />
            <span className="font-semibold text-purple-900">
              Candidato para Teste de Campo do App-CIC (Controle de Estoque/Saídas)
            </span>
          </label>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Observações Comerciais:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Proprietário disponível à tarde..."
              className="w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
            >
              {isSubmitting ? 'Salvando...' : 'Cadastrar Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
