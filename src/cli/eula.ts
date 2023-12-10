/**
 * Prompts the user to accept the Minecraft EULA and writes the EULA file if accepted.
 * 
 * @param version - The version of the Minecraft server.
 * @returns A promise that resolves when the EULA is accepted and written.
 */
import { Confirm } from 'cliffy/prompt/confirm.ts';
import { existsEula, writeEula } from 'data/eula.ts';

export async function acceptEula(version: string) {
    if (!existsEula(version) && (await Confirm.prompt(`Accept EULA? By accepting you are indicating your agreement to minecraft EULA (https://aka.ms/MinecraftEULA).`)))
        writeEula(version);
}   