/**
 * script to check code quality and consistency
 */
import { log } from 'iggs-utils';
import { getEmptyFiles, getSkipTestSrcs, getsMissingTestSrcs, SRC_DIR, TESTS_DIR } from './utils.ts';
const logger = new log.Logger({ logLevel: log.LogLevel.TRACE, prefix: '[CHECK QUALITY]' });

export function checkCodeQuality() {
 logger.info('Checking Code Quality');
 let exitCode = 0;

 // check if there are src files with the @skip-test comment
 const skipTestSrcFiles = getSkipTestSrcs();
 if (skipTestSrcFiles.length > 0) {
  for (const srcFile of skipTestSrcFiles) {
   logger.warn(`[SKIP TEST] ${srcFile}`);
  }
 }

 // check if there are src files WITHOUT TEST files
 const srcFilesWithoutTestFile = getsMissingTestSrcs();
 if (srcFilesWithoutTestFile.length > 0) {
  for (const srcFile of srcFilesWithoutTestFile) {
   logger.fatal(`[WITHOUT TEST] ${srcFile}`);
  }
  exitCode = 1;
 }

 // check if there are EMPTY TS FILES, in src or test
 const emptyTsFiles = [...getEmptyFiles(SRC_DIR, 'ts'), ...getEmptyFiles(TESTS_DIR, 'test.ts')];
 if (emptyTsFiles.length > 0) {
  for (const tsFile of emptyTsFiles) {
   logger.fatal(`[EMPTY TS FILE] ${tsFile}`);
  }
  exitCode = 1;
 }

 if (exitCode === 0) {
  logger.info(`[CHECK PASS]`);
 } else {
  Deno.exit(exitCode);
 }
}
