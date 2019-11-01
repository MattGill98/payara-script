/**
 * @typedef {import('yargs').Arguments} Arguments
 */
import asadmin, { builder as asadminBuilder } from '../util/asadmin';

export const command = 'restart';
export const desc = 'Restart the running Payara instance';

export const builder = argv => asadminBuilder(argv);

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Restarting Payara Server...');
  asadmin('restart-domain');
};