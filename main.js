/* Copyright (c) 2022 Read Write Tools. */
import CLI from './cli.js';

var cli = new CLI;

cli.validateOptions() && cli.execute();