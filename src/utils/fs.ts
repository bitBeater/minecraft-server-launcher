import { getConf } from "data/conf.ts";
import { join, resolve } from 'std/path/mod.ts';
import { SERVER_PROPERTIES_FILE_NAME } from "utils/consts.ts";
export function existsSync(path: string): boolean {
    try {
        Deno.statSync(path);
        return true;
    } catch (e) {
        return false;
    }
}




/**
 * Writes data to a file at the specified path.
 * If the parent directory does not exist, it will be created recursively.
 * 
 * @param path - The path to the file.
 * @param data - The data to write to the file.
 * @param options - Optional parameters for writing the file.
 */
export function writeFileAndDir(path: string, data: Uint8Array | string, options?: Deno.WriteFileOptions) {
    const parentDir = resolve(join(path, '..'));

    if (!existsSync(parentDir))
        Deno.mkdirSync(parentDir, { recursive: true });

    data = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    Deno.writeFileSync(path, data, options);
}

/**
 * Joins and resolves all arguments into an absolute path.
 * 
 * @param pathParts - The path parts to join and resolve.
 * @returns The resolved absolute path.
 */
export function resolvePath(...pathParts: string[]): string {
    return resolve(join(...pathParts));
}


export function getServerPropertiesPath(version: string): string {
    return resolvePath(getConf().serverInstallationDir, version, SERVER_PROPERTIES_FILE_NAME);
}



export function getOsAppInstallPath(): string {
    switch (Deno.build.os) {
        case 'linux':
            return '/opt';
        case 'windows':
            return 'C:\\Program Files';
        case 'darwin':
            return '/Applications';
        default:
            throw new Error(`Unsupported OS: ${Deno.build.os}`);
    }
}