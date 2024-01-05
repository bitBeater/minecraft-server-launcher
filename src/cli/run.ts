import { logger } from 'utils/logger.ts';
// @skip-test
import { acceptEula } from 'cli/eula.ts';
import { install } from 'cli/install.ts';
import { isServerInstalled } from 'data/installation.ts';
import { getVersionManifestV2 } from 'data/version.ts';
import { launchMinecraftServer } from 'services/launcher.ts';
import { validateSemver } from 'utils/validators.ts';
import { InvalidSemver } from '../errors/invalid_semver.ts';

export async function run(_option, ...args: string[]) {
 const lattestAvailableVersion = (await getVersionManifestV2()).latest.release;
 const versionToRun = args?.[0]?.trim() || lattestAvailableVersion;

 if (versionToRun && !validateSemver(versionToRun)) {
  throw new InvalidSemver(versionToRun);
 }

 if (!isServerInstalled(versionToRun)) {
  // const installResponse = await Confirm.prompt({ message: `Server ${versionToRun}  is not installed. install?`, default: true });
  // if (!installResponse) return;
  await install(undefined, versionToRun);
 }
 try {
  acceptEula(versionToRun);
  launchMinecraftServer(versionToRun);
 } catch (error) {
  logger.error(error);
 }
}
