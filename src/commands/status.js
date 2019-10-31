/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import config from '../config';
import fs from 'promise-fs';
import path from 'path';
import globals from '../util/globals';

export const command = 'status';
export const desc = 'List the installed Payara environments, and which one is selected';

export const listPackages = handler => {
  let directory = config.get('directory');
  return fs.readdirSync(directory).filter((dir) => {
    if (fs.existsSync(path.resolve(directory, dir , globals.UNZIP_NAME, 'glassfish', 'domains', 'domain1'))) {
      return handler? handler(dir) : true;
    }
    return false;
  });
};

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv => 
  argv
    .help();

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Available Payara environments:');
  listPackages(pkg => {
    if (pkg == config.get('active')) {
      console.log(pkg + ' (active)')
    } else {
      console.log(pkg);
    }
  });
};