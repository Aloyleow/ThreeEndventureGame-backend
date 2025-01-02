declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: number;
    JWT_SECRET?: string;
    PGSTRING_URI?: string;
    ARGON_SECRET?: string;
    MAILER_USER?: string;
    MAILER_HOST?: string;
    MAILER_API_KEY?: string;
    GMAIL_CLIENT_ID?: string;
    GMAIL_CLIENT_SECRET?: string;
    GMAIL_REFRESH_TOKEN?: string;
    GMAIL_REDIRECT?: string;
}
}