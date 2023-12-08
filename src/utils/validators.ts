import { valid } from "https://deno.land/x/semver@v1.4.1/mod.ts";

export function validateSemver(version: string): boolean {
    return valid(version) !== null;
}