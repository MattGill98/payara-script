#!/usr/bin/env node

let commandIndex = process.argv.findIndex(argument => argument.includes('/bin/asadmin'));
process.argv.splice(commandIndex + 1, 0, 'asadmin');

require('./index');