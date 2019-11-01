#!/usr/bin/env node
import yargs from 'yargs';
import 'regenerator-runtime/runtime';
import asadmin, { builder as asadminBuilder } from './util/asadmin';

var argv = asadminBuilder(yargs
    .scriptName('asadmin')
    .usage('Usage: asadmin <command>')
    .strict())
    .parse();

asadmin(argv.command);