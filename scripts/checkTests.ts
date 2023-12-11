/** script to check if every ./src *.ts file has a counter part test file in  ./tests */

import { getEmptyTestFiles, getSrcFilesWithoutTestFiles } from "./utils.ts";

const srcFilesWithoutTestFiles = getSrcFilesWithoutTestFiles();
const emptyTestFiles = getEmptyTestFiles();

let exitCode = 0;

if (srcFilesWithoutTestFiles.length > 0) {
    console.error('The following src files do not have a test file:');
    console.error(srcFilesWithoutTestFiles.join('\n'));
    exitCode = 1;
}

if (emptyTestFiles.length > 0) {
    console.error('The following test files are empty:');
    console.error(emptyTestFiles.join('\n'));
    exitCode = 1;
}

Deno.exit(exitCode);