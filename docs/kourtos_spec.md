# KourtOS: Especificação Técnica e de Produto

**Versão:** 1.0
**Autor:** Manus AI

## 1. Visão Geral e Filosofia do Produto

O **KourtOS** (Kourt Operating System) não é apenas um software de agendamento de quadras. É um **sistema operacional de negócios** projetado para transformar donos de quadras em empresários de sucesso. A filosofia central é capacitar o host com ferramentas poderosas de gestão, automação, finanças e inteligência de negócios, permitindo que ele se concentre no crescimento estratégico, e não apenas na operação diária.

**Inspiração:**
- **HubSpot:** Fornecer um CRM poderoso e gratuito como motor de aquisição.
- **Stripe:** Simplificar e automatizar toda a complexidade financeira.
- **Shopify:** Oferecer uma plataforma robusta que cresce com o cliente, do pequeno ao gigante.
- **Salesforce:** Entregar dashboards e relatórios que transformam dados em decisões inteligentes.

### 1.1. Modelo Freemium (Não Pay-to-Win)

O sucesso da plataforma depende de um modelo freemium que seja genuinamente útil. A distinção entre os planos não se baseia em bloquear funcionalidades essenciais, mas em oferecer escala, automação e inteligência para negócios mais maduros.

- **Plano Gratuito (Starter):** Oferece todas as ferramentas essenciais para operar e gerenciar um negócio de quadras de forma eficiente. O limite é o volume e a automação, não a funcionalidade.
- **Plano Premium (Professional):** Oferece ferramentas para escalar, otimizar a receita, automatizar processos e obter insights de negócios mais profundos. É para o host que já validou seu negócio e agora quer profissionalizá-lo e expandi-lo.

---

## 2. Arquitetura de Módulos

O KourtOS é organizado em módulos integrados que formam um ecossistema completo de gestão.

### Módulos Principais:

1.  **Centro de Comando (Dashboard):** Visão 360º do negócio em tempo real.
2.  **Agenda Inteligente (Calendar):** O coração operacional para gestão de reservas.
3.  **CRM de Clientes (Contacts):** Ferramenta para transformar clientes em fãs.
4.  **Hub Financeiro (Finance):** O centro de controle para toda a receita e pagamentos.
5.  **Motor de Marketing (Marketing):** Ferramentas para atrair e reter clientes.
6.  **Central de Análise (Analytics):** Inteligência de negócios para tomada de decisão.
7.  **Gestão de Operações (Operations):** Configurações do negócio e das quadras.
8.  **Marketplace e App do Jogador:** A ponta do ecossistema que gera a demanda.

---


## 3. Detalhamento dos Módulos e Funcionalidades

### 3.1. Módulo 1: Centro de Comando (Dashboard)

O dashboard é a primeira tela que o host vê. Ele deve fornecer uma visão instantânea e acionável da saúde do negócio.

| Funcionalidade | Plano Gratuito (Starter) | Plano Premium (Professional) |
| :--- | :--- | :--- |
| **Métricas do Dia** | ✅ Visão geral de hoje: Reservas, Faturamento, Ocupação. | ✅ Tudo do gratuito. |
| **Próximas Reservas** | ✅ Lista das próximas 5 reservas do dia. | ✅ Lista completa e rolável de todas as reservas do dia. |
| **Gráfico de Ocupação** | ✅ Gráfico de barras simples da ocupação da semana atual. | ✅ Gráfico comparativo: semana atual vs. semana anterior vs. mesma semana do ano anterior. |
| **Gráfico de Faturamento** | ✅ Gráfico de linha simples do faturamento dos últimos 7 dias. | ✅ Gráfico com filtros: últimos 7, 30, 90 dias, e comparação com períodos anteriores. |
| **Feed de Atividades Recentes** | ✅ Últimas 10 atividades (nova reserva, cancelamento, novo cliente). | ✅ Feed completo e filtrável de todas as atividades. |
| **Ações Rápidas** | ✅ Botões para "Nova Reserva" e "Bloquear Horário". | ✅ Botões personalizáveis para as ações mais usadas pelo host. |
| **Metas e Desempenho** | ❌ | ✅ **(Diferencial Premium)** Widget para definir e acompanhar metas mensais (ex: Faturamento, Nº de Clientes Novos) com barra de progresso. |
| **Insights Acionáveis (IA)** | ❌ | ✅ **(Diferencial Premium)** Cards com insights gerados por IA: "*Sua taxa de ocupação às terças à noite está 20% abaixo da média. Considere criar uma promoção.*" ou "*Você tem 15 clientes que não agendam há mais de 60 dias. Que tal enviar um cupom de reativação?*" |

### 3.2. Módulo 2: Agenda Inteligente (Calendar)

Onde a gestão do dia a dia acontece. Deve ser visual, rápida e intuitiva.

