import { getConf } from 'data/conf.ts';
import { installMinecraftServer } from 'services/installer.ts';
import { assertEquals } from 'std/assert/mod.ts';
import { resolve } from 'std/path/resolve.ts';
import { afterAll, beforeAll, beforeEach, describe, it } from 'std/testing/bdd.ts';
import { JAR_SERVER_FILE_NAME, SERVER_PROPERTIES_FILE_NAME } from 'utils/consts.ts';
import { minecraftServerData, startMockServer } from '../test_utils/fake_api_server.ts';
import { clearTmpDir } from '../test_utils/utils.ts';

describe('installMinecraftServer', () => {
 let mockServer: Deno.HttpServer;

 beforeAll(() => {
  mockServer = startMockServer();
 });

 beforeEach(() => clearTmpDir());
 afterAll(async () => await mockServer.shutdown());

 it('should install the Minecraft server successfully', async () => {
  const version = '1.20.0';
  await installMinecraftServer(version);
  const writtedData = Deno.readTextFileSync(resolve(getConf().serverInstallationDir, version, JAR_SERVER_FILE_NAME));
  assertEquals(writtedData, minecraftServerData);

  const serverProperties = Deno.readTextFileSync(resolve(getConf().serverInstallationDir, version, SERVER_PROPERTIES_FILE_NAME));
  assertEquals(serverProperties, '#Minecraft server properties');
 });
});
