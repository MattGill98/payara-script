/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import { existsSync } from 'fs';
import path from 'path';
import { Tail } from 'tail';
import config from '../config';
import { builder as asadminBuilder } from '../util/asadmin';
import { handleError } from '../util/error';
import globals from '../util/globals';

// Command Details
export const command = 'log [instance]';
export const desc = 'Follow the Payara log';

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv => asadminBuilder(argv)
  .example('$0', 'Follow the server log')
  .example('$0 instance1', 'Follow the server log for instance1');

async function followFile(file) {
  try {
    let tail = new Tail(file, {
      fromBeginning: true,
      follow: true
    });
    tail.on('line', (data) => {
      console.log(data)  
    });
    tail.on('error', (err) => {
      console.log(err)  
    });
  } catch {
    throw new Error('File not found.');
  }
}

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {

  // Find the referenced log file
  var dirBuilder = path.resolve(config.get('directory'), config.get('active').toString(), globals.UNZIP_NAME, 'glassfish');
  if (argv.instance) {
    dirBuilder = path.resolve(dirBuilder, 'nodes', 'localhost-domain1', argv.instance);
    if (!existsSync(dirBuilder)) {
      console.error(`Instance ${argv.instance} not found.`);
      return;
    }
    console.log('Following the instance log...');
  } else {
    dirBuilder = path.resolve(dirBuilder, 'domains', 'domain1');
    console.log('Following the Payara log...');
  }
  dirBuilder = path.resolve(dirBuilder, 'logs', 'server.log');

  followFile(dirBuilder)
    .catch(handleError('Error reading server log.'));
};