#!/usr/bin/env -S deno run -A
/** script to generate an empty .test.ts file for each .ts file that doesnt have one*/
import { writeFileAndDir } from 'utils/fs.ts';
import { getSkipTestSrcs, sourceFilePathToTestFilePath } from './utils/utils.ts';

const skipTestSrcFiles = getSkipTestSrcs();

if (skipTestSrcFiles.length > 0) {
 for (const srcFile of skipTestSrcFiles) {
  console.log(`%c[SKIP TEST] %c${srcFile}`, 'color: orange', 'color: yellow');
 }
}

for (const sourceFilePath of getSkipTestSrcs()) {
 const testFilePath = sourceFilePathToTestFilePath(sourceFilePath);

 console.log(`%c[GENERATE TEST] %c${testFilePath}`, 'color: green', 'color: yellow');
 writeFileAndDir(testFilePath, '');
}
