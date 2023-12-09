
import { Input } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { valid } from "https://deno.land/x/semver@v1.4.1/mod.ts";

export async function userSemverPrompt(msg = "Enter version"): Promise<string> {
    const semver = await Input.prompt(msg);
    if (!valid(semver)) {
        console.log("Invalid semver!");
        return userSemverPrompt(msg);
    }
}