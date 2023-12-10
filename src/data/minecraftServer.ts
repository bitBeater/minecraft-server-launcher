import { getConf } from 'data/conf.ts';
import { MinecraftServerDownloadError } from 'errors/minecraftServerDownloadFailed.ts';
import { join } from 'std/path/mod.ts';
import { JAR_SERVER } from 'utils/consts.ts';
import { existsSync } from 'utils/fs.ts';

/**
 * Downloads the Minecraft server JAR file from the specified URL.
 * Throws a MinecraftServerDownloadError if the download fails.
 * @param url The URL of the Minecraft server JAR file.
 * @returns A ReadableStream containing the downloaded JAR file.
 */
export async function downloadMinecraftServer(url: string): Promise<ReadableStream<Uint8Array>> {
    return fetch(url).then(
        res => {
            if (!res.ok)
                throw new MinecraftServerDownloadError(res);
            return res.body;
        }
    );
}

/**
 * Returns a WritableStream for the Minecraft server JAR file with the specified version.
 * If the server installation directory does not exist, it will be created.
 * @param version The version of the Minecraft server.
 * @returns A WritableStream for the Minecraft server JAR file.
 */
export function getMinecraftServerWritableStream(version: string): WritableStream<Uint8Array> {

    const serverInstallationDir = join(getConf().serverInstallationDir, version);

    if (!existsSync(serverInstallationDir))
        Deno.mkdirSync(serverInstallationDir, { recursive: true });

    const serverInstallationPath = join(serverInstallationDir, JAR_SERVER);

    return Deno.openSync(serverInstallationPath, {
        create: true,
        append: true,
        createNew: true,
        write: true,
    }).writable;
}


