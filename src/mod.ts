
import 'npm:zx/globals';
import { getVersionManifestV2 } from "./utils/version.ts";

// const flags = [
//     '--oneline',
//     '--decorate',
//     '--color',
// ]

// await $`ls -la`;


console.log((await getVersionManifestV2()));