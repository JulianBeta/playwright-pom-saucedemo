const fs = require('fs');
const path = require('path');

class Logger {
  constructor({ logDir = 'reports/logs', level = 'info' } = {}) {
    this.level = level;
    this.logDir = logDir;
    this.logFilePath = path.resolve(logDir, `run-${new Date().toISOString().slice(0, 10)}.log`);
    try {
      fs.mkdirSync(logDir, { recursive: true });
    } catch (_) {}
    this.stream = fs.createWriteStream(this.logFilePath, { flags: 'a' });
  }

  _write(level, message, meta) {
    const entry = {
      ts: new Date().toISOString(),
      level,
      message,
      ...(meta ? { meta } : {})
    };
    const line = JSON.stringify(entry);
    console.log(`[${entry.ts}] [${level.toUpperCase()}] ${message}${meta ? ` | ${JSON.stringify(meta)}` : ''}`);
    try {
      this.stream.write(line + '\n');
    } catch (_) {}
  }

  info(message, meta) { this._write('info', message, meta); }
  warn(message, meta) { this._write('warn', message, meta); }
  error(message, meta) { this._write('error', message, meta); }
  debug(message, meta) { this._write('debug', message, meta); }
}

module.exports = { Logger };
