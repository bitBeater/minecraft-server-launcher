
import { Confirm } from 'https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/confirm.ts';
import { existsEula, writeEula } from "../data/eula.ts";
import { isServerInstalled } from '../data/installation.ts';
import { getVersionManifestV2 } from '../data/version.ts';
import { launchMinecraftServer } from '../services/launcher.ts';
import { validateSemver } from '../utils/validators.ts';
import { InvalidSemver } from './../errors/invalidSemver.ts';
import { install } from './install.ts';

export async function run(options: any, ...args: string[]) {
    const lattestAvailableVersion = (await getVersionManifestV2()).latest.release;
    let versionToRun = args?.[0]?.trim() || lattestAvailableVersion;

    if (versionToRun && !validateSemver(versionToRun))
        throw new InvalidSemver(versionToRun);


    if (!isServerInstalled(versionToRun)) {
        const installResponse = await Confirm.prompt({ message: `Server ${versionToRun}  is not installed. install?`, default: true });
        if (!installResponse) return;
        await install(undefined, versionToRun);
    }

    if (!existsEula(versionToRun) && (await Confirm.prompt(`Accept EULA? By accepting you are indicating your agreement to minecraft EULA (https://aka.ms/MinecraftEULA).`)))
        writeEula(versionToRun);

    launchMinecraftServer(versionToRun);
}