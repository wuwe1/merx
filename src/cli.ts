#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'

const main = defineCommand({
  meta: {
    name: 'merx',
    version: '0.1.0',
    description: 'Beautiful Mermaid diagrams from the terminal'
  },
  run() {
    console.log('Merx CLI - coming soon!')
  }
})

runMain(main)
