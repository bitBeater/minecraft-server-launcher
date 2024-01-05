import { getConf } from 'services/conf.ts';
// @skip-test

export async function info(_options, ..._args: string[]) {
 console.log('server Installation Dir:\t', getConf().serverInstallationDir);
 console.log('version Manifest V2 Url:\t', getConf().versionManifestV2Url);
 const launchArgs = getConf().launchArgs;

 for (const [k, launchArg] of Object.entries(launchArgs)) {
  console.log(`ver ${k} server launch args:\t`, launchArg?.serverArgs?.join(' '));
  console.log(`ver ${k} java launch args:\t`, launchArg?.javaArgs?.join(' '));
 }
}
