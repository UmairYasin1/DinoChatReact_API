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
const visitorpathModel = mongoose.model("visitorPath");
const brandModel = mongoose.model("Brand");

module.exports.controller = function(app) {
  //route for signup
  router.get("/newvisitorsignup",auth.loggedIn, function(req, res) { 
    
    console.log('url visitor', req.headers.referer);
    // console.log('visitor hash', req.fingerprint.hash);
    
    var visitorURL = "";
    //var visitorHASH = req.fingerprint.hash;
    var visitorHost = "";
    if(req.headers.referer != null || req.headers.referer != undefined || req.headers.referer != "")
    {
      visitorURL = req.headers.referer;
    }
    if(req.headers.host != null || req.headers.host != undefined || req.headers.host != "")
    {
      visitorHost = req.headers.host;
    }

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
    //console.log('geoLocValuePrivate', geoLocValuePrivate);
    //geoLocValuePrivate = [];
    //console.log(geoLocValue);

    res.render("newvisitorsignup", {
      title: "Visitor Signup",
      user: req.session.user,
      chat: req.session.chat,
      publicip: publicIpValue,
      privateip: privateIpValue,
      geoloc: geoLocValue,
      geolocprivate: geoLocValuePrivate,
      browserandos: browserAndOSValue
    });

    // res.status(200).json({
    //   success: true,
    //   user: req.session.user,
    //   chat: req.session.chat
    // });
   

  });
  
  router.get("/newvisitorsignup_old", auth.loggedIn, function(req, res) { 
    
    console.log('url visitor', req.headers.referer);
    // console.log('visitor hash', req.fingerprint.hash);
    
    var visitorURL = "";
    var visitorHASH = req.fingerprint.hash;
    var visitorHost = "";
    if(req.headers.referer != null || req.headers.referer != undefined || req.headers.referer != "")
    {
      visitorURL = req.headers.referer;
    }
    if(req.headers.host != null || req.headers.host != undefined || req.headers.host != "")
    {
      visitorHost = req.headers.host;
    }

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
    //console.log('geoLocValuePrivate', geoLocValuePrivate);
    //geoLocValuePrivate = [];
    //console.log(geoLocValue);

    //#region make user

    visitorModel.findOne(
      { $and: [{ visitor_uniqueNum: visitorHASH }] },
      function(err, result) {
        if (result == null || result == undefined || result == "") {

          brandModel.findOne(
            { brand_url: { $regex: '.*' + visitorHost + '.*' } },
            function(err, result) {
              if (result != null || result != undefined || result != "") 
              {
                  const today = Date.now();
                  const id = shortid.generate();
              
                  const newVisitor = new visitorModel({
                    visitor_id: id,
                    visitor_name: "WC_" + id,
                    visitor_email: "walkingcustomer_" + id + "@dc.com",
                    visitor_uniqueNum: visitorHASH,
                    phone_number: "123",
                    web_path: visitorURL,
                    brand_id : result.brand_id,
                    brand_name : result.brand_name,
                    visitor_publicIp: publicIpValue,
                    visitor_privateIp: privateIpValue,
                    visitor_region_publicIp: geoLocValue,
                    visitor_region_privateIp: geoLocValuePrivate,
                    visitor_browser_and_os: browserAndOSValue,
                    createdOn: today
                });
              
                newVisitor.save(function(err, result) {
                  if (err) {
                    console.log('error 1');
                    res.status(500).json({
                      success: false,
                      message: "Some Error Occured"
                    });
              
                  } else if (result == null || result == undefined || result == "") {
                    console.log('error 2');
                    res.status(404).json({
                      success: false,
                      message: "Data Not Found"
                    });
              
                  } 
                  else 
                  {
                    //console.log('solve');
                    if(visitorURL != null || visitorURL != undefined || visitorURL != "")
                    {
                      const pathDate = Date.now();
                      const pathShortId = shortid.generate();
                      const newVisitorPath = new visitorpathModel({
                        path_id: pathShortId,
                        visitor_id: result.visitor_id,
                        visitor_name: result.visitor_name,
                        visitor_email: result.visitor_email,
                        visitor_uniqueNum: result.visitor_uniqueNum,
                        completePath: visitorURL,
                        createdOn: pathDate
                      });
                      newVisitorPath.save(function(err, result) {
                        if (result == null || result == undefined || result == "") {
                          newVisitorPath.save();
                        } 
                      });
                    }
                  }
                });
              }
            });
          
        } 
        else{
          if(visitorURL != null || visitorURL != undefined || visitorURL != "")
          {
            const pathDate = Date.now();
            const pathShortId = shortid.generate();
            const newVisitorPath = new visitorpathModel({
              path_id: pathShortId,
              visitor_id: result.visitor_id,
              visitor_name: result.visitor_name,
              visitor_email: result.visitor_email,
              visitor_uniqueNum: result.visitor_uniqueNum,
              completePath: visitorURL,
              createdOn: pathDate
            });
            newVisitorPath.save(function(err, result) {
              if (result == null || result == undefined || result == "") {
                newVisitorPath.save();
              } 
            });
          }  
        }
      }
    );

                 

    //#endregion

    res.render("newvisitorsignup", {
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

  router.get("/newchatwidget", auth.loggedIn, function(req, res) { 
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
    //console.log(geoLocValuePrivate);
    //geoLocValuePrivate = [];
    //console.log(geoLocValue);

    res.render("newchatwidget", {
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

  router.get("/newchatwidget2", auth.loggedIn, function(req, res) { 
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
    //console.log(geoLocValuePrivate);
    //geoLocValuePrivate = [];
    //console.log(geoLocValue);

    res.render("newchatwidget2", {
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
  router.post("/api/v1/signup", function(req, res) 
  {
    console.log('data ajao',req.body);

   var visitorURL = "";
   var visitorHASH = req.body.hash;
   var visitorHost = "";
   
  //  console.log(req.body.hash);
  //  console.log(req.body.visitor_web_path);
  //  console.log(req.body.visitor_TimezoneLocation);

   if(req.body.visitor_web_path != null || req.body.visitor_web_path != undefined || req.body.visitor_web_path != "")
   {
     visitorURL = req.body.visitor_web_path;
   }
   if(req.headers.host != null || req.headers.host != undefined || req.headers.host != "")
   {
     visitorHost = req.headers.host;
   }
   console.log('visitorHASH  --- ',visitorHASH);
   console.log('visitorURL  --- ',visitorURL);
   console.log('visitorHost  --- ',visitorHost);
    
   visitorModel.findOne(
    { $and: [{ visitor_uniqueNum: visitorHASH }] },
    function(err, result) {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Some Error Occured"
        });

      } else if (result == null || result == undefined || result == "") {

        // res.status(404).json({
        //   success: false,
        //   message: "User Not Found."
        // });
        // brandModel.findOne(
        //   { brand_url: { $regex: '.*' + visitorHost + '.*' } },
        //   function(err, resultBrand) {
        //     if (resultBrand != null || resultBrand != undefined || resultBrand != "") 
        //     {
        //       const todayDate = Date.now();
        //       const id = shortid.generate();
        //       var No_Of_Visits_Val = 1;
        //       const newVisitor = new visitorModel({
        //         visitor_id: id,
        //         visitor_name: "WC_" + id,
        //         visitor_email: "walkingcustomer_" + id + "@dc.com",
        //         visitor_uniqueNum: visitorHASH,
        //         phone_number: "000",
        //         web_path: visitorURL,
        //         brand_id : resultBrand.brand_id,
        //         brand_name : resultBrand.brand_name,
        //         visitor_publicIp: publicIpValue,
        //         visitor_privateIp: privateIpValue,
        //         visitor_region_publicIp: geoLocValue,
        //         visitor_region_privateIp: geoLocValuePrivate,
        //         visitor_browser_and_os: browserAndOSValue,
        //         no_of_visits : No_Of_Visits_Val,
        //         createdOn: todayDate,
        //         updatedOn: todayDate
        //       });
            
        //       newVisitor.save(function(err, result) {
        //         if (err) {
        //           console.log('error 1');
        //           res.status(500).json({
        //             success: false,
        //             message: "Some Error Occured"
        //           });
            
        //         } else if (result == null || result == undefined || result == "") {
        //           console.log('error 2');
        //           res.status(404).json({
        //             success: false,
        //             message: "Data Not Found"
        //           });
            
        //         } 
        //         else 
        //         {
        //           //console.log('solve');
        //           if(visitorURL != null || visitorURL != undefined || visitorURL != "")
        //           {
        //             const pathDate = Date.now();
        //             const pathShortId = shortid.generate();
        //             const newVisitorPath = new visitorpathModel({
        //               path_id: pathShortId,
        //               visitor_id: result.visitor_id,
        //               visitor_name: result.visitor_name,
        //               visitor_email: result.visitor_email,
        //               visitor_uniqueNum: result.visitor_uniqueNum,
        //               completePath: visitorURL,
        //               createdOn: pathDate
        //             });
        //             newVisitorPath.save();
        //           }

        //           console.log('!!! new visitor');
        //           req.user = result;
        //           req.session.user = result;
        //           req.session.save();
        //           res.redirect("/newchat");
        //         }
        //       });
        //     }
        //   });

      } 
      else 
      {
        var No_Of_Visits_Val = result.no_of_visits + 1;
        console.log(No_Of_Visits_Val);
        visitorModel.update({visitor_uniqueNum: visitorHASH }, 
          {
            "$set":
            {
              no_of_visits: parseInt(No_Of_Visits_Val)
            }
          }, function(err, result) {
            if (err) {
              console.log('00000000');
      
            } else if (result == null || result == undefined || result == "") {
      
              console.log('111111111');
      
            } 
            else 
            {
              console.log('222222222');
             }
          });
          console.log('asdasdasdasd',visitorHASH);

        if(visitorURL != null || visitorURL != undefined || visitorURL != "")
        {
          const pathDate = Date.now();
          const pathShortId = shortid.generate();
          const newVisitorPath = new visitorpathModel({
            path_id: pathShortId,
            visitor_id: result.visitor_id,
            visitor_name: result.visitor_name,
            visitor_email: result.visitor_email,
            visitor_uniqueNum: result.visitor_uniqueNum,
            completePath: visitorURL,
            createdOn: pathDate
          });
          newVisitorPath.save();
        }
                  
        console.log('!!! old visitor');
        req.user = result;
        req.session.user = result;
        req.session.save();
        //console.log(req.session.user);
        //return Json(output, JsonRequestBehavior.AllowGet);
        res.send(result);
        // res.redirect("/newchat");
        // res.status(200).json({
        //   success: true,
        //   visitor: req.session.user
        // });
       }
    });
 });


 router.post("/api/v1/updatevisitorinfo", function(req, res) 
  {
    
   var visitorHASH = req.body.hash;
   
  

   console.log('visitorHASH  --- ',visitorHASH);
   
    
   visitorModel.findOne(
    { $and: [{ visitor_uniqueNum: visitorHASH }] },
    function(err, result) {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Some Error Occured"
        });

      } else if (result == null || result == undefined || result == "") {

        res.status(500).json({
          success: false,
          message: "Some Error Occured"
        });

      } 
      else 
      {
        
        visitorModel.update({visitor_uniqueNum: visitorHASH }, 
          {
            "$set":
            {
              visitor_name: req.body.username,
              visitor_email: req.body.email,
              phone_number: req.body.phone_number
            }
          }, {"multi": true}, function(err, result) {
            if (err) {
              console.log('00000000');
      
            } else if (result == null || result == undefined || result == "") {
      
              console.log('111111111');
      
            } 
            else 
            {
              console.log('222222222');
             }
          });
          console.log('asdasdasdasd',visitorHASH);

        
                  
        console.log('!!! old visitor');
        //req.user = result;
        //req.session.user = result;
        //req.session.save();
        //console.log(req.session.user);
        //return Json(output, JsonRequestBehavior.AllowGet);
        res.json("success");
        // res.redirect("/newchat");
        // res.status(200).json({
        //   success: true,
        //   visitor: req.session.user
        // });
       }
    });
 });

  //route for logout
  router.get("/newvisitorlogout", function(req, res) {
    delete req.session.user;
    res.redirect("/newvisitor/newvisitorsignup");
  });


  app.use("/newvisitor", router);

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
