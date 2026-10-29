# Lista de Contatos — contexto para sessões

Atualizado em: 2026-10-28 (America/Sao_Paulo).
Este arquivo registra decisões e evidências da sessão; confirme o estado real
antes de executar uma tarefa. Não é uma ordem para iniciar trabalho automaticamente.

## Leitura inicial

1. Leia `AGENTS.md`, este arquivo e a solicitação atual do usuário.
2. Confira `git status --short`, branch e commits recentes nos repositórios envolvidos.
3. Inspecione os arquivos da próxima tarefa e confira se ela já foi concluída.
4. Preserve alterações existentes. Faça staging explícito e mantenha escopo pequeno.
5. Use as evidências abaixo como histórico, nunca como validação do checkout atual.

## Projeto e objetivo

Portfólio full stack para gerenciamento de contatos, direcionado a demonstrar
competências de nível pleno com decisões justificadas, tratamento de falhas,
testes e execução reproduzível. Evolução incremental com Angular e Spring Boot.
Interface atual em Bootstrap; demonstração local, sem hospedagem nesta etapa.

Repositórios:
- Frontend: https://github.com/leomoraesitu/lista-contatos-frontend
- Backend: https://github.com/leomoraesitu/lista-contatos-backend

Checkout desta máquina: `~/Documents/Dev/Portfolio/lista-contatos-frontend` e
`~/Documents/Dev/Portfolio/lista-contatos-backend`. Em outra máquina, confirme os
caminhos. O backend é um repositório separado e pode exigir acesso adicional.

## Arquitetura e contratos atuais

- Frontend Angular 16, TypeScript 5.1.6, RxJS 7.8 e Bootstrap 5; mantém `AppModule`.
- Organização por funcionalidade em `src/app/features/contatos`: modelo, serviço,
  componente, template, estilos e testes juntos.
- Componente coordena formulário, pesquisa, coleção completa e estados da tela.
  Serviço executa HTTP; modelo define `Contato`. Sem NgRx ou camadas adicionais.
- Backend Java 21, Spring Boot 4.1.2, Spring Data JPA e H2 em memória;
  organização controller → service → repository, com injeção por construtor no
  controller e no serviço. POST e PUT recebem o record `dto.ContatoRequest`, convertido para entidade no controller.
  O DTO contém os sete campos de entrada com `@NotBlank` e ignora explicitamente
  `id`; as validações da entidade foram mantidas. POST gera o ID e PUT usa o da URL.
- API em `http://127.0.0.1:8080/contatos`; URL fixa no serviço Angular.
- GET da coleção retorna array; GET por ID retorna objeto; POST retorna `201`,
  contato e `Location`; PUT retorna `200` sem corpo; DELETE retorna `204`.
- Campos: `id`, `name`, `email`, `telefone`, `endereco`, `cidade`, `cep`, `estado`.
- H2: `jdbc:h2:mem:testdb`, usuário local `sa`, senha vazia; perde dados ao encerrar.
  A carga inicial é reaplicada. Não usar dados reais em demonstrações ou testes.

## Ambiente e execução

- macOS Apple Silicon, Homebrew em `/opt/homebrew`, Zsh.
- Node 18.20.8 via fnm, npm 10.8.2 e JDK 21. Node 18 está fora de manutenção;
  é utilizado para reproduzir Angular 16, não como destino de modernização.
- `~/.zshrc` inicializa `fnm env --shell zsh`; fnm tem Node 18 como padrão.
- `~/.zprofile` define `JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home`
  e prioriza `$JAVA_HOME/bin`. Confirme as versões em novos terminais.
- Frontend: `npm ci`, depois `npm start` em `http://localhost:4200`.
- Backend: `bash ./mvnw spring-boot:run`; wrapper usa Maven 3.9.5.
- Não é necessário Maven/Angular CLI global, Docker ou banco externo no estado atual.
- Não há carregamento de `.env`. Analytics Angular desativado em `angular.json`.
- `.vscode/settings.json` aponta para TypeScript local e desativa o servidor
  experimental. Se necessário, selecione a versão 5.1.6 pela paleta do editor.

## Estado atual

- Documentação de portfólio e bootstrap incorporada nos PRs #1 dos dois repositórios.
  Logos e apresentação acadêmica removidos dos READMEs; links de vídeo preservados.
- Frontend PR #2 incorporado à `main`: commit `06e187a`.
  https://github.com/leomoraesitu/lista-contatos-frontend/pull/2