| Funcionalidade | Plano Gratuito (Starter) | Plano Premium (Professional) |
| :--- | :--- | :--- |
| **Visualização da Agenda** | ✅ Visão por Dia e Semana. | ✅ Visão por Dia, Semana, **Mês** e **Lista**. |
| **Filtros de Visualização** | ✅ Filtrar por quadra. | ✅ Filtrar por quadra, esporte, status do pagamento, tipo de reserva (avulsa, pacote, etc). |
| **Criação de Reserva Manual** | ✅ Adicionar reserva com dados do cliente, quadra, horário e valor. | ✅ Tudo do gratuito + **sugestão de preço inteligente** com base na demanda histórica para aquele horário. |
| **Bloqueio de Horários** | ✅ Bloquear horários manualmente para manutenção ou eventos. | ✅ **Bloqueios recorrentes** (ex: toda segunda-feira das 12h às 13h para limpeza). |
| **Gestão de Reservas** | ✅ Visualizar detalhes, confirmar pagamento, cancelar reserva. | ✅ **Check-in de jogadores**, **reagendamento com 1 clique**, e histórico de alterações da reserva. |
| **Cores e Status** | ✅ Cores básicas para status (Confirmado, Pendente, Cancelado). | ✅ **Cores personalizáveis** e legendas para identificar rapidamente tipos de reserva (ex: azul para aulas, verde para mensalistas). |
| **Integração com Google Calendar** | ❌ | ✅ Sincronização bidirecional da agenda de reservas com o Google Calendar do host. |

### 3.3. Módulo 3: CRM de Clientes (Contacts)

Inspirado no HubSpot. O objetivo é transformar uma lista de nomes em um ativo valioso para o negócio.

| Funcionalidade | Plano Gratuito (Starter) | Plano Premium (Professional) |
| :--- | :--- | :--- |
| **Lista de Clientes** | ✅ Lista com todos os clientes, com busca por nome, email ou telefone. | ✅ Lista com filtros avançados (ex: clientes que mais gastam, clientes inativos, por esporte preferido). |
| **Perfil do Cliente** | ✅ Informações de contato, histórico completo de reservas e pagamentos. | ✅ Tudo do gratuito + **estatísticas do cliente** (gasto total, frequência, data da última reserva) e **notas internas** para registrar informações importantes. |
| **Criação de Cliente Manual** | ✅ Adicionar novos clientes que chegam presencialmente. | ✅ Tudo do gratuito. |
| **Grupos e Tags** | ✅ Criar até 5 tags para segmentação básica (ex: "VIP", "Iniciante"). | ✅ **Tags ilimitadas** e criação de **grupos/listas inteligentes** (ex: lista dinâmica de todos os jogadores de Beach Tennis que não agendam há 30 dias). |
| **Comunicação** | ❌ | ✅ Envio de **emails em massa** para listas segmentadas (ex: enviar um email promocional para a lista de "inativos"). Requer integração com SendGrid. |
| **Análise de Coorte** | ❌ | ✅ **(Diferencial Premium)** Análise que mostra a retenção de clientes ao longo do tempo. (Ex: Dos clientes que se cadastraram em Janeiro, quantos % continuam agendando 3, 6, 9 meses depois?). |

---


### 3.4. Módulo 4: Hub Financeiro (Finance)

Inspirado no Stripe. O objetivo é dar ao host clareza e controle total sobre seu dinheiro, desde a transação até a contabilidade.

| Funcionalidade | Plano Gratuito (Starter) | Plano Premium (Professional) |
| :--- | :--- | :--- |
| **Visão Geral Financeira** | ✅ Saldo disponível, saldo a receber, e valor do próximo saque. | ✅ Tudo do gratuito + gráficos de fluxo de caixa (entradas vs. saídas) e projeção de receita para os próximos 30 dias. |
| **Lista de Transações** | ✅ Histórico de todas as transações (reservas, pagamentos, taxas). | ✅ Histórico com filtros avançados (por cliente, por quadra, por forma de pagamento) e busca por data. |
| **Gestão de Saques** | ✅ Solicitar saque do saldo disponível para a conta bancária. | ✅ **Saques automáticos** (diários, semanais ou mensais) e histórico completo de todos os saques realizados. |
| **Relatórios Financeiros** | ✅ Relatório simples de faturamento mensal. | ✅ **(Diferencial Premium)** Relatórios completos: **DRE Simplificado** (Demonstrativo de Resultado), relatório de taxas pagas, e extratos para conciliação bancária. |
| **Exportação de Dados** | ❌ | ✅ Exportar qualquer relatório financeiro para CSV ou PDF, facilitando a vida do contador. |
| **Integração Contábil** | ❌ | ✅ Integração direta com softwares de contabilidade populares (ex: QuickBooks, Conta Azul) para sincronização automática de dados. |

### 3.5. Módulo 5: Motor de Marketing (Marketing)

Ferramentas para ajudar o host a crescer ativamente seu negócio, não apenas esperar por reservas.

