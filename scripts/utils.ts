/** script to check if every ./src *.ts file has a counter part test file in  ./tests */

import { walkSync } from 'std/fs/walk.ts';
import { join } from "std/path/join.ts";
import { resolve } from 'std/path/mod.ts';
import { resolvePath } from "utils/fs.ts";

export const SRC_DIR = resolve('./src/');
export const TEST_DIR = resolve('./tests/');
export const ERRORS_DIR = resolvePath(SRC_DIR, 'errors');
export const TYPES_DIR = resolvePath(SRC_DIR, 'types');


export function getTsFiles(dir: string, testFile = false): string[] {
    const ext = testFile ? '.test.ts' : '.ts';
    const tsFiles: string[] = [];
    const walkIterator = walkSync(dir, { includeDirs: false, exts: [ext] });

    for (const entry of walkIterator) {
        tsFiles.push(entry.path);
    }

    return tsFiles;
}



/**
 * Retrieves the source files without the corresponding test files.
 * @returns An array of strings representing the path of files without test files.
 */
export function getSrcFilesWithoutTestFile(): string[] {

    const srcFiles = getTsFiles(SRC_DIR);
    const testFiles = getTsFiles(TEST_DIR, true);

    for (const testFile of testFiles) {
        const srcfiedTestFile = testFilePathToSrcFilePath(testFile);
        const index = srcFiles.indexOf(srcfiedTestFile);
        if (index !== -1)
            srcFiles.splice(index, 1);
    }

    return srcFiles;
}


/**
 * a file should have a test file if it is not in the errors or types directories and it does not have the @skip-test comment.
 * @returns an array of strings representing the path of src files that should have a test file.
 */
export function getSrcFilesThatShouldHaveTestFile(): string[] {
    return getSrcFilesWithoutTestFile().filter(shouldHaveTestFile);
}

export function shouldHaveTestFile(srcFile: string): boolean {
    return !srcFile.startsWith(join(SRC_DIR, 'errors'))
        && !srcFile.startsWith(join(SRC_DIR, 'types'))
        && !hasSkipTestComment(srcFile);
}


/**
 * Retrieve src files with the @skip-test commnet.
 * @returns An array of strings representing the path of src files with the @skip-test commnet.
 */
export function getSkipTestSrcFiles(): string[] {
    const srcFiles = getTsFiles(SRC_DIR);
    return srcFiles.filter(srcFile => hasSkipTestComment(srcFile));
}


export function getEmptyTsFiles(): string[] {
    const tsFiles = [...getTsFiles(SRC_DIR), ...getTsFiles(TEST_DIR)];

    const emptyTsFiles: string[] = [];

    for (const tsFile of tsFiles) {

        const stat = Deno.statSync(tsFile);
        if (stat.size === 0) {
            emptyTsFiles.push(tsFile);
        }
    }

    return emptyTsFiles;
}

export function hasSkipTestComment(file: string): boolean {
    const content = Deno.readTextFileSync(file);
    return content.includes('@skip-test');
}

export function testFilePathToSrcFilePath(testFilePath: string): string {
    return testFilePath.replace(TEST_DIR, SRC_DIR).replace(/\.test\.ts$/, '.ts');
}

export function sourceFilePathToTestFilePath(sourceFilePath: string): string {
    return sourceFilePath.replace(SRC_DIR, TEST_DIR).replace(/\.ts$/, '.test.ts');
}