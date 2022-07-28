var express = require('express');
var router = express.Router();
var { verifyTokenFn } = require('../utils/jwt')
const Controller = require("../controllers/subAdmin"); 


router.post('/createSubAdmin',verifyTokenFn, Controller.createSubAdmin)
router.post('/login',Controller.login)
router.get('/showSubAdmin',verifyTokenFn, Controller.showSubAdmin)
router.put('/updateSubAdmin',verifyTokenFn, Controller.updateSubAdmin)
router.put('/changePassword',verifyTokenFn, Controller.changePassword)
router.post('/forgotReset', Controller.forgotReset)
router.post('/forgotchange/:token', Controller.forgotchange)



module.exports = router;
