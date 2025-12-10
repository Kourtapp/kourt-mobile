# 🤖 Prompt para Claude/Antigranvity - Correção Automatizada de Erros Kourt

## Contexto do Projeto

Você é um agente IA especializado em correção de erros em aplicativos React Native/iOS. Sua tarefa é analisar e corrigir automaticamente todos os erros críticos identificados em um aplicativo iOS chamado **Kourt**.

**Informações do Projeto:**
- **Nome:** Kourt
- **Plataforma:** iOS (React Native)
- **Versão:** Atual (com 33 mensagens de erro)
- **Objetivo:** Corrigir 100% dos erros críticos e de média severidade

---

## 🎯 Objetivo Principal

Você deve analisar os logs de erro fornecidos e implementar automaticamente as correções necessárias em todos os arquivos do projeto React Native. O resultado final deve ser um aplicativo sem erros críticos, com código otimizado e seguindo as melhores práticas de React Native e iOS.

---

## 📋 Erros a Corrigir

### Categoria 1: Erros de Navegação (Telas Duplicadas) - 5 Erros

**Mensagem de Erro:**
```
{ [Error: A navigator cannot contain multiple 'Screen' components with the same name 
(found duplicate screen named 'match/register')] }
```

**Severidade:** 🔴 CRÍTICA

**Ações Necessárias:**
1. Escanear todos os arquivos de navegação (Navigation.js, RootNavigator.js, etc)
2. Identificar e remover telas duplicadas
3. Renomear telas com nomes conflitantes para nomes únicos
4. Verificar imports duplicados em todo o projeto
5. Limpar cache e validar a estrutura de navegação

**Arquivos Prováveis para Verificar:**
- `src/navigation/Navigation.js`
- `src/navigation/RootNavigator.js`
- `src/navigation/StackNavigator.js`
- `src/navigation/TabNavigator.js`
- Qualquer arquivo com "Navigator" no nome

---

### Categoria 2: Problemas de Política iOS (COSMCtrl) - 3 Erros

**Mensagem de Erro:**
```
COSMCtrl applyPolicyDelta unexpected absence of policy on appRecord com.kourt.app
```

**Severidade:** 🔴 CRÍTICA

**Ações Necessárias:**
1. Atualizar `ios/Kourt/Info.plist` com todas as permissões necessárias
2. Adicionar descrições de uso para cada permissão (NSCameraUsageDescription, etc)
3. Verificar Capabilities no Xcode (Signing & Capabilities)
4. Implementar verificação de permissões em runtime
5. Adicionar tratamento de permissões negadas

**Permissões Padrão a Adicionar (se aplicável):**
```xml
NSCameraUsageDescription
NSPhotoLibraryUsageDescription
NSLocationWhenInUseUsageDescription
NSContactsUsageDescription
NSMicrophoneUsageDescription
NSCalendarsUsageDescription
```

**Arquivos a Modificar:**
- `ios/Kourt/Info.plist`
- `src/utils/PermissionManager.js` (criar se não existir)
- `src/hooks/usePermissions.js` (criar se não existir)

---

### Categoria 3: Exceções JavaScript Não Tratadas - 3 Erros

**Mensagem de Erro:**
```
Unhandled JS Exception: Error: A navigator cannot contain multiple 'Screen' components
```

**Severidade:** 🟡 MÉDIA

**Ações Necessárias:**
1. Criar componente ErrorBoundary.js
2. Envolver toda a aplicação com ErrorBoundary
3. Adicionar try-catch em todas as funções críticas
4. Implementar logging global de erros
5. Configurar Sentry ou Firebase Crashlytics para monitoramento

**Arquivos a Criar/Modificar:**
- `src/components/ErrorBoundary.js` (criar)
- `src/utils/ErrorLogger.js` (criar)
- `src/App.js` (modificar)
- `src/config/Sentry.js` (criar)

---

### Categoria 4: Problemas de Cena (FBSceneManager) - 6 Erros