| Funcionalidade | Plano Gratuito (Starter) | Plano Premium (Professional) |
| :--- | :--- | :--- |
| **Perfil no Marketplace Kourt** | ✅ Página pública com fotos, descrição, preços e horários para receber reservas. | ✅ Perfil com destaque na busca, mais fotos, e selo "Host Verificado". |
| **Cupons de Desconto** | ✅ Criar cupons de valor fixo (R$ 10 de desconto) ou percentual (15% off) com data de validade. | ✅ Cupons avançados: uso único por cliente, para clientes específicos, ou aplicáveis apenas em horários de baixa demanda. |
| **Pacotes de Horas** | ❌ | ✅ **(Diferencial Premium)** Vender pacotes de horas com desconto (ex: "Compre 10 horas e pague 8") para aumentar o fluxo de caixa e a fidelidade. |
| **Planos de Mensalistas** | ❌ | ✅ **(Diferencial Premium)** Criar planos de assinatura recorrentes para clientes fixos (ex: "Plano Semanal - Toda terça às 19h" com cobrança automática mensal). |
| **Widget de Agendamento** | ❌ | ✅ Incorporar um widget da agenda KourtOS diretamente no site ou redes sociais do host, permitindo reservas sem sair do ambiente dele. |
| **Automações de Marketing (Workflows)** | ❌ | ✅ **(Diferencial Premium)** Criar fluxos de automação. Exemplos: "*Se um cliente não agenda há 60 dias, enviar automaticamente um cupom de 20% de desconto.*" ou "*No aniversário do cliente, enviar um voucher de 1 hora grátis.*" |

### 3.6. Módulo 6: Central de Análise (Analytics)

Transforma dados brutos em insights estratégicos para o crescimento do negócio.

| Funcionalidade | Plano Gratuito (Starter) | Plano Premium (Professional) |
| :--- | :--- | :--- |
| **Relatório de Receita** | ✅ Relatório básico de receita por período. | ✅ Relatório detalhado de receita por quadra, por esporte, e por tipo de cliente (novo vs. recorrente). |
| **Relatório de Ocupação** | ✅ Relatório básico de taxa de ocupação geral. | ✅ **Mapa de Calor de Ocupação**: visualização gráfica dos dias e horários mais e menos movimentados para otimização de preços. |
| **Relatório de Clientes** | ✅ Número total de clientes e número de novos clientes no mês. | ✅ Relatórios de **LTV (Lifetime Value)** do cliente, frequência de agendamento e análise de retenção (Coorte). |
| **Comparação de Períodos** | ❌ | ✅ Comparar o desempenho de qualquer métrica (receita, ocupação) com o mês anterior ou o mesmo período do ano anterior. |
| **Exportação de Relatórios** | ❌ | ✅ Exportar todos os relatórios para PDF ou CSV. |

### 3.7. Módulo 7: Gestão de Operações (Operations)

As engrenagens do sistema. Onde o host configura seu negócio.

| Funcionalidade | Plano Gratuito (Starter) | Plano Premium (Professional) |
| :--- | :--- | :--- |
| **Gestão de Quadras** | ✅ Cadastrar até 2 quadras com fotos, esportes e descrição. | ✅ Cadastrar **quadras ilimitadas**. |
| **Configuração de Preços** | ✅ Preço fixo por hora. | ✅ **Precificação dinâmica**: configurar preços diferentes para dias de semana vs. fins de semana, e para horários de pico vs. horários de baixa demanda. |
| **Horários de Funcionamento** | ✅ Definir horário de abertura e fechamento padrão para todos os dias. | ✅ Definir horários diferentes para cada dia da semana e configurar intervalos (ex: para almoço ou limpeza). |
| **Gestão de Equipe** | ❌ | ✅ **(Diferencial Premium)** Adicionar múltiplos usuários (funcionários) com diferentes níveis de permissão (ex: Recepcionista só vê a agenda; Gerente vê finanças e relatórios). |
| **API e Integrações** | ❌ | ✅ Acesso à API para integrações customizadas e webhooks para notificar outros sistemas sobre eventos (ex: nova reserva). |

---


## 4. Fluxos de Usuário (User Flows) e Detalhamento de Telas

Esta seção descreve a jornada do usuário passo a passo através das principais tarefas do KourtOS. Para cada tela, são especificados os componentes e a lógica de negócios.

### 4.1. Fluxo de Onboarding: A Jornada do Herói

**Objetivo:** Levar um novo host do desconhecimento total à sua primeira reserva o mais rápido possível. A experiência deve ser fluida, guiada e gratificante.

**Inspiração:** Stripe, Shopify.

**Estrutura:** Um wizard (assistente) passo a passo com uma barra de progresso clara.

`CRIAR CONTA → DADOS DO NEGÓCIO → CONFIGURAR QUADRA → DEFINIR PREÇOS → HORÁRIOS → PAGAMENTOS → PUBLICAR`

--- 

