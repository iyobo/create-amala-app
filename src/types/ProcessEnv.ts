declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'dev' | 'uat'| 'prod';
      BASE_URL: string;
      PORT?: string;

      DATABASE_URL?: string;
      DB_HOST?: string;
      DB_PORT?: string;
      DB_NAME?: string;
      DB_TYPE?: string;
      DB_USER?: string;
      DB_PASSWORD?: string;
      DB_SSL?: string;

      S3_ACCESS_KEY: string;
      S3_ACCESS_SECRET: string;
      S3_BUCKET: string;
      S3_ENDPOINT: string;

      SECURITY_KEY_1: string
      SECURITY_KEY_2: string

      AUTH_GOOGLE_KEY: string
      AUTH_GOOGLE_SECRET: string
      AUTH_FACEBOOK_KEY: string
      AUTH_FACEBOOK_SECRET: string

      MAIL_SPARKPOST_API_KEY: string
      MAIL_DEFAULT_ADDRESS: string
      MAIL_DEFAULT_NAME: string

      SMS_DEFAULT_PHONE: string;
      SMS_TWILIO_KEY: string;
      SMS_TWILIO_SECRET: string;

      ONBOARDING_URL: string
    }
  }
}


export {};