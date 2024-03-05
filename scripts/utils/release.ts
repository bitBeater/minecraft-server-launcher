import { log } from 'iggs-utils';
import { appInfo } from 'utils/app_info.ts';
import { exe, RELEASE_ASSETS_DIR } from './utils.ts';

const logger = new log.Logger({ logLevel: log.LogLevel.TRACE, prefix: `[RELEASE]` });
export async function doRelease(): Promise<void> {
 logger.info(`start releasing ${appInfo.version}`);
 const releaseAssetsPaths = [];

 for (const entry of Deno.readDirSync(RELEASE_ASSETS_DIR)) {
  releaseAssetsPaths.push(`${RELEASE_ASSETS_DIR}/${entry.name}`);
 }

 exe(`gh`, `release`, `create`, '-n ' + appInfo.version, appInfo.version, ...releaseAssetsPaths);
}
