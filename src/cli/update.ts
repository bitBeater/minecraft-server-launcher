import { install } from 'cli/install.ts';
import { getVersionManifestV2 } from 'data/version.ts';
import { getInstalledVersions } from 'services/version.ts';


export async function update() {
    const lattestAvailableVersion = (await getVersionManifestV2()).latest.release;
    const installedVersions = getInstalledVersions();

    if (!installedVersions.includes(lattestAvailableVersion)) {
        console.log(`${lattestAvailableVersion} version is available. Installing...`);
        await install(undefined, lattestAvailableVersion);
    }
}
