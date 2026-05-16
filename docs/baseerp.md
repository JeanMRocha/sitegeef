Documento de Especificação — Sistema Interno do GEEF

1. Objetivo geral

Criar um sistema web funcional para o Grupo Espírita Esperança e Fraternidade — GEEF, com área pública e área administrativa, para organizar as atividades institucionais, doutrinárias, administrativas, financeiras, documentais e operacionais da casa espírita.

O sistema não deve ser apenas um repositório de textos. Ele deve possuir cadastros, fluxos, permissões, relatórios, notificações, histórico de alterações, documentos vinculados e módulos operacionais reais.

Sempre que possível, a estrutura do sistema deve seguir as orientações dos documentos da FEB/OCE enviados, especialmente sobre centro espírita, atendimento espiritual, evangelização, estudos doutrinários, comunicação, assistência social, mediunidade, livro espírita, reuniões virtuais, voluntariado, administração e governança. A Orientação ao Centro Espírita organiza áreas como gestão, assistência social, atendimento espiritual, comunicação, palestras, passe e demais atividades do centro espírita.

2. Princípio estrutural do sistema

O sistema deve ter uma regra central:

Pessoa é o cadastro-base. Usuário é a pessoa que possui login. Perfil é a função que essa pessoa exerce no GEEF.

A mesma pessoa pode ser, ao mesmo tempo:

tarefeiro;
evangelizador;
aplicador de passe;
dirigente;
leitor da biblioteca;
comprador da livraria;
doador;
voluntário;
membro de diretoria;
responsável por criança;
participante de estudo;
usuário administrativo.

Isso evita duplicidade de cadastros.

3. Estrutura geral de áreas

O sistema deve conter as seguintes áreas principais:

Instituição
Pessoas
Usuários e permissões
Governança institucional
Departamentos e áreas funcionais
Documentos, LGPD, termos e consentimentos
Escalas
Atendimento espiritual
Evangelização infantil
Juventude / mocidade
Estudos doutrinários
Mediunidade
Biblioteca
Área do leitor
Livraria
APSE / Assistência e Promoção Social Espírita
Comunicação Social Espírita
Financeiro
Patrimônio
Reuniões virtuais
Planejamento estratégico
Notificações
Relatórios e painéis
Configurações gerais 4. Módulo Instituição
Finalidade

Centralizar os dados oficiais do GEEF para uso no site público, relatórios, recibos, documentos, rodapés, termos, escalas impressas e comunicações oficiais.

CRUDs necessários
4.1 Dados institucionais

Campos:

nome oficial;
nome curto;
CNPJ;
natureza jurídica;
data de fundação;
logo principal;
logo secundária;
descrição institucional;
história;
missão;
visão;
valores;
objetivos institucionais;
estatuto vigente;
regimento interno;
status da instituição.
4.2 Endereço

Campos:

CEP;
logradouro;
número;
complemento;
bairro;
cidade;
estado;
país;
ponto de referência;
link do Google Maps;
latitude;
longitude.
4.3 Contatos oficiais

Campos:

telefone principal;
WhatsApp;
e-mail institucional;
site;
Instagram;
Facebook;
YouTube;
responsável pelo contato;
tipo de contato: geral, secretaria, financeiro, biblioteca, evangelização, atendimento fraterno, comunicação.
4.4 Contas bancárias e PIX

Campos:

nome da conta;
banco;
agência;
conta;
tipo de conta;
titular;
CPF/CNPJ do titular;
chave PIX;
tipo da chave PIX;
finalidade: doações, livraria, eventos, manutenção, campanhas;
visibilidade pública: sim/não;
status: ativa/inativa.

Permissões:

público vê apenas dados autorizados;
financeiro vê dados completos;
administrador edita. 5. Módulo Pessoas
Finalidade

Criar um cadastro único de todas as pessoas relacionadas ao GEEF.

Tipos de vínculo

Uma pessoa pode ter um ou mais vínculos:

frequentador;
trabalhador/tarefeiro;
voluntário;
evangelizador;
criança;
jovem;
responsável legal;
leitor;
comprador;
doador;
assistido;
palestrante;
dirigente;
membro de departamento;
visitante.
Campos principais
nome completo;
nome social, se houver;
data de nascimento;
CPF, se necessário;
RG, se necessário;
telefone;
WhatsApp;
e-mail;
endereço;
cidade;
estado;
observações;
contatos de emergência;
status: ativo, inativo, falecido, afastado;
autorização para receber notificações;
autorização de uso de imagem/voz;
vínculo com responsável legal, se menor;
histórico de participação. 6. Módulo Usuários e Permissões
Finalidade

