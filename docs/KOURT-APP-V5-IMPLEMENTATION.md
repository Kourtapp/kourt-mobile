# KOURT APP v5 - PROMPT DE IMPLEMENTAÇÃO COMPLETO

## ÍNDICE

1. VISÃO GERAL
2. DESIGN SYSTEM
3. ARQUITETURA TÉCNICA
4. MÓDULO JOGAR
5. MÓDULO PÓS-JOGO
6. MÓDULO SOCIAL
7. MOTION DESIGN 3D
8. BACKEND APIs
9. BANCO DE DADOS
10. CHECKLIST DE IMPLEMENTAÇÃO

---

## 1. VISÃO GERAL

## 1.1 Sobre o App

Kourt é uma plataforma social para esportes de quadra que conecta jogadores, facilita organização de partidas e fornece análise inteligente de performance através de IA.

## 1.2 Stack Tecnológica

```yaml
Frontend:
  - React Native 0.73+
  - Expo SDK 50+
  - React Navigation 6
  - Reanimated 3 (animações)
  - Three.js / React Three Fiber (3D)
  - Zustand (estado global)
  - React Query (cache/fetch)

Backend:
  - Supabase (Auth, Database, Storage, Realtime)
  - Edge Functions (Deno)
  - PostgreSQL com PostGIS

IA/ML:
  - TensorFlow Lite (on-device)
  - Cloud Vision API (server)
  - Custom ML Models (análise de partidas)

Infraestrutura:
  - Cloudflare R2 (vídeos)
  - Redis (cache/filas)
  - Vercel (Edge Functions)
```

## 1.3 Fluxo Geral do Usuário

```plaintext
DESCOBERTA → JOGAR → PÓS-JOGO → SOCIAL

Buscar Quadras → Criar Jogo → Registrar Placar → Ver Perfil
Reservar      → Convidar   → Avaliar         → Chat
              → Check-in   → Análise IA      → Conquistas
              → Live       → Compartilhar    → Torneios
```

---

## 2. DESIGN SYSTEM

## 2.1 Cores

```typescript
export const colors = {
  // Primárias
  primary: '#222222',      // Preto principal
  accent: '#84cc16',       // Verde lime
  
  // Neutras
  white: '#FFFFFF',
  gray50: '#F5F5F5',
  gray100: '#E5E5E5',
  gray300: '#B0B0B0',
  gray500: '#717171',
  gray900: '#222222',
  
  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Premium (Pro)
  gold: '#D4AF37',
  goldLight: '#F4E4A6',
  proBackground: '#0A0A0A',
};
```

## 2.2 Tipografia

```typescript
export const typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    black: 'Inter-Black',
  },
  
  fontSize: {
    xs: 10, sm: 12, base: 14, md: 15, lg: 16,
    xl: 18, '2xl': 20, '3xl': 24, '4xl': 28,
    '5xl': 32, '6xl': 40, '7xl': 48,
  },
  
  presets: {
    h1: { fontSize: 28, fontFamily: 'Inter-Bold', lineHeight: 1.2 },
    h2: { fontSize: 24, fontFamily: 'Inter-Bold', lineHeight: 1.2 },
    h3: { fontSize: 20, fontFamily: 'Inter-SemiBold', lineHeight: 1.3 },
    body: { fontSize: 15, fontFamily: 'Inter-Regular', lineHeight: 1.5 },
    label: { fontSize: 12, fontFamily: 'Inter-Medium', lineHeight: 1.4 },
    score: { fontSize: 48, fontFamily: 'Inter-Black', lineHeight: 1 },
  }
};
```

## 2.3 Espaçamento e Radius

```typescript
export const spacing = {
  screenPadding: 24,
  cardPadding: 16,
  sectionGap: 24,
  itemGap: 12,
  inlineGap: 8,
};

export const radius = {
  sm: 4, md: 8, lg: 12, xl: 16, '2xl': 20, full: 9999,
  button: 12, card: 16, modal: 24, avatar: 9999,
};
```

## 2.4 Ícones (Material Symbols)

```typescript
export const icons = {
  // Navigation
  home: 'home', search: 'search', add: 'add',
  ranking: 'leaderboard', profile: 'person',
  
  // Sports
  beachTennis: 'sports_tennis', futsal: 'sports_soccer',
  volleyball: 'sports_volleyball', basketball: 'sports_basketball',
  
  // Match
  play: 'play_arrow', pause: 'pause', record: 'fiber_manual_record',
  timer: 'timer', score: 'scoreboard',
  
  // Actions
  share: 'share', camera: 'photo_camera', video: 'videocam',
  
  // Social
  chat: 'chat_bubble_outline', trophy: 'emoji_events',
};
```

---

## 3. ARQUITETURA TÉCNICA

## 3.1 Estrutura de Pastas

```plaintext
src/
├── app/                     # Expo Router (screens)
│   ├── (tabs)/              # Tab navigator
│   ├── (auth)/              # Auth flow
│   ├── (match)/             # Match flow
│   ├── (post-match)/        # Post-match flow
│   └── (social)/            # Social features
├── components/
│   ├── ui/                  # Primitivos UI
│   ├── match/               # Componentes de partida
│   ├── player/              # Componentes de jogador
│   ├── social/              # Componentes sociais
│   ├── 3d/                  # Componentes 3D
│   └── layout/              # Layout components
├── features/                # Feature modules
│   ├── auth/
│   ├── match/
│   ├── social/
│   └── ai/
├── lib/                     # Bibliotecas/Utils
├── hooks/                   # Hooks globais
├── store/                   # Estado global (Zustand)
├── types/                   # TypeScript types
├── theme/                   # Design tokens
├── constants/               # Constantes
└── utils/                   # Utilitários
```

