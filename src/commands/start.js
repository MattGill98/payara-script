/**
 * @typedef {import('yargs').Arguments} Arguments
 */
import { asadmin, builder as asadminBuilder } from './asadmin';

export const command = 'start';
export const desc = 'Start the running Payara instance';

export const builder = argv => asadminBuilder(argv);

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Starting Payara Server...');
  asadmin('start-domain');
};