//@skip-test
import 'https://deno.land/x/dotenv@v3.2.2/load.ts';
import { join } from 'std/path/join.ts';
import { resolve } from 'std/path/resolve.ts';
import { pkgInfo } from 'utils/package_info.ts';

/**
 * Is in development mode?
 * DENO_ENV envar is setted only during development, in the .env file placed in the progect root dir.
 *  `import 'https://deno.land/x/dotenv/load.ts';` is required to read it. */
const IS_DEV = Deno.env.get('DENO_ENV') === 'development';

/**
 * Directory for storing app data during development.
 * This ensures that isn't required special permissions to write to the directory and it's isolated from system directories. */
const DEV_ROOT_DIR = resolve(getOsUserHomeDir(), '.development', pkgInfo.name);

export const CONFIG_FILE_NAME = 'config.json';
export const JAR_SERVER_FILE_NAME = 'server.jar';
export const SERVER_PROPERTIES_FILE_NAME = 'server.properties';
export const MINECRAFT_SERVER_DIR_NAME = 'minecraft-server';

export const SHARED_DATA_DIR = _mkPath(getOsSharedDataDir(), pkgInfo.name);
export const SYS_CONFIG_FILE_PATH = _mkPath(getOsSysConfDir(), pkgInfo.name, CONFIG_FILE_NAME);
export const USR_CONFIG_FILE_PATH = _mkPath(getOsUsrConfDir(), pkgInfo.name, CONFIG_FILE_NAME);
export const DEFAULT_SERVER_PROPERTIES_PATH = _mkPath(getOsSharedDataDir(), pkgInfo.name, SERVER_PROPERTIES_FILE_NAME);
export const SERVER_INSTALLATION_DIR = _mkPath(getOsUserBinDir(), MINECRAFT_SERVER_DIR_NAME);

function _mkPath(...chunks: string[]) {
 if (IS_DEV) {
  return join(DEV_ROOT_DIR, ...chunks);
 }
 return join(...chunks);
}

export function getOsAppInstallDir(): string {
 switch (Deno.build.os) {
  case 'linux':
   return '/opt';
  case 'darwin':
   return '/Applications';
  case 'windows':
   return 'C:\\Program Files';
  default:
   throw new Error(`Unsupported OS: ${Deno.build.os}`);
 }
}

/**
 * Architecture-independent (shared) data.
 * e.g. C:\ProgramData\ on Windows or /usr/share on Linux.
 */
export function getOsSharedDataDir(): string {
 switch (Deno.build.os) {
  case 'linux':
   return resolve('/usr', 'share');
  case 'darwin':
   return '~/Library/Application Support';
  case 'windows':
   return Deno.env.get('APPDATA');
  default:
   throw new Error(`Unsupported OS: ${Deno.build.os}`);
 }
}

/**
 * OS-specific system wide dir for app configurations.
 */
export function getOsSysConfDir(): string {
 switch (Deno.build.os) {
  case 'linux':
   return resolve('/etc');
  case 'darwin':
   return resolve('/Library/Application Support');
  case 'windows':
   return Deno.env.get('APPDATA');
  default:
   throw new Error(`Unsupported OS: ${Deno.build.os}`);
 }
}

/**
 * USER-specific dir for app configurations.
 */
export function getOsUsrConfDir(): string {
 switch (Deno.build.os) {
  case 'linux':
  case 'darwin':
   return resolve(getOsUserHomeDir(), '.config');
  case 'windows':
   return Deno.env.get('LOCALAPPDATA');
  default:
   throw new Error(`Unsupported OS: ${Deno.build.os}`);
 }
}

/**
 * Returns the home directory of the current OS user.
 * e.g. C:\Users\<user> on Windows or /home/<user> on Linux.
 */
export function getOsUserHomeDir(): string {
 switch (Deno.build.os) {
  case 'linux':
  case 'darwin':
   return Deno.env.get('HOME');
  case 'windows':
   return Deno.env.get('USERPROFILE');
  default:
   throw new Error(`Unsupported OS: ${Deno.build.os}`);
 }
}

export function getOsUserBinDir(): string {
 switch (Deno.build.os) {
  case 'linux':
   return resolve(getOsUserHomeDir(), '.local', 'bin');
  case 'darwin':
   return resolve(getOsUserHomeDir(), 'bin');
  case 'windows':
   return getOsAppInstallDir();
  default:
   throw new Error(`Unsupported OS: ${Deno.build.os}`);
 }
}
