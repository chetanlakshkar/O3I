const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
const bodyParser = require('body-parser')
const routers = require('./src/routes/index')
app.use(cors({ origin: '*' }));
require('./src/config/redis')
require('./src/config/database')

const port = process.env.PORT || 5000

 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api/v1', routers)
// app.use(express.static('upload'));



app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.get('/test', (req, res) => {
    let moment = require('moment')
    let test = moment(new Date()).add(5, "hour").add(30, "m").toDate();
    res.json({ "message": "Api runing start", "Y": test, "Value": "Api" })
});

app.listen(port, () => {
    console.log("server is started on port", port);
})
