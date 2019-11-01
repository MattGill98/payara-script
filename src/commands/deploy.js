/**
 * Import Yargs type definitions
 * 
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import asadmin, { builder as asadminBuilder } from '../util/asadmin';
import path from 'path';

// Command Details
export const command = 'deploy <app>';
export const desc = 'Deploy an application to the running Payara instance';

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv => asadminBuilder(argv);

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Deploying Payara Server...');
  asadmin('deploy', '--force', '--name', 'app', '--contextroot', '/', path.resolve(argv.app));
};