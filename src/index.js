#!/usr/bin/env node
import yargs from 'yargs';
import 'regenerator-runtime/runtime';

yargs
    .scriptName('payara')
    .usage('Usage: payara <command> [options]')
    .commandDir('commands')
    .help()
    .demandCommand()
    .strict()
    .parse();