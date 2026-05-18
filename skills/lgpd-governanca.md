# LGPD e Governança de Dados GEEF

## Objetivo

Definir o padrão obrigatório do projeto GEEF para tratar dados pessoais e dados pessoais sensíveis de forma minimamente compatível com a LGPD, com revisão explícita, gates de aprovação e persistência de evidências.

Use esta skill sempre que a mudança tocar coleta, leitura, armazenamento, compartilhamento, exportação, retenção, exclusão, logs, cookies, analytics, autenticação, recuperação de senha, atendimento, documentos, relatórios, integrações ou qualquer fluxo com dados de pessoas.

## Aviso

Esta skill não substitui parecer jurídico. Ela organiza o trabalho técnico para reduzir risco e tornar a conformidade auditável. Se houver dúvida material sobre base legal, retenção, compartilhamento, dado sensível ou incidente, pare e peça validação humana responsável.

## Base legal mínima

Fontes oficiais para esta skill:

- Lei nº 13.709/2018 no Planalto: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- ANPD, incidente de segurança e prazo de comunicação: https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis
- ANPD, atuação do encarregado: https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-aprova-norma-sobre-a-atuacao-do-encarregado-pelo-tratamento-de-dados-pessoais

Pontos que orientam a implementação:

- Princípios gerais da LGPD: finalidade, adequação, necessidade, livre acesso, qualidade dos dados, transparência, segurança, prevenção, não discriminação, responsabilização e prestação de contas.
- Base legal deve existir antes da coleta ou uso, e deve ser registrada por caso de uso.
- Dados sensíveis exigem cuidado reforçado.
- O titular tem direitos de confirmação, acesso, correção, anonimização, portabilidade quando aplicável, eliminação, informação sobre compartilhamentos e revogação.
- Incidentes com risco ou dano relevante devem ser tratados com fluxo formal de resposta e comunicação.

## Regra específica do projeto

O GEEF é uma organização de natureza religiosa. Por isso:

- qualquer dado que revele ou permita inferir convicção religiosa, participação em atividades religiosas, grupos, atendimentos espirituais ou histórico de envolvimento com a comunidade deve ser tratado como dado sensível ou como dado com risco elevado;
- campos livres, observações e anexos precisam de revisão para evitar captura indevida de informação sensível;
- relatórios, exportações e listas devem ser estritamente limitados ao necessário;
- informações de crianças e adolescentes só podem existir com necessidade real, linguagem clara e checagem adicional de legitimidade;
- dados de saúde, assistência social, acolhimento, pedido de ajuda, aconselhamento ou vulnerabilidade social exigem revisão reforçada.

## Papéis

### Controlador

O projeto age como controlador quando define a finalidade e os meios do tratamento.

### Operador

Terceiros que processam dados em nome do projeto são operadores e precisam de contrato, escopo e obrigação de segurança.

### Encarregado / ponto focal

Todo fluxo LGPD do projeto precisa ter um responsável nomeado em documento ou no handoff para receber dúvidas, pedidos e incidentes. Se o encarregado formal ainda não existir, o projeto deve registrar um ponto focal provisório e a lacuna deve permanecer visível até ser resolvida.

### Revisor LGPD

Toda mudança sensível precisa de um revisor explícito. Sem revisor, o gate não passa.

O revisor confere:

- base legal;
- necessidade real da coleta;
- texto de privacidade e consentimento;
- retenção e descarte;
- compartilhamento externo;
- logs e trilha de auditoria;
- impacto em dados sensíveis;
- segurança mínima e controle de acesso.

## Gates obrigatórios

### Gate 1 - Classificação

Antes de codar, classifique o dado:

- pessoal comum;
- sensível;
- de criança ou adolescente;
- financeiro;
- autenticação;
- operacional/telemetria;
- anonimizado de verdade.

Se a classificação não estiver clara, o trabalho para.

### Gate 2 - Finalidade

Registre a finalidade em uma frase objetiva.

Exemplo:

- “Permitir cadastro e gestão de participantes de um grupo”.
- “Emitir recibo e controlar contribuições”.
- “Enviar recuperação de acesso solicitada pelo titular”.

Se não houver finalidade clara, não coletar.

### Gate 3 - Base legal

Toda coleta ou uso precisa de base legal documentada.

O revisor deve apontar:

- artigo usado;
- por que a base é adequada;
- se há alternativa menos invasiva;
- se o uso futuro é compatível com a finalidade original.

### Gate 4 - Minimização

Coletar só o necessário.

Bloqueios:

- campo opcional sem utilidade concreta;
- texto livre onde um enum resolve;
- upload desnecessário de documentos;
- exportação em massa sem motivo;
- uso de dados reais em ambiente de teste.

### Gate 5 - Transparência

Toda coleta relevante precisa de aviso claro.

O projeto deve atualizar:

- aviso de privacidade;
- texto do formulário;
- consentimento, quando consentimento for a base;
- texto de email e páginas públicas se o fluxo mudar.

### Gate 6 - Segurança

Toda nova rota, action, job ou tabela sensível precisa responder sim a:

- acesso controlado por autenticação e permissão;
- RLS ou controle equivalente;
- service role somente no servidor e com motivo claro;
- logs sem conteúdo sensível bruto;
- criptografia em trânsito;
- segredo fora do código;
- menor privilégio.

### Gate 7 - Retenção e descarte

O fluxo precisa dizer:

- quanto tempo guardar;
- por que guardar;
- quando eliminar;
- como anonimizar ou agregar;
- quem autoriza exceção.

Sem retenção definida, o dado não pode ficar “para sempre”.

### Gate 8 - Direitos do titular

Se o fluxo tocar pedidos de titular, a implementação deve permitir:

- localizar o dado;
- exportar em formato útil;
- corrigir;
- restringir quando aplicável;
- excluir quando cabível;
- registrar a resposta;
- guardar evidência do atendimento.

### Gate 9 - Compartilhamento externo

Qualquer integração com Resend, storage, analytics, automação, planilhas, webhooks, apps de chat ou outro fornecedor precisa de:

- justificativa;
- lista do que sai;
- base legal;
- contrato ou termo aplicável;
- revisão de risco;
- confirmação de que não está enviando dado sensível sem necessidade.

### Gate 10 - Incidente

Se houver suspeita de incidente com dados pessoais:

- parar o vazamento;
- conter o acesso;
- registrar hora, sistema e escopo;
- preservar evidência;
- mapear quais dados e quantos titulares;
- acionar o revisor e o responsável;
- preparar comunicação para ANPD e titulares quando houver risco ou dano relevante;
- não apagar trilha de evidência.

## Persistência obrigatória

Nenhuma decisão LGPD pode ficar só em conversa.

Persistir sempre em pelo menos um destes lugares:

- `docs/lgpd/decision-log.md`
- `docs/lgpd/inventario-tratamentos.md`
- `docs/lgpd/bases-legais.md`
- `docs/lgpd/retencao.md`
- `docs/lgpd/pedidos-titular.md`
- `docs/lgpd/incidentes.md`
- `HANDOFF.md` quando a decisão impactar o próximo turno
- uma tabela de auditoria append-only no banco, se o fluxo for operacionalizado no produto

Regras de persistência:

- usar data absoluta;
- citar o módulo afetado;
- registrar quem aprovou;
- registrar a base legal escolhida;
- registrar o motivo da decisão;
- registrar link ou caminho da evidência;
- versionar mudanças de texto de privacidade e consentimento;
- nunca gravar segredos, tokens ou dump completo de dados sensíveis em markdown.

## Estrutura de evidência

Cada item de conformidade deve ter, no mínimo:

- `modulo`
- `finalidade`
- `tipo_de_dado`
- `base_legal`
- `risco`
- `controles`
- `retencao`
- `responsavel`
- `revisor`
- `evidencia`
- `status`

## Fluxo de implementação

