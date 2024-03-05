import { getConf } from 'services/conf.ts';
import { appInfo } from 'utils/app_info.ts';
import { SYS_CONFIG_FILE_PATH, USR_CONFIG_FILE_PATH } from 'utils/paths.ts';
// @skip-test

export function info(_options, ..._args: string[]) {
 console.log('misela version:\t', appInfo.version);
 console.log('Deno version:\t', Deno.version.deno);
 console.log('usr configuration file:\t', USR_CONFIG_FILE_PATH);
 console.log('sys configuration file:\t', SYS_CONFIG_FILE_PATH);

 console.log('server Installation Dir:\t', getConf().serverInstallationDir);
 console.log('version Manifest V2 Url:\t', getConf().versionManifestV2Url);
 const launchArgs = getConf().launchArgs;

 for (const [k, launchArg] of Object.entries(launchArgs)) {
  console.log(`${k} server launch args:\t`, launchArg?.serverArgs?.join(' '));
  console.log(`${k} java launch args:\t`, launchArg?.javaArgs?.join(' '));
 }
}
