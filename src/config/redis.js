const redis = require('redis');

const client = redis.createClient();

client.connect();

client.on('error', function(error) {
  console.error('redis connection error: ', error);
;
});
client.on('connect', function() {
  console.log('Connected to redis');
});
client.on('ready', function() {
  console.log('Redis connection established');
}); 
 
module.exports = client;
