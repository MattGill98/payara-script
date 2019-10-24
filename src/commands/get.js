/**
 * @typedef {import('yargs').Arguments} Arguments
 */
import config from '../config';

export const command = 'get';
export const desc = 'Get credentials';

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log(JSON.stringify(config.all, null, 2));
};