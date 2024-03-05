#!/usr/bin/env -S deno run -A
import { appInfo } from 'utils/app_info.ts';
import { logger } from 'utils/logger.ts';
import { build } from './utils/build.ts';
import { doRelease } from './utils/release.ts';
import { doTag } from './utils/tag.ts';

await doTag();
await build();
await doRelease();

logger.info(`✅ ${appInfo.version} RELEASED! 🚀🍾🎉🎇!!! Good Luck...`);
