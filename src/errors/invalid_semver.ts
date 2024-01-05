export class InvalidSemver extends Error {
 constructor(version: string) {
  super(`Invalid semver ${version}`);
 }
}
