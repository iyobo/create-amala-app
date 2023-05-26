import Cookies from 'cookies'
import { S3ClientConfig } from '@aws-sdk/client-s3'

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
    s3?: S3ClientConfig
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