## Phase 3: "Airbnb-Style" Create Match Redesign (Wizard Flow)

Refactor `app/match/create.tsx` from a long form to a multi-step experience.

### [NEW] Components

#### [NEW] `components/match/WizardStep.tsx` (Internal helper)

Wrapper for each step content with animation.

### [MODIFY] `app/match/create.tsx`

- Implement state `currentStep` (0 to 5)
- **Step 1: Modalidade**: Choose Sport (Big Cards) & Type (Casual/Ranked)
- **Step 2: Local**: Choose Court (List with images)
- **Step 3: Horário**: Date & Time selector (Clean UI)
- **Step 4: Detalhes**: Players slider, Rating selector
- **Step 5: Revisão**: Summary card
- **Sticky Footer**: "Voltar" (Text) and "Continuar" (Black Button)

## Phase 4: Data Integration & Polish

## 3.2 Estado Global (Zustand)

```typescript
// store/matchStore.ts
interface MatchState {
  currentMatch: Match | null;
  isLive: boolean;
  isRecording: boolean;
  score: MatchScore;
  players: Player[];
  
  // Actions
  createMatch: (data: CreateMatchData) => Promise<Match>;
  startMatch: () => void;
  endMatch: () => void;
  updateScore: (team: 'A' | 'B', points: number) => void;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>;
  reset: () => void;
}
```

---

## 4. MÓDULO JOGAR

## 4.1 User Flow

```plaintext
CRIAR JOGO → CONVIDAR → AGUARDAR → CHECK-IN → FORMAR TIMES → LIVE → FIM
     │           │          │          │           │          │
  Esporte    Contatos    Lobby      GPS/QR     Drag&Drop   Placar
  Local      Grupos      Real-time  Validar    Sortear     Timer
  Horário    Link        Status                Balancear   Gravação
  Vagas      Share       Chat                              Broadcast
```

---

## 5. MÓDULO PÓS-JOGO

## 5.1 User Flow

```plaintext
PARTIDA FINALIZADA
       │
       ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│REGISTRAR │──▶│ AVALIAR  │──▶│  FOTOS   │──▶│COMPARTI- │
│  PLACAR  │   │JOGADORES │   │          │   │  LHAR    │
└──────────┘   └──────────┘   └──────────┘   └──────────┘
       │
       ▼
┌──────────┐
│ COMPLETO │──▶ XP + Conquistas + Ranking
└──────────┘
```

---

## 6. MÓDULO SOCIAL

## 6.1 User Flow

```plaintext
VER JOGADOR ─┬─▶ STATS JOGADOR
             ├─▶ CHAT
             ├─▶ ATIVIDADES (Feed)
             ├─▶ CONQUISTAS
             ├─▶ DESAFIOS
             ├─▶ TORNEIOS
             └─▶ INDICAÇÕES
```

---

## 7. MOTION DESIGN 3D

## 7.1 Stack 3D

```typescript
{
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.88.0",
  "three": "^0.158.0",
  "expo-gl": "^13.0.0",
  "react-native-reanimated": "^3.5.0"
}
```

## 7.2 Onde Usar

| Contexto | Tipo | Animação |
|----------|------|----------|
| Seleção esporte | 3D | TennisBall rotation |
| Vitória | 3D | Trophy + Confetti |
| Score | 3D | ScoreButton pulse |
| Entrada tela | 2D | FadeIn + SlideIn |
| Cards | 2D | FadeInDown staggered |
| Botão press | 2D | Scale 0.95 → 1 |
| Erro | 2D | Shake |
| Loading | 2D | Skeleton shimmer |

---

## 10. CHECKLIST DE IMPLEMENTAÇÃO

## 10.1 Módulo JOGAR

- [ ] Criar Jogo (seletor 3D, picker quadra, validações)
- [ ] Convidar Jogadores (busca, grupos, share)
- [ ] Buscar Jogadores (filtros, geoloc, compatibilidade)
- [ ] Check-in (mapa 3D, GPS, QR code)
- [ ] Formar Times (drag & drop, sortear, balancear)
- [ ] Placar ao Vivo (scoreboard, timer, WebSocket)

## 10.2 Módulo PÓS-JOGO

- [ ] Registrar Placar (Trophy 3D, confirmar, editar)
- [ ] Avaliar Jogadores (stars, tags, MVP)
- [ ] Fotos (câmera, galeria, tag players)
- [ ] Compartilhar (card preview, social share)
- [ ] Completo (confetti, XP, conquistas)
- [ ] Estatísticas (radar chart, comparativo)
- [ ] Análise IA (progress, highlights, dicas)
- [ ] Histórico (lista, filtros, pagination)

## 10.3 Módulo SOCIAL

- [ ] Ver Jogador (perfil, stats, ações)
- [ ] Stats Jogador (radar, evolução)
- [ ] Chat (mensagens, typing, WebSocket)
- [ ] Atividades (feed, interações)
- [ ] Conquistas (progresso, raras)
- [ ] Desafios (1v1, aceitar/recusar)
- [ ] Torneios (criar, inscrição, bracket)
- [ ] Indicações (código, recompensas)

## 10.4 Backend

- [ ] Auth (Supabase)
- [ ] CRUD partidas
- [ ] WebSocket live match
- [ ] Upload vídeos (R2)
- [ ] Sistema XP/Níveis
- [ ] Conquistas
- [ ] Chat real-time
- [ ] Push notifications
- [ ] Pagamentos (Stripe)

---

**Versão:** 5.0
**Atualização:** Dezembro 2024
