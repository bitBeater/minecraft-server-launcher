import { getServerInstallationDirs } from 'data/installation.ts';
import { lt, maxSatisfying, valid as isValidSemver } from 'semver';

/**
 * @returns all installed versions sorted from latest to oldest
 */
export function getInstalledVersions() {
 return getServerInstallationDirs().filter((i) => isValidSemver(i)).sort((v1, v2) => lt(v1, v2) ? 1 : -1);
}

export function getLatestInstalledVersion(): string {
 const installedVersions = getInstalledVersions();
 return maxSatisfying(installedVersions, '*');
}

export function getPreviousVersion(baseVersion: string) {
 const installedVersions = getInstalledVersions();
 for (const version of installedVersions) {
  if (lt(version, baseVersion)) return version;
 }
}
