import { getConf } from 'data/conf.ts';
import { existsSync } from 'std/fs/mod.ts';
import { resolve } from 'std/path/resolve.ts';
import { SERVER_PROPERTIES_FILE_NAME } from 'utils/consts.ts';

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
 const parentDir = resolve(path, '..');

 if (!existsSync(parentDir)) {
  Deno.mkdirSync(parentDir, { recursive: true });
 }

 data = typeof data === 'string' ? new TextEncoder().encode(data) : data;
 Deno.writeFileSync(path, data, options);
}

export function copyFileRecursive(origPath: string, destPath: string) {
 const destParentDir = resolve(destPath, '..');

 if (!existsSync(destParentDir)) {
  Deno.mkdirSync(destParentDir, { recursive: true });
 }

 Deno.copyFileSync(origPath, destPath);
}

export function getServerPropertiesPath(version: string): string {
 return resolve(getConf().serverInstallationDir, version, SERVER_PROPERTIES_FILE_NAME);
}

export function renameToOld(path: string) {
 const oldPath = path + '_old';

 if (existsSync(oldPath)) {
  return renameToOld(oldPath);
 }

 Deno.renameSync(path, oldPath);
}

export function getOsAppInstallPath(): string {
 switch (Deno.build.os) {
  case 'linux':
   return '/opt';
  case 'windows':
   return 'C:\\Program Files';
  case 'darwin':
   return '/Applications';
  default:
   throw new Error(`Unsupported OS: ${Deno.build.os}`);
 }
}
