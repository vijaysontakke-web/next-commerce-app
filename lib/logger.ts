import winston from 'winston';
import 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const LOGS_DIR = path.join(process.cwd(), 'logs');

// Ensure logs directory exists at startup
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

/**
 * Utility to ensure logs directory exists before logging.
 * This handles cases where the directory might be deleted at runtime.
 */
const ensureLogsDir = () => {
  if (!fs.existsSync(LOGS_DIR)) {
    try {
      fs.mkdirSync(LOGS_DIR, { recursive: true });
    } catch (err) {
      console.error('Failed to recreate logs directory:', err);
    }
  }
};

// Define custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Info logs transport
    new winston.transports.DailyRotateFile({
      filename: 'logs/info-%DATE%',
      extension: '.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '15m',
      maxFiles: '14d',
      auditFile: 'logs/info-audit.json',
      level: 'info',
    }),
    // Error logs transport
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%',
      extension: '.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '15m',
      maxFiles: '14d',
      auditFile: 'logs/error-audit.json',
      level: 'error',
    }),



  ],
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    })
  );
}

/**
 * Enhanced Logger Wrapper
 * Ensures the logs directory exists before every log call.
 * This addresses the issue of files/directories being deleted at runtime.
 */
const enhancedLogger = {
  info: (msg: string, ...meta: any[]) => {
    ensureLogsDir();
    logger.info(msg, ...meta);
  },
  error: (msg: string, ...meta: any[]) => {
    ensureLogsDir();
    logger.error(msg, ...meta);
  },
  warn: (msg: string, ...meta: any[]) => {
    ensureLogsDir();
    logger.warn(msg, ...meta);
  },
  debug: (msg: string, ...meta: any[]) => {
    ensureLogsDir();
    logger.debug(msg, ...meta);
  },
  // Expose the raw logger for complex use cases if needed
  raw: logger
};

export default enhancedLogger;
