/** ./set_build_env.ts it needs to be evaluated befor everething so should be at top*/
import './set_build_env.ts';

import { log } from 'iggs-utils';
import { join, resolve } from 'std/path/mod.ts';
import { defaultConfig } from 'utils/config.ts';
import { copyFileRecursive, silentRemove, writeFileAndDir } from 'utils/fs.ts';
import { logger } from 'utils/logger.ts';
import { CONFIG_FILE_NAME, DEFAULT_SERVER_PROPERTIES_PATH, SYS_CONFIG_FILE_PATH } from 'utils/paths.ts';
import { pkgInfo } from '../src/utils/package_info.ts';
import { exe } from './utils.ts';

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

export async function mkDebPkg(): Promise<string> {
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

 const LINUXx64_BIN_PATH = join(resolve('dist'), 'bin', 'linux', 'x64', pkgInfo.name);
 exe('deno', 'compile', '--unstable', '--target=x86_64-unknown-linux-gnu', '-A', '--output=' + LINUXx64_BIN_PATH, './src/main.ts');

 // generating deb package directories
 const ASSETS_DIR = resolve('assets');
 const DEFAULT_CONFIG_FILE_PATH = resolve(ASSETS_DIR, 'defaults', CONFIG_FILE_NAME);
 const DEFAULT_DEFAULT_SERVER_PROPERTIES_PATH = resolve(ASSETS_DIR, 'defaults', 'server.properties');

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
 copyFileRecursive(LINUXx64_BIN_PATH, PKG_BIN_PATH);
 copyFileRecursive('./README.md', PKG_DOC_PATH);
 copyFileRecursive(DEFAULT_CONFIG_FILE_PATH, PKG_SYS_CONFIG_FILE_PATH);
 copyFileRecursive(DEFAULT_DEFAULT_SERVER_PROPERTIES_PATH, PKG_DEFAULT_SERVER_PROPERTIES_PATH);
 writeFileAndDir(PKG_DEFAULT_SERVER_PROPERTIES_PATH, JSON.stringify(defaultConfig, null, 4));

 exe('dpkg-deb', '--build', PKG_ROOT, DEB_PKG_PATH);

 console.log('%csuccessfully created deb package!!! 🍾🎉🎇', 'color:green');

 return DEB_PKG_PATH;
}
