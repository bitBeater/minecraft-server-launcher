export function existsSync(path: string): boolean {
    try {
        Deno.statSync(path);
        return true;
    } catch (e) {
        return false;
    }
}