// @skip-test
import { install } from 'cli/install.ts';
import { migrate } from 'cli/migrate.ts';
import { run } from 'cli/run.ts';
import { update } from 'cli/update.ts';
import { listAvailableVersions, listInstalledVersions } from 'cli/version.ts';
import { Command } from 'cliffy/command/mod.ts';
import { getConf } from 'data/conf.ts';
import { log } from 'iggs-utils';
import { existsSync } from 'utils/fs.ts';
import { logger } from 'utils/logger.ts';

/**
 *
## Usage

- **View Launcher Version**

  ```sh
  ./minecraft_server_launcher [-v | --version]
  ```

- **Launch the lastest installed mincreaft server**
  ```sh
  ./minecraft_server_launcher
  ```
- **Start a Specific Server Version**
  ```sh
  ./minecraft_server_launcher <version>
  ```
- **List Installed Servers**

  ```sh
  ./minecraft_server_launcher [-l | --list]
  ```

- **List Available Servers for download**

  ```sh
  ./minecraft_server_launcher [-la | --list-available]
  ```

- **Start a Specific Server Version**
  ```sh
  ./minecraft_server_launcher <version>
  ```
- **Install a Server**
  ```sh
  ./minecraft_server_launcher [i | install] <version> <optional: version to copy worlds and configs from>
  ```
 */

if (!existsSync(getConf().serverInstallationDir)) {
 Deno.mkdirSync(getConf().serverInstallationDir, { recursive: true });
}

await new Command()
 //  .default('run')
 .name('minecraft_server_launcher')
 .version('0.0.1')
 .description('Minecraft Server Launcher')
 .globalOption('-d, --debug', 'Enable debug output.')
 .globalAction(async (options) => {
  if (options.debug) {
   logger.logLevel = log.LogLevel.DEBUG;
  }

  await update();
 })
 // COMANDS
 //  run
 .command('run')
 //  .default('run')
 .arguments('[version:string]')
 .description('Launch a minecraft server specified by version. If no version is specified, the lastest installed version will be launched.')
 .action(run)
 // install
 .command('install', 'i')
 .arguments('[install_version:string] [migration_version:string]')
 .description('Install a minecraft server specified by version. If no version is specified, the lastest available version will be installed.')
 .action(install)
 // migrate
 .command('migrate', 'm')
 .arguments('[version_from:string] [version_to:string]')
 .description('Migrate worlds and configs from one version to another.')
 .action(migrate)
 // list installed servers
 .command('list', 'l')
 .description('List installed servers.')
 .action(listInstalledVersions)
 // list available servers
 .command('list-available', 'la')
 .description('List available servers.')
 .action(listAvailableVersions)
 // default command
 .parse(Deno.args);
