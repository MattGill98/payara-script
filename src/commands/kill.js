/**
 * @typedef {import('yargs').Argv} Argv
 * @typedef {import('yargs').Arguments} Arguments
 */
import ps from 'find-process';

// Command Details
export const command = 'kill';
export const desc = 'Kills all Payara processes';

/**
 * @return {Promise<Array>} a promise that resolves to a list of all running Payara processes
 */
async function listProcesses() {
  return ps('name', /java.+glassfish.jar/);
}

/**
 * @return {boolean} a promise that resolves to whether there is a Payara instance running or not
 */
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