import { VersionManifestV2 } from '../../src/types/version_manifest_v2.ts';

export const FAKE_SERVER_PORT = 8765;
export const FAKE_SERVER_BAD_URL = `http://127.0.0.1:${FAKE_SERVER_PORT}/bad`;
export const FAKE_SERVER_DOWNLOAD_URL = `http://127.0.0.1:${FAKE_SERVER_PORT}/download/fake/data`;
export const FAKE_SERVER_VERSION_MANIFEST_V2_URL = `http://127.0.0.1:${FAKE_SERVER_PORT}/version_manifest_v2`;
export const FAKE_SERVER_VERSION_PACKAGES_URL = `http://127.0.0.1:${FAKE_SERVER_PORT}/version_packages`;
export const FAKE_MINECRAFT_SERVER_DATA = 'fake minecraft server data';

const fakeVersionManifestV2: VersionManifestV2 = {
 latest: { release: '1.20.0', snapshot: '1.20.0' },
 versions: [
  { id: '1.20.0', url: FAKE_SERVER_VERSION_PACKAGES_URL },
  { id: '1.19.9', url: FAKE_SERVER_VERSION_PACKAGES_URL },
 ],
};

const fakePackage = {
 downloads: {
  server: {
   sha1: 'fake sha1',
   size: FAKE_MINECRAFT_SERVER_DATA.length,
   url: FAKE_SERVER_DOWNLOAD_URL,
  },
 },
};

export function startMockServer(): Deno.HttpServer {
 return Deno.serve({ port: FAKE_SERVER_PORT }, (request: Request): Response => {
  switch (request.url) {
   case FAKE_SERVER_BAD_URL:
    return new Response(null, { status: 500 });
   case FAKE_SERVER_DOWNLOAD_URL:
    return new Response(FAKE_MINECRAFT_SERVER_DATA, { status: 200 });
   case FAKE_SERVER_VERSION_MANIFEST_V2_URL:
    return new Response(JSON.stringify(fakeVersionManifestV2), {
     status: 200,
    });
   case FAKE_SERVER_VERSION_PACKAGES_URL:
    return new Response(JSON.stringify(fakePackage), { status: 200 });
   default:
    return new Response(null, { status: 404 });
  }
 });
}
