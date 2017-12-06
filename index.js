const fetch = require('node-fetch')

const getLocalJsonMessage = require('./src/load-from-local-json')
const { getSingleMessage } = require('./src/base-message-loader')

const getLastMonth = () =>
  fetch(
    'https://api.coindesk.com/v1/bpi/historical/close.json?currency=EUR'
  ).then(response => response.json())

const getLastTwoDays = lastMonth => {
  const { bpi } = lastMonth
  const [yesterday, dayBefore] = Object.keys(bpi).reverse()

  return [bpi[dayBefore], bpi[yesterday]]
}

const compareTwoDays = days => {
  const [from, to] = days

  return {
    from,
    to,
    isIncresing: to > from,
    difference: (to - from).toFixed(2),
    differenceInPercentage: ((to - from) / from * 100).toFixed(2)
  }
}

const sendMessage = message => {
  const SLACK_TOKEN = process.env.SLACK_TOKEN
  if (!SLACK_TOKEN)
    throw new Error('SLACK_TOKEN environment variable must be set')

  const channel = 'D0E1PSETV'

  return fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: new fetch.Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SLACK_TOKEN}`
    }),
    body: JSON.stringify({
      channel,
      text: message,
      as_user: false,
      icon_url:
        'https://pbs.twimg.com/profile_images/3229463130/e0d6795b663a81fa7657383ee128b624.jpeg',
      username: 'Bitcoin Expert'
    })
  })
}

getLastMonth()
  .then(getLastTwoDays)
  .then(compareTwoDays)
  .then(getSingleMessage(getLocalJsonMessage))
  .then(sendMessage)
  .then(response => response.json())
  .then(console.log)
  .catch(console.error)
