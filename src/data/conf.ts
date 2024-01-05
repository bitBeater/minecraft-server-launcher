import { MinecraftServerLauncherConf } from 'types/conf.ts';
import { writeFileAndDir } from 'utils/fs.ts';
import { logger } from 'utils/logger.ts';
import { SYS_CONFIG_FILE_PATH, USR_CONFIG_FILE_PATH } from 'utils/paths.ts';

export function getUsrConf(): MinecraftServerLauncherConf {
 logger.debug('loading user config from:', USR_CONFIG_FILE_PATH);
 return JSON.parse(Deno.readTextFileSync(USR_CONFIG_FILE_PATH));
}

export function setUsrConf(conf: MinecraftServerLauncherConf) {
 writeFileAndDir(USR_CONFIG_FILE_PATH, JSON.stringify(conf, null, 4));
}

export function getSysConf(): MinecraftServerLauncherConf {
 logger.debug('loading system config from:', SYS_CONFIG_FILE_PATH);
 return JSON.parse(Deno.readTextFileSync(SYS_CONFIG_FILE_PATH));
}
