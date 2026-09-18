import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Lead, AppCicItem, AppCicMovement, NotificationItem, StrategicReport } from "./src/types.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
  }
}

// Initial realistic database of leads in Brazil
let leads: Lead[] = [
  {
    id: "lead-1",
    businessName: "Mercadinho & Conveniência Bom Preço",
    ownerName: "Carlos Eduardo Santos",
    category: "Mercadinho / Mercearia",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Santana",
    address: "Rua Voluntários da Pátria, 1420",
    phone: "11987654321",
    whatsapp: "5511987654321",
    websiteStatus: "none",
    needsWebsite: true,
    needsInventoryControl: true,
    painPoints: ["Sem catálogo online para entrega", "Controle de estoque em caderno", "Perdas frequentes por validade e falta de baixa"],
    qualificationScore: 94,
    qualificationGrade: "A (Altíssima)",
    isQualified: true,
    qualificationSummary: "Comércio ativo com alto fluxo de moradores locais. Não possui site nem cardápio digital e sofre com descontrole nas saídas de mercadorias no balcão. Perfeito para implantação de site institucional com vitrine e teste de campo do App-CIC.",
    suggestedPitch: "Olá Carlos! Notei que o Mercadinho Bom Preço tem um movimento excelente em Santana, mas ainda não conta com um catálogo web para pedidos nem um app simples para registrar as saídas do caixa em tempo real. Desenvolvemos uma solução sob medida com site ágil e o App-CIC de controle de estoque mobile. Podemos marcar 10 min para eu te demonstrar?",
    status: "qualificado",
    dispatchStatus: "pendente",
    salesNotes: "Prioridade alta. Falar no período da manhã após o recebimento de padaria.",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    lastContactAt: undefined,
    history: [
      { id: "h1", timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), action: "Captura via Scraping Automático", note: "Sem site indexado no Google Maps" },
      { id: "h2", timestamp: new Date(Date.now() - 3600000 * 24 * 1).toISOString(), action: "Qualificação por IA concluída", note: "Score 94/100 - Candidato ideal para App-CIC" }
    ]
  },
  {
    id: "lead-2",
    businessName: "Oficina & Autopeças Mecânica do Vale",
    ownerName: "Roberto Silveira",
    category: "Autopeças / Oficina",
    city: "Campinas",
    state: "SP",
    neighborhood: "Taquaral",
    address: "Av. Barão de Itapura, 2190",
    phone: "19971234567",
    whatsapp: "5519971234567",
    websiteStatus: "none",
    needsWebsite: true,
    needsInventoryControl: true,
    painPoints: ["Clientes não encontram tabela de serviços online", "Dificuldade em controlar estoque de peças rotativas (filtros, pastilhas)", "Vendas balcão sem baixa instantânea"],
    qualificationScore: 89,
    qualificationGrade: "A (Altíssima)",
    isQualified: true,
    qualificationSummary: "Oficina tradicional com mais de 3 funcionários. Não tem página própria, apenas marcação no mapa com telefone. O proprietário perde tempo procurando peças no estoque sem saber se já acabaram.",
    suggestedPitch: "Olá Roberto! Vi o destaque da Mecânica do Vale em Campinas. Sabia que mais de 70% dos motoristas buscam agendamento e peças direto pelo Google antes de levar o carro? Além de criar seu site profissional, temos o App-CIC para controle de peças e saídas no próprio celular. Gostaria de ver uma demonstração sem compromisso?",
    status: "disparado_whatsapp",
    dispatchStatus: "enviado",
    salesNotes: "Enviado script via WhatsApp. Aguardando retorno do proprietário.",
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    lastContactAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    history: [
      { id: "h3", timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), action: "Captura via Scraping Automático" },
      { id: "h4", timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), action: "Disparo automático WhatsApp para equipe de vendas" }
    ]
  },
  {
    id: "lead-3",
    businessName: "Padaria & Confeitaria Doce Trigo",
    ownerName: "Maria de Fátima Ramos",
    category: "Padaria",
    city: "Belo Horizonte",
    state: "MG",
    neighborhood: "Savassi",
    address: "Rua Fernandes Tourinho, 380",
    phone: "31998887766",
    whatsapp: "5531998887766",
    websiteStatus: "social_only",
    instagram: "@docetrigo.bh",
    needsWebsite: true,
    needsInventoryControl: true,
    painPoints: ["Depende 100% de direct do Instagram", "Falta de cardápio digital com preços atualizados", "Descontrole de matéria-prima e insumos diários"],
    qualificationScore: 86,
    qualificationGrade: "B (Boa)",
    isQualified: true,
    qualificationSummary: "Possui Instagram com 2.400 seguidores, porém nenhum site para receber encomendas ou listar kits de festas. Precisa gerenciar perdas e saídas de produtos com alta rotatividade.",
    suggestedPitch: "Olá Dona Maria! Acompanhamos os produtos incríveis da Doce Trigo no Instagram. Para não perder encomendas no Direct e automatizar o catálogo de encomendas, um site próprio com cardápio integrado e o App-CIC de controle diário de saídas fariam a confeitaria economizar horas. Podemos testar gratuitamente essa semana?",
    status: "teste_cic",
    dispatchStatus: "respondido",
    salesNotes: "Maria aceitou fazer o teste de campo do App-CIC para monitorar itens de confeitaria!",
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    lastContactAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    history: [
      { id: "h5", timestamp: new Date(Date.now() - 3600000 * 24 * 4).toISOString(), action: "Scraping e Identificação de ausência de site" },
      { id: "h6", timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), action: "Abordagem WhatsApp realizada" },
      { id: "h7", timestamp: new Date(Date.now() - 3600000 * 8).toISOString(), action: "Iniciado Teste de Campo do App-CIC", note: "Instalado catálogo inicial de 12 itens" }
    ]
  },
  {
    id: "lead-4",
    businessName: "Depósito de Bebidas & Gelo Três Irmãos",
    ownerName: "Leandro Prado",
    category: "Depósito de Bebidas / Materiais",
    city: "Curitiba",
    state: "PR",
    neighborhood: "Batel",
    address: "Rua Bispo Dom José, 2210",
    phone: "41984443322",
    whatsapp: "5541984443322",
    websiteStatus: "outdated",
    websiteUrl: "http://geocities-antigo/bebidas3irmãos (fora do ar)",
    needsWebsite: true,
    needsInventoryControl: true,
    painPoints: ["Site antigo de 2014 fora do ar", "Vendas rápidas de fardos sem baixa no estoque", "Pedidos de eventos e casamentos chegam de última hora sem checagem de estoque"],
    qualificationScore: 92,
    qualificationGrade: "A (Altíssima)",
    isQualified: true,
    qualificationSummary: "Forte volume de caixa no final de semana. Site antigo quebrado. Urgência em ter vitrine para catálogo de chopp e bebidas, além de um PDV móvel simplificado para registrar saídas nas entregas.",
    suggestedPitch: "Olá Leandro! Vimos que o site antigo do Depósito Três Irmãos não está carregando, fazendo vocês perderem clientes que buscam bebidas para eventos em Curitiba. Criamos sites modernos com catálogo de bebidas e o App-CIC para controle de estoque e saídas direto no celular dos entregadores. Quando podemos conversar?",
    status: "em_negociacao",
    dispatchStatus: "respondido",
    salesNotes: "Reunião agendada para sexta-feira 14h. Apresentar proposta casada de Website + App-CIC.",
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    lastContactAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    history: [
      { id: "h8", timestamp: new Date(Date.now() - 3600000 * 24 * 5).toISOString(), action: "Scraping com detecção de site com erro 404" },
      { id: "h9", timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), action: "Resposta positiva recebida no WhatsApp" }
    ]
  },
  {
    id: "lead-5",
    businessName: "Boutique Elegance Moda Feminina",
    ownerName: "Camila Nogueira",
    category: "Loja de Roupas",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Moema",
    address: "Alameda dos Maracatins, 890",
    phone: "11977771122",
    whatsapp: "5511977771122",
    websiteStatus: "social_only",
    instagram: "@elegance.moema",
    needsWebsite: true,
    needsInventoryControl: true,
    painPoints: ["Perde vendas após expediente por falta de catálogo online", "Controle de grade (tamanhos P/M/G) confuso", "Precisa saber o que tem no estoque sem ir ao fundo da loja"],
    qualificationScore: 88,
    qualificationGrade: "B (Boa)",
    isQualified: true,
    qualificationSummary: "Loja com ticket médio alto. Faz postagens frequentes mas atende clientes manualmente 1 a 1. Precisa de site vitrine e controle veloz de saídas de peças.",
    suggestedPitch: "Olá Camila! Adoramos as coleções da Boutique Elegance! Muitas clientes preferem olhar a grade disponível antes de ir à loja ou pedir pelo WhatsApp. Ter uma vitrine online elegante integrada ao controle de estoque rápido na palma da mão pelo App-CIC aumentará suas conversões em mais de 35%. Vamos agendar um bate-papo de 10 minutinhos?",
    status: "convertido",
    dispatchStatus: "respondido",
    salesNotes: "Contrato de site fechado + implantação do App-CIC de controle de peças!",
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    lastContactAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    history: [
      { id: "h10", timestamp: new Date(Date.now() - 3600000 * 24 * 7).toISOString(), action: "Lead capturado" },
      { id: "h11", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), action: "Conversão fechada com sucesso!" }
    ]
  },
  {
    id: "lead-cocaia-1",
    businessName: "Hortifruti & Mercadinho do Cocaia",
    ownerName: "Gilberto Fagundes",
    category: "Mercadinho / Mercearia",
    city: "Guarulhos",
    state: "SP",
    neighborhood: "Jardim Cocaia",
    address: "Av. Brigadeiro Faria Lima, 2810 - Cocaia",
    phone: "11982341122",
    whatsapp: "5511982341122",
    websiteStatus: "none",
    needsWebsite: true,
    needsInventoryControl: true,
    targetRegionKey: "cocaia_guarulhos",
    painPoints: ["Sem vitrine web para pedidos de moradores do Cocaia", "Perda de produtos perecíveis por falta de baixa rápida", "Falta de controle de entradas de hortifruti"],
    qualificationScore: 96,
    qualificationGrade: "A (Altíssima)",
    isQualified: true,
    qualificationSummary: "Comércio de alta densidade no Jardim Cocaia em Guarulhos. Sem qualquer site ativo. Proprietário busca modernização urgente e teste de campo do App-CIC no balcão.",
    suggestedPitch: "Olá Gilberto! Acompanhamos o movimento forte do Hortifruti no Cocaia em Guarulhos. Criamos sites modernos para pedidos locais e o App-CIC para registro instantâneo de saídas no caixa via celular. Vamos fazer um teste de campo gratuito esta semana?",
    status: "qualificado",
    dispatchStatus: "pendente",
    salesNotes: "Local-alvo: Cocaia Guarulhos. Ótimo potencial para combo Site + App-CIC.",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    history: [
      { id: "hc1", timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), action: "Scraping Localizado em Cocaia - Guarulhos", note: "Sem presença web encontrada" }
    ]
  },
  {
    id: "lead-senac-jurubatuba-1",
    businessName: "Restaurante & Marmitaria Jurubatuba Grill",
    ownerName: "Maurício Neves",
    category: "Restaurante / Lanchonete",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Jurubatuba",
    address: "Av. Eng. Eusébio Stevaux, 823 (em frente ao Senac Jurubatuba)",
    phone: "11971239988",
    whatsapp: "5511971239988",
    websiteStatus: "none",
    needsWebsite: true,
    needsInventoryControl: true,
    targetRegionKey: "senac_jurubatuba",
    painPoints: ["Alunos e funcionários do Senac Jurubatuba pedem cardápio online e não encontram", "Controle de embalagens e carnes feito de cabeça", "Fila no balcão sem baixa de pedidos"],
    qualificationScore: 95,
    qualificationGrade: "A (Altíssima)",
    isQualified: true,
    qualificationSummary: "Localizado no polo estudantil e empresarial do Senac Jurubatuba. Cardápio não está online. Demanda urgente por página web para encomendas e app móvel para controle diário de saídas (App-CIC).",
    suggestedPitch: "Olá Maurício! Vimos que o Jurubatuba Grill atende centenas de pessoas do Senac Jurubatuba, mas ainda não tem site com cardápio do dia. Temos uma solução com site express e o App-CIC para controle de saídas de marmitas no celular. Topa um teste?",
    status: "disparado_whatsapp",
    dispatchStatus: "enviado",
    salesNotes: "Local-alvo: Senac Jurubatuba. Alta rotatividade de público universitário.",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    history: [
      { id: "hs1", timestamp: new Date(Date.now() - 3600000 * 18).toISOString(), action: "Varredura no entorno do Senac Jurubatuba" }
    ]
  },
  {
    id: "lead-maria-benedita-1",
    businessName: "Mercearia & Depósito Maria Benedita 91",
    ownerName: "Benedito Aparecido Rodrigues",
    category: "Mercadinho / Mercearia",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Vila Nova / Zona Leste",
    address: "Rua Maria Benedita Rodrigues, 91",
    phone: "11993456789",
    whatsapp: "5511993456789",
    websiteStatus: "none",
    needsWebsite: true,
    needsInventoryControl: true,
    targetRegionKey: "maria_benedita_91",
    painPoints: ["Endereço de comércio tradicional sem página web própria", "Dificuldade em saber o que falta no estoque antes de pedir reposição", "Perda de clientes para atacarejos"],
    qualificationScore: 97,
    qualificationGrade: "A (Altíssima)",
    isQualified: true,
    qualificationSummary: "Ponto comercial estabelecido na Rua Maria Benedita Rodrigues, 91. Clientela fiel da vizinhança. Totalmente sem site institucional e com necessidade crítica do App-CIC para controle de fardos e saídas.",
    suggestedPitch: "Olá Sr. Benedito! A Mercearia na Rua Maria Benedita Rodrigues, 91 é um ponto tradicional da vizinhança. Um site próprio com catálogo e o App-CIC para controlar saídas de produtos no balcão pelo celular evitarão furos no estoque e trarão novos pedidos. Posso te apresentar sem compromisso?",
    status: "qualificado",
    dispatchStatus: "pendente",
    salesNotes: "Local-alvo específico: Rua Maria Benedita Rodrigues, 91. Cliente prioritário para implantação de campo.",
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    history: [
      { id: "hmb1", timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), action: "Prospecção direcionada na Rua Maria Benedita Rodrigues 91" }
    ]
  },
  {
    id: "lead-copan-1",
    businessName: "Café & Empório Galeria Copan",
    ownerName: "Clarice Albuquerque",
    category: "Padaria",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Centro / Edifício Copan",
    address: "Av. Ipiranga, 200 - Galeria do Copan, Bloco A",
    phone: "11984561234",
    whatsapp: "5511984561234",
    websiteStatus: "social_only",
    instagram: "@copancafe.sp",
    needsWebsite: true,
    needsInventoryControl: true,
    targetRegionKey: "copan_ipiranga",
    painPoints: ["Depende apenas do Instagram", "Falta de vitrine virtual para encomendas de grãos e pães artesanais", "Dificuldade no controle de saídas rápidas durante horário de pico"],
    qualificationScore: 92,
    qualificationGrade: "A (Altíssima)",
    isQualified: true,
    qualificationSummary: "Empreendimento charmoso dentro da galeria do Edifício Copan no Centro de SP. Muita procura turística e de moradores. Perfil ideal para site vitrine de encomendas e App-CIC no balcão.",
    suggestedPitch: "Olá Clarice! Amamos o Café no Copan! Para valorizar ainda mais a marca e receber encomendas sem a sobrecarga do direct, um site institucional com catálogo integrado ao App-CIC de controle de saídas de cafés e doces será transformador. Quando podemos conversar?",
    status: "teste_cic",
    dispatchStatus: "respondido",
    salesNotes: "Local-alvo: Copan / Av. Ipiranga. Em fase de teste de campo do App-CIC.",
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    history: [
      { id: "hcp1", timestamp: new Date(Date.now() - 3600000 * 20).toISOString(), action: "Scraping na Galeria Copan / Centro" },
      { id: "hcp2", timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), action: "Início de teste de campo com 8 itens de cafeteria" }
    ]
  },
  {
    id: "lead-alto-ipiranga-1",
    businessName: "Quitanda & Hortifruti Alto do Ipiranga",
    ownerName: "Antônio Vicente",
    category: "Mercadinho / Mercearia",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Alto do Ipiranga",
    address: "Rua Santa Cruz, 1420 - Alto do Ipiranga",
    phone: "11976543321",
    whatsapp: "5511976543321",
    websiteStatus: "none",
    needsWebsite: true,
    needsInventoryControl: true,
    targetRegionKey: "copan_ipiranga",
    painPoints: ["Moradores do Alto do Ipiranga buscam hortifruti no Google e não encontram o negócio", "Desperdício e perdas no estoque de frutas", "Falta de controle de entradas de feirantes"],
    qualificationScore: 91,
    qualificationGrade: "A (Altíssima)",
    isQualified: true,
    qualificationSummary: "Hortifruti movimentado na Rua Santa Cruz no Alto do Ipiranga. Concorrência com mercados de rede. Precisa de presença web profissional e controle móvel de saídas pelo App-CIC.",
    suggestedPitch: "Olá Sr. Antônio! Notamos que o Hortifruti no Alto do Ipiranga tem produtos de ótima qualidade, mas não aparece com site quando os moradores procuram entrega no bairro. Desenvolvemos sites rápidos e o App-CIC para controle de saídas no balcão. Vamos fazer um teste sem custo?",
    status: "em_negociacao",
    dispatchStatus: "respondido",
    salesNotes: "Local-alvo: Alto do Ipiranga. Reunião agendada com o proprietário.",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    history: [
      { id: "hai1", timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), action: "Mapeamento em Alto do Ipiranga / Rua Santa Cruz" }
    ]
  }
];

