
// await new Command()
//     // Main command.
//     .name('cliffy')
//     .version('0.1.0')
//     .description('Command line framework for Deno')
//     .globalOption('-d, --debug', 'Enable debug output.')
//     // .command('run')
//     // .arguments('<version:?string>')
//     .action((options, ...args) => {
//         console.log('options', options);
//         console.log('args', args);
//     })

import { maxSatisfying } from 'https://deno.land/x/semver@v1.4.1/mod.ts';



//     // Child command 1.
//     .command('foo', 'Foo sub-command.')
//     .option('-f, --foo', 'Foo option.')
//     .arguments('<value:string>')
//     .action((options, ...args) => console.log('Foo command called.'))
//     // Child command 2.
//     .command('bar', 'Bar sub-command.')
//     .option('-b, --bar', 'Bar option.')
//     .arguments('<input:string> [output:string]')
//     .action((options, ...args) => console.log('Bar command called.'))
//     .parse(Deno.args);


const versions = ['1.0.0', '1.0.1', '1.1.0', '1.1.1', '1.2.0', '1.0.2', '1.3', '2.0.0', '3'];

maxSatisfying(versions, '1.0.0');