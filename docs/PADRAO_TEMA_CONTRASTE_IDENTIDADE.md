# Padrão de Tema, Contraste e Identidade GEEF

## Objetivo

Este documento é a referência operacional para criar e alterar páginas, headers, botões, menus e estados visuais no GEEF sem quebrar contraste, consistência ou hierarquia.

## Fonte de Verdade

- `styles/identity-system.css` é a base dos tokens semânticos.
- `styles/globals.css`, `styles/admin.css`, `styles/admin-sidebar.css` e `styles/site-header.css` consomem os tokens.
- Quando um padrão novo for reutilizável, ele deve entrar nos tokens antes de ser copiado para um componente isolado.

## Princípios Gerais

- Um componente deve ter uma função visual clara: padrão, hover, foco, ativo, desabilitado.
- Não use cor decorativa para resolver contraste; use superfície, borda e texto em camadas.
- Não duplique regras de dark mode por página quando o token já existe.
- Evite misturar vários níveis de destaque na mesma área.
- Botão ativo deve parecer ativo sem perder legibilidade.

## Regras De Contraste

- Texto comum: mínimo WCAG AA, ideal 4.5:1.
- Texto grande, títulos e labels destacados: mínimo 3:1, preferencialmente acima de 4.5:1.
- Estado ativo de navegação: deve manter legibilidade imediata em light e dark.
- Botões e links de ação: nunca usar texto pálido sobre fundo pálido ou texto escuro sobre fundo escuro sem contraste suficiente.
- Ícones sem texto precisam de contorno, fundo ou tooltip para não depender só da cor.

## Contrato De Cada Tema

### Light

- Fundo mais claro que as superfícies.
- Superfícies levemente lavanda/brancas, nunca branco puro como padrão obrigatório.
- Texto principal escuro e texto secundário com contraste moderado.
- Ação primária usa roxo institucional.
- Ação secundária usa superfície clara com borda visível.

### Dark

- Fundo carvão/escuro com superfícies um pouco mais claras.
- Texto principal em creme claro.
- Texto secundário em bege frio, nunca cinza apagado.
- Ação primária continua evidente sem virar neon.
- Estado ativo precisa de fundo mais sólido que o estado normal e texto claro suficiente.

## Tokens Preferenciais

- Superfícies: `--surface-primary`, `--surface-secondary`, `--surface-tertiary`
- Texto: `--text-primary`, `--text-secondary`, `--text-muted`
- Bordas: `--border-light`, `--border-medium`, `--border-dark`
- Botões: `--btn-primary-*`, `--btn-secondary-*`, `--btn-tertiary-*`
- Navegação: `--nav-tab-*`
- Inputs: `--input-*`
- Status: `--status-*`
- Links e foco: `--link-*`, `--focus-*`

## Padrão De Botões

### Primário

- Uma ação principal por bloco.
- Fundo sólido ou gradiente forte.
- Texto sempre em alto contraste.
- Usar para salvar, enviar, concluir, publicar.

### Secundário

- Ação alternativa principal.
- Fundo de superfície com borda.
- Texto principal legível, sem competir com o primário.
- Usar para cancelar, voltar, ver mais, exportar.

### Terciário / Ghost

- Ação discreta.
- Fundo transparente ou quase transparente.
- Deve continuar legível em dark.
- Usar para ações de baixo peso visual.

### Perigo / Destrutivo

- Cor de erro com contraste suficiente.
- Nunca usar como botão neutro.
- Requer confirmação se a ação for irreversível.

### Ativo / Selecionado

- Precisa parecer selecionado sem se confundir com o fundo.
- Deve usar cor de superfície + borda + texto, não apenas saturação.
- Em dark, preferir fundo mais sólido e texto creme.

## Padrão De Header

### Header Público

- Marca à esquerda, navegação no centro, utilidades à direita.
- A superfície do header deve ser diferente do body.
- Links ativos devem ser discretos, mas legíveis.

### Header Admin

- Tabs do topo representam a área ativa.
- O tab ativo deve ter:
  - Fundo mais sólido que os demais.
  - Borda mais forte.
  - Texto principal claro e legível.
  - Sombra sutil para separar da barra.
- O tab inativo deve parecer navegável, não desativado.

## Padrão De Navegação

- Menu lateral e tabs superiores devem compartilhar o mesmo vocabulário de estados.
- O item ativo precisa funcionar como marcador de contexto, não como decoração.
- Hover não pode derrubar contraste.
- Focus visible deve ser perceptível em teclado.

## Checklist Para Nova Página

1. Definir a hierarquia: título, subtítulo, ação principal, conteúdo.
2. Escolher a superfície base da página.
3. Escolher o tipo de botão para cada ação.
4. Aplicar tokens semânticos, não hex fixo.
5. Validar estado ativo, hover e foco em light e dark.
6. Verificar contraste do texto principal, secundário e de labels.
7. Garantir que a página não dependa de uma cor para significar estado.

## Checklist Para Alteração De Página

- Se for novo componente reutilizável, criar token antes do CSS de componente.
- Se for exceção local, documentar o motivo.
- Se o estado ativo mudar, validar também hover e focus.
- Se o tema for tocado, revisar o header, o menu lateral e os botões da área.

## Não Fazer

- Não usar texto claro em fundo claro só porque a área está “ativa”.
- Não usar pure white como solução padrão de contraste.
- Não inventar um terceiro roxo ou verde fora da paleta base sem necessidade.
- Não duplicar o mesmo estado em várias folhas de CSS sem token comum.

## Ponto De Partida Para Novas Construções

- Primeiro consulte este documento.
- Depois consulte `styles/identity-system.css`.
- Se o padrão se repetir em mais de um lugar, o próximo passo é criar ou ampliar token.
- Se a mudança afetar header, navegação ou botões, testar em light e dark no mesmo fluxo.
