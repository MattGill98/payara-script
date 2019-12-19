/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import path from 'path';
import rmfr from 'rmfr';
import config from '../config';
import {handleError} from '../util/error';

// Command Details
export const command = 'uninstall <versions...>';
export const desc = 'Uninstall Payara versions';

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv => 
  argv
    .help()
    .example('$0 uninstall 5.191', 'Uninstall Payara version 5.191.')
    .example('$0 uninstall 5.193 5.191', 'Uninstall Payara versions 5.193 and 5.191.');

const baseDir = config.get('directory');

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Uninstalling Payara environments...');

  Promise.all(argv.versions
      .map(version => path.join(baseDir, version))
      .map(dir => rmfr(dir)))
    .then(() => console.log('Success!'))
    .catch(handleError('Unable to uninstall artifact'));
};