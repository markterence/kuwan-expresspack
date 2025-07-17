# Development

This document outlines the development setup and guidelines for the Kuwan ExpressPack project.

## Requirements

- Node.js (version 20.0 or higher)
- Bun (version 1.2.18 or higher)
- pnpm 

## Installation

Project uses pnpm and pnpm-workspaces. Install dependencies using pnpm in the root directory:

```bash
pnpm install
```

## Running the Project

Running requires navigating to each packages directory in the terminal and running commands to watch, test or build.

### for kuwan-expresspack

```bash
cd packages/kuwan-expresspack

# This will run tsup in watch mode
pnpm dev
```

### Playground

the main package is linked to the playground, so watch and builds will reflect in the playground, just restart the server in the playground to see changes. 

Just open the `app.ts` file and save it even without changes to trigger Bun to restart the server.

```bash
cd playground
pnpm dev:bun
```

### Testing

To run tests, navigate to the `packages/kuwan-expresspack` directory and run:

```bash
pnpm test
```

This uses Vitest for testing and uses supertest for HTTP assertions, I don't have tests for the main code, but I test the server routes and middlewares if it starting and responding correctly using the `supertest` library.

To add tests, we had a whole app as a fixture in the `test/fixture` directory, so you can add your own routes and middlewares in the `test/fixture/` like how you would do in a real Express app, and then write tests in the `test/server.test.ts` or anywhere in the `test` directory.
