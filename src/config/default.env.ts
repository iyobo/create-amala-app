import { IConfig } from './lib/configTypes';
import TwilioSMSAdapter from '../util/adapters/sms/TwilioSMSAdapter';
import SMTPMailAdapter from '../util/adapters/mail/SMTPMailAdapter';

const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 4004;
const securityKeys = [];
if (process.env.SECURITY_KEY_1) {
  securityKeys.push(process.env.SECURITY_KEY_1);
}
if (process.env.SECURITY_KEY_2) {
  securityKeys.push(process.env.SECURITY_KEY_2);
}
if (securityKeys.length === 0) {
  throw new Error('Please specify security keys in env file');
}

const isDebug = !process.env.NODE_ENV || process.env.NODE_ENV === 'dev';

const hostUrl = process.env.BASEURL || 'http://localhost:4004';

const config: IConfig = {
  appName: 'Amable',
  server: {
    port,
    hostUrl
  },
  devMode: isDebug,
  log: {
    debug: isDebug,
    token: process.env.LOGGLY_KEY,
    subdomain: process.env.LOGGLY_SUBDOMAIN
  },
  storage: {
    s3: {
      maxAsyncS3: 20, // this is the default
      s3RetryCount: 3, // this is the default
      s3RetryDelay: 1000, // this is the default
      multipartUploadThreshold: 20971520, // this is the default (20 MB)
      multipartUploadSize: 15728640, // this is the default (15 MB)
      bucket: process.env.S3_BUCKET,
      s3Options: {
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
        // region: 'your region',
        endpoint: process.env.S3_ENDPOINT,
        sslEnabled: true
        // any other options are passed to new AWS.S3()
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
      }
    }
  },
  security: {
    issuer: 'amable.io',
    keys: securityKeys,
    cookies: {
      secure: false,
      signed: true,
      httpOnly: true
    },
    crypto: {
      saltRounds: 8
    }
  },
  geo: {
    google: {
      key: process.env.GOOGLE_MAPS_KEY
    }
  },

  auth: {
    sessionExpirySeconds: 60 * 60, // 60 minutes
    passwordResetExpirySeconds: 60 * 5, // 5 minutes
    facebook: {
      clientID: process.env.AUTH_FACEBOOK_KEY,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      fbGraphVersion: 'v3.0'
    },
    google: {
      clientID: process.env.AUTH_GOOGLE_KEY,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    },
    instagram: {
      clientID: null, // etc, Feel free to implement as many as you want
      clientSecret: null
    }
  },
  sms: {
    engine: {
      adapter: TwilioSMSAdapter,
      opts: {
        apiKey: process.env.SMS_TWILIO_KEY,
        apiSecret: process.env.SMS_TWILIO_SECRET
      }
    },
    defaultFromPhone: process.env.SMS_DEFAULT_PHONE
  },
  mail: {
    engine: {
      adapter: SMTPMailAdapter,
      opts: {
        host: process.env.MAIL_HOST,
        port: Number.parseInt(process.env.MAIL_PORT),
        username: process.env.MAIL_USERNAME,
        password: process.env.MAIL_PASSWORD,
        secure: process.env.MAIL_SECURE === 'true'
      }
    },
    defaultFromEmail: process.env.MAIL_DEFAULT_ADDRESS,
    defaultFromName: process.env.MAIL_DEFAULT_NAME
  },

  app: {
    onboardingURl: '/c'
  }
};

module.exports = config;
