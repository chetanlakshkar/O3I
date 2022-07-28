const plan = require("../../models/plan");
const superAdmin = require("../../models/superAdmin");
const subAdmin = require("../../models/subAdmin");
const client = require('../config/redis')
const { set } = require('../helper/redis_helper')

module.exports.createPlan = async (req, res) => {
    try {
        let id = req.user.id
        let {
            title,
            description,
            feature,
            module,
            sub_module,
            price,
            duration,
            offer_price,
            discount_percentage
        } = req.body;

        let findSuperAdmin = await superAdmin.findOne({ _id: id })
        let findSubAdmin = await subAdmin.findOne({ _id: id })
        if ((findSuperAdmin || findSubAdmin)) {
            if (findSubAdmin) {
                if (findSubAdmin.permission_to_add_plans == true) {
                    let findPlan = await plan.findOne({ title: req.body.title });
                    if (findPlan == null) {

                        data = new plan({
                            title,
                            description,
                            feature,
                            module,
                            sub_module,
                            price,
                            duration,
                            offer_price,
                            discount_percentage
                        })

                        let planCreate = await data.save();

                        if (planCreate != "") {
                            let allPlan = await plan.find()
                            set('allPlan', allPlan)
                            res.status(200).json({
                                success: true,
                                message: "plan added successfully",
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
                            message: "Plan is already exists"
                        })
                    }

                }
                else {
                    res.status(400).json({
                        success: false,
                        message: "UnAthorized"
                    })
                }
            }
            else {

                let findPlan = await plan.findOne({ title: req.body.title });

                if (findPlan == null) {
                    data = new plan({
                        title,
                        description,
                        feature,
                        module,
                        sub_module,
                        price,
                        duration,
                        offer_price,
                        discount_percentage
                    })

                    let planCreate = await data.save();

                    if (planCreate != "") {
                        let allPlan = await plan.find()
                        set('allPlan', allPlan)
                        res.status(200).json({
                            success: true,
                            message: "plan added successfully",
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
                        message: "Plan is already exists"
                    })
                }
            }
        } else {
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

module.exports.showAllPlan = async (req, res) => {
    try {
        let { id } = req.user;
        let findSuperAdmin = await superAdmin.findOne({ _id: id })
        let findSubAdmin = await subAdmin.findOne({ _id: id })

        if ((findSuperAdmin || findSubAdmin)) {
            let response = await client.get('allplan')

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
                let allplan = await plan.find()
                set('allplan', allplan)
                if (allplan != null) {
                    res.json({
                        status: 200,
                        success: true,
                        message: "list of All plan",
                        data: allplan,
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

module.exports.updatePlan = async (req, res) => {
    try {
        let id = req.user.id
        let {
            title,
            description,
            feature,
            module,
            sub_module,
            price,
            duration,
            offer_price,
            discount_percentage
        } = req.body;

        let findSuperAdmin = await superAdmin.findOne({ _id: id })
        let findSubAdmin = await subAdmin.findOne({ _id: id })

        if ((findSuperAdmin || findSubAdmin)) {

            if (findSubAdmin) {
                if (findSubAdmin.permission_to_edit_and_delete_plans_list == true) {

                    let findPlan = await plan.findOneAndUpdate({ title: title }, {
                        $set: {
                            description: description,
                            feature: feature,
                            module: module,
                            sub_module: sub_module,
                            price: price,
                            duration: duration,
                            offer_price: offer_price,
                            discount_percentage: discount_percentage,
                            updated_at: Date.now()
                        }
                    })

                    if (findPlan != null) {
                        let allPlan = await plan.find()
                        set('allPlan', allPlan)
                        res.json({
                            status: 200,
                            success: true,
                            message: "plan Updated Successfully"
                        });
                    } else {
                        res.status(400).json({
                            success: false,
                            message: "plan not Found!",
                        })
                    }
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: "UnAuthorized to Update Plan",
                    })
                }
            }
            else {
                let findPlan = await plan.findOneAndUpdate({ title: title }, {
                    $set: {
                        description: description,
                        feature: feature,
                        module: module,
                        sub_module: sub_module,
                        price: price,
                        duration: duration,
                        offer_price: offer_price,
                        discount_percentage: discount_percentage,
                        updated_at: Date.now()
                    }
                })

                if (findPlan != null) {
                    let allPlan = await plan.find()
                    set('allPlan', allPlan)
                    res.json({
                        status: 200,
                        success: true,
                        message: "plan Updated Successfully"
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: "plan not Found!",
                    })
                }
            }
        } else {
            res.status(400).json({
                success: false,
                message: "UnAuthorized",
            })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports.deletePlan = async (req, res) => {
    try {
        let id = req.user.id
        let planId = req.params.id;

        let findSuperAdmin = await superAdmin.findOne({ _id: id })
        let findSubAdmin = await subAdmin.findOne({ _id: id })

        if ((findSuperAdmin || findSubAdmin)) {

            if (findSubAdmin) {
                if (findSubAdmin.permission_to_edit_and_delete_plans_list == true) {

                    let findPlan = await plan.findOneAndUpdate({ _id: planId }, {
                        $set: {
                            is_deleted: 1,
                            updated_at: Date.now()
                        }
                    })

                    if (findPlan != null) {
                        let allPlan = await plan.find()
                        set('allPlan', allPlan)
                        res.json({
                            status: 200,
                            success: true,
                            message: "plan deleted Successfully"
                        });
                    } else {
                        res.status(400).json({
                            success: false,
                            message: "plan not Found!",
                        })
                    }

                }
                else {
                    res.status(400).json({
                        success: false,
                        message: "UnAuthorized to delete Plan",
                    })
                }
            }
            else {
                let findPlan = await plan.findOneAndUpdate({ _id: planId }, {
                    $set: {
                        is_deleted: 1,
                        updated_at: Date.now()
                    }
                })

                if (findPlan != null) {
                    let allPlan = await plan.find()
                    set('allPlan', allPlan)
                    res.json({
                        status: 200,
                        success: true,
                        message: "plan deleted Successfully"
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: "plan not Found!",
                    })
                }
            }

        } else {
            res.status(400).json({
                success: false,
                message: "UnAuthorized",
            })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

