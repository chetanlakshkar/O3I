var mongoose = require('mongoose')

var superAdminSchema = new mongoose.Schema({
    name: { type: String },
    email: {
        type: String,
        unique: true  // only unique email will be accepted, can not add same email for multiple subadmin.
    },
    profileimage: {
        type: String,
        default: '' // In profile image we will store the URL generated from S3 bucket. 
    },
    phone : { type: Number },
    password : { type: String },
    address : { type: String },
    remember_token : {type :String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date }
})

module.exports = new mongoose.model('super-admin', superAdminSchema)