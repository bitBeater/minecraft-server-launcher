/** script to check if every ./src *.ts file has a counter part test file in  ./tests */

import { walkSync } from 'std/fs/walk.ts';
import { resolve } from 'std/path/mod.ts';

const srcDir = resolve('./src');
const testDir = resolve('./tests');


export function getTsFiles(dir: string): string[] {
    const tsFiles: string[] = [];
    const walkIterator = walkSync(dir, { includeDirs: false, exts: ['.ts'] });

    for (const entry of walkIterator) {
        tsFiles.push(entry.path);
    }

    return tsFiles;
}

export function getSrcFiles(): string[] {
    return getTsFiles(srcDir);
}

export function getTestFiles(): string[] {
    return getTsFiles(testDir);
}

export function getSrcFilesWithoutTestFiles(): string[] {
    const srcFilesWithoutTestFiles: string[] = [];

    for (const srcFile of getSrcFiles()) {
        const testFile = srcFile.replace(srcDir, testDir).replace('.ts', '.test.ts');
        if (!getTestFiles().includes(testFile)) {
            srcFilesWithoutTestFiles.push(srcFile);
        }
    }

    return srcFilesWithoutTestFiles;
}


export function getEmptyTestFiles(): string[] {
    const testFiles = getTestFiles();
    const emptyTestFiles: string[] = [];

    for (const srcFile of testFiles) {
        const stat = Deno.statSync(srcFile);
        if (stat.size === 0) {
            emptyTestFiles.push(srcFile);
        }
    }

    return emptyTestFiles;
}
