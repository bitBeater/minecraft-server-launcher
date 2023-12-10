import { valid } from 'semver';

export function validateSemver(version: string): boolean {
    return valid(version) !== null;
}