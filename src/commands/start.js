/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import asadmin, { builder as asadminBuilder } from '../util/asadmin';

// Command Details
export const command = 'start';
export const desc = 'Start the Payara instance';

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv => asadminBuilder(argv)
  .option('debug', {
    alias: 'd',
    type: 'boolean',
    description: 'Start the server in debug mode.',
    default: true
  });

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Starting Payara Server...');
  var domainArgs = [];
  if (argv.debug) {
    domainArgs.push('--debug');
  }
  asadmin('start-domain', domainArgs);
};
