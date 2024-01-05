import ProgressBar from 'progress';
import { WalkEntry, walkSync } from 'std/fs/walk.ts';
import { resolve } from 'std/path/resolve.ts';
import { appConfig } from 'utils/config.ts';
import { copyFileRecursive } from 'utils/fs.ts';
import { logger } from 'utils/logger.ts';
import { JAR_SERVER_FILE_NAME } from 'utils/paths.ts';

export function migrate(fromVersion: string, toVersion: string) {
 logger.info('migrating', fromVersion, 'to', toVersion);
 const origPath = resolve(appConfig.serverInstallationDir, fromVersion);
 const destPath = resolve(appConfig.serverInstallationDir, toVersion);

 // jar server doesn't need to be migrated
 const skip = [new RegExp(JAR_SERVER_FILE_NAME + '$')];

 const formVersionFiles = walkSync(origPath, { skip });
 const filesToMigrate: WalkEntry[] = [];

 for (const file of formVersionFiles) {
  if (file.name !== JAR_SERVER_FILE_NAME) {
   filesToMigrate.push(file);
  }
 }

 const progressBar = new ProgressBar({
  title: 'Migrating ',
  total: filesToMigrate.length,
  width: 75,
 });

 filesToMigrate.forEach((origEntry, i) => {
  const dest = origEntry.path.replace(origPath, destPath);

  if (origEntry.isFile) {
   copyFileRecursive(origEntry.path, dest);
  } else if (origEntry.isDirectory) {
   // copyFileRecursive doesn't create directories, so it's done here
   Deno.mkdirSync(dest, { recursive: true });
  }

  progressBar.render(i + 1, { title: i === filesToMigrate.length ? origEntry.name : 'All files migrated' });
 });

 progressBar.end();
 logger.info('successfully migrated', fromVersion, 'to', toVersion);
}