**Tela 1: Criar Conta**
- **Componentes:**
  - Título: "Transforme sua quadra em um negócio de sucesso."
  - Input: Nome Completo
  - Input: Email
  - Input: Senha (com requisitos de segurança)
  - Divisor: "ou"
  - Botão: "Continuar com Google"
  - Botão: "Continuar com Apple"
  - Checkbox: "Eu aceito os [Termos de Serviço](link) e a [Política de Privacidade](link)."
  - Botão Principal (desabilitado até o aceite): "Criar minha conta gratuitamente"
- **Lógica:**
  - Validação de email em tempo real.
  - Autenticação social (Google/Apple) para reduzir o atrito.

---

**Tela 2: Boas-vindas e Dados do Negócio**
- **Componentes:**
  - Título: "Bem-vindo(a), [Nome do Host]! Vamos configurar seu espaço."
  - Input: Nome do Estabelecimento (ex: Arena BTG, Quadra do Zé)
  - Input: URL Personalizada (kourt.app/[sua-url]) - com verificação de disponibilidade em tempo real.
  - Input: Telefone/WhatsApp para contato.
  - Input: Endereço (com autocomplete do Google Maps).
- **Lógica:**
  - A URL personalizada é um grande diferencial, dando ao host um senso de propriedade desde o início.

---

**Tela 3: Sua Primeira Quadra**
- **Componentes:**
  - Título: "Adicione sua primeira quadra"
  - Input: Nome da Quadra (ex: Quadra 1 - Coberta, Quadra de Areia Principal)
  - Seleção de Esportes (Multi-select chips): Beach Tennis, Padel, Tênis, Futevôlei, Vôlei, etc.
  - Upload de Fotos: Drag-and-drop com espaço para até 5 fotos. Dica: "Fotos de alta qualidade atraem 80% mais reservas."
  - Input (Textarea): Descrição da quadra.
  - Seleção de Comodidades (Multi-select chips): Estacionamento, Vestiário, Wi-Fi, Lanchonete, Churrasqueira.
- **Lógica:**
  - Exigir no mínimo 1 foto para garantir a qualidade dos perfis no marketplace.

---

**Tela 4: Definição de Preços**
- **Componentes:**
  - Título: "Quanto custa reservar sua quadra?"
  - **Modo Simples (Padrão):**
    - Input: Preço Padrão por Hora (ex: R$ 100,00)
  - **Modo Avançado (Opcional - link "Usar precificação dinâmica?"):**
    - Input: Preço para Dias de Semana.
    - Input: Preço para Fins de Semana.
    - Toggle: "Ativar preço de horário de pico?"
      - Se ativado: Inputs para definir o horário de pico (ex: 18h às 22h) e o valor para esse período.
- **Lógica:**
  - O Modo Simples remove a complexidade para novos usuários. O Modo Avançado é um upsell implícito para o plano Premium, mas pode ser oferecido de forma limitada no gratuito.

---

**Tela 5: Horários de Funcionamento**
- **Componentes:**
  - Título: "Quando sua quadra está aberta para reservas?"
  - Tabela com os dias da semana (Seg-Dom).
  - Para cada dia: Toggle (Aberto/Fechado) e Inputs de Horário (ex: das 08:00 às 22:00).
  - Botão: "Copiar horário para todos os dias".
- **Lógica:**
  - Simples e visual. A funcionalidade de copiar agiliza o processo.

---

**Tela 6: Configuração de Pagamentos**
- **Componentes:**
  - Título: "Receba seus pagamentos de forma automática e segura."
  - Explicação: "Usamos a Stripe, a plataforma de pagamentos mais confiável do mundo, para processar as reservas e transferir o dinheiro para você."
  - Botão: "Conectar com a Stripe"
- **Lógica:**
  - O fluxo de conexão com a Stripe é feito via OAuth, redirecionando o usuário para a Stripe para criar ou conectar sua conta de forma segura, e depois retornando ao KourtOS. Isso abstrai toda a complexidade de coletar dados bancários.

---

**Tela 7: Revisão e Publicação**
- **Componentes:**
  - Título: "Tudo pronto! Seu espaço está incrível."
  - Preview do Perfil: Um card mostrando como a quadra aparecerá no marketplace Kourt.
  - Checklist de Configuração: Itens configurados (Perfil, Quadra, Preços, Horários, Pagamentos) com um ✔️ verde.
  - Botão Principal: "Publicar e Começar a Receber Reservas"
- **Lógica:**
  - Esta tela serve como uma recompensa visual, mostrando ao host o resultado do seu trabalho e dando-lhe a confiança para ir ao ar.

---
### 4.2. Fluxo Principal: Dashboard → Agenda → Gestão de Reservas

**Objetivo:** Permitir que o host gerencie seu dia a dia de forma eficiente, visualizando tudo o que precisa em uma visão integrada.

**Estrutura:**

