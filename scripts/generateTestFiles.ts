/** script to generate an empty .test.ts file for each .ts file that doesnt have one*/
import { getSrcFilesWithoutTestFiles } from "./utils.ts";

const srcFilesWithoutTests = getSrcFilesWithoutTestFiles();

for (const srcFile of srcFilesWithoutTests) {
    const testFile = srcFile.replace('/src/', '/tests/').replace('.ts', '.test.ts');
    Deno.writeTextFileSync(testFile, '');
}

