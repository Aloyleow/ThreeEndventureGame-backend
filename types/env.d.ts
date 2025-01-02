declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: number;
    JWT_SECRET?: string;
    PGSTRING_URI?: string;
    ARGON_SECRET?: string;
}
}