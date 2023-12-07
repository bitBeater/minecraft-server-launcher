import { valid as isValidSemver, maxSatisfying } from "https://deno.land/x/semver/mod.ts";
import { getConf } from "../data/conf.ts";
import { getServerInstallationDirs } from "../data/installation.ts";
import { VersionManifestV2 } from "../types/versionManifestV2.ts";






function getInstalledVersions() {
    return getServerInstallationDirs().filter(i => isValidSemver(i));
}


export function getLatestInstalledVersion(): string {
    const installedVersions = getInstalledVersions();
    return maxSatisfying(installedVersions, '*');
}


export async function getVersionManifestV2(): Promise<VersionManifestV2> {
    return fetch(getConf().versionManifestV2Url).then(res => res.json());
}


