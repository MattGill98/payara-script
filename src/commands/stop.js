/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import asadmin, { builder as asadminBuilder } from '../util/asadmin';

// Command Details
export const command = 'stop';
export const desc = 'Stop the running Payara instance';

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv => asadminBuilder(argv);

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Stopping Payara Server...');
  asadmin('stop-domain');
};