/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import config from '../config';
import { listPackages } from './status';
import fs from 'fs';
import path from 'path';
import extract from 'progress-extract';
import url from 'mvn-artifact-url';
import download from '../util/download';

export const command = 'install [options] <artifact>';
export const desc = 'Install a Payara environment from Maven';

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv => 
  argv
    .help()
    .check(argv => {
      argv.name = argv.artifact.toString();
      if (listPackages().includes(argv.name)) {
        throw 'Artifact with that name already installed.';
      }
      return true;
    })
    .option('name', {
      alias: 'n',
      type: 'String',
      description: 'The name to assign to the artifact'
    });

export const extractZip = source => {
  extract(source, path.dirname(source)).then(() => {
    console.log('Extract completed.');
  })
  .catch(e => {
    console.error('Failed to extract artifact.');
    console.error(e);
  });
};

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log('Installing Payara environment...');
  // Find the directory to install to and create it
  let packageDir = path.resolve(config.get('directory'), argv.name.toString());
  try {
    fs.mkdirSync(packageDir);
  } catch (e) {}

  // Calculate the URL for the artifact
  url({
    groupId: 'fish.payara.distributions',
    artifactId: 'payara',
    version: argv.artifact,
    extension: 'zip'
  })
  // Download from the resolved URL
  .then(resolved => {
    download(resolved, packageDir)
      .catch(e => {
        console.error('Download failed');
        console.error(e);
      })
      .then(path => {
        console.log('Downloaded Payara from maven.');
        extractZip(path);
      });
  });
};