import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Smartphone, 
  Monitor, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Store, 
  Wrench, 
  Utensils, 
  Hammer, 
  Dog, 
  Palette, 
  DollarSign, 
  Download, 
  Share2, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Lead, WebsiteDemoConfig, WebsiteDemoItem } from '../types';

interface WebsiteDemoViewProps {
  leads: Lead[];
  selectedLeadId?: string | null;
  onGoToSpreadsheet: () => void;
  onGoToFeedback?: () => void;
  onSelectLead?: (leadId: string) => void;
}

// Preset archetypes for high conversion
const ARCHETYPES_DATA: Record<string, {
  tagline: string;
  headline: string;
  subheadline: string;
  heroImage: string;
  themeColor: 'emerald' | 'blue' | 'amber' | 'purple' | 'rose' | 'slate';
  ctaButtonText: string;
  services: WebsiteDemoItem[];
  highlights: string[];
  workingHours: string;
}> = {
  mecanica: {
    tagline: 'Oficina Especializada & Auto Center no Bairro',
    headline: 'Manutenção de Confiança, Diagnóstico Rápido e Preço Justo',
    subheadline: 'Seu carro em boas mãos com profissionais experientes, peças de qualidade e garantia comprovada para você rodar com segurança.',
    heroImage: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80',
    themeColor: 'blue',
    ctaButtonText: 'Agendar Revisão no WhatsApp',
    services: [
      { title: 'Troca de Óleo & Filtros Express', desc: 'Lubrificantes originais sintéticos e semi-sintéticos com checagem de 15 itens grátis.', priceText: 'A partir de R$ 140', badge: 'Mais Pedido' },
      { title: 'Freios, Suspensão & Amortecedores', desc: 'Diagnóstico computadorizado de pastilhas, discos e alinhamento completo.', priceText: 'Orçamento Grátis' },
      { title: 'Injeção Eletrônica & Diagnóstico Scanner', desc: 'Leitura completa de falhas no painel e regulagem de motores flex.', priceText: 'Sob Consulta', badge: 'Rápido' },
      { title: 'Socorro & Baterias no Bairro', desc: 'Troca de bateria com entrega e instalação rápida no local onde seu carro parou.', priceText: 'Atendimento Rápido' }
    ],
    highlights: ['Garantia de 90 dias em todas as peças', 'Parcelamento em até 10x no cartão', 'Orçamento sem compromisso', 'Mecânicos certificados'],
    workingHours: 'Segunda a Sexta: 08:00 às 18:00 | Sábados: 08:00 às 13:00'
  },
  alimentacao: {
    tagline: 'Padaria, Mercadinho & Conveniência da Família',
    headline: 'Pães Quentinhos a Toda Hora e Produtos Frescos na Sua Mesa',
    subheadline: 'O sabor da tradição com conveniência total. Faça sua encomenda ou peça pelo WhatsApp para retirar sem filas no balcão.',
    heroImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    themeColor: 'amber',
    ctaButtonText: 'Pedir Cardápio no WhatsApp',
    services: [
      { title: 'Fornadas de Pão Francês & Artesanal', desc: 'Saindo de hora em hora crocante e quentinho direto do forno.', priceText: 'Sempre Fresco', badge: 'Carro Chefe' },
      { title: 'Lanches de Chapa, Salgados & Café', desc: 'Mistura quente, pão com queijo tostado, café expresso e sucos naturais.', priceText: 'A partir de R$ 8' },
      { title: 'Frios & Laticínios Fatiados na Hora', desc: 'Queijos nobres, presuntos especiais e frios selecionados com higiene total.', priceText: 'Preço por Peso' },
      { title: 'Kit Festa & Encomendas de Bolos', desc: 'Bolos confeitados, tortas doces e centos de salgadinhos para o seu evento.', priceText: 'Sob Encomenda', badge: 'Encomendas' }
    ],
    highlights: ['Pães frescos saindo de hora em hora', 'Pedidos adiantados pelo WhatsApp sem fila', 'Aceitamos cartões, Pix e VR', 'Estacionamento rápido no local'],
    workingHours: 'Segunda a Sábado: 06:00 às 21:00 | Domingos: 06:30 às 14:00'
  },
  construcao: {
    tagline: 'Materiais de Construção, Ferragens & Ferramentas',
    headline: 'Do Alicerce ao Acabamento: Entrega Rápida Direto na Sua Obra',
    subheadline: 'Tudo em cimento, areia, blocos, hidráulica, elétrica e tintas. O melhor preço do bairro com entrega no mesmo dia.',
    heroImage: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1200&q=80',
    themeColor: 'emerald',
    ctaButtonText: 'Cotar Orçamento de Obra no WhatsApp',
    services: [
      { title: 'Cimento, Areia, Brita & Blocos', desc: 'Materiais básicos das melhores marcas com entrega agilizada para pedreiros e mestres.', priceText: 'Preço de Atacado', badge: 'Mais Vendido' },
      { title: 'Tintas, Vernizes & Acessórios', desc: 'Linha completa imobiliária com sistema de cores personalizadas na hora.', priceText: 'Grandes Marcas' },
      { title: 'Hidráulica, Tubos & Conexões', desc: 'Canos de esgoto, água quente, caixas d\'água e registros de alta durabilidade.', priceText: 'Linha Completa' },
      { title: 'Ferramentas Manuais & Elétricas', desc: 'Furadeiras, serras, discos de corte, extensões e EPIs de proteção.', priceText: 'Com Garantia', badge: 'Promoção' }
    ],
    highlights: ['Entrega expressa no bairro em até 24h', 'Condições facilitadas para construtores e reformas', 'Desconto especial para pagamento no Pix', 'Vendedores técnicos que entendem de obra'],
    workingHours: 'Segunda a Sexta: 07:30 às 18:00 | Sábados: 07:30 às 14:00'
  },
  pet: {
    tagline: 'Pet Shop, Rações & Estética Animal',
    headline: 'Amor, Carinho e Saúde para o seu Melhor Amigo',
    subheadline: 'Banho relaxante com água morninha, tosa na tesoura, melhores marcas de rações e medicamentos veterinários com entrega rápida.',
    heroImage: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80',
    themeColor: 'purple',
    ctaButtonText: 'Agendar Banho / Pedir Ração no WhatsApp',
    services: [
      { title: 'Banho & Tosa Especializada', desc: 'Ambiente climatizado, toalhas higienizadas individuais e produtos hipoalergênicos.', priceText: 'A partir de R$ 55', badge: 'Mais Procurado' },
      { title: 'Rações Premium & Super Premium', desc: 'Grande variedade para cães e gatos de todas as raças e fases de vida.', priceText: 'Entrega Grátis' },
      { title: 'Farmácia Veterinária & Antipulgas', desc: 'Vermífugos, carrapaticidas, suplementos e itens de cuidados essenciais.', priceText: 'Consultoria' },
      { title: 'Acessórios, Petiscos & Brinquedos', desc: 'Coleiras confortáveis, guias, caminhas ortopédicas e petiscos saudáveis.', priceText: 'Novidades', badge: 'Divertido' }
    ],
    highlights: ['Taxi Pet disponível para buscar e levar seu bichinho', 'Produtos antialérgicos com cheirinho suave', 'Acompanhamento do banho por vídeo', 'Desconto de 10% no primeiro banho'],
    workingHours: 'Segunda a Sábado: 08:30 às 18:30'
  },
  geral: {
    tagline: 'Comércio & Serviços Locais de Confiança',
    headline: 'Qualidade, Rapidez e o Melhor Atendimento da Região',
    subheadline: 'Produtos selecionados com preços justos e atendimento humano no balcão e online. Faça seu pedido com facilidade.',
    heroImage: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80',
    themeColor: 'emerald',
    ctaButtonText: 'Fale Conosco pelo WhatsApp',
    services: [
      { title: 'Atendimento Personalizado', desc: 'Soluções sob medida para o que você precisa no dia a dia.', priceText: 'Consulte', badge: 'Destaque' },
      { title: 'Pronta Entrega no Bairro', desc: 'Rapidez e pontualidade na entrega dos seus produtos.', priceText: 'Rápido' },
      { title: 'Formas Flexíveis de Pagamento', desc: 'Pix, cartões de crédito e débito com facilidade.', priceText: 'Sem Juros' },
      { title: 'Garantia e Pós-Venda', desc: 'Compromisso com a sua satisfação em cada compra.', priceText: '100% Seguro', badge: 'Garantido' }
    ],
    highlights: ['Tradição e respeito com os clientes do bairro', 'Atendimento direto pelo WhatsApp', 'Preços competitivos e justos', 'Agilidade no pedido e na entrega'],
    workingHours: 'Segunda a Sábado: 08:00 às 19:00'
  }
};

