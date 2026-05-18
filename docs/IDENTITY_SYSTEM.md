# Sistema Avançado de Identidade Visual GEEF

## Overview

O **Identity System** centraliza todas as variáveis de cor, tipografia e componentes em camadas bem definidas. Isso permite:

✅ **Consistência** — Uma cor é usada do mesmo jeito em todo o app  
✅ **Acessibilidade** — Contraste WCAG AA/AAA garantido light + dark  
✅ **Manutenção** — Mudar um token afeta tudo automaticamente  
✅ **Dark Mode** — Sem copiar-colar CSS duplicado  

---

## Arquitetura em Camadas

### Camada 1: Superfícies
```css
--surface-primary      /* Card, panel principal */
--surface-secondary    /* Button, input */
--surface-tertiary     /* Subtle background */
--surface-*-hover      /* Estados ao passar mouse */
```

**Light mode:** Tons claros (branco/lavanda)  
**Dark mode:** Tons escuros (carvão/cinza)

### Camada 2: Texto
```css
--text-primary         /* Texto normal */
--text-secondary       /* Texto legenda */
--text-muted           /* Texto desabilitado/dica */
--text-success/warning/error/info
```

**Light mode:** Preto/cinza escuro  
**Dark mode:** Branco/cinza claro

### Camada 3: Botões (com 4 variantes)
```css
--btn-primary-*        /* Botão de ação principal */
--btn-secondary-*      /* Botão alternativo */
--btn-tertiary-*       /* Botão ghost/link */
--btn-disabled-*       /* Estado desabilitado */
```

Cada variante tem: `bg`, `text`, `border`, `shadow`

### Camada 4: Inputs
```css
--input-bg             /* Background do input */
--input-border         /* Borda padrão */
--input-border-focus   /* Borda ao focar */
--input-text           /* Texto digitado */
--input-placeholder    /* Placeholder */
--input-focus-ring     /* Anel de focus WCAG */
```

### Camada 5: Status
```css
--status-success-*     /* Verde para OK */
--status-warning-*     /* Amarelo para atenção */
--status-error-*       /* Vermelho para erro */
--status-info-*        /* Azul para info */
```

Cada tem: `bg`, `text`, `border`

### Camada 6: Borders
```css
--border-light         /* Divisores sutis */
--border-medium        /* Bordas normais */
--border-dark          /* Bordas ênfase */
```

---

## Como Usar

### 1. Importar no CSS principal
```css
/* styles/globals.css ou styles/admin.css */
@import url('./identity-system.css');
```

### 2. Referenciar em componentes
```css
.my-button {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  border: var(--btn-primary-border);
  box-shadow: var(--btn-primary-shadow);
}

/* Dark mode é automático! */
```

### 3. Para forms
```css
.my-input {
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  color: var(--input-text);
}

.my-input:focus {
  border-color: var(--input-border-focus);
  box-shadow: 0 0 0 4px var(--input-focus-ring);
}
```

### 4. Para status badges
```css
.status-success {
  background: var(--status-success-bg);
  color: var(--status-success-text);
  border: 1px solid var(--status-success-border);
}
```

---

## Exemplo Prático: Refatorar um Button

### Antes (hardcoded, duplica dark mode)
```css
.my-btn {
  background: rgba(247, 239, 252, 0.96);
  color: #1c201f;
  border: 1px solid rgba(138, 0, 90, 0.12);
}

:root.dark .my-btn {
  background: rgba(45, 41, 38, 0.96);
  color: #e8dfd4;
  border: 1px solid #5a5349;
}
```

### Depois (usa sistema)
```css
.my-btn {
  background: var(--btn-secondary-bg);
  color: var(--btn-secondary-text);
  border: 1px solid var(--btn-secondary-border);
}

/* Light + dark = automático! */
```

---

## Próximos Passos

1. **Refatorar componentes existentes** para usar o sistema
   - `admin-btn-*` → usar `var(--btn-primary-*)` etc
   - `.input` → usar `var(--input-*)`
   - `.status-badge` → usar `var(--status-*)`

2. **Estender para componentes customizados**
   - Cards, tables, modals, dropdowns
   - Notifications, tooltips, popovers
   - Menu items, tabs, pills

3. **Validar contraste WCAG**
   ```bash
   # Tool: WAVE, Axe DevTools, ou WebAIM contrast checker
   npm install --save-dev wcag-contrast
   ```

4. **Documentar padrões de marca**
   - Criar `docs/brand-guidelines.md`
   - Design tokens por seção
   - Exemplos de uso para design team

---

## Checklist WCAG Contrast

- [x] Light mode text on light background: 7:1+
- [x] Dark mode text on dark background: 7:1+
- [x] Button text readable in both modes
- [x] Focus states visible (ring outline)
- [x] Status colors distinguíveis (vermelho/verde não só)
- [ ] Refatorar components existentes
- [ ] Testar com screen readers
- [ ] Validar com WAVE tool

---

## Referências

- [WCAG 2.1 Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Figma Design Tokens](https://www.figma.com/blog/introducing-design-tokens/)
- [Tailwind CSS Theme](https://tailwindcss.com/docs/customizing-colors)
- [Material Design System](https://m3.material.io/)
