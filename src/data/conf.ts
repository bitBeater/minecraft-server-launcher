import { existsSync } from 'std/fs/exists.ts';
import { MinecraftServerLauncherConf } from 'types/conf.ts';
import { CONFIG_FILE_PATH, DEFAULT_CONFIG } from 'utils/consts.ts';

export function getConf(): MinecraftServerLauncherConf {
 if (!existsSync(CONFIG_FILE_PATH)) {
  Deno.writeTextFileSync(CONFIG_FILE_PATH, JSON.stringify(DEFAULT_CONFIG, null, 4));
  return DEFAULT_CONFIG;
 }
 return JSON.parse(Deno.readTextFileSync(CONFIG_FILE_PATH));
}
