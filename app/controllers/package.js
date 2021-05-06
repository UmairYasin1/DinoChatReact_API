const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const packageModel = mongoose.model("Package");

module.exports.controller = function(app) {
  
  router.get("/allpackages", function(req, res) {
    packageModel.find({}, function(err, data) {
        if (err) 
        {
            res.status(500).json({
              success: false,
              message: "Some Error Occured"
            });  
        } 
        else if (data == null || data == undefined || data == "") 
        {
            res.status(404).json({
              success: false,
              message: "Data Not Found"
            });
        } 
        else 
        {
            res.status(200).json({
              success: true,
              packageList: data
            });
        }
    });
  });

  app.use("/package", router);
}; //signup controller end
