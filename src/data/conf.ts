import { CONFIG_FILE_PATH, DEFAULT_CONFIG } from "../consts.ts";
import { MinecraftServerLauncherConf } from '../types/conf.ts';


export function getConf(): MinecraftServerLauncherConf {

    if (!Deno.statSync(CONFIG_FILE_PATH).isFile) {
        Deno.writeTextFileSync(CONFIG_FILE_PATH, JSON.stringify(DEFAULT_CONFIG, null, 4));
        return DEFAULT_CONFIG;
    }

    return JSON.parse(Deno.readTextFileSync(CONFIG_FILE_PATH));
}