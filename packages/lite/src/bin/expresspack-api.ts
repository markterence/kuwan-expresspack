#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import path from "node:path";
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc.js";
import {execa} from 'execa';
dayjs.extend(utc);

const main = defineCommand({
    meta: {
        name: "expresspack-api",
        version: "1.0.0"
    },
    subCommands: {

        'db-pull': () => defineCommand({
            async run({ rawArgs }) {
                console.log("Running db-pull command with args:", rawArgs);
                const __filename = fileURLToPath(import.meta.url);
                const __dirname = dirname(__filename);

                const drizzleBin = resolve(__dirname, path.join('..', '..', 'node_modules', '.bin', 'drizzle-kit'));
                const options = {stdout: ['pipe', 'inherit']} as const;
                // @ts-ignore
                await execa(options)`${drizzleBin} pull ${rawArgs.join(' ')}` 
            }
        }),

        'config-typegen': () => defineCommand({
            meta: {
                name: "config-typegen",
                description: "Generate TypeScript definitions for files in the config directory",
            },
            args: {
                configDir: {
                    type: 'string',
                    alias: 'c',
                    description: 'Path of the `config` folder',
                    default: path.join('./', 'src', 'config'),
                },
                output: {
                    type: 'string',
                    alias: 'o',
                    description: 'Output directory for the generated types',
                    required: true
                }
            },
            async run({ args }) { 
                
                if (!args?.output) {
                    console.error('Error: Output directory is required. Use -o or --output to specify the path.');
                    process.exit(1);
                }
 
                const { default: configTypegenCmd } = await import('../lib/config-typegen-cmd');
                await configTypegenCmd({
                    configDir: args.configDir as string,
                    output: args.output as string,
                    cwd: process.cwd()
                });
            }
        })
    }
});

runMain(main);