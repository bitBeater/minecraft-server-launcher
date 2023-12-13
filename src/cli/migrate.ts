// @skip-test
import { selectInstalledVersion } from 'cli/selectInstalledVersion.ts';
import { InvalidSemver } from 'errors/invalidSemver.ts';
import { migrate as doMigration } from 'services/migration.ts';
import { getPreviousVersion } from 'services/version.ts';
import { logger } from 'utils/logger.ts';
import { validateSemver } from 'utils/validators.ts';

export async function migrate(options: any, ...args: string[]) {

    let versionFrom = args?.[0]?.trim();
    let versionTo = args?.[1]?.trim();

    if (versionFrom && !validateSemver(versionFrom))
        throw new InvalidSemver(versionFrom);

    if (versionTo && !validateSemver(versionTo))
        throw new InvalidSemver(versionTo);

    // if (!isServerInstalled(versionFrom)) {
    //     console.log(`Server ${versionFrom}  is not installed.`);
    //     return;
    // }

    // if (!isServerInstalled(versionTo)) {
    //     const installResponse = await Confirm.prompt(`Server ${versionTo}  is not installed. install?`);
    //     if (!installResponse) return;
    //     installMinecraftServer(versionTo);
    // }


    if (!versionFrom) {
        const previousVersion = getPreviousVersion(versionTo);
        versionFrom = await selectInstalledVersion({ message: 'Select version to migrate from', ommit: [versionTo], default: previousVersion });
    }

    if (!versionTo) {
        const previousVersion = getPreviousVersion(versionTo);
        versionTo = await selectInstalledVersion({ message: 'Select version to migrate to', ommit: [versionFrom], default: previousVersion });
    }

    if (!versionTo) {
        logger.warn(`Migrating from ${versionFrom}, No version available to migrate to, aborting migration.`);
        return;
    }

    if (!versionFrom) {
        logger.warn(`Migrating to ${versionTo}, No version available to migrate from, aborting migration.`);
        return;
    }

    doMigration(versionFrom, versionTo);
}
