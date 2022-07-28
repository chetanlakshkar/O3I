var express = require('express');
var router = express.Router();
var { verifyTokenFn } = require('../utils/jwt')
const Controller = require("../controllers/plan"); 

router.post('/createPlan',verifyTokenFn, Controller.createPlan)
router.put('/updatePlan',verifyTokenFn, Controller.updatePlan)
router.put('/deletePlan/:id',verifyTokenFn, Controller.deletePlan)
router.get('/showAllPlans',verifyTokenFn , Controller.showAllPlan)

module.exports = router; 