/** 
 * script to check code quality and consistency
 */

import { getEmptyTsFiles, getSkipTestSrcFiles, getSrcFilesThatShouldHaveTestFile } from './utils.ts';
const srcFilesWithoutTestFile = getSrcFilesThatShouldHaveTestFile();
const emptyTsFiles = getEmptyTsFiles();
const skipTestSrcFiles = getSkipTestSrcFiles();

let exitCode = 0;


// check if there are src files with the @skip-test comment
if (skipTestSrcFiles.length > 0) {
    for (const srcFile of skipTestSrcFiles)
        console.log(`%c[SKIP TEST] %c${srcFile}`, 'color: orange', 'color: yellow');
}

// check if there are src files WITHOUT TEST files
if (srcFilesWithoutTestFile.length > 0) {
    for (const srcFile of srcFilesWithoutTestFile)
        console.log(`%c[WITHOUT TEST] %c${srcFile}`, 'color: red', 'color: yellow');
    exitCode = 1;
}


// check if there are EMPTY TS FILES, in src or test
if (emptyTsFiles.length > 0) {
    for (const tsFile of emptyTsFiles)
        console.log(`%c[EMPTY TS FILE] %c${tsFile}`, 'color: red', 'color: gray');
    exitCode = 1;
}

Deno.exit(exitCode);