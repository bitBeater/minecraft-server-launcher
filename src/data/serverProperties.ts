import { join, resolve } from 'https://deno.land/std@0.196.0/path/mod.ts';
import { existsSync } from '../utils/fs.ts';
import { logger } from './../utils/logger.ts';
import { getConf } from './conf.ts';

export function existsServerProperties(version: string): boolean {
    const serverConfigPath = join(getConf().serverInstallationDir, version, 'server.properties');
    return existsSync(serverConfigPath);
}


export function writeServerProperties(version: string) {
    const serverPropertiesPath = join(getConf().serverInstallationDir, version, 'server.properties');
    logger.debug('writing server.properties', serverPropertiesPath);
    Deno.copyFileSync(resolve('./assets/server.properties'), serverPropertiesPath);
}
