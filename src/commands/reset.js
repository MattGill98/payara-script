/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import config from '../config';
import os from 'os';
import { ncp } from 'ncp';
import fs from 'promise-fs';
import {mkdtempSync} from 'fs';
import rimraf from 'rimraf';
import { handleError } from '../util/error';
import { builder as asadminBuilder } from './asadmin';
import path from 'path';
import globals from '../util/globals';
import extract from 'progress-extract';
const kill = require('./kill').handler;

export const command = 'reset';
export const desc = 'Reset a Payara environment to a fresh install';

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
      fs.readdir(data.temp)
        .then(contents => {
          let variableDirName = path.resolve(data.temp, contents[0]);
          ncp(variableDirName, data.explode, err => {
            if (err) {
              throw err;
            }
            console.log('Extract completed!');
            rimraf(data.temp, handleError('Unable to delete temp directory'));
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
  rimraf(findData(dir).explode, err => {
    if (err) {
      handleError('Unable to delete install directory')(err);
    } else {
      // Extract the ZIP
      unzip(dir);
    }
  });
};