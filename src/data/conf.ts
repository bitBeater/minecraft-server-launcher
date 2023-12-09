import { CONFIG_FILE_PATH, DEFAULT_CONFIG } from "../consts.ts";
import { MinecraftServerLauncherConf } from '../types/conf.ts';
import { existsSync } from "../utils/fs.ts";


export function getConf(): MinecraftServerLauncherConf {

    if (!existsSync(CONFIG_FILE_PATH)) {
        Deno.writeTextFileSync(CONFIG_FILE_PATH, JSON.stringify(DEFAULT_CONFIG, null, 4));
        return DEFAULT_CONFIG;
    }
    return JSON.parse(Deno.readTextFileSync(CONFIG_FILE_PATH));
}