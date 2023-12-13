import { assertEquals } from 'std/assert/assert_equals.ts';
import { resolve } from 'std/path/resolve.ts';
import { beforeEach, describe, it } from 'std/testing/bdd.ts';
import { copyFileRecursive, writeFileAndDir } from 'utils/fs.ts';
import { clearTmpDir, TESTING_TMP_DIR } from '../test_utils/utils.ts';

describe('writeFileAndDir', () => {
 beforeEach(() => clearTmpDir());

 it('should write the file with the provided data', async () => {
  const filePath = resolve(TESTING_TMP_DIR, 'not_existing_parent_dir', 'testFile.txt');
  const fileData = 'Test data';

  writeFileAndDir(filePath, fileData);

  const readedFileData = Deno.readTextFileSync(filePath);

  assertEquals(fileData, readedFileData);
 });
});

describe('copyFileAndDir', () => {
 beforeEach(() => clearTmpDir());

 it('should copy the file within a file with a non existing dir', async () => {
  const baseFilePath = resolve(TESTING_TMP_DIR, 'base_test_file.txt');
  const newFilePath = resolve(TESTING_TMP_DIR, 'not_existing_parent_dir', 'new_test_file.txt');
  const fileData = 'Test data works';

  writeFileAndDir(baseFilePath, fileData);
  copyFileRecursive(baseFilePath, newFilePath);

  const readedFileData = Deno.readTextFileSync(newFilePath);

  assertEquals(fileData, readedFileData);
 });
});
