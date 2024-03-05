import { Confirm } from 'cliffy/prompt/mod.ts';
import { existsSync } from 'std/fs/exists.ts';
import { WalkEntry, WalkOptions, walkSync } from 'std/fs/walk.ts';
import { resolve } from 'std/path/resolve.ts';

export interface GhRelease {
 url: string;
 assets_url: string;
 upload_url: string;
 html_url: string;
 id: number;
 author: Author;
 node_id: string;
 tag_name: string;
 target_commitish: string;
 name: string;
 draft: boolean;
 prerelease: boolean;
 created_at: string;
 published_at: string;
 assets: object[];
 tarball_url: string;
 zipball_url: string;
 body: string;
 reactions: Reactions;
 mentions_count: number;
}

export interface Author {
 login: string;
 id: number;
 node_id: string;
 avatar_url: string;
 gravatar_id: string;
 url: string;
 html_url: string;
 followers_url: string;
 following_url: string;
 gists_url: string;
 starred_url: string;
 subscriptions_url: string;
 organizations_url: string;
 repos_url: string;
 events_url: string;
 received_events_url: string;
 type: string;
 site_admin: boolean;
}

export interface Reactions {
 url: string;
 total_count: number;
 '+1': number;
 '-1': number;
 laugh: number;
 hooray: number;
 confused: number;
 heart: number;
 rocket: number;
 eyes: number;
}

export interface GhTag {
 name: string;
 zipball_url: string;
 tarball_url: string;
 commit: Commit;
 node_id: string;
}

export interface Commit {
 sha: string;
 url: string;
}

export const PROJ_ROOT = resolve(new URL(import.meta.url).pathname, '..', '..', '..');
export const SRC_DIR = resolve(PROJ_ROOT, 'src');
export const TESTS_DIR = resolve(PROJ_ROOT, 'tests');
export const RELEASE_ASSETS_DIR = resolve('dist', 'release');
const TS_FILE_EXT_REX = /\.ts$/;
const SKIP_TEST_COMMENT_REX = /\/\/\s*@skip-test/gm;

/**
 * execute a command in the shell, the output is piped to the parent's stdout, stderr and stdin, so it will be seen in the terminal, if the command failed, it will terminate the deno process with the same command's code.
 *
 * @param command
 * @param args
 * @returns
 */
export function exe(command: string, ...args: string[]): Deno.Command {
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
 return cmd;
}

/**
 * execute a command in the shell, the output is piped
 *
 * @param command
 * @param args
 * @returns
 */
export function exePiped(command: string, ...args: string[]): Deno.Command {
 const cmd = new Deno.Command(command, { args });

 const cmdOutput = cmd.outputSync();

 if (cmdOutput.code !== 0) {
  Deno.exit(cmdOutput.code);
 }
 return cmd;
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

export function cmdOutTxt(command: string, ...args: string[]) {
 const commandResult = exePiped(command, ...args);
 return new TextDecoder().decode(commandResult.outputSync().stdout).trim();
}

export async function askToContinue(question = 'are you sure you want to continue?') {
 if (!(await Confirm.prompt({ message: `🔴 ${question}`, default: false }))) {
  Deno.exit(1);
 }
}
