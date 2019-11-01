import config from '../config';
import path from 'path';
import { spawn } from 'child_process';
import globals from '../util/globals';
import fs from 'promise-fs';

const asadminUtility = process.platform === 'win32'? 'asadmin.bat' : './asadmin';

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv =>
  argv
    .help()
    .check(() => {
      if (!config.get('active')) {
        throw 'No configured active Payara Environment.';
      }
      if (!fs.existsSync(path.resolve(config.get('directory'), config.get('active').toString()))) {
        throw 'The active Payara environment does not exist';
      }
      return true;
    });

/**
 * @param {Array} argv an array 
 */
export default async (...argv) => {
  return spawn(asadminUtility, argv, {
    stdio: 'inherit',
    cwd: path.resolve(config.get('directory'), config.get('active').toString(), globals.UNZIP_NAME, 'bin')
  });
};