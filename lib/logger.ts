import { storage } from '#imports';
import {
  type LogLevel,
  isLogLevel,
  GENERAL_SETTING_DEFINITIONS,
} from '@/constants/general-settings';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

let globalLogLevel: LogLevel | undefined;

const storageKey = GENERAL_SETTING_DEFINITIONS.logLevel.storageKey;

// Watch for setting changes
storage.watch<unknown>(storageKey, (newValue: unknown) => {
  if (isLogLevel(newValue)) {
    globalLogLevel = newValue;
  } else if (newValue === null || newValue === undefined) {
    globalLogLevel = undefined; // Reset to default
  }
});

// Fetch initial value
storage.getItem<unknown>(storageKey).then((value: unknown) => {
  if (isLogLevel(value)) {
    globalLogLevel = value;
  }
});

export class Logger {
  constructor(private scope: string) {}

  private getEffectiveLevel(): LogLevel {
    let level = globalLogLevel ?? (GENERAL_SETTING_DEFINITIONS.logLevel.defaultValue as LogLevel);

    // "特别的, 对于content范围内, 默认(info)应该没有日志显示"
    // So if the level is 'info', we suppress it for content scripts by bumping it to 'warn'.
    // If a user explicitly wants to see info in content, they can use 'debug' level.
    if (level === 'info' && (this.scope === 'content' || this.scope.startsWith('content:'))) {
      return 'warn';
    }

    return level;
  }

  private shouldLog(level: LogLevel): boolean {
    const effectiveLevel = this.getEffectiveLevel();
    return LOG_LEVELS[level] >= LOG_LEVELS[effectiveLevel];
  }

  debug(...args: any[]) {
    if (this.shouldLog('debug')) {
      console.debug(...args);
    }
  }

  info(...args: any[]) {
    if (this.shouldLog('info')) {
      console.info(...args);
    }
  }

  warn(...args: any[]) {
    if (this.shouldLog('warn')) {
      console.warn(...args);
    }
  }

  error(...args: any[]) {
    if (this.shouldLog('error')) {
      console.error(...args);
    }
  }
}

export function createLogger(scope: string) {
  return new Logger(scope);
}
