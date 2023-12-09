import { valid as isValidSemver, maxSatisfying } from "https://deno.land/x/semver/mod.ts";
import { gt } from 'https://deno.land/x/semver@v1.4.1/mod.ts';
import { getServerInstallationDirs } from "../data/installation.ts";


/**
 * 
 * @returns all installed versions sorted from latest to oldest
 */
export function getInstalledVersions() {
    return getServerInstallationDirs().filter(i => isValidSemver(i)).sort((v1, v2) => gt(v1, v2) ? 1 : -1);
}


export function getLatestInstalledVersion(): string {
    const installedVersions = getInstalledVersions();
    return maxSatisfying(installedVersions, '*');
}
