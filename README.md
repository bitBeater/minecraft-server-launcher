# Minecraft Server Launcher

A Deno script for managing and updating Minecraft servers.

## Introduction

This script automates the management of Minecraft server instances. It facilitates the installation, update, and management of multiple server versions,
ensuring you're always up-to-date with the latest release from `piston-meta.mojang.com`.

## Features

- **Automatic Updates**: Checks and installs the latest Minecraft server version.
- **Multiple Server Management**: Manage and switch between different server versions.
- **Configuration Management**: Maintain and port server configurations and worlds across versions.

## Installation

To install the Minecraft Server Launcher, please visit the GitHub releases section of this repository.


## Usage

The `misela` tool provides various commands for managing your Minecraft servers:

- **Launch the latest installed Minecraft server**

  ~~~sh
  misela run
  ~~~

- **Start a Specific Server Version**

  ~~~sh
  misela run <version>
  ~~~

- **List Installed Servers**

  ~~~sh
  misela list
  ~~~

- **List Available Servers for download**

  ~~~sh
  misela list-available
  ~~~

- **Install the Latest or a Specific Server Version**

  ~~~sh
  misela install [install_version] [migration_version]
  ~~~

- **Migrate Worlds and Configs Between Versions**

  ~~~sh
  misela migrate [version_from] [version_to]
  ~~~

- **Display Current Configuration**

  ~~~sh
  misela info
  ~~~

For a complete list of commands and options, run:

~~~sh
misela --help
~~~

## Additional Information

The script interacts with Mojang's official metadata endpoint at `https://piston-meta.mojang.com/mc/game/version_manifest_v2.json` to retrieve the latest game versions.

## Contributing

Contributions and advices are welcomed! If you'd like to improve the Minecraft Server Launcher, please submit pull requests, suggest features, or report issues. For significant changes, open an issue first to discuss what you would like to change.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for more details.
