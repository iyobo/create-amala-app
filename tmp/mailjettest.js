const mailjet = require('node-mailjet').connect(
  '22afb947aeae0f494fc1df612b3f0e9c',
  '531805d43aefc654d91880b39b6d567e',
)
const request = mailjet.post('send', { version: 'v3.1' }).request({
  Messages: [
    {
      From: {
        Email: 'hello@amable.io',
        Name: 'Iyobo',
      },
      To: [
        {
          Email: 'hello@amable.io',
          Name: 'Iyobo',
        },
      ],
      Subject: 'Greetings from Mailjet.',
      TextPart: 'My first Mailjet email',
      HTMLPart:
        "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      CustomID: 'AppGettingStartedTest',
    },
  ],
})
request
  .then((result) => {
    console.log(result.body)
  })
  .catch((err) => {
    console.log(err.statusCode)
  })
