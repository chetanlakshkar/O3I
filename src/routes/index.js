var express = require('express');
var router = express.Router();

router.use('/subAdmin', require('./subAdmin'));
router.use('/superAdmin', require('./superAdmin'));
router.use('/plan',require('./plan'))
router.use('/company', require('./company'))


module.exports = router;