import React, { useState, useEffect } from 'react';
import { 
  MessageSquareQuote, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Globe, 
  MapPin, 
  Smartphone, 
  Phone, 
  DollarSign, 
  Copy, 
  Check, 
  ExternalLink,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Wrench,
  TrendingUp,
  Filter,
  Plus
} from 'lucide-react';
import { MerchantFeedback } from '../types';

interface FeedbackViewProps {
  onNotify?: (title: string, message: string, type: 'conversion' | 'cic_alert' | 'whatsapp_sent') => void;
}

const INITIAL_FEEDBACKS: MerchantFeedback[] = [
  {
    id: 'fb-01',
    businessName: 'Hortifruti & Quitanda Cocaia',
    ownerName: 'Gilberto Siqueira',
    phone: '11984210982',
    region: 'Cocaia (Guarulhos)',
    category: 'Quitanda e Hortifruti',
    ratingEase: 9,
    stockAlertHelped: 'yes',
    whatLiked: 'A rapidez para dar baixa no morango e na batata no balcão sem travar a fila. Em 2 toques eu tirava 5 caixas e o alerta amarelo me avisou às 15h para pedir mais antes de acabar.',
    whatDisliked: 'No horário de pico das 17h digitar o nome da fruta pelo teclado demorou um pouco, seria melhor clicar na foto ou bipar com a câmera.',
    whatToImprove: 'Colocar leitor de código de barras ou atalhos com ícones grandes das 10 frutas mais vendidas na tela principal.',
    missingFeatures: ['Leitor de código de barras pela câmera', 'Fotos grandes dos produtos'],
    wantsWebsite: 'yes',
    notes: 'Disse que vários clientes do condomínio vizinho pedem cardápio pelo WhatsApp para entrega em domicílio.',
    status: 'em_negociacao_site',
    createdAt: '2026-09-17T14:30:00.000Z'
  },
  {
    id: 'fb-02',
    businessName: 'Restaurante & Grill Jurubatuba',
    ownerName: 'Marcos Vinicius',
    phone: '11971204481',
    region: 'Senac Jurubatuba',
    category: 'Restaurante & Buffet',
    ratingEase: 8,
    stockAlertHelped: 'yes',
    whatLiked: 'O controle de refrigerantes em lata e marmitas térmicas. O alerta vermelho evitou que faltasse Coca-Cola Zero no almoço dos universitários do Senac.',
    whatDisliked: 'Achei que poderia ter opção de imprimir cupomzinho na impressora térmica Bluetooth de balcão para grampear na marmita.',
    whatToImprove: 'Integração com maquininha de cupom não fiscal de 58mm.',
    missingFeatures: ['Impressora térmica Bluetooth de cupom', 'Integração com PIX'],
    wantsWebsite: 'yes',
    notes: 'Quer uma página simples com o cardápio do dia para os alunos do Senac consultarem antes de descer pro almoço.',
    status: 'novo',
    createdAt: '2026-09-18T11:15:00.000Z'
  },
  {
    id: 'fb-03',
    businessName: 'Empório & Café Copan',
    ownerName: 'Renata Beltrão',
    phone: '11988341209',
    region: 'Copan / Alto do Ipiranga',
    category: 'Cafeteria & Empório Gourmet',
    ratingEase: 10,
    stockAlertHelped: 'yes',
    whatLiked: 'Visual super limpo, não polui a bancada do barista. Conseguimos controlar o estoque de grãos especiais e vinhos artesanais perfeitamente.',
    whatDisliked: 'Sentimos falta de cadastrar clientes frequentes para marcar conta do mês (fiado corporativo de escritórios do Copan).',
    whatToImprove: 'Aba de clientes mensalistas para juntar as saídas de café da semana inteira.',
    missingFeatures: ['Controle de fiado / clientes recorrentes', 'Relatório de vendas em PDF'],
    wantsWebsite: 'maybe',
    notes: 'Possui Instagram, mas não tem catálogo com preços e botão de compra.',
    status: 'novo',
    createdAt: '2026-09-18T13:40:00.000Z'
  }
];

