import { assertEquals } from 'std/assert/assert_equals.ts';
import { afterAll, beforeAll, beforeEach, describe, it } from 'std/testing/bdd.ts';
import { SYS_CONFIG_FILE_PATH, USR_CONFIG_FILE_PATH } from 'utils/paths.ts';

import { getConf } from 'services/conf.ts';
import { MinecraftServerLauncherConf } from 'types/conf.ts';

//setUsrConf
//getSysConf
const usrTestConf: MinecraftServerLauncherConf = {
 serverInstallationDir: 'usr/foo/bar',
 //  versionManifestV2Url: 'https://usr/foo.bar',
 launchArgs: {
  default: {
   javaArgs: [
    '--foo',
   ],
   serverArgs: [
    '--bar',
   ],
  },
 },
};

const sysTestConf: MinecraftServerLauncherConf = {
 serverInstallationDir: 'sys/foo/bar',
 versionManifestV2Url: 'https://sys/foo.bar',
 launchArgs: {
  default: {
   javaArgs: [
    '--moo',
   ],
   serverArgs: [
    '--baz',
   ],
  },
 },
};

let usrConf;
let sysConf;

describe('conf', () => {
 beforeAll(() => {
  usrConf = Deno.readFileSync(USR_CONFIG_FILE_PATH);
  sysConf = Deno.readFileSync(SYS_CONFIG_FILE_PATH);
 });

 beforeEach(() => {
  Deno.writeTextFileSync(USR_CONFIG_FILE_PATH, JSON.stringify(usrTestConf, null, 4));
  Deno.writeTextFileSync(SYS_CONFIG_FILE_PATH, JSON.stringify(sysTestConf, null, 4));
 });

 afterAll(() => {
  Deno.writeFileSync(USR_CONFIG_FILE_PATH, usrConf);
  Deno.writeFileSync(SYS_CONFIG_FILE_PATH, sysConf);
 });

 it('getConf: should return the user configuration, if sysConf doesnt exists', () => {
  Deno.removeSync(SYS_CONFIG_FILE_PATH);
  const readedConf = getConf();
  assertEquals(readedConf, usrTestConf);
 });

 it('getConf: should return the system configuration, if usrConf doesnt exists', () => {
  Deno.removeSync(USR_CONFIG_FILE_PATH);
  const readedConf = getConf();
  assertEquals(readedConf, sysTestConf);
 });

 it('getConf: should return system conf with properties ovverrided by valued usrConf properties', () => {
  const readedConf = getConf();
  assertEquals(readedConf.serverInstallationDir, usrTestConf.serverInstallationDir);
  assertEquals(readedConf.versionManifestV2Url, sysTestConf.versionManifestV2Url);
 });
});
