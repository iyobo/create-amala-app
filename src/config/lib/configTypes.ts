import Cookies from 'cookies'

export interface IMailAdapterSendParams {
  to: string | [string]
  body: string
  from?: string
  fromName?: string
  subject?: string
  opts?: any
}

export interface IMailAdapter {
  init(opts: any): Promise<any>

  send(params: IMailAdapterSendParams): Promise<any>
}

export interface ISMSAdapterParams {
  to: string | [string]
  body: string
  from?: string
}

export interface ISMSAdapter {
  init(opts: any): Promise<any>

  send(params: ISMSAdapterParams): Promise<any>
}

export interface IConfig {
  appName?: string
  server?: {
    port?: number
    hostUrl?: string /** (string) The base url you would prepend a route with before sharing a link */
    // apiBaseUrl?: string; /*Very optional for specifying where the baseUrl on axios is*/
  }
  devMode?: boolean

  log?: {
    debug?: boolean
    token?: string
    subdomain?: string
  }

  storage?: {
    s3?: {
      maxAsyncS3?: number // this is the default
      s3RetryCount?: number // this is the default
      s3RetryDelay?: number // this is the default
      multipartUploadThreshold?: number // this is the default (20 MB)
      multipartUploadSize?: number // this is the default (15 MB)
      bucket: string
      s3Options?: {
        accessKeyId?: string
        secretAccessKey?: string
        region?: string
        endpoint?: string
        sslEnabled?: boolean
        // any other options are passed to new AWS.S3()
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
      }
    }
  }

  auth?: {
    sessionExpirySeconds?: number // How many hours password reset links last
    passwordResetExpirySeconds?: number // How many hours password reset links last
    facebook?: {
      clientID: string
      clientSecret: string
      fbGraphVersion: 'v3.0'
    }
    google?: {
      clientID: string
      clientSecret: string
    }
    instagram?: {
      clientID: string
      clientSecret?: string
    }
  }

  mail?: {
    engine?: {
      adapter: IMailAdapter
      opts: any
    }

    defaultFromEmail?: string
    defaultFromName?: string
  }

  sms?: {
    engine: {
      adapter: ISMSAdapter
      opts: {
        apiKey: string
        apiSecret: string
      }
    }
    defaultFromPhone: string
  }

  security?: {
    keys?: string[]
    issuer?: string
    cookies: Cookies.SetOption
    crypto?: {
      saltRounds: number
    }
  }

  geo?: {
    google: {
      key: string
    }
  }

  /**
   * Place your application specific configs here
   */
  app?: {
    onboardingURl?: string
  }
}
