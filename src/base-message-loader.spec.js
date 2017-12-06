const { getSingleMessage } = require('./base-message-loader')

describe('Base Message Loader', () => {
  describe('#getSingleMessage', () => {
    it('fetches one message making a comment about bitcoins', () => {
      const message = () => Promise.resolve(['Bitcoin price increased'])
      const subject = getSingleMessage(message)
      const fixture = {
        isIncreasing: true
      }

      expect(subject(fixture)).resolves.toBe('Bitcoin price increased')
    })

    it('fetches a message that contains informations about current bitcoin status', () => {
      const message = () =>
        Promise.resolve(['Bitcoin price decreased by €{difference}'])
      const subject = getSingleMessage(message)
      const fixture = {
        isIncreasing: false,
        difference: -150.2
      }

      expect(subject(fixture)).resolves.toBe(
        'Bitcoin price decreased by €-150.2'
      )
    })

    it('throws an error if something fails', () => {
      const message = () => Promise.reject()
      const subject = getSingleMessage(message)
      const fixture = {
        isIncreasing: false
      }

      expect(subject(fixture)).rejects.toThrowError()
    })
  })
})
