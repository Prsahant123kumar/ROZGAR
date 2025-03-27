const Redis = require("ioredis");
const redisClient = new Redis(); // Connect to Redis server

module.exports = redisClient;
