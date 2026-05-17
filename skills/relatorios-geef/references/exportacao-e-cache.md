# Exportação e Cache

## Exportação

- Use [lib/relatorios/pdf-export.ts](../../../lib/relatorios/pdf-export.ts) como base para HTML pronto para impressão ou PDF.
- Prefira exportar a visão consolidada, não cada card isolado.
- Mantenha título, período e origem do relatório no cabeçalho exportado.

## Cache

- Cache pode ajudar em relatórios pesados, mas não deve esconder atualização recente crítica.
- Se o relatório depende de dados mutáveis, revalide a página ou a tag do domínio após salvar.
- Se o relatório for executado por período, compartilhe a mesma janela temporal entre cards e tabelas.

## Boas práticas

- Não exporte algo que ainda não foi validado na tela.
- Se a exportação falhar, mostre aviso curto e preserve a tela atual.
- Evite criar múltiplas formas de exportar o mesmo conteúdo sem necessidade.
