#!/usr/bin/env -S deno run -A
import { log } from 'iggs-utils';
import { logger } from 'utils/logger.ts';
import { pkgInfo } from 'utils/package_info.ts';
import { mkDebPkg } from './mk_deb_pkg_mod.ts';
import { exe } from './utils.ts';

export interface GhRelease {
 url: string;
 assets_url: string;
 upload_url: string;
 html_url: string;
 id: number;
 author: Author;
 node_id: string;
 tag_name: string;
 target_commitish: string;
 name: string;
 draft: boolean;
 prerelease: boolean;
 created_at: string;
 published_at: string;
 assets: object[];
 tarball_url: string;
 zipball_url: string;
 body: string;
 reactions: Reactions;
 mentions_count: number;
}

export interface Author {
 login: string;
 id: number;
 node_id: string;
 avatar_url: string;
 gravatar_id: string;
 url: string;
 html_url: string;
 followers_url: string;
 following_url: string;
 gists_url: string;
 starred_url: string;
 subscriptions_url: string;
 organizations_url: string;
 repos_url: string;
 events_url: string;
 received_events_url: string;
 type: string;
 site_admin: boolean;
}

export interface Reactions {
 url: string;
 total_count: number;
 '+1': number;
 '-1': number;
 laugh: number;
 hooray: number;
 confused: number;
 heart: number;
 rocket: number;
 eyes: number;
}

logger.logLevel = log.LogLevel.TRACE;
logger.prefix = `[MK_TAG]`;

// lint
logger.info('linting...');
exe('deno', 'lint');

// format
logger.info('formatting...');
exe('deno', 'fmt');

//  do code checks
logger.info('checking...');
exe('./scripts/check.ts');

//  run tests
logger.info('testing...');
exe('deno', 'task', 'test');

//  check if tag exists
logger.info(`checking if Tag ${pkgInfo.version} exists...`);
await checkIfTagExists();

//  build deb package
logger.info('building deb package...');
const LINUX_BIN_PATH = await mkDebPkg();

// commit changes
logger.info('committing changes...');
exe('git', 'commit', '-m', `tag ${pkgInfo.version}`);

// tag the commit with the current version
logger.info(`tagging  ${pkgInfo.version}...`);
exe('git', 'tag', pkgInfo.version);

// push the tag
logger.info('pushing tag...');
exe('git', 'push', 'origin', pkgInfo.version);

//Upload deb backage as release assets
logger.info(`uploading ${LINUX_BIN_PATH} asset...`);
exe('gh', 'release', 'create', pkgInfo.version, LINUX_BIN_PATH);

console.log('%csuccessfully togged!!! 🍾🎉🎇', 'color:green');

async function checkIfTagExists() {
 const tags: GhRelease[] = await fetch('https://api.github.com/repos/alexrr2iggs/minecraft_server_updater/releases').then((r) => r.json());
 const tagAlreadyExists = tags?.find((t: GhRelease) => t?.tag_name === pkgInfo.version);
 if (tagAlreadyExists) {
  console.warn(`Tag ${pkgInfo.version} already exists\nsee ${tagAlreadyExists.html_url}`);
  Deno.exit(1);
 }
}
