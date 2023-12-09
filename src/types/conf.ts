export interface MinecraftServerLauncherConf {
    serverInstallationDir: string;
    versionManifestV2Url: string;
    launchArgs: {
        default: { javaArgs: string[], serverArgs: string[] }
        [version: string]: { javaArgs: string[], serverArgs: string[] }
    }
}
