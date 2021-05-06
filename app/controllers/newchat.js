const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
var geoip = require('geoip-lite');
const publicIp = require('public-ip');
const router = express.Router();


var privateIpValue;
var publicIpValue;
var geoLocValue;
var geoLocValuePrivate;
var browserAndOSValue;
//var globalVisitorId;


const auth = require("../../middlewares/auth.js");

const visitorModel = mongoose.model("visitor");
const visitorpathModel = mongoose.model("visitorPath");
const brandModel = mongoose.model("Brand");

module.exports.controller = function(app) {
  
  //route for chat
  
  app.get("/newchat", function(req, res) 
  {  
    //console.log('umair');
    //console.log('url visitor', req.headers.referer);
    const visitor_id = shortid.generate();
    var visitorURL = "";
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
        if(geoip.lookup(privateIpValue) == null){
          return [];
        }
        else{
          return geoip.lookup(privateIpValue);
        }
      }
      else{
        if(geoip.lookup(privateIpbreak) == null){
          return [];
        }
        else{
          return geoip.lookup(privateIpbreak);
        }
      }
    })();

    res.render("newchat", {
      title: "Chat",
      //user: visitor_id, //globalVisitorId,
      chat: req.session.chat,
      publicip: publicIpValue,
      privateip: privateIpValue,
      geoloc: geoLocValue,
      geolocprivate: geoLocValuePrivate,
      browserandos: browserAndOSValue
    });
  });

  //api to create new user
  app.post("/api/v1/newchat", function(req, res) 
  {
    //console.log('umaiz');
    //console.log('data ajao',req.body);

   var visitorURL = "";
   var visitorHASH = req.body.hash;
   var visitorNewID = req.body.visitorId;
   var visitorTZ_Loc = req.body.visitor_TimezoneLocation;
   var visitorHost = "";
   var visitorCompleteWebPath = "";
   
  //  console.log(req.body.hash);
  //  console.log(req.body.visitor_web_path);
  // console.log(req.body.visitor_TimezoneLocation);
  // console.log('visitorNewID',visitorNewID);

   if(req.body.visitor_web_path != null || req.body.visitor_web_path != undefined || req.body.visitor_web_path != "")
   {
     visitorURL = req.body.visitor_web_path;
   }
   if(req.body.visitor_complete_web_path != null || req.body.visitor_complete_web_path != undefined || req.body.visitor_complete_web_path != "")
   {
    visitorCompleteWebPath = req.body.visitor_complete_web_path;
   }
   if(req.headers.host != null || req.headers.host != undefined || req.headers.host != "")
   {
     visitorHost = req.headers.host;
   }
  //  console.log('visitorHASH  --- ',visitorHASH);
    console.log('visitorURL  --- ',visitorURL);
    console.log('visitorHost  --- ',visitorHost);
    console.log('visitorCompleteWebPath  --- ',visitorCompleteWebPath);
  //  console.log('visitorTZ_Loc  --- ',visitorTZ_Loc);
  //  console.log('visitorNewID  --- ',visitorNewID);
    
   visitorModel.findOne(
    { $and: [{ visitor_uniqueNum: visitorHASH, visitor_id: visitorNewID }] },
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

        //visitorURL = 'webjazeera';
        brandModel.findOne(
          { brand_url: { $regex: '.*' + visitorURL + '.*' } },
          function(err, resultBrand) {
            if (resultBrand != null || resultBrand != undefined || resultBrand != "") 
            {
              console.log("brand name",resultBrand.brand_name);
              const todayDate = Date.now();
              //const id = shortid.generate();
              var No_Of_Visits_Val = 1;
              const newVisitor = new visitorModel({
                visitor_id: visitorNewID,
                visitor_name: "WC_" + visitorNewID,
                visitor_email: "walkingcustomer_" + visitorNewID + "@dc.com",
                visitor_uniqueNum: visitorHASH,
                phone_number: "000",
                web_path: visitorURL,
                brand_id : resultBrand.brand_id,
                brand_name : resultBrand.brand_name,
                visitor_publicIp: publicIpValue,
                visitor_privateIp: privateIpValue,
                visitor_region_publicIp: geoLocValue,
                visitor_region_privateIp: geoLocValuePrivate,
                visitor_browser_and_os: browserAndOSValue,
                visitor_TimezoneLocation: visitorTZ_Loc,
                no_of_visits : No_Of_Visits_Val,
                createdOn: todayDate,
                updatedOn: todayDate
              });
            
              newVisitor.save(function(err, resultNewVisSave) {
                if (err) {
                  console.log('error 1');
                  res.status(500).json({
                    success: false,
                    message: "Some Error Occured"
                  });
            
                } else if (resultNewVisSave == null || resultNewVisSave == undefined || resultNewVisSave == "") {
                  console.log('error 2');
                  res.status(404).json({
                    success: false,
                    message: "Data Not Found"
                  });
            
                } 
                else 
                {
                  // var No_Of_Visits_Val = result.no_of_visits + 1;
                  // console.log(No_Of_Visits_Val);
                  // visitorModel.update({visitor_uniqueNum: visitorHASH }, 
                  //   {
                  //     "$set":
                  //     {
                  //       no_of_visits: parseInt(No_Of_Visits_Val)
                  //     }
                  //   }, function(err, result) {
                  //     if (err) {
                  //       console.log('00000000');
                
                  //     } else if (result == null || result == undefined || result == "") {
                
                  //       console.log('111111111');
                
                  //     } 
                  //     else 
                  //     {
                  //       console.log('222222222');
                  //     }
                  //   });
                  //console.log('solve');
                  if(visitorCompleteWebPath != null || visitorCompleteWebPath != undefined || visitorCompleteWebPath != "")
                  {
                    const pathDate = Date.now();
                    const pathShortId = shortid.generate();
                    const newVisitorPath = new visitorpathModel({
                      path_id: pathShortId,
                      visitor_id: resultNewVisSave.visitor_id,
                      visitor_name: resultNewVisSave.visitor_name,
                      visitor_email: resultNewVisSave.visitor_email,
                      visitor_uniqueNum: resultNewVisSave.visitor_uniqueNum,
                      completePath: visitorCompleteWebPath,
                      createdOn: pathDate
                    });
                    newVisitorPath.save();
                  }

                  console.log('!!! new visitor');
                  req.user = result;
                  req.session.user = result;
                  req.session.save();
                  //res.redirect("/newchat");
                  res.send(result);
                  //return result;
                }
              });
            }
          });

      } 
      else 
      {

        visitorModel.countDocuments({visitor_uniqueNum: visitorHASH }, function(err, countResult) {
          //var No_Of_Visits_Val = result.no_of_visits + 1;
          console.log(countResult);
          visitorModel.update({ visitor_uniqueNum: visitorHASH, visitor_id: visitorNewID }, 
            {
              "$set":
              {
                no_of_visits: parseInt(countResult)
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

          console.log('solve');

          if(visitorCompleteWebPath != null || visitorCompleteWebPath != undefined || visitorCompleteWebPath != "")
          {
            const pathDate = Date.now();
            const pathShortId = shortid.generate();
            const newVisitorPath = new visitorpathModel({
              path_id: pathShortId,
              visitor_id: result.visitor_id,
              visitor_name: result.visitor_name,
              visitor_email: result.visitor_email,
              visitor_uniqueNum: result.visitor_uniqueNum,
              completePath: visitorCompleteWebPath,
              createdOn: pathDate
            });
            newVisitorPath.save();
          }
        });
                  
        console.log('!!! old visitor', result.visitor_id);
        //globalVisitorId = result.visitor_id;
        req.user = result;
        req.session.user = result;
        req.session.save();
        //console.log(req.session.user);
        //return Json(output, JsonRequestBehavior.AllowGet);
        res.send(result);
        //res.redirect("/newchat");
        // res.status(200).json({
        //   success: true,
        //   visitor: req.session.user
        // });
       }
    });
 });


  app.get("/newchat_old", auth.checkLogin, function(req, res) 
  {  
    // console.log('url chat', req.headers.referer);
    console.log('user data', req.session.user.visitor_name);
    if(req.session.user == undefined){
      res.redirect("newvisitor/newvisitorsignup");
      //res.redirect("/newvisitor/newchatwidget");
      // res.status(404).json({
      //   success: false,
      //   message: "user session expires"
      // });
    }

    // if(req.headers.referer != undefined)
    // {
    //   const today = Date.now();
    //   const id = shortid.generate();
    //   const newVisitorPath = new visitorpathModel({
    //     path_id: id,
    //     visitor_id: req.session.user.visitor_id,
    //     visitor_name: req.session.user.visitor_name,
    //     visitor_email: req.session.user.visitor_email,
    //     visitor_uniqueNum: req.session.user.visitor_uniqueNum,
    //     completePath: req.headers.referer,
    //     createdOn: today
    //   });
    //   newVisitorPath.save(function(err, result) {
    //     if (result == null || result == undefined || result == "") {
    //       newVisitorPath.save();
    //     } 
    //   });
    // }

    res.render("newchat", {
      title: "Chat Home",
      user: req.session.user,
      chat: req.session.chat
      // user: {
      //   visitor_id : 'U26uop19l',
      //   visitor_name : 'WC_jv8VaT7Mw'
      // }
    });
    
    // res.status(200).json({
    //   success: true,
    //   user: req.session.user,
    //   chat: req.session.chat
    // });
  });


    //api to create new user
    app.post("/api/v1/newchat_old", function(req, res) 
    {
      //console.log('umaiz');
      console.log('data ajao',req.body);
  
     var visitorURL = "";
     var visitorHASH = req.body.hash;
     var visitorNewID = req.body.visitorId;
     var visitorTZ_Loc = req.body.visitor_TimezoneLocation;
     var visitorHost = "";
     
    //  console.log(req.body.hash);
    //  console.log(req.body.visitor_web_path);
    // console.log(req.body.visitor_TimezoneLocation);
    // console.log('visitorNewID',visitorNewID);
  
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
     console.log('visitorTZ_Loc  --- ',visitorTZ_Loc);
      
     visitorModel.findOne(
      { $and: [{ visitor_uniqueNum: visitorHASH }] },
      function(err, result) {
        if (err) {
          res.status(500).json({
            success: false,
            message: "Some Error Occured"
          });
  
        } else if (result == null || result == undefined || result == "") {
  
          res.status(404).json({
            success: false,
            message: "User Not Found."
          });
          brandModel.findOne(
            { brand_url: { $regex: '.*' + visitorURL + '.*' } },
            function(err, resultBrand) {
              if (resultBrand != null || resultBrand != undefined || resultBrand != "") 
              {
                const todayDate = Date.now();
                //const id = shortid.generate();
                var No_Of_Visits_Val = 1;
                const newVisitor = new visitorModel({
                  visitor_id: visitorNewID,
                  visitor_name: "WC_" + visitorNewID,
                  visitor_email: "walkingcustomer_" + visitorNewID + "@dc.com",
                  visitor_uniqueNum: visitorHASH,
                  phone_number: "000",
                  web_path: visitorURL,
                  brand_id : resultBrand.brand_id,
                  brand_name : resultBrand.brand_name,
                  visitor_publicIp: publicIpValue,
                  visitor_privateIp: privateIpValue,
                  visitor_region_publicIp: geoLocValue,
                  visitor_region_privateIp: geoLocValuePrivate,
                  visitor_browser_and_os: browserAndOSValue,
                  no_of_visits : No_Of_Visits_Val,
                  createdOn: todayDate,
                  updatedOn: todayDate
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
                      newVisitorPath.save();
                    }
  
                    console.log('!!! new visitor');
                    req.user = result;
                    //req.session.user = result;
                    //req.session.save();
                    //res.redirect("/newchat");
                    //res.send(result);
                    return result;
                  }
                });
              }
            });
  
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
                    
          console.log('!!! old visitor', result.visitor_id);
          //globalVisitorId = result.visitor_id;
          req.user = result;
          req.session.user = result;
          req.session.save();
          //console.log(req.session.user);
          //return Json(output, JsonRequestBehavior.AllowGet);
          res.send(result);
          //res.redirect("/newchat");
          // res.status(200).json({
          //   success: true,
          //   visitor: req.session.user
          // });
         }
      });
   });


  app.use(router);
}; //Chat controller end.


var getClientPrivateIp = function(req) {
  var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (!ipAddress) {
    return '';
  }
  if (ipAddress.substr(0, 7) == "::ffff:") {
    ipAddress = ipAddress.substr(7)
  }return ipAddress;
};

var getClientPublicIp = (async () => {
  var pIp = await publicIp.v4();
  return pIp;
})();