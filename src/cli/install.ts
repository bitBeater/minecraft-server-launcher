// @skip-test

import { acceptEula } from 'cli/eula.ts';
import { migrate } from 'cli/migrate.ts';
import { Confirm } from 'cliffy/prompt/confirm.ts';
import { isServerInstalled } from 'data/installation.ts';
import { getVersionManifestV2 } from 'data/version.ts';
import { installMinecraftServer } from 'services/installer.ts';
import { getInstalledVersions } from 'services/version.ts';
import { validateSemver } from 'utils/validators.ts';
import { InvalidSemver } from '../errors/invalid_semver.ts';

export async function install(_options, ...args: string[]) {
 const lattestAvailableVersion = (await getVersionManifestV2()).latest.release;
 const versionToInstall = args?.[0]?.trim() || lattestAvailableVersion;
 const versionToMigrate = args?.[1]?.trim();
 console.log('installing version', versionToInstall);

 if (versionToInstall && !validateSemver(versionToInstall)) {
  throw new InvalidSemver(versionToInstall);
 }

 if (versionToMigrate && !validateSemver(versionToMigrate)) {
  throw new InvalidSemver(versionToMigrate);
 }

 // TODO:is this check necessary?
 if (isServerInstalled(versionToInstall)) {
  const installResponse = await Confirm.prompt(`Server ${versionToInstall}  is already installed. re-install?`);
  if (!installResponse) return;
 }

 if (getInstalledVersions().length) {
  await migrate(undefined, versionToMigrate, versionToInstall);
 }

 await installMinecraftServer(versionToInstall);

 console.log('Successfully installed versions', versionToInstall);

 await acceptEula(versionToInstall);
}