Controlar quem acessa o sistema e o que pode fazer.

Perfis sugeridos
administrador geral;
diretoria;
secretaria;
financeiro;
bibliotecário;
responsável pela livraria;
evangelizador;
coordenador de juventude;
coordenador de estudos;
coordenador de atendimento espiritual;
coordenador de passe;
coordenador de APSE;
comunicação;
patrimônio;
tarefeiro;
leitor;
voluntário;
público.
Regras
nem toda pessoa precisa ter login;
todo usuário precisa estar vinculado a uma pessoa;
cada perfil deve ter permissões específicas;
módulos sensíveis devem ter acesso restrito;
mediunidade, atendimento fraterno, financeiro, APSE e documentos legais exigem controle mais rigoroso. 7. Módulo Governança Institucional
Finalidade

Controlar diretoria, cargos, mandatos, eleições, assembleias, atas e conselhos.

CRUDs necessários
7.1 Diretorias

Campos:

nome da diretoria;
período de mandato;
data de início;
data de fim;
status: ativa, encerrada, substituída;
ata de eleição;
ata de posse;
observações.
7.2 Cargos

Exemplos:

presidente;
vice-presidente;
primeiro secretário;
segundo secretário;
primeiro tesoureiro;
segundo tesoureiro;
conselho fiscal;
conselho doutrinário;
coordenadores de departamentos.

Campos:

nome do cargo;
descrição;
departamento vinculado;
nível de permissão;
mandato obrigatório: sim/não.
7.3 Ocupação de cargos

Campos:

pessoa;
cargo;
diretoria;
data de início;
data de término;
motivo de saída;
documento vinculado;
status.
7.4 Eleições

Campos:

título da eleição;
data;
tipo: ordinária, extraordinária;
chapas;
candidatos;
resultado;
votantes;
ata;
observações.
7.5 Assembleias e atas

Campos:

tipo: AGO, AGE, reunião de diretoria, reunião de departamento;
data;
pauta;
participantes;
decisões;
responsáveis;
prazos;
ata em PDF;
status: rascunho, aprovada, arquivada.

O Manual de Administração das Instituições Espíritas traz referências diretas a atas, assembleias, diretoria, termo de posse, tesouraria, livro caixa, plano de contas e patrimônio.

8. Módulo Departamentos e Áreas Funcionais
   Finalidade

Organizar a casa espírita por áreas de trabalho.

Departamentos sugeridos
Gestão / Diretoria;
Secretaria;
Financeiro;
Doutrinário;
Atendimento Espiritual;
Passe;
Atendimento Fraterno;
Evangelização Infantil;
Juventude / Mocidade;
Estudos Doutrinários;
Mediunidade;
Biblioteca;
Livraria;
Comunicação Social Espírita;
APSE / Assistência Social;
Patrimônio;
Eventos;
Tecnologia / Site;
Reuniões Virtuais.
Campos
nome;
descrição;
coordenador;
vice-coordenador;
membros;
atividades vinculadas;
documentos;
reuniões internas;
metas;
status. 9. Módulo Documentos, LGPD, Termos e Consentimentos
Finalidade

Controlar documentos oficiais, termos assinados, consentimentos, políticas internas e conformidade.

CRUDs necessários
9.1 Modelos de documentos
termo de uso de imagem e voz adulto;
termo de uso de imagem e voz menor;
termo de voluntariado;
política de privacidade;
autorização para participação de menor;
autorização para comunicação via WhatsApp/e-mail;
termo de ciência para atividades específicas;
documentos estatutários;
regimento interno;
atas;
contratos;
certidões.

Os termos de imagem enviados preveem autorização de uso de imagem e voz em fotos, filmagens, redes sociais, sites, apresentações e outras mídias. O termo para menor inclui os dados do menor e do responsável legal.

9.2 Termos assinados

Campos:

pessoa;
responsável legal, se menor;
tipo de termo;
versão do termo;
data de assinatura;
validade;
arquivo assinado;
assinatura digital/manual;
status: ativo, revogado, vencido;
observações.
9.3 Consentimentos LGPD

