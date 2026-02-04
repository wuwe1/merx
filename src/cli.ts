#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import render from './commands/render'

const main = defineCommand({
  meta: {
    name: 'merx',
    version: '0.1.0',
    description: 'Beautiful Mermaid diagrams from the terminal'
  },
  subCommands: {
    render
  }
})

runMain(main)
