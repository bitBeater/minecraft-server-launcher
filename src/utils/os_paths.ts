

export function getOsAppInstallPath(): string {
    switch (Deno.build.os) {
        case 'linux':
            return '/opt';
        case 'windows':
            return 'C:\\Program Files';
        case 'darwin':
            return '/Applications';
        default:
            throw new Error(`Unsupported OS: ${Deno.build.os}`);
    }
}