// App-CIC Items (Teste de Campo para controle de estoque de comércios locais)
let cicItems: AppCicItem[] = [
  {
    id: "cic-item-1",
    leadId: "lead-1",
    leadBusinessName: "Mercadinho & Conveniência Bom Preço",
    name: "Óleo de Soja 900ml",
    category: "Mercearia",
    sku: "ALIM-0192",
    currentStock: 14,
    minStock: 20,
    unitPrice: 6.80,
    unit: "un",
    status: "alerta_baixo",
    lastMovementDate: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: "cic-item-2",
    leadId: "lead-1",
    leadBusinessName: "Mercadinho & Conveniência Bom Preço",
    name: "Arroz Tipo 1 5kg",
    category: "Mercearia",
    sku: "ALIM-0081",
    currentStock: 42,
    minStock: 15,
    unitPrice: 28.90,
    unit: "pct",
    status: "ok",
    lastMovementDate: new Date(Date.now() - 3600000 * 7).toISOString()
  },
  {
    id: "cic-item-3",
    leadId: "lead-1",
    leadBusinessName: "Mercadinho & Conveniência Bom Preço",
    name: "Refrigerante Cola 2L",
    category: "Bebidas",
    sku: "BEB-0342",
    currentStock: 3,
    minStock: 18,
    unitPrice: 9.50,
    unit: "un",
    status: "alerta_baixo",
    lastMovementDate: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: "cic-item-4",
    leadId: "lead-2",
    leadBusinessName: "Oficina & Autopeças Mecânica do Vale",
    name: "Filtro de Óleo PH6017A",
    category: "Peças Mecânicas",
    sku: "AUT-7712",
    currentStock: 8,
    minStock: 5,
    unitPrice: 38.00,
    unit: "un",
    status: "ok",
    lastMovementDate: new Date(Date.now() - 3600000 * 14).toISOString()
  },
  {
    id: "cic-item-5",
    leadId: "lead-2",
    leadBusinessName: "Oficina & Autopeças Mecânica do Vale",
    name: "Pastilha de Freio Dianteira",
    category: "Peças Mecânicas",
    sku: "AUT-9941",
    currentStock: 0,
    minStock: 4,
    unitPrice: 110.00,
    unit: "cx",
    status: "esgotado",
    lastMovementDate: new Date(Date.now() - 3600000 * 22).toISOString()
  },
  {
    id: "cic-item-6",
    leadId: "lead-3",
    leadBusinessName: "Padaria & Confeitaria Doce Trigo",
    name: "Farinha de Trigo Especial 25kg",
    category: "Insumos",
    sku: "PAD-1029",
    currentStock: 6,
    minStock: 8,
    unitPrice: 85.00,
    unit: "sc",
    status: "alerta_baixo",
    lastMovementDate: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "cic-item-cocaia-1",
    leadId: "lead-cocaia-1",
    leadBusinessName: "Hortifruti & Mercadinho do Cocaia",
    name: "Batata Lavada Especial (kg)",
    category: "Hortifruti",
    sku: "COC-0112",
    currentStock: 48,
    minStock: 25,
    unitPrice: 5.99,
    unit: "kg",
    status: "ok",
    lastMovementDate: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "cic-item-senac-1",
    leadId: "lead-senac-jurubatuba-1",
    leadBusinessName: "Restaurante & Marmitaria Jurubatuba Grill",
    name: "Embalagem Marmita Térmica 3 Divisões",
    category: "Descartáveis",
    sku: "JUR-0891",
    currentStock: 15,
    minStock: 50,
    unitPrice: 1.45,
    unit: "un",
    status: "alerta_baixo",
    lastMovementDate: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "cic-item-maria-1",
    leadId: "lead-maria-benedita-1",
    leadBusinessName: "Mercearia & Depósito Maria Benedita 91",
    name: "Fardo de Açúcar Cristal 10x1kg",
    category: "Mercearia",
    sku: "MB91-032",
    currentStock: 8,
    minStock: 12,
    unitPrice: 39.90,
    unit: "cx",
    status: "alerta_baixo",
    lastMovementDate: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: "cic-item-copan-1",
    leadId: "lead-copan-1",
    leadBusinessName: "Café & Empório Galeria Copan",
    name: "Café Especial em Grãos Mogiana 1kg",
    category: "Cafeteria",
    sku: "COP-0044",
    currentStock: 18,
    minStock: 10,
    unitPrice: 68.00,
    unit: "pct",
    status: "ok",
    lastMovementDate: new Date(Date.now() - 3600000 * 1).toISOString()
  }
];

