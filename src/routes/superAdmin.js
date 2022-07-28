var express = require('express');
var router = express.Router();
var { verifyTokenFn } = require('../utils/jwt')
const Controller = require("../controllers/superAdmin"); 


router.post('/login',Controller.login)
router.get('/showSuperAdmin',verifyTokenFn, Controller.showSuperAdmin)
router.put('/updateSuperAdmin',verifyTokenFn, Controller.updateSuperAdmin)
router.put('/changePassword',verifyTokenFn, Controller.changePassword)
router.post('/forgotReset', Controller.forgotReset)
router.post('/forgotchange/:token', Controller.forgotchange)


//-------------------- sub admin handled by super admin----------------------------
router.get('/showAllSubAdmin',verifyTokenFn, Controller.showAllSubAdmin)
router.put('/updateSubAdmin/:id',verifyTokenFn, Controller.updateSubAdmin)

 
module.exports = router;
