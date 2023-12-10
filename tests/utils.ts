import { resolve } from 'std/path/mod.ts';

export function clearTmpDir() {
    const tmpDir = resolve('./tmp/');
    try {
        Deno.removeSync(tmpDir, { recursive: true });
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) return;
        throw error;
    }
}