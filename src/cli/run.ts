import { launchMinecraftServer } from "../services/launcher.ts";
import { validateSemver } from "../utils/validators.ts";

export function run(options: any, ...args: string[]) {
    const version = args[0];
    validateSemver(version);
    launchMinecraftServer(version);
}