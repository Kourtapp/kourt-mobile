# KourtOS: Tipos de Quadras e Modelos de Acesso - Versão Atualizada

**Versão:** 2.0 (Atualizado)
**Autor:** Manus AI

## 1. Visão Geral: Três Modelos de Quadras

O KourtOS agora suporta três modelos distintos de quadras, cada um com sua própria lógica de negócios, modelo de acesso e funcionalidades. Esta segmentação é crucial para capturar o mercado completo de esportes de quadra no Brasil.

| Tipo de Quadra | Proprietário | Modelo de Acesso | Modelo de Pagamento | Plano Mínimo | Exemplo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Privada Paga** | Pessoa Física | Público (com pagamento) | Cobrança por reserva | Starter (Gratuito) | Casa, Sítio, Chácara, Pousada |
| **Condomínio** | Condomínio/Síndico | Restrito (convite/link) | Sem pagamento | Starter (Gratuito) | Quadra de condomínio residencial |
| **Arena/Clube** | Empresa | Público (com pagamento) | Cobrança por reserva | Professional (R$ 199/mês) | Centro esportivo, Clube, Arena |

---

## 2. Modelo 1: Quadra Privada Paga

### 2.1. O que é?

Uma quadra particular (em casa, sítio, chácara, pousada, etc.) que o proprietário quer alugar para gerar renda. O modelo é idêntico ao Airbnb: o proprietário define o preço, a disponibilidade, e os jogadores pagam para usar.

### 2.2. Características

- **Proprietário:** Pessoa Física (CPF)
- **Acesso:** Público - qualquer jogador pode ver e se inscrever
- **Pagamento:** Obrigatório - o jogador paga a taxa da reserva
- **Visibilidade:** Aparece no marketplace Kourt para todos os jogadores
- **Receita:** O proprietário recebe 90% (Kourt retém 10% de taxa)
- **Plano Mínimo:** Starter (Gratuito)

### 2.3. Funcionalidades Disponíveis

| Funcionalidade | Starter | Professional | Enterprise |
| :--- | :--- | :--- | :--- |
| Cadastrar até 2 quadras | ✅ | ✅ | ✅ |
| Definir preço fixo | ✅ | ✅ | ✅ |
| Precificação dinâmica (pico/baixa) | ❌ | ✅ | ✅ |
| Aparecer no marketplace Kourt | ✅ | ✅ | ✅ |
| Cupons de desconto | ✅ | ✅ | ✅ |
| Pacotes de horas | ❌ | ✅ | ✅ |
| Análise de ocupação | ✅ (básica) | ✅ (avançada) | ✅ (completa) |
| Saques automáticos | ❌ | ✅ | ✅ |
| Relatórios financeiros | ❌ | ✅ | ✅ |

### 2.4. Fluxo de Onboarding

O fluxo é idêntico ao descrito no KourtOS v1.0, com uma pequena adição:

**Tela: Tipo de Quadra**

Após o cadastro inicial, o sistema pergunta:

```
Que tipo de quadra você quer cadastrar?

[Quadra Privada Paga]
Sua casa, sítio, chácara, pousada ou propriedade particular.
Você recebe pagamento por cada reserva.
→ Selecionar

[Quadra de Condomínio]
Quadra de um condomínio residencial.
Apenas moradores autorizados podem usar (sem pagamento).
→ Selecionar

[Arena/Clube]
Centro esportivo, clube, arena ou negócio de quadras.
Você gerencia múltiplas quadras e equipes.
→ Selecionar
```

### 2.5. Exemplo Prático

**Cenário:** João tem uma casa com uma quadra de beach tennis no sítio. Ele quer alugar nos fins de semana para gerar renda extra.

1. João se cadastra no KourtOS e escolhe "Quadra Privada Paga".
2. Ele adiciona fotos da quadra, define o preço (ex: R$ 150/hora) e os horários disponíveis.
3. A quadra aparece no marketplace Kourt.
4. Maria, uma jogadora, vê a quadra, gosta e se inscreve para jogar no sábado às 15h.
5. Maria paga R$ 165 (R$ 150 + 10% de taxa Kourt).
6. João recebe R$ 135 (R$ 150 - 10% de taxa Kourt).
7. No sábado, Maria e seus amigos jogam na quadra de João.
8. João recebe o dinheiro automaticamente via Stripe.

