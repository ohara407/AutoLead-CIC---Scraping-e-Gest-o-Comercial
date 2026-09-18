import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  MapPin, 
  Search, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Globe, 
  Package, 
  MessageSquare, 
  Send, 
  Bell,
  RefreshCw,
  ChevronRight,
  ArrowRight,
  Target
} from 'lucide-react';
import { ScrapingFilterParams, Lead } from '../types';
import { TARGET_LOCATIONS } from '../utils/targetLocations';

interface ScrapingViewProps {
  onRunScrape: (params: ScrapingFilterParams) => Promise<Lead[]>;
  onOpenSpreadsheet: () => void;
  onOpenWhatsApp: (lead: Lead) => void;
}

export const ScrapingView: React.FC<ScrapingViewProps> = ({
  onRunScrape,
  onOpenSpreadsheet,
  onOpenWhatsApp,
}) => {
  const [category, setCategory] = useState('Mercadinho / Mercearia');
  const [targetLocationKey, setTargetLocationKey] = useState<
    'all' | 'only_targets' | 'cocaia_guarulhos' | 'senac_jurubatuba' | 'maria_benedita_91' | 'copan_ipiranga'
  >('only_targets');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [limit, setLimit] = useState(4);
  const [filterOnlyWithoutWebsite, setFilterOnlyWithoutWebsite] = useState(true);
  const [filterNeedsInventory, setFilterNeedsInventory] = useState(true);
  const [autoQualifyWithAI, setAutoQualifyWithAI] = useState(true);
  const [autoPushNotification, setAutoPushNotification] = useState(true);
  const [autoDispatchSalesWhatsApp, setAutoDispatchSalesWhatsApp] = useState(false);
  const [salesTeamPhone, setSalesTeamPhone] = useState('5511999998888');

  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [lastScrapedLeads, setLastScrapedLeads] = useState<Lead[]>([]);

  const scrapingSteps = [
    'Conectando ao motor de busca local e mapeando comércios da região...',
    'Verificando existência de domínio e ausência de websites / presença web...',
    'Capturando e higienizando telefones e números de WhatsApp...',
    'Diagnosticando aderência ao controle de estoque mobile (App-CIC)...',
    'Processando qualificação automática com Gemini AI e gerando pitch comercial...',
    'Salvando automaticamente na planilha e enviando notificação push...'
  ];

  const handleSelectTargetLocation = (key: 'all' | 'only_targets' | 'cocaia_guarulhos' | 'senac_jurubatuba' | 'maria_benedita_91' | 'copan_ipiranga') => {
    setTargetLocationKey(key);
    if (key === 'cocaia_guarulhos') {
      setCity('Guarulhos');
      setState('SP');
    } else if (key === 'senac_jurubatuba' || key === 'maria_benedita_91' || key === 'copan_ipiranga' || key === 'only_targets') {
      setCity('São Paulo');
      setState('SP');
    }
  };

  const handleStartScraping = async () => {
    setIsRunning(true);
    setCurrentStepIndex(0);

    // Step simulation progression
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < scrapingSteps.length - 1 ? prev + 1 : prev));
    }, 700);

    try {
      const locLabel = targetLocationKey !== 'all' && targetLocationKey !== 'only_targets' 
        ? TARGET_LOCATIONS[targetLocationKey]?.label 
        : targetLocationKey === 'only_targets'
        ? 'Locais-Alvo (Cocaia, Jurubatuba, Maria Benedita, Copan)'
        : `${city} ${state}`;

      const results = await onRunScrape({
        query: `${category} em ${locLabel}`,
        category,
        city,
        state,
        targetLocationKey,
        targetLocationLabel: locLabel,
        filterOnlyWithoutWebsite,
        filterNeedsInventory,
        autoQualifyWithAI,
        autoPushNotification,
        autoDispatchSalesWhatsApp,
        salesTeamPhone,
        limit,
      });

      setLastScrapedLeads(results);
    } catch (err) {
      console.error('Scraping run failed:', err);
    } finally {
      clearInterval(interval);
      setIsRunning(false);
    }
  };

  return (
    <div id="scraping-view-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Automação de Scraping Inteligente
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
          Varredura Ativa de Negócios Locais Sem Site & Aderentes ao App-CIC
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
          Localize comércios recentes, capture números de WhatsApp validados, filtre carências de vitrine online e controle de estoque de itens/saídas, e organize tudo na planilha com notificação push e script pronto para abordagem de vendas.
        </p>
      </div>

      {/* Control Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" /> Parâmetros de Busca e Filtragem
          </h3>

          {/* Target Location Filter Buttons */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Filtro de Localidade Alvo Solicitada:</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                Filtro Específico
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Selecione uma das 4 regiões prioritárias solicitadas para concentrar a varredura:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                id="scrape-target-only-targets"
                onClick={() => handleSelectTargetLocation('only_targets')}
                className={`p-2 rounded-lg text-left text-xs transition-all border ${
                  targetLocationKey === 'only_targets'
                    ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-2xs ring-2 ring-emerald-400/40'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-1 font-bold">
                  <Target className="w-3 h-3" />
                  <span>Todos os 4 Locais</span>
                </div>
                <div className={`text-[10px] ${targetLocationKey === 'only_targets' ? 'text-emerald-100' : 'text-slate-400'}`}>
                  Varredura balanceada
                </div>
              </button>

              <button
                type="button"
                id="scrape-target-cocaia"
                onClick={() => handleSelectTargetLocation('cocaia_guarulhos')}
                className={`p-2 rounded-lg text-left text-xs transition-all border ${
                  targetLocationKey === 'cocaia_guarulhos'
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>Cocaia Guarulhos</span>
                </div>
                <div className={`text-[10px] ${targetLocationKey === 'cocaia_guarulhos' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Guarulhos - SP
                </div>
              </button>

              <button
                type="button"
                id="scrape-target-senac"
                onClick={() => handleSelectTargetLocation('senac_jurubatuba')}
                className={`p-2 rounded-lg text-left text-xs transition-all border ${
                  targetLocationKey === 'senac_jurubatuba'
                    ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Senac Jurubatuba</span>
                </div>
                <div className={`text-[10px] ${targetLocationKey === 'senac_jurubatuba' ? 'text-amber-100' : 'text-slate-400'}`}>
                  Zona Sul - SP
                </div>
              </button>

              <button
                type="button"
                id="scrape-target-maria-benedita"
                onClick={() => handleSelectTargetLocation('maria_benedita_91')}
                className={`p-2 rounded-lg text-left text-xs transition-all border ${
                  targetLocationKey === 'maria_benedita_91'
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>R. Maria Benedita, 91</span>
                </div>
                <div className={`text-[10px] ${targetLocationKey === 'maria_benedita_91' ? 'text-emerald-100' : 'text-slate-400'}`}>
                  Perímetro Comercial - SP
                </div>
              </button>

              <button
                type="button"
                id="scrape-target-copan"
                onClick={() => handleSelectTargetLocation('copan_ipiranga')}
                className={`p-2 rounded-lg text-left text-xs transition-all border ${
                  targetLocationKey === 'copan_ipiranga'
                    ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50 hover:border-purple-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>Copan / Alto Ipiranga</span>
                </div>
                <div className={`text-[10px] ${targetLocationKey === 'copan_ipiranga' ? 'text-purple-100' : 'text-slate-400'}`}>
                  Centro / Ipiranga - SP
                </div>
              </button>

              <button
                type="button"
                id="scrape-target-all"
                onClick={() => handleSelectTargetLocation('all')}
                className={`p-2 rounded-lg text-left text-xs transition-all border ${
                  targetLocationKey === 'all'
                    ? 'bg-slate-800 text-white border-slate-800 font-bold shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold">Livre / Toda a Cidade</div>
                <div className={`text-[10px] ${targetLocationKey === 'all' ? 'text-slate-200' : 'text-slate-400'}`}>
                  Sem restrição de bairro
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Segmento / Categoria de Comércio:
              </label>
              <select
                id="select-scrape-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white text-slate-800"
              >
                <option value="Mercadinho / Mercearia">Mercadinho / Mercearia</option>
                <option value="Autopeças / Oficina">Autopeças / Oficina Mecânica</option>
                <option value="Restaurante / Lanchonete">Restaurante / Lanchonete</option>
                <option value="Padaria">Padaria & Confeitaria</option>
                <option value="Depósito de Bebidas / Materiais">Depósito de Bebidas / Materiais</option>
                <option value="Loja de Roupas">Loja de Roupas / Boutique</option>
                <option value="Barbearia / Salão">Barbearia / Salão de Beleza</option>
                <option value="Pet Shop">Pet Shop & Agro</option>
              </select>
            </div>

            {/* City & State */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cidade & Estado:
              </label>
              <div className="flex gap-2">
                <select
                  id="select-scrape-city"
                  value={city}
                  onChange={(e) => {
                    const c = e.target.value;
                    setCity(c);
                    if (c === 'São Paulo' || c === 'Campinas') setState('SP');
                    else if (c === 'Rio de Janeiro') setState('RJ');
                    else if (c === 'Belo Horizonte') setState('MG');
                    else if (c === 'Curitiba') setState('PR');
                  }}
                  className="flex-1 text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white text-slate-800"
                >
                  <option value="São Paulo">São Paulo</option>
                  <option value="Rio de Janeiro">Rio de Janeiro</option>
                  <option value="Belo Horizonte">Belo Horizonte</option>
                  <option value="Curitiba">Curitiba</option>
                  <option value="Campinas">Campinas</option>
                </select>
                <input
                  type="text"
                  value={state}
                  readOnly
                  className="w-14 text-center font-bold text-xs p-2.5 bg-slate-100 border border-slate-300 rounded-xl text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Number of Leads */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Quantidade de comércios a capturar por ciclo:</span>
              <span className="font-bold text-emerald-700">{limit} leads</span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              step="1"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Automation Rules / Flags */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Regras de Qualificação & Automação:
            </span>

            {/* Flag 1: No Website */}
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition-colors">
              <input
                type="checkbox"
                id="check-only-without-site"
                checked={filterOnlyWithoutWebsite}
                onChange={(e) => setFilterOnlyWithoutWebsite(e.target.checked)}
                className="mt-0.5 accent-emerald-600 w-4 h-4 rounded"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">
                  Filtrar apenas negócios sem site próprio (ou desatualizado)
                </span>
                <span className="text-slate-500 text-[11px]">
                  Detecta empresas sem URL institucional ou que dependem exclusivamente de redes sociais.
                </span>
              </div>
            </label>

            {/* Flag 2: Inventory Needs for App-CIC */}
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 cursor-pointer hover:bg-purple-50 transition-colors">
              <input
                type="checkbox"
                id="check-needs-inventory-cic"
                checked={filterNeedsInventory}
                onChange={(e) => setFilterNeedsInventory(e.target.checked)}
                className="mt-0.5 accent-purple-600 w-4 h-4 rounded"
              />
              <div className="text-xs">
                <span className="font-bold text-purple-950 block">
                  Priorizar perfil para teste de campo do App-CIC (Controle de Estoque)
                </span>
                <span className="text-purple-700 text-[11px]">
                  Filtra comércios com movimentação diária de itens no balcão que sofrem com falta de registro de saídas.
                </span>
              </div>
            </label>

            {/* Flag 3: AI Qualification */}
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition-colors">
              <input
                type="checkbox"
                id="check-auto-qualify-ai"
                checked={autoQualifyWithAI}
                onChange={(e) => setAutoQualifyWithAI(e.target.checked)}
                className="mt-0.5 accent-emerald-600 w-4 h-4 rounded"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">
                  Qualificação automática com Gemini AI & Geração de Pitch
                </span>
                <span className="text-slate-500 text-[11px]">
                  Calcula score de 0 a 100 e redige script personalizado pronto para abordagem no WhatsApp.
                </span>
              </div>
            </label>

            {/* Flag 4: Push Notifications */}
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition-colors">
              <input
                type="checkbox"
                id="check-auto-push"
                checked={autoPushNotification}
                onChange={(e) => setAutoPushNotification(e.target.checked)}
                className="mt-0.5 accent-emerald-600 w-4 h-4 rounded"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">
                  Disparar notificação push imediata a cada lead cadastrado
                </span>
                <span className="text-slate-500 text-[11px]">
                  Alerta a equipe em tempo real no topo do app e no navegador.
                </span>
              </div>
            </label>

            {/* Flag 5: Auto WhatsApp Dispatch to Sales */}
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition-colors">
              <input
                type="checkbox"
                id="check-auto-dispatch-sales"
                checked={autoDispatchSalesWhatsApp}
                onChange={(e) => setAutoDispatchSalesWhatsApp(e.target.checked)}
                className="mt-0.5 accent-emerald-600 w-4 h-4 rounded"
              />
              <div className="text-xs flex-1">
                <span className="font-bold text-slate-900 block">
                  Encaminhar automaticamente para a equipe de vendas
                </span>
                <span className="text-slate-500 text-[11px]">
                  Coloca o lead imediatamente na fila de disparo comercial.
                </span>
              </div>
            </label>
          </div>

          {/* Trigger Button */}
          <div className="pt-2">
            <button
              id="btn-execute-scraping"
              type="button"
              disabled={isRunning}
              onClick={handleStartScraping}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Executando Varredura e Qualificação Inteligente...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" />
                  <span>Iniciar Scraping & Organização Automática</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Live Execution Progress & Captured Leads */}
        <div className="lg:col-span-5 space-y-4">
          {/* Live Progress Card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Status do Motor de Prospecção
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {isRunning ? 'EM EXECUÇÃO' : 'AGUARDANDO COMANDO'}
              </span>
            </div>

            <div className="space-y-2.5">
              {scrapingSteps.map((step, idx) => {
                const isCurrent = isRunning && idx === currentStepIndex;
                const isDone = (!isRunning && lastScrapedLeads.length > 0) || (isRunning && idx < currentStepIndex);
                return (
                  <div
                    key={idx}
                    className={`text-xs p-2.5 rounded-lg border transition-all flex items-start gap-2.5 ${
                      isCurrent
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                        : isDone
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                        : 'bg-slate-800/30 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-600 block" />
                      )}
                    </div>
                    <span className="leading-snug">{step}</span>
                  </div>
                );
              })}
            </div>

            {lastScrapedLeads.length > 0 && !isRunning && (
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold">
                  ✓ {lastScrapedLeads.length} leads capturados e organizados!
                </span>
                <button
                  onClick={onOpenSpreadsheet}
                  className="text-white hover:text-emerald-300 font-semibold flex items-center gap-1 hover:underline"
                >
                  Ver na Planilha <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Preview of Last Scraped Leads */}
          {lastScrapedLeads.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Leads Recém-Capturados na Varredura:
              </h4>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {lastScrapedLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 truncate">{lead.businessName}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {lead.qualificationScore}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {lead.ownerName} • {lead.neighborhood} • Tel: {lead.phone}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">
                        "{lead.suggestedPitch}"
                      </p>
                    </div>

                    <button
                      id={`btn-scrape-preview-whatsapp-${lead.id}`}
                      onClick={() => onOpenWhatsApp(lead)}
                      title="Disparar no WhatsApp"
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shrink-0 shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
