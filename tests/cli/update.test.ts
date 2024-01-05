import { update } from 'cli/update.ts';
import { Confirm, Select } from 'cliffy/prompt/mod.ts';
import { existsEula } from 'data/eula.ts';
import { isServerInstalled } from 'data/installation.ts';
import { getVersionManifestV2 } from 'data/version.ts';
import { assertEquals } from 'std/assert/mod.ts';
import { afterAll, beforeAll, beforeEach, describe, it } from 'std/testing/bdd.ts';
import { returnsNext, stub } from 'std/testing/mock.ts';
import { existsServerProperties } from '../../src/data/server_properties.ts';
import { startMockServer } from '../test_utils/fake_api_server.ts';
import { clearServerInstallationDir, copyDefaultServer } from '../test_utils/utils.ts';

describe('update - installs latest available version if not already installed', () => {
 const lastVersion = '1.0.0';
 let mockServer: Deno.HttpServer;

 beforeAll(() => {
  mockServer = startMockServer();
 });

 beforeEach(() => clearServerInstallationDir());
 afterAll(() => mockServer.shutdown());

 it('should install the latest server version if not installed', async () => {
  const mockConfirmPrompt = stub(Confirm, 'prompt', returnsNext([Promise.resolve(true)]));
  await update();
  const lattestAvailableVersion = (await getVersionManifestV2()).latest.release;
  const isLattestVersionInstalled = isServerInstalled(lattestAvailableVersion);
  assertEquals(isLattestVersionInstalled, true);
  mockConfirmPrompt.restore();
 });

 it('should install and migrate from lattest version', async () => {
  copyDefaultServer(lastVersion);

  // SELECT lastVersion ON PROMPT
  const mockSelectPrompt = stub(Select, 'prompt', returnsNext([Promise.resolve({ value: lastVersion })]));

  await update();
  const lattestAvailableVersion = (await getVersionManifestV2()).latest.release;
  const isLattestVersionInstalled = isServerInstalled(lattestAvailableVersion);

  // IS SERVER INSTALLED?
  assertEquals(isLattestVersionInstalled, true);

  // HAS EULA FILE BEEN PORTED?
  const hasEula = await existsEula(lastVersion);
  assertEquals(hasEula, true);

  // HAS SERVER PROPERTIES FILE BEEN PORTED?
  const hasProperties = await existsServerProperties(lastVersion);
  assertEquals(hasProperties, true);

  mockSelectPrompt.restore();
 });
});
