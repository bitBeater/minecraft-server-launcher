import { valid as isValidSemver, maxSatisfying } from "https://deno.land/x/semver/mod.ts";
import { getServerInstallationDirs } from "../data/installation.ts";



export function getInstalledVersions() {
    return getServerInstallationDirs().filter(i => isValidSemver(i));
}


export function getLatestInstalledVersion(): string {
    const installedVersions = getInstalledVersions();
    return maxSatisfying(installedVersions, '*');
}





