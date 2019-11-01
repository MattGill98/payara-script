/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import asadmin, { builder as asadminBuilder } from '../util/asadmin';
import path from 'path';

// Command Details
export const command = 'deploy <app>';
export const desc = 'Deploy an application';

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv => asadminBuilder(argv)
  .example('$0 deploy /path/to/app.war', 'Deploys the application from the given path. ' +
    'The application will be forcefully deployed with the name \'app\' and the context root \'/\'.')
  .coerce('app', app => path.resolve(app));

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Deploying Payara Server...');
  asadmin('deploy', '--force', '--name', 'app', '--contextroot', '/', argv.app);
};