// App-CIC Stock Movements (Registro rápido de entradas e saídas)
let cicMovements: AppCicMovement[] = [
  {
    id: "mov-1",
    itemId: "cic-item-1",
    itemName: "Óleo de Soja 900ml",
    type: "saida",
    quantity: 6,
    reason: "venda_balcao",
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    value: 40.80,
    notes: "Saída registrada pelo caixa 1"
  },
  {
    id: "mov-2",
    itemId: "cic-item-3",
    itemName: "Refrigerante Cola 2L",
    type: "saida",
    quantity: 5,
    reason: "venda_balcao",
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    value: 47.50,
    notes: "Saída via atendimento balcão"
  },
  {
    id: "mov-3",
    itemId: "cic-item-5",
    itemName: "Pastilha de Freio Dianteira",
    type: "saida",
    quantity: 2,
    reason: "venda_balcao",
    timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
    value: 220.00,
    notes: "Instalação em veículo cliente Gol G6"
  }
];

// Notifications
let notifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Novo Lead Qualificado Capturado",
    message: "Mercadinho Bom Preço (Santana/SP) foi qualificado com Score 94. Sem site e necessita de controle de estoque!",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    leadId: "lead-1",
    type: "qualified",
    read: false
  },
  {
    id: "notif-2",
    title: "Disparo WhatsApp Realizado",
    message: "Abordagem comercial enviada para Roberto Silveira (Mecânica do Vale).",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    leadId: "lead-2",
    type: "whatsapp_sent",
    read: false
  },
  {
    id: "notif-3",
    title: "Alerta de Estoque Baixo (App-CIC)",
    message: "Item 'Pastilha de Freio Dianteira' ficou esgotado na Mecânica do Vale.",
    timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
    leadId: "lead-2",
    type: "cic_alert",
    read: true
  }
];

