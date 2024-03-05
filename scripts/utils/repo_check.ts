import { log } from 'iggs-utils';
import { askToContinue, cmdOutTxt } from './utils.ts';

const logger = new log.Logger({ logLevel: log.LogLevel.TRACE, prefix: '[REPO_CHECK]' });
/**
 * script to do branch checks:
 * 1. ask if the current branch is the correct one for the release.
 * 2. check if there are any uncommited changes, if not, ask  user if want to continue
 * 3. check if there are any unpushed changes, if not, ask  user if want to continue
 * 4. check if the local branch and the remote branches are in sync, if not, ask  user if want to continue
 */

export async function repositoryCheck() {
 await askIfCurrentBranchIsCorrect();
 await checkUncommitedChanges();
 await checkUnpushedChanges();
 await checkIfLocalAndRemoteAreInSync();
}

async function askIfCurrentBranchIsCorrect() {
 const currentBranch = cmdOutTxt('git', 'branch', '--show-current');
 await askToContinue(`is ${currentBranch} the correct branch for the release?`);
}

async function checkUncommitedChanges() {
 const uncommitedFiles = cmdOutTxt('git', 'status', '--porcelain');
 if (uncommitedFiles !== '') {
  logger.warn(`Uncommited files: \n${uncommitedFiles}`);
  await askToContinue();
 }
}

async function checkUnpushedChanges() {
 const unpushedChanges = cmdOutTxt('git', 'log', '--branches', '--not', '--remotes');
 if (unpushedChanges !== '') {
  logger.warn(`Unpushed changes: \n${unpushedChanges}`);
  await askToContinue();
 }
}

async function checkIfLocalAndRemoteAreInSync() {
 const localSha = cmdOutTxt('git', 'rev-parse', 'HEAD');
 const remoteSha = cmdOutTxt('git', 'rev-parse', '@{u}');

 if (localSha !== remoteSha) {
  logger.warn('Local and remote branches are out of sync!');
  await askToContinue();
 }
}
