const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const brandModel = mongoose.model("Brand");

module.exports.controller = function(app) {
  
  router.get("/allbrands", function(req, res) {
    brandModel.find({}, function(err, data) {
        if (err) 
        {
            res.status(500).json({
              success: false,
              message: "Some Error Occured During Login"
            });  
        } 
        else if (data == null || data == undefined || data == "") 
        {
            res.status(404).json({
              success: false,
              message: "User Not Found. Please Check Your Username and Password."
            });
        } 
        else 
        {
            res.status(200).json({
              success: true,
              brandList: data
            });
        }
    });
  });

  app.use("/brand", router);
}; //signup controller end
