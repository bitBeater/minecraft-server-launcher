import { copySync } from 'std/fs/mod.ts';
import { resolve } from 'std/path/mod.ts';
import { MinecraftServerLauncherConf } from 'types/conf.ts';
import { appConfig } from 'utils/config.ts';

export const TEST_ASSETS_DIR = resolve('./test_assets');
export const INSTALLED_SERVER_DIR = resolve(TEST_ASSETS_DIR, 'minecraft_server', '1.20.4');

export function clearServerInstallationDir() {
 try {
  Deno.removeSync(appConfig.serverInstallationDir, { recursive: true });
 } catch (error) {
  if (error instanceof Deno.errors.NotFound) return;
  throw error;
 }
}

/**
 * Copy the server folder from the assets to the installation dir.
 */
export function copyDefaultServer(asVersion: string) {
 copySync(INSTALLED_SERVER_DIR, resolve(appConfig.serverInstallationDir, asVersion));
}

export function getDefaultTestingMinecraftServerLauncherConf(): MinecraftServerLauncherConf {
 return {
  serverInstallationDir: './tmp/minecraft_server_test',
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
    serverArgs: ['--nogui'],
   },
  },
 };
}
