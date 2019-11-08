/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import path from 'path';
import config from '../config';
import { builder as asadminBuilder } from '../util/asadmin';
import {handleError} from '../util/error';
import globals from '../util/globals';
import fs from 'fs';

// Command Details
export const command = 'domain';
export const desc = 'Print the payara domain.xml';

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv => asadminBuilder(argv);

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Printing the domain.xml...');
  let domainXml = path.resolve(
    config.get('directory'),
    config.get('active').toString(),
    globals.UNZIP_NAME,
    'glassfish',
    'domains',
    'domain1',
    'config',
    'domain.xml'
  );
  fs.readFile(domainXml, 'utf8', handleError('Error reading domain.xml', console.log));
};