**Mensagem de Erro:**
```
Ignoring update for invalidated scene: (FBSceneManager):sceneID:com.kourt.app-default
[(FBSceneManager):sceneID:com.kourt.app-default] Update failed: <NSError: 0x772dfd800
```

**Severidade:** 🟡 MÉDIA

**Ações Necessárias:**
1. Implementar ciclo de vida correto em todos os componentes de tela
2. Usar useFocusEffect para lógica que depende do foco da tela
3. Evitar atualizações de estado em componentes desmontados
4. Otimizar re-renders com React.memo e useMemo
5. Implementar lazy loading para componentes pesados

**Arquivos a Modificar:**
- Todos os arquivos de tela em `src/screens/`
- `src/hooks/useScreenLifecycle.js` (criar)
- `src/hooks/useSafeState.js` (criar)

---

### Categoria 5: Problemas de Estado e Conexão - 13 Erros

**Mensagens de Erro:**
```
Process state is unknown AppStateTracker, pid 4109
RBSStateCapture remove item called for untracked item
Sandbox: Kourt deny(1) sysctrl-read kern.bootsrgs
```

**Severidade:** 🟡 MÉDIA

**Ações Necessárias:**
1. Criar gerenciador de estado do app (AppStateManager)
2. Implementar monitoramento de conexão de rede
3. Adicionar retry logic com backoff exponencial
4. Limpar recursos adequadamente em cleanup functions
5. Implementar sincronização de dados quando reconectar

**Arquivos a Criar/Modificar:**
- `src/hooks/useAppState.js` (criar)
- `src/hooks/useNetworkStatus.js` (criar)
- `src/utils/RetryManager.js` (criar)
- `src/context/AppStateContext.js` (criar)
- `src/App.js` (modificar)

---

## 🔧 Instruções de Execução

### Passo 1: Análise Inicial
Você deve começar por:
1. Listar todos os arquivos do projeto
2. Identificar a estrutura do projeto
3. Encontrar todos os arquivos de navegação
4. Mapear todas as telas e seus nomes
5. Gerar relatório de conflitos encontrados

### Passo 2: Correções Críticas (Prioridade 1)
Implemente as seguintes correções na ordem:
1. **Remover telas duplicadas** - Corrige 5 erros de navegação
2. **Adicionar permissões no Info.plist** - Corrige 3 erros de política
3. **Criar ErrorBoundary** - Corrige 3 exceções JavaScript

### Passo 3: Correções Secundárias (Prioridade 2)
Implemente as seguintes correções:
1. **Otimizar ciclo de vida** - Corrige 6 erros de cena
2. **Gerenciar estado do app** - Corrige 13 erros de conexão

### Passo 4: Validação
Após cada correção:
1. Validar sintaxe do código
2. Verificar imports
3. Confirmar que não há duplicatas
4. Gerar relatório de mudanças

---

## 📝 Formato de Saída Esperado

Para cada arquivo que você modificar ou criar, você deve fornecer:

### Estrutura de Resposta:

```
## 📄 Arquivo: [caminho/do/arquivo.js]

### Status: ✅ CRIADO / 🔄 MODIFICADO / ⚠️ REQUER REVISÃO

### Descrição das Mudanças:
[Descrição clara do que foi alterado e por quê]

### Código Completo:
\`\`\`javascript
[Código completo do arquivo]
\`\`\`

### Mudanças Específicas:
- Linha X: [Descrição da mudança]
- Linha Y: [Descrição da mudança]

### Testes Recomendados:
- [Teste 1]
- [Teste 2]
- [Teste 3]

### Notas Importantes:
[Qualquer informação adicional importante]
```

---

## 🎯 Critérios de Sucesso

Você terá sucesso quando:

✅ Todos os 5 erros de navegação forem corrigidos (sem telas duplicadas)
✅ Todos os 3 erros de política forem corrigidos (Info.plist atualizado)
✅ Todos os 3 erros de exceção JavaScript forem tratados (ErrorBoundary implementado)
✅ Todos os 6 erros de cena forem corrigidos (ciclo de vida otimizado)
✅ Todos os 13 erros de conexão forem corrigidos (estado gerenciado)
✅ Código segue padrões de React Native e iOS
✅ Nenhum novo erro introduzido
✅ Documentação clara de todas as mudanças