`DASHBOARD → AGENDA (Dia/Semana/Mês) → DETALHES DA RESERVA → AÇÕES (Confirmar, Cancelar, Reagendar)`

---

**Tela: Dashboard (Centro de Comando)**

O dashboard é a primeira tela após o login. Ele deve fornecer uma visão instantânea e acionável do negócio.

- **Seção Superior: Métricas do Dia (KPIs)**
  - Quatro cards em linha mostrando: Reservas de Hoje, Faturamento de Hoje, Taxa de Ocupação de Hoje, Reservas Pendentes de Confirmação.
  - Cada card é clicável e leva a um detalhamento (ex: clicar em "Reservas Pendentes" mostra a lista de reservas que precisam de confirmação).

- **Seção do Meio: Próximas Reservas e Gráfico de Ocupação**
  - Lado esquerdo: Lista das próximas 5 reservas do dia, com horário, cliente, quadra e status.
  - Lado direito: Gráfico de barras mostrando a ocupação de cada dia da semana.

- **Seção Inferior: Feed de Atividades e Ações Rápidas**
  - Feed mostrando as últimas atividades (nova reserva, cancelamento, novo cliente).
  - Botões de ação rápida: "Nova Reserva", "Bloquear Horário", "Enviar Mensagem".

- **Diferencial Premium:**
  - Widget de Metas: Mostra a meta de faturamento mensal e a barra de progresso.
  - Insights de IA: Cards com sugestões (ex: "Sua taxa de ocupação às terças está baixa. Considere criar uma promoção.").

---

**Tela: Agenda (Calendar)**

A agenda é o coração operacional. Deve ser visual, rápida e intuitiva.

- **Cabeçalho:**
  - Navegação de períodos: Botões "Anterior" e "Próximo" com o período atual exibido (ex: "Semana de 10 a 16 de Dezembro").
  - Abas para alternar entre Dia, Semana, Mês e Lista.
  - Filtros: Dropdown para selecionar a quadra, e (Premium) filtros avançados para status, esporte, etc.

- **Visualização por Semana (Padrão):**
  - Grade com os dias da semana (Seg-Dom) nas colunas e os horários nas linhas.
  - Cada reserva é um bloco visual com a cor da quadra, nome do cliente, e status (Confirmado, Pendente, Cancelado).
  - Blocos vazios indicam horários disponíveis.
  - Clique em um bloco de reserva para ver detalhes.
  - Clique em um espaço vazio para criar uma nova reserva manual.

- **Visualização por Mês (Premium):**
  - Calendário tradicional com cada dia mostrando o número de reservas e a taxa de ocupação.
  - Cores indicam o nível de ocupação (verde para alto, amarelo para médio, vermelho para baixo).

- **Ações Rápidas na Agenda:**
  - Drag-and-drop de reservas para reagendar.
  - Clique direito (ou menu de contexto) para cancelar, confirmar ou editar uma reserva.

---

**Tela: Detalhes da Reserva (Modal/Drawer)**

Quando o host clica em uma reserva, um drawer lateral abre mostrando todos os detalhes.

- **Informações da Reserva:**
  - Horário, Quadra, Esporte, Cliente, Valor.
  - Status: Confirmado, Pendente de Pagamento, Cancelado.

- **Informações do Cliente:**
  - Nome, Telefone, Email, Número de Reservas Anteriores.
  - Link para o perfil completo do cliente no CRM.

- **Ações Disponíveis:**
  - Botão: "Confirmar Pagamento" (se pendente).
  - Botão: "Enviar Lembrete" (envia SMS/email para o cliente).
  - Botão: "Reagendar" (abre um seletor de data/hora).
  - Botão: "Cancelar Reserva" (com confirmação).
  - Botão: "Check-in" (Premium - marca o cliente como presente).

- **Histórico:**
  - Timeline mostrando todas as alterações da reserva (criação, confirmação, cancelamento, etc.).

---

**Tela: Criar Reserva Manual**

Quando o host clica em um espaço vazio na agenda ou no botão "Nova Reserva".

- **Seleção de Cliente:**
  - Busca por nome/email/telefone na base de clientes.
  - Se não encontrado, opção para criar um novo cliente.

- **Seleção de Quadra e Horário:**
  - Dropdown para quadra.
  - Seletor de data e horário.

- **Preço:**
  - Campo de preço pré-preenchido com o valor padrão da quadra.
  - (Premium) Sugestão de preço inteligente com base na demanda histórica.

- **Forma de Pagamento:**
  - Dropdown: Pix, Cartão (online), Dinheiro (presencial).

- **Botão:** "Criar Reserva".

---
### 4.3. Fluxo de CRM: Transformando Clientes em Fãs

**Objetivo:** Permitir que o host entenda seus clientes e crie relacionamentos duradouros.

**Estrutura:**

`LISTA DE CLIENTES → PERFIL DO CLIENTE → HISTÓRICO DE RESERVAS → COMUNICAÇÃO`

