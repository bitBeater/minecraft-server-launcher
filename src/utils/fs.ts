import { join, resolve } from 'std/path/mod.ts';
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