Campos:

pessoa;
finalidade do tratamento de dados;
base legal;
canal autorizado;
data do consentimento;
data de revogação;
status;
histórico.
9.4 Serviço voluntário

Campos:

voluntário;
departamento;
serviço prestado;
dias e horários;
local;
termo assinado;
início;
fim;
status.

O termo de adesão ao serviço voluntário traz identificação da instituição, voluntário, responsável se menor, dias/horários/local do serviço e declaração de ausência de vínculo trabalhista.

10. Módulo Escalas
    Finalidade

Montar, revisar, publicar e imprimir as escalas mensais do GEEF.

Escalas necessárias
10.1 Escala de reunião pública

Funções:

recepção;
dirigente;
apoio;
paginista;
prece inicial;
prece final.
10.2 Escala de aplicadores de passe

Campos:

data;
aplicadores;
coordenador;
substituições;
observações.
10.3 Escala de evangelização

Campos:

data;
evangelizadores;
turma;
tema;
material necessário;
observações.
10.4 Escala de palestras

Campos:

data;
expositor;
cidade;
tema;
tipo de palestra;
observações.
Funcionalidades
gerar datas automaticamente por mês;
copiar escala do mês anterior;
montar escala por arrastar/selecionar pessoas;
impedir conflito de pessoa no mesmo horário;
registrar substituição;
revisar antes de publicar;
publicar no site;
gerar PDF;
imprimir em formato tradicional;
enviar aviso para escalados. 11. Módulo Atendimento Espiritual
Finalidade

Controlar a recepção, atendimento fraterno, passe, irradiação, Evangelho no Lar e encaminhamentos.

A orientação de Atendimento Espiritual trata de recepção, atendimento fraterno, Evangelho no Lar, irradiação mental e atendimento pelo passe como atividades próprias da área.

Submódulos
11.1 Recepção

Campos:

data;
trabalhadores escalados;
pessoas atendidas;
motivo geral da procura;
encaminhamento;
observações.
11.2 Atendimento fraterno

Campos:

pessoa atendida;
atendente;
data;
tipo de atendimento;
encaminhamento;
observações restritas;
sigilo;
status.
11.3 Passe

Campos:

equipe;
aplicadores;
escala;
pessoas atendidas, se necessário;
observações gerais.
11.4 Evangelho no Lar

Campos:

solicitante;
endereço;
equipe;
data;
situação;
observações.
11.5 Irradiação

Campos:

solicitante;
nome para irradiação;
motivo resumido;
período;
status;
confidencialidade. 12. Módulo Evangelização Infantil
Finalidade

Gerenciar crianças, responsáveis, turmas, temas, presença, materiais e autorizações.

A orientação da infância trata da criança, ação evangelizadora, papel da família, perfil do evangelizador e qualidade doutrinária, relacional, pedagógica e organizacional.

CRUDs
12.1 Crianças

Campos:

pessoa vinculada;
responsável legal;
data de nascimento;
restrições ou observações relevantes;
autorizações assinadas;
turma;
status.
12.2 Responsáveis

Campos:

pessoa;
vínculo com criança;
telefone;
autorização de retirada;
autorização de imagem;
consentimento de comunicação.
12.3 Turmas

Campos:

nome;
faixa etária;
evangelizadores;
horário;
sala;
capacidade;
status.
12.4 Aulas / encontros

Campos:

data;
turma;
tema;
evangelizadores;
material;
presença;
observações. 13. Módulo Juventude / Mocidade
Finalidade

Controlar grupos de jovens, encontros, presença, atividades, integração e acompanhamento.

A orientação da juventude trata do protagonismo jovem, ação evangelizadora, papel da família, perfil do evangelizador/coordenador, qualidade da tarefa, espaços de ação jovem e integração do jovem nas atividades do centro.

CRUDs
jovens;
grupos;
encontros;
temas;
coordenadores;
presença;
atividades sociais;
atividades doutrinárias;
integração em tarefas da casa;
autorização de responsáveis, quando necessário. 14. Módulo Estudos Doutrinários
Finalidade

Controlar cursos, grupos de estudo, participantes, facilitadores, cronogramas, frequência e avaliação.

Programas sugeridos
IEE — Introdução ao Estudo do Espiritismo;
ESDE — Estudo Sistematizado da Doutrina Espírita;
EOB — Estudo da Obra Básica;
EADE — Estudo Aprofundado da Doutrina Espírita;
outros estudos.