export const WebsiteDemoView: React.FC<WebsiteDemoViewProps> = ({
  leads,
  selectedLeadId,
  onGoToSpreadsheet,
  onGoToFeedback,
}) => {
  // Find initial lead or fallback to first qualified without website
  const initialLead = leads.find(l => l.id === selectedLeadId) || 
    leads.find(l => l.needsWebsite) || 
    leads[0];

  const [selectedLead, setSelectedLead] = useState<Lead | null>(initialLead || null);
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('mobile');
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [copiedDemoLink, setCopiedDemoLink] = useState(false);
  const [themeColor, setThemeColor] = useState<'emerald' | 'blue' | 'amber' | 'purple' | 'rose' | 'slate'>('blue');
  
  // Customization fields
  const [businessName, setBusinessName] = useState(initialLead?.businessName || 'Auto Mecânica & Peças Central');
  const [ownerName, setOwnerName] = useState(initialLead?.ownerName || 'Carlos Oliveira');
  const [phone, setPhone] = useState(initialLead?.whatsapp || '11988887777');
  const [address, setAddress] = useState(initialLead?.address || 'Av. Brigadeiro Faria Lima, 1200');
  const [neighborhood, setNeighborhood] = useState(initialLead?.neighborhood || 'Cocaia');
  const [city, setCity] = useState(initialLead?.city || 'Guarulhos');
  const [tagline, setTagline] = useState('');
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [ctaText, setCtaText] = useState('Chamar no WhatsApp');
  const [services, setServices] = useState<WebsiteDemoItem[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [workingHours, setWorkingHours] = useState('');
  const [heroImage, setHeroImage] = useState('');

  // Helper to detect category archetype
  const detectArchetype = (category = ''): 'mecanica' | 'alimentacao' | 'construcao' | 'pet' | 'geral' => {
    const cat = category.toLowerCase();
    if (cat.includes('mecanic') || cat.includes('auto') || cat.includes('carro') || cat.includes('moto') || cat.includes('peca')) return 'mecanica';
    if (cat.includes('padaria') || cat.includes('pao') || cat.includes('mercado') || cat.includes('mercearia') || cat.includes('restaurante') || cat.includes('lanche')) return 'alimentacao';
    if (cat.includes('construc') || cat.includes('material') || cat.includes('ferrag') || cat.includes('tinta') || cat.includes('deposito')) return 'construcao';
    if (cat.includes('pet') || cat.includes('veterin') || cat.includes('racao') || cat.includes('animal')) return 'pet';
    return 'geral';
  };

  // Populate config when selected lead changes
  useEffect(() => {
    if (!selectedLead) return;

    const archKey = detectArchetype(selectedLead.category);
    const arch = ARCHETYPES_DATA[archKey] || ARCHETYPES_DATA.geral;

    setBusinessName(selectedLead.businessName);
    setOwnerName(selectedLead.ownerName);
    setPhone(selectedLead.whatsapp || selectedLead.phone);
    setAddress(selectedLead.address || 'Rua Principal do Bairro, 100');
    setNeighborhood(selectedLead.neighborhood || 'Centro');
    setCity(selectedLead.city || 'São Paulo');
    setThemeColor(arch.themeColor);
    setTagline(arch.tagline);
    setHeadline(arch.headline);
    setSubheadline(arch.subheadline);
    setCtaText(arch.ctaButtonText);
    setServices(arch.services);
    setHighlights(arch.highlights);
    setWorkingHours(arch.workingHours);
    setHeroImage(arch.heroImage);
  }, [selectedLead]);

  const handleSelectLeadChange = (leadId: string) => {
    const l = leads.find(item => item.id === leadId);
    if (l) {
      setSelectedLead(l);
    }
  };

  // Color theme mapper
  const getThemeClasses = () => {
    switch (themeColor) {
      case 'blue':
        return {
          primary: 'bg-blue-600 hover:bg-blue-700 text-white',
          secondary: 'bg-blue-50 text-blue-800 border-blue-200',
          accent: 'text-blue-600',
          border: 'border-blue-500',
          gradient: 'from-blue-900 to-slate-900',
          badge: 'bg-blue-100 text-blue-800',
          headerBg: 'bg-blue-950',
          btnLight: 'bg-blue-500 hover:bg-blue-600 text-white'
        };
      case 'amber':
        return {
          primary: 'bg-amber-600 hover:bg-amber-700 text-white',
          secondary: 'bg-amber-50 text-amber-900 border-amber-200',
          accent: 'text-amber-600',
          border: 'border-amber-500',
          gradient: 'from-amber-950 to-slate-900',
          badge: 'bg-amber-100 text-amber-800',
          headerBg: 'bg-amber-950',
          btnLight: 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black'
        };
      case 'purple':
        return {
          primary: 'bg-purple-600 hover:bg-purple-700 text-white',
          secondary: 'bg-purple-50 text-purple-800 border-purple-200',
          accent: 'text-purple-600',
          border: 'border-purple-500',
          gradient: 'from-purple-950 to-slate-900',
          badge: 'bg-purple-100 text-purple-800',
          headerBg: 'bg-purple-950',
          btnLight: 'bg-purple-500 hover:bg-purple-600 text-white'
        };
      case 'rose':
        return {
          primary: 'bg-rose-600 hover:bg-rose-700 text-white',
          secondary: 'bg-rose-50 text-rose-800 border-rose-200',
          accent: 'text-rose-600',
          border: 'border-rose-500',
          gradient: 'from-rose-950 to-slate-900',
          badge: 'bg-rose-100 text-rose-800',
          headerBg: 'bg-rose-950',
          btnLight: 'bg-rose-500 hover:bg-rose-600 text-white'
        };
      case 'slate':
        return {
          primary: 'bg-slate-900 hover:bg-slate-800 text-white',
          secondary: 'bg-slate-100 text-slate-800 border-slate-200',
          accent: 'text-slate-900',
          border: 'border-slate-800',
          gradient: 'from-slate-950 to-slate-900',
          badge: 'bg-slate-200 text-slate-900',
          headerBg: 'bg-slate-950',
          btnLight: 'bg-slate-800 hover:bg-slate-700 text-white'
        };
      case 'emerald':
      default:
        return {
          primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          secondary: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          accent: 'text-emerald-600',
          border: 'border-emerald-500',
          gradient: 'from-emerald-950 to-slate-900',
          badge: 'bg-emerald-100 text-emerald-800',
          headerBg: 'bg-emerald-950',
          btnLight: 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black'
        };
    }
  };

  const theme = getThemeClasses();

  // Sales Pitch script for WhatsApp
  const cleanPhone = phone.replace(/\D/g, '');
  const salesPitchText = `Fala ${ownerName || 'amigo'}, tudo bem? Aqui é o desenvolvedor do App-CIC de controle de estoque que liberei de graça pro seu balcão.\n\nAlém do sistema gratuito, eu montei uma prévia exclusiva de um Site Profissional para a *${businessName}*, com os serviços de vocês e botão de pedidos direto pro seu WhatsApp!\n\nFiz um protótipo interativo para você ver como sua empresa vai ficar com cara de gigante na internet.\n\nSe quiser colocar no ar no seu próprio domínio .com.br esta semana, consigo fechar por apenas *R$ 1.200* (ou 2x de R$ 600 sem juros). O que achou da ideia?`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(salesPitchText);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  const handleOpenWhatsAppPitch = () => {
    const encoded = encodeURIComponent(salesPitchText);
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyDemoLink = () => {
    // Current URL with query params
    const shareableUrl = `${window.location.origin}?demo=${encodeURIComponent(businessName)}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopiedDemoLink(true);
    setTimeout(() => setCopiedDemoLink(false), 2000);
  };

  // Export standalone HTML file
  const handleDownloadStandaloneHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${businessName} — ${tagline}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased">
  <header class="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800 shadow-md">
    <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
        <span class="font-black text-base tracking-tight">${businessName}</span>
      </div>
      <a href="https://api.whatsapp.com/send?phone=${cleanPhone}&text=Ol%C3%A1%20vim%20pelo%20site%20da%20${encodeURIComponent(businessName)}" target="_blank" class="px-3.5 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow hover:bg-emerald-400">
        WhatsApp
      </a>
    </div>
  </header>

  <section class="relative bg-slate-900 text-white py-16 px-4 overflow-hidden">
    <div class="max-w-4xl mx-auto text-center relative z-10">
      <span class="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold mb-4 border border-emerald-500/30">${tagline}</span>
      <h1 class="text-3xl sm:text-5xl font-black mb-4 leading-tight">${headline}</h1>
      <p class="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8">${subheadline}</p>
      <a href="https://api.whatsapp.com/send?phone=${cleanPhone}&text=Ol%C3%A1%20vim%20pelo%20site%20da%20${encodeURIComponent(businessName)}" target="_blank" class="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-transform hover:scale-105">
        ${ctaText}
      </a>
    </div>
  </section>

  <section class="max-w-5xl mx-auto py-12 px-4">
    <h2 class="text-2xl font-black text-center mb-8">Nossos Principais Serviços &amp; Produtos</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${services.map(s => `
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-bold text-base text-slate-900">${s.title}</h3>
              ${s.badge ? `<span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">${s.badge}</span>` : ''}
            </div>
            <p class="text-slate-600 text-xs mt-1 leading-relaxed">${s.desc}</p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="font-bold text-emerald-700 text-xs">${s.priceText || 'Consulte'}</span>
            <a href="https://api.whatsapp.com/send?phone=${cleanPhone}&text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20${encodeURIComponent(s.title)}" target="_blank" class="text-xs text-slate-900 font-bold hover:underline">
              Pedir no WhatsApp &rarr;
            </a>
          </div>
        </div>
      `).join('')}
    </div>
  </section>

  <footer class="bg-slate-900 text-slate-400 py-8 px-4 text-center text-xs border-t border-slate-800">
    <p class="font-bold text-white mb-1">${businessName} • ${city} - ${neighborhood}</p>
    <p>${address}</p>
    <p class="mt-2 text-slate-500">Horário: ${workingHours}</p>
  </footer>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `site-${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-800/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-3 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Máquina de Fechamento de Vendas • Ticket Médio R$ 1.200 a R$ 2.500</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Gerador Instantâneo de Prévias de Sites para Comerciantes
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed max-w-3xl">
            Apresentar um site já pronto com o <strong>nome, foto e serviços do comércio</strong> é a técnica mais poderosa do mercado. 
            O dono do negócio vê o site funcionando no celular dele, encanta-se e fecha o desenvolvimento no Pix na hora.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={handleOpenWhatsAppPitch}
              className="min-h-[44px] px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Disparar Prévia no WhatsApp do Dono</span>
            </button>

            <button
              onClick={handleCopyPitch}
              className="min-h-[44px] px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              {copiedPitch ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPitch ? 'Script Copiado!' : 'Copiar Script de Abordagem'}</span>
            </button>

            <button
              onClick={handleDownloadStandaloneHtml}
              className="min-h-[44px] px-4 py-2.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 font-bold text-xs rounded-xl border border-indigo-500/30 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Arquivo HTML Pronto (.html)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Controls on Left, Live Device Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Quick Customizer & Lead Selector */}
        <div className="lg:col-span-4 space-y-4">
          {/* Lead Selector Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                1. Selecionar Comércio Prospectado
              </span>
              <button 
                onClick={onGoToSpreadsheet}
                className="text-[11px] text-emerald-600 font-bold hover:underline"
              >
                Ver Planilha
              </button>
            </div>

            <select
              value={selectedLead?.id || ''}
              onChange={(e) => handleSelectLeadChange(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 text-slate-800"
            >
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.businessName} — {lead.category} ({lead.neighborhood})
                </option>
              ))}
            </select>

            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-indigo-600" />
                <span>{selectedLead?.businessName || 'Comércio Personalizado'}</span>
              </div>
              <p className="text-[11px] text-indigo-800">
                Responsável: <strong>{ownerName}</strong> • WhatsApp: <strong>{phone}</strong>
              </p>
              <p className="text-[11px] text-slate-500">
                Status Atual: <span className="text-amber-700 font-bold">{selectedLead?.websiteStatus === 'none' ? '❌ Sem site ativo' : '⚡ Precisa de modernização'}</span>
              </p>
            </div>
          </div>

          {/* Style & Palette Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              2. Paleta de Cores do Site
            </span>

            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'blue', label: 'Azul Oficina', color: 'bg-blue-600' },
                { key: 'emerald', label: 'Verde Mercado', color: 'bg-emerald-600' },
                { key: 'amber', label: 'Dourado / Café', color: 'bg-amber-600' },
                { key: 'purple', label: 'Roxo Pet/Modern', color: 'bg-purple-600' },
                { key: 'rose', label: 'Rubi Vibrante', color: 'bg-rose-600' },
                { key: 'slate', label: 'Grafite Premium', color: 'bg-slate-900' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setThemeColor(item.key as any)}
                  className={`min-h-[44px] p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                    themeColor === item.key 
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40 text-slate-900' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${item.color}`} />
                  <span className="text-[11px] truncate">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Content Editing */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-700 block">Personalização Rápida dos Textos:</span>

              <div>
                <label className="block text-slate-500 text-[11px] mb-1">Título de Impacto (Headline):</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[11px] mb-1">Texto do Botão Principal (CTA):</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Sales Pitch Box & Copy Weapon */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Script de Abordagem Pronto
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300 font-mono">
                R$ 1.200
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono text-[11px] bg-black/40 p-3 rounded-xl border border-white/5 whitespace-pre-wrap">
              {salesPitchText}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCopyPitch}
                className="min-h-[44px] py-2 px-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-950 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-700"
              >
                {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitch ? 'Copiado!' : 'Copiar Script'}</span>
              </button>

              <button
                onClick={handleOpenWhatsAppPitch}
                className="min-h-[44px] py-2 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar no WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Device Preview */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Top Bar with Device Viewport Toggle & Share Actions */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
                <button
                  onClick={() => setDeviceView('mobile')}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    deviceView === 'mobile'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Visão Celular (Mobile)</span>
                </button>

                <button
                  onClick={() => setDeviceView('desktop')}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    deviceView === 'desktop'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Monitor className="w-4 h-4 text-indigo-600" />
                  <span>Visão Computador (Desktop)</span>
                </button>
              </div>

              <span className="hidden sm:inline-flex text-[11px] text-slate-400 font-medium">
                • Prévia Interativa em Tempo Real
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyDemoLink}
                className="min-h-[38px] px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
              >
                {copiedDemoLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedDemoLink ? 'Link Copiado!' : 'Copiar Link'}</span>
              </button>

              <button
                onClick={handleDownloadStandaloneHtml}
                className="min-h-[38px] px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar HTML</span>
              </button>
            </div>
          </div>

          {/* Device Frame Viewport Container */}
          <div className="flex justify-center bg-slate-200/60 p-4 sm:p-6 rounded-2xl border border-slate-300 min-h-[600px] overflow-hidden">
            
            {/* Conditional Mobile Frame vs Desktop Frame */}
            <div 
              className={`transition-all duration-300 bg-white shadow-2xl overflow-hidden flex flex-col ${
                deviceView === 'mobile'
                  ? 'w-full max-w-[390px] rounded-[40px] border-[8px] border-slate-900 ring-1 ring-slate-800'
                  : 'w-full max-w-4xl rounded-2xl border border-slate-300'
              }`}
            >
              {/* Mobile Device Bezel Speaker Bar */}
              {deviceView === 'mobile' && (
                <div className="bg-slate-900 text-slate-400 py-1.5 px-6 flex items-center justify-between text-[10px] shrink-0 font-medium">
                  <span>9:41</span>
                  <div className="w-16 h-4 bg-black rounded-full" />
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <span className="w-4 h-2 rounded-xs border border-slate-400 inline-block bg-slate-400" />
                  </div>
                </div>
              )}

              {/* Top Browser Bar (Desktop only) */}
              {deviceView === 'desktop' && (
                <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                  </div>
                  <div className="flex-1 max-w-md bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs text-slate-600 font-mono flex items-center gap-2">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span className="truncate">https://www.{businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br</span>
                  </div>
                </div>
              )}

              {/* The Actual Mockup Landing Page Website */}
              <div className="flex-1 overflow-y-auto max-h-[750px] scroll-smooth">
                
                {/* Website Header */}
                <header className="sticky top-0 z-30 bg-slate-950 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-black text-xs sm:text-sm tracking-tight truncate max-w-[190px]">
                      {businessName}
                    </span>
                  </div>

                  <a
                    href={`https://api.whatsapp.com/send?phone=${cleanPhone}&text=Ol%C3%A1%20vim%20pelo%20site%20da%20${encodeURIComponent(businessName)}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] shadow-xs transition-transform active:scale-95 flex items-center gap-1 ${theme.btnLight}`}
                  >
                    <Phone className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </header>

                {/* Hero Section */}
                <section className="relative text-white py-12 px-5 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
                  {/* Background cover image with overlay */}
                  {heroImage && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-25"
                      style={{ backgroundImage: `url(${heroImage})` }}
                    />
                  )}
                  <div className="relative z-10 space-y-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${theme.badge}`}>
                      {tagline}
                    </span>

                    <h2 className="text-xl sm:text-3xl font-black leading-tight text-white">
                      {headline}
                    </h2>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                      {subheadline}
                    </p>

                    <div className="pt-2">
                      <a
                        href={`https://api.whatsapp.com/send?phone=${cleanPhone}&text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20um%20or%C3%A7amento.`}
                        target="_blank"
                        rel="noreferrer"
                        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black text-xs sm:text-sm shadow-xl transition-all ${theme.btnLight}`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{ctaText}</span>
                      </a>
                    </div>

                    {/* Trust badges */}
                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10 text-[10px] text-slate-300">
                      {highlights.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Services / Catalog Section */}
                <section className="p-5 bg-slate-50 space-y-4">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Catálogo &amp; Atendimento</span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Principais Serviços &amp; Produtos
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((srv, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-bold text-xs text-slate-900">{srv.title}</h4>
                            {srv.badge && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${theme.badge}`}>
                                {srv.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            {srv.desc}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900">{srv.priceText}</span>
                          <a
                            href={`https://api.whatsapp.com/send?phone=${cleanPhone}&text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20item:%20${encodeURIComponent(srv.title)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                          >
                            <span>Pedir no WhatsApp</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Customer Reviews Section */}
                <section className="p-5 bg-white space-y-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avaliações do Bairro</span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[10px] font-bold text-slate-700 ml-1">5.0 (48 avaliações)</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1.5">
                    <p className="italic text-[11px]">
                      "Excelente atendimento! Fui muito bem recebido, resolveram rápido e o preço foi honesto. Recomendo para todo mundo da região."
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-slate-600">Marcos S. — Cliente Verificado</span>
                      <span>Google Reviews</span>
                    </div>
                  </div>
                </section>

                {/* Location & Hours Section */}
                <section className="p-5 bg-slate-900 text-white space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-xs text-white">{businessName}</h4>
                      <p className="text-[11px] text-slate-400">{address} — {neighborhood}, {city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{workingHours}</span>
                  </div>

                  <div className="pt-2">
                    <a
                      href={`https://api.whatsapp.com/send?phone=${cleanPhone}&text=Ol%C3%A1%20${encodeURIComponent(businessName)},%20qual%20o%20endere%C3%A7o%20exato%20de%20voc%C3%AAs?`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>Traçar Rota no Google Maps / WhatsApp</span>
                    </a>
                  </div>
                </section>

                {/* Mockup Footer */}
                <footer className="p-4 bg-slate-950 text-slate-500 text-center text-[10px] space-y-1">
                  <p>© {new Date().getFullYear()} {businessName}. Todos os direitos reservados.</p>
                  <p className="text-slate-600">Site desenvolvido sob medida com catálogo WhatsApp.</p>
                </footer>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
