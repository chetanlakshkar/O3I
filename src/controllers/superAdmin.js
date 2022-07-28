const superAdmin = require("../../models/superAdmin");
const subAdmin = require("../../models/subAdmin");
const { issueJWT } = require("../utils/jwt");
const nodemailer = require("nodemailer");
const client = require('../config/redis')
const { set } = require('../helper/redis_helper')


//-------------------------------------mail function-------------------------------
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
      :-<a href= "http://localhost:5000/api/v1/superAdmin/forgotchange/${token}">Link....</a></b>
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
//---------------------------------------------------------------------------------

module.exports.login = async (req, res) => {
    try {
        let { email, password, } = req.body;

        let login = await superAdmin.findOne({ email: email })

        if (login != null) {
            if (password == login.password) {
                let token = await issueJWT(login);
                res.json({
                    status: 200,
                    success: true,
                    message: "Super Admin LoggedIn Successfully!",
                    token: token,
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: " paswword is incorrect",
                });
            }
        } else {
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

module.exports.showSuperAdmin = async (req, res) => {
    try {
        let { id } = req.user;
        let response = await client.get('superAdmin')
        if (response) {
            let responseData = JSON.parse(response)
            console.log(responseData, "response from cache");
            res.json({
                status: 200,
                success: true,
                data: responseData,
            });
        }
        else {
            let findSuperAdmin = await superAdmin.findOne({ _id: id })
            set('superAdmin', findSuperAdmin)
            if (findSuperAdmin != null) {
                res.json({
                    status: 200,
                    success: true,
                    data: findSuperAdmin,
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Super Admin not Found!",
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

module.exports.updateSuperAdmin = async (req, res) => {
    try {
        let { id } = req.user;
        let {
            name,
            email,
            phone,
            profileimage,
            address
        } = req.body;

        let findSuperAdmin = await superAdmin.findOneAndUpdate({ _id: id }, {
            $set: {
                name: name,
                email: email,
                phone: phone,
                profileimage: profileimage,
                address: address,
                updated_at: Date.now()
            }
        })

        if (findSuperAdmin != null) {
            let SuperAdmin = await superAdmin.find()
            set('SuperAdmin', SuperAdmin)
            res.json({
                status: 200,
                success: true,
                message: "Super Admin Updated Successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Super Admin not Found!",
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
        if (password == confirm_password) {

            let findSuperAdmin = await superAdmin.findOneAndUpdate({ _id: id }, {
                $set: {
                    password: password,
                    updated_at: Date.now()
                }
            })
            if (findSuperAdmin != null) {
                let SuperAdmin = await superAdmin.find()
                set('SuperAdmin', SuperAdmin)
                res.json({
                    status: 200,
                    success: true,
                    message: "password changed Successfully"
                });
            } else {
                res.json({
                    status: 200,
                    success: true,
                    message: "Super Admin not Found!"
                });
            }
        } else {
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
        let findSuperAdmin = await superAdmin.findOne({ email: email })
        if (findSuperAdmin != null) {
            const payload = {
                id: findSuperAdmin._id,
                email: findSuperAdmin.email,
            }
            let token = await issueJWT(payload)
            var emailPart = await sendVmail(email, token);
            let updateSuperAdmin = await superAdmin.findOneAndUpdate({ email: email }, {
                $set: {
                    remember_token: token,
                    // otp : otp
                }
            })
            if(updateSuperAdmin){
                res.status(200).json({
                    success: true,
                    message: "Mail sent !",
                    token: token,
                    //otp: otp
                })
            }else{
                res.status(200).json({
                    success: true,
                    message: "something went wrong",
                   
                })
            }
            
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
        let findSuperAdmin = await superAdmin.findOne({ remember_token: token });
        if (findSuperAdmin != "") {
            if (newPassword == confirmPassword) {
                // let hashpassword = await bcrypt.hash(confirmPassword, await bcrypt.genSalt(10));
                let superAdminUpdate = await superAdmin.findOneAndUpdate(
                    { _id: findSuperAdmin._id },
                    {
                        $set: {
                            password: confirmPassword,
                            remember_token: "",
                        },
                    }
                );
                if (superAdminUpdate) {
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
 
//-------------------- sub admin handled by super admin----------------------------

module.exports.showAllSubAdmin = async (req, res) => {
    try {
        let { id } = req.user;
        let findSuperAdmin = await superAdmin.findOne({ _id: id })
        if (findSuperAdmin) {

            let response = await client.get('allSubAdmin')

            if (response) {
                let responseData = JSON.parse(response)
                console.log(responseData, "response from cache");
                res.json({
                    status: 200,
                    success: true,
                    data: responseData,
                });
            }
            else {
                let allSubAdmin = await subAdmin.find()
                set('allSubAdmin', allSubAdmin)
                if (allSubAdmin != null) {
                    res.json({
                        status: 200,
                        success: true,
                        data: allSubAdmin,
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: "Something went wrong",
                    })
                }
            }
        }
        else {
            res.status(400).json({
                success: false,
                message: "Super Admin not Found!",
            })
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
        let findSuperAdmin = await superAdmin.findOne({ _id: id })

        if (findSuperAdmin) {
            let id = req.params.id
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
                    phone: phone,
                    profileimage: profileimage,
                    address: address,
                    updated_at: Date.now()
                }
            })
            if (findSubAdmin != null) {

                let allSubAdmin = await subAdmin.find()
                set('allSubAdmin', allSubAdmin)
                res.json({
                    status: 200,
                    success: true,
                    message: "Sub Admin Updated Successfully"
                });

            } else {
                res.status(400).json({
                    success: false,
                    message: "Sub Admin not Found!",
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Super Admin not Found!",
            })
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


