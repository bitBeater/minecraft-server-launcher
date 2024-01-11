//@skip-test
export class MinecraftServerDownloadError extends Error {
 constructor(response: Response) {
  super(`Failed to download minecraft server: url ${response.url}, status:${response.statusText}, status code: ${response.status} `);
 }
}
