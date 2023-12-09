import { join } from 'https://deno.land/std@0.196.0/path/mod.ts';
import { existsSync } from '../utils/fs.ts';
import { logger } from './../utils/logger.ts';
import { getConf } from './conf.ts';

export function existsEula(version: string): boolean {
    const eulaPath = join(getConf().serverInstallationDir, version, 'eula.txt');
    return existsSync(eulaPath);
}

export function writeEula(version: string) {
    const eulaPath = join(getConf().serverInstallationDir, version, 'eula.txt');
    const eula = `#${new Date().toUTCString()}\neula=true`

    logger.debug('writing eula.txt', eulaPath);
    Deno.writeTextFileSync(eulaPath, eula);
}