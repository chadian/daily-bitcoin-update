jest.mock('fs')

const path = require('path')
const getMessages = require('./load-from-local-json')

// Mocked values
const increasing = '["Hello World", "Increased"]'
const decreasing = '["Aloha World", "Decreased"]'

describe('Local JSON loader', () => {
  beforeEach(() => {
    // mocks files to be read during tests
    require('fs').__setMockFiles({
      [path.join(__dirname, '../messages/increasing.json')]: increasing,
      [path.join(__dirname, '../messages/decreasing.json')]: decreasing
    })
  })

  it('loads increasing messages when isIncreasing is true', () => {
    const promise = getMessages({ isIncreasing: true })

    expect(promise).resolves.toEqual(['Hello World', 'Increased'])
  })

  it('loads decreasing messages when isIncreasing is false', () => {
    const promise = getMessages({ isIncreasing: false })

    expect(promise).resolves.toEqual(['Aloha World', 'Decreased'])
  })
})
