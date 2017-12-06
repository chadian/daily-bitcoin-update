const path = require('path')
const fs = require('fs')

function fetchFromFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, content) => {
      if (err) {
        return reject(err)
      }

      resolve(content)
    })
  })
}

function json(content) {
  return new Promise((resolve, reject) => {
    try {
      resolve(JSON.parse(content))
    } catch (err) {
      reject(err)
    }
  })
}

const increasing = path.join(__dirname, '../messages/increasing.json')
const decreasing = path.join(__dirname, '../messages/decreasing.json')

module.exports = function getMessages(daysComparison) {
  const inputPath = daysComparison.isIncreasing ? increasing : decreasing

  return fetchFromFile(inputPath).then(json)
}
