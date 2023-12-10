
import { join } from 'std/path/mod.ts';
import { MinecraftServerLauncherConf } from 'types/conf.ts';
import { getOsAppInstallPath } from 'utils/os_paths.ts';


export const CONFIG_FILE_PATH = './config.json';
export const JAR_SERVER = `server.jar`;

const SERVER_INSTALLATION_DIR = join(getOsAppInstallPath(), 'alexrr2iggs', 'minecraft_server');


export const DEFAULT_CONFIG: MinecraftServerLauncherConf = {
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
                '--nogui'
            ]
        },

    }
}


