// @skip-test
import { Input } from 'cliffy/prompt/mod.ts';
import { valid } from 'semver';

export async function userSemverPrompt(msg = 'Enter version'): Promise<string> {
 const semver = await Input.prompt(msg);
 if (!valid(semver)) {
  console.log('Invalid semver!');
  return userSemverPrompt(msg);
 }
}
