const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const visitorModel = mongoose.model("visitor");

module.exports.controller = function(app) {

  

//   router.get("/getBrandVisitorsCount", function(req, res) 
//   {
//     visitorModel.find({}, function(err, data) {
//       if (err) 
//       {
//           res.status(500).json({
//             success: false,
//             message: "Some Error Occured In Agents"
//           });  
//       } 
//       else if (data == null || data == undefined || data == "") 
//       {
//           res.status(404).json({
//             success: false,
//             message: "Agents Not Found"
//           });
//       } 
//       else 
//       {
//           res.status(200).json({
//             success: true,
//             agentList: data
//           });
//       }
//     });
//   });

  router.get("/getBrandVisitorsCount", function(req, res) 
  {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    visitorModel.find({ $and: [{ 
        brand_id: req.query.brand_id, 
        // createdOn: {$gte: startOfToday, $lt: startOfToday} 
        createdOn: {$gte: startOfToday} 
    }] }, function(err, data) {
      if (err) 
      {
          res.status(500).json({
            success: false,
            visitorsCountList: data.length
          });  
      } 
      else if (data == null || data == undefined || data == "") 
      {
          res.status(404).json({
            success: false,
            visitorsCountList: data.length
          });
      } 
      else 
      {
          res.status(200).json({
            success: true,
            visitorsCountList: data.length
          });
      }
    });
  });

  app.use("/dashboardstats", router);
}; 
