// @skip-test
import { GenericListOption } from 'cliffy/prompt/mod.ts';
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
export function selectInstalledVersion(opt: { message?: string; default?: string; options?: string[]; ommit?: string[] }): Promise<string> {
 const message = opt?.message || 'Select a version';
 const selectList = opt?.options || getInstalledVersions();
 const options = selectList
  .filter((i) => !opt?.ommit?.includes(i))
  .map((version) => ({ name: version, value: version }));

 options.push({ name: 'None', value: null });

 // READ THIS: HACKY SOLUTION
 // NOTE:TODO:in the Select.prompt should return a Promise<GenericListOption> but it returns a Promise<string> instead,  Promise<GenericListOption> is returned for default selection
 const selectedVersion: Promise<GenericListOption<string> | string> = Select.prompt({
  message,
  options,
  //   default: defaultSelected,
 });

 // READ THIS: HACKY SOLUTION
 // NOTE:TODO:in the Select.prompt should return a Promise<GenericListOption> but it returns a Promise<string> instead,  Promise<GenericListOption> is returned for default selection
 return selectedVersion.then((val) => val instanceof Object ? val.value : val) as Promise<string>;
}
