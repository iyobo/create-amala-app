import { IConfig } from './lib/configTypes'
import TwilioSMSAdapter from '../util/adapters/sms/TwilioSMSAdapter'
import SMTPMailAdapter from '../util/adapters/mail/SMTPMailAdapter'

const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 4004
const securityKeys = []
if (process.env.SECURITY_KEY_1) {
  securityKeys.push(process.env.SECURITY_KEY_1)
}
if (process.env.SECURITY_KEY_2) {
  securityKeys.push(process.env.SECURITY_KEY_2)
}
if (securityKeys.length === 0) {
  throw new Error('Please specify security keys in env file')
}

const isDebug = !process.env.NODE_ENV || process.env.NODE_ENV === 'dev'

const hostUrl = process.env.BASEURL || 'http://localhost:4004'

const config: IConfig = {
  appName: 'Amable',
  server: {
    port,
    hostUrl,
  },
  devMode: isDebug,
  log: {
    debug: isDebug,
    token: process.env.LOGGLY_KEY,
    subdomain: process.env.LOGGLY_SUBDOMAIN,
  },
  storage: {
    s3: {
      forcePathStyle: false, // Configures to use subdomain/virtual calling format.
      endpoint: process.env.S3_ENDPOINT,
      // region: "us-east-1",
      credentials: {
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
      },
    },
  },
  security: {
    issuer: 'amable.io',
    keys: securityKeys,
    cookies: {
      secure: false,
      signed: true,
      httpOnly: true,
    },
    crypto: {
      saltRounds: 8,
    },
  },
  geo: {
    google: {
      key: process.env.GOOGLE_MAPS_KEY,
    },
  },

  sms: {
    engine: {
      adapter: TwilioSMSAdapter,
      opts: {
        apiKey: process.env.SMS_TWILIO_KEY,
        apiSecret: process.env.SMS_TWILIO_SECRET,
      },
    },
    defaultFromPhone: process.env.SMS_DEFAULT_PHONE,
  },
  mail: {
    engine: {
      adapter: SMTPMailAdapter,
      opts: {
        host: process.env.MAIL_HOST,
        port: Number.parseInt(process.env.MAIL_PORT),
        username: process.env.MAIL_USERNAME,
        password: process.env.MAIL_PASSWORD,
        secure: process.env.MAIL_SECURE === 'true',
      },
    },
    defaultFromEmail: process.env.MAIL_DEFAULT_ADDRESS,
    defaultFromName: process.env.MAIL_DEFAULT_NAME,
  },

  app: {
    onboardingURl: '/c',
  },
}

module.exports = config
