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
    }
});

runMain(main);