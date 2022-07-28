const client = require('../config/redis');

module.exports.set = async function ( key, value) {
    let data = await client.set(key,JSON.stringify(value))
    console.log(data,"stored in cache");
}


