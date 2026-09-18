import React, { useState, useMemo } from 'react';
import { 
  Package, 
  ArrowDownRight, 
  ArrowUpRight, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Store, 
  Smartphone, 
  History, 
  Trash2, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Layers,
  DollarSign
} from 'lucide-react';
import { Lead, AppCicItem, AppCicMovement } from '../types';

interface AppCicViewProps {
  leads: Lead[];
  items: AppCicItem[];
  movements: AppCicMovement[];
  onAddItem: (item: Partial<AppCicItem>) => Promise<void>;
  onRegisterMovement: (data: { itemId: string; type: 'saida' | 'entrada'; quantity: number; reason: any; notes?: string }) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  onOpenWhatsApp: (lead: Lead) => void;
}

export const AppCicView: React.FC<AppCicViewProps> = ({
  leads = [],
  items = [],
  movements = [],
  onAddItem,
  onRegisterMovement,
  onDeleteItem,
  onOpenWhatsApp,
}) => {
  const safeLeads = Array.isArray(leads) ? leads : [];
  const safeItems = Array.isArray(items) ? items : [];
  const safeMovements = Array.isArray(movements) ? movements : [];

  // Candidate businesses for field test
  const cicCandidateLeads = useMemo(() => {
    return safeLeads.filter((l) => l.needsInventoryControl);
  }, [safeLeads]);

  const [selectedLeadId, setSelectedLeadId] = useState<string>('all');
  const [searchItem, setSearchItem] = useState('');
  const [activeTab, setActiveTab] = useState<'items' | 'movements' | 'leads_pool'>('items');

  // New Item Modal
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Mercearia');
  const [newItemCurrentStock, setNewItemCurrentStock] = useState(10);
  const [newItemMinStock, setNewItemMinStock] = useState(5);
  const [newItemUnitPrice, setNewItemUnitPrice] = useState(15.0);
  const [newItemUnit, setNewItemUnit] = useState('un');

  // Quick Movement Modal (Saída / Entrada)
  const [movementModalItem, setMovementModalItem] = useState<AppCicItem | null>(null);
  const [movementType, setMovementType] = useState<'saida' | 'entrada'>('saida');
  const [movementQuantity, setMovementQuantity] = useState(1);
  const [movementReason, setMovementReason] = useState<'venda_balcao' | 'reposicao' | 'perda_avaria' | 'ajuste_inventario'>('venda_balcao');
  const [movementNotes, setMovementNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedLeadId !== 'all' && item.leadId !== selectedLeadId) {
        return false;
      }
      if (searchItem.trim()) {
        const q = searchItem.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, selectedLeadId, searchItem]);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const leadObj = safeLeads.find((l) => l.id === selectedLeadId);

    await onAddItem({
      name: newItemName,
      category: newItemCategory,
      sku: `CIC-${Math.floor(1000 + Math.random() * 9000)}`,
      currentStock: Number(newItemCurrentStock),
      minStock: Number(newItemMinStock),
      unitPrice: Number(newItemUnitPrice),
      unit: newItemUnit,
      leadId: selectedLeadId !== 'all' ? selectedLeadId : undefined,
      leadBusinessName: leadObj?.businessName,
    });

    setNewItemName('');
    setIsNewItemModalOpen(false);
  };

  const handleConfirmMovement = async () => {
    if (!movementModalItem) return;
    setIsSubmitting(true);
    try {
      await onRegisterMovement({
        itemId: movementModalItem.id,
        type: movementType,
        quantity: movementQuantity,
        reason: movementReason,
        notes: movementNotes,
      });
      setMovementModalItem(null);
      setMovementQuantity(1);
      setMovementNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedLeadObj = safeLeads.find((l) => l.id === selectedLeadId);

  return (
    <div id="app-cic-view-container" className="space-y-6">
      {/* App-CIC Header & GitHub Reference Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 rounded-2xl p-6 text-white border border-purple-900/50 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> Módulo de Teste de Campo: App-CIC
            </span>
            <a
              href="https://github.com/yago-silva-ads/app-cic"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full font-mono hover:bg-white/20 transition-colors"
            >
              github.com/yago-silva-ads/app-cic <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            Controle de Estoque & Registro Rápido de Saídas para Comércios Locais
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Interface móvel simplificada voltada para testes de campo com donos de comércio. Permite cadastrar itens, registrar baixas de vendas em tempo real no balcão e emitir alertas de reposição.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-add-cic-item"
            onClick={() => setIsNewItemModalOpen(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Novo Item</span>
          </button>
        </div>
      </div>

      {/* Business Filter & Quick Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <Store className="w-4 h-4 text-purple-600 shrink-0" />
          <div className="w-full sm:max-w-md">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Comércio Selecionado para Teste de Campo:
            </label>
            <select
              id="select-cic-lead-target"
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full text-xs font-semibold p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-hidden bg-white text-slate-800"
            >
              <option value="all">Todos os comércios monitorados ({items.length} itens)</option>
              {cicCandidateLeads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.businessName} ({lead.neighborhood} - {lead.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedLeadObj && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => onOpenWhatsApp(selectedLeadObj)}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl hover:bg-emerald-100 flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Enviar WhatsApp Comercial</span>
            </button>
          </div>
        )}
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          id="tab-cic-items"
          onClick={() => setActiveTab('items')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'items'
              ? 'bg-purple-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Itens Cadastrados ({filteredItems.length})</span>
        </button>

        <button
          type="button"
          id="tab-cic-movements"
          onClick={() => setActiveTab('movements')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'movements'
              ? 'bg-purple-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Registro de Saídas & Entradas ({movements.length})</span>
        </button>

        <button
          type="button"
          id="tab-cic-leads-pool"
          onClick={() => setActiveTab('leads_pool')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'leads_pool'
              ? 'bg-purple-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Comércios Elegíveis ({cicCandidateLeads.length})</span>
        </button>
      </div>

      {/* TAB 1: Items List (Mobile-friendly Cards & Quick Output Buttons) */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                placeholder="Buscar produto por nome ou SKU..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
            </div>
            <span className="text-xs text-slate-500">
              Clique em <strong>"Baixa de Saída"</strong> para simular uma venda de balcão.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                id={`cic-item-card-${item.id}`}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-purple-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-bold">
                        {item.sku}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{item.name}</h4>
                      <p className="text-[11px] text-slate-500">{item.category}</p>
                    </div>

                    {/* Stock Status Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'esgotado'
                          ? 'bg-rose-100 text-rose-800'
                          : item.status === 'alerta_baixo'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.status === 'esgotado'
                        ? 'Esgotado'
                        : item.status === 'alerta_baixo'
                        ? 'Estoque Baixo'
                        : 'Estoque OK'}
                    </span>
                  </div>

                  {/* Stock Metrics */}
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Estoque Atual:</span>
                      <span className="text-lg font-black text-slate-900">
                        {item.currentStock}{' '}
                        <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Preço Unitário:</span>
                      <span className="text-sm font-bold text-emerald-700">
                        R$ {item.unitPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {item.leadBusinessName && (
                    <p className="text-[10px] text-slate-400 mt-2 truncate">
                      🏢 Vinculado a: <strong>{item.leadBusinessName}</strong>
                    </p>
                  )}
                </div>

                {/* Action Buttons: Quick Output & Input */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    id={`btn-saida-${item.id}`}
                    onClick={() => {
                      setMovementModalItem(item);
                      setMovementType('saida');
                      setMovementReason('venda_balcao');
                    }}
                    className="flex-1 min-h-[44px] py-2 px-2 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                    <span>Baixa Saída</span>
                  </button>

                  <button
                    type="button"
                    id={`btn-entrada-${item.id}`}
                    onClick={() => {
                      setMovementModalItem(item);
                      setMovementType('entrada');
                      setMovementReason('reposicao');
                    }}
                    className="flex-1 min-h-[44px] py-2 px-2 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Entrada</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Excluir item "${item.name}"?`)) onDeleteItem(item.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Movements Log */}
      {activeTab === 'movements' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Histórico de Saídas e Entradas Registradas</h3>
            <span className="text-xs text-slate-500">Total: {movements.length} operações</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Tipo</th>
                  <th className="py-2.5 px-3">Item</th>
                  <th className="py-2.5 px-3">Quantidade</th>
                  <th className="py-2.5 px-3">Motivo</th>
                  <th className="py-2.5 px-3">Valor Total</th>
                  <th className="py-2.5 px-4">Data / Horário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Nenhuma movimentação registrada ainda.
                    </td>
                  </tr>
                ) : (
                  movements.map((mov) => (
                    <tr key={mov.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        {mov.type === 'saida' ? (
                          <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                            <ArrowDownRight className="w-3 h-3 text-rose-600" /> Saída
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                            <ArrowUpRight className="w-3 h-3 text-emerald-600" /> Entrada
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{mov.itemName}</td>
                      <td className="py-3 px-3 font-bold font-mono">
                        {mov.type === 'saida' ? `-${mov.quantity}` : `+${mov.quantity}`}
                      </td>
                      <td className="py-3 px-3 capitalize text-slate-600">
                        {mov.reason.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        R$ {mov.value.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(mov.timestamp).toLocaleDateString('pt-BR')}{' '}
                        {new Date(mov.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Filtered Leads Pool for App-CIC field test */}
      {activeTab === 'leads_pool' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Comércios Locais Recentes Aderentes ao App-CIC
              </h3>
              <p className="text-xs text-slate-500">
                Identificados com necessidade crítica de controle de itens e saídas no balcão
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
              {cicCandidateLeads.length} estabelecimentos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {cicCandidateLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-slate-900">{lead.businessName}</h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      Score {lead.qualificationScore}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {lead.ownerName} • {lead.neighborhood}, {lead.city} • Tel: {lead.phone}
                  </p>
                  <p className="text-[10px] text-slate-600 mt-1 italic">
                    Status Atual: <strong className="uppercase">{lead.status.replace('_', ' ')}</strong>
                  </p>
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedLeadId(lead.id);
                      setActiveTab('items');
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Abrir Estoque
                  </button>
                  <button
                    onClick={() => onOpenWhatsApp(lead)}
                    className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add New Item */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-slate-900 text-base">Cadastrar Novo Item no App-CIC</h3>

            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome do Produto:</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Ex: Óleo 5W30 Sintético, Pão Francês, Arroz 5kg"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoria:</label>
                  <input
                    type="text"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unidade:</label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="un">un (unidade)</option>
                    <option value="cx">cx (caixa)</option>
                    <option value="pct">pct (pacote)</option>
                    <option value="kg">kg (quilo)</option>
                    <option value="sc">sc (saco)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estoque Inicial:</label>
                  <input
                    type="number"
                    min="0"
                    value={newItemCurrentStock}
                    onChange={(e) => setNewItemCurrentStock(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estoque Mínimo:</label>
                  <input
                    type="number"
                    min="1"
                    value={newItemMinStock}
                    onChange={(e) => setNewItemMinStock(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preço (R$):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={newItemUnitPrice}
                    onChange={(e) => setNewItemUnitPrice(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg"
                >
                  Salvar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quick Stock Output / Input */}
      {movementModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                {movementType === 'saida' ? 'Registrar Baixa de Saída' : 'Registrar Entrada de Estoque'}
              </h3>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  movementType === 'saida' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {movementType.toUpperCase()}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <p className="font-bold text-slate-900 text-sm">{movementModalItem.name}</p>
              <p className="text-slate-500">
                Estoque atual: <strong>{movementModalItem.currentStock} {movementModalItem.unit}</strong> • Preço: R$ {movementModalItem.unitPrice.toFixed(2)}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quantidade a movimentar ({movementModalItem.unit}):
                </label>
                <input
                  type="number"
                  min="1"
                  max={movementType === 'saida' ? movementModalItem.currentStock || 999 : 9999}
                  value={movementQuantity}
                  onChange={(e) => setMovementQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full text-base font-bold p-2 border border-slate-300 rounded-lg text-center"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motivo da Movimentação:</label>
                <select
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {movementType === 'saida' ? (
                    <>
                      <option value="venda_balcao">Venda Balcão / Caixa</option>
                      <option value="perda_avaria">Perda / Avaria / Vencimento</option>
                      <option value="ajuste_inventario">Ajuste de Contagem</option>
                    </>
                  ) : (
                    <>
                      <option value="reposicao">Reposição de Fornecedor</option>
                      <option value="ajuste_inventario">Ajuste de Contagem</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observações (opcional):</label>
                <input
                  type="text"
                  value={movementNotes}
                  onChange={(e) => setMovementNotes(e.target.value)}
                  placeholder="Ex: Caixa 1, atendente Lucas"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between text-xs font-bold text-purple-900">
                <span>Total da Operação:</span>
                <span>R$ {(movementQuantity * movementModalItem.unitPrice).toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setMovementModalItem(null)}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmMovement}
                className={`px-4 py-2 font-bold text-xs text-white rounded-lg ${
                  movementType === 'saida' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isSubmitting ? 'Salvando...' : 'Confirmar Baixa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