A orientação da Área de Estudo do Espiritismo apresenta IEE, ESDE, EOB, EADE e outros estudos como programas de organização da área.

CRUDs
cursos;
turmas;
módulos;
aulas;
facilitadores;
participantes;
frequência;
material de apoio;
avaliações;
certificados internos, se houver. 15. Módulo Mediunidade
Finalidade

Gerenciar grupos mediúnicos com controle restrito de acesso.

Regras

Este módulo deve ser privado e visível apenas a usuários autorizados.

A orientação de prática mediúnica trata da organização da reunião, equipe mediúnica, admissão de participantes, afastamento e visitantes.

CRUDs
grupos mediúnicos;
participantes autorizados;
coordenadores;
reuniões;
frequência;
critérios de admissão;
afastamentos;
visitantes;
documentos internos;
observações restritas. 16. Módulo Biblioteca
Finalidade

Controlar obras, exemplares, empréstimos, devoluções, atrasos e reservas.

CRUDs
16.1 Obras

Campos:

título;
autor;
editora;
categoria;
ISBN;
sinopse;
capa;
público: adulto, jovem, infantil;
tema;
status.
16.2 Exemplares

Campos:

obra;
código interno;
estado de conservação;
localização;
origem: compra, doação, acervo antigo;
situação: disponível, emprestado, reservado, danificado, perdido.
16.3 Empréstimos

Campos:

leitor;
exemplar;
data de retirada;
data prevista de devolução;
data real de devolução;
status: em aberto, devolvido, atrasado, perdido, danificado;
observações.
16.4 Reservas

Campos:

leitor;
obra;
data da reserva;
posição na fila;
status: aguardando, disponível, cancelada, atendida. 17. Módulo Área do Leitor
Finalidade

Permitir que o próprio leitor acompanhe seus livros.

Funcionalidades
login do leitor;
meus livros emprestados;
quantidade de livros comigo;
prazo de devolução;
livros atrasados;
histórico de empréstimos;
reservas;
renovação de empréstimo, se permitido;
preferências de notificação;
atualização de dados básicos. 18. Módulo Livraria
Finalidade

Controlar livros e materiais destinados à venda ou doação.

O documento sobre o livro espírita e sustentabilidade trata da operação livreira e do papel do livro espírita na sustentabilidade do movimento.

CRUDs
18.1 Produtos

Campos:

obra/produto;
categoria;
quantidade em estoque;
valor de custo;
valor de venda;
estoque mínimo;
status.
18.2 Movimentações

Tipos:

entrada;
venda;
doação recebida;
doação realizada;
baixa por perda;
baixa por dano;
transferência para biblioteca.
18.3 Vendas

Campos:

comprador;
produto;
quantidade;
valor unitário;
desconto;
forma de pagamento;
status do pagamento;
vínculo financeiro.

Regra: o estoque da biblioteca e o estoque da livraria devem ser separados.

19. Módulo APSE / Assistência e Promoção Social Espírita
    Finalidade

Controlar ações de assistência social, famílias assistidas, campanhas, benefícios, visitas e relatórios sociais.

CRUDs
famílias assistidas;
pessoas assistidas;
visitas;
campanhas;
cestas ou benefícios;
doações recebidas;
doações entregues;
voluntários da APSE;
relatórios sociais;
encaminhamentos;
documentos de apoio.

A orientação da APSE foi produzida pela Coordenação Nacional da Área de Assistência e Promoção Social Espírita e serve como referência para estruturar a área.

20. Módulo Comunicação Social Espírita
    Finalidade

Organizar comunicação interna e externa do GEEF.

A orientação de comunicação social espírita trata de divulgação, comunicação interna/externa, mídia impressa, cartazes, folders, jornal, mural, internet e redes sociais.

CRUDs
publicações;
agenda editorial;
campanhas;
cartazes;
redes sociais;
fotos;
vídeos;
autorizações de imagem vinculadas;
revisores;
status: rascunho, em revisão, aprovado, publicado, arquivado.
Funcionalidades
calendário de publicações;
controle de aprovação;
banco de imagens autorizadas;
vínculo com eventos e escalas;
histórico de divulgação. 21. Módulo Financeiro
Finalidade

