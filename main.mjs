#!/usr/bin/env node

import CLI from './api/cli.js';
var cli = new CLI();

// Read the command line and execute
if (cli.validateOptions())
	cli.execute();
