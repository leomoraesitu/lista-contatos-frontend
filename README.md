# Lista de Contatos | Angular + Spring Boot

Aplicação de portfólio full stack para gerenciamento de contatos, com frontend em **Angular e TypeScript** e API REST em **Java e Spring Boot**. Reúne cadastro, consulta, edição, exclusão e pesquisa em uma interface construída com Bootstrap.

O projeto demonstra a integração entre interface, comunicação HTTP e persistência relacional: formulários reativos capturam os dados, serviços Angular consomem a API e o backend organiza o acesso ao banco com Spring Data JPA. Este repositório contém o frontend; a implementação da API está em [lista-contatos-backend](https://github.com/leomoraesitu/lista-contatos-backend).

### Funcionalidades

- Cadastro e edição de nome, email, telefone e endereço completo.
- Listagem e exclusão de contatos.
- Pesquisa por nome, email, telefone e campos do endereço.
- Validação de campos obrigatórios e limites de tamanho nos formulários.

### Competências demonstradas

- **Frontend Angular:** componentes, formulários reativos, injeção de dependências e consumo de API com HttpClient e Observables do RxJS.
- **Backend Java:** endpoints REST para operações CRUD, separação entre controllers, services e repositories e persistência com JPA.
- **Integração full stack:** troca de dados em JSON e uso de métodos e respostas HTTP entre aplicações independentes.
- **Ambiente de desenvolvimento:** instalação reproduzível com versões de runtime documentadas, npm e Maven Wrapper.

## 💻 Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend — este repositório | Angular 16, TypeScript, RxJS, HTML, CSS e Bootstrap 5 |
| Backend — repositório complementar | Java 21, Spring Boot 3.1.6, Spring Web, Spring Data JPA e Bean Validation |
| Persistência local | H2 em memória e SQL para a carga inicial |

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

O frontend aponta diretamente para `http://127.0.0.1:8080/contatos` em `src/app/contato.service.ts`. Mantenha o backend na porta `8080`; mudar essa porta exige ajustar também a URL no frontend. Não há carregamento de `.env` configurado nem necessidade de credenciais externas para esta execução.

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

## 🎬 Vídeo apresentação:

[<img src="https://github.com/leomoraesitu/lista-contatos-frontend/assets/128606856/2e34b104-704b-4071-b5f7-09912d59c7f2" width="300">](https://fatecspgov-my.sharepoint.com/:v:/g/personal/leonardo_souza111_fatec_sp_gov_br/EUp1ie-4dh5BtpeXh8RrRlQBP80T7IlbTXLM2Qh7ni_kWw?e=JxYh4E)


