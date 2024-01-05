import { migrate } from 'services/migration.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';
import { copySync, existsSync } from 'std/fs/mod.ts';
import { walkSync } from 'std/fs/walk.ts';
import { join, resolve } from 'std/path/mod.ts';
import { afterAll, beforeEach, describe, it } from 'std/testing/bdd.ts';
import { appConfig } from 'utils/config.ts';
import { JAR_SERVER_FILE_NAME } from 'utils/paths.ts';
import { clearServerInstallationDir, INSTALLED_SERVER_DIR } from '../test_utils/utils.ts';

describe('migrate', () => {
 beforeEach(() => {
  clearServerInstallationDir();
 });

 afterAll(() => {
  clearServerInstallationDir();
 });

 it('should migrate files from one version to another', () => {
  const versionToMigrateFrom = '1.20.0';
  const versionToMigrateTo = '1.20.1';
  const origPathRoot = resolve(appConfig.serverInstallationDir, versionToMigrateFrom);
  const destPathRoot = resolve(appConfig.serverInstallationDir, versionToMigrateTo);

  //copy installed server from assets to test dir
  copySync(INSTALLED_SERVER_DIR, origPathRoot);

  migrate(versionToMigrateFrom, versionToMigrateTo);

  //jar file is skipped while migrating
  const skip = [new RegExp(JAR_SERVER_FILE_NAME + '$')];

  const formVersionFiles = walkSync(origPathRoot, { skip });

  for (const formVersionFile of formVersionFiles) {
   const toVersionFile = formVersionFile.path.replace(origPathRoot, destPathRoot);
   assertEquals(existsSync(toVersionFile), true);
  }
 });

 it('should not migrate the server JAR file', () => {
  const versionToMigrateFrom = '1.20.0';
  const versionToMigrateTo = '1.20.1';
  const origPathRoot = resolve(appConfig.serverInstallationDir, versionToMigrateFrom);
  const destPathRoot = resolve(appConfig.serverInstallationDir, versionToMigrateTo);

  //copy installed server from assets to test dir
  copySync(INSTALLED_SERVER_DIR, origPathRoot);

  migrate(versionToMigrateFrom, versionToMigrateTo);

  const jarFile = join(destPathRoot, JAR_SERVER_FILE_NAME);
  assertEquals(existsSync(jarFile), false);
 });
});
