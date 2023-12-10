import { getConf } from "data/conf.ts";
import { getMinecraftServerWritableStream } from 'data/minecraftServer.ts';
import { assertEquals } from "std/assert/assert_equals.ts";
import { join } from "std/path/mod.ts";
import { afterAll, beforeAll, describe, it } from 'std/testing/bdd.ts';
import { clearTmpDir } from "testing-utils";
import { JAR_SERVER } from 'utils/consts.ts';

describe('getMinecraftServerWritableStream', () => {
    beforeAll(() => clearTmpDir());

    it('should return a WritableStream for the Minecraft server JAR file', () => {
        const version = '1.20.0';
        const writableStream = getMinecraftServerWritableStream(version);
        const data = new TextEncoder().encode('fake minecraft server data');
        const writer = writableStream.getWriter();
        writer.write(data);
        writer.releaseLock();
        writer.close();

        const serverInstallationDir = join(getConf().serverInstallationDir, version, JAR_SERVER);
        const readedData = Deno.readFileSync(serverInstallationDir);

        assertEquals(data, readedData);
    });
});

describe('downloadMinecraftServer', () => {
    const port = 8765;
    const badUrl = `http://127.0.0.1:${port}/bad`;
    const goodUrl = `http://127.0.0.1:${port}/good`;
    const minecraftServerData = 'fake minecraft server data';
    let mockServer: Deno.HttpServer
    let test: string;

    beforeAll(() => {
        mockServer = Deno.serve({ port }, (request: Request): Response => {
            if (request.url === badUrl)
                return new Response(null, { status: 500 });

            return new Response(minecraftServerData, { status: 200 });
        });
        test = 'test works!';
    });

    afterAll(async () => {

        await mockServer.shutdown();
    });

    it('downloadMinecraftServer should download the Minecraft server JAR file', async () => {
        const res = await fetch(goodUrl);
        const body = await res.text();
        assertEquals(body, minecraftServerData);
    });

    it('downloadMinecraftServer should throw MinecraftServerDownloadError if the download fails', async () => {
        await fetch(badUrl).then(
            () => { throw new Error('fetch should throw MinecraftServerDownloadError') },
            err => assertEquals(err.name, 'MinecraftServerDownloadError')
        );
    });
});
