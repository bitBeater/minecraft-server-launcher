import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";

await new Command()
    // Main command.
    .name("cliffy")
    .version("0.1.0")
    .description("Command line framework for Deno")
    .globalOption("-d, --debug", "Enable debug output.")
    // .command("run")
    // .arguments("<version:?string>")
    .action((options, ...args) => {
        console.log('options', options);
        console.log('args', args);
    })



    // Child command 1.
    .command("foo", "Foo sub-command.")
    .option("-f, --foo", "Foo option.")
    .arguments("<value:string>")
    .action((options, ...args) => console.log("Foo command called."))
    // Child command 2.
    .command("bar", "Bar sub-command.")
    .option("-b, --bar", "Bar option.")
    .arguments("<input:string> [output:string]")
    .action((options, ...args) => console.log("Bar command called."))
    .parse(Deno.args);