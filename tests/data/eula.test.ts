import { existsEula, writeEula } from 'data/eula.ts';
import { appConfig } from 'utils/config.ts';

import { assertEquals } from 'std/assert/assert_equals.ts';
import { join, resolve } from 'std/path/mod.ts';
import { afterAll, beforeEach, describe, it } from 'std/testing/bdd.ts';
import { clearServerInstallationDir } from '../test_utils/utils.ts';

describe('eula', () => {
 beforeEach(() => clearServerInstallationDir());
 afterAll(() => clearServerInstallationDir());

 it('should return false if the EULA file does not exist', () => {
  const version = '1.20.0';
  assertEquals(existsEula(version), false);
 });

 it('should return true if the EULA file exists', () => {
  const version = '1.20.0';
  writeEula(version);
  assertEquals(existsEula(version), true);
 });

 it('should write the EULA file', () => {
  const version = '1.20.0';
  const eulaContent = writeEula(version);
  const eulaPath = resolve(join(appConfig.serverInstallationDir, version, 'eula.txt'));

  assertEquals(Deno.readTextFileSync(eulaPath), eulaContent);
 });
});
