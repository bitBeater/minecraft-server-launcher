import { GenericListOption } from 'cliffy/prompt/_generic_list.ts';
import { Select } from 'cliffy/prompt/select.ts';
import { getInstalledVersions } from 'services/version.ts';

export async function selectInstalledVersion(opt: { message?: string, default?: string, options?: string[], ommit?: string[] }): Promise<string> {

    const defaultSelected: GenericListOption<string> = { name: 'None', value: undefined };
    const message = opt?.message || 'Select a version';
    const selectList = opt?.options || getInstalledVersions();
    const options = selectList
        .filter(i => !opt?.ommit?.includes(i))
        .map(version => ({ name: version, value: version }));

    options.push({ name: 'None', value: undefined });


    return Select.prompt<GenericListOption<string>>({
        message,
        options,
        default: defaultSelected
    }).then(selected => selected.value);
}