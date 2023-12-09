import ProgressBar from 'https://deno.land/x/progress@v1.4.0/mod.ts';
import { downloadMinecraftServer, getMinecraftServerWritableStream } from '../data/minecraftServer.ts';
import { existsServerProperties, writeServerProperties } from '../data/serverProperties.ts';
import { getVersionManifestV2, getVersionPackages } from '../data/version.ts';
import { VersionNotFoundManifestV2 } from './../errors/minecraftVersionNotFound.ts';
import { logger } from './../utils/logger.ts';


export async function installMinecraftServer(version?: string): Promise<void> {
    const versionManifestV2 = await getVersionManifestV2();

    if (version)
        version = versionManifestV2.latest.release;

    const versionPackagesUrl = versionManifestV2.versions.find(v => v.id === version)?.url;
    if (!versionPackagesUrl)
        throw new VersionNotFoundManifestV2(version);

    const versionPackages = await getVersionPackages(versionPackagesUrl);
    const downloadStream = await downloadMinecraftServer(versionPackages.downloads.server.url);
    const minecraftServerWritableStream = getMinecraftServerWritableStream(version);

    const progressBar = new ProgressBar({
        title: `Downloading ${version} server`,
        total: versionPackages.downloads.server.size,
    });

    let completed = 0;
    const minecraftServerWriter = minecraftServerWritableStream.getWriter();
    for await (const chunk of downloadStream) {
        await minecraftServerWriter.write(chunk);
        completed += chunk.length;
        progressBar.render(completed);
    }

    await minecraftServerWriter.close();
    minecraftServerWriter.releaseLock();

    if (!existsServerProperties(version))
        writeServerProperties(version);

    logger.info('successfully installed', version, 'server');
    return Promise.resolve();
}

