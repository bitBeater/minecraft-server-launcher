import { existsSync } from 'std/fs/exists.ts';
import { WalkEntry, WalkOptions, walkSync } from 'std/fs/walk.ts';
import { resolve } from 'std/path/resolve.ts';

export const PROJ_ROOT = resolve(new URL(import.meta.url).pathname, '..', '..');
export const SRC_DIR = resolve(PROJ_ROOT, 'src');
export const TESTS_DIR = resolve(PROJ_ROOT, 'tests');
const TS_FILE_EXT_REX = /\.ts$/;
const SKIP_TEST_COMMENT_REX = /\/\/\s*@skip-test/gm;

/*
import { getEmptyTsFiles, getSkipTestSrcFiles, getSrcFilesThatShouldHaveTestFile } from './utils.ts';
const srcFilesWithoutTestFile = getSrcFilesThatShouldHaveTestFile();
const emptyTsFiles = getEmptyTsFiles();
const skipTestSrcFiles = getSkipTestSrcFiles();

let exitCode = 0;

// check if there are src files with the @skip-test comment
if (skipTestSrcFiles.length > 0) {
 for (const srcFile of skipTestSrcFiles) {
  console.log(`%c[SKIP TEST] %c${srcFile}`, 'color: orange', 'color: yellow');
 }
}

// check if there are src files WITHOUT TEST files
if (srcFilesWithoutTestFile.length > 0) {
 for (const srcFile of srcFilesWithoutTestFile) {
  console.log(`%c[WITHOUT TEST] %c${srcFile}`, 'color: red', 'color: yellow');
 }
 exitCode = 1;
}

// check if there are EMPTY TS FILES, in src or test
if (emptyTsFiles.length > 0) {
 for (const tsFile of emptyTsFiles) {
  console.log(`%c[EMPTY TS FILE] %c${tsFile}`, 'color: red', 'color: gray');
 }
 exitCode = 1;
}

if (exitCode === 0) {
 console.log(`%c[CHECK PASS]`, 'color: green');
} else {
 Deno.exit(exitCode);
}

*/

/**

 #!/usr/bin/env -S deno run -A
// script to generate an empty .test.ts file for each .ts file that doesnt have one
import { writeFileAndDir } from 'utils/fs.ts';
import { getSkipTestSrcFiles, getSrcFilesThatShouldHaveTestFile, sourceFilePathToTestFilePath } from './utils.ts';

const skipTestSrcFiles = getSkipTestSrcFiles();

if (skipTestSrcFiles.length > 0) {
 for (const srcFile of skipTestSrcFiles) {
  console.log(`%c[SKIP TEST] %c${srcFile}`, 'color: orange', 'color: yellow');
 }
}

for (const sourceFilePath of getSrcFilesThatShouldHaveTestFile()) {
 const testFilePath = sourceFilePathToTestFilePath(sourceFilePath);

 console.log(`%c[GENERATE TEST] %c${testFilePath}`, 'color: green', 'color: yellow');
 writeFileAndDir(testFilePath, '');
}

 */

