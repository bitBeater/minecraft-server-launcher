export class VersionNotFoundManifestV2 extends Error {
    constructor(version: string) {
        super(`Minecraft version ${version} not found`);
    }
}