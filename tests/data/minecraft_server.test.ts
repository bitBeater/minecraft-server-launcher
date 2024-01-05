import { downloadMinecraftServer, getMinecraftServerWritableStream } from 'data/minecraft_server.ts';
import { MinecraftServerDownloadError } from 'errors/mc_server_download_failed.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';
import { assertInstanceOf } from 'std/assert/mod.ts';
import { join } from 'std/path/mod.ts';
import { afterAll, beforeAll, describe, it } from 'std/testing/bdd.ts';
import { appConfig } from 'utils/config.ts';
import { JAR_SERVER_FILE_NAME } from 'utils/paths.ts';
import { FAKE_MINECRAFT_SERVER_DATA, FAKE_SERVER_BAD_URL, FAKE_SERVER_DOWNLOAD_URL, startMockServer } from '../test_utils/fake_api_server.ts';
import { clearServerInstallationDir } from '../test_utils/utils.ts';

describe('[0] getMinecraftServerWritableStream', () => {
 beforeAll(() => clearServerInstallationDir());

 it('[0][0] should return a WritableStream for the Minecraft server JAR file', async () => {
  const version = '1.20.0';
  const writableStream = getMinecraftServerWritableStream(version);
  const data = new TextEncoder().encode('fake minecraft server data');
  const writer = writableStream.getWriter();
  await writer.write(data);
  await writer.close();
  writer.releaseLock();

  const SERVER_INSTALLATION_DIR = join(appConfig.serverInstallationDir, version, JAR_SERVER_FILE_NAME);
  const readedData = Deno.readFileSync(SERVER_INSTALLATION_DIR);

  assertEquals(data, readedData);
 });
});

describe('[1] downloadMinecraftServer', () => {
 let mockServer: Deno.HttpServer;

 beforeAll(() => {
  mockServer = startMockServer();
  clearServerInstallationDir();
 });

 afterAll(async () => {
  await mockServer.shutdown();
 });

 it('[1][0] downloadMinecraftServer should download the Minecraft server JAR file', async () => {
  const dataStream = await downloadMinecraftServer(FAKE_SERVER_DOWNLOAD_URL);
  const dataReader = dataStream.getReader();
  const dataReadResult = await dataReader.read();
  const DECODED_DATA = new TextDecoder().decode(dataReadResult.value);

  dataReader.releaseLock();
  await dataStream.cancel();

  assertEquals(DECODED_DATA, FAKE_MINECRAFT_SERVER_DATA);
 });

 it('[1][1]downloadMinecraftServer should throw MinecraftServerDownloadError if the download fails', async () => {
  await downloadMinecraftServer(FAKE_SERVER_BAD_URL).then(
   () => {
    throw new Error('fetch should throw MinecraftServerDownloadError');
   },
   (err) => assertInstanceOf(err, MinecraftServerDownloadError, `fetch should throw ${MinecraftServerDownloadError.name} but throw ${err?.name || err}`),
  );
 });
});
