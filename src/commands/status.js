/**
 * @typedef {import('yargs').Arguments} Arguments
 */
import config from '../config';
import fs from 'fs';
import path from 'path';

const directory = config.get('directory');
const active = config.get('active');

export const command = 'status';
export const desc = 'List the installed Payara environments, and which one is selected';

export const listPackages = handler => {
  return fs.readdirSync(directory).filter((dir) => {
    if (fs.existsSync(path.resolve(directory, dir , 'appserver', 'glassfish', 'domains', 'domain1'))) {
      return handler(dir);
    }
    return false;
  });
};

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Available Payara environments:');
  listPackages(pkg => {
    if (pkg === active) {
      console.log(pkg + ' (active)')
    } else {
      console.log(pkg);
    }
  });
};