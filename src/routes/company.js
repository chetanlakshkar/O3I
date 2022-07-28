var express = require('express');
var router = express.Router();
var { verifyTokenFn } = require('../utils/jwt')
const Controller = require("../controllers/company"); 

router.post('/createCompany',verifyTokenFn, Controller.createCompany)
router.get('/showCompany/:id' , Controller.showCompany)

module.exports = router; 