/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import config from '../config';
import { listPackages } from './status';

// Command Details
export const command = 'set [option] <value>';
export const desc = 'Configure the active Payara environment';

/**
 * @param String name the name of the config variable
 */
function configureVariable(name, displayName = name) {
  return function({value}) {
    config.set(name, value);
    console.log(displayName + ' configured.');
  };
};

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv =>
  argv
    .help()
    .command('username <value>', 'Configure the nexus username', () => {}, configureVariable('username', 'Username'))
    .command('password <value>', 'Configure the nexus password', () => {}, configureVariable('password', 'Password'));

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = async argv => {
  listPackages().then(packages => {
    let valid = false;
    packages.forEach(pkg => {
      if (pkg == argv.value) {
        valid = true;
      }
    });
    if (valid) {
      configureVariable('active', 'Payara environment')(argv);
    } else {
      console.error('Invalid environment name')
    }
  });
};