/**
import './set_build_env.ts';

import { log } from 'iggs-utils';
import { join, resolve } from 'std/path/mod.ts';
import { defaultConfig } from 'utils/config.ts';
import { copyFileRecursive, silentRemove, writeFileAndDir } from 'utils/fs.ts';
import { logger } from 'utils/logger.ts';
import { CONFIG_FILE_NAME, DEFAULT_SERVER_PROPERTIES_PATH, SYS_CONFIG_FILE_PATH } from 'utils/paths.ts';
import { pkgInfo } from '../src/utils/package_info.ts';
import { exe, LINUX_BIN_PATH } from './utils.ts';
export async function mkDebPkg(): Promise<string> {
 exe('deno', ['compile', '--unstable', '--target=x86_64-unknown-linux-gnu', '-A', '--output=' + LINUX_BIN_PATH, './src/main.ts']);

 const controlFile: DebianControlFile = {
  Package: pkgInfo.name,
  Version: pkgInfo.version,
  Architecture: 'amd64',
  Maintainer: pkgInfo.maintainer,
  Description: pkgInfo.description,
  Homepage: pkgInfo.homepage,
 };

 const controlFileContent = Object.entries(controlFile)
  .reduce((prev, [key, value]) => `${prev}${key}: ${value}\n`, '');

 logger.debug(`creating debian package`, '\n', controlFileContent);
 // generating deb package directories
 const ASSETS_DIR = resolve('assets');
 const DEFAULT_CONFIG_FILE_PATH = resolve(ASSETS_DIR, 'defaults', CONFIG_FILE_NAME);
 // const DEFAULT_DEFAULT_SERVER_PROPERTIES_PATH = resolve(ASSETS_DIR, 'defaults', 'server.properties');

 const PKG_DIR = resolve('dist', 'deb_package');
 const PKG_ROOT = resolve(PKG_DIR, pkgInfo.name);
 const PKG_BIN_PATH = join(PKG_ROOT, 'usr', 'bin', 'misela');
 const PKG_CONTROL_FILE_PATH = join(PKG_ROOT, 'DEBIAN', 'control');
 const PKG_DOC_PATH = join(PKG_ROOT, 'usr', 'share', 'doc', pkgInfo.name, 'README.md');
 const PKG_SYS_CONFIG_FILE_PATH = join(PKG_ROOT, SYS_CONFIG_FILE_PATH);
 const PKG_DEFAULT_SERVER_PROPERTIES_PATH = join(PKG_ROOT, DEFAULT_SERVER_PROPERTIES_PATH);

 const DEB_PKG_PATH = resolve('dist', `${pkgInfo.name}_${pkgInfo.version}_linux_amd64.deb`);

 silentRemove(PKG_DIR, { recursive: true });
 writeFileAndDir(PKG_CONTROL_FILE_PATH, controlFileContent);
 copyFileRecursive(LINUX_BIN_PATH, PKG_BIN_PATH);
 copyFileRecursive('./README.md', PKG_DOC_PATH);
 copyFileRecursive(DEFAULT_CONFIG_FILE_PATH, PKG_SYS_CONFIG_FILE_PATH);
 writeFileAndDir(PKG_DEFAULT_SERVER_PROPERTIES_PATH, JSON.stringify(defaultConfig, null, 4));

 logger.debug('creating', DEB_PKG_PATH);
 await new Deno.Command('dpkg-deb', {
  args: ['--build', PKG_ROOT, DEB_PKG_PATH],
  stderr: 'inherit',
  stdin: 'inherit',
  stdout: 'inherit',
 }).output();

 logger.debug('successfully created deb package');

 return DEB_PKG_PATH;
}

 *
 */

/**
 * import { log } from 'iggs-utils';
import { logger } from 'utils/logger.ts';
import { pkgInfo } from 'utils/package_info.ts';
import { mkDebPkg } from './mk_deb_pkg_mod.ts';
import { exe } from './utils.ts';
 * // lint
logger.info('linting...');
exe('deno', ['lint']);

// format
logger.info('formatting...');
exe('deno', ['fmt']);

//  do code checks
logger.info('checking...');
exe('./scripts/check.ts');

//  run tests
logger.info('testing...');
exe('deno', ['task', 'test']);

//  check if tag exists
logger.info(`checking if Tag ${pkgInfo.version} exists...`);
await checkIfTagExists();

//  build deb package
logger.info('building deb package...');
const LINUX_BIN_PATH = await mkDebPkg();

// commit changes
logger.info('committing changes...');
exe('git', ['commit', '-m', `tag ${pkgInfo.version}`]);

// tag the commit with the current version
logger.info(`tagging  ${pkgInfo.version}...`);
exe('git', ['tag', pkgInfo.version]);

// push the tag
logger.info('pushing tag...');
exe('git', ['push', 'origin', pkgInfo.version]);

//Upload deb backage as release assets
logger.info(`uploading ${LINUX_BIN_PATH} asset...`);
exe('gh', ['release', 'create', pkgInfo.version, LINUX_BIN_PATH]);

async function checkIfTagExists() {
 const tags: GhRelease[] = await fetch('https://api.github.com/repos/alexrr2iggs/minecraft_server_updater/releases').then((r) => r.json());
 const tagAlreadyExists = tags?.find((t: GhRelease) => t?.tag_name === pkgInfo.version);
 if (tagAlreadyExists) {
  console.warn(`Tag ${pkgInfo.version} already exists\nsee ${tagAlreadyExists.html_url}`);
  Deno.exit(1);
 }
}

 */

