declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'dev' | 'uat' | 'prod'
      BASE_URL: string
      PORT?: string

      S3_ACCESS_KEY: string
      S3_ACCESS_SECRET: string
      S3_BUCKET: string
      S3_ENDPOINT: string

      SECURITY_KEY_1: string
      SECURITY_KEY_2: string

      ONBOARDING_URL: string
    }
  }
}

export {}
