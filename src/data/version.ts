import { maxSatisfying } from "https://deno.land/x/semver/mod.ts";
import { VersionManifestV2 } from "../types/versionManifestV2.ts";
import { getConf } from "./conf.ts";




export function getLatestInstalledVersion(): string {
    const installedVersions = getInstalledVersions();
    return maxSatisfying(installedVersions, '*');
}


export async function getVersionManifestV2(): Promise<VersionManifestV2> {
    return fetch(getConf().versionManifestV2Url).then(res => res.json());
}

