import { resolve } from 'std/path/mod.ts';
import { MinecraftServerLauncherConf } from 'types/conf.ts';

export const TESTING_TMP_DIR = resolve('./.tmp/');
export const TEST_ASSETS_DIR = resolve('./test_assets');
export const INSTALLED_SERVER_DIR = resolve(TEST_ASSETS_DIR, 'minecraft_server', '1.20.4');

export function clearTmpDir() {
 try {
  Deno.removeSync(TESTING_TMP_DIR, { recursive: true });
 } catch (error) {
  if (error instanceof Deno.errors.NotFound) return;
  throw error;
 }
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