---

**Tela: Lista de Clientes**

Uma visão geral de todos os clientes do host.

- **Busca e Filtros:**
  - Barra de busca por nome, email ou telefone.
  - (Premium) Filtros avançados: clientes que mais gastam, clientes inativos (sem reservas há 30+ dias), por esporte preferido, etc.

- **Tabela de Clientes:**
  - Colunas: Nome, Email, Telefone, Nº de Reservas, Gasto Total, Última Reserva.
  - Ordenação por qualquer coluna.
  - Tags visuais: "VIP", "Inativo", "Novo".

- **Ações:**
  - Clique em um cliente para abrir seu perfil.
  - Botão "Enviar Mensagem" (Premium).
  - Botão "Adicionar Tag".

---

**Tela: Perfil do Cliente**

Visão completa de um cliente específico.

- **Informações Pessoais:**
  - Nome, Email, Telefone, Data de Cadastro.

- **Estatísticas (Premium):**
  - Gasto Total, Número de Reservas, Frequência (ex: "A cada 7 dias"), Última Reserva, Esporte Preferido.

- **Histórico de Reservas:**
  - Lista de todas as reservas do cliente com datas, horários, valores e status.

- **Notas Internas (Premium):**
  - Campo de texto para o host anotar informações importantes (ex: "Cliente prefere quadra coberta", "Aniversário em 15 de março").

- **Ações:**
  - Botão: "Enviar Cupom" (Premium).
  - Botão: "Enviar Mensagem" (Premium).
  - Botão: "Adicionar à Lista de Reativação" (Premium).

---

### 4.4. Fluxo Financeiro: Clareza e Controle Total

**Objetivo:** Dar ao host clareza sobre seu fluxo de caixa e permitir que ele tome decisões financeiras inteligentes.

**Estrutura:**

`HUB FINANCEIRO → TRANSAÇÕES → RELATÓRIOS → SAQUES`

---

**Tela: Hub Financeiro (Finance Dashboard)**

A visão geral das finanças do negócio.

- **Saldo Disponível:**
  - Card grande mostrando o saldo que o host pode sacar.
  - Botão "Sacar Agora".

- **Resumo Financeiro:**
  - Cards mostrando: Faturamento do Mês (até hoje), Faturamento do Mês Anterior, Taxa de Crescimento (%).
  - (Premium) Gráfico de fluxo de caixa (entradas vs. saídas) e projeção de receita para os próximos 30 dias.

- **Últimas Transações:**
  - Lista das últimas 10 transações com data, descrição, valor e status.

---

**Tela: Histórico de Transações**

Uma visão detalhada de todas as transações.

- **Filtros:**
  - Por data, por cliente, por quadra, por forma de pagamento.

- **Tabela:**
  - Colunas: Data, Descrição, Valor, Status, Ação (ex: "Reembolsar").

- **Exportação:**
  - (Premium) Botão para exportar para CSV ou PDF.

---

**Tela: Relatórios Financeiros (Premium)**

Relatórios detalhados para análise e contabilidade.

- **Relatório de Faturamento:**
  - Faturamento por período (dia, semana, mês).
  - Faturamento por quadra.
  - Faturamento por esporte.

- **Relatório de Taxas:**
  - Quanto o host pagou em taxas da plataforma, de Stripe, etc.

- **DRE Simplificado (Demonstrativo de Resultado):**
  - Receita Bruta, Menos Taxas, Receita Líquida.

- **Exportação:**
  - Botão para exportar qualquer relatório para PDF ou CSV.

---

### 4.5. Fluxo de Marketing: Crescimento Ativo

**Objetivo:** Fornecer ferramentas para o host atrair e reter clientes de forma ativa.

**Estrutura:**

`MARKETING HUB → CUPONS → PACOTES → AUTOMAÇÕES (Premium)`

---

**Tela: Marketing Hub**

Visão geral de todas as ferramentas de marketing.

- **Cards de Funcionalidades:**
  - Card: "Cupons de Desconto" - Criar e gerenciar cupons.
  - Card: "Pacotes de Horas" (Premium) - Vender pacotes com desconto.
  - Card: "Planos de Mensalistas" (Premium) - Criar assinaturas recorrentes.
  - Card: "Automações" (Premium) - Criar fluxos de automação.

---

**Tela: Criar Cupom**

Simples e rápido.

- **Tipo de Cupom:**
  - Radio buttons: "Valor Fixo" ou "Percentual".

- **Valor:**
  - Input: Valor do desconto (ex: R$ 10 ou 15%).

- **Validade:**
  - Seletor de data: "Válido até...".

- **Limite de Uso:**
  - Input: Número máximo de vezes que o cupom pode ser usado.

- **Botão:** "Criar Cupom".

- **Resultado:**
  - Código do cupom (ex: KOURT2024) e link para compartilhar.

---

**Tela: Pacotes de Horas (Premium)**

