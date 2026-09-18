import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  Filter, 
  MessageSquare, 
  ExternalLink, 
  Sparkles, 
  Plus, 
  Globe, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  Trash2, 
  Eye, 
  RefreshCw,
  Copy,
  Check,
  Building2,
  MapPin,
  Target,
  Compass
} from 'lucide-react';
import { Lead, WebsiteStatus, LeadStatus } from '../types';
import { 
  filterLeadsByTargetLocation, 
  identifyLeadTargetRegion, 
  TARGET_LOCATIONS 
} from '../utils/targetLocations';

interface SpreadsheetViewProps {
  leads: Lead[];
  onSelectLead: (leadId: string) => void;
  onOpenWhatsApp: (lead: Lead) => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onDeleteLead: (leadId: string) => void;
  onOpenNewLeadModal: () => void;
  onOpenScraping: () => void;
}

export const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({
  leads,
  onSelectLead,
  onOpenWhatsApp,
  onUpdateStatus,
  onDeleteLead,
  onOpenNewLeadModal,
  onOpenScraping,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [targetLocationFilter, setTargetLocationFilter] = useState<
    'all' | 'only_targets' | 'cocaia_guarulhos' | 'senac_jurubatuba' | 'maria_benedita_91' | 'copan_ipiranga'
  >('all');
  const [onlyWithoutWebsite, setOnlyWithoutWebsite] = useState(false);
  const [onlyNeedsInventory, setOnlyNeedsInventory] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => set.add(l.category));
    return Array.from(set).sort();
  }, [leads]);

  // Compute counts for target locations
  const targetLocationCounts = useMemo(() => {
    const counts = {
      all_targets: 0,
      cocaia_guarulhos: 0,
      senac_jurubatuba: 0,
      maria_benedita_91: 0,
      copan_ipiranga: 0,
    };
    leads.forEach((l) => {
      const reg = identifyLeadTargetRegion(l);
      if (reg) {
        counts.all_targets++;
        if (reg.key === 'cocaia_guarulhos') counts.cocaia_guarulhos++;
        if (reg.key === 'senac_jurubatuba') counts.senac_jurubatuba++;
        if (reg.key === 'maria_benedita_91') counts.maria_benedita_91++;
        if (reg.key === 'copan_ipiranga') counts.copan_ipiranga++;
      }
    });
    return counts;
  }, [leads]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (onlyWithoutWebsite && !lead.needsWebsite && lead.websiteStatus === 'active') {
        return false;
      }
      if (onlyNeedsInventory && !lead.needsInventoryControl) {
        return false;
      }
      if (categoryFilter !== 'all' && lead.category !== categoryFilter) {
        return false;
      }
      if (statusFilter !== 'all' && lead.status !== statusFilter) {
        return false;
      }
      if (!filterLeadsByTargetLocation(lead, targetLocationFilter)) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchName = lead.businessName.toLowerCase().includes(q);
        const matchOwner = lead.ownerName.toLowerCase().includes(q);
        const matchCity = lead.city.toLowerCase().includes(q);
        const matchNeighborhood = lead.neighborhood.toLowerCase().includes(q);
        const matchAddress = lead.address.toLowerCase().includes(q);
        const matchPhone = lead.phone.includes(q);
        if (!matchName && !matchOwner && !matchCity && !matchNeighborhood && !matchAddress && !matchPhone) {
          return false;
        }
      }
      return true;
    });
  }, [leads, onlyWithoutWebsite, onlyNeedsInventory, categoryFilter, statusFilter, targetLocationFilter, searchTerm]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Empresa',
      'Responsável',
      'Categoria',
      'Região-Alvo',
      'Cidade',
      'Estado',
      'Bairro',
      'Endereço',
      'Telefone',
      'WhatsApp',
      'Status Site',
      'Necessita Site',
      'Necessita Estoque CIC',
      'Score Qualificação',
      'Grau',
      'Status Comercial',
      'Data de Captura',
    ];

    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.businessName.replace(/"/g, '""')}"`,
      `"${l.ownerName.replace(/"/g, '""')}"`,
      `"${l.category}"`,
      `"${identifyLeadTargetRegion(l)?.label || 'Outra Região'}"`,
      `"${l.city}"`,
      `"${l.state}"`,
      `"${l.neighborhood}"`,
      `"${l.address.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.whatsapp}"`,
      `"${l.websiteStatus}"`,
      l.needsWebsite ? 'SIM' : 'NAO',
      l.needsInventoryControl ? 'SIM' : 'NAO',
      l.qualificationScore,
      `"${l.qualificationGrade}"`,
      `"${l.status}"`,
      `"${new Date(l.createdAt).toLocaleDateString('pt-BR')}"`,
    ]);

    // Add UTF-8 BOM so Excel opens accented Portuguese characters correctly
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `planilha_leads_autocic_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySummary = () => {
    const text = filteredLeads
      .map(
        (l, i) =>
          `${i + 1}. ${l.businessName} (${l.city}/${l.state}) - Tel: ${l.phone} | Sem Site: ${
            l.needsWebsite ? 'SIM' : 'NÃO'
          } | App-CIC: ${l.needsInventoryControl ? 'SIM' : 'NÃO'} | Score: ${l.qualificationScore}/100`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div id="spreadsheet-view-container" className="space-y-4">
      {/* Spreadsheet Header Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Planilha Automatizada de Prospecção & Qualificação
              </h2>
              <p className="text-xs text-slate-500">
                Dados salvos e organizados automaticamente a cada varredura de scraping
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            id="btn-copy-leads-summary"
            onClick={handleCopySummary}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            {copiedNotification ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedNotification ? 'Copiado!' : 'Copiar Resumo'}</span>
          </button>

          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Exportar CSV (Excel/Sheets)</span>
          </button>

          <button
            id="btn-trigger-new-scrape"
            onClick={onOpenScraping}
            className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Capturar Mais Leads</span>
          </button>

          <button
            id="btn-add-manual-lead"
            onClick={onOpenNewLeadModal}
            className="p-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1"
            title="Adicionar contato manualmente"
          >
            <Plus className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              id="input-search-spreadsheet"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por empresa, dono, bairro, tel..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-slate-800"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              id="select-category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-1.5 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-slate-800 bg-white"
            >
              <option value="all">Todas as Categorias ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              id="select-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-1.5 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-slate-800 bg-white"
            >
              <option value="all">Todos os Status</option>
              <option value="novo">Novo</option>
              <option value="qualificado">Qualificado</option>
              <option value="disparado_whatsapp">Disparado WhatsApp</option>
              <option value="em_negociacao">Em Negociação</option>
              <option value="teste_cic">Teste de Campo CIC</option>
              <option value="convertido">Convertido</option>
              <option value="descartado">Descartado</option>
            </select>
          </div>

          {/* Fast Toggle Pills */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="filter-toggle-without-website"
              onClick={() => setOnlyWithoutWebsite(!onlyWithoutWebsite)}
              className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                onlyWithoutWebsite
                  ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {onlyWithoutWebsite ? '✓ Sem Site' : 'Sem Site'}
            </button>

            <button
              type="button"
              id="filter-toggle-needs-inventory"
              onClick={() => setOnlyNeedsInventory(!onlyNeedsInventory)}
              className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                onlyNeedsInventory
                  ? 'bg-purple-50 border-purple-300 text-purple-700 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {onlyNeedsInventory ? '✓ App-CIC' : 'App-CIC'}
            </button>
          </div>
        </div>

        {/* Location Filter Toolbar (Target Specific Neighborhoods & Addresses) */}
        <div className="pt-2.5 border-t border-slate-100 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Filtro de Localidades Solicitadas:</span>
              <span className="text-[11px] text-slate-500 font-normal">
                (Cocaia Guarulhos, Senac Jurubatuba, Rua Maria Benedita Rodrigues 91, Copan & Alto do Ipiranga)
              </span>
            </div>
            {targetLocationFilter !== 'all' && (
              <button
                onClick={() => setTargetLocationFilter('all')}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 self-start sm:self-auto"
              >
                <RefreshCw className="w-3 h-3" /> Limpar filtro de local
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              id="filter-loc-all"
              onClick={() => setTargetLocationFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                targetLocationFilter === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todos os Locais ({leads.length})
            </button>

            <button
              type="button"
              id="filter-loc-only-targets"
              onClick={() => setTargetLocationFilter(targetLocationFilter === 'only_targets' ? 'all' : 'only_targets')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                targetLocationFilter === 'only_targets'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs ring-2 ring-emerald-400/40'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Somente Locais-Alvo (Todos os 4)</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-900/20">
                {targetLocationCounts.all_targets}
              </span>
            </button>

            <button
              type="button"
              id="filter-loc-cocaia"
              onClick={() => setTargetLocationFilter(targetLocationFilter === 'cocaia_guarulhos' ? 'all' : 'cocaia_guarulhos')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                targetLocationFilter === 'cocaia_guarulhos'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Cocaia (Guarulhos)</span>
              <span className="text-[10px] opacity-75 font-mono">({targetLocationCounts.cocaia_guarulhos})</span>
            </button>

            <button
              type="button"
              id="filter-loc-senac"
              onClick={() => setTargetLocationFilter(targetLocationFilter === 'senac_jurubatuba' ? 'all' : 'senac_jurubatuba')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                targetLocationFilter === 'senac_jurubatuba'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Senac Jurubatuba</span>
              <span className="text-[10px] opacity-75 font-mono">({targetLocationCounts.senac_jurubatuba})</span>
            </button>

            <button
              type="button"
              id="filter-loc-maria-benedita"
              onClick={() => setTargetLocationFilter(targetLocationFilter === 'maria_benedita_91' ? 'all' : 'maria_benedita_91')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                targetLocationFilter === 'maria_benedita_91'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Rua Maria Benedita Rodrigues, 91</span>
              <span className="text-[10px] opacity-75 font-mono">({targetLocationCounts.maria_benedita_91})</span>
            </button>

            <button
              type="button"
              id="filter-loc-copan"
              onClick={() => setTargetLocationFilter(targetLocationFilter === 'copan_ipiranga' ? 'all' : 'copan_ipiranga')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                targetLocationFilter === 'copan_ipiranga'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50 hover:border-purple-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Copan / Alto do Ipiranga</span>
              <span className="text-[10px] opacity-75 font-mono">({targetLocationCounts.copan_ipiranga})</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span>
              Exibindo <strong className="text-slate-800 font-bold">{filteredLeads.length}</strong> de {leads.length} contatos registrados
            </span>
            {targetLocationFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Target className="w-3 h-3" />
                Filtro de Local: {
                  targetLocationFilter === 'only_targets' ? 'Somente Locais-Alvo' :
                  targetLocationFilter === 'cocaia_guarulhos' ? 'Cocaia (Guarulhos)' :
                  targetLocationFilter === 'senac_jurubatuba' ? 'Senac Jurubatuba' :
                  targetLocationFilter === 'maria_benedita_91' ? 'Rua Maria Benedita Rodrigues, 91' :
                  'Copan / Alto do Ipiranga'
                }
              </span>
            )}
          </div>
          {(onlyWithoutWebsite || onlyNeedsInventory || categoryFilter !== 'all' || statusFilter !== 'all' || targetLocationFilter !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setOnlyWithoutWebsite(false);
                setOnlyNeedsInventory(false);
                setCategoryFilter('all');
                setStatusFilter('all');
                setTargetLocationFilter('all');
                setSearchTerm('');
              }}
              className="text-emerald-700 hover:underline font-semibold"
            >
              Limpar Todos os Filtros
            </button>
          )}
        </div>
      </div>

      {/* Spreadsheet Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table id="leads-spreadsheet-table" className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-4 min-w-[200px]">Empresa / Comércio</th>
                <th className="py-3 px-3 min-w-[130px]">Contato</th>
                <th className="py-3 px-3 min-w-[140px]">Localização</th>
                <th className="py-3 px-3 min-w-[120px]">Telefone</th>
                <th className="py-3 px-3 min-w-[130px]">Presença Web</th>
                <th className="py-3 px-3 min-w-[110px]">App-CIC</th>
                <th className="py-3 px-3 min-w-[90px] text-center">Score</th>
                <th className="py-3 px-3 min-w-[150px]">Status do Funil</th>
                <th className="py-3 px-4 min-w-[130px] text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileSpreadsheet className="w-8 h-8 text-slate-300" />
                      <p className="font-semibold text-sm">Nenhum registro encontrado com os filtros selecionados.</p>
                      <button
                        onClick={onOpenScraping}
                        className="mt-2 text-xs text-emerald-600 font-bold hover:underline"
                      >
                        Executar nova automação de scraping agora
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, index) => {
                  const targetReg = identifyLeadTargetRegion(lead);
                  return (
                  <tr
                    key={lead.id}
                    id={`spreadsheet-row-${lead.id}`}
                    className="hover:bg-emerald-50/30 transition-colors group cursor-pointer"
                    onClick={() => onSelectLead(lead.id)}
                  >
                    {/* Index */}
                    <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                      {index + 1}
                    </td>

                    {/* Business Name & Category */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {lead.businessName}
                      </div>
                      <div className="text-[11px] text-slate-500">{lead.category}</div>
                    </td>

                    {/* Owner */}
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{lead.ownerName}</div>
                      <div className="text-[10px] text-slate-400">Responsável</div>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-3">
                      {targetReg && (
                        <div className="mb-1">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${targetReg.bgLight} ${targetReg.borderLight} ${targetReg.textColor}`}>
                            <MapPin className="w-2.5 h-2.5" />
                            {targetReg.shortLabel}
                          </span>
                        </div>
                      )}
                      <div className="font-medium text-slate-800">{lead.neighborhood}</div>
                      <div className="text-[11px] text-slate-500">
                        {lead.city} - {lead.state}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]" title={lead.address}>
                        {lead.address}
                      </div>
                    </td>

                    {/* Phone / WhatsApp */}
                    <td className="py-3 px-3">
                      <div className="font-mono text-slate-800">{lead.phone}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> WhatsApp
                      </div>
                    </td>

                    {/* Website Status */}
                    <td className="py-3 px-3">
                      {lead.websiteStatus === 'none' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                          <AlertTriangle className="w-3 h-3" /> Sem Site
                        </span>
                      ) : lead.websiteStatus === 'social_only' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          <Globe className="w-3 h-3" /> Só Insta/Face
                        </span>
                      ) : lead.websiteStatus === 'outdated' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                          Site Antigo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" /> Ativo
                        </span>
                      )}
                    </td>

                    {/* App-CIC Inventory Fit */}
                    <td className="py-3 px-3">
                      {lead.needsInventoryControl ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                          <Package className="w-3 h-3" /> Teste CIC
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>

                    {/* Score */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-bold text-xs ${
                          lead.qualificationScore >= 90
                            ? 'bg-emerald-100 text-emerald-800'
                            : lead.qualificationScore >= 80
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {lead.qualificationScore}
                      </span>
                    </td>

                    {/* Conversion Status Select */}
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        id={`select-status-${lead.id}`}
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                        className={`text-xs font-semibold py-1 px-2 rounded-lg border focus:ring-1 focus:ring-emerald-500 focus:outline-hidden ${
                          lead.status === 'convertido'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                            : lead.status === 'teste_cic'
                            ? 'bg-purple-100 text-purple-900 border-purple-300 font-bold'
                            : lead.status === 'disparado_whatsapp'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : lead.status === 'em_negociacao'
                            ? 'bg-amber-50 text-amber-900 border-amber-200 font-bold'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="novo">Novo Lead</option>
                        <option value="qualificado">Qualificado</option>
                        <option value="disparado_whatsapp">Disparado WhatsApp</option>
                        <option value="em_negociacao">Em Negociação</option>
                        <option value="teste_cic">Teste Campo CIC</option>
                        <option value="convertido">Convertido (Fechado)</option>
                        <option value="descartado">Descartado</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          id={`btn-whatsapp-${lead.id}`}
                          onClick={() => onOpenWhatsApp(lead)}
                          title="Disparar no WhatsApp"
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          id={`btn-view-${lead.id}`}
                          onClick={() => onSelectLead(lead.id)}
                          title="Ver Ficha Completa"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          id={`btn-delete-${lead.id}`}
                          onClick={() => {
                            if (confirm(`Remover "${lead.businessName}" da planilha?`)) {
                              onDeleteLead(lead.id);
                            }
                          }}
                          title="Remover Lead"
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>

        {/* Spreadsheet Footer Status */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sincronização em tempo real com o backend ativa</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            Formato: Planilha Comercial Automatizada UTF-8
          </span>
        </div>
      </div>
    </div>
  );
};
