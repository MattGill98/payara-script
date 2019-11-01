#!/usr/bin/env node

process.argv.pop();

process.argv.push('payara');

process.argv.push('asadmin');

require('./index');