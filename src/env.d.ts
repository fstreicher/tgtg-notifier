declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GMAIL_USER: string;
      GMAIL_PW: string;
      NODEMAILER_SENDER: string;
      NODEMAILER_SENDER_NAME: string;
      ALERTZY_KEY: string;
      PUSHOVER_KEY: string;
      TGTG_EMAIL: string;
      TGTG_USER_ORIGIN: string;
      HEADER_UA: string;
    }
  }
}

export { }