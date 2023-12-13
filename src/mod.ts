// @skip-test
import ProgressBar from 'progress';
import { existsSync } from 'std/fs/mod.ts';
import { WalkEntry, walkSync } from 'std/fs/walk.ts';
import { resolve } from 'std/path/mod.ts';
import { JAR_SERVER_FILE_NAME } from 'utils/consts.ts';
import { copyFileRecursive, renameToOld } from 'utils/fs.ts';

const origPath = resolve('/home/alex/repo/alexrr2iggs/minecraft_server_updater/tests/test_assets/minecraft_server/1.20.4');
const destPath = resolve('/home/alex/repo/alexrr2iggs/minecraft_server_updater/tests/test_assets/minecraft_server/1.20.5');

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

filesToMigrate.forEach((orig, i) => {
 progressBar.title = orig.name;
 const dest = orig.path.replace(origPath, destPath);
 if (orig.isDirectory) {
  Deno.mkdirSync(dest, { recursive: true });
 } else {
  copyFileRecursive(orig.path, dest);
 }

 progressBar.render(i + 1, { title: i === filesToMigrate.length ? orig.name : 'All files migrated' });
});

progressBar.end();
