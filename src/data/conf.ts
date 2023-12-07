import { MinecraftServerLauncherConf } from '../types/conf.ts';

export function getConf(): MinecraftServerLauncherConf {
    return JSON.parse(Deno.readTextFileSync('./conf.json'));
}