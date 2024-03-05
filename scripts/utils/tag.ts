#!/usr/bin/env -S deno run -A
import { log } from 'iggs-utils';
import { logger } from 'utils/logger.ts';
import { appInfo } from '../../src/utils/app_info.ts';
import { checkCodeQuality } from './check.ts';
import { repositoryCheck } from './repo_check.ts';
import { cmdOutTxt, exe } from './utils.ts';

logger.logLevel = log.LogLevel.TRACE;
logger.prefix = `[MK_TAG]`;

export async function doTag() {
 logger.info(`START TAGGING  ${appInfo.version}`);

 checkIfTagExists();
 checkCodeQuality();
 await repositoryCheck();

 // lint
 logger.info('linting...');
 await exe('deno', 'lint');

 // format
 logger.info('formatting...');
 await exe('deno', 'fmt');

 //  run tests
 logger.info('testing...');
 await exe('deno', 'task', 'test');

 // tag the commit with the current version
 exe('git', 'tag', appInfo.version);

 // push the tag
 logger.info('pushing tag...');
 exe('git', 'push', 'origin', appInfo.version);

 logger.info('successfully tagged!!! 🍾🎉🎇');
}

function checkIfTagExists() {
 logger.info(`checking if Tag ${appInfo.version} exists...`);
 const tags = getTags();
 const exists = tags.find((tag) => tag === appInfo.version);
 if (exists) {
  logger.fatal(`⚠️  Abborted. Tag ${appInfo.version} already exists!!!`);
  Deno.exit(1);
 }
}

//git --no-pager tag --list --sort=-refname
function getTags() {
 const tags = cmdOutTxt('git', `--no-pager`, 'tag', `--list`, `--sort=-refname`);
 return tags.split('\n');
}
