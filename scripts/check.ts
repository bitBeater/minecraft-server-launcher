#!/usr/bin/env -S deno run -A
/**
 * script to check code quality and consistency
 */
import { getEmptyFiles, getSkipTestSrcs, getsMissingTestSrcs, SRC_DIR, TESTS_DIR } from './utils.ts';

let exitCode = 0;

// check if there are src files with the @skip-test comment
const skipTestSrcFiles = getSkipTestSrcs();
if (skipTestSrcFiles.length > 0) {
 for (const srcFile of skipTestSrcFiles) {
  console.log(`%c[SKIP TEST] %c${srcFile}`, 'color: orange', 'color: yellow');
 }
}

// check if there are src files WITHOUT TEST files
const srcFilesWithoutTestFile = getsMissingTestSrcs();
if (srcFilesWithoutTestFile.length > 0) {
 for (const srcFile of srcFilesWithoutTestFile) {
  console.log(`%c[WITHOUT TEST] %c${srcFile}`, 'color: red', 'color: #ff4900');
 }
 exitCode = 1;
}

// check if there are EMPTY TS FILES, in src or test
const emptyTsFiles = [...getEmptyFiles(SRC_DIR, 'ts'), ...getEmptyFiles(TESTS_DIR, 'test.ts')];
if (emptyTsFiles.length > 0) {
 for (const tsFile of emptyTsFiles) {
  console.log(`%c[EMPTY TS FILE] %c${tsFile}`, 'color: red', 'color: gray');
 }
 exitCode = 1;
}

if (exitCode === 0) {
 console.log(`%c[CHECK PASS]`, 'color: green');
} else {
 Deno.exit(exitCode);
}
