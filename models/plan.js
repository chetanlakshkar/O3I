var mongoose = require('mongoose')

var planSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String},
    feature: { type: String,   },
    modules : { type: String },
    sub_module : { type: String },
    price : { type: Number },
    duration : { type: Number },
    offer_price : { type: Number },
    discount_percentage : { type: Number },
    is_deleted :{
                type : Boolean, 
                default: 0       // takes only boolean values, 0 from "not deleted", 1 for "deleted"
            },
    created_by : {type : String}, // takes id of the super admin/sub admin, 
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date }
})

//module.exports =  planSchema
module.exports = new mongoose.model('plan', planSchema)