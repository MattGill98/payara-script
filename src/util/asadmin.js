import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import config from '../config';
import globals from '../util/globals';

let activeDir = config.get('active');
if (!activeDir) activeDir = 'default';
const asadminDirectory = path.resolve(config.get('directory'), activeDir.toString(), globals.UNZIP_NAME, 'bin');
const asadminUtility = process.platform === 'win32'? 'asadmin.bat' : './asadmin';
const asadminPath = path.resolve(asadminDirectory, asadminUtility);

/**
 * @param {Argv} argv the Yargs instance
 * @return {Argv} the Yargs instance, after checking that the active environment is valid
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
  return spawn(asadminPath, argv, {
    stdio: 'inherit'
  });
};