export function exe(command: string, ...args: string[]): Deno.CommandOutput {
 const cmd = new Deno.Command(command, {
  args,
  stderr: 'inherit',
  stdin: 'inherit',
  stdout: 'inherit',
 });
 const cmdOutput = cmd.outputSync();

 if (cmdOutput.code !== 0) {
  Deno.exit(cmdOutput.code);
 }
 return cmdOutput;
}

export function getEmptyFiles(dir: string | URL, ...exts: string[]): string[] {
 const walkOptions: WalkOptions = {
  exts,
  includeDirs: false,
 };

 const files: IterableIterator<WalkEntry> = walkSync(dir, walkOptions);
 const emptyFiles: string[] = [];

 for (const tsFile of files) {
  if (isEmptyFile(tsFile.path)) {
   emptyFiles.push(tsFile.path);
  }
 }

 return emptyFiles;
}

// export function getSkipTestSrcFiles(): string[] {
//  const srcTsFiles = walkSync(SRC_DIR, { exts: ['ts'], includeDirs: false });

//  const skipTestFiles: string[] = [];
//  for (const srcTsFile of srcTsFiles) {
//   const srcTxt = Deno.readTextFileSync(srcTsFile.path);
//   if (srcTxt.match(SKIP_TEST_COMMENT_REX)) {
//    skipTestFiles.push(srcTsFile.path);
//   }
//  }

//  return skipTestFiles;
// }

/**
 * returns an array of string paths with the source files with the @skip-test comment
 * @returns
 */
export function getSkipTestSrcs(): string[] {
 const srcFiles = walkSync(SRC_DIR, { includeDirs: false, exts: ['ts'] });
 const skipTestSrcs = [];

 for (const srcFile of srcFiles) {
  if (!hasSkipTestComment(srcFile.path)) {
   skipTestSrcs.push(srcFile.path);
  }
 }
 return skipTestSrcs;
}

export function getsMissingTestSrcs(): string[] {
 const srcFiles = walkSync(SRC_DIR, { includeDirs: false, exts: ['ts'] });
 const missingTestSrcs = [];

 for (const srcFile of srcFiles) {
  if (!hasTest(srcFile.path) && !hasSkipTestComment(srcFile.path)) {
   missingTestSrcs.push(srcFile.path);
  }
 }

 return missingTestSrcs;
}

export function hasTest(srcTsFile: string): boolean {
 return existsSync(sourceFilePathToTestFilePath(srcTsFile));
}

/**
 * check if the src file has the @skip-test comment.
 * @param srcTsFile
 * @returns boolean
 */
export function hasSkipTestComment(srcTsFile: string): boolean {
 return !!Deno.readTextFileSync(srcTsFile).match(SKIP_TEST_COMMENT_REX);
}

export function sourceFilePathToTestFilePath(srcFile: string): string {
 return resolve(srcFile).replace(SRC_DIR, TESTS_DIR).replace(TS_FILE_EXT_REX, '.test.ts');
}

export function isEmptyFile(path: string): boolean {
 return Deno.statSync(path).size === 0;
}
