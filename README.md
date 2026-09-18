# 🚀 AutoLead & App-CIC — Máquina de Prospecção, Teste de Campo & Fábrica de Sites

> **Estratégia Cavalo de Tróia**: Doamos o **App-CIC** (controle rápido de estoque e saídas de balcão) 100% gratuito para pequenos comércios sem site, coletamos feedback detalhado para aprimorar o app e fechamos a criação de **Sites Profissionais com Catálogo WhatsApp** por fora (faturamento de R$ 1.200 a R$ 2.500 por cliente).

---

## 🧠 Segundo Cérebro para Obsidian (Pasta `/obsidian-brain`)

Você pode importar a pasta `obsidian-brain` diretamente para o **Obsidian** na sua máquina local:

### Como importar no Obsidian em casa:
1. Clone ou baixe este repositório no seu computador (`git clone` ou Baixar ZIP pelo GitHub).
2. Abra o aplicativo **Obsidian**.
3. Clique em **"Open folder as vault"** (Abrir pasta como cofre).
4. Selecione a pasta **`obsidian-brain`** deste projeto.
5. Pronto! Todas as notas, mapas mentais, scripts e esteiras de vendas estarão conectadas com links bidirecionais (`[[...]]`) e tags.

### 📑 Arquivos do Vault Obsidian inclusos:
- **`00 - MAPA MENTAL & CEREBRO (MOC).md`**: Centro de comando visual com diagrama Mermaid de toda a máquina.
- **`01 - ESTRATEGIA CAVALO DE TROIA (App-CIC Gratis + Upsell Site).md`**: A tese psicológica que destrói o ceticismo do comerciante.
- **`02 - NEURONIO DE PROSPECCAO E RADAR LOCAL.md`**: Detalhamento das 4 praças-alvo:
  - *Cocaia (Guarulhos)*
  - *Senac Jurubatuba (Zona Sul SP)*
  - *Rua Maria Benedita Rodrigues, 91 (São Miguel Paulista SP)*
  - *Copan / Alto do Ipiranga (Centro e Zona Sul SP)*
- **`03 - SCRIPTS DE WHATSAPP DE ALTA CONVERSAO.md`**: Scripts amigáveis de abordagem, agendamento de reunião e envio do formulário.
- **`04 - FORMULARIO DE FEEDBACK DO APP-CIC.md`**: Estrutura das perguntas de ouro para melhoria de produto.
- **`05 - ESTEIRA DE VENDA DO SITE POR FORA (UPSELL).md`**: Pacotes de sites (One-Page Express e Catálogo Online), preços e contratos.

---

## ⚡ Automação WhatsApp no n8n (Pasta `/n8n`)

O workflow completo para o n8n está pronto no arquivo:
- **`n8n/workflow-n8n-autolead-whatsapp.json`**
- **`n8n/README-WORKFLOW-N8N.md`**

### O que o n8n faz automaticamente:
1. Lê comércios que **não possuem site** e que têm demanda de balcão.
2. Dispara a mensagem personalizada de convite para teste gratuito do App-CIC via Evolution API / Z-API.
3. Atualiza o status do lead na planilha para `disparado_whatsapp`.
4. Aguarda 48 horas de uso real no balcão.
5. Dispara automaticamente o link do **Formulário de Feedback**.

---

## 📋 Formulário de Feedback Integrado na Aplicação

O sistema possui uma central interativa de feedback onde os comerciantes/empreendedores preenchem:
- O que **realmente gostaram** no App-CIC.
- O que **não gostaram** ou acharam difícil no balcão.
- O que **deve melhorar** e quais funções fizeram falta (leitor de código de barras, impressão térmica de cupom, fiado, PIX).
- Se os clientes deles pedem site/catálogo na internet (o gancho imediato para você fechar a venda do site por fora).

---

## 💰 Como Ganhar Dinheiro Vendendo Sites por Fora

| Etapa | Ação | Retorno |
| :--- | :--- | :--- |
| **1. Entrada** | Instalar o App-CIC grátis no celular do dono | Conquista confiança e acesso direto ao WhatsApp |
| **2. Validação** | Coletar o feedback sincero no formulário | Identifica pontos de melhoria para o App-CIC |
| **3. Fechamento** | Mostrar no celular como ficaria o site dele | Fechamento de **R$ 950 a R$ 2.400** + mensalidade de suporte |

---

## 🛠️ Tecnologias Utilizadas
- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide Icons + Framer Motion.
- **Backend**: Node.js + Express API.
- **Automação**: n8n Workflow + WhatsApp Gateway HTTP.
- **Base de Conhecimento**: Obsidian Markdown Vault.
