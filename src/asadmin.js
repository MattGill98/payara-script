#!/usr/bin/env node
import yargs from 'yargs';
import 'regenerator-runtime/runtime';
import asadmin, { builder as asadminBuilder } from './util/asadmin';

let asadminIndex = process.argv.indexOf(process.argv.find(arg => arg.match(/.+asadmin/)));

// Don't parse any arguments after asadmin
process.argv.splice(asadminIndex + 1, 0, '--');

asadminBuilder(yargs
  .scriptName('asadmin')
  .usage('$0 <command>'))
  .help(false)
  .demandCommand(1)
  .parse();

asadmin(...process.argv.slice(asadminIndex + 2));