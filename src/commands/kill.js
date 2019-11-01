/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import { builder as asadminBuilder } from './asadmin';
import ps from 'find-process';

export const command = 'kill';
export const desc = 'Kills all Payara processes';

/**
 * @param {Argv} argv the Yargs instance
 */
export const builder = argv => asadminBuilder(argv);

async function listProcesses() {
  return ps('name', /java.+glassfish.jar/);
}

export async function checkStatus() {
  var processes = await listProcesses();
  return processes && processes.length;
}

/**
 * @param {Arguments} argv the Yargs arguments
 */
export const handler = argv => {
  listProcesses().then(processes => {
    if (processes && processes.length) {
      console.log('Killing Payara processes...');
      processes.forEach(({pid}) => {
        process.kill(pid, 9);
        console.log(`Process ${pid} killed.`);
      });
    } else {
      console.error('No Payara processes found.')
    }
  })
};