Controlar entradas, saídas, centros de custo, contas, doações, vendas e prestação de contas.

CRUDs
21.1 Plano de contas

Campos:

código;
nome;
tipo: receita, despesa, ativo, passivo;
centro de custo;
status.
21.2 Entradas

Exemplos:

doações;
venda de livros;
contribuições;
eventos;
campanhas.
21.3 Saídas

Exemplos:

compra de livros;
materiais;
água;
luz;
internet;
manutenção;
assistência social;
eventos.
21.4 Centros de custo
biblioteca;
livraria;
evangelização;
APSE;
manutenção;
comunicação;
patrimônio;
estudos;
eventos.
21.5 Relatórios financeiros
livro caixa;
balancete mensal;
demonstrativo anual;
relatório por centro de custo;
prestação de contas para diretoria/conselho fiscal. 22. Módulo Patrimônio
Finalidade

Controlar bens da instituição.

CRUDs
bens patrimoniais;
equipamentos;
móveis;
livros patrimoniais;
materiais da evangelização;
equipamentos de som;
computadores;
utensílios;
localização;
estado de conservação;
responsável;
data de aquisição;
valor;
termo de doação, se aplicável;
baixa patrimonial. 23. Módulo Reuniões Virtuais
Finalidade

Controlar reuniões online com segurança e organização.

Os materiais de reuniões virtuais orientam preparação, uso de links controlados, senha, sala de espera e cuidados com participantes.

CRUDs
reunião virtual;
plataforma: Zoom, Jitsi, Google Meet, outra;
link;
senha;
anfitrião;
coanfitrião;
participantes;
checklist de segurança;
gravação;
status;
incidentes.
Checklist mínimo
link enviado apenas a grupo controlado;
senha definida;
sala de espera ativada, se houver;
anfitrião definido;
gravação autorizada;
participantes orientados;
chat e compartilhamento configurados. 24. Módulo Planejamento Estratégico
Finalidade

Transformar diretrizes em ações práticas, metas, responsáveis e acompanhamento.

O Plano de Trabalho 2023–2027 traz diretrizes como difusão da doutrina, preservação da unidade, integração das áreas, sustentabilidade, formação continuada, promoção do livro espírita, juventude, inclusão e acessibilidade.

CRUDs
diretrizes;
objetivos;
metas;
ações;
responsáveis;
prazos;
indicadores;
andamento;
avaliação;
relatório anual.
Status das ações
planejada;
em execução;
atrasada;
concluída;
cancelada;
suspensa. 25. Módulo Notificações
Finalidade

Enviar avisos internos e externos.

Tipos de notificação
escala publicada;
lembrete de tarefa;
lembrete de reunião;
livro próximo do vencimento;
livro atrasado;
reserva disponível;
reunião virtual;
campanha da APSE;
pendência financeira;
documento vencendo;
termo pendente;
aniversário;
convocação de assembleia.
Canais
painel interno;
e-mail;
WhatsApp;
SMS, se futuramente necessário.
Campos
destinatário;
canal;
assunto;
mensagem;
data programada;
status: pendente, enviada, falhou, lida;
módulo de origem. 26. Módulo Relatórios e Painéis
Finalidade

Gerar visão de gestão para a diretoria.

Relatórios necessários
26.1 Institucional
dados cadastrais;
documentos vigentes;
documentos vencidos;
diretorias e mandatos;
atas por período.
26.2 Escalas
escala mensal;
pessoas escaladas;
substituições;
frequência por tarefeiro;
impressão em PDF.
26.3 Biblioteca
livros cadastrados;
exemplares disponíveis;
exemplares emprestados;
livros atrasados;
leitores com pendência;
livros mais emprestados.
26.4 Livraria
estoque;
vendas;
doações;
produtos com estoque baixo;
movimentações.
26.5 Financeiro
entradas;
saídas;
saldo;
livro caixa;
centros de custo;
prestação de contas.
26.6 Evangelização
crianças cadastradas;
turmas;
presença;
temas;
autorizações pendentes.
26.7 Estudos
turmas;
participantes;
frequência;
facilitadores;
conclusão de módulos.
26.8 APSE
famílias assistidas;
atendimentos;
benefícios entregues;
campanhas;
relatórios sociais.
26.9 Comunicação
publicações;
campanhas;
aprovações;
imagens autorizadas.
26.10 Planejamento
metas em andamento;
metas atrasadas;
metas concluídas;
responsáveis;
relatório anual. 27. Regras gerais de funcionamento

