const superAdmin = require("../../models/superAdmin");
const subAdmin = require("../../models/subAdmin");
const companyList = require("../../models/companiesList");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const companySchema = require("../../models/company");
const { set } = require("../helper/redis_helper");
const client = require("../config/redis");

module.exports.createCompany = async (req, res) => {
  try {
    let id = req.user.id;

    let findSuperAdmin = await superAdmin.findOne({ _id: id });
    let findSubAdmin = await subAdmin.findOne({ _id: id });

    if (findSuperAdmin || findSubAdmin) {
      let admin_name;
      if (findSuperAdmin != null) {
        admin_name = findSuperAdmin.name;
      } else {
        admin_name = findSubAdmin.name;
      }
      // console.log(findSuperAdmin.length,findSubAdmin.length,"admins");
      let {
        company_name,
        company_logo,
        contact,
        timezone,
        currency,
        holiday_calender,
        weather_feed_location,
        size_in_sqft,
        occupancy_of_people,
        green_certifications,
        plan_title,
        space_billing_info,
        space_subscription_details,
      } = req.body;

      var collection;

      // const url = 'mongodb://localhost:27017';
      // MongoClient.connect(url).then((client) => {

      //     console.log('Database created');

      //     // database name
      //     const db = client.db(company_name);

      //     // collection name
      //     db.createCollection(`collection-${company_name}`).then((collection)=>{

      //     })
      //     // collection = mongoose.model(`collection-${company_name}`, companySchema)

      //     console.log(collection, "collection");
      // })

      collection = mongoose.model(`collection-${company_name}`, companySchema);
      console.log(collection, "collection");
      let findcompany = await collection.findOne({
        company_name: req.body.company_name,
      });

      if (findcompany == null) {
        data = new collection({
          company_name,
          company_logo,
          contact,
          timezone,
          currency,
          holiday_calender,
          weather_feed_location,
          size_in_sqft,
          occupancy_of_people,
          green_certifications,
          plan_title,
          space_billing_info,
          space_subscription_details,
          created_by: admin_name,
        });

        let createCompany = await data.save();
        let data1 = new companyList({
          company_id: createCompany._id,
          company_name: createCompany.company_name,
          plan_title: createCompany.plan_title,
          created_by: createCompany.created_by,
          is_active: createCompany.is_active,
        });
        let companylist = await data1.save();
        if (createCompany != "" && companylist != "") {
          res.status(200).json({
            success: true,
            message: "company created successfully",
          });
        } else {
          res.status(400).json({
            success: false,
            message: "something went wrong",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "Company already exists",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "UnAthorized",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.showCompany = async (req, res) => {
  //   try {
  //     let { id } = req.params;

  //     // let response = await client.get('subAdmin')
  //     // if(response){
  //     //     let responseData = JSON.parse(response)
  //     //     console.log(responseData,"response from cache");
  //     //     res.json({
  //     //         status: 200,
  //     //         success: true,
  //     //         data: responseData,
  //     //     });
  //     // }else{
  //     let findComapany = await companyList.find({ company_id: id });
  //     console.log(findComapany);
  //     console.log(collection, "222222222222");
  //     let finddata = await collection.find({
  //       company_name: findComapany[0].company_name,
  //     });
  //     console.log(finddata, "3333333333333");
  //     //set ('subAdmin', findComapany)
  //     // if(findComapany != null){
  //     //     res.json({
  //     //         status: 200,
  //     //         success: true,
  //     //         data : findComapany,
  //     //     });
  //     // }
  //     // else{
  //     //     res.status(400).json({
  //     //         success: false,
  //     //         message: "Sub Admin not Found!",
  //     //     })
  //     // }
  //     // }
  //   } catch (error) {
  //     res.status(400).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // };
  try {
    let company_id = req.params.id;
    let findId = await companyList.findOne({ company_id: company_id });
    set("subAdmin", findId);
    if (findId) {
      res.json({
        status: true,
        statusCode: 200,
        message: " shown Successfully",
        data: findId,
      });
    } else {
      res.json({
        status: false,
        statusCode: 200,
        message: "Id not found",
        data: "",
      });
    }
  } catch (error) {
    res.json({
      status: false,
      statusCode: 400,
      message: error.message,
      data: "",
    });
  }
};
