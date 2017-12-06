'use strict'

const path = require('path')

const fs = jest.genMockFromModule('fs')

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null)
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null)
  for (const file in newMockFiles) {
    mockFiles[file] = newMockFiles[file]
  }
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readFile(directoryPath, options, cb) {
  if (!mockFiles[directoryPath]) {
    return cb(new Error('File not found'))
  }

  cb(null, mockFiles[directoryPath])
}

fs.__setMockFiles = __setMockFiles
fs.readFile = readFile

module.exports = fs
