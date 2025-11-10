---
title: Playground CLI
slug: /developers/local-development/wp-playground-cli
description: Uma ferramenta de linha de comando para desenvolvimento e testes do WordPress com configuração rápida, configuração flexível e dependências mínimas.
---

<!-- # Playground CLI -->

# Playground CLI

<!-- [@wp-playground/cli](https://www.npmjs.com/package/@wp-playground/cli) is a command-line tool that simplifies the WordPress development and testing flow. You can use Playground CLI to auto-mount a directory with a plugin, theme, or WordPress installation. If you need flexibility, you can use mounting commands to personalize your local environment. -->

[@wp-playground/cli](https://www.npmjs.com/package/@wp-playground/cli) é uma ferramenta de linha de comando que simplifica o fluxo de desenvolvimento e teste do WordPress. Você pode usar o Playground CLI para auto-montar um diretório com um plugin, tema ou instalação WordPress. Se você precisa de flexibilidade, pode usar comandos de montagem para personalizar seu ambiente local.

<!-- **Key features:** -->

**Principais recursos:**

<!-- -   **Quick setup**: Set up a local WordPress environment in seconds. -->
<!-- -   **Flexibility**: Allows for configuration to adapt to different scenarios. -->
<!-- -   **Simple environment**: No extra configuration, just a compatible Node version, and you are ready to use it. -->

-   **Configuração Rápida**: Configure um ambiente WordPress local em segundos.
-   **Flexibilidade**: Permite configuração para se adaptar a diferentes cenários.
-   **Ambiente Simples**: Sem configuração extra, apenas uma versão Node compatível, e você está pronto para usar.

<!-- ## Requirements -->

## Requisitos

<!-- The Playground CLI requires Node.js 20.18 or higher, which is the recommended Long-Term Support (LTS) version. You can download it from the [Node.js website](https://nodejs.org/en/download). -->

O Playground CLI requer Node.js 20.18 ou superior, que é a versão recomendada de Suporte de Longo Prazo (LTS). Você pode baixá-la no [site do Node.js](https://nodejs.org/en/download).

<!-- ## Quick start -->

## Início Rápido

<!-- To run the Playground CLI, open a command line and use the following command: -->

Para executar o Playground CLI, abra uma linha de comando e use o seguinte comando:

```bash
npx @wp-playground/cli@latest server
```

![Playground CLI em Ação](@site/static/img/developers/npx-wp-playground-server.gif)

<!-- With the previous command, you only get a fresh WordPress instance to test. Most developers will want to test their own work. To test a plugin or a theme, navigate to your project folder and run the CLI with the `--auto-mount` flag. -->

Com o comando anterior, você obtém apenas uma instância WordPress fresca para testar. A maioria dos desenvolvedores vai querer testar seu próprio trabalho. Para testar um plugin ou tema, navegue até a pasta do seu projeto e execute o CLI com a flag `--auto-mount`.

<!-- The `--auto-mount` flag intelligently detects your project type and mounts it to the appropriate location in WordPress. When you run the command from your project directory, Playground CLI analyzes the directory structure and automatically determines whether you're working with a plugin, theme, wp-content directory, full WordPress installation, or static HTML/PHP files. It then mounts your project to the correct path in the virtual WordPress environment, so you can start developing immediately without manual configuration. -->

A flag `--auto-mount` detecta inteligentemente o tipo do seu projeto e o monta no local apropriado no WordPress. Quando você executa o comando do diretório do seu projeto, o Playground CLI analisa a estrutura do diretório e determina automaticamente se você está trabalhando com um plugin, tema, diretório wp-content, instalação completa do WordPress ou arquivos estáticos HTML/PHP. Ele então monta seu projeto no caminho correto no ambiente WordPress virtual, para que você possa começar a desenvolver imediatamente sem configuração manual.

```bash
cd my-plugin
npx @wp-playground/cli@latest server --auto-mount
```

<!-- ### Choosing a WordPress and PHP version -->

### Escolhendo uma Versão do WordPress e PHP

<!-- By default, the CLI loads the latest stable version of WordPress and PHP 8.3 due to its improved performance. You can specify different versions using the `--wp=<version>` and `--php=<version>` flags. This is particularly useful when you need to test your plugin or theme for compatibility across different WordPress and PHP versions, ensuring your code works correctly for users running older installations. -->

Por padrão, o CLI carrega a versão estável mais recente do WordPress e PHP 8.3 devido ao seu desempenho melhorado. Você pode especificar versões diferentes usando as flags `--wp=<version>` e `--php=<version>`. Isso é particularmente útil quando você precisa testar seu plugin ou tema para compatibilidade em diferentes versões do WordPress e PHP, garantindo que seu código funcione corretamente para usuários executando instalações mais antigas.

```bash
npx @wp-playground/cli@latest server --wp=6.4 --php=8.0
```

<!-- ### Setting a custom site URL -->

### Definindo uma URL de site personalizada

<!-- You can configure a custom site URL for your development environment, which is useful for testing domain-specific functionality or simulating production environments: -->

Você pode configurar uma URL de site personalizada para seu ambiente de desenvolvimento, o que é útil para testar funcionalidades específicas de domínio ou simular ambientes de produção:

```bash
npx @wp-playground/cli@latest server --site-url=https://my-local-dev.test
```

<!-- ### Loading blueprints -->

### Carregando Blueprints

<!-- One way to take your Playground CLI development experience to the next level is to integrate with [Blueprints](/blueprints/getting-started/). For those unfamiliar with this technology, it allows developers to configure the initial state for their WordPress Playground instances. -->

Uma maneira de levar sua experiência de desenvolvimento do Playground CLI para o próximo nível é integrar com [Blueprints](/blueprints/getting-started/). Para aqueles não familiarizados com esta tecnologia, ela permite que desenvolvedores configurem o estado inicial para suas instâncias WordPress Playground.

<!-- Using the `--blueprint=<blueprint-address>` flag, developers can run a Playground with a custom initial state. We'll use the example below to do this. -->

Usando a flag `--blueprint=<blueprint-address>`, desenvolvedores podem executar um Playground com um estado inicial personalizado. Usaremos o exemplo abaixo para fazer isso.

**(my-blueprint.json)**

```json
{
	"landingPage": "/wp-admin/options-general.php?page=akismet-key-config",
	"login": true,
	"plugins": ["hello-dolly", "https://raw.githubusercontent.com/adamziel/blueprints/trunk/docs/assets/hello-from-the-dashboard.zip"]
}
```

<!-- CLI command loading a blueprint: -->

Comando CLI carregando um blueprint:

```bash
npx @wp-playground/cli@latest server --blueprint=my-blueprint.json
```

<!-- ### Mounting folders manually -->

### Montando pastas manualmente

<!-- Some projects have a specific structure that requires a custom configuration; for example, your repository contains all the files in the `/wp-content/` folder. So in this scenario, you can specify to the Playground CLI that it will mount your project from that folder using the `--mount` flag. -->

Alguns projetos têm uma estrutura específica que requer uma configuração personalizada; por exemplo, seu repositório contém todos os arquivos na pasta `/wp-content/`. Então neste cenário, você pode especificar ao Playground CLI que ele montará seu projeto a partir dessa pasta usando a flag `--mount`.

```bash
npx @wp-playground/cli@latest server --mount=.:/wordpress/wp-content/plugins/MY-PLUGIN-DIRECTORY
```

<!-- **Multiple mounts:** -->

**Múltiplas montagens:**

<!-- You can mount multiple directories at once: -->

Você pode montar múltiplos diretórios de uma vez:

```bash
npx @wp-playground/cli@latest server \
  --mount=./my-plugin:/wordpress/wp-content/plugins/my-plugin \
  --mount=./my-theme:/wordpress/wp-content/themes/my-theme
```

<!-- ### Mounting before WordPress installation -->

### Montando antes da instalação do WordPress

<!-- Consider mounting your WordPress project files before the WordPress installation begins. This approach is beneficial if you want to override the Playground boot process, as it can help connect Playground with `WP-CLI`. The `--mount-before-install` flag supports this process. -->

Considere montar seus arquivos de projeto WordPress antes da instalação do WordPress começar. Esta abordagem é benéfica se você quer sobrescrever o processo de inicialização do Playground, pois pode ajudar a conectar o Playground com `WP-CLI`. A flag `--mount-before-install` suporta este processo.

```bash
npx @wp-playground/cli@latest server --mount-before-install=.:/wordpress/
```

<!-- ### Symlink support for monorepos -->

### Suporte a links simbólicos para monorepos

<!-- If you're working in a monorepo or complex project structure where packages are symlinked, you can enable symlink following: -->

Se você está trabalhando em um monorepo ou estrutura de projeto complexa onde os pacotes são vinculados simbolicamente, você pode habilitar o seguimento de links simbólicos:

```bash
npx @wp-playground/cli@latest server \
  --follow-symlinks \
  --mount-before-install=./packages/my-plugin:/wordpress/wp-content/plugins/my-plugin
```

:::caution

<!-- Using `--follow-symlinks` can expose files outside mounted directories to Playground and could be a security risk. Only use this flag when you trust the symlink targets. -->

Usar `--follow-symlinks` pode expor arquivos fora dos diretórios montados ao Playground e pode ser um risco de segurança. Use esta flag apenas quando confiar nos destinos dos links simbólicos.
:::

<!-- ### Understanding data persistence and SQLite location -->

### Entendendo a Persistência de Dados e Localização do SQLite

<!-- By default, Playground CLI stores WordPress files and the SQLite database in **temporary directories on your operating system**: -->

Por padrão, o Playground CLI armazena arquivos WordPress e o banco de dados SQLite em **diretórios temporários no seu sistema operacional**:

```
<OS-TEMP-DIR>/playground-<random-id>/
├── wordpress/          # Instalação WordPress
├── internal/          # Configuração do runtime do Playground
└── tmp/              # Arquivos temporários PHP
```

<!-- **Finding your temp directory:** -->

**Encontrando Seu Diretório Temporário:**

<!-- The actual location depends on your OS (these are examples or common possibilities): -->

A localização real depende do seu SO (estes são exemplos ou possibilidades comuns):

<!-- -   **macOS/Linux**: May be under `/tmp/` or `/private/var/folders/` (varies by system) -->
<!-- -   **Windows**: `C:\Users\<username>\AppData\Local\Temp\` -->

-   **macOS/Linux**: Pode estar em `/tmp/` ou `/private/var/folders/` (varia por sistema)
-   **Windows**: `C:\Users\<username>\AppData\Local\Temp\`

<!-- To see the exact temp directory path being used, run the CLI with the `--verbosity=debug` flag: -->

Para ver o caminho exato do diretório temporário sendo usado, execute o CLI com a flag `--verbosity=debug`:

```bash
npx @wp-playground/cli@latest server --verbosity=debug
```

<!-- This will output something like: -->

Isso exibirá algo como:

```
Native temp dir for VFS root:
/private/var/folders/c8/mwz12ycx4s509056kby3hk180000gn/T/node-playground-cli-site-62926--62926-yQNOdvJVIgYC
Mount before WP install: /home ->
/private/var/folders/c8/mwz12ycx4s509056kby3hk180000gn/T/node-playground-cli-site-62926--62926-yQNOdvJVIgYC/home
Mount before WP install: /tmp ->
/private/var/folders/c8/mwz12ycx4s509056kby3hk180000gn/T/node-playground-cli-site-62926--62926-yQNOdvJVIgYC/tmp
Mount before WP install: /wordpress ->
/private/var/folders/c8/mwz12ycx4s509056kby3hk180000gn/T/node-playground-cli-site-62926--62926-yQNOdvJVIgYC/wordpress
```

<!-- **Where is the SQLite database stored?** -->

**Onde o Banco de Dados SQLite é Armazenado?**

<!-- The database location depends on what you mount: -->

A localização do banco de dados depende do que você montar:

<!-- -   **Auto-mounting wp-content or full WordPress**: -->
<!-- -   Database: `<your-local-project>/wp-content/database/.ht.sqlite` -->
<!-- -   ✅ **Persisted locally** in your project folder -->

-   **Auto-montagem de wp-content ou WordPress completo**:

    -   Banco de dados: `<seu-projeto-local>/wp-content/database/.ht.sqlite`
    -   ✅ **Persistido localmente** na pasta do seu projeto

<!-- -   **Auto-mounting plugin/theme only**: -->
<!-- -   Database: `<OS-TEMP-DIR>/playground-<id>/wordpress/wp-content/database/.ht.sqlite` -->
<!-- -   ⚠️ **Lost when server stops** (temp directories are cleaned up) -->

-   **Auto-montagem apenas de plugin/tema**:

    -   Banco de dados: `<OS-TEMP-DIR>/playground-<id>/wordpress/wp-content/database/.ht.sqlite`
    -   ⚠️ **Perdido quando o servidor para** (diretórios temporários são limpos)

<!-- -   **Custom mounts**: Database location follows your mount configuration -->

-   **Montagens personalizadas**: A localização do banco de dados segue sua configuração de montagem

<!-- **Automatic cleanup:** -->

**Limpeza Automática:**

<!-- Playground CLI automatically removes temp directories that are: -->

O Playground CLI remove automaticamente diretórios temporários que são:

<!-- -   Older than two days -->
<!-- -   No longer associated with a running process -->

-   Mais antigos que dois dias
-   Não mais associados com um processo em execução

<!-- **Recommendation:** To persist both your code and database when developing plugins or themes, mount the entire `wp-content` directory instead of just the plugin/theme folder. -->

**Recomendação:** Para persistir tanto seu código quanto o banco de dados ao desenvolver plugins ou temas, monte o diretório `wp-content` inteiro em vez de apenas a pasta do plugin/tema.

<!-- **Example: Mounting wp-content for persistence** -->

**Exemplo: Montando wp-content para persistência**

```bash
# Monte seu diretório wp-content inteiro
cd my-wordpress-project
npx @wp-playground/cli@latest server --mount=./wp-content:/wordpress/wp-content
```

<!-- ## Verbosity and debugging -->

## Verbosidade e depuração

<!-- The CLI supports different verbosity levels to control output, for `quiet`, `normal` and `debug` mode. The default mode is `normal`. For quiet mode, run the server with no output (useful for scripts and automation): -->

O CLI suporta diferentes níveis de verbosidade para controlar a saída, para os modos `quiet`, `normal` e `debug`. O modo padrão é `normal`. Para o modo silencioso, execute o servidor sem saída (útil para scripts e automação):

```bash
npx @wp-playground/cli@latest server --verbosity=quiet
```

<!-- Get detailed logging information for troubleshooting, with `debug` mode: -->

Obtenha informações de registro detalhadas para solução de problemas, com o modo `debug`:

```bash
npx @wp-playground/cli@latest server --verbosity=debug
```

<!-- ## Commands and arguments -->

## Comandos e Argumentos

<!-- The Playground CLI is simple, configurable, and unopinionated. You can set it up according to your unique WordPress setup. With the Playground CLI, you can use the following top-level commands: -->

O Playground CLI é simples, configurável e sem opiniões. Você pode configurá-lo de acordo com sua configuração WordPress única. Com o Playground CLI, você pode usar os seguintes comandos de nível superior:

<!-- -   **`server`**: (Default) Starts a local WordPress server. -->
<!-- -   **`run-blueprint`**: Executes a Blueprint file without starting a web server. -->
<!-- -   **`build-snapshot`**: Builds a ZIP snapshot of a WordPress site based on a Blueprint. -->

-   **`server`**: (Padrão) Inicia um servidor WordPress local.
-   **`run-blueprint`**: Executa um arquivo Blueprint sem iniciar um servidor web.
-   **`build-snapshot`**: Constrói um snapshot ZIP de um site WordPress baseado em um Blueprint.

<!-- The `server` command supports the following optional arguments: -->

O comando `server` suporta os seguintes argumentos opcionais:

-   `--port=<port>`: O número da porta para o servidor escutar. Padrão é 9400.
-   `--version`: Mostrar número da versão.
-   `--outfile`: Ao construir, escrever neste arquivo de saída.
-   `--site-url=<url>`: URL do site a usar para WordPress. Padrão é `http://127.0.0.1:{port}`.
-   `--wp=<version>`: A versão do WordPress a usar. Padrão é a mais recente.
-   `--php=<version>`: Versão do PHP a usar. Opções: `8.4`, `8.3`, `8.2`, `8.1`, `8.0`, `7.4`, `7.3`, `7.2`. Padrão é `8.3`.
-   `--auto-mount[=<path>]`: Montar automaticamente um diretório. Se nenhum caminho for fornecido, monta o diretório de trabalho atual. Você pode montar um diretório WordPress, um diretório de plugin, um diretório de tema, um diretório wp-content, ou qualquer diretório contendo arquivos PHP e HTML.
-   `--mount=<mapping>`: Montar manualmente um diretório (pode ser usado múltiplas vezes). Formato: `"/host/path:/vfs/path"`.
-   `--mount-before-install`: Montar um diretório no runtime PHP antes da instalação do WordPress (pode ser usado múltiplas vezes). Formato: `"/host/path:/vfs/path"`.
-   `--mount-dir`: Montar um diretório no runtime PHP (pode ser usado múltiplas vezes). Formato: `"/host/path"` `"/vfs/path"`.
-   `--mount-dir-before-install`: Montar um diretório antes da instalação do WordPress (pode ser usado múltiplas vezes). Formato: `"/host/path"` `"/vfs/path"`
-   `--blueprint=<path>`: O caminho para um arquivo JSON Blueprint para executar.
-   `--blueprint-may-read-adjacent-files`: Flag de consentimento: Permitir que recursos "empacotados" em um blueprint local leiam arquivos no mesmo diretório do arquivo blueprint.
-   `--login`: Fazer login automaticamente do usuário como administrador.
-   `--wordpress-install-mode <mode>`: Controla como o Playground prepara o WordPress antes de inicializar. O padrão é `download-and-install`. Outras opções: `install-from-existing-files` (instala usando os arquivos montados), `install-from-existing-files-if-needed` (ignora a configuração quando detecta um site existente) e `do-not-attempt-installing` (nunca baixa ou instala o WordPress).
-   `--skip-sqlite-setup`: Não configurar a integração do banco de dados SQLite.
-   `--verbosity=<level>`: Saída de logs e mensagens de progresso. Opções: `quiet`, `normal`, `debug`. Padrão é `normal`.
-   `--debug`: Imprimir o log de erro do PHP se um erro ocorrer durante a inicialização.
-   `--follow-symlinks`: Permitir que o Playground siga links simbólicos montando automaticamente diretórios e arquivos vinculados simbolicamente encontrados em diretórios montados.
-   `--internal-cookie-store`: Habilitar tratamento interno de cookies. Quando habilitado, o Playground gerenciará cookies internamente usando um HttpCookieStore que persiste cookies entre requisições. Quando desabilitado, cookies são tratados externamente (por exemplo, por um navegador em ambientes Node.js). Padrão é false.
-   `--xdebug`: Habilitar Xdebug. Padrão é false.
-   `--experimental-devtools`: Habilitar ferramentas de desenvolvimento experimentais do navegador. Padrão é false.
-   `--experimental-multi-worker=<number>`: Habilitar suporte experimental multi-worker que requer um diretório `/wordpress` apoiado por um sistema de arquivos real. Passe um número positivo para especificar o número de workers a usar. Caso contrário, padrão é o número de CPUs menos um.

:::info

<!-- On Windows, the path format `/host/path:/vfs/path` can cause issues. To resolve this, use the flags `--mount-dir` and `--mount-dir-before-install`. These flags let you specify host and virtual file system paths in an alternative format`"/host/path"` `"/vfs/path"`. -->

No Windows, o formato de caminho `/host/path:/vfs/path` pode causar problemas. Para resolver isso, use as flags `--mount-dir` e `--mount-dir-before-install`. Estas flags permitem que você especifique caminhos do host e do sistema de arquivos virtual em um formato alternativo `"/host/path"` `"/vfs/path"`.
:::

<!-- ## Need some help with the CLI? -->

## Precisa de ajuda com o CLI?

<!-- With the Playground CLI, you can use the `--help` flag to get the full list of available commands and arguments. -->

Com o Playground CLI, você pode usar a flag `--help` para obter a lista completa de comandos e argumentos disponíveis.

```bash
npx @wp-playground/cli@latest --help
```

<!-- ## Programmatic usage with JavaScript -->

## Uso Programático com JavaScript

<!-- The Playground CLI can also be controlled programmatically from your JavaScript/TypeScript code using the `runCLI` function. This gives you direct access to all CLI functionalities within your code, which is useful for automating end-to-end tests. Let's cover the basics of using `runCLI`. -->

O Playground CLI também pode ser controlado programaticamente a partir do seu código JavaScript/TypeScript usando a função `runCLI`. Isso fornece acesso direto a todas as funcionalidades do CLI dentro do seu código, o que é útil para automatizar testes end-to-end. Vamos cobrir o básico do uso de `runCLI`.

<!-- ### Running a WordPress instance with a specific version -->

### Executando uma instância WordPress com uma versão específica

<!-- Using the `runCLI` function, you can specify options like the PHP and WordPress versions. In the example below, we request PHP 8.3, the latest version of WordPress, and to be automatically logged in. All supported arguments are defined in the `RunCLIArgs` type. -->

Usando a função `runCLI`, você pode especificar opções como as versões do PHP e WordPress. No exemplo abaixo, solicitamos PHP 8.3, a versão mais recente do WordPress, e para fazer login automaticamente. Todos os argumentos suportados são definidos no tipo `RunCLIArgs`.

```TypeScript
import { runCLI, RunCLIArgs, RunCLIServer } from "@wp-playground/cli";

let cliServer: RunCLIServer;

cliServer = await runCLI({
    command: 'server',
    php: '8.3',
    wp: 'latest',
    login: true
} as RunCLIArgs);
```

<!-- To execute the code above, you can set your preferred method. A simple way to execute this code is to save it as a `.ts` file and run it with a tool like `tsx`. For example: `tsx my-script.ts` -->

Para executar o código acima, você pode definir seu método preferido. Uma maneira simples de executar este código é salvá-lo como um arquivo `.ts` e executá-lo com uma ferramenta como `tsx`. Por exemplo: `tsx my-script.ts`

<!-- **Testing with specific PHP versions:** -->

**Testando com versões específicas do PHP:**

```TypeScript
import { runCLI } from "@wp-playground/cli";

const cliServer = await runCLI({
  command: 'server',
  php: '8.0',
  skipWordPressSetup: true,
  skipSqliteSetup: true,
});

// Testar versão do PHP
await cliServer.playground.writeFile(
  '/wordpress/version.php',
  '<?php echo phpversion(); ?>'
);

const versionUrl = new URL('/version.php', cliServer.serverUrl);
const response = await fetch(versionUrl);
const version = await response.text();
console.log('Versão do PHP:', version); // Saída: 8.0.x
```

<!-- ### Setting a custom site URL programmatically -->

### Definindo uma URL de site personalizada programaticamente

```TypeScript
const cliServer = await runCLI({
  command: 'server',
  'site-url': 'https://my-staging.example.com',
  port: 9500
});

// Verificar se a URL do site está configurada corretamente
await cliServer.playground.writeFile(
  '/wordpress/check-url.php',
  '<?php require_once "/wordpress/wp-load.php"; echo get_option("siteurl"); ?>'
);

const checkUrl = new URL('/check-url.php', cliServer.serverUrl);
const response = await fetch(checkUrl);
console.log('URL do Site:', await response.text());
```

<!-- ### Controlling verbosity programmatically -->

### Controlando a verbosidade programaticamente

```TypeScript
import { runCLI } from "@wp-playground/cli";
import { logger } from '@php-wasm/logger';

const cliServer = await runCLI({
  command: 'server',
  verbosity: 'debug' // ou 'quiet' ou 'normal'
});

// Adicionar registro personalizado
logger.debug('Mensagem de depuração personalizada');
```

<!-- ### Setting a blueprint -->

### Definindo um Blueprint

<!-- You can provide a blueprint in two ways: either as an object literal directly passed to the `blueprint` property, or as a string containing the path to an external `.json` file. -->

Você pode fornecer um blueprint de duas maneiras: como um objeto literal passado diretamente para a propriedade `blueprint`, ou como uma string contendo o caminho para um arquivo `.json` externo.

```TypeScript
import { runCLI, RunCLIServer } from "@wp-playground/cli";

let cliServer: RunCLIServer;

cliServer = await runCLI({
  command: 'server',
  wp: 'latest',
  blueprint: {
    steps: [
        {
          "step": "setSiteOptions",
          "options": {
              "blogname": "Título do Blueprint",
              "blogdescription": "Uma ótima descrição de blog"
          }
        }
    ],
  },
});
```

<!-- For full type-safety when defining your blueprint object, you can import and use the `BlueprintDeclaration` type from the `@wp-playground/blueprints` package: -->

Para total segurança de tipo ao definir seu objeto blueprint, você pode importar e usar o tipo `BlueprintDeclaration` do pacote `@wp-playground/blueprints`:

```TypeScript
import type { BlueprintDeclaration } from '@wp-playground/blueprints';

const myBlueprint: BlueprintDeclaration = {
  landingPage: "/wp-admin/",
  steps: [
    {
      "step": "installTheme",
      "themeData": {
        "resource": "wordpress.org/themes",
        "slug": "twentytwentyone"
      },
      "options": {
        "activate": true
      }
    }
  ]
};
```

<!-- ### Mounting a plugin programmatically -->

### Montando um plugin programaticamente

<!-- You can mount local directories programmatically using `runCLI`. The options `mount` and `mount-before-install` are available. The `hostPath` property expects a path to a directory on your local machine. This path should be relative to where your script is being executed. -->

Você pode montar diretórios locais programaticamente usando `runCLI`. As opções `mount` e `mount-before-install` estão disponíveis. A propriedade `hostPath` espera um caminho para um diretório na sua máquina local. Este caminho deve ser relativo a onde seu script está sendo executado.

```TypeScript
cliServer = await runCLI({
  command: 'server',
  login: true,
  'mount-before-install': [
    {
      hostPath: './[my-plugin-local-path]',
      vfsPath: '/wordpress/wp-content/plugins/my-plugin',
    },
  ],
});
```

<!-- **Auto-mounting programmatically:** -->

**Auto-montagem programática:**

```TypeScript
import { runCLI } from "@wp-playground/cli";
import process from 'node:process';

// Mudar para o diretório do seu projeto
process.chdir('./my-plugin');

const cliServer = await runCLI({
  command: 'server',
  autoMount: '' // String vazia aciona a detecção automática
});
```

<!-- ### Combining mounts with blueprints -->

### Combinando montagens com blueprints

<!-- You can combine mounting parts of the project with blueprints, for example: -->

Você pode combinar a montagem de partes do projeto com blueprints, por exemplo:

```TypeScript
import { runCLI, RunCLIArgs, RunCLIServer } from "@wp-playground/cli";

let cliServer: RunCLIServer;

cliServer = await runCLI({
    command: 'server',
    php: '8.3',
    wp: 'latest',
    login: true,
    mount: [
        {
            "hostPath": "./plugin/",
            "vfsPath": "/wordpress/wp-content/plugins/playwright-test"
        }
    ],
    blueprint: {
        steps: [
            {
                "step": "activatePlugin",
                "pluginPath": "/wordpress/wp-content/plugins/playwright-test/plugin-playwright.php"
            }
        ]
    }
} as RunCLIArgs);
```

<!-- **Multiple mounts with blueprints:** -->

**Múltiplas montagens com blueprints:**

```TypeScript
const cliServer = await runCLI({
  command: 'server',
  mount: [
    {
      hostPath: './my-plugin',
      vfsPath: '/wordpress/wp-content/plugins/my-plugin'
    },
    {
      hostPath: './my-theme',
      vfsPath: '/wordpress/wp-content/themes/my-theme'
    }
  ],
  blueprint: {
    steps: [
      {
        step: 'activatePlugin',
        pluginPath: '/wordpress/wp-content/plugins/my-plugin/plugin.php'
      },
      {
        step: 'activateTheme',
        themeFolderName: 'my-theme'
      }
    ]
  }
});
```

<!-- **Complex blueprint with multiple configurations:** -->

**Blueprint complexo com múltiplas configurações:**

```TypeScript
const cliServer = await runCLI({
  command: 'server',
  php: '8.3',
  wp: 'latest',
  login: true,
  mount: [
    {
      hostPath: './my-plugin',
      vfsPath: '/wordpress/wp-content/plugins/my-plugin'
    }
  ],
  blueprint: {
    landingPage: '/wp-admin/plugins.php',
    steps: [
      {
        step: 'activatePlugin',
        pluginPath: '/wordpress/wp-content/plugins/my-plugin/plugin.php'
      },
      {
        step: 'setSiteOptions',
        options: {
          blogname: 'Site de Teste de Plugin',
          permalink_structure: '/%postname%/'
        }
      },
      {
        step: 'runPHP',
        code: '<?php update_option("my_plugin_setting", "test_value"); ?>'
      }
    ]
  }
});
```

<!-- ### Mode selection (Blueprint v2) -->

### Seleção de modo (Blueprint v2)

<!-- You can specify different modes when working with Blueprint v2: -->

Você pode especificar diferentes modos ao trabalhar com Blueprint v2:

<!-- **Creating a new site:** -->

**Criando um novo site:**

```TypeScript
import { runCLI } from "@wp-playground/cli";

const cliServer = await runCLI({
  command: 'server',
  'experimental-blueprints-v2-runner': true,
  mode: 'create-new-site',
  'mount-before-install': [
    {
      hostPath: './my-new-site',
      vfsPath: '/wordpress'
    }
  ]
});
```

<!-- **Applying to an existing site:** -->

**Aplicando a um site existente:**

```TypeScript
const cliServer = await runCLI({
  command: 'server',
  'experimental-blueprints-v2-runner': true,
  mode: 'apply-to-existing-site',
  'mount-before-install': [
    {
      hostPath: './existing-wordpress',
      vfsPath: '/wordpress'
    }
  ],
  blueprint: {
    steps: [
      {
        step: 'setSiteOptions',
        options: {
          blogname: 'Nome do Site Atualizado'
        }
      }
    ]
  }
});
```

<!-- ## Automated testing -->

## Testes automatizados

<!-- ### Integration testing with Vitest -->

### Testes de integração com Vitest

<!-- The programmatic API is excellent for automated testing. Here's a complete example using Vitest: -->

A API programática é excelente para testes automatizados. Aqui está um exemplo completo usando Vitest:

```TypeScript
import { describe, test, expect, afterEach } from 'vitest';
import { runCLI, RunCLIServer } from "@wp-playground/cli";

describe('Testes do Meu Plugin', () => {
  let cliServer: RunCLIServer;

  afterEach(async () => {
    if (cliServer) {
      await cliServer[Symbol.asyncDispose]();
    }
  });

  test('plugin ativa com sucesso', async () => {
    cliServer = await runCLI({
      command: 'server',
      mount: [
        {
          hostPath: './my-plugin',
          vfsPath: '/wordpress/wp-content/plugins/my-plugin'
        }
      ],
      blueprint: {
        steps: [
          {
            step: 'activatePlugin',
            pluginPath: '/wordpress/wp-content/plugins/my-plugin/plugin.php'
          }
        ]
      }
    });

    const homeUrl = new URL('/', cliServer.serverUrl);
    const response = await fetch(homeUrl);

    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain('Meu Plugin');
  });

  test('página de configurações do plugin carrega', async () => {
    cliServer = await runCLI({
      command: 'server',
      login: true, // Auto-login como admin
      mount: [
        {
          hostPath: './my-plugin',
          vfsPath: '/wordpress/wp-content/plugins/my-plugin'
        }
      ],
      blueprint: {
        steps: [
          {
            step: 'activatePlugin',
            pluginPath: '/wordpress/wp-content/plugins/my-plugin/plugin.php'
          }
        ]
      }
    });

    const settingsUrl = new URL(
      '/wp-admin/options-general.php?page=my-plugin',
      cliServer.serverUrl
    );
    const response = await fetch(settingsUrl);

    expect(response.status).toBe(200);
  });
});
```

<!-- ### Testing theme customizations -->

### Testando personalizações de temas

```TypeScript
test('tema exibe cabeçalho personalizado', async () => {
  cliServer = await runCLI({
    command: 'server',
    mount: [
      {
        hostPath: './my-theme',
        vfsPath: '/wordpress/wp-content/themes/my-theme'
      }
    ],
    blueprint: {
      steps: [
        {
          step: 'installTheme',
          themeData: {
            resource: 'vfs',
            path: '/wordpress/wp-content/themes/my-theme'
          }
        },
        {
          step: 'activateTheme',
          themeFolderName: 'my-theme'
        }
      ]
    }
  });

  const homeUrl = new URL('/', cliServer.serverUrl);
  const response = await fetch(homeUrl);
  const html = await response.text();

  expect(html).toContain('<header class="site-header">');
});
```

<!-- ### Testing a plugin with different WordPress/PHP versions -->

### Testando um plugin com diferentes versões do WordPress/PHP

```TypeScript
test('plugin funciona com WordPress 6.4 e PHP 8.0', async () => {
  cliServer = await runCLI({
    command: 'server',
    php: '8.0',
    wp: '6.4',
    mount: [
      {
        hostPath: './my-plugin',
        vfsPath: '/wordpress/wp-content/plugins/my-plugin'
      }
    ],
    blueprint: {
      steps: [
        {
          step: 'activatePlugin',
          pluginPath: '/wordpress/wp-content/plugins/my-plugin/plugin.php'
        }
      ]
    }
  });

  const homeUrl = new URL('/', cliServer.serverUrl);
  const response = await fetch(homeUrl);

  expect(response.status).toBe(200);
});
```

<!-- ## Advanced configuration -->

## Configuração avançada

<!-- ### Skip WordPress and SQLite setup -->

### Pular configuração do WordPress e SQLite

<!-- When you only need to test PHP code without WordPress, you can skip the setup for faster testing: -->

Quando você precisa apenas testar código PHP sem WordPress, pode pular a configuração para testes mais rápidos:

```TypeScript
const cliServer = await runCLI({
  command: 'server',
  skipWordPressSetup: true,
  skipSqliteSetup: true,
  php: '8.3'
});

// Escrever e testar scripts PHP personalizados
await cliServer.playground.writeFile(
  '/wordpress/test.php',
  '<?php echo "Olá do PHP!"; ?>'
);

const testUrl = new URL('/test.php', cliServer.serverUrl);
const response = await fetch(testUrl);
console.log(await response.text()); // Saída: Olá do PHP!
```

<!-- ### Error handling -->

### Tratamento de erros

```TypeScript
import { runCLI } from "@wp-playground/cli";

try {
  const cliServer = await runCLI({
    command: 'server',
    debug: true // Habilitar registro de erros do PHP
  });

  // Seu código de teste aqui

} catch (error) {
  console.error('Falha ao iniciar servidor:', error);
}
```

<!-- ### Following symlinks programmatically -->

### Seguindo links simbólicos programaticamente

```TypeScript
const cliServer = await runCLI({
  command: 'server',
  followSymlinks: true,
  'mount-before-install': [
    {
      hostPath: './symlinked-directory',
      vfsPath: '/wordpress/wp-content/plugins/my-plugin'
    }
  ]
});
```

:::caution

<!-- Using symlinks can expose files outside mounted directories. Only enable this feature when you trust the symlink targets. -->

Usar links simbólicos pode expor arquivos fora dos diretórios montados. Habilite este recurso apenas quando confiar nos destinos dos links simbólicos.
:::
