# ⚡ Guia de Importação & Execução do Workflow n8n

Este fluxo automatiza a ponta comercial e de validação da sua operação **AutoLead + App-CIC**:
1. Busca leads qualificados na sua plataforma ou dispara na hora via webhook.
2. Filtra comércios sem site e com dor de estoque (Cocaia, Jurubatuba, Maria Benedita, Copan, etc.).
3. Dispara a mensagem persuasiva no WhatsApp oferecendo o **App-CIC 100% gratuito** para teste.
4. Atualiza o status do lead na sua planilha/banco.
5. Aguarda 48h de uso e envia o link do **Formulário de Feedback**.
6. Prepara o terreno para você fechar o **Site Profissional por fora** (R$ 1.200 a R$ 2.500).

---

## 🚀 Como Importar no seu n8n em 1 Minuto

1. Abra seu painel do **n8n** (self-hosted ou cloud).
2. Clique no menu superior direito `...` e selecione **"Import from File"** (ou copie e cole o código do arquivo `workflow-n8n-autolead-whatsapp.json`).
3. O diagrama de nós aparecerá montado na tela.

---

## 🔑 Variáveis de Ambiente Recomendadas no n8n

No seu arquivo `.env` do n8n (ou na aba *Settings > Variables* do n8n), defina:

| Variável | Exemplo | Descrição |
| :--- | :--- | :--- |
| `AUTOLEAD_API_URL` | `https://seu-app-autolead.com` | URL da sua aplicação para buscar e atualizar leads |
| `FEEDBACK_FORM_URL` | `https://tally.so/r/app-cic-feedback` | Link do seu formulário no Tally ou Google Forms |
| `APP_DEMO_URL` | `https://app-cic-demo.web.app` | Link do seu vídeo demonstrativo do App-CIC |
| `EVOLUTION_API_URL` | `http://evolution-api:8080` | URL da sua Evolution API ou gateway WhatsApp |
| `EVOLUTION_INSTANCE_NAME`| `autolead` | Nome da sua instância no WhatsApp |
| `EVOLUTION_API_KEY` | `sua_chave_secreta` | API Key para autenticação na Evolution |

---

## 📲 Gateways WhatsApp Suportados

O nó **"Disparar WhatsApp"** está formatado no padrão HTTP universal, compatível com:
- **Evolution API** (Recomendado - Open Source)
- **Z-API** (Basta trocar o endpoint para `https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/send-text`)
- **Baileys / WPPConnect**
- **WhatsApp Cloud API Oficial**

---

## 🛡️ Dica Anti-Bloqueio do WhatsApp

- No nó **"Filtrar e Qualificar Leads Alvo"**, o código já possui um `slice(0, 5)` para disparar em pequenos lotes de 5 comerciantes por ciclo.
- O nó do WhatsApp possui um atraso de simulação de digitação (`presence: composing` e delay de 1.2 segundos).
- Comece com 5 a 10 disparos por dia com sua linha aquecida.
