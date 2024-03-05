// const denoEnvFilePath = join(import.meta.dirname, 'set_build_env.ts');

/** ./set_build_env.ts it needs to be evaluated befor everething so should be at top*/
// import(join(import.meta.dirname, 'set_build_env.ts'));
import 'https://deno.land/x/dotenv@v3.2.2/load.ts';
import { join, resolve } from 'std/path/mod.ts';

if (Deno.env.get('DENO_ENV') !== 'production') {
 logger.warn(`DENO_ENV is set to: "${Deno.env.get('DENO_ENV')}".\tIf you need to change it to "production", edit the .env file, in the root project directory`);
 askToContinue();
}

import { log } from 'iggs-utils';
import { defaultConfig } from 'utils/config.ts';
import { copyFileRecursive, silentRemove, writeFileAndDir } from 'utils/fs.ts';
import { logger } from 'utils/logger.ts';
import { DEFAULT_SERVER_PROPERTIES_PATH, SYS_CONFIG_FILE_PATH, USR_CONFIG_FILE_PATH } from 'utils/paths.ts';
import { appInfo } from '../../src/utils/app_info.ts';
import { askToContinue, exe, RELEASE_ASSETS_DIR } from './utils.ts';

// setting application logger level. '-s' (silent) is used to shut down logger.
logger.logLevel = Deno.args.includes('-s') ? log.LogLevel.OFF : log.LogLevel.TRACE;
logger.prefix = `[MK_DEB_PKG]`;

/**
 * Interface representing the structure of a Debian package's control file.
 */
interface DebianControlFile {
 /** The unique identifier name of the package. */
 Package: string;

 /** The version of the package, following the Debian versioning scheme. */
 Version: string;

 /** The section to which the package belongs, such as 'utils', 'net', etc. */
 Section?: string;

 /** The priority of the package, indicating its importance. */
 Priority?: 'required' | 'important' | 'standard' | 'optional' | 'extra';

 /** The architecture for which the package is built, like 'amd64', 'i386'. */
 Architecture: string;

 /** Packages that must be installed for this package to work. */
 Depends?: string;

 /** Packages that are recommended for enhanced functionality. */
 Recommends?: string;

 /** Packages that are suggested but not necessary. */
 Suggests?: string;

 /** Indicates that the package enhances the functionality of other packages. */
 Enhances?: string;

 /** Packages that are required to be configured before this package is unpacked. */
 PreDepends?: string;

 /** Lists packages that are incompatible with this package. */
 Breaks?: string;

 /** Lists packages that cannot be installed alongside this package. */
 Conflicts?: string;

 /** Indicates that this package replaces other packages. */
 Replaces?: string;

 /** Declares that this package provides the functionality of another package. */
 Provides?: string;

 /** The disk space required by the package in kilobytes. */
 'Installed-Size'?: number;

 /** The name and email of the person or team responsible for the package. */
 Maintainer: string;

 /** A brief description of the package. */
 Description: string;

 /** URL of the homepage for the software or package. */
 Homepage?: string;

 /** Indicates the source packages used to build this package. */
 'Built-Using'?: string;
}

const LINUXx64_BIN_PATH = join(resolve('dist'), 'bin', 'linux', 'x64', appInfo.name);
const WINx64_BIN_PATH = join(RELEASE_ASSETS_DIR, `${appInfo.name + appInfo.version}_x86_64-win.exe`);

export async function mkDebPkg() {
 linuxBuild();
 const { DEB_PKG_PATH, PKG_ROOT } = mkDebPkgStructure();
 exe('dpkg-deb', '--build', PKG_ROOT, DEB_PKG_PATH);

 logger.info(`🐧 creatted linux deb pkg in ${DEB_PKG_PATH}`);

 // cleaning up the debian package directory
 //  silentRemove(DEB_PKG_DIR, { recursive: true });
}

function mkDebPkgStructure(): { DEB_PKG_PATH; PKG_ROOT } {
 const controlFile: DebianControlFile = {
  Package: appInfo.name,
  Version: appInfo.version,
  Architecture: 'amd64',
  Maintainer: appInfo.maintainer,
  Description: appInfo.description,
  Homepage: appInfo.homepage,
 };

 const controlFileContent = Object.entries(controlFile).reduce((prev, [key, value]) => `${prev}${key}: ${value}\n`, '');

 logger.debug(`creating debian package`, '\n', controlFileContent);

 // generating deb package directories
 const ASSETS_DIR = resolve('assets');
 //  const DEFAULT_CONFIG_FILE_PATH = resolve(ASSETS_DIR, 'defaults', CONFIG_FILE_NAME);
 const DEFAULT_DEFAULT_SERVER_PROPERTIES_PATH = resolve(ASSETS_DIR, 'defaults', 'server.properties');

 const DEB_PKG_DIR = resolve('dist', 'deb_package');
 const PKG_ROOT = resolve(DEB_PKG_DIR, appInfo.name);
 const PKG_BIN_PATH = join(PKG_ROOT, 'usr', 'bin', 'misela');
 const PKG_CONTROL_FILE_PATH = join(PKG_ROOT, 'DEBIAN', 'control');
 const PKG_DOC_PATH = join(PKG_ROOT, 'usr', 'share', 'doc', appInfo.name, 'README.md');
 const PKG_SYS_CONFIG_FILE_PATH = join(PKG_ROOT, SYS_CONFIG_FILE_PATH);
 const PKG_USR_CONFIG_FILE_PATH = join(PKG_ROOT, USR_CONFIG_FILE_PATH);
 const PKG_DEFAULT_SERVER_PROPERTIES_PATH = join(PKG_ROOT, DEFAULT_SERVER_PROPERTIES_PATH);
 const DEB_PKG_PATH = resolve(RELEASE_ASSETS_DIR, `${appInfo.name}_${appInfo.version}_linux_amd64.deb`);

 // cleaning: if for some reason a debian package directory already  exists, remove it
 silentRemove(DEB_PKG_DIR, { recursive: true });
 writeFileAndDir(PKG_CONTROL_FILE_PATH, controlFileContent);
 copyFileRecursive(LINUXx64_BIN_PATH, PKG_BIN_PATH);
 copyFileRecursive('./README.md', PKG_DOC_PATH);
 copyFileRecursive(DEFAULT_DEFAULT_SERVER_PROPERTIES_PATH, PKG_DEFAULT_SERVER_PROPERTIES_PATH);
 writeFileAndDir(PKG_SYS_CONFIG_FILE_PATH, JSON.stringify(defaultConfig, null, 4));
 writeFileAndDir(PKG_USR_CONFIG_FILE_PATH, JSON.stringify(defaultConfig, null, 4));

 return { DEB_PKG_PATH, PKG_ROOT };
}

export async function linuxBuild() {
 exe('deno', 'compile', '--target=x86_64-unknown-linux-gnu', '-A', '--output=' + LINUXx64_BIN_PATH, './src/main.ts');
 logger.info(`🐧 creatted linux bin in ${LINUXx64_BIN_PATH}`);
}

export function winBuild() {
 exe('deno', 'compile', '--unstable', '--target=x86_64-pc-windows-msvc', '-A', '--output=' + WINx64_BIN_PATH, './src/main.ts');
 logger.info(`🪟 creatted windows executable in ${WINx64_BIN_PATH}`);
}

export async function build(): Promise<void> {
 silentRemove(RELEASE_ASSETS_DIR, { recursive: true });
 Deno.mkdirSync(RELEASE_ASSETS_DIR, { recursive: true });

 mkDebPkg();
 winBuild();
}
