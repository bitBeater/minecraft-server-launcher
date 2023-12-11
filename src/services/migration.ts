import { getConf } from 'data/conf.ts';
import { join } from 'https://deno.land/std@0.134.0/path/mod.ts';
import ProgressBar from 'https://deno.land/x/progress@v1.4.0/mod.ts';
import { JAR_SERVER_FILE_NAME } from 'utils/consts.ts';
import { logger } from 'utils/logger.ts';


export function migrate(fromVersion: string, toVersion: string) {
    const fromPath = join(getConf().serverInstallationDir, fromVersion);
    const toPath = join(getConf().serverInstallationDir, toVersion);
    const formVersionFiles = Deno.readDirSync(fromPath);
    const filesToMigrate: string[] = [];

    logger.info('migrating', fromVersion, 'to', toVersion);

    for (const file of formVersionFiles)
        if (file.name !== JAR_SERVER_FILE_NAME)
            filesToMigrate.push(file.name);

    const progress = new ProgressBar({
        title: 'Migrating ',
        total: filesToMigrate.length,
    });


    filesToMigrate.forEach(async (file, i) => {
        progress.title = file;
        //TODO: see if copy works on directories
        Deno.copyFileSync(join(fromPath, file), join(toPath, file));
        progress.render(i);
    });

    logger.info('successfully migrated', fromVersion, 'to', toVersion);
}