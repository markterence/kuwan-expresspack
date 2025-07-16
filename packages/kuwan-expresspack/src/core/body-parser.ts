import express from 'express'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { resolveAppPaths } from '../lib/resolveAppPaths'
import type { NextHandleFunction } from '../types'

type JSONOptions = Parameters<typeof express.json>[0]
type URLEncodedOptions = Parameters<typeof express.urlencoded>[0]

export type BodyParserConfig = {
  json?: JSONOptions
  urlencoded?: URLEncodedOptions
}

let userConfig: BodyParserConfig = {}

/**
 * @private 
 * Loads the body-parser configuration from the app's config directory.
 */
export async function loadBodyParserConfig(root: string = process.cwd()) {
  const appPaths = resolveAppPaths(root);
  const { 
    bodyParserFile
  } = appPaths.config;
  
  if (!existsSync(bodyParserFile)) return

  const mod = await import(bodyParserFile)
  userConfig = mod.default
}

export function defineConfig(config: BodyParserConfig) {
  return config
}

export function jsonBodyParser() : NextHandleFunction {
  // return express.json(userConfig.json)
  return express.json()
}

export function urlencodedBodyParser(): NextHandleFunction  {
  // return express.urlencoded(userConfig.urlencoded)
   return express.urlencoded()
}