export const FeedbackView: React.FC<FeedbackViewProps> = ({ onNotify }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [feedbacks, setFeedbacks] = useState<MerchantFeedback[]>(() => {
    const saved = localStorage.getItem('autolead_feedbacks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_FEEDBACKS;
      }
    }
    return INITIAL_FEEDBACKS;
  });

  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState<string | null>(null);

  // Form States
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('Cocaia (Guarulhos)');
  const [category, setCategory] = useState('');
  const [ratingEase, setRatingEase] = useState<number>(9);
  const [stockAlertHelped, setStockAlertHelped] = useState<'yes' | 'partially' | 'no'>('yes');
  const [whatLiked, setWhatLiked] = useState('');
  const [whatDisliked, setWhatDisliked] = useState('');
  const [whatToImprove, setWhatToImprove] = useState('');
  const [missingFeatures, setMissingFeatures] = useState<string[]>([]);
  const [wantsWebsite, setWantsWebsite] = useState<'yes' | 'maybe' | 'already_has' | 'no'>('yes');
  const [notes, setNotes] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem('autolead_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  const toggleFeature = (feature: string) => {
    if (missingFeatures.includes(feature)) {
      setMissingFeatures(missingFeatures.filter(f => f !== feature));
    } else {
      setMissingFeatures([...missingFeatures, feature]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !ownerName || !whatLiked) return;

    const newFeedback: MerchantFeedback = {
      id: `fb-${Date.now().toString().slice(-4)}`,
      businessName,
      ownerName,
      phone: phone || '11999999999',
      region,
      category: category || 'Comércio Local',
      ratingEase,
      stockAlertHelped,
      whatLiked,
      whatDisliked: whatDisliked || 'Nenhuma reclamação expressiva.',
      whatToImprove: whatToImprove || 'Continuar mantendo o app rápido e prático.',
      missingFeatures,
      wantsWebsite,
      notes,
      status: wantsWebsite === 'yes' || wantsWebsite === 'maybe' ? 'em_negociacao_site' : 'analisado',
      createdAt: new Date().toISOString()
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setFormSubmitted(true);

    if (onNotify) {
      onNotify(
        'Novo Feedback Recebido!',
        `${businessName} avaliou com nota ${ratingEase}/10. ${wantsWebsite === 'yes' ? '🔥 QUER SITE PRÓPRIO!' : ''}`,
        wantsWebsite === 'yes' ? 'conversion' : 'cic_alert'
      );
    }

    setTimeout(() => {
      setFormSubmitted(false);
      setActiveTab('list');
      // Reset form
      setBusinessName('');
      setOwnerName('');
      setPhone('');
      setCategory('');
      setWhatLiked('');
      setWhatDisliked('');
      setWhatToImprove('');
      setMissingFeatures([]);
      setNotes('');
    }, 1800);
  };

  const handleCopyFormLink = () => {
    const url = `${window.location.origin}/#feedback`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const openWhatsAppPitch = (fb: MerchantFeedback) => {
    const cleanPhone = fb.phone.replace(/\D/g, '');
    const phoneWithDDI = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const firstName = fb.ownerName.split(' ')[0];

    let text = `Olá, ${firstName}! Tudo bem?\n\nVi aqui as suas respostas no formulário do *App-CIC* sobre o *${fb.businessName}* e fiquei muito feliz com seus elogios e os pontos que você indicou para melhorarmos no balcão!\n\nVocê comentou que seus clientes costumam perguntar sobre cardápio/catálogo na internet. Como eu desenvolvo páginas e sites express para negócios aqui da região, montei uma prévia de como ficaria o site oficial do *${fb.businessName}* com botão direto para pedidos no seu WhatsApp.\n\nConsigo colocar no ar em 48h por uma condição de parceria bem acessível. Posso te mandar o link da prévia para você ver como ficou?`;

    const whatsappUrl = `https://wa.me/${phoneWithDDI}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredFeedbacks = feedbacks.filter(fb => {
    if (regionFilter === 'all') return true;
    return fb.region.toLowerCase().includes(regionFilter.toLowerCase());
  });

  const highIntentCount = feedbacks.filter(f => f.wantsWebsite === 'yes' || f.wantsWebsite === 'maybe').length;
  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, curr) => acc + curr.ratingEase, 0) / feedbacks.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Top Value Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white border border-emerald-800/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-400/30">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Central de Feedback dos Empreendedores &amp; Radar de Venda de Sites</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Validação Real de Campo + Máquina de Fechamento
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Aqui você gerencia as opiniões detalhadas dos donos de negócios que estão usando o <strong>App-CIC gratuitamente</strong>. 
            Eles apontam o que gostaram, o que odiaram e o que falta para aprimorar o app — e respondem se precisam de site na internet, gerando <strong>leads quentes de R$ 1.200 a R$ 2.500</strong> para você fechar no WhatsApp!
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => setActiveTab('form')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Simular / Preencher Novo Feedback</span>
            </button>
            <button
              onClick={handleCopyFormLink}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copiado para WhatsApp!' : 'Copiar Link do Formulário p/ Comerciante'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Feedbacks Coletados</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{feedbacks.length} comércios</div>
            <span className="text-[11px] text-emerald-600 font-semibold">Testando App-CIC no balcão</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nota Média de Usabilidade</span>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">{avgRating} <span className="text-sm text-slate-400">/ 10</span></div>
            <span className="text-[11px] text-slate-500 font-medium">Aprovação alta do balcão</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ThumbsUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/50 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider">Oportunidades de Venda de Site</span>
            <div className="text-2xl font-black text-emerald-950 mt-0.5">{highIntentCount} negócios</div>
            <span className="text-[11px] font-bold text-emerald-700">Potencial: R$ {(highIntentCount * 1400).toLocaleString('pt-BR')},00</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'list'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <MessageSquareQuote className="w-4 h-4" />
          <span>Respostas Coletadas ({feedbacks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('form')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'form'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Send className="w-4 h-4 text-emerald-400" />
          <span>Formulário Oficial de Feedback (Preenchimento)</span>
        </button>
      </div>

      {/* TAB: FEEDBACK LIST & CLOSING PANEL */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Region Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Filtrar por Praça:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { key: 'all', label: 'Todos os Locais' },
                { key: 'Cocaia', label: 'Cocaia (Guarulhos)' },
                { key: 'Jurubatuba', label: 'Senac Jurubatuba' },
                { key: 'Copan', label: 'Copan / Ipiranga' }
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setRegionFilter(item.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    regionFilter === item.key
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Cards */}
          <div className="grid grid-cols-1 gap-4">
            {filteredFeedbacks.map((fb) => (
              <div 
                key={fb.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-emerald-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-black text-sm">
                      {fb.ratingEase}/10
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-900">{fb.businessName}</h3>
                        <span className="text-[11px] font-semibold text-slate-500">• {fb.ownerName}</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                          <MapPin className="w-3 h-3" />
                          {fb.region}
                        </span>
                        <span>• {fb.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {fb.wantsWebsite === 'yes' && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        🔥 QUER SITE PRÓPRIO
                      </span>
                    )}
                    {fb.wantsWebsite === 'maybe' && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        ⚡ Potencial Site
                      </span>
                    )}

                    <button
                      onClick={() => openWhatsAppPitch(fb)}
                      className="min-h-[44px] px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Ofertar Site no WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* 3 Columns: Gostou / Não Gostou / O que Falta */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                    <div className="font-bold text-emerald-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>O que Realmente Gostou:</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{fb.whatLiked}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1">
                    <div className="font-bold text-rose-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                      <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
                      <span>O que Não Gostou / Quase Fez Desistir:</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{fb.whatDisliked}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1">
                    <div className="font-bold text-amber-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                      <Wrench className="w-3.5 h-3.5 text-amber-600" />
                      <span>O que Deve Melhorar &amp; Faltou:</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{fb.whatToImprove}</p>
                    {fb.missingFeatures.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 pt-1 border-t border-amber-200/60">
                        {fb.missingFeatures.map(feat => (
                          <span key={feat} className="text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer notes */}
                {fb.notes && (
                  <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span><strong>Observação de Campo:</strong> {fb.notes}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(fb.createdAt).toLocaleDateString('pt-BR')} às {new Date(fb.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: INTERACTIVE FORM (FOR THE MERCHANT) */}
      {activeTab === 'form' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2 border-b border-slate-100 pb-5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Formulário Oficial de Validação do App-CIC
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Avaliação de Teste de Campo &amp; Balcão
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              Sua resposta sincera é o que define as próximas atualizações do aplicativo. Diga sem rodeios o que funcionou e o que foi difícil.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-lg font-black text-emerald-950">Feedback Registrado com Sucesso!</h3>
              <p className="text-xs text-emerald-800">
                Os dados foram adicionados à sua central de validação e o lead já está pronto para o pitch de criação de site. Redirecionando...
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Seção 1: Dados do Comércio */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Identificação do Comércio</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Comércio *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Mercearia do Zé"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Seu Nome / Responsável *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: José Santos (Proprietário)"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp para Contato *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 11988887777"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Região / Bairro</label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    >
                      <option value="Cocaia (Guarulhos)">Cocaia (Guarulhos)</option>
                      <option value="Senac Jurubatuba">Senac Jurubatuba</option>
                      <option value="Rua Maria Benedita Rodrigues, 91">Rua Maria Benedita Rodrigues, 91</option>
                      <option value="Copan / Alto do Ipiranga">Copan / Alto do Ipiranga</option>
                      <option value="Outra Região">Outra Região</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Seção 2: Usabilidade */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Usabilidade no Balcão</h3>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">De 0 a 10, quão fácil e rápido foi usar o App-CIC no balcão?</label>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{ratingEase}/10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={ratingEase}
                    onChange={(e) => setRatingEase(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0 (Muito difícil/trava fila)</span>
                    <span>5 (Mais ou menos)</span>
                    <span>10 (Muito rápido/em 2 cliques)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    O alerta de estoque baixo (amarelo/vermelho) ajudou a saber a hora de repor mercadorias?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { val: 'yes', label: 'Sim, ajudou bastante' },
                      { val: 'partially', label: 'Ajudou moderadamente' },
                      { val: 'no', label: 'Não usei essa função' }
                    ].map(opt => (
                      <button
                        type="button"
                        key={opt.val}
                        onClick={() => setStockAlertHelped(opt.val as any)}
                        className={`min-h-[44px] p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          stockAlertHelped === opt.val
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seção 3: Sinceridade Total (Gostou vs Não Gostou) */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. O que Realmente Aconteceu no Teste</h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    O que você <span className="text-emerald-700 font-black">REALMENTE GOSTOU</span> no aplicativo? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Ex: Gostei da velocidade de dar baixa pelo celular, não precisei ligar o computador e vi que evitou faltar produto no fim da tarde..."
                    value={whatLiked}
                    onChange={(e) => setWhatLiked(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    O que você <span className="text-rose-700 font-black">NÃO GOSTOU</span> ou achou difícil / quase fez desistir?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Achei chato ter que digitar o nome na busca toda vez que o cliente comprava com pressa, ou a fonte ficou pequena no meu celular..."
                    value={whatDisliked}
                    onChange={(e) => setWhatDisliked(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quais recursos fizeram falta para o seu comércio? (Marque as opções):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {[
                      'Leitor de código de barras pela câmera',
                      'Impressora térmica Bluetooth de cupom',
                      'Controle de fiado / clientes recorrentes',
                      'Chave PIX e cálculo de troco no balcão',
                      'Fotos grandes dos produtos na tela inicial',
                      'Relatório diário de vendas em PDF no WhatsApp'
                    ].map(feat => (
                      <label 
                        key={feat} 
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          missingFeatures.includes(feat)
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={missingFeatures.includes(feat)}
                          onChange={() => toggleFeature(feat)}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>{feat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seção 4: O Gancho de Ouro do Site */}
              <div className="space-y-4 pt-4 border-t border-slate-100 bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                    4. Presença na Internet &amp; Pedidos Online
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Seus clientes costumam perguntar se vocês têm site, cardápio digital ou catálogo na internet para pedir por WhatsApp?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { val: 'yes', label: '🔥 Sim, direto clientes perguntam!', highlight: true },
                      { val: 'maybe', label: '⚡ Gostaria muito de ter um site próprio', highlight: true },
                      { val: 'already_has', label: 'Já tenho um site ativo', highlight: false },
                      { val: 'no', label: 'Não tenho interesse no momento', highlight: false }
                    ].map(opt => (
                      <button
                        type="button"
                        key={opt.val}
                        onClick={() => setWantsWebsite(opt.val as any)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                          wantsWebsite === opt.val
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {opt.highlight && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Avaliação &amp; Registrar Dados de Melhoria</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
