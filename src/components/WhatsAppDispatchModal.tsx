import React, { useState } from 'react';
import { MessageSquare, Send, Copy, Check, ExternalLink, X, Smartphone, User, Sparkles } from 'lucide-react';
import { Lead } from '../types';

interface WhatsAppDispatchModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onDispatch: (leadId: string, customMessage: string, targetSalesPhone?: string) => Promise<string | undefined>;
}

export const WhatsAppDispatchModal: React.FC<WhatsAppDispatchModalProps> = ({
  lead,
  isOpen,
  onClose,
  onDispatch,
}) => {
  if (!isOpen || !lead) return null;

  const [message, setMessage] = useState(lead.suggestedPitch || '');
  const [dispatchMode, setDispatchMode] = useState<'direct_to_lead' | 'to_sales_team'>('direct_to_lead');
  const [salesTeamPhone, setSalesTeamPhone] = useState('5511999998888');
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      const targetPhone = dispatchMode === 'to_sales_team' ? salesTeamPhone : undefined;
      const whatsappUrl = await onDispatch(lead.id, message, targetPhone);
      
      // Determine recipient phone
      const phoneToUse = dispatchMode === 'to_sales_team' ? salesTeamPhone : lead.whatsapp;
      const cleanPhone = phoneToUse.replace(/\D/g, '');
      const encodedMsg = encodeURIComponent(
        dispatchMode === 'to_sales_team'
          ? `[NOVO LEAD QUALIFICADO PARA ABORDAGEM]\nEmpresa: ${lead.businessName}\nContato: ${lead.ownerName} (${lead.phone})\nEndereço: ${lead.address}, ${lead.neighborhood} - ${lead.city}\nSem Site: ${lead.needsWebsite ? 'SIM' : 'NÃO'}\nNecessidade App-CIC: ${lead.needsInventoryControl ? 'SIM' : 'NÃO'}\nScore: ${lead.qualificationScore}/100\n\nScript sugerido:\n"${message}"`
          : message
      );
      
      const finalUrl = whatsappUrl || `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`;
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
      onClose();
    } catch (err) {
      console.error('Erro ao disparar WhatsApp:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="whatsapp-dispatch-modal"
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Envio WhatsApp para Equipe / Lead</h3>
              <p className="text-xs text-emerald-100">Disparo automático de abordagem qualificada</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Lead Info Banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-900 text-sm">{lead.businessName}</p>
              <p className="text-slate-500">
                {lead.ownerName} • {lead.city}/{lead.state} • Tel: {lead.phone}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                Score {lead.qualificationScore}/100
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {lead.needsWebsite ? '❌ Sem Site' : 'Site Ativo'} • {lead.needsInventoryControl ? '📦 App-CIC' : ''}
              </p>
            </div>
          </div>

          {/* Target Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Destinatário do Disparo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="target-direct-lead"
                onClick={() => setDispatchMode('direct_to_lead')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  dispatchMode === 'direct_to_lead'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-medium ring-2 ring-emerald-200'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="text-xs font-bold">Direto ao Lead</p>
                  <p className="text-[10px] text-slate-500">WhatsApp: {lead.whatsapp}</p>
                </div>
              </button>

              <button
                type="button"
                id="target-sales-team"
                onClick={() => setDispatchMode('to_sales_team')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  dispatchMode === 'to_sales_team'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-medium ring-2 ring-emerald-200'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="text-xs font-bold">Para Time de Vendas</p>
                  <p className="text-[10px] text-slate-500">Encaminhar ficha completa</p>
                </div>
              </button>
            </div>
          </div>

          {dispatchMode === 'to_sales_team' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp do Vendedor / SDR responsável:
              </label>
              <input
                type="text"
                id="input-sales-phone"
                value={salesTeamPhone}
                onChange={(e) => setSalesTeamPhone(e.target.value)}
                placeholder="Ex: 5511999998888 (com DDI + DDD)"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          )}

          {/* Copy Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Texto da Mensagem Comercial (WhatsApp)
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado!' : 'Copiar texto'}
              </button>
            </div>
            <textarea
              id="textarea-whatsapp-message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden leading-relaxed text-slate-800"
              placeholder="Digite a mensagem de abordagem..."
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Personalizado pela IA destacando ausência de site e proposta de teste de campo do App-CIC.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-dispatch-whatsapp"
              disabled={isSending}
              onClick={handleSend}
              className="min-h-[44px] px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Processando...' : 'Abrir & Disparar no WhatsApp'}</span>
              <ExternalLink className="w-3 h-3 text-white/80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
