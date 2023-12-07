# Minecraft Server Launcher

A Node.js script for managing and updating Minecraft servers.

## Introduction

This script automates the management of Minecraft server instances. It facilitates the installation, update, and management of multiple server versions, ensuring you're always up-to-date with the latest release from `piston-meta.mojang.com`.

## Features

- **Automatic Updates**: Checks and installs the latest Minecraft server version.
- **Multiple Server Management**: Manage and switch between different server versions.
- **Configuration Management**: Maintain and port server configurations and worlds across versions.

## Installation

[Include detailed steps on how to install this script, along with any prerequisites needed.]

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
- **Install a Specific Server Version**
  ```sh
  ./minecraft_server_launcher [-i | --install] <version> <optional: version to copy worlds and configs from>
  ```

## Additional Information

The script uses this endpoint to retrieve the latest game version:
`https://piston-meta.mojang.com/mc/game/version_manifest_v2.json`

## Contributing

Contributions are welcome! Please feel free to submit pull requests, suggest features, or report issues. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
