import dotenv from 'dotenv';

dotenv.config();

export const envConfig = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  HOST: process.env.HOST || 'localhost',

  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'stakeholder_platform',
  DB_POOL_SIZE: parseInt(process.env.DB_POOL_SIZE || '10', 10),

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '24h',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',

  // LDAP
  LDAP_ENABLED: process.env.LDAP_ENABLED === 'true',
  LDAP_URL: process.env.LDAP_URL || 'ldap://localhost:389',
  LDAP_BIND_DN: process.env.LDAP_BIND_DN || 'cn=admin,dc=example,dc=com',
  LDAP_BIND_PASSWORD: process.env.LDAP_BIND_PASSWORD || 'password',
  LDAP_BASE_DN: process.env.LDAP_BASE_DN || 'ou=users,dc=example,dc=com',
  LDAP_SEARCH_FILTER: process.env.LDAP_SEARCH_FILTER || '(uid={{username}})',

  // MFA
  MFA_ENABLED: process.env.MFA_ENABLED === 'true',
  MFA_ISSUER: process.env.MFA_ISSUER || 'Stakeholder Platform',
  MFA_WINDOW: parseInt(process.env.MFA_WINDOW || '2', 10),

  // Email
  SMTP_HOST: process.env.SMTP_HOST || 'localhost',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@stakeholder-platform.com',
  SMTP_TLS: process.env.SMTP_TLS === 'true',

  // Redis (for caching/sessions)
  REDIS_ENABLED: process.env.REDIS_ENABLED === 'true',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FORMAT: process.env.LOG_FORMAT || 'json',

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',

  // API
  API_VERSION: process.env.API_VERSION || 'v1',
  API_PREFIX: process.env.API_PREFIX || '/api',

  // Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  PASSWORD_MIN_LENGTH: parseInt(process.env.PASSWORD_MIN_LENGTH || '8', 10),
  PASSWORD_REQUIRE_UPPERCASE: process.env.PASSWORD_REQUIRE_UPPERCASE === 'true',
  PASSWORD_REQUIRE_NUMBERS: process.env.PASSWORD_REQUIRE_NUMBERS === 'true',
  PASSWORD_REQUIRE_SPECIAL: process.env.PASSWORD_REQUIRE_SPECIAL === 'true',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

  // Deployment
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
