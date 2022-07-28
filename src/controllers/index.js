const subAdmin = require('./subAdmin')
const superAdmin = require('./superAdmin')
const plan = require('./plan')
const company = require('./company')

const controller = {
    subAdmin, 
    superAdmin,
    plan,
    company       
};

module.exports = controller;