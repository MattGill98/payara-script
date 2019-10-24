/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import config from '../config';
import { listPackages } from './status';

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

export const handler = configureVariable('active', 'Payara environment');

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv => 
  argv
    .help()
    .check(({value}) => {
      let valid = false;
      listPackages(pkg => {
        if (pkg === value) {
          valid = true;
        }
      });
      if (!valid) {
        throw 'Invalid environment name.'
      }
      return true;
    })
    .command('username <value>', 'Configure the nexus username', () => {}, configureVariable('username', 'Username'))
    .command('password <value>', 'Configure the nexus password', () => {}, configureVariable('password', 'Password'));
