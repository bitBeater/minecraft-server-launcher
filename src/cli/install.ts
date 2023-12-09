
import { Confirm } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/confirm.ts";
import { lt } from "https://deno.land/x/semver@v1.4.1/mod.ts";
import { isServerInstalled } from "../data/installation.ts";
import { getVersionManifestV2 } from "../data/version.ts";
import { installMinecraftServer } from "../services/installer.ts";
import { getInstalledVersions } from "../services/version.ts";
import { validateSemver } from "../utils/validators.ts";
import { InvalidSemver } from './../errors/invalidSemver.ts';
import { migrate } from "./migrate.ts";
import { selectInstalledVersion } from "./selectInstalledVersion.ts";

export async function install(options: any, ...args: string[]) {
    const lattestAvailableVersion = (await getVersionManifestV2()).latest.release;
    const versionToInstall = args?.[0]?.trim() || lattestAvailableVersion;
    let versionToMigrate = args?.[1]?.trim();


    if (versionToInstall && !validateSemver(versionToInstall))
        throw new InvalidSemver(versionToInstall);

    if (versionToMigrate && !validateSemver(versionToMigrate))
        throw new InvalidSemver(versionToMigrate);

    // TODO:is this check necessary?
    if (isServerInstalled(versionToInstall)) {
        const installResponse = await Confirm.prompt(`Server ${versionToInstall}  is already installed. re-install?`);
        if (!installResponse) return;
    }

    await installMinecraftServer(versionToInstall);

    const installedVersions = getInstalledVersions();
    if (!versionToMigrate && installedVersions.length) {
        const previousVersion = getPreviousVersion(versionToInstall, installedVersions);
        versionToMigrate = await selectInstalledVersion('Select version to migrate from', previousVersion);
    }

    if (versionToMigrate)
        await migrate(undefined, versionToMigrate, versionToInstall);
}


function getPreviousVersion(baseVersion: string, versions: string[]) {
    for (const version of versions)
        if (lt(version, baseVersion)) return version;
}