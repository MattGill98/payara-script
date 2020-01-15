/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import fs from 'fs';
import path from 'path';
import rimraf from 'rmfr';
import config from '../config';
import { handleError } from '../util/error';
import { install } from './install';
import { listPackages } from './status';

// Command Details
export const command = 'set [option] <value>';
export const desc = 'Configure the active Payara environment';

const gitDir = path.join(config.get('directory').toString(), 'git');

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
    .command('password <value>', 'Configure the nexus password', () => {}, configureVariable('password', 'Password'))
    .command('dev <value>', 'Configure the location of the Payara Git repo',
        argv => argv
            .coerce('value', val => val === 'null' ? undefined : path.resolve(val))
            .check(({value}) => { if (value && !fs.existsSync(path.join(value.toString(), 'appserver', 'distributions', 'payara', 'target', 'stage'))) throw 'Invalid Payara Git repo'; return true }),
        argv => {
          let value = argv.value;
          if (value) {
            configureVariable('git', 'Payara Git directory')(argv);
            install(path.resolve(value.toString(), 'appserver', 'distributions', 'payara', 'target', 'payara.zip'), 'git', true);
          } else {
            rimraf(gitDir)
              .then(() => configureVariable('git', 'Payara Git directory')(argv))
              .catch(handleError('Error unlinking git repo'));
          }
        });

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
