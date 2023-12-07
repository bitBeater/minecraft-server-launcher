import { getConf } from "./conf.ts";

export function getServerInstallationDirs(): string[] {

    const dirs = Deno.readDirSync(getConf().serverInstallationDir);
    const retVal: string[] = [];

    for (const dir of dirs) {
        if (dir.isDirectory) {
            retVal.push(dir.name);
        }
    }

    return retVal;
}
