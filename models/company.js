
var mongoose = require('mongoose')

var companySchema = new mongoose.Schema({

    company_name : { type: String },
    company_logo: { type: String},
    contact:{ type : Object},
    timezone : {type : String},
    currency : {type : String},
    holiday_calendar : {type : Object},
    weather_feed_location : {type : String},
    size_in_sqft : {type : String},
    occupancy_of_people : {type : Number},
    green_certifications : {type : String},
    plan_title : {type : String},
    space_billing_info : { type : Object},
    space_subscription_details : { type : Object}, 
    created_by : { type : String }, // takes id of the super admin/sub admin,
    is_active : {
         type : Boolean,
         default : true
    } ,
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { type: Date }
})

//module.exports = new mongoose.model('company', companySchema)
module.exports = companySchema
