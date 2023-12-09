import { Select } from 'https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/select.ts';
import { getInstalledVersions } from '../services/version.ts';


export async function selectInstalledVersion(message = 'Select a version', preSelectedVersion?: string): Promise<string> {
    const installedVersions = getInstalledVersions();
    const options = installedVersions.map(version => ({ name: version, value: version }));
    options.push({ name: 'None', value: undefined });

    return Select.prompt({
        message,
        options,
        default: { name: preSelectedVersion, value: preSelectedVersion }
    }).then(selected => selected.value);
}