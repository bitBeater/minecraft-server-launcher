import { getConf } from 'data/conf.ts';
import { MinecraftServerDownloadError } from 'errors/minecraftServerDownloadFailed.ts';
import { join } from 'std/path/mod.ts';
import { JAR_SERVER } from 'utils/consts.ts';
import { existsSync } from 'utils/fs.ts';

export async function downloadMinecraftServer(url: string): Promise<ReadableStream<Uint8Array>> {
    return fetch(url).then(
        res => {
            if (!res.ok)
                throw new MinecraftServerDownloadError(res);
            return res.body;
        }
    );
}

export function getMinecraftServerWritableStream(version: string): WritableStream<Uint8Array> {
    const path = join(getConf().serverInstallationDir, version, JAR_SERVER)
    const serverInstallationDir = join(path, '..');

    if (!existsSync(serverInstallationDir))
        Deno.mkdirSync(serverInstallationDir, { recursive: true });


    return Deno.openSync(path, {
        create: true,
        append: true,
        createNew: true,
        write: true,
    }).writable;
}