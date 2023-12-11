/** script to generate an empty .test.ts file for each .ts file that doesnt have one*/
import { writeFileAndDir } from "utils/fs.ts";
import { getSkipTestSrcFiles, getSrcFilesThatShouldHaveTestFile, sourceFilePathToTestFilePath } from './utils.ts';

const skipTestSrcFiles = getSkipTestSrcFiles();

if (skipTestSrcFiles.length > 0) {
    for (const srcFile of skipTestSrcFiles)
        console.log(`%c[SKIP TEST] %c${srcFile}`, 'color: orange', 'color: yellow');
}



for (const sourceFilePath of getSrcFilesThatShouldHaveTestFile()) {

    const testFilePath = sourceFilePathToTestFilePath(sourceFilePath);

    console.log(`%c[GENERATE TEST] %c${testFilePath}`, 'color: green', 'color: yellow');
    writeFileAndDir(testFilePath, '');
}

