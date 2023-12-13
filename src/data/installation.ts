import { getConf } from 'data/conf.ts';

/**
 * Retrieves the list of server installation directories.
 *
 * @returns An array of strings representing the names of the server installation directories.
 */
export function getServerInstallationDirs(): string[] {
 const retVal: string[] = [];

 try {
  const dirs = Deno.readDirSync(getConf().serverInstallationDir);
  for (const dir of dirs) {
   if (dir.isDirectory) {
    retVal.push(dir.name);
   }
  }
 } catch (error) {
  if (!(error instanceof Deno.errors.NotFound)) {
   throw error;
  }
 }

 return retVal;
}

/**
 * Checks if a server with the specified version is installed.
 *
 * @param version - The version of the server to check.
 * @returns True if the server is installed, false otherwise.
 */
export function isServerInstalled(version: string): boolean {
 return getServerInstallationDirs().includes(version);
}
