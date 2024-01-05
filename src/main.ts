// @skip-test
import { info } from 'cli/info.ts';
import { install } from 'cli/install.ts';
import { migrate } from 'cli/migrate.ts';
import { run } from 'cli/run.ts';
import { update } from 'cli/update.ts';
import { listAvailableVersions, listInstalledVersions } from 'cli/version.ts';
import { Command } from 'cliffy/command/mod.ts';
import { log } from 'iggs-utils';
import { existsSync } from 'std/fs/exists.ts';
import { appConfig } from 'utils/config.ts';
import { logger } from 'utils/logger.ts';

try {
 if (!existsSync(appConfig.serverInstallationDir)) {
  Deno.mkdirSync(appConfig.serverInstallationDir, { recursive: true });
 }
} catch (error) {
 logger.error(error);
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
  try {
   await update();
  } catch (error) {
   logger.error(error);
  }
 })
 //  run
 .default('run')
 .command('run').alias('r')
 .arguments('[version:string]')
 .description('Launch a minecraft server specified by version. If no version is specified, the lastest installed version will be launched.')
 .action(run)
 // install
 .command('install').alias('i')
 .arguments('[install_version:string] [migration_version:string]')
 .description('Install a minecraft server specified by version. If no version is specified, the lastest available version will be installed.')
 .action(install)
 // migrate
 .command('migrate').alias('m')
 .arguments('[version_from:string] [version_to:string]')
 .description('Migrate worlds and configs from one version to another.')
 .action(migrate)
 // list installed servers
 .command('list').alias('l')
 .description('List installed servers.')
 .action(listInstalledVersions)
 // list available servers
 .command('list-available').alias('la')
 .description('List available servers.')
 .action(listAvailableVersions)
 // list available servers
 .command('info')
 .description('Display current configuration.')
 .action(info)
 .parse(Deno.args);
