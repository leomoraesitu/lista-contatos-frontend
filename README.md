# Lista de Contatos | Angular + Spring Boot

Aplicação de portfólio full stack para gerenciamento de contatos, com frontend em **Angular e TypeScript** e API REST em **Java e Spring Boot**. Reúne cadastro, consulta, edição, exclusão e pesquisa em uma interface construída com Bootstrap.

O projeto demonstra a integração entre interface, comunicação HTTP e persistência relacional: formulários reativos capturam os dados, serviços Angular consomem a API e o backend organiza o acesso ao banco com Spring Data JPA. Este repositório contém o frontend; a implementação da API está em [lista-contatos-backend](https://github.com/leomoraesitu/lista-contatos-backend).

### Funcionalidades

- Cadastro e edição de nome, email, telefone e endereço completo.
- Listagem e exclusão de contatos.
- Pesquisa por nome, email, telefone e campos do endereço.
- Validação de campos obrigatórios e limites de tamanho nos formulários.
- Atualização da lista após confirmação da API, preservando a pesquisa ativa.
- Mensagens de erro e preservação dos dados do formulário quando uma escrita falha.
- Bloqueio de ações concorrentes durante cadastro, edição e exclusão.

### Competências demonstradas

- **Frontend Angular:** componentes, formulários reativos, injeção de dependências e consumo de API com HttpClient e Observables do RxJS.
- **Backend Java:** endpoints REST para operações CRUD, separação entre controllers, services e repositories e persistência com JPA.
- **Integração full stack:** troca de dados em JSON e uso de métodos e respostas HTTP entre aplicações independentes.
- **Ambiente de desenvolvimento:** instalação reproduzível com versões de runtime documentadas, npm e Maven Wrapper.
- **Testes automatizados:** regressão do CRUD com respostas HTTP simuladas, incluindo falhas, requisições pendentes e comportamento dos controles.

## 💻 Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend — este repositório | Angular 16, TypeScript, RxJS, HTML, CSS e Bootstrap 5 |
| Backend — repositório complementar | Java 21, Spring Boot 3.1.6, Spring Web, Spring Data JPA e Bean Validation |
| Persistência local | H2 em memória e SQL para a carga inicial |

## Organização do frontend

O código de contatos é agrupado por funcionalidade, com os testes próximos à implementação:

```text
src/app/
├── app.component.*
├── app.module.ts
└── features/contatos/
    ├── contato.model.ts
    ├── contato.service.ts
    ├── contato.service.spec.ts
    ├── contatos.component.ts
    ├── contatos.component.html
    ├── contatos.component.css
    └── contatos.component.spec.ts
```

O componente coordena formulário, pesquisa e estado da tela; o serviço encapsula
as requisições HTTP e o modelo define os dados de contato. A coleção completa é
atualizada após sucesso da API e a lista exibida é recalculada com o filtro atual.
A edição usa uma cópia do contato, e o PUT espera uma resposta sem corpo.

## 📷 Interface

<img src="https://github.com/leomoraesitu/lista-contatos-frontend/assets/128606856/a488fedd-c646-48fa-8b43-baac3bd88397" alt="Interface da aplicação Lista de Contatos" width="700">

## 🚀 Bootstrap local (macOS com Apple Silicon)

O frontend usa Angular 16 e consome a API do [lista-contatos-backend](https://github.com/leomoraesitu/lista-contatos-backend), desenvolvida com Spring Boot 3.1.6. As instruções abaixo reproduzem o ambiente configurado com Homebrew e shell Zsh.

### Pré-requisitos

| Ferramenta | Versão/configuração |
| --- | --- |
| Node.js | 18.20.8, selecionado pelo fnm |
| npm | 10.8.2, incluído no Node usado neste bootstrap |
| Java | JDK 21 |
| Maven | 3.9.5, baixado pelo wrapper do backend |
| Banco de dados | H2 em memória, incluído nas dependências do backend |

O Angular 16.2 aceita oficialmente Node `^16.14.0` ou `^18.10.0`; Node 22 e 26 ficam fora dessa matriz. O Node 18 está fora de manutenção e é usado aqui para reproduzir a aplicação existente. Consulte a [matriz de compatibilidade do Angular](https://angular.dev/reference/versions) e o [arquivo de versões do Node](https://nodejs.org/en/download/archive/v18.18.0).

Não é necessário instalar Angular CLI ou Maven globalmente, nem Docker ou um servidor de banco externo.

### 1. Instalar e selecionar os runtimes

Com o [Homebrew](https://brew.sh/) disponível:

```bash
brew install fnm openjdk@21

eval "$(fnm env --shell zsh)"
fnm install 18.20.8
fnm default 18.20.8
fnm use 18.20.8
```

Para persistir a seleção, adicione uma única vez ao `~/.zshrc`:

```bash
# Node.js: carregar a versão padrão selecionada no fnm.
eval "$(fnm env --shell zsh)"
```

No `~/.zprofile`, substitua a configuração anterior do Java, caso exista, por:

```bash
export JAVA_HOME="/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
```

Remova ou substitua a linha antiga que prioriza `/opt/homebrew/opt/openjdk/bin`, para não selecionar o JDK de outra versão. Esses caminhos pressupõem Homebrew em `/opt/homebrew`.

Abra um novo terminal de login no VS Code e confira:

```bash
node --version
npm --version
java -version
```

Os comandos devem mostrar Node `v18.20.8`, npm `10.8.2` e Java `21`.

### 2. Executar o backend

Os exemplos pressupõem os dois repositórios clonados em `~/Documents/Dev/Portfolio`. Ajuste o caminho se necessário.

No primeiro terminal:

```bash
cd ~/Documents/Dev/Portfolio/lista-contatos-backend
bash ./mvnw --version
bash ./mvnw spring-boot:run
```

O wrapper baixa o Maven e as dependências no primeiro uso, que exige acesso à internet. O uso de `bash ./mvnw` permite executar o arquivo mesmo sem a permissão de execução.

A API fica disponível em `http://127.0.0.1:8080/contatos`. O H2 usa `jdbc:h2:mem:testdb`, usuário `sa` e senha vazia, conforme o `application.properties`. Os dados são descartados quando o backend é encerrado e a massa inicial é carregada novamente na próxima inicialização.

### 3. Executar o frontend

No segundo terminal:

```bash
cd ~/Documents/Dev/Portfolio/lista-contatos-frontend
npm ci
npm start
```

Acesse **http://localhost:4200**. Mantenha os dois terminais em execução; use `Ctrl+C` em cada um para encerrar.

O frontend aponta diretamente para `http://127.0.0.1:8080/contatos` em [contato.service.ts](src/app/features/contatos/contato.service.ts). Mantenha o backend na porta `8080`; mudar essa porta exige ajustar também a URL no frontend. Não há carregamento de `.env` configurado nem necessidade de credenciais externas para esta execução.

O analytics do Angular CLI está desativado no projeto por meio de `"cli": { "analytics": false }` em `angular.json`.

### 4. Conferir a disponibilidade

Com ambos os servidores em execução, use outro terminal:

```bash
curl --fail --silent --show-error --output /dev/null --write-out 'Frontend HTTP %{http_code}\n' http://localhost:4200
curl --fail --silent --show-error --output /dev/null --write-out 'Backend HTTP %{http_code}\n' http://127.0.0.1:8080/contatos
```

Ambos devem retornar `HTTP 200`. Essa conferência valida a disponibilidade; para verificar a integração, cadastre, pesquise, edite e remova um contato pela interface.

### Extensões opcionais do VS Code

As extensões ajudam na edição e depuração, mas não são necessárias para executar os comandos acima:

```bash
code --install-extension angular.ng-template
code --install-extension vscjava.vscode-java-pack
code --install-extension vmware.vscode-boot-dev-pack
```

O arquivo [.vscode/settings.json](.vscode/settings.json) indica o TypeScript local
e desativa o servidor experimental. Se aparecerem erros no editor que não ocorrem
na compilação, abra um arquivo `.ts` e use a **paleta de comandos** (`⇧⌘P`):
`TypeScript: Select TypeScript Version` → **Use Workspace Version — 5.1.6**.
Esses comandos pertencem ao VS Code, não ao terminal.

## Testes e build

Depois de instalar as dependências com `npm ci`, execute a suíte completa:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

É necessário ter o Google Chrome instalado. Se o launcher não localizar o navegador no macOS:

```bash
export CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

Execute novamente o comando de testes após definir a variável. O Karma abre a
porta local `9876`; ela precisa estar disponível e permitida pelo ambiente.
Os testes simulam HTTP e não precisam dos servidores frontend ou backend rodando.

Para executar apenas a regressão do componente:

```bash
npm test -- --watch=false --browsers=ChromeHeadless --include='src/app/features/contatos/contatos.component.spec.ts'
```

Para gerar o build de produção e conferir o diff:

```bash
npm run build
git diff --check
```

O build é gerado em `dist/lista-contatos-frontend`. Na última validação em
**28/10/2026**, os **23 testes passaram** e o build foi concluído, com dois avisos
de seletores CSS do Bootstrap (`.form-floating>~label`). Os cenários incluem
pesquisa após escritas, edição pendente, falhas HTTP, nova tentativa, cancelamento,
exclusão durante edição, bloqueio de controles e contrato HTTP do serviço.
Essa evidência não substitui uma nova execução após mudanças, nem representa
validação ponta a ponta com o backend real.

## Continuidade entre sessões

O [MEMORY.md](MEMORY.md) reúne decisões, planos, validações anteriores e a próxima
ação recomendada. O [AGENTS.md](AGENTS.md) orienta sua leitura no início das sessões.
Confirme sempre o estado atual dos repositórios antes de usar esse histórico.

Para gerar um prompt de continuidade e copiá-lo para a área de transferência no macOS:

```bash
npm run prompt:next
```

Cole no chat com `⌘V`. O script [next-action-prompt.mjs](scripts/next-action-prompt.mjs)
lê a seção `## Próxima ação`, inclui a memória completa e acrescenta branch,
último commit e alterações locais do frontend no momento da geração. Usa Node.js,
Git e `pbcopy`, já disponível no macOS; substitui o conteúdo atual da área de
transferência. Não chama serviços externos nem executa a ação recomendada.

Para apenas imprimir, inclusive em plataformas sem `pbcopy`:

```bash
npm run prompt:next -- --stdout
```

Para consultar as opções:

```bash
npm run prompt:next -- --help
```

O comando npm deve ser executado na raiz deste repositório. O script também pode
ser chamado diretamente de outro diretório usando seu caminho absoluto.

Para mudar a recomendação, atualize a seção `## Próxima ação` do `MEMORY.md`.
Depois de uma entrega, revise também o estado e as evidências da memória quando
essa atualização for solicitada. O prompt não detecta automaticamente tarefas
concluídas no backend; a sessão deve conferir os arquivos antes de agir.

## Estado da integração e próximas evoluções

A validação de campos obrigatórios no PUT já foi integrada à `main` do backend
em `74a689f` (PR #2). A reconciliação documental anterior foi integrada à `main`
deste frontend em `ef6e2b4` (PR #4).

Em 28/10/2026, o backend contém uma nova entrega local na branch
`refactor/contact-input-dto`, revisada e ainda sem commit, push ou PR. POST e PUT
recebem o record `ContatoRequest`, com os sete campos obrigatórios e sem ID.
O controller converte o DTO para entidade; um `id` enviado no corpo é ignorado.
POST gera o identificador e PUT utiliza exclusivamente o identificador da URL,
mantendo compatibilidade com o objeto enviado pelo Angular atual.

Campos omitidos, nulos, vazios ou contendo apenas espaços retornam `422` com
mensagens de erro. POST mantém `201`, corpo e `Location`; PUT mantém `200` sem
corpo; payload válido para ID inexistente retorna `404`. Ainda não há validação
de formato de email, telefone, CEP ou UF no backend.

Na revisão dessa entrega, `bash ./mvnw test` com JDK 21 aprovou **62 testes**:
61 casos de integração com MockMvc e H2, mais o teste de contexto. A cobertura
inclui campos omitidos, preservação dos dados em atualizações inválidas e uso
correto dos identificadores, além dos contratos anteriores.
Consulte os [testes do backend](https://github.com/leomoraesitu/lista-contatos-backend#testes).
Essa execução não valida o fluxo ponta a ponta pela interface. Na reconciliação
documental, os relatórios foram conferidos e os testes não foram repetidos.

A próxima ação é preparar a entrega do DTO e desta reconciliação para integração,
quando solicitada. Tratamento de erros internos, injeção por construtor,
transações, regras de formato, persistência durável, configuração por ambiente,
CI e testes ponta a ponta continuam no plano em
[MEMORY.md](MEMORY.md#plano-de-evolução).

## 🎬 Vídeo apresentação:

[<img src="https://github.com/leomoraesitu/lista-contatos-frontend/assets/128606856/2e34b104-704b-4071-b5f7-09912d59c7f2" width="300">](https://fatecspgov-my.sharepoint.com/:v:/g/personal/leonardo_souza111_fatec_sp_gov_br/EUp1ie-4dh5BtpeXh8RrRlQBP80T7IlbTXLM2Qh7ni_kWw?e=JxYh4E)
