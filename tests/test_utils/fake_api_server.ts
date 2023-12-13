import { VersionManifestV2 } from 'types/versionManifestV2.ts';

export const port = 8765;
export const badUrl = `http://127.0.0.1:${port}/bad`;
export const downloadFakeDataUrl = `http://127.0.0.1:${port}/download/fake/data`;
export const versionManifestV2Url = `http://127.0.0.1:${port}/version_manifest_v2`;
export const versionPackagesUrl = `http://127.0.0.1:${port}/version_packages`;

const fakeVersionManifestV2: VersionManifestV2 = {
    latest: { release: '1.20.0', snapshot: '1.20.0' },
    versions: [
        { id: '1.20.0', url: versionPackagesUrl },
        { id: '1.19.9', url: versionPackagesUrl },
    ],

};
const fakePackage = {
    downloads: {
        server: {
            sha1: 'fake sha1',
            size: downloadFakeDataUrl.length,
            url: downloadFakeDataUrl,
        },
    },
};

export const minecraftServerData = 'fake minecraft server data';

export function startMockServer(): Deno.HttpServer {
    return Deno.serve({ port }, (request: Request): Response => {
        switch (request.url) {
            case badUrl:
                return new Response(null, { status: 500 });
            case downloadFakeDataUrl:
                return new Response(minecraftServerData, { status: 200 });
            case versionManifestV2Url:
                return new Response(JSON.stringify(fakeVersionManifestV2), {
                    status: 200,
                });
            case versionPackagesUrl:
                return new Response(JSON.stringify(fakePackage), { status: 200 });
            default:
                return new Response(null, { status: 404 });
        }
    });
}
