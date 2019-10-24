#!/usr/bin/env node
import yargs from 'yargs';
import 'regenerator-runtime/runtime';

yargs
    .usage('Usage: $0 <command> [options]')
    .commandDir('commands')
    .help()
    .demandCommand()
    .strict()
    .argv;