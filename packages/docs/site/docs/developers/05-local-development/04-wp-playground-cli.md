---
title: Playground CLI
slug: /developers/local-development/wp-playground-cli
description: A command-line tool for WordPress development and testing with quick setup, flexible configuration, and minimal dependencies.
---

# Playground CLI

[@wp-playground/cli](https://www.npmjs.com/package/@wp-playground/cli) is a command-line tool that simplifies the WordPress development and testing flow. The Playground CLI also includes a set of flags to personalize the developer environment to meet developers' needs.

**Key features:**

-   **Quick setup**: Set up a local WordPress environment in seconds.
-   **Flexibility**: Allows for configuration to adapt to different scenarios.
-   **Simple environment**: No extra configuration, just a compatible Node version, and you are ready to use it.

## Requirements

The Playground CLI requires Node.js 20.18 or higher, which is the recommended Long-Term Support (LTS) version. You can download it from the [Node.js website](https://nodejs.org/en/download).

## Quick start

To run the Playground CLI, open a command line and use the following command:

```bash
npx @wp-playground/cli@latest server
```

![Playground CLI in Action](@site/static/img/developers/npx-wp-playground-server.gif)

With the previous command, you only get a fresh WordPress instance to test. Most developers will want to test their own work. To test a plugin or a theme, navigate to your project folder and run the CLI with the `--auto-mount` flag.

The `--auto-mount` flag analyzes the directory structure and automatically determines whether you're working with a plugin, theme, wp-content directory, full WordPress installation, or static HTML/PHP files. It then mounts your project to the correct path in the virtual WordPress environment, so you can start developing immediately without manual configuration.

```bash
cd my-plugin
npx @wp-playground/cli@latest server --auto-mount
```

### Choose a WordPress and PHP version

By default, the CLI loads PHP 8.3 and the latest stable version of WordPress. You can specify different versions using the `--wp=<version>` and `--php=<version>` flags. This is particularly useful when you need to test your plugin or theme for compatibility across different WordPress and PHP versions, ensuring your code works correctly for users running older installations.

```bash
npx @wp-playground/cli@latest server --wp=6.4 --php=8.0
```

### Setting a custom site URL

Configure a custom site URL for your development environment, which is useful for testing domain-specific functionality or simulating production environments:

```bash
npx @wp-playground/cli@latest server --site-url=https://my-local-dev.test
```

### Loading blueprints

[Blueprints](/blueprints/getting-started/) configure your Playground instance's initial state. They install plugins, set options, and define landing pages.

Using the `--blueprint=<blueprint-address>` flag, Playground can run with a custom initial state. We'll use the example below to do this.

**(my-blueprint.json)**

```json
{
	"landingPage": "/wp-admin/options-general.php?page=akismet-key-config",
	"login": true,
	"plugins": ["hello-dolly", "https://raw.githubusercontent.com/adamziel/blueprints/trunk/docs/assets/hello-from-the-dashboard.zip"]
}
```

CLI command loading a blueprint:

```bash
npx @wp-playground/cli@latest server --blueprint=my-blueprint.json
```

### Mounting folders manually

Some projects have a specific structure that requires a custom configuration; for example, your repository contains all the files in the `/wp-content/` folder. So in this scenario, you can specify to the Playground CLI that it will mount your project from that folder using the `--mount-dir` flag.

```bash
npx @wp-playground/cli@latest server --mount-dir . /wordpress/wp-content/plugins/MY-PLUGIN-DIRECTORY
```

:::info
On Windows, the path format used by `--mount`, for example, `/host/path:/vfs/path`, can clash with the system path format, e.g. to the machine, it's unclear which `:` separates the paths in `--mount=C:\plugin:/wordpress/wp-content/plugin`. To resolve this, use `--mount-dir` and `--mount-dir-before-install` instead. These flags let you specify host and virtual file system paths in a space-separated format: `--mount-dir "/host/path"` `"/vfs/path"`.
:::

**Multiple mounts:**

You can mount multiple directories at once:

```bash
npx @wp-playground/cli@latest server \
  --mount-dir=./my-plugin /wordpress/wp-content/plugins/my-plugin \
  --mount-dir=./my-theme /wordpress/wp-content/themes/my-theme
```

### Mounting before WordPress installation

Consider mounting your WordPress project files before the WordPress installation begins. This approach is beneficial if you want to override the Playground boot process, as it can help connect Playground with `WP-CLI`. The `--mount-dir-before-install` flag supports this process.

```bash
npx @wp-playground/cli@latest server --mount-dir-before-install=. /wordpress/
```

### Symlink support for monorepos

Sometimes you're working with a complex project structure where directories are symlinked to another location on the disk, e.g.:

```
/home/alex/my-project
└── wp-content
    └── plugins
        ├── hello-dolly/                # regular directory
        └── secret-plugin → /home/www/plugins/secret-plugin
```

By default, Playground CLI only accesses the directories you explicitly mount and won't load any files from `/home/www/plugins/secret-plugin`. You can, however, explicitly instruct Playground CLI to follow that, and other, symlinks with the `--follow-symlink` option:

```bash
npx @wp-playground/cli@latest server \
  --follow-symlinks \
  --mount-dir-before-install=./packages/my-plugin /wordpress/wp-content/plugins/my-plugin
```

:::caution
Using `--follow-symlinks` can expose files outside mounted directories to Playground and could be a security risk. Only use this flag when you trust the symlink targets.
:::

### Understanding data persistence and SQLite location

By default, Playground CLI stores WordPress files and the SQLite database in **temporary directories on your operating system**:

```
<OS-TEMP-DIR>/playground-<random-id>/
├── wordpress/          # WordPress installation
├── internal/          # Playground runtime config
└── tmp/              # Temporary PHP files
```

**Finding your temp directory:**

The actual location depends on your OS (these are examples or common possibilities):

-   **macOS/Linux**: May be under `/tmp/` or `/private/var/folders/` (varies by system)
-   **Windows**: `C:\Users\<username>\AppData\Local\Temp\`

To see the exact temp directory path being used, run the CLI with the `--verbosity=debug` flag:

```bash
npx @wp-playground/cli@latest server --verbosity=debug
```

This will output something like:

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

**Where is the SQLite database stored?**

The database location depends on what you mount:

-   **Auto-mounting wp-content or full WordPress**:

    -   Database: `<your-local-project>/wp-content/database/.ht.sqlite`
    -   ✅ **Persisted locally** in your project folder

-   **Auto-mounting plugin/theme only**:

    -   Database: `<OS-TEMP-DIR>/playground-<id>/wordpress/wp-content/database/.ht.sqlite`
    -   ⚠️ **Lost when server stops** (temp directories are cleaned up)

-   **Custom mounts**: Database location follows your mount configuration

**Automatic cleanup:**
Playground CLI automatically removes temp directories that are:

-   Older than two days
-   No longer associated with a running process

**Recommendation:** To persist both your code and database when developing plugins or themes, mount the entire `wp-content` directory instead of just the plugin/theme folder.

**Example: Mounting wp-content for persistence**

```bash
# Mount your entire wp-content directory
cd my-wordpress-project
npx @wp-playground/cli@latest server --mount-dir=./wp-content /wordpress/wp-content
```

## Verbosity and debugging

The CLI supports different output verbosity levels for `quiet`, `normal` (default) and `debug` mode. Sometimes you want to hide all the stdout output, e.g. in a script or a CI automation. You can do that using the `--verbosity=quiet` option:

```bash
npx @wp-playground/cli@latest server --verbosity=quiet
```

Get detailed logging information for troubleshooting, with `debug` mode:

```bash
npx @wp-playground/cli@latest server --verbosity=debug
```

## Commands and arguments

The Playground CLI is simple, configurable, and unopinionated. You can set it up according
to your unique WordPress setup. With the Playground CLI, you can use the following top-level commands:

-   **`server`**: (Default) Starts a local WordPress server.
-   **`run-blueprint`**: Executes a Blueprint file without starting a web server.
-   **`build-snapshot`**: Builds a ZIP snapshot of a WordPress site based on a Blueprint.

The `server` command supports the following optional arguments:

-   `--port=<port>`: The port number for the server to listen on. Defaults to 9400.
-   `--version`: Show version number.
-   `--outfile`: When building, write to this output file.
-   `--site-url=<url>`: Site URL to use for WordPress. Defaults to `http://127.0.0.1:{port}`.
-   `--wp=<version>`: The version of WordPress to use. Defaults to the latest.
-   `--php=<version>`: PHP version to use. Choices: `8.4`, `8.3`, `8.2`, `8.1`, `8.0`, `7.4`, `7.3`, `7.2`. Defaults to `8.3`.
-   `--auto-mount[=<path>]`: Automatically mount a directory. If no path is provided, mounts the current working directory. You can mount a WordPress directory, a plugin directory, a theme directory, a wp-content directory, or any directory containing PHP and HTML files.
-   `--mount=<mapping>`: Manually mount a directory (can be used multiple times). Format: `"/host/path:/vfs/path"`.
-   `--mount-before-install`: Mount a directory to the PHP runtime before WordPress installation (can be used multiple times). Format: `"/host/path:/vfs/path"`.
-   `--mount-dir`: Mount a directory to the PHP runtime (can be used multiple times). Format: `"/host/path"` `"/vfs/path"`.
-   `--mount-dir-before-install`: Mount a directory before WordPress installation (can be used multiple times). Format: `"/host/path"` `"/vfs/path"`
-   `--blueprint=<path>`: The path to a JSON Blueprint file to execute.
-   `--blueprint-may-read-adjacent-files`: Consent flag: Allow "bundled" resources in a local blueprint to read files in the same directory as the blueprint file.
-   `--login`: Automatically log the user in as an administrator.
-   `--wordpress-install-mode <mode>`: Control how Playground prepares WordPress before booting. Defaults to `download-and-install`. Other options: `install-from-existing-files` (install using files you've mounted), `install-from-existing-files-if-needed` (skip setup when an existing site is detected), and `do-not-attempt-installing` (never download or install WordPress).
-   `--skip-sqlite-setup`: Do not set up the SQLite database integration.
-   `--verbosity=<level>`: Output logs and progress messages. Choices: `quiet`, `normal`, `debug`. Defaults to `normal`.
-   `--debug`: Print the PHP error log if an error occurs during boot.
-   `--follow-symlinks`: Allow Playground to follow symlinks by automatically mounting symlinked directories and files encountered in mounted directories.
-   `--internal-cookie-store`: Enable internal cookie handling. When enabled, Playground will manage cookies internally using an HttpCookieStore that persists cookies across requests. When disabled, cookies are handled externally (e.g., by a browser in Node.js environments). Defaults to false.
-   `--xdebug`: Enable Xdebug. Defaults to false.
-   `--experimental-devtools`: Enable experimental browser development tools. Defaults to false.
-   `--experimental-unsafe-ide-integration=<ide>`: Set up the Xdebug integration on VS Code(`vscode`) and PhpStorm(`phpstorm`).
-   `--experimental-multi-worker=<number>`: Enable experimental multi-worker support which requires a `/wordpress` directory backed by a real file system. Pass a positive number to specify the number of workers to use. Otherwise, defaults to the number of CPUs minus one.

## Need some help with the CLI?

With the Playground CLI, you can use the `--help` flag to get the full list of available commands and arguments.

```bash
npx @wp-playground/cli@latest --help
```

## Programmatic usage with JavaScript

The Playground CLI can also be controlled programmatically from your JavaScript/TypeScript code using the `runCLI` function. This gives you direct access to all CLI functionalities within your code, which is useful for automating end-to-end tests. Let's cover the basics of using `runCLI`.

### Running a WordPress instance with a specific version

Using the `runCLI` function, you can specify options like the PHP and WordPress versions. In the example below, we request PHP 8.3, the latest version of WordPress, and to be automatically logged in. All supported arguments are defined in the `RunCLIArgs` type.

```TypeScript
import { runCLI, RunCLIArgs} from "@wp-playground/cli";

const cliServer = await runCLI({
  command: 'server',
  php: '8.3',
  wp: 'latest',
  login: true,
} as RunCLIArgs);
```

Run the code above using your preferred TypeScript runtime, e.g. `tsx`:

```sh
npx tsx my-script.ts
```


### Setting a custom site URL programmatically

```TypeScript
import { runCLI } from "@wp-playground/cli";

const cliServer = await runCLI({
    command: 'server',
    'site-url': 'https://my-staging.example.com',
    port: 9500
  });

  // Verify site URL is set correctly
  await cliServer.playground.writeFile(
    '/wordpress/check-url.php',
    '<?php require_once "/wordpress/wp-load.php"; echo get_option("siteurl"); ?>'
  );

  const checkUrl = new URL('/check-url.php', cliServer.serverUrl);
  const response = await fetch(checkUrl);
  console.log('Site URL:', await response.text());
```

### Controlling verbosity programmatically

```TypeScript
import { runCLI } from "@wp-playground/cli";
import { logger } from '@php-wasm/logger';

const cliServer = await runCLI({
  command: 'server',
  verbosity: 'debug' // or 'quiet' or 'normal'
});

// Add custom logging
logger.debug('Custom debug message');
```

### Setting a blueprint

You can provide a blueprint in two ways: either as an object literal directly passed to the `blueprint` property, or as a string containing the path to an external `.json` file.

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
              "blogname": "Blueprint Title",
              "blogdescription": "A great blog description"
          }
        }
    ],
  },
});
```

For full type-safety when defining your blueprint object, you can import and use the `BlueprintDeclaration` type from the `@wp-playground/blueprints` package:

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

### Mounting a plugin programmatically

You can mount local directories programmatically using `runCLI`. The options `mount` and `mount-before-install` are available. The `hostPath` property expects a path to a directory on your local machine. This path should be relative to where your script is being executed.

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

**Auto-mounting programmatically:**

```TypeScript
import { runCLI } from "@wp-playground/cli";
import process from 'node:process';