---

## 3. Modelo 2: Quadra de Condomínio (Novo)

### 3.1. O que é?

Uma quadra de condomínio residencial que os moradores querem usar entre si, sem envolver dinheiro. O objetivo é facilitar a organização de partidas entre vizinhos, sem a complexidade de um negócio.

### 3.2. Características

- **Proprietário:** Condomínio/Síndico (representante)
- **Acesso:** Restrito - apenas moradores autorizados podem ver e se inscrever
- **Pagamento:** Nenhum - é gratuito para os moradores
- **Visibilidade:** Não aparece no marketplace Kourt (é privada)
- **Receita:** Nenhuma para o Kourt (é um serviço gratuito de comunidade)
- **Plano Mínimo:** Starter (Gratuito)

### 3.3. Características Únicas

A quadra de condomínio tem dois modos de acesso:

#### Modo 1: Link de Convite (Público com Restrição)

O síndico gera um link único (ex: `kourt.app/condominio/meu-condominio/join?token=abc123`) e compartilha com os moradores via WhatsApp, email ou aviso de condomínio. Qualquer pessoa com o link pode se inscrever, mas aparece como "Condomínio Meu Condomínio" no app.

**Fluxo:**

1. Síndico cria a quadra e escolhe "Modo Link de Convite".
2. Sistema gera um link único.
3. Síndico compartilha o link com os moradores.
4. Moradores clicam no link e se inscrevem automaticamente como "Membros do Condomínio".
5. Apenas membros inscritos podem ver a agenda e se inscrever em partidas.

#### Modo 2: Convite Manual (Privado Máximo)

O síndico adiciona manualmente os emails/telefones dos moradores que podem acessar.

**Fluxo:**

1. Síndico cria a quadra e escolhe "Modo Convite Manual".
2. Síndico adiciona os emails dos moradores (ex: morador@email.com).
3. Cada morador recebe um email/SMS com um convite para se juntar.
4. Apenas moradores convidados podem acessar.

### 3.4. Funcionalidades Disponíveis

| Funcionalidade | Starter | Professional | Enterprise |
| :--- | :--- | :--- | :--- |
| Cadastrar até 2 quadras | ✅ | ✅ | ✅ |
| Modo Link de Convite | ✅ | ✅ | ✅ |
| Modo Convite Manual | ✅ | ✅ | ✅ |
| Aparecer no marketplace Kourt | ❌ | ❌ | ❌ |
| Agenda privada para membros | ✅ | ✅ | ✅ |
| Criar partidas sem pagamento | ✅ | ✅ | ✅ |
| Relatórios de uso | ❌ | ✅ | ✅ |
| Gestão de membros | ✅ (básica) | ✅ (avançada) | ✅ (completa) |

### 3.5. Fluxo de Onboarding

**Tela: Configuração de Acesso**

Após adicionar a quadra, o sistema pergunta:

```
Como você quer controlar o acesso à quadra?

[Link de Convite]
Gere um link único e compartilhe com os moradores.
Qualquer pessoa com o link pode se inscrever.
Ideal para: Distribuir via WhatsApp ou aviso de condomínio.
→ Selecionar

[Convite Manual]
Você adiciona manualmente os emails dos moradores.
Apenas convidados podem acessar.
Ideal para: Controle total sobre quem acessa.
→ Selecionar
```

### 3.6. Exemplo Prático

**Cenário:** O síndico do Condomínio Flores quer facilitar partidas de padel entre os moradores.

1. Síndico se cadastra no KourtOS e escolhe "Quadra de Condomínio".
2. Ele adiciona a quadra de padel e escolhe "Modo Link de Convite".
3. Sistema gera o link: `kourt.app/condominio/flores/join?token=xyz789`
4. Síndico compartilha o link no grupo de WhatsApp do condomínio.
5. Moradores clicam no link e se inscrevem.
6. Agora, qualquer morador pode criar partidas (ex: "Padel - Sábado 14h") e convidar outros moradores.
7. Não há pagamento envolvido - é apenas para organizar.
8. O Kourt não cobra nada (é um serviço de comunidade).

