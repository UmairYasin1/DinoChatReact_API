const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");

const router = express.Router();

const brandModel = mongoose.model("Brand");
const teamModel = mongoose.model("Team");

module.exports.controller = function(app) {
  
  router.get("/allbrands", function(req, res) {
    brandModel.find({}, function(err, data) {
        if (err) 
        {
            res.status(500).json({
              success: false,
              message: "Some Error Occured In Brands"
            });  
        } 
        else if (data == null || data == undefined || data == "") 
        {
            res.status(404).json({
              success: false,
              message: "Brands Not Found"
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

  router.post("/api/v1/addbrand", function(req, res) {
    
    //console.log(req.body);  
    const today = Date.now();
    const id = shortid.generate();

    const newBrand = new brandModel({
      brand_id: id,
      brand_name: req.body.brand_name,
      brand_url: req.body.brand_url,
      brand_teamId: req.body.brand_teamId,
      createdOn: today
    });

    newBrand.save(function(err, result) {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Some Error Occured During Brand Adding",
          error: err
        });

      } else if (result == null || result == undefined || result == "") {

        res.status(404).json({
          success: false,
          message: "Data Not Found."
        });

      } else {
        res.status(200).json({
          success: true,
          message: "Brand added"
        });
      }
    });

  });

  router.get("/teambrands", function(req, res) {
    //console.log('teambrands',req.query.brand_teamId);
    //console.log('teambrands',req.body);
    
    brandModel.find({ $and: [{ brand_teamId: req.query.brand_teamId }] }, function(err, data) {
        if (err) 
        {
            res.status(500).json({
              success: false,
              message: "Some Error Occured In Brands"
            });  
        } 
        else if (data == null || data == undefined || data == "") 
        {
            res.status(404).json({
              success: false,
              message: "Brands Not Found."
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