1. Identificar se o caso toca dado pessoal.
2. Classificar se é sensível, de menor, financeiro ou apenas operacional.
3. Definir finalidade e base legal.
4. Reduzir a coleta ao mínimo.
5. Verificar permissões, RLS, validação e logs.
6. Atualizar aviso de privacidade e textos de interface.
7. Definir retenção e descarte.
8. Checar fornecedores e compartilhamentos.
9. Criar ou atualizar a trilha de evidência.
10. Revisar com o Revisor LGPD.
11. Só então liberar merge ou deploy.

## Checklist de revisão

- [ ] O dado coletado é realmente necessário
- [ ] A finalidade está escrita em linguagem simples
- [ ] A base legal está documentada
- [ ] Dados sensíveis foram identificados
- [ ] Há retenção ou descarte definido
- [ ] O fluxo de direitos do titular existe ou foi marcado como pendência
- [ ] Nenhum log expõe dado bruto desnecessário
- [ ] Segredo não ficou no cliente
- [ ] Terceiros estão listados e justificados
- [ ] Aviso de privacidade e textos públicos foram atualizados
- [ ] Evidência foi persistida
- [ ] Revisor LGPD aprovou

## Checklist de aceite para PR

O PR só entra se houver:

- descrição da mudança de tratamento de dados;
- impacto em privacidade;
- impacto em retenção;
- impacto em logs e integrações;
- prova de teste ou validação;
- decisão persistida em documento ou tabela;
- referência ao revisor.

## Padrões de implementação no GEEF

### Formulários

- usar campos mínimos;
- deixar claro o motivo do dado;
- não usar defaults enganosos;
- esconder dados sensíveis do que não precisa ver;
- evitar autocomplete desnecessário para campos críticos.

### Admin / ERP

- restringir colunas visíveis por perfil;
- limitar exportação;
- separar permissões de leitura, edição e deleção;
- logar acesso a dados sensíveis quando fizer sentido;
- não reutilizar telas de negócio para exposição de dados de privacidade sem necessidade.

### Logs e observabilidade

- não registrar payload completo de request com dados pessoais;
- mascarar CPF, email, telefone e qualquer identificador quando possível;
- guardar apenas o necessário para depuração;
- manter trilha separada para auditoria quando o evento for de conformidade.

### Email e notificações

- mensagens devem ser claras e curtas;
- não vazar dado sensível no assunto;
- recuperação de senha e avisos de conta precisam validar legitimidade;
- tracking de abertura/clique só com avaliação de necessidade e transparência.

### Integrações

- toda integração precisa de inventário;
- toda exportação precisa de justificativa;
- todo fornecedor precisa de revisão de acesso e retenção;
- nenhum fornecedor recebe mais dado do que precisa.

### Banco de dados

- RLS para dados sensíveis;
- service role apenas no servidor;
- tabela de auditoria append-only para eventos relevantes;
- policies documentadas;
- migrações com descrição do impacto em privacidade.

## Resposta padrão quando a LGPD for incerta

Se a implementação não conseguir responder com segurança:

- o dado é necessário?
- qual a base legal?
- o titular sabe?
- quem acessa?
- quanto tempo fica?
- como sai?
- quem aprova?

Então a mudança deve parar até haver resposta.

## Referências legais úteis

- Lei nº 13.709/2018, texto oficial
- Art. 5º: conceito de dado pessoal, dado sensível e tratamento
- Art. 6º: princípios
- Art. 7º e Art. 11: bases legais
- Art. 14: criança e adolescente
- Art. 18: direitos do titular
- Art. 37: registro das operações
- Art. 41: encarregado
- Art. 46: segurança
- Art. 48: incidente de segurança
- Art. 50: boas práticas e governança

## Resultado esperado

Ao final de uma mudança coberta por esta skill, deve existir:

- implementação técnica compatível com a finalidade declarada;
- revisão explícita;
- gates aprovados ou pendências registradas;
- evidência persistida;
- risco remanescente visível.
