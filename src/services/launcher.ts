import { join } from 'https://deno.land/std@0.134.0/path/mod.ts';
import { getConf } from '../data/conf.ts';
import { JAR_SERVER } from './../consts.ts';
import { logger } from './../utils/logger.ts';
import { getLatestInstalledVersion } from './version.ts';

export function launchMinecraftServer(version = getLatestInstalledVersion()) {
    const conf = getConf();
    const launchArgs = conf.launchArgs[version] || conf.launchArgs.default;
    const jarServerPath = join(conf.serverInstallationDir, version, JAR_SERVER);
    const args = [...launchArgs.javaArgs, '-jar', jarServerPath, ...launchArgs.serverArgs];

    logger.info(`launching server version ${version}`);
    logger.debug('launching server with comand', 'java', args?.join(' '));

    const command = new Deno.Command('java', {
        args,
        cwd: join(conf.serverInstallationDir, version),
        stdout: 'inherit',
        stderr: 'inherit',
        stdin: 'inherit',
    });

    const process = command.spawn();

    logger.info('server launched successfully with pid', process.pid);
}