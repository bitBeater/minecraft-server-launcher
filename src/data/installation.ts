import { logger } from "../utils/logger.ts";
import { getConf } from "./conf.ts";
import { getVersionManifestV2 } from "./version.ts";

export function getServerInstallationDirs(): string[] {

    const dirs = Deno.readDirSync(getConf().serverInstallationDir);
    const retVal: string[] = [];

    for (const dir of dirs) {
        if (dir.isDirectory) {
            retVal.push(dir.name);
        }
    }

    return retVal;
}


export async function installMinecraftServer(version: string): Promise<void> {
    if (version?.trim()?.length)
        version = (await getVersionManifestV2()).latest.release;

    logger.info(`Installing Minecraft Server version ${version}...`);

    return Promise.resolve();
}

export function isServerInstalled(version: string): boolean {
    return getServerInstallationDirs().includes(version.trim());
}