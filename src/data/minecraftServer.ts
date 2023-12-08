import { join } from "https://deno.land/std@0.196.0/path/mod.ts";
import { MinecraftServerDownloadError } from "../errors/minecraftServerDownloadFailed.ts";

export function downloadMinecraftServer(url: string): Promise<{ readableStream: ReadableStream<Uint8Array>, length: number }> {
    return fetch(url).then(
        res => {
            if (!res.ok)
                throw new MinecraftServerDownloadError(res);
            return { readableStream: res.body, length: +res.headers.get('content-length') };
        }
    );
}

export function writeMinecraftServer(path: string): WritableStream<Uint8Array> {

    const serverInstallationDir = join(path, '..');

    if (!Deno.statSync(serverInstallationDir)?.isDirectory)
        Deno.mkdirSync(serverInstallationDir, { recursive: true });


    return Deno.openSync(path, {
        create: true,
        append: true,
    }).writable;
}