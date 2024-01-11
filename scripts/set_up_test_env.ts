#!/usr/bin/env -S deno run -A
import { log } from 'iggs-utils';
import { defaultConfig } from 'utils/config.ts';
import { writeFileAndDir } from 'utils/fs.ts';
import { logger } from 'utils/logger.ts';
import { DEFAULT_SERVER_PROPERTIES_PATH, SYS_CONFIG_FILE_PATH, USR_CONFIG_FILE_PATH } from 'utils/paths.ts';
import { FAKE_SERVER_VERSION_MANIFEST_V2_URL } from '../tests/test_utils/fake_api_server.ts';
Deno.env.set('DENO_ENV', 'development');
logger.logLevel = log.LogLevel.TRACE;

/**
 * error: NotFound: No such file or directory (os error 2): open '/home/<user>/.development/minecraft-server-launcher/usr/share/minecraft-server-launcher/server.properties'
 * const defaultServerPropertiesFile = Deno.openSync(DEFAULT_SERVER_PROPERTIES_PATH);
 */
writeFileAndDir(DEFAULT_SERVER_PROPERTIES_PATH, '#Minecraft server properties');

/**
 * error: NotFound: No such file or directory (os error 2): readfile '/home/<user>/.development/minecraft-server-launcher/etc/minecraft-server-launcher/config.json'
 * sysConf = Deno.readFileSync(SYS_CONFIG_FILE_PATH);
 */
writeFileAndDir(SYS_CONFIG_FILE_PATH, JSON.stringify(defaultConfig, undefined, 4));

//----------------------------------------------------------------------------------------------------------------------
// setting tests config file

const testConfig = { ...defaultConfig };
testConfig.versionManifestV2Url = FAKE_SERVER_VERSION_MANIFEST_V2_URL;

writeFileAndDir(USR_CONFIG_FILE_PATH, JSON.stringify(testConfig, undefined, 4));
