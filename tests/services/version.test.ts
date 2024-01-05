import { getInstalledVersions, getLatestInstalledVersion, getPreviousVersion } from 'services/version.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';
import { join } from 'std/path/mod.ts';
import { beforeAll, describe, it } from 'std/testing/bdd.ts';
import { appConfig } from 'utils/config.ts';
import { clearServerInstallationDir } from '../test_utils/utils.ts';

describe('version service', () => {
 const mockInstallationDirs = ['1.1.0', '1.5.0', '2.0.0'];

 beforeAll(() => {
  clearServerInstallationDir();
  for (const dir of mockInstallationDirs) {
   Deno.mkdirSync(join(appConfig.serverInstallationDir, dir), { recursive: true });
  }
 });

 it('should return all installed versions sorted from latest to oldest', () => {
  const installedVersions = getInstalledVersions();
  assertEquals(installedVersions, mockInstallationDirs.toReversed());
 });

 it('should return the latest installed version', () => {
  const latestInstalledVersion = getLatestInstalledVersion();
  assertEquals(latestInstalledVersion, '2.0.0');
 });

 it('should return the previous version based on the base version', () => {
  const previousVersion = getPreviousVersion('1.8.0');
  assertEquals(previousVersion, '1.5.0');
 });

 it('should return undefined if there is no previous version', () => {
  const previousVersion = getPreviousVersion('1.0.0');
  assertEquals(previousVersion, undefined);
 });
});
