require('./lib/cron');

process.on('SIGINT', () => {
  console.info('\nShutting down gracefully...');
  process.exit(1);
});
