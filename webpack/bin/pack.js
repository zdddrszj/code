#! /usr/bin/env node
const path = require('path')
const fs = require('fs')
const root = process.cwd()
const options = require(path.join(root, 'webpack.config.js'))
const Compiler = require('../lib/Compiler')

let compiler = new Compiler(options)

compiler.run()