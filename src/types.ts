export type WebsiteStatus = 'none' | 'social_only' | 'outdated' | 'active';

export type LeadStatus = 
  | 'novo'
  | 'qualificado'
  | 'disparado_whatsapp'
  | 'em_negociacao'
  | 'teste_cic'
  | 'convertido'
  | 'descartado';

export type DispatchStatus = 'pendente' | 'enviado' | 'respondido';

export type QualificationGrade = 'A (Altíssima)' | 'B (Boa)' | 'C (Média)' | 'D (Baixa)';

export interface LeadHistoryItem {
  id: string;
  timestamp: string;
  action: string;
  note?: string;
}

export interface Lead {
  id: string;
  businessName: string;
  ownerName: string;
  category: string;
  city: string;
  state: string;
  neighborhood: string;
  address: string;
  phone: string;
  whatsapp: string;
  websiteStatus: WebsiteStatus;
  websiteUrl?: string;
  instagram?: string;
  needsWebsite: boolean;
  needsInventoryControl: boolean; // Requisito App-CIC
  painPoints: string[];
  qualificationScore: number; // 0 to 100
  qualificationGrade: QualificationGrade;
  isQualified: boolean;
  qualificationSummary: string;
  suggestedPitch: string;
  status: LeadStatus;
  dispatchStatus: DispatchStatus;
  salesNotes: string;
  targetRegionKey?: 'cocaia_guarulhos' | 'senac_jurubatuba' | 'maria_benedita_91' | 'copan_ipiranga' | 'other';
  createdAt: string;
  lastContactAt?: string;
  history: LeadHistoryItem[];
}

export interface AppCicItem {
  id: string;
  leadId?: string;
  leadBusinessName?: string;
  name: string;
  category: string;
  sku: string;
  currentStock: number;
  minStock: number;
  unitPrice: number;
  unit: string;
  status: 'ok' | 'alerta_baixo' | 'esgotado';
  lastMovementDate: string;
}

export interface AppCicMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'saida' | 'entrada';
  quantity: number;
  reason: 'venda_balcao' | 'reposicao' | 'perda_avaria' | 'ajuste_inventario';
  timestamp: string;
  value: number;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  leadId?: string;
  type: 'new_lead' | 'qualified' | 'whatsapp_sent' | 'cic_alert' | 'conversion';
  read: boolean;
}

export interface ScrapingFilterParams {
  query: string;
  category: string;
  city: string;
  state: string;
  filterOnlyWithoutWebsite: boolean;
  filterNeedsInventory: boolean;
  autoQualifyWithAI: boolean;
  autoPushNotification: boolean;
  autoDispatchSalesWhatsApp: boolean;
  salesTeamPhone: string;
  targetLocationKey?: 'all' | 'only_targets' | 'cocaia_guarulhos' | 'senac_jurubatuba' | 'maria_benedita_91' | 'copan_ipiranga';
  targetLocationLabel?: string;
  limit: number;
}

export interface StrategicReport {
  period: 'semanal' | 'mensal';
  dateRange: string;
  totalScraped: number;
  withoutWebsiteCount: number;
  inventoryNeedCount: number;
  qualifiedCount: number;
  whatsappDispatchedCount: number;
  conversionCount: number;
  cicTestsActive: number;
  conversionRate: number;
  topNiches: { name: string; count: number; conversionRate: number }[];
  strategicInsights: string[];
  recommendedActions: string[];
  aiAnalysisText?: string;
}

export interface MerchantFeedback {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  region: string;
  category: string;
  ratingEase: number; // 0 to 10
  stockAlertHelped: 'yes' | 'partially' | 'no';
  whatLiked: string; // O que realmente gostou
  whatDisliked: string; // O que não gostou ou quase desistiu
  whatToImprove: string; // Sugestões de melhorias
  missingFeatures: string[]; // Funções que mais fizeram falta
  wantsWebsite: 'yes' | 'maybe' | 'already_has' | 'no'; // Gatilho de venda de site
  notes?: string;
  status: 'novo' | 'analisado' | 'em_negociacao_site' | 'site_fechado';
  createdAt: string;
}