---

## 4. Modelo 3: Arena/Clube (Já Existente)

### 4.1. O que é?

Um negócio profissional de quadras (centro esportivo, clube, arena) que gerencia múltiplas quadras e oferece um serviço completo de agendamento e pagamento.

### 4.2. Características

- **Proprietário:** Empresa (CNPJ)
- **Acesso:** Público - qualquer jogador pode ver e se inscrever
- **Pagamento:** Obrigatório - o jogador paga a taxa da reserva
- **Visibilidade:** Aparece no marketplace Kourt
- **Receita:** Arena recebe 90% (Kourt retém 10% de taxa)
- **Plano Mínimo:** Professional (R$ 199/mês)

Este modelo já está completamente descrito no KourtOS v1.0. Não há mudanças.

---

## 5. Integração com Kourt Arena (Torneios)

### 5.1. Quadras Privadas Pagas em Torneios

Proprietários de quadras privadas pagas podem criar torneios em suas propriedades.

**Exemplo:** João, dono de uma quadra de beach tennis em seu sítio, cria um torneio: "Copa Sítio João - Beach Tennis". Ele define as categorias, prazos de inscrição e o valor da inscrição (ex: R$ 100/dupla).

**Receita:**
- Inscrições: 20 duplas × R$ 100 = R$ 2.000
- Kourt retém 10% = R$ 200
- João recebe: R$ 1.800

### 5.2. Quadras de Condomínio em Torneios

Síndicos de condomínios podem criar torneios comunitários (sem pagamento).

**Exemplo:** Síndico do Condomínio Flores cria um torneio de padel entre os moradores. Não há inscrição paga - é apenas para divertimento e integração.

**Receita:** Nenhuma para o Kourt (é um evento comunitário).

### 5.3. Arenas em Torneios

Arenas profissionais podem criar torneios pagos com prêmios.

**Exemplo:** Arena BTG cria a "Copa Arena BTG - Padel". Inscrição de R$ 150/dupla com prêmios em dinheiro.

**Receita:**
- Inscrições: 40 duplas × R$ 150 = R$ 6.000
- Kourt retém 10% = R$ 600
- Arena BTG recebe: R$ 5.400

---

## 6. Modelo de Dados Atualizado

```
Court
├─ id, owner_id, name, sport, location
├─ type (PrivatePaid, CondominiumPrivate, ArenaCommercial)
├─ price_per_hour (NULL para condomínio)
├─ visibility (Public para Privada e Arena, Private para Condomínio)
├─ access_mode (se Condomínio: LinkInvite ou ManualInvite)
├─ access_token (se Condomínio com LinkInvite)
├─ authorized_members[] (se Condomínio com ManualInvite)
└─ created_at, updated_at

Booking
├─ id, court_id, customer_id, datetime_start, datetime_end
├─ price (NULL para condomínio)
├─ payment_status (Completed para Privada/Arena, N/A para Condomínio)
├─ status (Confirmed, Pending, Cancelled)
└─ created_at, updated_at

CondominiumMember
├─ id, court_id, user_id, email
├─ invitation_status (Pending, Accepted)
├─ joined_date
└─ created_at, updated_at
```

---

## 7. Conclusão

A atualização do KourtOS para suportar três modelos de quadras (Privada Paga, Condomínio, Arena) expande significativamente o mercado potencial:

- **Quadras Privadas Pagas:** Captura o mercado de proprietários que querem gerar renda com suas propriedades.
- **Quadras de Condomínio:** Oferece um serviço comunitário gratuito que fortalece a marca Kourt como a plataforma central para esportes de quadra.
- **Arenas:** Continua sendo o segmento premium com o maior potencial de receita.

Cada modelo tem sua própria lógica de negócios, mas todos se beneficiam do ecossistema integrado do KourtOS e do Kourt Arena.

---

**Fim da Documentação Atualizada de Tipos de Quadras - v2.0**
