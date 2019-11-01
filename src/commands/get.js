/**
 * @typedef {import('yargs').Arguments} Arguments
 */
import config from '../config';

// Command Details
export const command = 'get';
export const desc = 'Get script configuration';

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  console.log(JSON.stringify(config.all, null, 2));
};