Todos os módulos devem seguir o mesmo padrão:

27.1 CRUD completo

Cada módulo deve permitir:

cadastrar;
editar;
listar;
visualizar;
arquivar;
reativar, quando aplicável.
27.2 Fluxo de status

Sempre que fizer sentido, usar:

rascunho;
em revisão;
aprovado;
publicado;
encerrado;
arquivado.
27.3 Histórico

Registrar:

quem criou;
quem editou;
data da alteração;
campo alterado;
valor anterior;
valor novo.
27.4 Permissões

Cada ação deve respeitar:

quem pode visualizar;
quem pode criar;
quem pode editar;
quem pode aprovar;
quem pode publicar;
quem pode excluir/arquivar.
27.5 Documentos vinculados

Permitir anexar:

PDF;
imagem;
documento assinado;
ata;
termo;
comprovante;
foto;
autorização.
27.6 Exportação

Permitir exportar:

PDF;
Excel/CSV;
impressão A4;
relatórios por período. 28. Área pública do site
Páginas públicas
página inicial;
sobre o GEEF;
história;
missão, visão e valores;
endereço e contato;
horários de atividades;
escala publicada;
palestras;
evangelização;
biblioteca/livraria, se desejado;
campanhas;
doações;
notícias;
eventos;
documentos públicos;
política de privacidade.
Regras
somente informações aprovadas e publicadas aparecem ao público;
dados pessoais não devem aparecer sem autorização;
imagens só devem ser exibidas se houver autorização de uso de imagem. 29. Área administrativa
Painel inicial

Mostrar:

próximas escalas;
pendências;
livros atrasados;
documentos vencendo;
reuniões futuras;
ações em atraso;
notificações;
resumo financeiro;
aniversariantes;
tarefas da semana.
Menu administrativo sugerido
Instituição
Pessoas
Usuários
Governança
Departamentos
Escalas
Atendimento Espiritual
Evangelização
Juventude
Estudos
Mediunidade
Biblioteca
Livraria
APSE
Comunicação
Financeiro
Patrimônio
Documentos / LGPD
Reuniões Virtuais
Planejamento
Notificações
Relatórios
Configurações 30. Ordem incremental de construção
Fase 1 — Base obrigatória
Instituição
Pessoas
Usuários e permissões
Departamentos
Documentos / LGPD / Termos
Fase 2 — Operação atual do GEEF
Escalas
Palestras
Passe
Evangelização infantil
Área pública das escalas
PDF/impressão
Fase 3 — Biblioteca e leitor
Obras
Exemplares
Empréstimos
Devoluções
Reservas
Área do leitor
Notificações de prazo
Fase 4 — Livraria e financeiro
Estoque da livraria
Vendas
Doações
Livro caixa
Centros de custo
Relatórios financeiros
Fase 5 — Gestão doutrinária e assistencial
Atendimento espiritual
Estudos doutrinários
Juventude
APSE
Comunicação
Fase 6 — Governança avançada
Diretoria
Eleições
Assembleias
Atas
Patrimônio
Planejamento estratégico
Fase 7 — Módulos restritos e avançados
Mediunidade
Reuniões virtuais
Relatórios gerais
Auditoria completa
Notificações automáticas 31. Requisitos técnicos gerais

O agente deve criar o sistema considerando:

arquitetura modular;
banco de dados relacional;
cadastro único de pessoas;
permissões por papel;
histórico de alterações;
soft delete/arquivamento;
anexos por módulo;
exportação em PDF;
interface responsiva;
área pública e área privada;
segurança de dados pessoais;
logs de auditoria;
filtros por mês, ano, departamento, pessoa e status;
possibilidade de expansão futura. 32. Regra principal para o agente

Não criar módulos soltos e duplicados.

A estrutura correta é:

Instituição → Pessoas → Usuários/Permissões → Departamentos → Módulos operacionais → Documentos/Consentimentos → Relatórios.

Todos os módulos devem se conectar ao cadastro de pessoas, respeitar permissões e permitir histórico. O sistema deve ser prático para a diretoria montar escalas, controlar biblioteca, organizar atividades, acompanhar documentos, gerir financeiro e manter a casa espírita funcionando com ordem, segurança e continuidade.
