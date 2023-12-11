import { DEFAULT_SERVER_PROPERTIES_PATH } from 'utils/consts.ts';
import { existsSync, getServerPropertiesPath } from 'utils/fs.ts';
import { logger } from 'utils/logger.ts';


export function existsServerProperties(version: string): boolean {
    const serverPropertiesPath = getServerPropertiesPath(version);
    return existsSync(serverPropertiesPath);
}


export function writeDefaultServerProperties(version: string) {
    const serverPropertiesPath = getServerPropertiesPath(version);
    logger.debug('writing server properties', serverPropertiesPath);
    Deno.copyFileSync(DEFAULT_SERVER_PROPERTIES_PATH, serverPropertiesPath);
}
