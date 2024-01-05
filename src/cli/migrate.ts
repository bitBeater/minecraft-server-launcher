// @skip-test
import { migrate as doMigration } from 'services/migration.ts';
import { logger } from 'utils/logger.ts';
import { validateSemver } from 'utils/validators.ts';
import { InvalidSemver } from '../errors/invalid_semver.ts';
import { selectInstalledVersion } from './select_installed_version.ts';

export async function migrate(_options, ...args: string[]) {
 let versionFrom = args?.[0]?.trim();
 let versionTo = args?.[1]?.trim();

 if (versionFrom && !validateSemver(versionFrom)) {
  throw new InvalidSemver(versionFrom);
 }

 if (versionTo && !validateSemver(versionTo)) {
  throw new InvalidSemver(versionTo);
 }

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
  versionFrom = await selectInstalledVersion({ message: 'Select version to migrate from', ommit: [versionTo] });
 }

 if (!versionTo) {
  versionTo = await selectInstalledVersion({ message: 'Select version to migrate to', ommit: [versionFrom] });
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
