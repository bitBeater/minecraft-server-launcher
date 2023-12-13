import { existsServerProperties, writeDefaultServerProperties } from 'data/serverProperties.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';
import { beforeEach, describe, it } from 'std/testing/bdd.ts';
import { DEFAULT_SERVER_PROPERTIES_PATH } from 'utils/consts.ts';
import { getServerPropertiesPath, writeFileAndDir } from 'utils/fs.ts';
import { clearTmpDir } from '../test_utils/utils.ts';

describe('[2] existsServerProperties', () => {
 beforeEach(() => clearTmpDir());

 it('[2][0] should return true if server properties file exists', () => {
  const version = '1.20.0';
  const serverPropertiesPath = getServerPropertiesPath(version);
  writeFileAndDir(serverPropertiesPath, new Uint8Array());

  const result = existsServerProperties(version);

  assertEquals(result, true);
 });

 it('[2][1] should return false if server properties file does not exist', () => {
  const version = '1.20.0';

  const result = existsServerProperties(version);

  assertEquals(result, false);
 });
});

describe('[3] writeDefaultServerProperties', () => {
 beforeEach(() => clearTmpDir());

 it('[3][0] should write the default server properties file', () => {
  const version = '1.20.0';
  const serverPropertiesPath = getServerPropertiesPath(version);

  writeDefaultServerProperties(version);

  const expectedData = Deno.readFileSync(DEFAULT_SERVER_PROPERTIES_PATH);
  const actualData = Deno.readFileSync(serverPropertiesPath);

  assertEquals(actualData, expectedData);
 });
});
