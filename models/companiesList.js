
var mongoose = require('mongoose')

var companiesListSchema = new mongoose.Schema({

    company_id : {type :String},
    company_name : { type: String },
    plan_title : {type : String},
    created_by : { type : String }, // takes id of the super admin/sub admin, 
    is_active : { type : Boolean},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date }
})

module.exports = new mongoose.model('companies-list', companiesListSchema)
