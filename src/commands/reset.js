/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import { mkdtempSync } from 'fs';
import { ncp } from 'ncp';
import os from 'os';
import path from 'path';
import extract from 'progress-extract';
import rmfr from 'rmfr';
import config from '../config';
import { builder as asadminBuilder } from '../util/asadmin';
import { handleError } from '../util/error';
import globals from '../util/globals';
import { readdir } from '../util/promise-fs';
const kill = require('./kill').handler;

// Command Details
export const command = 'reset';
export const desc = 'Reset a Payara environment';

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv => asadminBuilder(argv);

function findData(packageDir) {
  return {
    zip: path.resolve(packageDir, globals.ZIP_NAME),
    temp: mkdtempSync(path.resolve(os.tmpdir(), 'payara/')),
    explode: path.resolve(packageDir, globals.UNZIP_NAME)
  };
};

export const unzip = packageDir => {
  let data = findData(packageDir);
  extract(data.zip, data.temp)
    .then(() => {
      readdir(data.temp)
        .then(contents => {
          let variableDirName = path.resolve(data.temp, contents[0]);
          ncp(variableDirName, data.explode, err => {
            if (err) {
              throw err;
            }
            console.log('Extract completed!');
            rmfr(data.temp).catch(handleError('Unable to delete temp directory'));
          });
        })
        .catch(handleError('Failed to read from extracted directory'));
    })
    .catch(handleError('Failed to extract artifact'));
};

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  kill();
  console.log('Resetting Payara environment...');

  // Find the active package directory
  let dir = path.resolve(config.get('directory'), config.get('active').toString());

  // Delete the exploded dir
  rmfr(findData(dir).explode)
    .then(() => unzip(dir))
    .catch(handleError('Unable to delete install directory'));
};