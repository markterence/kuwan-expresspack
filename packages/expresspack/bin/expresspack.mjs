#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import path from "node:path";
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);

const main = defineCommand({
    meta: {
        name: "expresspack",
        version: "1.0.0"
    },
    subCommands: {
        auth: () => defineCommand({
            async run({ rawArgs }) {
                console.log("Running auth command with args:", rawArgs);
                const originalArgv = process.argv;
                rawArgs.push(...[
                    '--output',
                    path.join(
                        'src', 'db', 'auth_migrations',
                        dayjs().utc().format('YYYY-MM-DDTHH-mm-ss.SSS') + '.sql'
                    ),
                ])
                process.argv = ['node', 'better-auth',
                    ...rawArgs];

                try {
                    // Import and execute better-auth CLI directly
                    await import('@better-auth/cli');
                } finally {
                    // Restore original argv
                    process.argv = originalArgv;
                }
            }
        })
    }
});

runMain(main);