// Change to your project directory
process.chdir('./my-plugin');

const cliServer = await runCLI({
  command: 'server',
  autoMount: '' // Empty string triggers auto-detection
});
```

### Combining mounts with blueprints

You can combine mounting parts of the project with blueprints, for example:

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

**Multiple mounts with blueprints:**

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

**Complex blueprint with multiple configurations:**

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
          blogname: 'Plugin Test Site',
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

## Automated testing

### Integration testing with Vitest

The programmatic API is excellent for automated testing. Here's a complete example using Vitest:

```TypeScript
import { describe, test, expect, afterEach } from 'vitest';
import { runCLI, RunCLIServer } from "@wp-playground/cli";

describe('My Plugin Tests', () => {
  let cliServer: RunCLIServer;

  afterEach(async () => {
    if (cliServer) {
      await cliServer[Symbol.asyncDispose]();
    }
  });

  test('plugin activates successfully', async () => {
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
    expect(html).toContain('My Plugin');
  });

  test('plugin settings page loads', async () => {
    cliServer = await runCLI({
      command: 'server',
      login: true, // Auto-login as admin
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

### Testing a plugin with different WordPress/PHP versions

```TypeScript
test('plugin works with WordPress 6.4 and PHP 8.0', async () => {
  cliServer = await runCLI({
    command: 'server',
    php: '8.3',
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

## Advanced configuration

### Skip WordPress and SQLite setup

When you only need to test PHP code without WordPress, you can skip the setup for faster testing:

```TypeScript
import { runCLI } from "@wp-playground/cli";

const cliServer = await runCLI({
    command: 'server',
    php: '8.3',
    wordpressInstallMode: 'do-not-attempt-installing',
    skipSqliteSetup: true,
});

// Test PHP version
await cliServer.playground.writeFile(
  '/wordpress/version.php',
  '<?php echo phpversion(); ?>'
);

const versionUrl = new URL('/version.php', cliServer.serverUrl);
const response = await fetch(versionUrl);
const version = await response.text();
console.log('PHP Version:', version); // Outputs: 8.3.x
```

### Error handling

```TypeScript
import { runCLI } from "@wp-playground/cli";

try {
  const cliServer = await runCLI({
    command: 'server',
    debug: true // Enable PHP error logging
  });

  // Your test code here

} catch (error) {
  console.error('Server failed to start:', error);
}
```

### Following symlinks programmatically

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
Using symlinks can expose files outside mounted directories. Only enable this feature when you trust the symlink targets.
:::