Vender horas com desconto para aumentar o fluxo de caixa.

- **Nome do Pacote:**
  - Input: Ex: "Pacote 10 Horas".

- **Quantidade de Horas:**
  - Input: 10.

- **Preço por Hora (Normal):**
  - Input: R$ 100 (pré-preenchido com o preço padrão da quadra).

- **Preço do Pacote:**
  - Input: R$ 800 (pré-calculado com 20% de desconto, mas editável).

- **Validade:**
  - Input: Quantos dias o cliente tem para usar as horas (ex: 90 dias).

- **Botão:** "Criar Pacote".

---

**Tela: Planos de Mensalistas (Premium)**

Criar assinaturas recorrentes para clientes fixos.

- **Nome do Plano:**
  - Input: Ex: "Plano Semanal - Terça às 19h".

- **Frequência:**
  - Dropdown: Semanal, Bi-semanal, Mensal.

- **Dia e Horário:**
  - Seletor de dia da semana e horário.

- **Quadra:**
  - Dropdown: Qual quadra.

- **Preço Mensal:**
  - Input: Ex: R$ 400 (4 semanas × R$ 100).

- **Botão:** "Criar Plano".

---

**Tela: Automações (Premium)**

Criar fluxos de automação para marketing.

- **Tipo de Automação:**
  - Dropdown: "Se cliente não agenda há X dias, enviar cupom", "No aniversário do cliente, enviar voucher", "Se cliente cancela, enviar pesquisa de feedback", etc.

- **Configuração:**
  - Inputs específicos para cada tipo de automação.
  - Ex: "Se cliente não agenda há [30] dias, enviar [cupom de 20%] via [Email/SMS]".

- **Botão:** "Criar Automação".

---
### 4.6. Fluxo de Analytics: Inteligência de Negócios

**Objetivo:** Transformar dados em insights acionáveis para o crescimento estratégico.

**Estrutura:**

`ANALYTICS HUB → RELATÓRIOS → COMPARAÇÕES → EXPORTAÇÃO`

---

**Tela: Analytics Hub**

Visão geral de todos os relatórios disponíveis.

- **Cards de Relatórios:**
  - Card: "Receita" - Faturamento por período.
  - Card: "Ocupação" - Taxa de ocupação e padrões de demanda.
  - Card: "Clientes" - Novos clientes, retenção, LTV.
  - Card: "Comparações" (Premium) - Comparar períodos.

---

**Tela: Relatório de Receita**

Análise detalhada da receita.

- **Período:**
  - Seletor: Últimos 7 dias, 30 dias, 90 dias, ou intervalo customizado.

- **Gráfico:**
  - Gráfico de linha mostrando a receita diária.

- **Tabela:**
  - Receita por quadra, por esporte, por tipo de cliente (novo vs. recorrente).

- **Métricas:**
  - Receita Total, Receita Média por Dia, Receita Máxima, Receita Mínima.

- **Exportação:**
  - (Premium) Botão para exportar para CSV ou PDF.

---

**Tela: Relatório de Ocupação**

Análise da ocupação das quadras.

- **Mapa de Calor (Premium):**
  - Visualização gráfica dos dias e horários mais e menos movimentados.
  - Cores: Verde para alto, amarelo para médio, vermelho para baixo.

- **Tabela:**
  - Taxa de ocupação por dia da semana, por horário, por quadra.

- **Insights:**
  - Horários com maior demanda, horários com menor demanda.
  - Recomendação: "Seus horários de pico são terça a sexta, 18h-22h. Considere aumentar o preço nesse período."

---

**Tela: Relatório de Clientes**

Análise da base de clientes.

- **Métricas:**
  - Número total de clientes, novos clientes este mês, clientes inativos.
  - Taxa de retenção (% de clientes que voltam a agendar no mês seguinte).

- **Análise de Coorte (Premium):**
  - Tabela mostrando a retenção de clientes ao longo do tempo.
  - Ex: Dos clientes que se cadastraram em Janeiro, quantos % continuam agendando em Fevereiro, Março, etc.

- **LTV (Lifetime Value) (Premium):**
  - Valor médio que um cliente gasta ao longo de sua vida útil.

---

### 4.7. Fluxo de Operações: Configuração e Controle

**Objetivo:** Permitir que o host configure todos os aspectos do seu negócio.

**Estrutura:**

`OPERAÇÕES → QUADRAS → PREÇOS → HORÁRIOS → EQUIPE (Premium) → INTEGRAÇÕES (Premium)`

---

**Tela: Gestão de Quadras**

Adicionar, editar e gerenciar as quadras.

- **Lista de Quadras:**
  - Cada quadra mostrando: Nome, Esportes, Número de Fotos, Status (Ativa/Inativa).

- **Botão:** "Adicionar Nova Quadra".

- **Ações por Quadra:**
  - Editar, Duplicar, Desativar, Deletar.

---

**Tela: Editar Quadra**

