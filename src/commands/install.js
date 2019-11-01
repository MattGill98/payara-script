/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 * @typedef {import('mvn-artifact-url').Artifact} Artifact
 */
import fs from 'fs';
import url from 'mvn-artifact-url';
import path from 'path';
import rimraf from 'rimraf';
import config from '../config';
import download, { exists } from '../util/download';
import { handleError } from '../util/error';
import globals from '../util/globals';
import { copyFile, mkdir, rename } from '../util/promise-fs';
import { unzip } from './reset';
import { listPackages } from './status';

// Command Details
export const command = 'install [options] <artifact>';
export const desc = 'Install a Payara ZIP';

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv => 
  argv
    .help()
    .check(async argv => {
      // If the selected artifact is a file
      if (isLocalFile(argv.artifact)) {
        argv.artifact = path.resolve(argv.artifact.toString());
        // Default the name to 'local'
        if (!argv.name) {
          argv.name = 'local'
        }
      } else {
        // Assume the artifact is a version
        argv.name = argv.artifact;
      }
      if ((await listPackages()).includes(argv.name)) {
        throw 'That artifact is already installed.';
      }
      return true;
    })
    .option('name', {
      alias: 'n',
      description: 'The name of the installation folder'
    })
    .example('$0 install 5.191', 'Install Payara version 5.191 from maven central.')
    .example('$0 install 5.193.RC3', 'Install Payara version 5.193.RC3 from the Payara nexus. Requires that the nexus credentials be configured via \'payara set\'.')
    .example('$0 install --name local /path/to/jar', 'Install a local Payara ZIP and call it \'local\'.');

// Check if the provided option is referencing a local file
function isLocalFile(location) {
  return fs.existsSync(location.toString()) || fs.existsSync(path.resolve(location.toString()));
}

// A list of repositories to try and download from
const repositories = [
  undefined,
  'https://nexus.payara.fish/service/local/repositories/payara-patches/content/',
  'https://nexus.payara.fish/service/local/repositories/payara-staging/content/'
];

// Get configured nexus credentials
const username = config.get('username');
const password = config.get('password');

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Installing Payara environment...');

  // Get install directory
  let dir = path.resolve(config.get('directory'), argv.name.toString());

  // Delete the install directory if it exists
  rimraf(dir, () => {
    // Create the install directory
    mkdir(dir)
      .then(() => {
        // If the artifact is a local file
        if (fs.existsSync(argv.artifact)) {
          // Copy the ZIP
          copyFile(argv.artifact, path.resolve(dir, globals.ZIP_NAME))
            .then(() => {
              // Unzip the artifact
              unzip(dir);
            })
            .catch(handleError('Failed to rename ZIP file'));
        } else {
          /**
           * The artifact to download
           * @type Artifact
           */
          let artifact = {
            groupId: 'fish.payara.distributions',
            artifactId: 'payara',
            version: argv.artifact,
            extension: 'zip'
          };

          let urls = repositories.map(repository => url(artifact, repository));
  
          // Resolve all URLs to download from
          Promise.all(urls).then(resolvedUrls => {
    
            // Get the first promised URL that can be downloaded by inverting the promises
            var invertedPromiseList = resolvedUrls
              .map(resolvedUrl => exists(resolvedUrl, username, password))
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
                  download(resolved, dir, username, password).then(artifact => {
                    console.log('Downloaded Payara from maven.');
                    // Rename the ZIP
                    rename(artifact, path.resolve(dir, globals.ZIP_NAME))
                      .then(() => {
                        // Unzip the artifact
                        unzip(dir);
                      })
                      .catch(handleError('Failed to rename ZIP file'));
                  })
                  .catch(handleError('Download failed', () => rimraf(dir, () => {})));
                });
          });
        }
      }).catch(handleError('Failed to create directory for artifact'));
  });
};