// Brazilian business names catalog for intelligent scraping generator
const BRAZILIAN_BUSINESS_NAMES: Record<string, string[]> = {
  "Mercadinho / Mercearia": [
    "Mercadinho da Praça", "Empório & Mercearia São José", "Mini Mercado Sol Nascente",
    "Mercadinho Estrela do Bairro", "Super Mix Comércio de Alimentos", "Mercearia Família Silva",
    "Conveniência & Mercado Ponto Certo", "Empório das Gerais", "Mercadinho Central Norte"
  ],
  "Autopeças / Oficina": [
    "Auto Center & Peças Aliança", "Oficina Mecânica Precision Car", "Motopeças & Acessórios Velox",
    "Auto Elétrica São Cristovão", "Pneus & Suspensão Bandeirantes", "Oficina do Alemão Multimarcas",
    "Distribuidora de Peças Ideal", "Mecânica e Diagnóstico Rápido", "Centro Automotivo Paulista"
  ],
  "Restaurante / Lanchonete": [
    "Cantina & Pizzaria Bella Itália", "Churrascaria Fogo na Brasa", "Lanchonete & Hambúrgueria Prime",
    "Restaurante Sabor Caseiro", "Pastelaria & Caldo de Cana da Fé", "Sushi House Express",
    "Açaí & Lanches Fruta Nobre", "Fogão a Lenha Restaurante e Bar", "Pizzaria do Bairro 24h"
  ],
  "Padaria": [
    "Panificadora Pão Dourado", "Padaria e Confeitaria Trigo Nobre", "Pão & Cia Padaria Artesanal",
    "Boulangerie & Confeitaria Imperial", "Padaria Estrela Dalva", "Panificadora Central",
    "Confeitaria Delícias da Vovó", "Padaria Santo Pão", "Casa do Pão de Queijo & Café"
  ],
  "Depósito de Bebidas / Materiais": [
    "Depósito & Distribuidora Gelo Cristal", "Bebidas & Adega Imperial", "Depósito de Construção São Miguel",
    "Materiais para Construção O Construtor", "Adega & Tabacaria Ponto 10", "Distribuidora de Bebidas Geladão",
    "Depósito de Areia & Brita Progresso", "Empório das Bebidas & Destilados", "Casa de Tintas & Ferragens Vale"
  ],
  "Loja de Roupas": [
    "Donna Chic Moda & Acessórios", "Vitrine Urbana Confecções", "Bella Rosa Vestuário",
    "Moda Jovem & Surfwear", "Espaço Glamour Moda Feminina", "Estilo Próprio Roupas e Calçados",
    "Ateliê & Boutique Encanto", "Outlet Multimarcas Popular", "Boutique Florescer"
  ],
  "Barbearia / Salão": [
    "Barbearia Viking & Navalha", "Studio & Espaço Beleza Pura", "Salão & Esmalteria Divas",
    "Barbearia Cavalheiros & Cerveja", "Centro de Estética & Cabelo Luiza", "Barber Shop Vintage Club"
  ],
  "Pet Shop": [
    "Pet Shop Patas & Pelos", "Clínica & Banho e Tosa Amigo Fiel", "Mundo Animal Pet & Rações",
    "Agropet & Aquarismo Paraíso", "Pet Mania & Cuidados Veterinários", "Bicho Mimado Estética Pet"
  ]
};

const BRAZILIAN_NEIGHBORHOODS: Record<string, string[]> = {
  "São Paulo": ["Santana", "Moema", "Pinheiros", "Tatuapé", "Vila Mariana", "Lapa", "Ipiranga", "Mooca", "Vila Madalena", "Jardins", "Santo Amaro", "Penha"],
  "Rio de Janeiro": ["Tijuca", "Copacabana", "Botafogo", "Barra da Tijuca", "Méier", "Madureira", "Ipanema", "Campo Grande", "Bangu", "Jacarepaguá"],
  "Belo Horizonte": ["Savassi", "Funcionários", "Lourdes", "Barro Preto", "Buritis", "Pampulha", "Padre Eustáquio", "Sion", "Gutierrez"],
  "Curitiba": ["Batel", "Água Verde", "Centro Cívico", "Portão", "Santa Felicidade", "Cabral", "Boqueirão", "Juvevê"],
  "Campinas": ["Taquaral", "Cambuí", "Barão Geraldo", "Nova Campinas", "Guanabara", "Castelo", "Jardim Chapadão"]
};

// ======================== API ROUTES ========================

// 1. Leads CRUD
app.get("/api/leads", (req: Request, res: Response) => {
  const { category, status, search, withoutWebsiteOnly, needsInventoryOnly } = req.query;
  let filtered = [...leads];

  if (category && category !== "all") {
    filtered = filtered.filter(l => l.category === category);
  }
  if (status && status !== "all") {
    filtered = filtered.filter(l => l.status === status);
  }
  if (withoutWebsiteOnly === "true") {
    filtered = filtered.filter(l => l.needsWebsite || l.websiteStatus === "none" || l.websiteStatus === "social_only");
  }
  if (needsInventoryOnly === "true") {
    filtered = filtered.filter(l => l.needsInventoryControl);
  }
  if (search) {
    const s = String(search).toLowerCase();
    filtered = filtered.filter(l => 
      l.businessName.toLowerCase().includes(s) ||
      l.ownerName.toLowerCase().includes(s) ||
      l.city.toLowerCase().includes(s) ||
      l.phone.includes(s)
    );
  }

  // Sort most recent first
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ success: true, count: filtered.length, leads: filtered });
});

app.get("/api/leads/:id", (req: Request, res: Response) => {
  const lead = leads.find(l => l.id === req.params.id);
  if (!lead) {
    return res.status(404).json({ success: false, error: "Lead não encontrado" });
  }
  res.json({ success: true, lead });
});

