// @skip-test
import { getLatestInstalledVersion } from 'services/version.ts';
import { resolve } from 'std/path/mod.ts';
import { appConfig } from 'utils/config.ts';
import { logger } from 'utils/logger.ts';
import { JAR_SERVER_FILE_NAME } from 'utils/paths.ts';

export function launchMinecraftServer(version = getLatestInstalledVersion()) {
 const conf = appConfig;
 const launchArgs = conf.launchArgs[version] || conf.launchArgs.default;
 const jarServerPath = resolve(conf.serverInstallationDir, version, JAR_SERVER_FILE_NAME);
 const args = [...launchArgs.javaArgs, '-jar', jarServerPath, ...launchArgs.serverArgs];
 const cwd = resolve(conf.serverInstallationDir, version);

 logger.info(`launching server version ${version}`, jarServerPath);
 logger.debug('launching server with comand', 'java', args?.join(' '));

 const command = new Deno.Command('java', {
  args,
  cwd,
  stdout: 'inherit',
  stderr: 'inherit',
  stdin: 'inherit',
 });

 const process = command.spawn();

 logger.info('server launched successfully with pid', process.pid);
}
