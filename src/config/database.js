const mongoose = require('mongoose')

const mongoLocal = "mongodb://localhost:27017/oneO3i"
 mongoose.connect(mongoLocal, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("mongo database Connection successfully!");
})
.catch((error) => {
    console.log(error.message);
});

module.exports = mongoose
