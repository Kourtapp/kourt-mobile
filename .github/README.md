# CI/CD Configuration

Este diretorio contem toda a configuracao de CI/CD para o Kourt Mobile App usando GitHub Actions.

## Workflows

### 1. CI (Continuous Integration) - `ci.yml`

Executa em **todos os pushes e pull requests**.

**Jobs:**
- **Lint**: Executa ESLint para verificar qualidade do codigo
- **TypeCheck**: Verifica tipos TypeScript com `tsc --noEmit`
- **Test**: Executa testes Jest com coverage
- **Build**: Faz build web usando Expo

**Artefatos:**
- Relatorio de coverage (enviado para Codecov)
- Build web (mantido por 7 dias)

### 2. EAS Build - `eas-build.yml`

Executa builds automaticos no **EAS (Expo Application Services)**.

**Triggers:**
- Push para branch `main`: Build preview automatico (iOS + Android)
- Manual (workflow_dispatch): Escolha o profile e plataforma

**Profiles disponiveis:**
- `preview`: Build para testes internos
- `production`: Build para lancamento

**Plataformas:**
- `all`: iOS + Android
- `ios`: Apenas iOS
- `android`: Apenas Android

### 3. PR Check - `pr-check.yml`

Validacao completa de **Pull Requests**.

**Features:**
- Executa lint, typecheck e tests
- Comenta no PR com status de cada check
- Fornece info sobre bundle size e dependencias
- Atualiza comentario existente (nao cria multiplos)

**Status indicators:**
- Lint: Verifica qualidade do codigo
- TypeCheck: Verifica tipos
- Tests: Executa suite de testes

## CODEOWNERS

Define revisores automaticos para areas do codigo:

- **Default**: @bruno para todos os arquivos
- Diretórios específicos têm owners definidos

Quando um PR é criado, os code owners são automaticamente adicionados como reviewers.

## Pull Request Template

Template automatico para PRs com:

- Descricao da mudanca
- Tipo de mudanca (bug fix, feature, etc)
- Motivacao e contexto
- Como foi testado
- Screenshots/videos
- Checklist de qualidade
- Analise de impacto

## Secrets Necessarios

Configure os seguintes secrets no GitHub:

### Obrigatorios:
- `EXPO_TOKEN`: Token de autenticacao do Expo
- `EXPO_PUBLIC_SUPABASE_URL`: URL do projeto Supabase
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Chave anonima do Supabase

### Opcionais:
- `CODECOV_TOKEN`: Para upload de coverage (opcional)

## Husky Pre-commit Hooks

Pre-commit hooks executam automaticamente antes de cada commit:

**Hooks configurados:**
- `pre-commit`: Executa ESLint

Para pular hooks (use com cautela):
```bash
git commit -m "message" --no-verify
```

## Scripts NPM

Scripts adicionados ao `package.json`:

```json
{
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "typecheck": "tsc --noEmit",
  "prepare": "husky install"
}
```

## Como Usar

### Desenvolvimento Local

```bash
# Instalar dependencias
npm ci

# Rodar lint
npm run lint

# Rodar typecheck
npm run typecheck

# Rodar testes
npm test

# Rodar testes com coverage
npm run test:coverage
```

### Criar Pull Request

1. Crie uma branch para sua feature/fix
2. Faca commits (pre-commit hook vai rodar automaticamente)
3. Push para o GitHub
4. Abra um PR (template sera aplicado automaticamente)
5. CI vai executar automaticamente
6. Code owners serao adicionados como reviewers

### Build Manual no EAS

Via GitHub Actions:
1. Va em "Actions" no GitHub
2. Selecione "EAS Build"
3. Clique em "Run workflow"
4. Escolha profile e plataforma
5. Clique em "Run workflow"

Via CLI:
```bash
eas build --platform ios --profile preview
eas build --platform android --profile production
```

## Status Badges

Adicione badges ao README principal:

```markdown
![CI](https://github.com/bruno/kourt-mobile/workflows/CI/badge.svg)
![EAS Build](https://github.com/bruno/kourt-mobile/workflows/EAS%20Build/badge.svg)
```

## Troubleshooting

### Erro de permissoes no Husky

```bash
chmod +x .husky/pre-commit
chmod +x .husky/_/husky.sh
```

### Erro de dependencias no CI

O CI usa `npm ci` que requer `package-lock.json` atualizado:

```bash
npm install
git add package-lock.json
git commit -m "chore: update package-lock.json"
```

### EAS Build falhando

Verifique se:
1. `EXPO_TOKEN` esta configurado nos secrets
2. Voce tem acesso ao projeto no Expo
3. As configuracoes em `eas.json` estao corretas

## Proximos Passos

Futuras melhorias sugeridas:

- [ ] Adicionar testes E2E com Maestro
- [ ] Configurar deploy automatico para stores
- [ ] Adicionar analise de bundle size
- [ ] Configurar notificacoes de build (Slack/Discord)
- [ ] Adicionar semantic release
- [ ] Configurar Dependabot para atualizacoes automaticas
