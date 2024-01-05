import { existsSync } from 'std/fs/exists.ts';
import { join, resolve } from 'std/path/mod.ts';
import { appConfig } from 'utils/config.ts';
import { writeFileAndDir } from 'utils/fs.ts';
import { logger } from 'utils/logger.ts';

export function existsEula(version: string): boolean {
 const eulaPath = resolve(join(appConfig.serverInstallationDir, version, 'eula.txt'));
 return existsSync(eulaPath);
}

export function writeEula(version: string): string {
 const eulaPath = resolve(join(appConfig.serverInstallationDir, version, 'eula.txt'));
 const eula = `#${new Date().toUTCString()}\neula=true`;

 logger.debug('writing eula.txt', eulaPath);
 writeFileAndDir(eulaPath, eula, { createNew: true });

 return eula;
}
