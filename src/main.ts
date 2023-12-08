import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import { install } from "./cli/install.ts";
import { run } from "./cli/run.ts";
import { getConf } from "./data/conf.ts";


/**
 * 
## Usage

- **View Launcher Version**

  ```sh
  ./minecraft_server_launcher [-v | --version]
  ```

- **Launch the lastest installed mincreaft server**
  ```sh
  ./minecraft_server_launcher
  ```
- **Start a Specific Server Version**
  ```sh
  ./minecraft_server_launcher <version>
  ```
- **List Installed Servers**

  ```sh
  ./minecraft_server_launcher [-l | --list]
  ```

- **List Available Servers for download**

  ```sh
  ./minecraft_server_launcher [-la | --list-available]
  ```

- **Start a Specific Server Version**
  ```sh
  ./minecraft_server_launcher <version>
  ```
- **Install a Server**
  ```sh
  ./minecraft_server_launcher [i | install] <version> <optional: version to copy worlds and configs from>
  ```
 */



if (!Deno.statSync(getConf().serverInstallationDir)?.isDirectory)
    Deno.mkdirSync(getConf().serverInstallationDir, { recursive: true });

await new Command()
    // Main command.
    .name("minecraft_server_launcher")
    .version("0.0.1")
    .description("Minecraft Server Launcher")
    .globalOption("-d, --debug", "Enable debug output.")

    // COMANDS
    //  run
    .command("run")
    .arguments("[version:string]")
    .action(run)
    // // Child command 1.
    .command("install", "Foo sub-command.")
    // .option("-f, --foo", "Foo option.")
    .arguments("[install_version:string] [migration_version:string]")
    .action(install)
    // // Child command 2.
    // .command("bar", "Bar sub-command.")
    // .option("-b, --bar", "Bar option.")
    // .arguments("<input:string> [output:string]")
    // .action((options, ...args) => console.log("Bar command called."))
    // .default('run')
    .parse(Deno.args);