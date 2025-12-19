const fs = require('fs');
const path = require('path');

// 创建 logs 目录
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLevel = logLevels[process.env.LOG_LEVEL || 'info'];

const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  const msg = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
  return `[${timestamp}] [${level.toUpperCase()}] ${msg}`;
};

const writeToFile = (level, message) => {
  const logFile = path.join(logsDir, `${level}.log`);
  const formattedMessage = formatMessage(level, message) + '\n';
  fs.appendFileSync(logFile, formattedMessage);
};

const logger = {
  error: (message) => {
    if (currentLevel >= logLevels.error) {
      console.error(formatMessage('error', message));
      writeToFile('error', message);
    }
  },

  warn: (message) => {
    if (currentLevel >= logLevels.warn) {
      console.warn(formatMessage('warn', message));
      writeToFile('warn', message);
    }
  },

  info: (message) => {
    if (currentLevel >= logLevels.info) {
      console.log(formatMessage('info', message));
      writeToFile('info', message);
    }
  },

  debug: (message) => {
    if (currentLevel >= logLevels.debug) {
      console.log(formatMessage('debug', message));
      writeToFile('debug', message);
    }
  }
};

module.exports = logger;
