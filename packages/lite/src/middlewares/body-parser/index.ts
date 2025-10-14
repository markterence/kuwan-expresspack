import express, { type Handler } from 'express'
import { getAppConfig } from '../../config'

export type JSONOptions = Parameters<typeof express.json>[0]
export type URLEncodedOptions = Parameters<typeof express.urlencoded>[0]
export type BodyParserConfig = {
    json?: JSONOptions
    urlencoded?: URLEncodedOptions
}

export function defineConfig(config: BodyParserConfig) {
    return config
}

export function jsonBodyParser(options?: JSONOptions): Handler {
    const config = getAppConfig('bodyParser') as BodyParserConfig
    if (config && config?.json) {
        return express.json(config?.json)
    }
    return express.json(options)
}

export function urlencodedBodyParser(options?: URLEncodedOptions): Handler {
    const config = getAppConfig('bodyParser') as BodyParserConfig
    if (config && config?.urlencoded) {
        return express.urlencoded(config?.urlencoded)
    }
    return express.urlencoded(options)
}
