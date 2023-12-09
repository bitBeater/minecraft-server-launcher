import { Confirm } from 'https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/confirm.ts';
import { isServerInstalled } from '../data/installation.ts';
import { installMinecraftServer } from '../services/installer.ts';
import { migrate as doMigration } from '../services/migration.ts';
import { validateSemver } from '../utils/validators.ts';
import { InvalidSemver } from './../errors/invalidSemver.ts';

export async function migrate(options: any, ...args: string[]) {

    const versionFrom = args?.[0]?.trim();
    const versionTo = args?.[1]?.trim();

    if (versionFrom && !validateSemver(versionFrom))
        throw new InvalidSemver(versionFrom);

    if (versionTo && !validateSemver(versionTo))
        throw new InvalidSemver(versionTo);


    if (!isServerInstalled(versionFrom)) {
        console.log(`Server ${versionFrom}  is not installed.`);
        return;
    }

    if (!isServerInstalled(versionTo)) {
        const installResponse = await Confirm.prompt(`Server ${versionTo}  is not installed. install?`);
        if (!installResponse) return;
        installMinecraftServer(versionTo);
    }


    doMigration(versionFrom, versionTo);
}
