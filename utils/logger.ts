/**
 * Logger utility that conditionally logs based on environment
 * In production, logs are suppressed to improve performance and security
 */

const IS_DEV = __DEV__;

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface LoggerOptions {
  /** Tag/prefix for the log message */
  tag?: string;
  /** Force logging even in production (use sparingly) */
  force?: boolean;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, tag?: string): string {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 12);
    const prefix = tag ? `[${tag}]` : '';
    return `${timestamp} ${prefix} ${message}`;
  }

  /**
   * General log - only in development
   */
  log(message: string, data?: any, options?: LoggerOptions): void {
    if (IS_DEV || options?.force) {
      const formatted = this.formatMessage('log', message, options?.tag);
      if (data !== undefined) {
        console.log(formatted, data);
      } else {
        console.log(formatted);
      }
    }
  }

  /**
   * Info log - only in development
   */
  info(message: string, data?: any, options?: LoggerOptions): void {
    if (IS_DEV || options?.force) {
      const formatted = this.formatMessage('info', message, options?.tag);
      if (data !== undefined) {
        console.info(formatted, data);
      } else {
        console.info(formatted);
      }
    }
  }

  /**
   * Warning log - in development and can be enabled in production
   */
  warn(message: string, data?: any, options?: LoggerOptions): void {
    if (IS_DEV || options?.force) {
      const formatted = this.formatMessage('warn', message, options?.tag);
      if (data !== undefined) {
        console.warn(formatted, data);
      } else {
        console.warn(formatted);
      }
    }
  }

  /**
   * Error log - always logged (errors are important)
   * In production, consider sending to error tracking service
   */
  error(message: string, error?: any, options?: LoggerOptions): void {
    const formatted = this.formatMessage('error', message, options?.tag);

    if (IS_DEV) {
      if (error !== undefined) {
        console.error(formatted, error);
      } else {
        console.error(formatted);
      }
    } else {
      // In production, we might want to send to Sentry or similar
      // For now, still log errors but could be enhanced
      if (error !== undefined) {
        console.error(formatted, error);
      } else {
        console.error(formatted);
      }
    }
  }

  /**
   * Debug log - only in development, for detailed debugging
   */
  debug(message: string, data?: any, options?: LoggerOptions): void {
    if (IS_DEV || options?.force) {
      const formatted = this.formatMessage('debug', message, options?.tag);
      if (data !== undefined) {
        console.debug(formatted, data);
      } else {
        console.debug(formatted);
      }
    }
  }

  /**
   * Group logs - only in development
   */
  group(label: string, fn: () => void): void {
    if (IS_DEV) {
      console.group(label);
      fn();
      console.groupEnd();
    }
  }

  /**
   * Time a function - only in development
   */
  time(label: string): void {
    if (IS_DEV) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (IS_DEV) {
      console.timeEnd(label);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const log = logger.log.bind(logger);
export const logInfo = logger.info.bind(logger);
export const logWarn = logger.warn.bind(logger);
export const logError = logger.error.bind(logger);
export const logDebug = logger.debug.bind(logger);

export default logger;
