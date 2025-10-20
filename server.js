// server.js
const dotenv = require('dotenv');
const http = require('http');
const app = require('./src/app');

dotenv.config();

const PORT = process.env.PORT || 8080;

// ✅ Must listen on 0.0.0.0 for Railway
const server = http.createServer(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Jendie Backend running on port ${PORT}`);
});

// ✅ Graceful error handling
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});
