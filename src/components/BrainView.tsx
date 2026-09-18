import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  Brain, 
  Workflow, 
  BookOpen, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Sparkles, 
  MapPin, 
  MessageSquare, 
  FileText, 
  DollarSign, 
  GitBranch, 
  ArrowRight, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  Code,
  Archive,
  FolderArchive,
  UploadCloud
} from 'lucide-react';

interface BrainViewProps {
  onGoToScraping: () => void;
  onGoToSpreadsheet: () => void;
  onGoToFeedback?: () => void;
}

export const BrainView: React.FC<BrainViewProps> = ({ onGoToScraping, onGoToSpreadsheet, onGoToFeedback }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'notes' | 'n8n' | 'git'>('overview');
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(0);
  const [copiedNote, setCopiedNote] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  // Obsidian Vault Notes
  const obsidianNotes = [
    {
      title: '00 - MAPA MENTAL & CÉREBRO (MOC)',
      fileName: '00 - MAPA MENTAL & CEREBRO (MOC).md',
      tag: 'Arquitetura Geral',
      content: `---
title: "🧠 Mapa Mental & Centro de Comando: App-CIC + Venda de Sites"
tags:
  - moc
  - cerebro
  - app-cic
  - prospeccao
  - n8n
  - automacao
  - vendas
---

# 🧠 Segundo Cérebro: Operação App-CIC & Fábrica de Sites

## 🗺️ Mapa de Conexões do Sistema

1. **Radar de Prospecção**: Varredura nas 4 praças prioritárias (Cocaia, Jurubatuba, Maria Benedita 91, Copan).
2. **Filtro de Ouro**: Sem site próprio ativo + dor real de controle de saídas no balcão.
3. **Cavalo de Tróia**: Entrega do App-CIC 100% gratuito (zero mensalidade, sem cartão).
4. **Pacto de Feedback**: Comerciante preenche o formulário avaliando o App-CIC para direcionar novas melhorias.
5. **Upsell de Alto Valor**: Após criar simpatia e autoridade, ofertar a criação do Site Profissional (R$ 1.200 a R$ 2.500) com catálogo e botão de pedidos no WhatsApp.`
    },
    {
      title: '01 - ESTRATÉGIA CAVALO DE TRÓIA',
      fileName: '01 - ESTRATEGIA CAVALO DE TROIA (App-CIC Gratis + Upsell Site).md',
      tag: 'Modelo de Negócio',
      content: `---
title: "🐎 Estratégia Cavalo de Tróia: App-CIC Gratuito + Upsell de Sites"
tags:
  - estrategia
  - cavalo-de-troia
  - upsell
---

# 🐎 Estratégia Cavalo de Tróia: App-CIC Gratuito + Venda de Sites

## 🎯 Por que funciona?
Pequenos comércios rejeitam vendedores chatos. Mas quando você chega como desenvolvedor oferecendo uma ferramenta prática 100% grátis e pedindo a opinião dele, a porta se abre na hora.

## 💰 A Matemática dos Lucros:
- **App-CIC**: R$ 0,00 (Gera o lead quente e a validação do produto).
- **Site One-Page Express**: R$ 950 a R$ 1.400 + R$ 69/mês.
- **Catálogo WhatsApp Completo**: R$ 1.600 a R$ 2.400 + R$ 120/mês.
- Meta de 10 comércios no App-CIC = 2 a 3 sites fechados (R$ 3.000 a R$ 5.000 de lucro no mês).`
    },
    {
      title: '02 - NEURÔNIO DE PROSPECÇÃO & 4 PRAÇAS',
      fileName: '02 - NEURONIO DE PROSPECCAO E RADAR LOCAL.md',
      tag: 'Geolocalização',
      content: `---
title: "📍 Neurônio de Prospecção e Radar das 4 Regiões-Alvo"
tags:
  - prospeccao
  - guarulhos
  - jurubatuba
  - copan
---

# 📍 As 4 Praças Estratégicas de Validação

1. **Cocaia (Guarulhos)**: Mercadinhos, quitandas, açougues e depósitos na Av. Brigadeiro Faria Lima. Alto giro de balcão e zero sites.
2. **Senac Jurubatuba (SP)**: Restaurantes por quilo, lanchonetes e xerox que atendem o fluxo de alunos. Precisam de catálogo online urgente.
3. **Rua Maria Benedita Rodrigues, 91 (SP)**: Comércio tradicional familiar de proximidade, registro em caderninho.
4. **Copan & Alto do Ipiranga (SP)**: Cafés artesanais, empórios e boutiques com clientes exigentes e público de alto poder aquisitivo.`
    },
    {
      title: '03 - SCRIPTS DE WHATSAPP (CONVERSÃO)',
      fileName: '03 - SCRIPTS DE WHATSAPP DE ALTA CONVERSAO.md',
      tag: 'Copywriting WhatsApp',
      content: `---
title: "💬 Scripts de WhatsApp de Alta Conversão"
tags:
  - scripts
  - whatsapp
  - copy
---

# 💬 Script Disparo Inicial (Amigável & Gratuito):

"Olá, [Nome do Dono]! Tudo bem?

Acompanho o movimento do [Nome da Empresa] aqui na região de [Bairro].

Sou desenvolvedor e criamos o App-CIC, um aplicativo simples de celular para registrar saídas de mercadorias no balcão e avisar quando o estoque está no fim.

Estamos selecionando 3 comércios da região para liberar o app 100% gratuito, sem custo nem mensalidade. Nosso único objetivo é receber seu feedback de uso prático para aprimorarmos o sistema.

Posso te mandar um vídeo de 1 minuto mostrando como funciona?"`
    },
    {
      title: '04 - FORMULÁRIO DE FEEDBACK DO APP-CIC',
      fileName: '04 - FORMULARIO DE FEEDBACK DO APP-CIC.md',
      tag: 'Dados de Produto',
      content: `---
title: "📋 Estrutura do Formulário de Feedback do App-CIC"
tags:
  - formulario
  - feedback
  - app-cic
---

# 📋 Perguntas de Ouro para o Formulário (Tally / Google Forms):

1. De 0 a 10, quão fácil foi registrar saídas de produtos no celular?
2. O alerta de estoque baixo ajudou a não faltar produto no balcão?
3. Qual função fez mais falta? (Código de barras, impressão térmica, Pix, fiado).
4. O que você mais gostou?
5. Seus clientes já procuraram cardápio digital ou catálogo do seu comércio na internet? (Gatilho para venda de site!).`
    },
    {
      title: '05 - ESTEIRA DE VENDA DO SITE POR FORA',
      fileName: '05 - ESTEIRA DE VENDA DO SITE POR FORA (UPSELL).md',
      tag: 'Venda de Sites',
      content: `---
title: "💰 Esteira de Venda do Site por Fora (Upsell de Alto Lucro)"
tags:
  - upsell
  - sites
  - precificacao
---

# 💰 Como Vender o Site Profissional Sem Parecer Vendedor

1. Mostre no seu celular a fachada do comércio dele com uma prévia pronta de página institucional e botão de WhatsApp.
2. Explique que o morador do bairro pesquisa no Google e hoje não encontra nada, caindo no concorrente.
3. Apresente o Pacote Express (R$ 950 a R$ 1.400) ou Catálogo Completo (R$ 1.800 a R$ 2.400).
4. Ofereça entrega em 48 horas porque você já tem as fotos e produtos cadastrados no App-CIC!`
    }
  ];

  // n8n Workflow JSON Preview
  const n8nJsonSnippet = `{
  "name": "AutoLead & App-CIC - Disparo WhatsApp & Convite Beta Tester Grátis",
  "nodes": [
    {
      "name": "Agendamento Diário (09:30 Seg-Sex)",
      "type": "n8n-nodes-base.scheduleTrigger"
    },
    {
      "name": "Webhook Instantâneo (Via App AutoLead)",
      "type": "n8n-nodes-base.webhook"
    },
    {
      "name": "Buscar Leads na API AutoLead",
      "type": "n8n-nodes-base.httpRequest"
    },
    {
      "name": "Filtrar e Qualificar Leads Alvo (Sem Site + Dor de Balcão)",
      "type": "n8n-nodes-base.code"
    },
    {
      "name": "Gerar Script Persuasivo (Cavalo de Tróia)",
      "type": "n8n-nodes-base.code"
    },
    {
      "name": "Disparar WhatsApp (Evolution / Z-API)",
      "type": "n8n-nodes-base.httpRequest"
    },
    {
      "name": "Atualizar Status no AutoLead (disparado_whatsapp)",
      "type": "n8n-nodes-base.httpRequest"
    },
    {
      "name": "Aguardar 48 Horas de Teste",
      "type": "n8n-nodes-base.wait"
    },
    {
      "name": "Enviar Lembrete do Formulário de Feedback",
      "type": "n8n-nodes-base.httpRequest"
    }
  ]
}`;

  const handleCopyNote = () => {
    navigator.clipboard.writeText(obsidianNotes[selectedNoteIndex].content);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  const handleDownloadNote = () => {
    const note = obsidianNotes[selectedNoteIndex];
    const blob = new Blob([note.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = note.fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyN8nJson = () => {
    fetch('/n8n/workflow-n8n-autolead-whatsapp.json')
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard.writeText(text);
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2000);
      })
      .catch(() => {
        navigator.clipboard.writeText(n8nJsonSnippet);
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2000);
      });
  };

  const handleDownloadN8nJson = () => {
    fetch('/n8n/workflow-n8n-autolead-whatsapp.json')
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'workflow-n8n-autolead-whatsapp.json';
        link.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        const blob = new Blob([n8nJsonSnippet], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'workflow-n8n-autolead-whatsapp.json';
        link.click();
        URL.revokeObjectURL(url);
      });
  };

  const handleDownloadFullVaultZip = async () => {
    setDownloadingZip(true);
    try {
      const zip = new JSZip();
      
      // Pasta obsidian-brain
      const vaultFolder = zip.folder("obsidian-brain");
      obsidianNotes.forEach(note => {
        vaultFolder?.file(note.fileName, note.content);
      });

      // Pasta n8n
      const n8nFolder = zip.folder("n8n");
      n8nFolder?.file("workflow-n8n-autolead-whatsapp.json", n8nJsonSnippet);
      n8nFolder?.file("README-WORKFLOW-N8N.md", `# ⚡ Workflow n8n — Prospecção WhatsApp + App-CIC + Feedback\n\nImporte este workflow no n8n para agendar os disparos e coletas.`);

      // README raiz
      zip.file("README.md", `# 🧠 Cofre do Segundo Cérebro Obsidian — App-CIC & Fábrica de Sites\n\nContém as 6 notas completas conectadas com tags, links bidirecionais [[...]] e diagramas Mermaid prontas para abrir no Obsidian na sua máquina local.`);

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'obsidian-vault-app-cic.zip';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao gerar ZIP do cofre Obsidian:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-purple-800/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-3 border border-purple-400/30">
            <Brain className="w-3.5 h-3.5" />
            <span>Segundo Cérebro &amp; Arquitetura de Neurônios (Obsidian + n8n + Venda de Sites)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Máquina de Prospecção App-CIC + Venda de Sites
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Estratégia completa de <strong>Cavalo de Tróia</strong>: oferecemos o aplicativo de controle de saídas balcão 100% gratuito para comércios sem site nas 4 praças prioritárias (Cocaia, Jurubatuba, Maria Benedita 91 e Copan). 
            Coletamos feedback sincero via formulário para aprimorar o app e fechamos a criação de <strong>Sites Profissionais com catálogo WhatsApp por R$ 1.200 a R$ 2.500</strong> por fora!
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={handleDownloadFullVaultZip}
              disabled={downloadingZip}
              className="min-h-[44px] px-4 py-2.5 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Archive className="w-4 h-4" />
              <span>{downloadingZip ? 'Gerando ZIP do Cofre...' : '📦 Baixar Cofre Obsidian (.ZIP)'}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('n8n')}
              className="min-h-[44px] px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Workflow className="w-4 h-4" />
              <span>Baixar Workflow n8n (WhatsApp)</span>
            </button>
            <button
              onClick={() => setActiveSubTab('notes')}
              className="min-h-[44px] px-4 py-2.5 bg-purple-900/60 hover:bg-purple-800 active:bg-purple-900 text-purple-200 font-bold text-xs rounded-xl border border-purple-500/30 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Ver 6 Notas do Obsidian</span>
            </button>
            <button
              onClick={() => setActiveSubTab('git')}
              className="min-h-[44px] px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-700 active:bg-slate-900 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sincronizar no GitHub</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`shrink-0 min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'overview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Visão Geral &amp; Neurônios</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notes')}
          className={`shrink-0 min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'notes'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span>Notas do Obsidian (Markdown)</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-200 text-purple-900 font-mono font-bold">
            {obsidianNotes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('n8n')}
          className={`shrink-0 min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'n8n'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Workflow className="w-4 h-4 text-emerald-400" />
          <span>Workflow n8n &amp; Automação</span>
        </button>

        <button
          onClick={() => setActiveSubTab('git')}
          className={`shrink-0 min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'git'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <GitBranch className="w-4 h-4 text-emerald-400" />
          <span>Repositório &amp; GitHub</span>
        </button>
      </div>

      {/* SUBTAB: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Funnel Flow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative">
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                Fase 1
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" /> Radar Local
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Varredura focada nas 4 regiões: Cocaia, Senac Jurubatuba, Maria Benedita 91 e Copan/Alto Ipiranga.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-blue-800 bg-blue-50/60 p-2 rounded-lg">
                Critério: <strong>Sem site ativo</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative">
              <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                Fase 2
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-2 flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-purple-600" /> Disparo n8n
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Envio automático no WhatsApp com tom amigável de desenvolvedor parceiro oferecendo o App-CIC 100% grátis.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-purple-800 bg-purple-50/60 p-2 rounded-lg">
                Gancho: <strong>Zero custo</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative">
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Fase 3
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-600" /> Formulário Feedback
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Após 48h de uso no balcão, enviamos o formulário. O comerciante avalia e aponta melhorias no App-CIC.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-amber-800 bg-amber-50/60 p-2 rounded-lg">
                Meta: <strong>Aprimorar app</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-gradient-to-b from-white to-emerald-50/40 shadow-sm relative">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                Fase 4 (Lucro)
              </span>
              <h3 className="text-sm font-bold text-emerald-950 mt-2 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Venda do Site
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Com a confiança criada, ofertamos a criação do site institucional com catálogo no WhatsApp por fora.
              </p>
              <div className="mt-3 text-[11px] font-bold text-emerald-900 bg-emerald-100/80 p-2 rounded-lg">
                Lucro: <strong>R$ 1.200 a R$ 2.500</strong>
              </div>
            </div>
          </div>

          {/* Business Model Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Por que esse modelo é imbatível?</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <span><strong>Zero Resistência Comercial:</strong> Você não tenta vender nada na primeira abordagem. O comerciante aceita testar porque não gasta 1 centavo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <span><strong>Validação com Dados Reais:</strong> O feedback preenchido no formulário alimenta diretamente o desenvolvimento do App-CIC, tornando o software cada vez mais robusto.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <span><strong>Monetização Imediata por Fora:</strong> Enquanto o App-CIC é distribuído gratuitamente para gerar volume e feedback, cada site fechado coloca mais de R$ 1.200 limpos no seu bolso.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>As 4 Regiões Mapeadas no Radar</span>
              </div>
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-blue-950">Cocaia (Guarulhos)</div>
                    <div className="text-[11px] text-blue-800">Comércios densos, hortifrutis e mercearias na Faria Lima</div>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full">Alto Giro</span>
                </div>

                <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-amber-950">Senac Jurubatuba (Zona Sul SP)</div>
                    <div className="text-[11px] text-amber-800">Restaurantes, lanchonetes e xerox de fluxo acadêmico</div>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">Pedidos Rápidos</span>
                </div>

                <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-emerald-950">Rua Maria Benedita Rodrigues, 91</div>
                    <div className="text-[11px] text-emerald-800">Comércio familiar de conveniência e depósitos locais</div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">Fidelidade</span>
                </div>

                <div className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-purple-950">Copan / Alto do Ipiranga</div>
                    <div className="text-[11px] text-purple-800">Cafés gourmets, empórios e boutiques de alta renda</div>
                  </div>
                  <span className="text-[10px] font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full">Ticket Médio Alto</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: OBSIDIAN NOTES */}
      {activeSubTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Note List Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              Notas do Obsidian Vault ({obsidianNotes.length})
            </div>
            {obsidianNotes.map((note, index) => (
              <button
                key={note.fileName}
                onClick={() => setSelectedNoteIndex(index)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 ${
                  selectedNoteIndex === index
                    ? 'bg-purple-900 text-white border-purple-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    selectedNoteIndex === index ? 'bg-purple-800 text-purple-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {note.tag}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </div>
                <div className="font-bold text-xs leading-snug">{note.title}</div>
                <div className={`text-[10px] font-mono ${selectedNoteIndex === index ? 'text-purple-300' : 'text-slate-400'}`}>
                  {note.fileName}
                </div>
              </button>
            ))}
          </div>

          {/* Note Content Viewer */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>{obsidianNotes[selectedNoteIndex].title}</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  obsidian-brain/{obsidianNotes[selectedNoteIndex].fileName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyNote}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  {copiedNote ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNote ? 'Copiado!' : 'Copiar Markdown'}</span>
                </button>
                <button
                  onClick={handleDownloadNote}
                  className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar .md</span>
                </button>
              </div>
            </div>

            <pre className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px]">
              {obsidianNotes[selectedNoteIndex].content}
            </pre>
          </div>
        </div>
      )}

      {/* SUBTAB: N8N WORKFLOW */}
      {activeSubTab === 'n8n' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-emerald-600" />
                  <span>Workflow n8n: Disparo Automático WhatsApp + App-CIC</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Arquivo pronto para importação direta no n8n. Compatível com Evolution API, Z-API e gateways WhatsApp.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyN8nJson}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  {copiedJson ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedJson ? 'JSON Copiado!' : 'Copiar JSON do n8n'}</span>
                </button>
                <button
                  onClick={handleDownloadN8nJson}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar workflow-n8n.json</span>
                </button>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">1</span>
                  Importar no n8n
                </div>
                <p className="text-[11px] text-slate-500">
                  No n8n, clique no menu superior direito &gt; <strong>Import from File</strong> e selecione o arquivo baixado.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">2</span>
                  Conectar WhatsApp API
                </div>
                <p className="text-[11px] text-slate-500">
                  Configure a URL e a API Key da sua Evolution API ou Z-API no nó de envio de WhatsApp.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">3</span>
                  Ativar Agendamento
                </div>
                <p className="text-[11px] text-slate-500">
                  O cron está configurado para 09:30 nos dias úteis, disparando em lotes controlados com proteção anti-bloqueio.
                </p>
              </div>
            </div>

            {/* JSON Code Snippet */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-emerald-600" />
                <span>Prévia do Arquivo JSON (n8n/workflow-n8n-autolead-whatsapp.json):</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-72">
                {n8nJsonSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: GIT & REPOSITORY */}
      {activeSubTab === 'git' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg">
                  Sincronização com seu GitHub (ohara407) &amp; Download Local
                </h3>
                <p className="text-xs text-slate-500">
                  Como ter todos os arquivos do Obsidian e n8n no seu repositório ou no seu computador agora.
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadFullVaultZip}
              disabled={downloadingZip}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Archive className="w-4 h-4" />
              <span>{downloadingZip ? 'Compactando...' : '📦 Baixar Cofre Obsidian (.ZIP) Direto'}</span>
            </button>
          </div>

          {/* Direct Notice about the screenshot */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-slate-900 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
              <UploadCloud className="w-5 h-5 text-emerald-600" />
              <span>Por que a pasta ainda não apareceu no seu GitHub? (Veja como resolver em 1 segundo):</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              No topo da tela do <strong>Google AI Studio</strong> (exatamente onde você tirou o print da aba <em>GitHub Sync</em>), está escrito: 
              <br />
              <code className="bg-emerald-200/80 text-emerald-950 px-2 py-0.5 rounded font-mono text-[11px] font-bold mt-1 inline-block">
                Sync status: Changes in Google AI Studio are ready to be pushed
              </code>
            </p>
            <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-xs font-bold text-slate-800 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center shrink-0">👉</span>
              <span>
                Basta clicar no botão azul/preto <strong className="text-emerald-700 font-black">"Push changes to GitHub"</strong> na barra inferior do painel do AI Studio!
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Assim que você clicar nesse botão, o AI Studio envia os 11 arquivos modificados (incluindo as pastas <code>obsidian-brain/</code>, <code>n8n/</code>, o <code>README.md</code> completo e os formulários de feedback) direto para o seu repositório <strong>ohara407/AutoLead-CIC---Scraping-e-Gest-o-Comercial</strong>!
            </p>
          </div>

          {/* How to import into Obsidian step by step */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FolderArchive className="w-4 h-4 text-purple-600" />
              <span>Como abrir no Obsidian na sua máquina em casa:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-black text-purple-600">Passo 1</span>
                <h5 className="text-xs font-bold text-slate-800">Baixe o Cofre</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Clique no botão roxo <strong>Baixar Cofre Obsidian (.ZIP)</strong> acima ou clone o repo via <code>git pull</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-black text-purple-600">Passo 2</span>
                <h5 className="text-xs font-bold text-slate-800">Extraia a Pasta</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Descompacte o arquivo ZIP no seu computador. Você verá a pasta <code>obsidian-brain</code> com as 6 notas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-black text-purple-600">Passo 3</span>
                <h5 className="text-xs font-bold text-slate-800">Abra no Obsidian</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  No Obsidian, clique em <strong>"Open folder as vault"</strong> e selecione a pasta. O grafo de neurônios abrirá na hora!
                </p>
              </div>
            </div>
          </div>

          {/* Git Terminal Commands */}
          <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs space-y-2">
            <div className="text-emerald-400 font-bold flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>Comandos Git para terminal local:</span>
            </div>
            <div className="text-slate-400"># Clonar o repositório na sua máquina local:</div>
            <div className="text-emerald-300">git clone https://github.com/ohara407/AutoLead-CIC---Scraping-e-Gest-o-Comercial.git</div>
            <div className="text-slate-400 mt-2"># Ou atualizar a branch main:</div>
            <div className="text-emerald-300">git pull origin main</div>
          </div>
        </div>
      )}
    </div>
  );
};
