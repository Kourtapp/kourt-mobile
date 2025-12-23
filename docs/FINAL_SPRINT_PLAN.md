# 🚀 KOURT - PLANO FINAL DE LANÇAMENTO (The Final Sprint)

Este documento detalha o roteiro técnico para transformar o protótipo atual (V5) em um produto de produção pronto para a App Store.

---

## 📅 FASE 1: O "Cérebro" (Backend & Dados Reais)

**Objetivo:** Eliminar todos os mocks e `setTimeout`. O app deve ler e escrever no banco de dados Supabase de verdade.

- [ ] **1.1 Schema do Banco de Dados**
  - [ ] Criar tabelas definitivas: `profiles`, `matches`, `match_players`, `clubs`, `friendships`.
  - [ ] Configurar RLS (Row Level Security) para proteção de dados.
- [ ] **1.2 Auth & Perfil**
  - [ ] Conectar `useUserStore` ao Supabase Auth.
  - [ ] Sincronizar edição de perfil (Bio, Avatar) com a tabela `profiles`.
- [ ] **1.3 Fluxo de Partida Real**
  - [ ] Criar partida -> Salva INSERT em `matches`.
  - [ ] Check-in -> Update UPDATE em `match_players`.
  - [ ] Resultado -> Update UPDATE em `matches` e gatilho para cálculo de XP.
- [ ] **1.4 Ranking Engine (Edge Function)**
  - [ ] Criar função Deno que recalcula o Elo Rating/XP após cada partida.

## ⚡ FASE 2: Real-time & Engajamento

**Objetivo:** Fazer o app parecer "vivo".

- [ ] **2.1 Chat Funcional**
  - [ ] Implementar Supabase Realtime para mensagens instantâneas.
  - [ ] Indicador de "Digitando..." e status de leitura.
- [ ] **2.2 Placar ao Vivo**
  - [ ] WebSocket para transmitir mudaças de placar de um celular para todos os espectadores.
- [ ] **2.3 Notificações Push (Expo Notifications)**
  - [ ] Configurar chaves APNs (Apple) e FCM (Google).
  - [ ] Triggers: "Você foi convidado", "Jogo começa em 1h", "Seu ranking subiu".

## 📊 FASE 3: Gamificação Visual (Stats)

**Objetivo:** Finalizar a promessa visual do Kourt.

- [x] **3.1 Gráfico de Radar** (Implementado no Frontend ✅)
  - [ ] Conectar o gráfico aos dados reais do banco (atualmente está estático).
- [ ] **3.2 Histórico de Partidas**
  - [ ] Listar partidas reais na aba "Partidas" do perfil.
  - [ ] Filtros (Vitórias, Derrotas, Esporte).

## 💰 FASE 4: Monetização (O Business)

**Objetivo:** Processar pagamentos reais.

- [ ] **4.1 Stripe Integration**
  - [ ] Backend: Criar Payment Intent via Edge Function.
  - [ ] Frontend: Integrar `stripe-react-native` na tela de Assinatura.
  - [ ] Webhook: Escutar confirmação de pagamento para liberar o plano PRO.

## 🏁 FASE 5: Polimento & Deploy

**Objetivo:** Qualidade de App Store.

- [ ] **5.1 Performance**
  - [ ] Otimizar imagens (usar formatos next-gen ou Cloudinary/Supabase CDN).
  - [ ] Memoization de componentes pesados de lista.
- [ ] **5.2 Assets**
  - [ ] Gerar ícones de app e Splash Screen finais.
- [ ] **5.3 TestFlight**
  - [ ] Build final via EAS Build.
  - [ ] Submissão para revisão da Apple.

---

**Caminho Crítico (Prioridade Imediata):**

1. Migrar `AutomationService` para chamadas reais do Supabase.
2. Criar Tabelas SQL faltantes.
3. Conectar o Auth de verdade.
