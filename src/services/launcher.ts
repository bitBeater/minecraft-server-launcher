import { join } from "https://deno.land/std@0.134.0/path/mod.ts";

import { SERVER_LAUNCH_SCRIPT } from "../consts.ts";
import { getConf } from "../data/conf.ts";
import { logger } from './../utils/logger.ts';
import { getLatestInstalledVersion } from "./version.ts";

export function launchMinecraftServer(version = getLatestInstalledVersion()): Deno.Process {


    const launchScriptPath = join(getConf().serverInstallationDir, version, SERVER_LAUNCH_SCRIPT);
    logger.info('launching', version, 'server');

    return Deno.run({
        cmd: [launchScriptPath],
        stdout: 'piped',
        stderr: 'piped',
        stdin: 'piped'
    });
}


