// @skip-test
import { GenericListOption } from 'cliffy/prompt/_generic_list.ts';
import { Select } from 'cliffy/prompt/select.ts';
import { getInstalledVersions } from 'services/version.ts';

/**
 * Prompts the user to select an installed version from a list of options.
 * 
 * @param opt - An optional object containing configuration options.
 * @param opt.message - The message to display when prompting the user. Defaults to 'Select a version'.
 * @param opt.default - The default selected option. Defaults to 'None'.
 * @param opt.options - An array of available options to choose from. Defaults to the list of installed versions.
 * @param opt.ommit - An array of versions to omit from the list of options.
 * 
 * @returns A Promise that resolves to the selected version.
 */
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