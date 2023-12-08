import { join } from 'https://deno.land/std@0.134.0/path/mod.ts';
import { Confirm } from 'https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts';
import ProgressBar from 'https://deno.land/x/progress@v1.4.0/mod.ts';
import { JAR_SERVER } from '../consts.ts';
import { getConf } from '../data/conf.ts';
import { downloadMinecraftServer } from '../data/minecraftServer.ts';
import { getVersionManifestV2 } from '../data/version.ts';
import { VersionNotFoundManifestV2 } from './../errors/minecraftVersionNotFound.ts';
import { logger } from './../utils/logger.ts';


export async function installMinecraftServer(version?: string, migrateFromVersion?: string): Promise<void> {
    const versionManifestV2 = await getVersionManifestV2();
    if (version)
        version = versionManifestV2.latest.release;


    const downladUrl = versionManifestV2.versions.find(v => v.id === version)?.url;
    if (!downladUrl)
        throw new VersionNotFoundManifestV2(version);



    // if (!Deno.statSync(serverInstallationDir)?.isDirectory)
    //     Deno.mkdirSync(serverInstallationDir, { recursive: true });

    const serverInstallationDir = join(getConf().serverInstallationDir, version);
    const serverJarFile = join(serverInstallationDir, JAR_SERVER);
    const serverJarFileExists = Deno.statSync(serverJarFile)?.isFile;
    let overwrite = false;

    if (serverJarFileExists)
        overwrite = await Confirm.prompt(`Another server file exists. Overwrite ${serverJarFile}?`);

    if (!serverJarFileExists || serverJarFileExists && overwrite) {
        const downloadStream = await downloadMinecraftServer(downladUrl);
        const fileWriteStream = await Deno.open(join(getConf().serverInstallationDir, version, JAR_SERVER), { create: true, write: true, truncate: true });

        const progressBar = new ProgressBar({
            title: `Downloading ${version} server`,
            total: downloadStream.length,
        });

        let completed = 0;

        for await (const chunk of downloadStream.readableStream) {
            await fileWriteStream.write(chunk);
            progressBar.render(completed += chunk.length);
        }
    }

    if (migrateFromVersion)
        migrateServerVersion(migrateFromVersion, version);


    return Promise.resolve();
}

export function migrateServerVersion(fromVersion: string, toVersion: string) {
    const fromPath = join(getConf().serverInstallationDir, fromVersion);
    const toPath = join(getConf().serverInstallationDir, toVersion);
    const formVersionFiles = Deno.readDirSync(fromPath);
    const filesToMigrate: string[] = [];

    logger.info('migrating', fromVersion, 'to', toVersion);

    for (const file of formVersionFiles)
        if (file.name !== JAR_SERVER)
            filesToMigrate.push(file.name);

    const progress = new ProgressBar({
        title: 'Migrating ',
        total: filesToMigrate.length,
    });


    filesToMigrate.forEach((file, i) => {
        progress.title = file;
        //TODO: see if copy works on directories
        Deno.copyFileSync(join(fromPath, file), join(toPath, file));
        progress.render(i);
    });
}

