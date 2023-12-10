import { getConf } from 'data/conf.ts';
import { join, resolve } from 'std/path/mod.ts';
import { existsSync, writeFileAndDir } from 'utils/fs.ts';
import { logger } from 'utils/logger.ts';

export function existsEula(version: string): boolean {
    const eulaPath = resolve(join(getConf().serverInstallationDir, version, 'eula.txt'));
    return existsSync(eulaPath);
}

export function writeEula(version: string): string {
    const eulaPath = resolve(join(getConf().serverInstallationDir, version, 'eula.txt'));
    const eula = `#${new Date().toUTCString()}\neula=true`

    logger.debug('writing eula.txt', eulaPath);
    writeFileAndDir(eulaPath, eula, { createNew: true });

    return eula;
}