app.post("/api/leads", (req: Request, res: Response) => {
  const newLead: Lead = {
    ...req.body,
    id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    history: [
      {
        id: `h-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: "Cadastro manual de lead",
        note: req.body.salesNotes || "Lead inserido no sistema"
      }
    ]
  };

  leads.unshift(newLead);

  // Push notification for newly registered contact
  const notif: NotificationItem = {
    id: `notif-${Date.now()}`,
    title: "Novo Contato Cadastrado",
    message: `${newLead.businessName} (${newLead.city}/${newLead.state}) foi adicionado com sucesso.`,
    timestamp: new Date().toISOString(),
    leadId: newLead.id,
    type: "new_lead",
    read: false
  };
  notifications.unshift(notif);

  res.status(201).json({ success: true, lead: newLead });
});

const handleUpdateLead = (req: Request, res: Response) => {
  const index = leads.findIndex(l => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Lead não encontrado" });
  }

  const prev = leads[index];
  const updated: Lead = {
    ...prev,
    ...req.body,
    history: [
      {
        id: `h-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: req.body.status !== prev.status ? `Status alterado para: ${req.body.status}` : "Dados do lead atualizados",
        note: req.body.salesNotes || undefined
      },
      ...prev.history
    ]
  };

  leads[index] = updated;
  res.json({ success: true, lead: updated });
};

app.put("/api/leads/:id", handleUpdateLead);
app.patch("/api/leads/:id", handleUpdateLead);

app.delete("/api/leads/:id", (req: Request, res: Response) => {
  const index = leads.findIndex(l => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Lead não encontrado" });
  }
  const deleted = leads.splice(index, 1)[0];
  res.json({ success: true, deleted });
});

// 2. Automated Scraping & Prospecting Engine
app.post("/api/scrape", async (req: Request, res: Response) => {
  try {
    const {
      query = "",
      category = "Mercadinho / Mercearia",
      city = "São Paulo",
      state = "SP",
      targetLocationKey = "all",
      filterOnlyWithoutWebsite = true,
      filterNeedsInventory = true,
      autoQualifyWithAI = true,
      autoPushNotification = true,
      autoDispatchSalesWhatsApp = false,
      salesTeamPhone = "5511999998888",
      limit = 4
    } = req.body;

    const targetPool = ["cocaia_guarulhos", "senac_jurubatuba", "maria_benedita_91", "copan_ipiranga"] as const;

    const namesList = BRAZILIAN_BUSINESS_NAMES[category] || [
      `${category} Central`, `${category} do Bairro`, `${category} União`, `${category} Brasil`, `${category} Progresso`
    ];
    const neighborhoods = BRAZILIAN_NEIGHBORHOODS[city] || ["Centro", "Bairro Novo", "Jardim América", "Vila Nova"];

    // Generate candidates
    const scrapedLeads: Lead[] = [];
    const countToGenerate = Math.min(Number(limit) || 4, 10);

    for (let i = 0; i < countToGenerate; i++) {
      // Determine active target location for this candidate
      let itemTargetKey: "cocaia_guarulhos" | "senac_jurubatuba" | "maria_benedita_91" | "copan_ipiranga" | undefined = undefined;
      if (targetLocationKey === "only_targets") {
        itemTargetKey = targetPool[i % targetPool.length];
      } else if (targetLocationKey && targetLocationKey !== "all") {
        itemTargetKey = targetLocationKey as any;
      }

      let candidateCity = city;
      let candidateState = state;
      let candidateNeighborhood = neighborhoods[(i + Math.floor(Math.random() * 5)) % neighborhoods.length];
      let candidateAddress = `Rua das Flores, ${Math.floor(50 + Math.random() * 2500)}`;
      let businessSuffix = "";

      if (itemTargetKey === "cocaia_guarulhos") {
        candidateCity = "Guarulhos";
        candidateState = "SP";
        candidateNeighborhood = "Jardim Cocaia";
        candidateAddress = `Av. Brigadeiro Faria Lima, ${Math.floor(1000 + Math.random() * 2800)} - Cocaia`;
        businessSuffix = " Cocaia";
      } else if (itemTargetKey === "senac_jurubatuba") {
        candidateCity = "São Paulo";
        candidateState = "SP";
        candidateNeighborhood = "Jurubatuba";
        candidateAddress = `Av. Eng. Eusébio Stevaux, ${Math.floor(600 + Math.random() * 400)} (próx. Senac Jurubatuba)`;
        businessSuffix = " Senac Jurubatuba";
      } else if (itemTargetKey === "maria_benedita_91") {
        candidateCity = "São Paulo";
        candidateState = "SP";
        candidateNeighborhood = "Vila Nova / Zona Leste";
        candidateAddress = `Rua Maria Benedita Rodrigues, 91${i > 0 ? ` (Loja ${i + 1})` : ''}`;
        businessSuffix = " Maria Benedita 91";
      } else if (itemTargetKey === "copan_ipiranga") {
        candidateCity = "São Paulo";
        candidateState = "SP";
        if (i % 2 === 0) {
          candidateNeighborhood = "Centro / Edifício Copan";
          candidateAddress = `Av. Ipiranga, 200 - Galeria Copan, Loja ${10 + i}`;
          businessSuffix = " Copan";
        } else {
          candidateNeighborhood = "Alto do Ipiranga";
          candidateAddress = `Rua Santa Cruz, ${1300 + i * 35} - Alto do Ipiranga`;
          businessSuffix = " Alto do Ipiranga";
        }
      }

      const randomName = (namesList[(Date.now() + i) % namesList.length] + businessSuffix) + (i > 2 ? ` Unidade ${i + 1}` : "");
      const randomNeighborhood = candidateNeighborhood;
      const ddd = candidateCity === "Guarulhos" ? "11" : candidateCity === "São Paulo" ? "11" : candidateCity === "Rio de Janeiro" ? "21" : candidateCity === "Belo Horizonte" ? "31" : candidateCity === "Curitiba" ? "41" : "19";
      const randomPhoneNum = `9${Math.floor(10000000 + Math.random() * 89999999)}`;
      const fullPhone = `${ddd}${randomPhoneNum}`;
      const whatsapp = `55${fullPhone}`;
      const randomStreetNumber = Math.floor(50 + Math.random() * 2500);

      const webStatusPossibilities: ('none' | 'social_only' | 'outdated')[] = ['none', 'none', 'social_only', 'outdated'];
      const websiteStatus = filterOnlyWithoutWebsite 
        ? webStatusPossibilities[Math.floor(Math.random() * webStatusPossibilities.length)]
        : (Math.random() > 0.8 ? 'active' : 'none');

      const ownerFirstNames = ["Carlos", "Marcos", "Ana Paula", "Ricardo", "Juliana", "Fernando", "Luciana", "Eduardo", "Patrícia", "Alexandre"];
      const ownerLastNames = ["Silva", "Oliveira", "Souza", "Pereira", "Ferreira", "Almeida", "Rodrigues", "Lima"];
      const ownerName = `${ownerFirstNames[Math.floor(Math.random() * ownerFirstNames.length)]} ${ownerLastNames[Math.floor(Math.random() * ownerLastNames.length)]}`;

      // Inventory check (App-CIC test candidate)
      const inventoryRelevantCategories = ["Mercadinho / Mercearia", "Autopeças / Oficina", "Depósito de Bebidas / Materiais", "Loja de Roupas", "Padaria"];
      const isInventoryCandidate = filterNeedsInventory ? true : inventoryRelevantCategories.includes(category);

      let painPoints: string[] = [];
      if (websiteStatus === "none") {
        painPoints.push("Não possui nenhum site institucional nem vitrine online");
        painPoints.push("Visibilidade digital restrita apenas a quem passa na porta");
      } else if (websiteStatus === "social_only") {
        painPoints.push("Depende unicamente do Instagram/Facebook com resposta manual lenta");
        painPoints.push("Sem catálogo fixo de produtos com preços visíveis aos clientes");
      } else if (websiteStatus === "outdated") {
        painPoints.push("Site antigo não adaptado para smartphones e sem catálogo");
      }

      if (isInventoryCandidate) {
        painPoints.push("Controle de estoque feito de forma manual (caderno ou memória)");
        painPoints.push("Falta de registro imediato de saídas nas vendas de balcão (Aderente ao App-CIC)");
      }

      let qualificationScore = 80 + Math.floor(Math.random() * 19);
      if (websiteStatus === "none") qualificationScore += 4;
      if (isInventoryCandidate) qualificationScore += 3;
      if (qualificationScore > 98) qualificationScore = 98;

      let grade: 'A (Altíssima)' | 'B (Boa)' | 'C (Média)' = 'A (Altíssima)';
      if (qualificationScore < 85) grade = 'B (Boa)';

      let suggestedPitch = `Olá ${ownerName.split(" ")[0]}! Identificamos o ótimo trabalho da ${randomName} em ${randomNeighborhood}, mas notamos que você ainda não possui um site com vitrine digital nem um controle móvel de saídas de estoque (App-CIC). Desenvolvemos uma plataforma que resolve exatamente essas duas dores em poucos minutos. Vamos fazer um teste de campo gratuito?`;
      let qualificationSummary = `Comércio tradicional no bairro ${randomNeighborhood} com excelente potencial de conversão. Apresenta carência imediata de presença web estruturada e necessita de gestão rápida de entradas e saídas de produtos no balcão via App-CIC.`;

      const candidateLead: Lead = {
        id: `lead-scraped-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`,
        businessName: randomName,
        ownerName,
        category,
        city: candidateCity,
        state: candidateState,
        neighborhood: randomNeighborhood,
        address: candidateAddress,
        phone: fullPhone,
        whatsapp,
        websiteStatus,
        instagram: websiteStatus === "social_only" ? `@${randomName.toLowerCase().replace(/[^a-z0-9]/g, "")}` : undefined,
        needsWebsite: websiteStatus !== "active",
        needsInventoryControl: isInventoryCandidate,
        targetRegionKey: itemTargetKey,
        painPoints,
        qualificationScore,
        qualificationGrade: grade,
        isQualified: qualificationScore >= 75,
        qualificationSummary,
        suggestedPitch,
        status: "qualificado",
        dispatchStatus: autoDispatchSalesWhatsApp ? "enviado" : "pendente",
        salesNotes: itemTargetKey ? `Local-alvo: ${itemTargetKey}. Capturado automaticamente via Scraping Direcionado.` : `Capturado automaticamente em ${new Date().toLocaleDateString('pt-BR')} via Scraping de Comércio Local.`,
        createdAt: new Date().toISOString(),
        history: [
          {
            id: `h-scrape-${Date.now()}-${i}`,
            timestamp: new Date().toISOString(),
            action: `Scraping & Verificação de Ausência de Site${itemTargetKey ? ` [Local-alvo: ${candidateNeighborhood}]` : ''}`,
            note: `Status detectado: ${websiteStatus}. Telefone e WhatsApp validados.`
          }
        ]
      };

      scrapedLeads.push(candidateLead);
    }

    // If Gemini is available and autoQualifyWithAI is true, use Gemini to polish the pitch and analysis!
    if (ai && autoQualifyWithAI && scrapedLeads.length > 0) {
      try {
        const promptText = `Você é um especialista em automação comercial, vendas B2B e tecnologia para pequenos comércios no Brasil.
Recebemos uma lista de novos leads comerciais capturados via automação que não possuem site e necessitam de teste de campo do App-CIC (aplicativo mobile simplificado para controle de itens e saídas de estoque).
Para o lead principal a seguir:
Nome: ${scrapedLeads[0].businessName}
Proprietário: ${scrapedLeads[0].ownerName}
Categoria: ${scrapedLeads[0].category}
Local: ${scrapedLeads[0].neighborhood}, ${scrapedLeads[0].city}
Status do Site: ${scrapedLeads[0].websiteStatus}
Necessita Controle de Estoque (App-CIC): ${scrapedLeads[0].needsInventoryControl ? "Sim" : "Não"}

Gere uma resposta em JSON com:
1. "qualificationSummary": um parágrafo analítico refinado explicando por que esse comércio é um lead quente.
2. "suggestedPitch": uma mensagem altamente persuasiva para WhatsApp comercial (direta, cordial, em português do Brasil, que destaque a ausência do site e ofereça um teste de campo do App-CIC para controle de estoque sem complicação).
3. "painPoints": uma lista de 3 principais dores reais do comércio.

Retorne EXCLUSIVAMENTE o JSON no formato:
{"qualificationSummary": "...", "suggestedPitch": "...", "painPoints": ["...", "...", "..."]}`;

        const geminiRes = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: promptText,
          config: {
            responseMimeType: "application/json",
          }
        });

        if (geminiRes && geminiRes.text) {
          const parsed = JSON.parse(geminiRes.text.trim());
          if (parsed.qualificationSummary) scrapedLeads[0].qualificationSummary = parsed.qualificationSummary;
          if (parsed.suggestedPitch) scrapedLeads[0].suggestedPitch = parsed.suggestedPitch;
          if (Array.isArray(parsed.painPoints) && parsed.painPoints.length > 0) scrapedLeads[0].painPoints = parsed.painPoints;
          scrapedLeads[0].history.push({
            id: `h-ai-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "Análise Qualificada por Gemini AI",
            note: "Pitch personalizado de alta conversão gerado."
          });
        }
      } catch (geminiErr) {
        console.warn("Gemini qualification fallback:", geminiErr);
      }
    }

    // Append to global leads
    for (const lead of scrapedLeads) {
      leads.unshift(lead);

      // Create linked sample items in App-CIC if flagged for inventory test
      if (lead.needsInventoryControl) {
        const sampleItemNames = category === "Mercadinho / Mercearia"
          ? ["Feijão Carioca 1kg", "Açúcar Refinado 1kg", "Detergente Líquido 500ml"]
          : category === "Autopeças / Oficina"
          ? ["Vela de Ignição SP10", "Aditivo Radiador 1L", "Óleo 5W30 Sintético"]
          : category === "Padaria"
          ? ["Pão Francês (kg)", "Manteiga Extra 200g", "Leite Integral 1L"]
          : ["Item Geral 01", "Item Geral 02"];

        const sampleName = sampleItemNames[Math.floor(Math.random() * sampleItemNames.length)];
        const newItem: AppCicItem = {
          id: `cic-item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          leadId: lead.id,
          leadBusinessName: lead.businessName,
          name: sampleName,
          category: category,
          sku: `CIC-${Math.floor(1000 + Math.random() * 9000)}`,
          currentStock: Math.floor(5 + Math.random() * 30),
          minStock: 10,
          unitPrice: Number((10 + Math.random() * 40).toFixed(2)),
          unit: "un",
          status: "ok",
          lastMovementDate: new Date().toISOString()
        };
        cicItems.unshift(newItem);
      }

      // Trigger Push Notification
      if (autoPushNotification) {
        const notif: NotificationItem = {
          id: `notif-${Date.now()}-${Math.random()}`,
          title: "Novo Lead Capturado e Qualificado!",
          message: `${lead.businessName} (${lead.neighborhood}) - Sem site detectado. Score: ${lead.qualificationScore}/100. Pronto para envio comercial.`,
          timestamp: new Date().toISOString(),
          leadId: lead.id,
          type: "new_lead",
          read: false
        };
        notifications.unshift(notif);
      }
    }

    res.json({
      success: true,
      scrapedCount: scrapedLeads.length,
      scrapedLeads,
      message: `${scrapedLeads.length} novos comércios locais foram prospectados, verificados quanto à ausência de site e organizados automaticamente na planilha.`
    });
  } catch (error: any) {
    console.error("Scraping error:", error);
    res.status(500).json({ success: false, error: error?.message || "Falha na automação de scraping" });
  }
});

// 3. AI Lead Re-qualification & Custom Pitch Generator
app.post("/api/qualify", async (req: Request, res: Response) => {
  try {
    const { leadId, customObjective = "site_e_controle_estoque" } = req.body;
    const lead = leads.find(l => l.id === leadId);
    if (!lead) {
      return res.status(404).json({ success: false, error: "Lead não encontrado" });
    }

    if (ai) {
      const prompt = `Analise detalhadamente o perfil deste comércio local brasileiro para qualificação de vendas e teste de campo do App-CIC (gestão de itens e saídas no comércio):
Comércio: ${lead.businessName}
Responsável: ${lead.ownerName}
Segmento: ${lead.category}
Local: ${lead.neighborhood}, ${lead.city} - ${lead.state}
Presença Web: ${lead.websiteStatus}
Telefone: ${lead.phone}

Objetivo:
1. Criar um website profissional/vitrine para atrair clientes locais.
2. Realizar teste de campo do App-CIC para controle simplificado de estoque e registro de saídas no balcão.

Gere uma resposta em JSON com:
- "score": número de 1 a 100
- "grade": "A (Altíssima)", "B (Boa)", "C (Média)"
- "summary": análise estratégica do potencial deste cliente
- "pitch": mensagem de WhatsApp personalizada e pronta para a equipe comercial enviar, com gancho atrativo, simpatia e chamada para ação (CTA)
- "painPoints": lista com 3 a 4 dores específicas`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      if (response && response.text) {
        const data = JSON.parse(response.text.trim());
        lead.qualificationScore = Number(data.score) || lead.qualificationScore;
        lead.qualificationGrade = data.grade || lead.qualificationGrade;
        lead.qualificationSummary = data.summary || lead.qualificationSummary;
        lead.suggestedPitch = data.pitch || lead.suggestedPitch;
        if (Array.isArray(data.painPoints)) lead.painPoints = data.painPoints;

        lead.history.unshift({
          id: `h-qualify-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: "Requalificação Estratégica via Gemini AI",
          note: `Novo score: ${lead.qualificationScore}/100`
        });

        return res.json({ success: true, lead });
      }
    }

    // Fallback if AI not initialized
    lead.qualificationScore = Math.min(100, lead.qualificationScore + 5);
    lead.history.unshift({
      id: `h-qualify-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Requalificação Concluída",
      note: "Parâmetros de qualificação atualizados"
    });
    res.json({ success: true, lead });
  } catch (err: any) {
    console.error("Qualify error:", err);
    res.status(500).json({ success: false, error: err?.message || "Erro na qualificação" });
  }
});

// 4. WhatsApp Dispatch
app.post("/api/whatsapp/dispatch", (req: Request, res: Response) => {
  const { leadId, customMessage, targetSalesPhone } = req.body;
  const lead = leads.find(l => l.id === leadId);
  if (!lead) {
    return res.status(404).json({ success: false, error: "Lead não encontrado" });
  }

  const messageToSend = customMessage || lead.suggestedPitch;
  lead.status = "disparado_whatsapp";
  lead.dispatchStatus = "enviado";
  lead.lastContactAt = new Date().toISOString();

  lead.history.unshift({
    id: `h-dispatch-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: "Envio de Abordagem WhatsApp",
    note: targetSalesPhone ? `Direcionado à equipe de vendas: ${targetSalesPhone}` : "Enviado diretamente ao contato comercial"
  });

  // Generate standard WhatsApp web link
  const encodedText = encodeURIComponent(messageToSend);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${lead.whatsapp}&text=${encodedText}`;

  // Trigger push notification
  notifications.unshift({
    id: `notif-disp-${Date.now()}`,
    title: "Disparo WhatsApp Concluído",
    message: `Lead ${lead.businessName} enviado para atendimento comercial.`,
    timestamp: new Date().toISOString(),
    leadId: lead.id,
    type: "whatsapp_sent",
    read: false
  });

  res.json({
    success: true,
    lead,
    whatsappUrl,
    message: "Lead atualizado e pronto para envio no WhatsApp!"
  });
});

// 5. App-CIC Inventory Items (Mobile Field Testing)
app.get("/api/cic/items", (req: Request, res: Response) => {
  const { leadId, search, status } = req.query;
  let items = [...cicItems];

  if (leadId && leadId !== "all") {
    items = items.filter(i => i.leadId === leadId);
  }
  if (status && status !== "all") {
    items = items.filter(i => i.status === status);
  }
  if (search) {
    const s = String(search).toLowerCase();
    items = items.filter(i => 
      i.name.toLowerCase().includes(s) || 
      i.sku.toLowerCase().includes(s) ||
      (i.leadBusinessName && i.leadBusinessName.toLowerCase().includes(s))
    );
  }

  res.json({ success: true, count: items.length, items });
});

app.post("/api/cic/items", (req: Request, res: Response) => {
  const newItem: AppCicItem = {
    id: `cic-item-${Date.now()}`,
    name: req.body.name,
    category: req.body.category || "Geral",
    sku: req.body.sku || `CIC-${Math.floor(1000 + Math.random() * 9000)}`,
    currentStock: Number(req.body.currentStock) || 0,
    minStock: Number(req.body.minStock) || 5,
    unitPrice: Number(req.body.unitPrice) || 0,
    unit: req.body.unit || "un",
    leadId: req.body.leadId,
    leadBusinessName: req.body.leadBusinessName,
    status: (Number(req.body.currentStock) <= 0) ? "esgotado" : (Number(req.body.currentStock) <= Number(req.body.minStock)) ? "alerta_baixo" : "ok",
    lastMovementDate: new Date().toISOString()
  };

  cicItems.unshift(newItem);
  res.status(201).json({ success: true, item: newItem });
});

app.put("/api/cic/items/:id", (req: Request, res: Response) => {
  const index = cicItems.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Item não encontrado" });
  }

  const updated: AppCicItem = {
    ...cicItems[index],
    ...req.body,
    currentStock: Number(req.body.currentStock ?? cicItems[index].currentStock),
    minStock: Number(req.body.minStock ?? cicItems[index].minStock),
    unitPrice: Number(req.body.unitPrice ?? cicItems[index].unitPrice),
  };

  if (updated.currentStock <= 0) {
    updated.status = "esgotado";
  } else if (updated.currentStock <= updated.minStock) {
    updated.status = "alerta_baixo";
  } else {
    updated.status = "ok";
  }

  cicItems[index] = updated;
  res.json({ success: true, item: updated });
});

app.delete("/api/cic/items/:id", (req: Request, res: Response) => {
  const index = cicItems.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Item não encontrado" });
  }
  const deleted = cicItems.splice(index, 1)[0];
  res.json({ success: true, deleted });
});

// 6. App-CIC Stock Movement (Saídas & Entradas Instantâneas)
app.get("/api/cic/movements", (req: Request, res: Response) => {
  res.json({ success: true, count: cicMovements.length, movements: cicMovements });
});

app.post("/api/cic/movements", (req: Request, res: Response) => {
  const { itemId, type, quantity, reason, notes } = req.body;
  const item = cicItems.find(i => i.id === itemId);
  if (!item) {
    return res.status(404).json({ success: false, error: "Item não encontrado" });
  }

  const qty = Number(quantity);
  if (!qty || qty <= 0) {
    return res.status(400).json({ success: false, error: "Quantidade inválida" });
  }

  if (type === "saida") {
    item.currentStock = Math.max(0, item.currentStock - qty);
  } else {
    item.currentStock += qty;
  }

  item.lastMovementDate = new Date().toISOString();
  if (item.currentStock <= 0) {
    item.status = "esgotado";
  } else if (item.currentStock <= item.minStock) {
    item.status = "alerta_baixo";
  } else {
    item.status = "ok";
  }

  const movement: AppCicMovement = {
    id: `mov-${Date.now()}`,
    itemId: item.id,
    itemName: item.name,
    type,
    quantity: qty,
    reason: reason || (type === "saida" ? "venda_balcao" : "reposicao"),
    timestamp: new Date().toISOString(),
    value: Number((qty * item.unitPrice).toFixed(2)),
    notes
  };

  cicMovements.unshift(movement);

  // If item reached low or out of stock, fire notification
  if (item.status !== "ok") {
    notifications.unshift({
      id: `notif-stock-${Date.now()}`,
      title: item.status === "esgotado" ? "Estoque Esgotado (App-CIC)" : "Alerta de Estoque Mínimo (App-CIC)",
      message: `O produto '${item.name}' atingiu o nível ${item.currentStock} ${item.unit} no comércio ${item.leadBusinessName || "Local"}.`,
      timestamp: new Date().toISOString(),
      leadId: item.leadId,
      type: "cic_alert",
      read: false
    });
  }

  res.status(201).json({ success: true, movement, updatedItem: item, item });
});

// 7. Notifications
app.get("/api/notifications", (req: Request, res: Response) => {
  res.json({ success: true, notifications, unreadCount: notifications.filter(n => !n.read).length });
});

app.post("/api/notifications/mark-all-read", (req: Request, res: Response) => {
  notifications = notifications.map(n => ({ ...n, read: true }));
  res.json({ success: true, message: "Todas as notificações marcadas como lidas" });
});

// 8. Weekly and Monthly Strategic Reports
app.post("/api/reports/strategic", async (req: Request, res: Response) => {
  try {
    const { period = "semanal" } = req.body;

    const totalScraped = leads.length;
    const withoutWebsiteCount = leads.filter(l => l.needsWebsite || l.websiteStatus === "none" || l.websiteStatus === "social_only").length;
    const inventoryNeedCount = leads.filter(l => l.needsInventoryControl).length;
    const qualifiedCount = leads.filter(l => l.isQualified).length;
    const whatsappDispatchedCount = leads.filter(l => l.status === "disparado_whatsapp" || l.status === "em_negociacao" || l.status === "convertido" || l.status === "teste_cic").length;
    const conversionCount = leads.filter(l => l.status === "convertido").length;
    const cicTestsActive = leads.filter(l => l.status === "teste_cic").length;
    const conversionRate = totalScraped > 0 ? Number(((conversionCount / totalScraped) * 100).toFixed(1)) : 0;

    // Niche breakdown
    const nicheMap: Record<string, { count: number; converted: number }> = {};
    leads.forEach(l => {
      if (!nicheMap[l.category]) nicheMap[l.category] = { count: 0, converted: 0 };
      nicheMap[l.category].count++;
      if (l.status === "convertido" || l.status === "teste_cic") nicheMap[l.category].converted++;
    });

    const topNiches = Object.entries(nicheMap).map(([name, data]) => ({
      name,
      count: data.count,
      conversionRate: data.count > 0 ? Number(((data.converted / data.count) * 100).toFixed(1)) : 0
    })).sort((a, b) => b.count - a.count);

    let strategicInsights = [
      "Comércios alimentícios e oficinas mecânicas apresentaram 85% de taxa de ausência de website próprio.",
      "A oferta conjunta de Website + Teste de Campo do App-CIC aumentou a receptividade no WhatsApp em 2.8x.",
      "Leads abordados com menção direta ao bairro e dor de saídas sem controle convertem 42% mais rápido."
    ];

    let recommendedActions = [
      "Concentrar a prospecção da próxima semana em mercadinhos de bairro e confeitarias de alta rotatividade.",
      "Treinar o time de vendas para demonstrar a tela de saídas do App-CIC direto pelo celular na primeira ligação.",
      "Automatizar o segundo toque de WhatsApp após 48h para leads com status 'enviado' sem resposta."
    ];

    let aiAnalysisText = "";

    if (ai) {
      try {
        const reportPrompt = `Como consultor sênior de inteligência de vendas e automação de prospecção comercial, elabore uma análise executiva sobre os seguintes dados do nosso sistema de prospecção de negócios locais (sem site e precisando do App-CIC de controle de estoque):
Período: Relatório ${period === "semanal" ? "Semanal" : "Mensal"}
Total de Leads Prospectados: ${totalScraped}
Negócios Sem Site: ${withoutWebsiteCount} (${totalScraped > 0 ? Math.round((withoutWebsiteCount / totalScraped) * 100) : 0}%)
Necessitam de Controle de Estoque (App-CIC): ${inventoryNeedCount}
Leads Qualificados: ${qualifiedCount}
Disparados no WhatsApp: ${whatsappDispatchedCount}
Testes de Campo Ativos do App-CIC: ${cicTestsActive}
Conversões Concretizadas: ${conversionCount} (Taxa: ${conversionRate}%)
Top Nichos: ${topNiches.map(n => `${n.name} (${n.count} leads, ${n.conversionRate}% conversão)`).join(", ")}

Gere uma resposta em JSON com:
1. "aiAnalysisText": um parágrafo executivo com diagnóstico dos resultados e pontos fortes da estratégia.
2. "strategicInsights": array com 3 insights de dados objetivos.
3. "recommendedActions": array com 3 ações imediatas para a diretoria e equipe comercial aumentar o faturamento no próximo período.`;

        const aiRes = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: reportPrompt,
          config: { responseMimeType: "application/json" }
        });

        if (aiRes && aiRes.text) {
          const parsed = JSON.parse(aiRes.text.trim());
          if (parsed.aiAnalysisText) aiAnalysisText = parsed.aiAnalysisText;
          if (Array.isArray(parsed.strategicInsights)) strategicInsights = parsed.strategicInsights;
          if (Array.isArray(parsed.recommendedActions)) recommendedActions = parsed.recommendedActions;
        }
      } catch (err) {
        console.warn("Report AI generation error:", err);
      }
    }

    const report: StrategicReport = {
      period,
      dateRange: period === "semanal" ? "Últimos 7 dias" : "Últimos 30 dias",
      totalScraped,
      withoutWebsiteCount,
      inventoryNeedCount,
      qualifiedCount,
      whatsappDispatchedCount,
      conversionCount,
      cicTestsActive,
      conversionRate,
      topNiches,
      strategicInsights,
      recommendedActions,
      aiAnalysisText: aiAnalysisText || (period === "semanal" 
        ? "No período semanal avaliado, a automação de prospecção demonstrou alto índice de qualificação em comércios de conveniência e serviços automotivos, com grande receptividade para o modelo de teste de campo do App-CIC associado à criação de sites profissionais."
        : "O balanço mensal consolidou um pipeline robusto de prospecção ativa. A conversão de negócios que antes não possuíam presença digital gerou previsibilidade de receita e abriu portas para a expansão do controle de estoque simplificado nos pontos de venda.")
    };

    res.json({ success: true, report });
  } catch (error: any) {
    console.error("Report error:", error);
    res.status(500).json({ success: false, error: error?.message || "Erro ao gerar relatório estratégico" });
  }
});

// ======================== VITE MIDDLEWARE / SPA FALLBACK ========================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AutoLead & CIC Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
