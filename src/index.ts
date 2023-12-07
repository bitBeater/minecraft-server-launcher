#!/usr/bin/node

import { spawn } from 'child_process';
import { progress } from 'cli';
import { cpSync, createWriteStream, existsSync, mkdirSync, readdirSync, rmSync } from 'fs';
import { log } from 'iggs-utils';
import { join } from 'path';
import { maxSatisfying, valid } from 'semver';
import { Packages } from './types/packages';
import { VersionManifestV2 } from './types/version_manifest_v2';


const VERSION_MANIFEST_V2_URL = `https://piston-meta.mojang.com/mc/game/version_manifest_v2.json`;
const SERVER_INSTALLATION_DIR = '/home/alex/tmp/minecraft_server'//`/opt/minecraft_server/`;
const SERVER_LAUNCH_SCRIPT = `start.sh`;
const JAR_SERVER = `server.jar`;
const installedServerVersions: string[] = readdirSync(SERVER_INSTALLATION_DIR).filter(i => valid(i));
const latestInstalledServerVersion = maxSatisfying(installedServerVersions, '*');

const logger = new log.Logger({ logLevel: log.LogLevel.INFO, prefix: 'MINECRAFT_SERVER' });
let versionManifestV2: VersionManifestV2;

(async () => {
    versionManifestV2 = await (await fetch(VERSION_MANIFEST_V2_URL)).json();
    const isLatestReleaseInstalled = latestInstalledServerVersion === versionManifestV2.latest.release;

    if (!isLatestReleaseInstalled) {
        await installServer(versionManifestV2.latest.release, latestInstalledServerVersion);
    }

    launchServer(versionManifestV2.latest.release);
})()


function launchServer(version: string) {
    const serverLaunchScript = join(SERVER_INSTALLATION_DIR, version, SERVER_LAUNCH_SCRIPT);
    logger.info('launching', version, 'server', serverLaunchScript);
    const minecraftServerChildProccess = spawn(join(SERVER_INSTALLATION_DIR, version, SERVER_LAUNCH_SCRIPT));
    minecraftServerChildProccess.stdout.pipe(process.stdout);
    minecraftServerChildProccess.stderr.pipe(process.stderr);
    process.stdin.pipe(minecraftServerChildProccess.stdin);
    minecraftServerChildProccess.on('exit', (code) => {

        logger.info(`Minecraft Server ${version} exited with code ${code}`);
    });
}

async function installServer(version: string, upgradeFromVersion?: string) {
    const versionToInstall = versionManifestV2.versions.find(item => item.id === version);

    if (!versionToInstall) {
        logger.error(`version ${version} not found in version manifest v2`);
        throw new Error(`version ${version} not found in version manifest v2`);
    }

    const minecraftPackages: Packages = await (await fetch(versionToInstall.url)).json();
    const serverInstallationDir = join(SERVER_INSTALLATION_DIR, version);
    const serverJarFile = join(serverInstallationDir, JAR_SERVER);

    logger.info('installing', version, 'server', serverInstallationDir);

    if (upgradeFromVersion) {
        logger.info('upgrading from', upgradeFromVersion);
        const upgradeFromVersionDir = join(SERVER_INSTALLATION_DIR, upgradeFromVersion);

        if (!existsSync(upgradeFromVersionDir)) {
            logger.error('upgrade from version', upgradeFromVersion, 'does not exist');
            return;
        }

        logger.info('copying', upgradeFromVersionDir, 'to', serverInstallationDir);
        cpSync(upgradeFromVersionDir, serverInstallationDir);

        logger.info('removing', join(serverInstallationDir, JAR_SERVER));
        rmSync(serverJarFile);
    }

    if (!existsSync(serverInstallationDir)) {
        logger.info('creating', serverInstallationDir);
        mkdirSync(serverInstallationDir);
    }

    logger.info('downloading', minecraftPackages.downloads.server.url);

    const downloadResponse = await fetch(minecraftPackages.downloads.server.url);
    const downloadContentLength = +downloadResponse.headers.get('content-length');

    if (!downloadResponse.ok) {
        logger.error('failed to download', minecraftPackages.downloads.server.url, 'with status', downloadResponse.status);
        return;
    }

    const writeStream = createWriteStream(serverJarFile);


    let responseSize = 0;
    for await (const chunk of streamAsyncIterable(downloadResponse.body)) {
        responseSize += chunk.length;
        progress(responseSize / downloadContentLength);
        writeStream.write(chunk);
    }
    writeStream.end();
    writeStream.close();

    logger.info('downloaded', responseSize, 'of', downloadContentLength, 'bytes');

}


async function* streamAsyncIterable(stream: ReadableStream<Uint8Array>) {
    const reader = stream.getReader()
    try {
        while (true) {
            const { done, value } = await reader.read()
            if (done) return
            yield value
        }
    } finally {
        reader.releaseLock()
    }
}
