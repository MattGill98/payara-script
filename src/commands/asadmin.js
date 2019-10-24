/**
 * @typedef {import('yargs').Arguments} Arguments
 * @typedef {import('yargs').Argv} Argv
 */
import config from '../config';
import path from 'path';
import { spawn } from 'child_process';

export const command = 'asadmin';
export const desc = 'Execute an asadmin command';

/**
 * @param {Array} argv an array 
 */
export const asadmin = (...argv) => {
  spawn('asadmin', argv, {
    stdio: 'inherit',
    cwd: path.resolve(config.get('directory'), config.get('active'), 'appserver', 'bin')
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
      return true;
    });

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Executing asadmin command.');
  asadmin(argv._);
};