/**
 * @typedef {import('yargs').Arguments} Arguments
 */
import config from '../config';
import path from 'path';
import { builder as asadminBuilder } from './asadmin';
import { Tail } from 'tail';
import globals from '../util/globals';

export const command = 'log';
export const desc = 'Follow the Payara log';

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