// @skip-test
import { getVersionManifestV2 } from 'data/version.ts';
import { getInstalledVersions } from 'services/version.ts';

export function listInstalledVersions() {
 const versions = getInstalledVersions();
 console.log(versions.join('\n'));
}

export async function listAvailableVersions() {
 const versionManifestV2 = await getVersionManifestV2();
 console.log(versionManifestV2.versions.map((v) => v.id).reverse().join('\n'));
}
