//@skip-test
import { Packages } from 'types/packages.ts';
import { appConfig } from 'utils/config.ts';
import { VersionManifestV2 } from '../types/version_manifest_v2.ts';

export function getVersionManifestV2(): Promise<VersionManifestV2> {
 return fetch(appConfig.versionManifestV2Url).then((res) => res.json());
}

export function getVersionPackages(url: string): Promise<Packages> {
 return fetch(url).then((res) => res.json());
}
