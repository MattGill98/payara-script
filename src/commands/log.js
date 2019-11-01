/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import path from 'path';
import { Tail } from 'tail';
import config from '../config';
import { builder as asadminBuilder } from '../util/asadmin';
import globals from '../util/globals';

// Command Details
export const command = 'log';
export const desc = 'Follow the Payara log';

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv => asadminBuilder(argv);

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Following the Payara log...');
  let logFile = path.resolve(
    config.get('directory'),
    config.get('active').toString(),
    globals.UNZIP_NAME,
    'glassfish',
    'domains',
    'domain1',
    'logs',
    'server.log'
  );
  try {
    let tail = new Tail(logFile, {
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
    console.log('Server log not found.');
  }
};