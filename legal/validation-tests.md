# 🧪 Teste de Validation - Kourt

**Data:** 22 de Dezembro, 2025  
**Objetivo:** Verificar se as validações de segurança estão funcionando

---

## ✅ **TESTES A FAZER:**

### **1. Teste XSS em Profile Update**

**Input malicioso:**

```javascript
{
  name: '<script>alert("XSS")</script>',
  bio: '<img src=x onerror="alert(1)">',
}
```

**Resultado esperado:**

- ❌ Deve REJEITAR ou SANITIZAR
- ✅ Salvar como texto puro: "scriptalert(XSS)/script"

**Como testar:**

1. Abrir tela de editar perfil
2. Colar `<script>alert("hack")</script>` no nome
3. Salvar
4. Ver se salvou como texto ou executou script

---

### **2. Teste SQL Injection em Username**

**Input malicioso:**

```javascript
username: "admin' OR '1'='1"
```

**Resultado esperado:**

- ❌ Deve REJEITAR
- ✅ Erro: "Username inválido"

---

### **3. Teste Validation em Create Court**

**Input malicioso:**

```javascript
{
  name: 'A',  // Muito curto!
  sport: '',  // Vazio!
}
```

**Resultado esperado:**

- ❌ Deve REJEITAR
- ✅ Erro: "Nome da quadra inválido (mínimo 3 caracteres)"
- ✅ Erro: "Esporte é obrigatório"

---

### **4. Teste Validation em Create Match**

**Input malicioso:**

```javascript
{
  sport: 'A',  // Muito curto
  maxPlayers: 1000,  // Muito alto!
  title: '<script>hack</script>',
}
```

**Resultado esperado:**

- ❌ Deve REJEITAR
- ✅ Erro: "Esporte inválido"
- ✅ Erro: "Número de jogadores inválido (2-100)"
- ✅ Title sanitizado

---

## 📋 **RESULTADO DOS TESTES:**

### Teste 1: XSS em Profile

- [ ] ✅ PASSOU - Sanitizou corretamente
- [ ] ❌ FALHOU - Script executou

### Teste 2: SQL Injection

- [ ] ✅ PASSOU - Rejeitou input
- [ ] ❌ FALHOU - Aceitou input malicioso

### Teste 3: Court Validation

- [ ] ✅ PASSOU - Validou campos
- [ ] ❌ FALHOU - Aceitou dados inválidos

### Teste 4: Match Validation

- [ ] ✅ PASSOU - Validou tudo
- [ ] ❌ FALHOU - Aceitou dados inválidos

---

## 🎯 **COMO TESTAR (MANUAL):**

### Método 1: No App Diretamente

1. Abrir app no celular
2. Ir em "Editar Perfil"
3. Colar `<script>alert("teste")</script>` no nome
4. Salvar
5. Verificar no banco de dados se salvou sanitizado

### Método 2: Usando Console (Dev Tools)

```typescript
// No navegador ou React Native Debugger:
import { userService } from './services/userService';

// Testar XSS
await userService.updateProfile(userId, {
  name: '<script>alert("XSS")</script>'
});

// Ver logs:
// ✅ "Validação falhou: Nome contém caracteres inválidos"
// ou
// ❌ Nenhum erro (BUG!)
```

### Método 3: Criar Botão de Teste (Temporário)

```typescript
// Em qualquer tela, adicionar temporariamente:
<TouchableOpacity
  onPress={async () => {
    try {
      await userService.updateProfile(userId, {
        name: '<script>alert("hack")</script>'
      });
      Alert.alert('FALHOU', 'Aceitou script malicioso!');
    } catch (e) {
      Alert.alert('PASSOU', 'Bloqueou: ' + e.message);
    }
  }}
>
  <Text>Testar XSS</Text>
</TouchableOpacity>
```

---

## 🔒 **STATUS: AGUARDANDO TESTE MANUAL**

**Próximos passos:**

1. Testar manualmente (5-10 min)
2. Documentar resultados
3. Fix se necessário
