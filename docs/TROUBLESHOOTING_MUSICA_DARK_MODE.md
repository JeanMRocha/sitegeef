# 🔧 Troubleshooting — Música em Dark Mode

**Data:** 2026-05-30  
**Problema:** Texto de música ilegível em dark mode  
**Causa Raiz:** CSS specificity + Servidor instável

---

## 📋 Histórico do Problema

### Symptoma Inicial
- Página `/musicas/quanta-luz-28f689e1` carregava
- Mas em dark mode, o texto (letra) estava invisível/ilegível
- Cores cinza pálido ao invés de creme claro (#f4efe7)

### Investigação
1. **Primeiro**: Adicionei regras CSS genéricas (`.musica-parte-text`, `.musica-cifra-block pre`)
2. **Resultado**: Não funcionou — seletores não alcançavam o componente correto
3. **Segundo**: Descobri a estrutura HTML real (`.musica-display-verse-content pre`)
4. **Terceiro**: Adicionei regras específicas para o componente 16x9

### Descoberta Crítica
- Servidor **respondeu HTTP 200** (confirmado via curl)
- Mas **CONNECTION_REFUSED** no navegador (intermitente)
- Causa: Possível instabilidade ou problema de timing

---

## ✅ Solução Aplicada (2026-05-30)

### CSS Alterações
**Arquivo:** `styles/globals.css` (linhas 1108-1120)

```css
/* Dark mode - Display Live (16x9) */
:root.dark .musica-display-verse-content pre {
  color: #f4efe7 !important;
}

:root.dark .musica-display-header-16x9 h1,
:root.dark .musica-display-header-16x9 .musica-display-header-subtitle {
  color: #f4efe7 !important;
}

:root.dark .musica-display-chorus-text {
  color: #f4efe7 !important;
}
```

### Por que funcionará
1. **Seletores específicos** para componentes de música
2. **!important** força aplicação mesmo com CSS cascade
3. **Cobertura completa**: verso, header e refrão

---

## 🧪 Como Testar (Manual)

### Passo 1: Limpar Cache Completo
```bash
# Windows PowerShell
Remove-Item -Recurse -Force 'C:\Projetos\site-geef\.next'

# ou Git Bash
rm -rf .next
```

### Passo 2: Reiniciar Servidor
```bash
npm run dev
# Aguarde "Ready in XXXms"
```

### Passo 3: Acessar Página
```
http://localhost:3500/musicas/quanta-luz-28f689e1
```

### Passo 4: Verificar no Navegador

**Light Mode:**
- [ ] Letra visível em preto escuro
- [ ] Acordes visíveis
- [ ] Cabeçalho com titulo legível

**Dark Mode (Ctrl+Shift+D ou configurações):**
- [ ] Letra em **CREME CLARO** (#f4efe7)
- [ ] **NUNCA** branco puro
- [ ] **NUNCA** cinza pálido
- [ ] Acordes visíveis e claros

---

## ❌ Se Ainda Não Funcionar

### Diagnóstico 1: Servidor Respondendo?
```bash
curl -I http://localhost:3500/musicas/quanta-luz-28f689e1

# Esperado: HTTP/1.1 200 OK
```

### Diagnóstico 2: CSS Compilado?
```bash
# Abrir DevTools (F12) → Sources
# Procurar: app/layout.css?v=XXXXX
# Verificar se contém: "#f4efe7"
```

### Diagnóstico 3: Cache do Navegador
- **Ctrl+Shift+R** (Windows/Linux) ou **Cmd+Shift+R** (Mac)
- Ou: DevTools → Application → Clear all

### Diagnóstico 4: Dark Mode Ativado?
- Procurar "geef-theme" no localStorage
- Deve ser "dark"
- Ou testar em página `/admin/` que sempre usa dark

---

## 🚨 Problemas Conhecidos

### Problema 1: Servidor Caindo (CONNECTION_REFUSED)
**Sintoma:** Às vezes funciona, às vezes diz "conexão recusada"  
**Causa:** Possível memory leak ou processo travando  
**Solução:**
```bash
# Matar todos os processos node
taskkill /F /IM node.exe  # Windows
# ou
pkill -9 node             # Linux/Mac

# Limpar e reiniciar
rm -rf .next
npm run dev
```

### Problema 2: Cor Errada em Estrofes
**Se a letra estiver em branco ou cinza:**
1. Verificar DevTools → Inspect Element
2. Ver qual classe/ID está sendo aplicada
3. Reportar a classe faltando

### Problema 3: Teste Falhou, mas Código Correto
**Possível causa:** Build cache inválido
```bash
rm -rf .next node_modules/.cache
npm run dev
```

---

## 📊 Teste de Validação Automática

**Checklist para confirmar sucesso:**

- [ ] GET /musicas/quanta-luz-28f689e1 retorna 200
- [ ] Página carrega em < 5 segundos
- [ ] Letra está em creme claro em dark mode
- [ ] Sem erros no DevTools console
- [ ] Funciona em múltiplas páginas de música

---

## 📝 Notas para Próximas Mudanças

1. **Sempre testar visualmente** em dark mode ANTES de entregar
2. **Use QUALITY_CHECKLIST.md** antes de fazer commits
3. **Token #f4efe7** é a cor padrão para texto em dark mode (memória: identity-system.css)
4. **Componentes de música** precisam de regras CSS específicas

---

**Ultima atualização:** 2026-05-30 às 16:35 (UTC-3)  
**Status:** Em teste — aguardando validação do usuário
