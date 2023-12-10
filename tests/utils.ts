import { resolve } from 'std/path/mod.ts';
import { MinecraftServerLauncherConf } from 'types/conf.ts';

export function clearTmpDir() {
    const tmpDir = resolve('./tmp/');
    try {
        Deno.removeSync(tmpDir, { recursive: true });
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
                    '-XX:+OptimizeStringConcat'
                ],
                serverArgs: ['--nogui']
            }
        }
    };
}