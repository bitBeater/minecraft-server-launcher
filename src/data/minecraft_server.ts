import { existsSync } from 'std/fs/exists.ts';
import { join } from 'std/path/mod.ts';
import { appConfig } from 'utils/config.ts';
import { JAR_SERVER_FILE_NAME } from 'utils/paths.ts';
import { MinecraftServerDownloadError } from '../errors/mc_server_download_failed.ts';

/**
 * Downloads the Minecraft server JAR file from the specified URL.
 * Throws a MinecraftServerDownloadError if the download fails.
 * @param url The URL of the Minecraft server JAR file.
 * @returns A ReadableStream containing the downloaded JAR file.
 */
export function downloadMinecraftServer(url: string): Promise<ReadableStream<Uint8Array>> {
 return fetch(url).then(
  (res) => {
   if (!res.ok) {
    res.body?.cancel();
    return Promise.reject(new MinecraftServerDownloadError(res));
   }
   return res.body;
  },
 );
}

/**
 * Returns a WritableStream for the Minecraft server JAR file with the specified version.
 * If the server installation directory does not exist, it will be created.
 * @param version The version of the Minecraft server.
 * @returns A WritableStream for the Minecraft server JAR file.
 */
export function getMinecraftServerWritableStream(version: string): WritableStream<Uint8Array> {
 const serverInstallationDir = join(appConfig.serverInstallationDir, version);

 if (!existsSync(serverInstallationDir)) {
  Deno.mkdirSync(serverInstallationDir, { recursive: true });
 }

 const serverInstallationPath = join(serverInstallationDir, JAR_SERVER_FILE_NAME);

 return Deno.openSync(serverInstallationPath, {
  create: true,
  append: true,
  createNew: true,
  write: true,
 }).writable;
}

//TODO: check if is used? and remove
export const _internals = { downloadMinecraftServer, getMinecraftServerWritableStream };
