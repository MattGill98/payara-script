/**
 * @typedef {import('yargs').Arguments} Arguments
 */
import path from 'path';
import config from '../config';
import globals from '../util/globals';
import { exists, readdir } from '../util/promise-fs';
import { checkStatus } from './kill';

// Command Details
export const command = 'status';
export const desc = 'List the installed Payara environments, and which one is selected';

const baseDirectory = config.get('directory');

/**
 * @return {Promise<Array<String>>} a promise that resolves to a list of all existing installs
 */
export const listPackages = () => new Promise((resolve, reject) => {
  readdir(baseDirectory).then(contents => {
    Promise
      .all(
        contents.map(folder => 
            exists(path.resolve(baseDirectory, folder, globals.UNZIP_NAME, 'glassfish', 'domains', 'domain1'))
            .then(exists => exists? folder : false))
      )
      .then(installs => resolve(installs.filter(install => install !== false)));
  }).catch(e => reject(e));
});

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