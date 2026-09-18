import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Globe, 
  MessageSquare, 
  CheckCircle2, 
  Package, 
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  Play,
  FileSpreadsheet,
  ChevronRight,
  Store,
  Layers
} from 'lucide-react';
import { Lead, AppCicItem } from '../types';

interface DashboardViewProps {
  leads: Lead[];
  cicItems: AppCicItem[];
  onOpenScraping: () => void;
  onOpenSpreadsheet: () => void;
  onOpenAppCic: () => void;
  onSelectLead: (leadId: string) => void;
  onOpenWhatsApp: (lead: Lead) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  cicItems,
  onOpenScraping,
  onOpenSpreadsheet,
  onOpenAppCic,
  onSelectLead,
  onOpenWhatsApp,
}) => {
  const totalLeads = leads.length;
  const withoutWebsite = leads.filter((l) => l.needsWebsite || l.websiteStatus === 'none' || l.websiteStatus === 'social_only').length;
  const qualifiedLeads = leads.filter((l) => l.isQualified).length;
  const dispatchedWhatsApp = leads.filter((l) => l.status === 'disparado_whatsapp' || l.status === 'em_negociacao' || l.status === 'teste_cic' || l.status === 'convertido').length;
  const cicTestCandidates = leads.filter((l) => l.needsInventoryControl).length;
  const activeCicTests = leads.filter((l) => l.status === 'teste_cic').length;
  const convertedLeads = leads.filter((l) => l.status === 'convertido').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0.0';

  // Status Funnel metrics
  const funnelStages = [
    { label: '1. Prospecção (Scraping)', count: totalLeads, color: 'bg-slate-700', statusKey: 'total' },
    { label: '2. Qualificados p/ Venda', count: qualifiedLeads, color: 'bg-blue-600', statusKey: 'qualificado' },
    { label: '3. Disparados WhatsApp', count: dispatchedWhatsApp, color: 'bg-emerald-600', statusKey: 'disparado_whatsapp' },
    { label: '4. Em Negociação', count: leads.filter((l) => l.status === 'em_negociacao').length, color: 'bg-amber-500', statusKey: 'em_negociacao' },
    { label: '5. Teste de Campo (App-CIC)', count: activeCicTests, color: 'bg-purple-600', statusKey: 'teste_cic' },
    { label: '6. Fechamento / Convertidos', count: convertedLeads, color: 'bg-emerald-700', statusKey: 'convertido' },
  ];

  // Category breakdown
  const categoryCount: Record<string, number> = {};
  leads.forEach((l) => {
    categoryCount[l.category] = (categoryCount[l.category] || 0) + 1;
  });

  return (
    <div id="dashboard-view-container" className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Automação de Scraping & Qualificação Ativa
            </span>
            <span className="bg-white/10 text-slate-200 text-xs px-2 py-0.5 rounded-md font-medium">
              Integrado com App-CIC
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight text-white">
            Monitor de Conversão & Prospecção Comercial
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            Varredura contínua de comércios que necessitam de site e controle de estoque de itens e saídas no balcão. Disparo pronto para a equipe de vendas com WhatsApp configurado.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            id="btn-quick-scrape"
            onClick={onOpenScraping}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Nova Varredura de Scraping</span>
          </button>

          <button
            id="btn-quick-spreadsheet"
            onClick={onOpenSpreadsheet}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Ver Planilha</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Prospectados</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{totalLeads}</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center">
              +100% ativos
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Negócios verificados</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-rose-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Sem Site / Apenas Redes</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-rose-600">{withoutWebsite}</span>
            <span className="text-xs text-slate-500 font-semibold">
              {totalLeads > 0 ? Math.round((withoutWebsite / totalLeads) * 100) : 0}% da base
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Oportunidade p/ Criação Web</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Perfil App-CIC (Estoque)</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-purple-700">{cicTestCandidates}</span>
            <span className="text-xs text-purple-600 font-bold">
              {activeCicTests} em teste
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Necessitam controle móvel</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Disparados WhatsApp</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-600">{dispatchedWhatsApp}</span>
            <span className="text-xs text-emerald-700 font-bold">
              {totalLeads > 0 ? Math.round((dispatchedWhatsApp / totalLeads) * 100) : 0}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Abordagens enviadas</p>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-400 transition-colors col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Taxa de Conversão</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{conversionRate}%</span>
            <span className="text-xs text-emerald-600 font-bold">{convertedLeads} fechados</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Vendas e testes ativos</p>
        </div>
      </div>

      {/* Main Conversion Funnel & Pipeline */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Funil de Conversão & Jornada do Lead</h3>
            <p className="text-xs text-slate-500">
              Acompanhamento de ponta a ponta desde a captura no scraping até o fechamento de site e teste do App-CIC
            </p>
          </div>
          <button
            onClick={onOpenSpreadsheet}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 hover:underline"
          >
            Abrir planilha completa <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Funnel Progress Bars */}
        <div className="space-y-3 pt-2">
          {funnelStages.map((stage, idx) => {
            const percentage = totalLeads > 0 ? Math.round((stage.count / totalLeads) * 100) : 0;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{stage.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{stage.count} leads</span>
                    <span className="text-slate-400 font-mono text-[11px]">({percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${stage.color} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(percentage, 3)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Recent Scraped Leads & App-CIC Quick Field Testing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Hot Qualified Leads */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Últimos Leads Quentes para Abordagem</h3>
              </div>
              <span className="text-xs text-slate-400">Ordenado por Score</span>
            </div>

            <div className="space-y-2.5">
              {leads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  id={`lead-card-dash-${lead.id}`}
                  className="p-3 bg-slate-50 hover:bg-emerald-50/40 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer"
                  onClick={() => onSelectLead(lead.id)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900 truncate">{lead.businessName}</p>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                        Score {lead.qualificationScore}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {lead.ownerName} • {lead.neighborhood}, {lead.city} • Tel: {lead.phone}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded font-medium">
                        {lead.needsWebsite ? 'Sem Site' : 'Site OK'}
                      </span>
                      {lead.needsInventoryControl && (
                        <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded font-medium">
                          📦 Aderente ao App-CIC
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      id={`btn-dash-whatsapp-${lead.id}`}
                      onClick={() => onOpenWhatsApp(lead)}
                      title="Disparar no WhatsApp"
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Planilha sincronizada automaticamente</span>
            <button
              onClick={onOpenSpreadsheet}
              className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              Ver todos os {totalLeads} contatos na planilha <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: App-CIC Field Testing Highlight */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">Integração App-CIC (Estoque Local)</h3>
              </div>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-emerald-300">
                github/app-cic
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Módulo de teste de campo para comércios recentes que necessitam de controle rápido de produtos e baixa instantânea de saídas no balcão pelo celular.
            </p>

            {/* Quick Stats for App-CIC */}
            <div className="grid grid-cols-2 gap-2.5 my-4">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">Itens em Monitoramento</span>
                <span className="text-xl font-black text-white">{cicItems.length}</span>
                <span className="text-[10px] text-emerald-400 block">Cadastrados em teste</span>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">Alertas de Estoque</span>
                <span className="text-xl font-black text-amber-400">
                  {cicItems.filter((i) => i.status !== 'ok').length}
                </span>
                <span className="text-[10px] text-amber-300 block">Mínimo ou esgotado</span>
              </div>
            </div>

            {/* Sample Item preview */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Itens com Baixa Recente de Saídas:
              </span>
              {cicItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-2 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-white block">{item.name}</span>
                    <span className="text-[10px] text-slate-400">{item.leadBusinessName || 'Comércio Local'}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        item.status === 'esgotado'
                          ? 'bg-rose-500/20 text-rose-300'
                          : item.status === 'alerta_baixo'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {item.currentStock} {item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-white/10">
            <button
              id="btn-open-cic-module"
              onClick={onOpenAppCic}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>Abrir Gerenciador de Saídas & Itens App-CIC</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
