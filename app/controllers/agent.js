const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");

//middlewares
const auth = require("../../middlewares/auth.js");
const validator = require("../../middlewares/validator.js");
const encrypt = require("../../libs/encrypt.js");

const router = express.Router();

const agentModel = mongoose.model("agent");

module.exports.controller = function(app) {

  router.get("/agentlogin", function(req, res) {
    res.status(200).json({
      success: true,
      user: req.session.user,
      chat: req.session.chat
    });
  });

  router.get("/agentsignup", function(req, res) {
    res.status(200).json({
      success: true,
      user: req.session.user,
      chat: req.session.chat
    });
  });

  router.get("/dashboard", function(req, res) {
    if(req.session.user == undefined){
      res.status(404).json({
        success: false,
        message: "session expired"
      });
    }
    else{
      res.status(200).json({
        success: true,
        user: req.session.user,
        chat: req.session.chat
      });
    }
  });

  //route for login
  router.post("/api/v1/login",  function(req, res) {
    
    const epass = encrypt.encryptPassword(req.body.password);
    const token = Buffer.from(`${req.body.email}:${req.body.password}`, 'utf8').toString('base64');
    
    
    agentModel.findOne(
      { $and: [{ agent_email: req.body.email }, { agent_password: epass }] },
      function(err, result) {
        if (err) {
          res.status(500).json({
            success: false,
            message: "Some Error Occured During Login"
          });

        } 
        else if (result == null || result == undefined || result == "") 
        {
          res.status(404).json({
            success: false,
            message: "User Not Found. Please Check Your Username and Password."
          });

        } else {
          req.agent = result;
          delete req.agent.password;
          req.session.agent = result;
          delete req.session.agent.password;
          res.status(200).json({
            success: true,
            agent: req.session.agent,
            email: req.body.email,
            accessToken : token
          });
        }
      }
    );

  });

  //api to create new user
  router.post("/api/v1/signup", function( req, res) {
    
    const today = Date.now();
    const id = shortid.generate();
    const epass = encrypt.encryptPassword(req.body.password);
    const token = Buffer.from(`${req.body.agent_email}:${req.body.password}`, 'utf8').toString('base64');

   // //create user.
    const newAgent = new agentModel({
        agent_id: id,
        agent_name: req.body.agent_name.replace(/\s/g, ''),
        agent_email: req.body.agent_email,
        agent_phone: req.body.phone_number,
        agent_password: epass,
        agent_teamId: req.body.agent_teamId,
        agent_status: '1',
        agent_ip: today,
        createdOn: today,
        updatedOn: today
    });

    newAgent.save(function(err, result) {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Some Error Occured During Signup",
          error: err
        });

      } else if (result == null || result == undefined || result == "") {

        res.status(404).json({
          success: false,
          message: "User Not Found. Please Check Your Username and Password."
        });

      } else {
        req.agent = result;
        delete req.agent.password;
        req.session.agent = result;
        delete req.session.agent.password;
        // res.status(200).send('Agent has been created');
        res.status(200).json({
          success: true,
          agent: req.session.agent,
          email: req.body.agent_email,
          accessToken : token
        });
      }
    });

  });

  router.get("/allagents", function(req, res) {
    res.status(200).json({
      success: true,
      user: req.session.user,
      chat: req.session.chat
    });
  });

  router.get("/getAllAgents", function(req, res) 
  {
    agentModel.find({}, function(err, data) {
      if (err) 
      {
          res.status(500).json({
            success: false,
            message: "Some Error Occured In Agents"
          });  
      } 
      else if (data == null || data == undefined || data == "") 
      {
          res.status(404).json({
            success: false,
            message: "Agents Not Found"
          });
      } 
      else 
      {
          res.status(200).json({
            success: true,
            agentList: data
          });
      }
    });
  });

  router.get("/getTeamAgents", function(req, res) 
  {
    agentModel.find({ $and: [{ agent_teamId: req.body.team_Id }] }, function(err, data) {
      if (err) 
      {
          res.status(500).json({
            success: false,
            message: "Some Error Occured In Agents"
          });  
      } 
      else if (data == null || data == undefined || data == "") 
      {
          res.status(404).json({
            success: false,
            message: "Agents Not Found"
          });
      } 
      else 
      {
          res.status(200).json({
            success: true,
            agentList: data
          });
      }
    });
  });

  router.get("/currentAgentInSession", function(req, res) {
    res.status(200).json({
      success: true,
      user: req.session.user,
      chat: req.session.chat
    });
  });

  router.get("/agentlogout", function(req, res) {
    delete req.session.user;
    delete req.session.chat;
    res.status(200).json({
      success: true,
      message: "session logout"
    });
  });

  router.post("/api/v1/changepassword", function( req, res) {
    
    const epass = encrypt.encryptPassword(req.body.password);
    const token = Buffer.from(`${req.body.agent_email}:${req.body.password}`, 'utf8').toString('base64');

    agentModel.findOne(
      { $and: [{ agent_email: req.body.agent_email }] },
      function(err, result) {
        if (err) {
          res.status(500).json({
            success: false,
            message: "Some Error Occured On Changing Password"
          });

        } else if (result == null || result == undefined || result == "") {

          res.status(404).json({
            success: false,
            message: "User Not Found. Please Check Your Email."
          });

        } else {

          agentModel.updateOne({agent_email: req.body.agent_email}, {"$set":{agent_password: epass}}, (err, updateRes) => {
            if (err) {
              res.status(500).json({
                success: false,
                message: "Some Error Occured On Changing Password. Response Failure."
              });
    
            } else if (updateRes == null || updateRes == undefined || updateRes == "") {
    
              res.status(404).json({
                success: false,
                message: "User Not Found. Please Check Your Email. Changing Password Failure."
              });
    
            }
            else
            {
              //result.agent.password = epass;
              // console.log('mmmm', result);
              // console.log('qqqq', updateRes);
              // req.agent = result;
              // delete req.agent.password;
              // req.session.agent = result;
              // delete req.session.agent.password;

              res.status(200).json({
                success: true,
                message: "Password has been changed successfully. New password is " + epass
              });
            }
          });
        }
      }
    );
   
  });

  app.use("/agent", router);
}; //signup controller end
