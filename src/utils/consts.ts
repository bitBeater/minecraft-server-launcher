
import { resolve } from 'std/path/resolve.ts';
import { MinecraftServerLauncherConf } from 'types/conf.ts';
import { getOsAppInstallPath, resolvePath } from 'utils/fs.ts';


export const JAR_SERVER_FILE_NAME = 'server.jar';
export const SERVER_PROPERTIES_FILE_NAME = 'server.properties'
export const CONFIG_FILE_PATH = resolve('./config.json');
export const ASSETS_DIR = resolve('./assets');
export const DEFAULT_SERVER_PROPERTIES_PATH = resolvePath(ASSETS_DIR, SERVER_PROPERTIES_FILE_NAME);
const SERVER_INSTALLATION_DIR = resolvePath(getOsAppInstallPath(), 'alexrr2iggs', 'minecraft_server');

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


