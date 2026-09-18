import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  Package, 
  Clock, 
  RefreshCw,
  ExternalLink,
  Share2,
  Target
} from 'lucide-react';
import { Lead } from '../types';
import { identifyLeadTargetRegion } from '../utils/targetLocations';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatsApp: (lead: Lead) => void;
  onRequalifyWithAI: (leadId: string) => Promise<void>;
  onUpdateStatus: (leadId: string, newStatus: Lead['status']) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onOpenWhatsApp,
  onRequalifyWithAI,
  onUpdateStatus,
}) => {
  if (!isOpen || !lead) return null;

  const [isRequalifying, setIsRequalifying] = useState(false);
  const targetReg = identifyLeadTargetRegion(lead);

  const handleRequalify = async () => {
    setIsRequalifying(true);
    try {
      await onRequalifyWithAI(lead.id);
    } finally {
      setIsRequalifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="lead-detail-modal"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white">{lead.businessName}</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-700 text-slate-200">
                  {lead.category}
                </span>
                {targetReg && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                    <Target className="w-3 h-3" />
                    {targetReg.shortLabel}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {lead.address}, {lead.neighborhood} - {lead.city}/{lead.state}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Quick Status Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-500 block">Score de Qualificação</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-black text-emerald-600">{lead.qualificationScore}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">{lead.qualificationGrade}</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-500 block">Presença Web</span>
              <div className="mt-1 flex items-center gap-1.5">
                {lead.websiteStatus === 'none' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                    <AlertTriangle className="w-3.5 h-3.5" /> Sem Site
                  </span>
                ) : lead.websiteStatus === 'social_only' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Globe className="w-3.5 h-3.5" /> Só Redes Sociais
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Site Ativo
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500">
                {lead.needsWebsite ? 'Necessita de Criação' : 'Já possui'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-500 block">Aderência App-CIC</span>
              <div className="mt-1 flex items-center gap-1">
                <Package className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">
                  {lead.needsInventoryControl ? 'Teste Recomendado' : 'Não prioritário'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500">Controle de saídas</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-500 block">Status Comercial</span>
              <select
                id="select-modal-status"
                value={lead.status}
                onChange={(e) => onUpdateStatus(lead.id, e.target.value as Lead['status'])}
                className="mt-1 w-full text-xs font-bold bg-white border border-slate-300 rounded-md p-1 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="novo">Novo</option>
                <option value="qualificado">Qualificado</option>
                <option value="disparado_whatsapp">Disparado WhatsApp</option>
                <option value="em_negociacao">Em Negociação</option>
                <option value="teste_cic">Teste de Campo CIC</option>
                <option value="convertido">Convertido (Fechado)</option>
                <option value="descartado">Descartado</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Dados de Contato Direto</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              <div>
                <span className="text-slate-400 block text-[11px]">Responsável:</span>
                <span className="font-semibold text-slate-900">{lead.ownerName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Telefone / WhatsApp:</span>
                <a
                  href={`tel:${lead.phone}`}
                  className="font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> {lead.phone}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Endereço Completo:</span>
                <span className="font-semibold text-slate-900">{lead.address}</span>
              </div>
            </div>
          </div>

          {/* AI Qualification & Strategic Pitch */}
          <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Diagnóstico e Qualificação por Inteligência Artificial
                </h4>
              </div>
              <button
                id="btn-requalify-ai"
                type="button"
                disabled={isRequalifying}
                onClick={handleRequalify}
                className="text-xs text-emerald-700 font-semibold hover:text-emerald-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-2xs hover:bg-emerald-50 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRequalifying ? 'animate-spin' : ''}`} />
                {isRequalifying ? 'Analisando...' : 'Reavaliar com Gemini'}
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-lg border border-emerald-100">
              {lead.qualificationSummary}
            </p>

            {/* Pain Points */}
            <div>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Dores e Oportunidades Identificadas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lead.painPoints.map((pain, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md font-medium"
                  >
                    • {pain}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested WhatsApp Pitch */}
            <div className="bg-white p-3 rounded-lg border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span>Script Recomendado para Abordagem no WhatsApp:</span>
              </div>
              <p className="text-xs text-slate-800 italic bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed">
                "{lead.suggestedPitch}"
              </p>
            </div>
          </div>

          {/* Activity Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Histórico de Ações & Automação
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {lead.history.map((hist) => (
                <div
                  key={hist.id}
                  className="text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between"
                >
                  <div>
                    <span className="font-semibold text-slate-800 block">{hist.action}</span>
                    {hist.note && <span className="text-slate-500 text-[11px]">{hist.note}</span>}
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                    {new Date(hist.timestamp).toLocaleDateString('pt-BR')} {new Date(hist.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200"
          >
            Fechar
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-open-whatsapp-modal"
              onClick={() => onOpenWhatsApp(lead)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enviar Abordagem WhatsApp</span>
              <ExternalLink className="w-3 h-3 text-white/80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
