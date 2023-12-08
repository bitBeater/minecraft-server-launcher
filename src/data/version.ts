import { VersionManifestV2 } from "../types/versionManifestV2.ts";
import { getConf } from "./conf.ts";



export async function getVersionManifestV2(): Promise<VersionManifestV2> {
    return fetch(getConf().versionManifestV2Url).then(res => res.json());
}

