import { getVersionManifestV2, getVersionPackages } from 'data/version.ts';
import { bytes } from 'iggs-utils';
import ProgressBar from 'progress';
import { logger } from 'utils/logger.ts';
import { downloadMinecraftServer, getMinecraftServerWritableStream } from '../data/minecraft_server.ts';
import { existsServerProperties, writeDefaultServerProperties } from '../data/server_properties.ts';
import { VersionNotFoundManifestV2 } from '../errors/mc_version_not_found.ts';

export async function installMinecraftServer(version: string): Promise<void> {
 const versionManifestV2 = await getVersionManifestV2();
 const versionPackagesUrl = versionManifestV2.versions.find((v) => v.id === version)?.url;

 if (!versionPackagesUrl) {
  throw new VersionNotFoundManifestV2(version);
 }

 const versionPackages = await getVersionPackages(versionPackagesUrl);
 const downloadStream = await downloadMinecraftServer(versionPackages.downloads.server.url);
 const minecraftServerWritableStream = getMinecraftServerWritableStream(version);

 const progressBar = new ProgressBar({
  //   title: `Downloading ${version} server`,
  total: versionPackages.downloads.server.size,
  display: ':percent :bar :title | remaining time :eta ',
  width: 75,
 });

 let completed = 0;
 const minecraftServerWriter = minecraftServerWritableStream.getWriter();
 for await (const chunk of downloadStream) {
  await minecraftServerWriter.write(chunk);
  completed += chunk.length;
  progressBar.render(completed, { title: `${Math.floor(completed / bytes.MB)} of ${Math.floor(progressBar.total / bytes.MB)} MB` });
 }
 progressBar.end();
 await minecraftServerWriter.close();
 minecraftServerWriter.releaseLock();

 if (!existsServerProperties(version)) {
  writeDefaultServerProperties(version);
 }

 logger.info('successfully installed', version, 'server');
 return Promise.resolve();
}
