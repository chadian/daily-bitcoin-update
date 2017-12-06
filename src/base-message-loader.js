const template = require('string-template')

const getRandom = entries => {
  return entries[Math.floor(Math.random() * entries.length)]
}

const getSingleMessage = getMessages => daysComparison => {
  return getMessages(daysComparison).then(messages => {
    const message = getRandom(messages)
    return template(message, daysComparison)
  })
}

module.exports = {
  getSingleMessage
}
