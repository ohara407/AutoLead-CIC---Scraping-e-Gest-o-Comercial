import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  ArrowUpRight, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Target,
  Compass
} from 'lucide-react';
import { StrategicReport } from '../types';

interface ReportsViewProps {
  onGenerateReport: (period: 'semanal' | 'mensal') => Promise<StrategicReport>;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onGenerateReport }) => {
  const [period, setPeriod] = useState<'semanal' | 'mensal'>('semanal');
  const [report, setReport] = useState<StrategicReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchReport = async (p: 'semanal' | 'mensal') => {
    setLoading(true);
    try {
      const data = await onGenerateReport(p);
      setReport(data);
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(period);
  }, [period]);

  const handleCopyReport = () => {
    if (!report) return;
    const text = `📊 RELATÓRIO ESTRATÉGICO DE DESEMPENHO (${report.period.toUpperCase()})
Período: ${report.dateRange}
----------------------------------------
• Leads Prospectados: ${report.totalScraped}
• Sem Site Identificados: ${report.withoutWebsiteCount} (${Math.round((report.withoutWebsiteCount / report.totalScraped) * 100)}%)
• Necessidade de Estoque (App-CIC): ${report.inventoryNeedCount}
• Disparados WhatsApp: ${report.whatsappDispatchedCount}
• Testes de Campo App-CIC Ativos: ${report.cicTestsActive}
• Conversões Fechadas: ${report.conversionCount} (Taxa: ${report.conversionRate}%)

🎯 DIAGNÓSTICO EXECUTIVO (IA):
${report.aiAnalysisText || 'Estratégia comercial com excelente tração em comércios locais.'}

💡 INSIGHTS ESTRATÉGICOS:
${report.strategicInsights.map((ins, i) => `${i + 1}. ${ins}`).join('\n')}

🚀 AÇÕES RECOMENDADAS PARA A EQUIPE:
${report.recommendedActions.map((act, i) => `[ ] ${act}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="reports-view-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" /> Relatórios Estratégicos & Análise de IA
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Desempenho da Prospecção, Conversão de Sites & Testes App-CIC
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Acompanhe a evolução do pipeline e receba diagnósticos automáticos por IA para ajustes imediatos na abordagem comercial.
          </p>
        </div>

        {/* Period Selector and Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              id="btn-report-weekly"
              onClick={() => setPeriod('semanal')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                period === 'semanal' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Relatório Semanal
            </button>
            <button
              id="btn-report-monthly"
              onClick={() => setPeriod('mensal')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                period === 'mensal' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Relatório Mensal
            </button>
          </div>

          <button
            id="btn-refresh-report"
            onClick={() => fetchReport(period)}
            disabled={loading}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            title="Atualizar Análise com Gemini"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          <button
            id="btn-copy-report"
            onClick={handleCopyReport}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar Resumo'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
          <p className="font-bold text-slate-800 text-sm">Compilando Métricas e Gerando Diagnóstico com Gemini AI...</p>
          <p className="text-xs text-slate-500 mt-1">Analisando taxas de conversão de site e tração do App-CIC</p>
        </div>
      )}

      {report && !loading && (
        <div className="space-y-6">
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-400 font-semibold block">Total Scraped</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{report.totalScraped}</span>
              <span className="text-[10px] text-slate-500">Leads capturados</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-rose-600 font-semibold block">Sem Website</span>
              <span className="text-xl font-black text-rose-600 mt-1 block">{report.withoutWebsiteCount}</span>
              <span className="text-[10px] text-slate-500">
                {report.totalScraped > 0 ? Math.round((report.withoutWebsiteCount / report.totalScraped) * 100) : 0}% da base
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-purple-700 font-semibold block">Perfil Estoque CIC</span>
              <span className="text-xl font-black text-purple-700 mt-1 block">{report.inventoryNeedCount}</span>
              <span className="text-[10px] text-slate-500">{report.cicTestsActive} em teste ativo</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-blue-600 font-semibold block">Disparados WhatsApp</span>
              <span className="text-xl font-black text-blue-600 mt-1 block">{report.whatsappDispatchedCount}</span>
              <span className="text-[10px] text-slate-500">Abordagens enviadas</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-emerald-600 font-semibold block">Conversões</span>
              <span className="text-xl font-black text-emerald-600 mt-1 block">{report.conversionCount}</span>
              <span className="text-[10px] text-emerald-700 font-bold">Fechamentos</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-700 font-semibold block">Taxa de Conversão</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{report.conversionRate}%</span>
              <span className="text-[10px] text-emerald-600 font-bold">Pipeline ativo</span>
            </div>
          </div>

          {/* AI Executive Diagnosis */}
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  Diagnóstico Estratégico Executivo ({report.period === 'semanal' ? 'Semanal' : 'Mensal'})
                </h3>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-mono">
                Análise com Gemini AI
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
              {report.aiAnalysisText}
            </p>
          </div>

          {/* Two Columns: Strategic Insights & Tactical Recommended Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Insights */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Insights Estratégicos Baseados em Dados
                </h4>
              </div>

              <div className="space-y-2.5 pt-1">
                {report.strategicInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Plano de Ação Tático para a Próxima Prospecção
                </h4>
              </div>

              <div className="space-y-2.5 pt-1">
                {report.recommendedActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs text-emerald-950 leading-relaxed flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Niches Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Desempenho por Nicho de Comércio</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {report.topNiches.map((niche, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs font-bold text-slate-900 block truncate">{niche.name}</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-sm font-semibold text-slate-600">{niche.count} leads</span>
                    <span className="text-xs font-bold text-emerald-700">{niche.conversionRate}% conversão</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
