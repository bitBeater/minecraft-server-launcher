import { getConf } from "data/conf.ts";
import { downloadMinecraftServer, getMinecraftServerWritableStream } from 'data/minecraftServer.ts';
import { MinecraftServerDownloadError } from "errors/minecraftServerDownloadFailed.ts";
import { assertEquals } from "std/assert/assert_equals.ts";
import { assertInstanceOf } from "std/assert/mod.ts";
import { join } from "std/path/mod.ts";
import { afterAll, beforeAll, describe, it } from 'std/testing/bdd.ts';
import { clearTmpDir } from "testing-utils";
import { JAR_SERVER_FILE_NAME } from 'utils/consts.ts';

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
    const port = 8765;
    const badUrl = `http://127.0.0.1:${port}/bad`;
    const goodUrl = `http://127.0.0.1:${port}/good`;
    const minecraftServerData = 'fake minecraft server data';
    let mockServer: Deno.HttpServer;


    beforeAll(() => {
        clearTmpDir();
        mockServer = Deno.serve({ port }, (request: Request): Response => {
            if (request.url === badUrl)
                return new Response(null, { status: 500 });
            return new Response(minecraftServerData, { status: 200 });
        });
    });

    afterAll(async () => {
        await mockServer.shutdown();
        clearTmpDir()
    });

    it('[1][0] downloadMinecraftServer should download the Minecraft server JAR file', async () => {
        const dataStream = await downloadMinecraftServer(goodUrl);
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
