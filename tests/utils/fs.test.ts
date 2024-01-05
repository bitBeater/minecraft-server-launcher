import { assertEquals } from 'std/assert/assert_equals.ts';
import { resolve } from 'std/path/resolve.ts';
import { beforeEach, describe, it } from 'std/testing/bdd.ts';
import { appConfig } from 'utils/config.ts';
import { copyFileRecursive, expandTilde, isTildeNotation, writeFileAndDir } from 'utils/fs.ts';
import { clearServerInstallationDir } from '../test_utils/utils.ts';

describe('writeFileAndDir', () => {
 beforeEach(() => clearServerInstallationDir());

 it('should write the file with the provided data', () => {
  const filePath = resolve(appConfig.serverInstallationDir, 'not_existing_parent_dir', 'testFile.txt');
  const fileData = 'Test data';

  writeFileAndDir(filePath, fileData);

  const readedFileData = Deno.readTextFileSync(filePath);

  assertEquals(fileData, readedFileData);
 });
});

describe('copyFileAndDir', () => {
 beforeEach(() => clearServerInstallationDir());

 it('should copy the file within a file with a non existing dir', () => {
  const baseFilePath = resolve(appConfig.serverInstallationDir, 'base_test_file.txt');
  const newFilePath = resolve(appConfig.serverInstallationDir, 'not_existing_parent_dir', 'new_test_file.txt');
  const fileData = 'Test data works';

  writeFileAndDir(baseFilePath, fileData);
  copyFileRecursive(baseFilePath, newFilePath);

  const readedFileData = Deno.readTextFileSync(newFilePath);

  assertEquals(fileData, readedFileData);
 });
});

describe('tilde notation path', () => {
 it('isTildeNotation', () => {
  assertEquals(isTildeNotation('path/~/here'), false);
  assertEquals(isTildeNotation('~johnDoe/path/here'), true);
  assertEquals(isTildeNotation('~/path/here'), true);
  assertEquals(isTildeNotation('.~/path/here'), false);
 });

 it('expandTilde', () => {
  const HOME = Deno.env.get('HOME');
  Deno.env.set('HOME', '/home/johnDoe');

  const resolved = expandTilde('~/test/path');
  Deno.env.set('HOME', HOME);
  assertEquals(resolved, '/home/johnDoe/test/path');
 });
});
