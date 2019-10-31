/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 * @typedef {import('mvn-artifact-url').Artifact} Artifact
 */
import config from '../config';
import { listPackages } from './status';
import { handleError } from '../util/error';
import fs from 'promise-fs';
import rimraf from 'rimraf';
import path from 'path';
import globals from '../util/globals';
import url from 'mvn-artifact-url';
import download, { exists } from '../util/download';
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

const repositories = [
  undefined,
  'https://nexus.payara.fish/service/local/repositories/payara-patches/content/',
  'https://nexus.payara.fish/service/local/repositories/payara-staging/content/'
];

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
      /**
       * The artifact to download
       * @type Artifact
       */
      let artifact = {
        groupId: 'fish.payara.distributions',
        artifactId: 'payara',
        version: argv.name,
        extension: 'zip'
      };

      let urls = repositories.map(repository => url(artifact, repository));

      // Resolve all URLs to download from
      Promise.all(urls).then(resolvedUrls => {

        // Get the first promised URL that can be downloaded by inverting the promises
        var invertedPromiseList = resolvedUrls
          .map(resolvedUrl => exists(resolvedUrl))
          .map(promise => promise.then(result => Promise.reject(result), err => Promise.resolve(err)));

        // Break on early exiting promise
        Promise.all(invertedPromiseList)
            .then(statusCodes => {
              if (statusCodes.includes(401)) {
                console.error('Nexus authentication failed.');
              } else {
                console.error('Artifact not found.');
              }
              rimraf(dir, () => {});
            })
            .catch(resolved => {
              // Download the artifact
              download(resolved, dir).then(artifact => {
                console.log('Downloaded Payara from maven.');
                // Rename the ZIP
                fs.rename(artifact, path.resolve(dir, globals.ZIP_NAME))
                  .then(() => {
                    // Unzip the artifact
                    unzip(dir);
                  })
                  .catch(handleError('Failed to rename ZIP file'));
              })
              .catch(handleError('Download failed', () => rimraf(dir, () => {})))
            })
      });
    })
    .catch(handleError('Failed to create directory for artifact'));
};