#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import render from './commands/render'
import themes from './commands/themes'
import init from './commands/init'
import { setupErrorHandler } from './utils/errors'

// Setup global error handler before running main
setupErrorHandler()

const main = defineCommand({
  meta: {
    name: 'merx',
    version: '0.1.0',
    description: 'Beautiful Mermaid diagrams from the terminal'
  },
  subCommands: {
    render,
    themes,
    init
  }
})

runMain(main)
