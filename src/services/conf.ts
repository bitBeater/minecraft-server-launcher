import { getSysConf, getUsrConf, setUsrConf } from 'data/conf.ts';
import { MinecraftServerLauncherConf } from 'types/conf.ts';
import { defaultConfig } from 'utils/config.ts';
import { logger } from 'utils/logger.ts';

export function getConf(): MinecraftServerLauncherConf {
 let sysConf: MinecraftServerLauncherConf = {};
 let usrConf: MinecraftServerLauncherConf = {};

 try {
  sysConf = getSysConf();
 } catch (err) {
  if (err.name !== 'NotFound') {
   throw err;
  }
  logger.warn('system config file not found!', err.message);
 }

 try {
  usrConf = getUsrConf();
 } catch (err) {
  if (err.name !== 'NotFound') {
   throw err;
  }
  logger.warn('user config file not found!', err.message);
  usrConf = Object.entries(sysConf).length ? sysConf : defaultConfig;
  setUsrConf(usrConf);
 }

 return {
  ...sysConf,
  ...usrConf,
 };
}
