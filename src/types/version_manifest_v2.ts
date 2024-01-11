//@skip-test
export interface VersionManifestV2 {
 latest: Latest;
 versions: Version[];
}

export interface Latest {
 release: string;
 snapshot: string;
}

export interface Version {
 id?: string;
 type?: string;
 url?: string;
 time?: string;
 releaseTime?: string;
 sha1?: string;
 complianceLevel?: number;
}
