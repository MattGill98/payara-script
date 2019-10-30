/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import config from '../config';
import { listPackages } from './status';
import { handleError } from '../util/error';
const fs = require('fs').promises;
import path from 'path';
import globals from '../util/globals';
import url from 'mvn-artifact-url';
import download from '../util/download';
import { unzip } from './reset';

export const command = 'install <name>';
export const desc = 'Install a Payara environment from Maven';

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv => 
  argv
    .help()
    .check(argv => {
      if (listPackages().includes(argv.name)) {
        throw 'That version is already installed.';
      }
      return true;
    });

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Installing Payara environment...');

  // Get install directory
  let dir = path.resolve(config.get('directory'), argv.name.toString());

  // Create the install directory
  fs.mkdir(dir)
    .then(() => {
      // Resolve the artifact URL
      url({
        groupId: 'fish.payara.distributions',
        artifactId: 'payara',
        version: argv.name,
        extension: 'zip'
      })
        .then(resolved => {
          // Download the artifact
          download(resolved, dir)
            .then(artifact => {
              console.log('Downloaded Payara from maven.');
              // Rename the ZIP
              fs.rename(artifact, path.resolve(dir, globals.ZIP_NAME))
                .then(() => {
                  // Unzip the artifact
                  unzip(dir);
                }, handleError('Failed to rename ZIP file'));
            }, handleError('Download failed'))
        }, handleError('Failed to resolve artifact'));
    }, handleError('Failed to create directory for artifact'));
};