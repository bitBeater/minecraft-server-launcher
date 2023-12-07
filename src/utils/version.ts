import { valid as isValidSemver, maxSatisfying } from "https://deno.land/x/semver/mod.ts";
import { VersionManifestV2 } from "../types/versionManifestV2.ts";
import { getConf } from "./conf.ts";



export function getInstalledVersions(): string[] {

    const dirs = Deno.readDirSync(getConf().serverInstallationDir);
    const retVal: string[] = [];

    for (const dir of dirs) {
        if (dir.isDirectory && isValidSemver(dir.name)) {
            retVal.push(dir.name);
        }
    }

    return retVal;
}

export function getLatestInstalledVersion(): string {
    const installedVersions = getInstalledVersions();
    return maxSatisfying(installedVersions, '*');
}


export async function getVersionManifestV2(): Promise<VersionManifestV2> {
    return fetch(getConf().versionManifestV2Url).then(res => res.json());
}

