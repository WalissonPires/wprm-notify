import path from 'path';
import winston from 'winston';
import 'winston-daily-rotate-file';
import { AppConfig } from '../configuration';

export class LoggerFactory {

  private static _logger: winston.Logger;

  constructor() {

    if (!LoggerFactory._logger) {

      const config = new AppConfig();

      const fileTransport = new winston.transports.DailyRotateFile({
        filename:  path.join(config.logPath(), '%DATE%.log'),
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
      });

      const messageFormat = winston.format.printf(({ level, message, scope, timestamp }) => `${timestamp} [${scope}] ${level}: ${message}`);

      LoggerFactory._logger = winston.createLogger({
        level: config.logLevel(),
        format: winston.format.combine(
          winston.format.timestamp(),
          messageFormat
        ),
        defaultMeta: {},
        transports: [ fileTransport ]
      });

      if (process.env.NODE_ENV !== 'production') {
        LoggerFactory._logger.add(new winston.transports.Console());
      }
    }
  }

  public createLogger(options: LoggerOptions): ILogger {

    const logger = LoggerFactory._logger.child({
      scope: options.scope
    });

    return logger;
  }
}

export interface LoggerOptions {
  scope: string;
}

export interface ILogger {
  debug: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}