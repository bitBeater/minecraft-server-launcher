import { existsSync } from 'std/fs/exists.ts';
import { DEFAULT_SERVER_PROPERTIES_PATH } from 'utils/consts.ts';
import { copyFileRecursive, getServerPropertiesPath } from 'utils/fs.ts';
import { logger } from 'utils/logger.ts';

export function existsServerProperties(version: string): boolean {
 const serverPropertiesPath = getServerPropertiesPath(version);
 return existsSync(serverPropertiesPath);
}

export function writeDefaultServerProperties(version: string) {
 const serverPropertiesPath = getServerPropertiesPath(version);
 logger.debug('writing server properties', serverPropertiesPath);
 const defaultServerPropertiesFile = Deno.openSync(DEFAULT_SERVER_PROPERTIES_PATH);
 copyFileRecursive(DEFAULT_SERVER_PROPERTIES_PATH, serverPropertiesPath);
 defaultServerPropertiesFile.close();
}
