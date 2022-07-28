var mongoose = require('mongoose')

var subAdminSchema = new mongoose.Schema({
    name: { type: String },
    email: {
        type: String,
        unique: true  // only unique email will be accepted, can not add same email for multiple subadmin.
    },
    profileimage: {
        type: String,
        default: ''  // In profile image we will store the URL generated from S3 bucket. 
    },
    phone : { type: Number }, 
    password : { type: String }, 
    address : { type: String },
    permission_to_add_company : {type:Boolean}, //takes boolean value 0 and 1.
    permission_to_view_company_list : {type:Boolean}, //takes boolean value 0 and 1.
    permission_to_add_plans : {type:Boolean}, //takes boolean value 0 and 1.
    permission_to_edit_and_delete_plans_list : {type:Boolean}, //takes boolean value 0 and 1. if has permission = 1, else 0 for not permitted
    remember_token : {type :String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date }
})

module.exports = new mongoose.model('sub-admin', subAdminSchema)