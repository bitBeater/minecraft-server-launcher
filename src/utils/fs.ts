import { existsSync } from 'std/fs/mod.ts';
import { join } from 'std/path/join.ts';
import { resolve } from 'std/path/resolve.ts';
import { appConfig } from 'utils/config.ts';
import { logger } from 'utils/logger.ts';
import { getOsUserHomeDir, SERVER_PROPERTIES_FILE_NAME } from './paths.ts';

// export function existsSync(path: string): boolean {
//  try {
//   Deno.statSync(path);
//   return true;
//  } catch (e) {
//   return false;
//  }
// }

/**
 * Writes data to a file at the specified path.
 * If the parent directory does not exist, it will be created recursively.
 *
 * @param path - The path to the file.
 * @param data - The data to write to the file.
 * @param options - Optional parameters for writing the file.
 */
export function writeFileAndDir(path: string, data?: Uint8Array | string, options?: Deno.WriteFileOptions) {
 logger.debug(`writing ${path}`);
 const parentDir = resolve(path, '..');

 if (!existsSync(parentDir)) {
  Deno.mkdirSync(parentDir, { recursive: true });
 }

 data = typeof data === 'string' ? new TextEncoder().encode(data) : data;
 Deno.writeFileSync(path, data, options);
}

export function copyFileRecursive(origPath: string, destPath: string) {
 logger.debug(`copying ${origPath} -> ${destPath}`);
 const destParentDir = resolve(destPath, '..');

 if (!existsSync(destParentDir)) {
  Deno.mkdirSync(destParentDir, { recursive: true });
 }

 Deno.copyFileSync(origPath, destPath);
}

export function getServerPropertiesPath(version: string): string {
 return resolve(appConfig.serverInstallationDir, version, SERVER_PROPERTIES_FILE_NAME);
}

/**
 * @deprecated
 */
export function renameToOld(path: string) {
 const oldPath = path + '_old';

 if (existsSync(oldPath)) {
  return renameToOld(oldPath);
 }

 Deno.renameSync(path, oldPath);
}

/**
 * remove sync, without throwing NotFound error if it doesn't exist
 * @param path
 * @param options
 */
export function silentRemove(path: string | URL, options?: Deno.RemoveOptions) {
 logger.debug(`removing ${path}`);
 try {
  Deno.removeSync(path, options);
 } catch (error) {
  if (!(error instanceof Deno.errors.NotFound)) throw error;
 }
}

const TILDE_NOTATION_REX = /^~[/|\\]?/;

export function isTildeNotation(path: string) {
 return TILDE_NOTATION_REX.test(path);
}

export function expandTilde(path: string): string {
 return join(getOsUserHomeDir(), path.replace(TILDE_NOTATION_REX, ''));
}
