import { gt } from 'https://deno.land/x/semver@v1.4.1/mod.ts';
import { install } from "../cli/install.ts";
import { getVersionManifestV2 } from '../data/version.ts';
import { getLatestInstalledVersion } from '../services/version.ts';


export async function update() {
    const lattestAvailableVersion = (await getVersionManifestV2()).latest.release;
    const lattestInstalledVersion = getLatestInstalledVersion();

    if (!lattestInstalledVersion || gt(lattestAvailableVersion, lattestInstalledVersion)) {
        console.log(`${lattestAvailableVersion} version is available. Installing...`);
        await install(undefined, lattestAvailableVersion);
    }
}
