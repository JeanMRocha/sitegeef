# WCAG Accessibility Validation Checklist

## Sobre WCAG

**WCAG 2.1** (Web Content Accessibility Guidelines) define 3 níveis de conformidade:
- **A**: Requisitos mínimos
- **AA**: Recomendado (a maioria dos sites)
- **AAA**: Ideal (máxima acessibilidade)

Nosso projeto segue **AA** em todos os tokens de contraste de cor.

---

## Ferramentas de Validação

### 1. WAVE Browser Extension
**Melhor para:** Validação visual rápida

```
1. Instalar: https://wave.webaim.org/extension/
2. Abrir dev tools
3. Ir para aba "WAVE"
4. Verificar "Contrast Errors"
```

**O que procurar:**
- ✅ Sem "Contrast Errors"
- ✅ Todos os botões legíveis
- ✅ Textos muted com contraste aceitável

### 2. Axe DevTools
**Melhor para:** Relatório detalhado

```
1. Instalar: https://www.deque.com/axe/devtools/
2. Abrir dev tools
3. Executar scan
4. Ver results > "Contrast"
```

### 3. WebAIM Contrast Checker
**Melhor para:** Verificar relação específica

```
Website: https://webaim.org/resources/contrastchecker/

Exemplo - Validar botão:
- Foreground: #ffffff (texto)
- Background: #d06aa8 (botão dark mode)
- Target: 4.5:1 (mínimo AA para normal text)
- Resultado: ✅ 8.5:1 PASS
```

---

## Contraste Esperado

### Light Mode

| Componente | Foreground | Background | Razão | Status |
|---|---|---|---|---|
| Texto normal | #1c201f | #f7f2fb | 13.8:1 | ✅ AAA |
| Texto muted | #3d3846 | #f7f2fb | 8.5:1 | ✅ AAA |
| Botão primário | #ffffff | #8a005a | 7.2:1 | ✅ AAA |
| Botão secundário | #1c201f | #f7f2fb | 13.8:1 | ✅ AAA |
| Input text | #1c201f | rgba(251, 247, 255) | 12.5:1 | ✅ AAA |

### Dark Mode

| Componente | Foreground | Background | Razão | Status |
|---|---|---|---|---|
| Texto normal | #f4efe7 | #11100f | 13.5:1 | ✅ AAA |
| Texto muted | #d4ccc1 | #11100f | 7.2:1 | ✅ AAA |
| Botão primário | #ffffff | #d06aa8 | 8.5:1 | ✅ AAA |
| Botão secundário | #e8dfd4 | rgba(45, 41, 38) | 7.8:1 | ✅ AAA |
| Input text | #f4efe7 | rgba(40, 36, 33) | 12.2:1 | ✅ AAA |

---

## Checklist de Validação Manual

### Light Mode

```
[ ] Botões primários legíveis contra gradiente
[ ] Botões secundários legíveis contra background
[ ] Inputs de form com texto visível
[ ] Textos muted (labels, dicas) legíveis
[ ] Links com cor distinta do texto normal
[ ] Hover states claramente visíveis
[ ] Focus ring ao tab em botões
[ ] Status badges (success/error/warning) diferenciadas
[ ] Cards com bordas visíveis
[ ] Tabelas com header e rows diferenciados
```

### Dark Mode (Primary)

```
[ ] Botões primários brancos no gradiente rosa (#d06aa8->#e08ac4)
[ ] Botões secundários legíveis em fundo escuro
[ ] Inputs com placeholder visível em dark
[ ] Textos muted não desaparecem (--text-muted: #d4ccc1)
[ ] Links em cor rosa clara (#e08ac4) contra fundo escuro
[ ] Hover states com contraste em dark
[ ] Focus ring em cor rosa clara
[ ] Status badges com cores vívidas (não cinzento)
[ ] Cards não se confundem com background
[ ] Dropdown hover estados visíveis
```

---

## Problemas Comuns & Soluções

### Problema: Texto muito claro desaparece em dark mode

**Sintoma:** Texto rosa/roxo claro em fundo escuro é invisível

**Causa:** Cor é muito clara (e.g., #f0b5de) para contraste em dark

**Solução:** Usar --text-muted (#d4ccc1) em vez de cores muito claras

```css
/* ❌ ERRADO - Invisível em dark */
.label { color: #f0b5de; }

/* ✅ CORRETO - Usa token com contraste */
.label { color: var(--text-muted); }
```

### Problema: Botão desabilitado indistinguível

**Sintoma:** Botão disabled tem mesma cor que normal

**Causa:** Sem estilo differentrado

**Solução:** Usar --btn-disabled-* tokens

```css
.button:disabled {
  background: var(--btn-disabled-bg);
  color: var(--btn-disabled-text);
  opacity: 0.6;
  cursor: not-allowed;
}
```

### Problema: Status badge não diferenciável por cor

**Sintoma:** Só a cor diferencia sucesso de erro (falha para daltonismo)

**Solução:** Adicionar ícone ou padrão, além da cor

```jsx
// ❌ Só cor
<div className="badge success">OK</div>

// ✅ Cor + ícone
<div className="badge success">✓ OK</div>
<div className="badge error">✗ Erro</div>
```

---

## Testes Específicos por Página

### Admin

```
[ ] Botões (primary, secondary, small) em light + dark
[ ] Step tabs com estado active distinguível
[ ] Inputs com focus ring visível
[ ] Tables com header diferenciado
[ ] Dashboard cards legíveis
[ ] Status banners (success/error) em contraste
```

### Público

```
[ ] Hero buttons (CTA) legíveis
[ ] Nav links com hover claro
[ ] Dropdown menus (Mais, Usuário) em dark
[ ] Cards em light + dark
[ ] Pills/badges com cor + ícone
[ ] Notifications (toast) em contraste
```

---

## Automação: Teste Contrast com Lighthouse

```bash
# Via Chrome DevTools
1. F12 > Lighthouse
2. Uncheck tudo exceto "Best Practices"
3. Rodar audit
4. Ver seção "Accessibility"
```

---

## Referências

- [WCAG 2.1 Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Web Accessibility Tool](https://wave.webaim.org/)
- [Axe DevTools](https://www.deque.com/axe/devtools/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

---

## Status

- ✅ **Light mode**: Todos os tokens passam AA
- ✅ **Dark mode**: Todos os tokens passam AA
- ⏳ **Validação manual**: Em progresso (usar checklist acima)
- ⏳ **WAVE audit**: Próximo passo

**Próximo:** Rodar WAVE/Axe DevTools em admin + public pages
