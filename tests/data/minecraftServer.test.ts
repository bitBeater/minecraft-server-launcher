import { getConf } from 'data/conf.ts';
import { downloadMinecraftServer, getMinecraftServerWritableStream } from 'data/minecraftServer.ts';
import { MinecraftServerDownloadError } from 'errors/minecraftServerDownloadFailed.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';
import { assertInstanceOf } from 'std/assert/mod.ts';
import { join } from 'std/path/mod.ts';
import { afterAll, beforeAll, describe, it } from 'std/testing/bdd.ts';
import { JAR_SERVER_FILE_NAME } from 'utils/consts.ts';
import { badUrl, downloadFakeDataUrl, minecraftServerData, startMockServer } from '../test_utils/fake_api_server.ts';
import { clearTmpDir } from '../test_utils/utils.ts';

describe('[0] getMinecraftServerWritableStream', () => {
    beforeAll(() => clearTmpDir());

    it('[0][0] should return a WritableStream for the Minecraft server JAR file', async () => {
        const version = '1.20.0';
        const writableStream = getMinecraftServerWritableStream(version);
        const data = new TextEncoder().encode('fake minecraft server data');
        const writer = writableStream.getWriter();
        await writer.write(data);
        await writer.close();
        writer.releaseLock();

        const serverInstallationDir = join(getConf().serverInstallationDir, version, JAR_SERVER_FILE_NAME);
        const readedData = Deno.readFileSync(serverInstallationDir);

        assertEquals(data, readedData);
    });
});

describe('[1] downloadMinecraftServer', () => {
    let mockServer: Deno.HttpServer


    beforeAll(() => {
        mockServer = startMockServer();
        clearTmpDir();
    });

    afterAll(async () => {
        await mockServer.shutdown();
    });

    it('[1][0] downloadMinecraftServer should download the Minecraft server JAR file', async () => {
        const dataStream = await downloadMinecraftServer(downloadFakeDataUrl);
        const dataReader = dataStream.getReader();
        const dataReadResult = await dataReader.read();
        const dataDecoded = new TextDecoder().decode(dataReadResult.value);

        await dataReader.releaseLock();
        await dataStream.cancel();

        assertEquals(dataDecoded, minecraftServerData);


    });

    it('[1][1]downloadMinecraftServer should throw MinecraftServerDownloadError if the download fails', async () => {
        await downloadMinecraftServer(badUrl).then(
            () => { throw new Error('fetch should throw MinecraftServerDownloadError') },
            err => assertInstanceOf(err, MinecraftServerDownloadError, `fetch should throw ${MinecraftServerDownloadError.name} but throw ${err?.name || err}`)
        );
    });
});
