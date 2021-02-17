/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 * @typedef {import('mvn-artifact-url').Artifact} Artifact
 */
import fs from 'fs';
import url from 'mvn-artifact-url';
import path from 'path';
import rmfr from 'rmfr';
import config from '../config';
import download, { exists } from '../util/download';
import { handleError } from '../util/error';
import globals from '../util/globals';
import { copyFile, mkdir, rename, symlink } from '../util/promise-fs';
import { unzip } from './reset';
import { listPackagesSync } from './status';

// Command Details
export const command = 'install [options] <artifact>';
export const desc = 'Install a Payara ZIP';

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv => 
  argv
    .help()
    .check(argv => {
      if (!argv.name) {
        // If the selected artifact is a file
        if (isLocalFile(argv.artifact)) {
          argv.artifact = path.resolve(argv.artifact.toString());
          // Default the name to 'local'
          argv.name = 'local'
        } else {
          // Assume the artifact is a version
          argv.name = argv.artifact;
        }
      }
      if (listPackagesSync().includes(argv.name)) {
        throw 'That artifact is already installed.';
      }
      return true;
    })
    .option('name', {
      alias: 'n',
      description: 'The name of the installation folder'
    })
    .option('profile', {
      alias: 'p',
      description: 'The Payara profile to download',
      choices: ['web']
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
  'https://nexus.payara.fish/service/local/repositories/payara-patches/',
  'https://nexus.payara.fish/service/local/repositories/payara-staging/',
  'https://nexus.payara.fish/service/local/repositories/payara-enterprise/'
];

// Get configured nexus credentials
const username = config.get('username');
const password = config.get('password');

export function install(artifact, name, linkZip, profile) {
  console.log('Installing Payara environment...');

  // Get install directory
  let dir = path.resolve(config.get('directory'), name.toString());

  // Delete the install directory if it exists
  rmfr(dir).then(() => {
    // Create the install directory
    mkdir(dir)
      .then(() => {
        // If the artifact is a local file
        if (fs.existsSync(artifact)) {
          if (linkZip) {
            // Link to the ZIP
            symlink(artifact, path.resolve(dir, globals.ZIP_NAME))
              .then(() => unzip(dir))
              .catch(handleError('Failed to rename ZIP file'));
          } else {
            // Copy the ZIP
            copyFile(artifact, path.resolve(dir, globals.ZIP_NAME))
              .then(() => unzip(dir))
              .catch(handleError('Failed to rename ZIP file'));
          }
        } else {
          /**
           * The artifact to download
           * @type Artifact
           */
          let artifactCoordinates = {
            groupId: 'fish.payara.distributions',
            artifactId: 'payara' + (profile? '-' + profile : ''),
            version: artifact,
            extension: 'zip'
          };

          let urls = repositories.map(repository => url(artifactCoordinates, repository));
  
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
                  rmfr(dir);
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
                  .catch(handleError('Download failed', () => rmfr(dir)));
                });
          });
        }
      }).catch(handleError('Failed to create directory for artifact'));
  });
}

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  install(argv.artifact, argv.name, false, argv.profile);
};
