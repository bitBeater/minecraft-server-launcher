import { Packages } from "../types/packages.ts";
import { VersionManifestV2 } from "../types/versionManifestV2.ts";
import { getConf } from "./conf.ts";



export async function getVersionManifestV2(): Promise<VersionManifestV2> {
    return fetch(getConf().versionManifestV2Url).then(res => res.json());
}

export async function getVersionPackages(url: string): Promise<Packages> {
    return fetch(url).then(res => res.json());
}

