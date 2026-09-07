# 🍼 Chá Revelação: Jade ou Benício? • Confirmação de Presença (RSVP)

Aplicação web completa, moderna e responsiva para confirmação de presença (RSVP) e bolão interativo do **Chá Revelação: Jade ou Benício**, inspirada fielmente na paleta de cores e na identidade visual rústica/delicada em aquarela do convite oficial.

---

## ✨ Funcionalidades

- **📱 Experiência Mobile & Desktop Imersiva:** Totalmente adaptado para smartphones e telas grandes, com toques suaves, micro-animações e paleta harmoniosa (azul jeans denim do Benício e terracota suave da Jade).
- **💌 Apresentação Visual do Convite:** Destaque para a aquarela original dos vestidinhos pendurados no galho botânico e contagem regressiva em tempo real até 10 de Outubro às 13h30.
- **🗳️ Bolão Interativo dos Convidados:** Termômetro dinâmico em tempo real mostrando a porcentagem da torcida: **Time Jade** vs **Time Benício**.
- **📅 Informações da Festa & Ações Rápidas:**
  - Botão com 1 clique para "Adicionar ao Google Agenda"
  - Botão para "Como Chegar no Google Maps" e cópia de endereço
  - Traje dos convidados: **Branco**
  - Sugestão de presentes: Fraldas M, G, GG (Huggies, Pampers, Babysec) + um mimo
  - Botões de contato direto no WhatsApp com a **Mamãe** (99837-8606) e o **Papai** (99667-7227)
- **📝 Formulário Completo de RSVP:**
  - Nome completo e WhatsApp formatado
  - Opção de confirmar presença ou justificar ausência
  - Contador interativo de Adultos e Crianças (+ e -)
  - Campo para nomes de acompanhantes
  - Votação no palpite (Jade ou Benício)
  - Espaço para mensagem carinhosa à família
  - Efeito comemorativo de **confetes coloridos** (rosa/azul) ao enviar!
- **🔐 Painel Administrativo dos Pais (`/admin`):**
  - Protegido por PIN de segurança (padrão: `2024`)
  - Métricas instantâneas: Total de confirmados, adultos, crianças e ausências
  - Busca em tempo real por nome, telefone ou acompanhantes
  - Filtros por status e por time (Jade / Benício)
  - Adição manual de convidados (caso confirmem pelo WhatsApp)
  - Alternância rápida de status e exclusão
  - Leitura das mensagens deixadas pelos convidados
  - **📥 Exportação para Planilha Excel (.CSV)**
  - **🖨️ Modo de Impressão Especial para Portaria:** Formatação em folha A4 com checklist de entrada física `[  ]` e totais para a equipe de recepção do evento.

---

## 🚀 Como Executar Localmente

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.
   - O painel administrativo fica em [http://localhost:3000/admin](http://localhost:3000/admin) (PIN padrão: `2024`).

> **💡 Modo Dual Automático:** O sistema já vem com dados de exemplo e funciona imediatamente em modo local via `localStorage`. Assim você pode testar tudo sem precisar configurar banco de dados de início!

---

## 🗄️ Configuração do Supabase (Banco de Dados em Nuvem Gratuito)

Quando quiser salvar todas as confirmações na nuvem do Supabase:

1. Acesse [supabase.com](https://supabase.com) e crie um projeto gratuito.
2. No menu lateral, acesse **SQL Editor**, abra o arquivo `supabase_schema.sql` deste projeto, copie o conteúdo e clique em **Run**. Ele criará a tabela `confirmacoes` e as políticas de segurança.
3. No Supabase, vá em **Project Settings** > **API** e copie:
   - **Project URL**
   - **anon public key**
4. Crie um arquivo `.env.local` na raiz do projeto (baseando-se no `.env.example`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   NEXT_PUBLIC_ADMIN_PIN=2024
   ```
5. Reinicie o servidor (`npm run dev`). Pronto! O painel mostrará a tag **Supabase Conectado**.

---

## ☁️ Deploy Fácil na Vercel (1 Clique)

1. Envie este repositório para o seu GitHub:
   ```bash
   git add .
   git commit -m "feat: site de confirmacao cha revelacao jade ou benicio"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/benicio_jade.git
   git push -u origin main
   ```

2. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
3. Clique em **"Add New..."** > **"Project"** e selecione o repositório `benicio_jade`.
4. Na seção **Environment Variables**, adicione as variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL`: sua URL do Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: sua chave anônima do Supabase
   - `NEXT_PUBLIC_ADMIN_PIN`: `2024` (ou a senha que preferir para o admin)
5. Clique em **Deploy**. Em menos de 1 minuto seu site estará no ar com HTTPS gratuito e velocidade global!