- Frontend inclui a memória e o gerador de continuidade na `main`, commit `c80b52f` (PR #3).
- Reconciliação documental anterior integrada à `main` frontend em `ef6e2b4` (PR #4).
- Validação do PUT integrada à `main` backend em `74a689f` (PR #2).
- DTO integrado à `main` backend em `8435497` (PR #3); documentação reconciliada
  integrada à `main` frontend em `9c065f0` (PR #5).
- Backend contém o commit `39c1d52`: Spring Boot 4.1.2, injeção por construtor
  no controller e serviço, Jackson 3 e adaptação dos testes ao Spring Web MVC.
  O agente Mockito é carregado pelo Maven na JVM de testes.
- Backend na branch `fix/contact-persistence-errors`, com alterações locais sem
  commit no serviço e advice e dois novos arquivos de testes ainda não rastreados.
  `ContatoService.update()` mantém o tratamento de contato inexistente e não
  converte mais exceções genéricas em `EntityNotFoundException`.
- O advice trata `DataAccessException` com `StandardError`: status `500`, error
  `Internal Server Error`, message `Não foi possível concluir a operação.`,
  `timeStamp` e `path`. Registra a exceção completa no servidor com mensagem fixa,
  sem incluir o corpo da requisição na mensagem de log. A resposta não usa a
  mensagem interna da exceção.
- Reconciliação documental atual na branch frontend
  `docs/reconcile-persistence-errors`; README backend atualizado na própria
  branch da correção. Sem commit, push ou merge nesta etapa.
- POST e PUT aplicam `@Validated` aos sete campos com `@NotBlank`; valores nulos,
  vazios ou contendo apenas espaços retornam `422` com erros. Atualizações
  rejeitadas preservam o registro. PUT válido mantém `200` sem corpo; payload
  válido para ID inexistente retorna `404`. Formatos de campos continuam pendentes.
- CRUD frontend corrigido: `todosContatos` é a fonte completa; `contatos` é a
  projeção do filtro. Escritas atualizam a coleção apenas após sucesso HTTP.
- Edição usa cópia e substituição por ID; PUT tipado como `Observable<void>`.
- Erros preservam os dados e o formulário; `isSaving` bloqueia ações concorrentes;
  `finalize` libera os controles. Formulário usa `ngSubmit` e fieldset desabilitado.
- Excluir o contato em edição limpa esse formulário após sucesso e preserva o filtro.
- O bootstrap e a configuração do editor funcionaram nesta máquina. Isso não
  comprova que outro checkout já esteja configurado.

## Validação

Evidência histórica do frontend (28/10/2026; não reexecutada na reconciliação documental):
- Suíte completa frontend: **23 testes passaram** em Chrome Headless.
- `npm run build`: passou, com dois avisos existentes de seletores CSS do Bootstrap
  (`.form-floating>~label`). Não são falhas dos testes.
- `git diff --check`: passou após limpeza de linhas vazias finais.
- Testes cobrem CRUD, filtros, HTTP pendente, falhas, nova tentativa, bloqueio de
  controles, cancelamento, exclusão durante edição, serviço HTTP e tela principal.
- Testes usam API simulada; não houve validação completa ponta a ponta com API real.

Backend executado em 28/10/2026, após a implementação do tratamento de persistência:
- `bash ./mvnw test` com JDK 21: **66 testes passaram**, sem falhas, erros ou ignorados.
- 61 casos de integração com MockMvc, contexto Spring e H2, um teste de contexto,
  dois testes unitários do serviço e dois testes HTTP com MockMvc standalone.
- Os testes unitários usam repositório simulado: falha no save propaga a mesma
  instância da exceção; contato inexistente mantém `EntityNotFoundException`
  e não tenta gravar.
- Os testes HTTP usam controller, serviço e advice reais e repositório simulado:
  POST e PUT com falha no save retornam `500`, mensagem genérica, horário e caminho,
  sem expor a mensagem interna simulada, SQL simulado ou campos trace/exception.
  Eles não simulam uma indisponibilidade real do banco nem verificam o log automaticamente.
- Contratos anteriores preservados: POST `201`, corpo e `Location`; PUT válido
  `200` sem corpo e atualização persistida; ID inexistente com payload válido `404`.
- Os 21 casos de PUT com campos nulos, vazios ou somente espaços continuam com
  `422` e registro preservado; campos omitidos e identificadores no corpo também
  continuam cobertos pela suíte de integração.
- A suíte H2 usa banco separado e desativa a carga de `data.sql`.
- Na reconciliação documental foram conferidos os relatórios dessa execução;
  a suíte não foi repetida porque não houve novas alterações de código.
- `git diff --check` passou nos dois repositórios após as edições documentais.
- O gerador de continuidade foi executado com `--stdout` e passou a recomendar
  a revisão da entrega de persistência, sem recomendar recriar o DTO.
- Não houve teste ponta a ponta com o frontend.

Comando backend (na raiz do repositório backend):
```bash
bash ./mvnw test
```

Comandos frontend:
```bash
npm test -- --watch=false --browsers=ChromeHeadless
npm run build
git diff --check
```

Se o Chrome não for localizado: defina
`CHROME_BIN=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
Karma precisa abrir a porta 9876; falha `EPERM` no sandbox exige a permissão adequada.

## Plano de evolução

1. **Concluído:** bootstrap, READMEs de portfólio e organização frontend por funcionalidade.
2. **Concluído:** consistência do CRUD frontend, tratamento de falhas e suíte de regressão.
3. **Concluído:** validação do PUT e testes HTTP de regressão integrados ao backend.
4. **DTO integrado; tratamento de persistência implementado localmente:** DTO na
   `main` backend em `8435497`; Spring Boot 4.1.2 e injeção por construtor no commit
   `39c1d52`. Tratamento de `DataAccessException` com `500` e quatro novos testes
   na branch `fix/contact-persistence-errors`, sem commit, com 66 testes aprovados.
   Tratamento geral de erros HTTP e transações continuam pendentes.
5. **Pendente:** regras coerentes entre cadastro e edição para email, telefone,
   CEP e UF, com mensagens por campo; CORS configurável por ambiente.
6. **Pendente:** PostgreSQL local em Docker com volume e Flyway; H2 para testes
   rápidos e Testcontainers para integração. Substituir seed por dados fictícios.
7. **Pendente:** URL de API por ambiente, estados vazio/sucesso, responsividade,
   acessibilidade, teste ponta a ponta, CI, screenshots e vídeo de demonstração.

Os itens pendentes são o plano original, não funcionalidades existentes. Entregue
em etapas pequenas. Novas atualizações de frameworks, autenticação, múltiplos usuários,
redesign completo e hospedagem ficam fora da próxima entrega. A manutenção
para Spring Boot 4.1.2 já está no checkout, conforme registrado acima.

## Próxima ação

Revisar e preparar a entrega do tratamento de falhas de persistência e da
documentação reconciliada, quando commit, push e PR forem solicitados.

- Confirme branches, diffs e arquivos não rastreados: backend
  `fix/contact-persistence-errors`; frontend `docs/reconcile-persistence-errors`.
- Não recrie o DTO, a injeção por construtor, o handler de persistência ou os testes:
  essas alterações já existem. Preserve o trabalho local do usuário.
- Inclua explicitamente no staging backend, quando solicitado, os arquivos
  `src/test/java/br/com/fatec/listacontatosbackend/resources/ContatoPersistenceErrorTests.java`
  e `src/test/java/br/com/fatec/listacontatosbackend/services/ContatoServiceTests.java`,
  ainda não rastreados nesta reconciliação, além do serviço, advice e README.
- A suíte backend passou com 66 testes. Se houver novas alterações de código,
  execute `bash ./mvnw test` com JDK 21. Documentação isolada não exige repetição.
- Mantenha entregas separadas por repositório e forneça título, descrição e texto
  de RW quando solicitados. Não faça merge automático.
- Após a integração, defina uma entrega pequena para transações ou para regras
  coerentes de formato entre cadastro e edição. Não inicie essas mudanças
  automaticamente; tratamento geral de erros HTTP também fica fora desta entrega.

A solicitação mais recente do usuário tem precedência sobre esta recomendação.

## Fluxo de trabalho e continuidade

- O usuário prefere etapas pequenas e passo a passo em português.
- Quando pedir análise, revise sem editar. Quando pedir aplicação, execute o escopo.
- GitFlow: branch por entrega, staging explícito, commits separados por finalidade,
  push e PR para `main` quando solicitados. Forneça título, descrição e texto de RW.
- Não faça merge automaticamente nem sobrescreva alterações do usuário.
- Evite repetir testes sem mudanças; rode os checks relevantes após novas alterações.
- Atualizações deste arquivo exigem pedido do usuário. Quando autorizadas, revise
  `Estado atual`, `Validação` e `Próxima ação` para evitar recomendar trabalho concluído.

## Gerar prompt de continuidade

```bash
npm run prompt:next
```

O script lê este arquivo, extrai `Próxima ação`, acrescenta o estado Git atual e
copia o prompt para a área de transferência via `pbcopy` no macOS. Não chama IA,
não executa a tarefa recomendada e não altera esta memória. Sem área de transferência,
use `npm run prompt:next -- --stdout` para imprimir o texto.