Formulário para editar os detalhes de uma quadra.

- **Nome, Esportes, Fotos, Descrição, Comodidades.**

- **Botão:** "Salvar Alterações".

---

**Tela: Configuração de Preços**

Definir a estratégia de preços.

- **Modo Simples:**
  - Input: Preço Padrão por Hora.

- **Modo Avançado (Premium):**
  - Inputs para preços diferentes por dia da semana, fim de semana, e horários de pico.

---

**Tela: Horários de Funcionamento**

Definir quando a quadra está aberta.

- **Tabela:**
  - Dias da semana com inputs de horário de abertura e fechamento.

- **Botão:** "Copiar para todos os dias".

---

**Tela: Gestão de Equipe (Premium)**

Adicionar usuários e definir permissões.

- **Lista de Usuários:**
  - Nome, Email, Função, Data de Adição.

- **Botão:** "Adicionar Usuário".

- **Ações:**
  - Editar permissões, Remover usuário.

---

**Tela: Integrações (Premium)**

Conectar com serviços externos.

- **Integrações Disponíveis:**
  - Google Calendar, Conta Azul, QuickBooks, SendGrid, Twilio.

- **Para Cada Integração:**
  - Botão "Conectar" que abre um fluxo de autenticação (OAuth).

---

## 5. Componentes Reutilizáveis (Design System)

Para garantir consistência e acelerar o desenvolvimento, o KourtOS usa um design system robusto.

### Componentes Principais:

- **Card:** Container básico com sombra e padding.
- **Button:** Primário (azul), Secundário (cinza), Perigo (vermelho).
- **Input:** Text, Email, Telefone, Data, Hora, Número.
- **Dropdown/Select:** Para seleção de opções.
- **Toggle:** Para ativar/desativar funcionalidades.
- **Modal/Drawer:** Para fluxos secundários.
- **Tabela:** Com ordenação, filtros e paginação.
- **Gráfico:** Linha, Barra, Pizza (usando Recharts ou Chart.js).
- **Notificação/Toast:** Para feedback do usuário.
- **Badge:** Para status e tags.

---

## 6. Stack Tecnológico Recomendado

Para implementar o KourtOS em React Native, recomenda-se:

- **Frontend:** React Native com Expo ou React Native CLI.
- **UI Library:** React Native Paper ou NativeBase para componentes nativos.
- **State Management:** Zustand ou Redux Toolkit.
- **API Client:** Axios ou React Query.
- **Backend:** Node.js com Express ou Fastify.
- **Database:** PostgreSQL com Prisma ORM.
- **Autenticação:** JWT com refresh tokens.
- **Pagamentos:** Stripe Connect API.
- **Notificações:** Firebase Cloud Messaging (FCM).
- **Analytics:** Mixpanel ou Amplitude.

---

## 7. Modelo de Dados Simplificado

```
User (Host)
├─ id, email, password, name, phone
├─ subscription_plan (Starter, Professional, Enterprise)
├─ stripe_account_id
└─ created_at, updated_at

Court (Quadra)
├─ id, user_id, name, sports[], amenities[]
├─ photos[], description
└─ created_at, updated_at

Booking (Reserva)
├─ id, court_id, customer_id, datetime_start, datetime_end
├─ price, payment_status, payment_method
├─ status (Confirmed, Pending, Cancelled)
└─ created_at, updated_at

Customer (Cliente)
├─ id, user_id, name, email, phone
├─ total_spent, total_bookings, last_booking_date
├─ tags[], notes
└─ created_at, updated_at

Transaction (Transação)
├─ id, user_id, booking_id, amount
├─ kourt_fee, stripe_fee, net_amount
├─ status (Completed, Pending, Failed)
└─ created_at, updated_at

Coupon (Cupom)
├─ id, user_id, code, discount_type, discount_value
├─ valid_until, max_uses, current_uses
└─ created_at, updated_at

Automation (Automação - Premium)
├─ id, user_id, trigger_type, action_type
├─ configuration (JSON)
├─ enabled
└─ created_at, updated_at
```

---

## 8. Conclusão e Próximos Passos

O KourtOS é um SaaS completo, robusto e escalável, projetado para transformar donos de quadras em empresários de sucesso. A filosofia de "não pay-to-win" garante que até mesmo os usuários do plano gratuito possam operar seus negócios de forma eficiente, enquanto o plano Premium oferece ferramentas de escala e inteligência para negócios mais maduros.

**Próximas fases de implementação:**

1. **Fase 1 (MVP):** Onboarding, Dashboard, Agenda, CRM básico, Hub Financeiro.
2. **Fase 2:** Marketing Hub, Analytics, Operações.
3. **Fase 3:** Automações, Integrações, Relatórios Avançados.
4. **Fase 4:** Marketplace do Jogador (aplicativo para os clientes).
5. **Fase 5:** IA e Insights Avançados.

---

**Fim da Especificação Técnica do KourtOS v1.0**
