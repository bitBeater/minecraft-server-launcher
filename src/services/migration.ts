import { getConf } from 'data/conf.ts';
import ProgressBar from 'progress';
import { existsSync } from 'std/fs/mod.ts';
import { WalkEntry, walkSync } from 'std/fs/walk.ts';
import { resolve } from 'std/path/resolve.ts';
import { JAR_SERVER_FILE_NAME } from 'utils/consts.ts';
import { copyFileRecursive, renameToOld } from 'utils/fs.ts';
import { logger } from 'utils/logger.ts';

export function migrate(fromVersion: string, toVersion: string) {
 logger.info('migrating', fromVersion, 'to', toVersion);
 const origPath = resolve(getConf().serverInstallationDir, fromVersion);
 const destPath = resolve(getConf().serverInstallationDir, toVersion);

 // jar server doesn't need to be migrated
 const skip = [new RegExp(JAR_SERVER_FILE_NAME + '$')];

 if (existsSync(destPath)) {
  renameToOld(destPath);
 }

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
