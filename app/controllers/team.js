const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const teamModel = mongoose.model("Team");

module.exports.controller = function(app) {

    router.get("/allteams", function(req, res) 
    {
        teamModel.find({}, function(err, data) 
        {
            if (err) 
            {
                res.status(500).json({
                  success: false,
                  message: "Some Error Occured In Teams"
                });  
            } 
            else if (data == null || data == undefined || data == "") 
            {
                res.status(404).json({
                  success: false,
                  message: "Teams Not Found"
                });
            } 
            else 
            {
                res.status(200).json({
                  success: true,
                  teamList: data
                });
            }
        });
      });
      
  app.use("/team", router);
}; //signup controller end