---

## 📚 Dependências Esperadas

Seu projeto deve ter as seguintes dependências instaladas. Se não estiverem, você deve indicar para instalá-las:

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-native": "^0.71.0",
    "@react-navigation/native": "^6.0.0",
    "@react-navigation/stack": "^6.0.0",
    "@react-navigation/bottom-tabs": "^6.0.0",
    "@react-native-community/netinfo": "^9.0.0",
    "@sentry/react-native": "^5.0.0",
    "axios": "^1.0.0"
  }
}
```

Se alguma dependência estiver faltando, você deve:
1. Indicar qual dependência está faltando
2. Fornecer o comando para instalá-la
3. Explicar por que é necessária

---

## 🚀 Boas Práticas a Seguir

### Padrão de Código:
- Use **ES6+ syntax** (arrow functions, const/let, destructuring)
- Siga **React Hooks** pattern (não use class components)
- Use **TypeScript types** quando apropriado
- Implemente **error handling** em todas as funções assíncronas
- Use **meaningful variable names** em português ou inglês (consistente)

### Estrutura de Arquivos:
```
src/
├── components/
│   ├── ErrorBoundary.js
│   └── [outros componentes]
├── screens/
│   ├── MatchScreen.js
│   ├── RegisterScreen.js
│   └── [outras telas]
├── navigation/
│   ├── Navigation.js
│   ├── RootNavigator.js
│   └── [outros navegadores]
├── hooks/
│   ├── useAppState.js
│   ├── useNetworkStatus.js
│   ├── usePermissions.js
│   └── [outros hooks]
├── utils/
│   ├── ErrorLogger.js
│   ├── RetryManager.js
│   ├── PermissionManager.js
│   └── [outros utilitários]
├── context/
│   ├── AppStateContext.js
│   └── [outros contextos]
├── config/
│   ├── Sentry.js
│   └── [outras configurações]
└── App.js
```

### Convenções de Nomenclatura:
- Componentes: **PascalCase** (ErrorBoundary, MatchScreen)
- Hooks: **camelCase com prefixo 'use'** (useAppState, useNetworkStatus)
- Utilitários: **camelCase** (errorLogger, retryManager)
- Constantes: **UPPER_SNAKE_CASE** (MAX_RETRIES, DEFAULT_TIMEOUT)

---

## ⚠️ Avisos Importantes

### Não Fazer:
❌ Não modifique arquivos de configuração do Xcode diretamente (use Info.plist)
❌ Não remova código que você não tenha certeza
❌ Não introduza dependências desnecessárias
❌ Não crie componentes de classe (use apenas functional components)
❌ Não ignore erros de tipo ou linting

### Fazer:
✅ Sempre faça backup mental do código original
✅ Documente todas as mudanças
✅ Teste cada correção isoladamente
✅ Use console.log para debugging
✅ Mantenha compatibilidade com versões anteriores

---

## 🔍 Checklist de Validação

Antes de finalizar, você deve validar:

- [ ] Nenhuma tela duplicada em nenhum navegador
- [ ] Todos os nomes de telas são únicos
- [ ] Info.plist contém todas as permissões necessárias
- [ ] ErrorBoundary envolve toda a aplicação
- [ ] Todos os componentes de tela usam useFocusEffect
- [ ] Nenhuma atualização de estado em componentes desmontados
- [ ] AppStateManager está implementado
- [ ] Monitoramento de rede está ativo
- [ ] Retry logic está implementada
- [ ] Sentry/Firebase Crashlytics está configurado
- [ ] Nenhum erro de sintaxe
- [ ] Nenhum import faltando
- [ ] Código segue padrões de React Native
- [ ] Documentação está completa

---

## 📊 Relatório Final Esperado

Ao terminar, você deve fornecer:

### 1. Resumo Executivo
- Total de arquivos modificados
- Total de arquivos criados
- Total de erros corrigidos
- Tempo estimado para implementação

### 2. Lista de Mudanças
- Arquivo por arquivo
- Tipo de mudança (criar/modificar)
- Descrição breve

### 3. Instruções de Implementação
- Ordem de aplicação das mudanças
- Comandos para instalar dependências
- Comandos para rebuild do app

### 4. Testes Recomendados
- Testes manuais
- Testes automatizados
- Testes de regressão

### 5. Próximos Passos
- Melhorias futuras
- Otimizações adicionais
- Monitoramento recomendado

---

## 🎓 Contexto Técnico Adicional

### Sobre React Navigation:
React Navigation é a biblioteca padrão para navegação em React Native. Cada tela deve ter um nome único dentro de seu navegador. Se você tentar registrar duas telas com o mesmo nome, o aplicativo lançará um erro.

### Sobre Permissões iOS:
iOS requer que todas as permissões sejam declaradas no Info.plist e que o usuário conceda permissão em runtime. Se uma permissão não estiver declarada, o app pode ser rejeitado na App Store.

### Sobre Error Boundaries:
Error Boundaries são componentes React que capturam erros JavaScript em qualquer lugar da árvore de componentes. Eles são essenciais para aplicativos robustos.

### Sobre AppState:
AppState permite rastrear se o app está em foreground ou background. Isso é importante para pausar/retomar operações e sincronizar dados.

### Sobre NetInfo:
NetInfo permite monitorar a conexão de rede do dispositivo. Isso é importante para implementar retry logic e sincronização de dados.

---

## 💡 Dicas de Implementação

### Para Erros de Navegação:
1. Use `console.log` para listar todos os nomes de telas
2. Procure por imports com nomes semelhantes
3. Verifique se há navegadores aninhados com conflitos

### Para Problemas de Política:
1. Comece com as permissões mais comuns (câmera, fotos, localização)
2. Adicione descrições claras em português
3. Teste cada permissão individualmente

### Para Exceções JavaScript:
1. Implemente ErrorBoundary primeiro
2. Depois adicione try-catch em funções críticas
3. Configure logging para rastrear erros

### Para Problemas de Cena:
1. Use `useFocusEffect` para lógica dependente de foco
2. Use `useRef` para rastrear se o componente está montado
3. Implemente cleanup functions em todos os useEffect

### Para Problemas de Conexão:
1. Implemente AppStateManager primeiro
2. Depois adicione monitoramento de rede
3. Finalmente, implemente retry logic

---

## 🔗 Referências Úteis

- [React Navigation Documentation](https://reactnavigation.org/)
- [React Native Official Docs](https://reactnative.dev/)
- [Apple iOS Development](https://developer.apple.com/ios/)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Sentry React Native](https://docs.sentry.io/platforms/react-native/)

---

## 📞 Perguntas Frequentes

**P: Por onde começo?**
R: Comece pela Categoria 1 (Erros de Navegação), pois eles são os mais críticos e afetam todo o app.

**P: Preciso instalar novas dependências?**
R: Provavelmente sim. Verifique a seção "Dependências Esperadas" para saber quais instalar.

**P: Como faço para testar as mudanças?**
R: Siga as instruções de teste recomendadas para cada categoria de erro.

**P: E se encontrar um erro que não está na lista?**
R: Documente-o e trate-o seguindo as mesmas práticas recomendadas.

**P: Quanto tempo isso vai levar?**
R: Estimado 2-4 horas para implementação completa, dependendo da complexidade do projeto.

---

## ✅ Confirmação de Início

Quando você estiver pronto para começar, confirme que:

1. ✅ Você entendeu os 5 tipos de erros a corrigir
2. ✅ Você conhece a ordem de prioridade
3. ✅ Você sabe qual formato de saída é esperado
4. ✅ Você tem acesso aos arquivos do projeto
5. ✅ Você está pronto para implementar as mudanças

---

**Criado em:** 09 de dezembro de 2025
**Versão:** 1.0
**Status:** Pronto para Uso
**Compatibilidade:** Claude 3.5+, Antigranvity, Gemini 2.0+
