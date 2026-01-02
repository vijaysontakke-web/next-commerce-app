import logger from '../lib/logger';

console.log('--- Logger Test Script ---');

logger.info('Test Info Log: Initializing system');
logger.warn('Test Warning Log: Something might be wrong');
logger.error('Test Error Log: Critical failure detected');

// Simulate some logs to verify functionality
for (let i = 0; i < 10; i++) {
  logger.info(`Test Log Entry #${i} - System verification`);
}





console.log('Logs sent. Check the logs/ directory for files.');
