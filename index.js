const fetch = require('node-fetch')

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
    difference: to - from,
    differenceInPercentage: (to - from) / from * 100
  }
}

const messageHub = {
  true: [
    `It looks like you are €{difference} richer from yesterday, you should probably buy Chad and Bruno lunch.`,
    `We always believed in you guys, but now we are {differenceInPercentage}% more confident in you`,
    `Bitcoin is up from yesterday by €{difference}, it might be time to start thinking about your ferrari colour. By the way, we want rides to work.`,
  ],
  false: [
    `We hate to say it, but we told you so. Today's price is down €{difference}. SHRUG GUY HERE PLEASE ! ! ! !`,
    `So you're only down {differenceInPercentage}% right now, you should probably sell before it's too late.`,
    `Bitcoin is down by €{difference}, but it's not too late in the Chuno coin. Just leave €10 on Chad or Bruno's desk.`,
  ]
}

const getMessage = dayComparison => {
  const { isIncresing } = dayComparison
  const messages = messageHub[isIncresing];
  return messages[Math.floor(Math.random() * messages.length)];
}

const sendMessage = message => {
  const SLACK_TOKEN = process.env.SLACK_TOKEN;
  if (!SLACK_TOKEN) throw new Error('SLACK_TOKEN environment variable must be set');

  const channel = 'D0E1PSETV'

  return fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: new fetch.Headers({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SLACK_TOKEN}`
    }),
    body: JSON.stringify({
      channel,
      text: message,
      as_user: false,
      icon_url: 'https://pbs.twimg.com/profile_images/3229463130/e0d6795b663a81fa7657383ee128b624.jpeg',
      username: 'Bitcoin Expert'
    })
  })
}

getLastMonth()
  .then(getLastTwoDays)
  .then(compareTwoDays)
  .then(getMessage)
  .then(sendMessage)
  .then(response => response.json())
  .then(console.log)
