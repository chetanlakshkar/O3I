const { issueJWT } = require("../utils/jwt");
const bcrypt = require('bcryptjs')
const nodemailer = require("nodemailer");
const subAdmin = require("../../models/subAdmin");
const superAdmin = require("../../models/superAdmin");
const client = require('../config/redis')
const {set} = require('../helper/redis_helper')

function sendVmail(email, token) {
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "emsdemo04@gmail.com",
            pass: "Emaster@123456#",
        },
    });

    var mailOptions = {
        from: "emsdemo04@gmail.com",
        to: email,
        subject: "Forget Password",
        html: ` <html>
      <head></head>
      <body>
      <b>
       Please Click on the link 
      :-<a href= "http://localhost:5000/api/v1/subAdmin/forgotchange/${token}">Link....</a></b>
      </body>
      </html>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

module.exports.createSubAdmin = async (req, res) => {
    try {
        let id = req.user.id
        let findSuperAdmin = await superAdmin.findOne({_id : id})
        if(findSuperAdmin){
        let {
            name,
            email,
            phone,
            profileimage,
            password,
            confirm_password,
            address,
            permission_to_add_company,
            permission_to_view_company_list,
            permission_to_add_plans,
            permission_to_edit_and_delete_plans_list
        } = req.body;
        
            let findUser = await subAdmin.findOne({ email: req.body.email });

            if (findUser == null) {
                if (password == confirm_password) {
                    var hashpassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
                    data = new subAdmin({
                        name,
                        email,
                        phone,
                        profileimage,
                        password: hashpassword,
                        address,
                        permission_to_add_company,
                        permission_to_view_company_list,
                        permission_to_add_plans,
                        permission_to_edit_and_delete_plans_list  
                    })
                    let subAdminCreate = await data.save();
                    
                    if (subAdminCreate != "") {
                        let allSubAdmin = await subAdmin.find()
                        set('allSubAdmin',allSubAdmin)
                        res.status(200).json({
                            success: true,
                            message: "Sub Admin added successfully",
                        })
                    } else {
                        res.status(400).json({
                            success: false,
                            message: "something went wrong"
                        })
                    }
                } else {
                    res.status(400).json({
                        success: false,
                        message: "password and confirm_password not same"
                    })
                }
            } else {
                res.status(400).json({
                    success: false,
                    message: "Sub Admin is already exists"
                })
            }

        }else{
            res.status(400).json({
                success: false,
                message: "UnAthorized"
            })
        }
       
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
};

module.exports.login = async (req, res) => {
    try {
        let { email, password, } = req.body;

        let login = await subAdmin.findOne({email:email} )

            if(login != null){
                let comparePassword = await bcrypt.compare(password, login.password)

                if (comparePassword){
                    let token = await issueJWT(login);
                    res.json({
                        status: 200,
                        success: true,
                        message: "Sub Admin LoggedIn Successfully!",
                        token: token,
                    });
                }
                else{
                    res.status(400).json({
                        success: false,
                        message: " paswword is incorrect",
                    });    
                }
            }else{
                res.status(400).json({
                    success: false,
                    message: "Email  is incorrect",
                })
            }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports.showSubAdmin = async (req, res) => {
    try {
        let { id } = req.user;

        let response = await client.get('subAdmin')
        if(response){
            let responseData = JSON.parse(response)
            console.log(responseData,"response from cache");
            res.json({
                status: 200,
                success: true,
                data: responseData,
            });
        }else{
            let findSubAdmin = await subAdmin.find({_id:id} )
            set ('subAdmin', findSubAdmin)
            if(findSubAdmin != null){
                res.json({
                    status: 200,
                    success: true,
                    data : findSubAdmin,
                });    
            }
            else{
                res.status(400).json({
                    success: false,
                    message: "Sub Admin not Found!",
                })
            }
        }      
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports.updateSubAdmin = async (req, res) => {
    try {
        let { id } = req.user;
        let {
            name,
            email,
            phone,
            profileimage,
            address
        } = req.body;

        let findSubAdmin = await subAdmin.findOneAndUpdate({ _id: id }, {
            $set: {
                name: name,
                email: email,
                phone : phone,
                profileimage:profileimage,
                address:address,
                updated_at: Date.now()
            }
        })

        if (findSubAdmin != null) {
            let allSubAdmin = await subAdmin.find()
            set('allSubAdmin',allSubAdmin)
            res.json({
                status: 200,
                success: true,
                message : "Sub Admin Updated Successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Sub Admin not Found!",
            })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports.changePassword = async (req, res) => {
    try {
        let { id } = req.user;
        let {
            password,
            confirm_password
        } = req.body;
        if (password == confirm_password){
            
            var hashpassword = await bcrypt.hash(password, await bcrypt.genSalt(10)); 

            let findSubAdmin = await subAdmin.findOneAndUpdate({ _id: id }, {
                $set: {
                   password : hashpassword,
                    updated_at: Date.now()
                }
            })
            if (findSubAdmin != null) {

                let allSubAdmin = await subAdmin.find()
                set('allSubAdmin',allSubAdmin)
                res.json({
                    status: 200,
                    success: true,
                    message : "password changed Successfully"
                });
            } else {
                res.json({
                    status: 200,
                    success: true,
                    message : "Sub Admin not Found!"
                });
            }
        }else{
            res.status(400).json({
                success: false,
                message: "password and confirm password are not matched",
            });
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};  

module.exports.forgotReset = async (req, res) => {
    try {
        let { email } = req.body;
        // otp = Math.floor(Math.random() * 10000) + 1;
        let findSubAdmin = await subAdmin.findOne({ email: email })
        if (findSubAdmin != null) {
            const payload = {
                id: findSubAdmin._id,
                email: findSubAdmin.email,
            }
            let token = await issueJWT(payload)
            var emailPart = await sendVmail(email, token);
            let Update = await subAdmin.findOneAndUpdate({ email: email }, {
                $set: {
                    remember_token: token,
                    // otp : otp
                }
            })
            
            res.status(200).json({
                success: true,
                message: "mail send",
                token: token,
                //otp: otp
            })
        } else {
            res.status(200).json({
                success: false,
                message: "email not valid"
            })
        }

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

module.exports.forgotchange = async (req, res) => {
    try {
        let { newPassword, confirmPassword } = req.body;
        var token = req.params.token;
        let findSubAdmin = await subAdmin.findOne({ remember_token: token });
        console.log(findSubAdmin,"subadmin");
        if (findSubAdmin != null) {
            if (newPassword == confirmPassword) {
                console.log(findSubAdmin._id);
                // let hashpassword = await bcrypt.hash(confirmPassword, await bcrypt.genSalt(10));
                let subAdminUpdate = await subAdmin.findOneAndUpdate(
                    { _id: findSubAdmin._id },
                    {
                        $set: {
                            password: confirmPassword,
                            remember_token: "",
                        },
                    }
                );
                if (subAdminUpdate) {
                    res.status(200).json({
                        success: true,
                        message: "password updated successfully",
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: "something went wrong",
                    });
                }
            } else {
                res.status(200).json({
                    success: false,
                    message: "confirmPassword not same",
                });
            }
        } else {
            res.status(200).json({
                success: false,
                message: "Admin not Found",
            });
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};