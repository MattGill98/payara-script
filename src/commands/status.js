/**
 * @typedef {import('yargs').Arguments} Arguments
 */
import path from 'path';
import config from '../config';
import globals from '../util/globals';
import { readdirSync } from 'fs';
import { exists, readdir } from '../util/promise-fs';
import { checkStatus } from './kill';

// Command Details
export const command = 'status';
export const desc = 'List the installed Payara environments, and which one is selected';

const baseDirectory = config.get('directory');

function isPayaraDir(dir) {
  return exists(path.resolve(baseDirectory, dir, globals.UNZIP_NAME, 'glassfish', 'modules'));
}

/**
 * @return {Promise<Array<String>>} a promise that resolves to a list of all existing installs
 */
export const listPackages = async () => {
  let contents = await readdir(baseDirectory);
  return contents.filter(isPayaraDir);
};

/**
 * @return {Array<String>} a list of all existing installs
 */
export const listPackagesSync = () => {
  let contents = readdirSync(baseDirectory);
  return contents.filter(isPayaraDir);
};

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Available Payara environments:');

  checkStatus().then(running => {
    listPackages().then(packages => {
      packages.forEach(pkg => {
        let msg = pkg;
        if (pkg == config.get('active')) {
          msg += ' (active)';
          if (running) {
            msg += ' (running)';
          }
        }
        console.log(msg);
      });
    });
  });
};