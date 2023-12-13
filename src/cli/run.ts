// @skip-test
import { acceptEula } from 'cli/eula.ts';
import { install } from 'cli/install.ts';
import { isServerInstalled } from 'data/installation.ts';
import { getVersionManifestV2 } from 'data/version.ts';
import { InvalidSemver } from 'errors/invalidSemver.ts';
import { launchMinecraftServer } from 'services/launcher.ts';
import { validateSemver } from 'utils/validators.ts';


export async function run(options: any, ...args: string[]) {
    const lattestAvailableVersion = (await getVersionManifestV2()).latest.release;
    let versionToRun = args?.[0]?.trim() || lattestAvailableVersion;

    if (versionToRun && !validateSemver(versionToRun))
        throw new InvalidSemver(versionToRun);


    if (!isServerInstalled(versionToRun)) {
        // const installResponse = await Confirm.prompt({ message: `Server ${versionToRun}  is not installed. install?`, default: true });
        // if (!installResponse) return;
        await install(undefined, versionToRun);
    }

    acceptEula(versionToRun);
    launchMinecraftServer(versionToRun);
}