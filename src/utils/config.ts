// @skip-test
import { getConf } from 'services/conf.ts';
import { MinecraftServerLauncherConf } from 'types/conf.ts';

import { getOsUserHomeDir, SERVER_INSTALLATION_DIR } from 'utils/paths.ts';

export const defaultConfig: MinecraftServerLauncherConf = {
 serverInstallationDir: SERVER_INSTALLATION_DIR,
 versionManifestV2Url: 'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json',
 launchArgs: {
  default: {
   javaArgs: [
    '-Xms4G',
    '-Xmx8G',
    '-XX:+UseG1GC',
    '-XX:+ParallelRefProcEnabled',
    '-XX:MaxGCPauseMillis=200',
    '-XX:+UseLargePages',
    '-XX:+AlwaysPreTouch',
    '-XX:+UseStringDeduplication',
    '-XX:+DisableExplicitGC',
    '-XX:+UnlockExperimentalVMOptions',
    '-XX:+OptimizeStringConcat',
   ],
   serverArgs: [
    '--nogui',
   ],
  },
 },
};

class AppConfig implements MinecraftServerLauncherConf {
 public get serverInstallationDir() {
  const readedServerInstallationDir = getConf().serverInstallationDir;

  if (readedServerInstallationDir.startsWith('~')) {
   const userHomeDir = getOsUserHomeDir();
   return readedServerInstallationDir.replace('~', userHomeDir);
  }

  return readedServerInstallationDir;
 }

 public get versionManifestV2Url() {
  return getConf().versionManifestV2Url;
 }

 public get launchArgs() {
  return getConf().launchArgs;
 }
}

export const appConfig = new AppConfig();
