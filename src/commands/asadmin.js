/**
 * @typedef {import('yargs').Arguments} Arguments
 * @typedef {import('yargs').Argv} Argv
 */
import config from '../config';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import globals from '../util/globals';
import { fstat } from 'fs';

export const command = 'asadmin <command>';
export const desc = 'Execute an asadmin command';

/**
 * @param {Array} argv an array 
 */
export const asadmin = (...argv) => {
  spawn('asadmin', argv, {
    stdio: 'inherit',
    cwd: path.resolve(config.get('directory'), config.get('active').toString(), globals.UNZIP_NAME, 'bin')
  });
};

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
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Executing asadmin command.');
  asadmin(argv.command);
};