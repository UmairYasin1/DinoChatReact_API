const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
var geoip = require('geoip-lite');
const publicIp = require('public-ip');


var privateIpValue;
var publicIpValue;
var geoLocValue;
var geoLocValuePrivate;
var browserAndOSValue;

//middlewares
const auth = require("../../middlewares/auth.js");
const validator = require("../../middlewares/validator.js");
const encrypt = require("../../libs/encrypt.js");

const router = express.Router();

const visitorModel = mongoose.model("visitor");

module.exports.controller = function(app) {
  //route for signup
  router.get("/visitorsignup", auth.loggedIn, function(req, res) {
   // router.get("/visitorsignup", function(req, res) {
    
    privateIpValue = getClientPrivateIp(req);
    var promiseResolve = Promise.resolve(getClientPublicIp);
    promiseResolve.then(function(value) {
      publicIpValue = value;
      var geo = geoip.lookup(value);
      geoLocValue = geo;
    });
    browserAndOSValue = req.useragent;
    
    var privateIpbreak = privateIpValue.substring(0, privateIpValue.indexOf(","));
    geoLocValuePrivate = (function() {
      if(privateIpbreak == ""){
        //console.log(privateIpValue);
        //return geoip.lookup(privateIpValue);
        if(geoip.lookup(privateIpValue) == null){
          return [];
        }
        else{
          return geoip.lookup(privateIpValue);
        }
      }
      else{
        // console.log(privateIpbreak);
        // return geoip.lookup(privateIpbreak);
        if(geoip.lookup(privateIpbreak) == null){
          return [];
        }
        else{
          return geoip.lookup(privateIpbreak);
        }
      }
    })();
    //console.log(privateIpbreak);
    console.log(geoLocValuePrivate);
    //geoLocValuePrivate = [];
    //console.log(geoLocValue);

    res.render("visitorsignup", {
      title: "Visitor Signup",
      user: req.session.user,
      chat: req.session.chat
    });

    // res.status(200).json({
    //   success: true,
    //   user: req.session.user,
    //   chat: req.session.chat
    // });


  });


  //api to create new user
   router.post("/api/v1/signup", function(req, res) {
     const today = Date.now();
     const id = shortid.generate();

    // //create user.
     const newVisitor = new visitorModel({
        visitor_id: id,
        visitor_name: req.body.visitor_name.replace(/\s/g, ''),
        visitor_email: req.body.visitor_email,
        phone_number: req.body.phone_number,
        company_name: req.body.company_name,
        number_of_employees: req.body.number_of_employees,
        visitor_publicIp: publicIpValue,
        visitor_privateIp: privateIpValue,
        visitor_region_publicIp: geoLocValue,
        visitor_region_privateIp: geoLocValuePrivate,
        visitor_browser_and_os: browserAndOSValue,
        createdOn: today,
        updatedOn: today
     });

     newVisitor.save(function(err, result) {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Some Error Occured During Login"
        });

      } else if (result == null || result == undefined || result == "") {

        res.status(404).json({
          success: false,
          message: "User Not Found. Please Check Your Username and Password."
        });

      } else {
        console.log('result ==', result);
         req.user = result;
         req.session.user = result;
         req.session.save();
         res.redirect("/chat");
        // res.status(200).json({
        //   success: true,
        //   visitor: req.session.user
        // });
       }
     });
  });

  //route for logout
  router.get("/visitorlogout", function(req, res) {
    delete req.session.user;
    res.redirect("/visitor/visitorsignup");
  });

  app.use("/visitor", router);

}; //signup controller end


var getClientPrivateIp = function(req) {
  var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (!ipAddress) {
    return '';
  }// convert from "::ffff:192.0.0.1"  to "192.0.0.1"
  if (ipAddress.substr(0, 7) == "::ffff:") {
    ipAddress = ipAddress.substr(7)
  }return ipAddress;
};

var getClientPublicIp = (async () => {
  var pIp = await publicIp.v4();
  return pIp;
})();
