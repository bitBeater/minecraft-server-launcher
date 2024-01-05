import { installMinecraftServer } from 'services/installer.ts';
import { assertEquals } from 'std/assert/mod.ts';
import { resolve } from 'std/path/resolve.ts';
import { afterAll, beforeAll, beforeEach, describe, it } from 'std/testing/bdd.ts';
import { appConfig } from 'utils/config.ts';
import { JAR_SERVER_FILE_NAME, SERVER_PROPERTIES_FILE_NAME } from 'utils/paths.ts';
import { FAKE_MINECRAFT_SERVER_DATA, startMockServer } from '../test_utils/fake_api_server.ts';
import { clearServerInstallationDir } from '../test_utils/utils.ts';

describe('installMinecraftServer', () => {
 let mockServer: Deno.HttpServer;

 beforeAll(() => {
  mockServer = startMockServer();
 });

 beforeEach(() => clearServerInstallationDir());
 afterAll(() => mockServer.shutdown());

 it('should install the Minecraft server successfully', async () => {
  const version = '1.20.0';

  await installMinecraftServer(version);
  const writtedData = Deno.readTextFileSync(resolve(appConfig.serverInstallationDir, version, JAR_SERVER_FILE_NAME));
  assertEquals(writtedData, FAKE_MINECRAFT_SERVER_DATA);

  const serverProperties = Deno.readTextFileSync(resolve(appConfig.serverInstallationDir, version, SERVER_PROPERTIES_FILE_NAME));
  assertEquals(serverProperties, '#Minecraft server properties');
 });
});
