const express = require("express");
const stripe_sdk = require("stripe");
const mongoose = require("mongoose");
const shortid = require("shortid");

const stripe = new stripe_sdk('sk_test_51IRe6wGfVJkUd1MAFGoPeg4jKsTJepedpgydnvY6QiS5zTlzp20QohFgfbyEoOMWufyPEggBBfxJNBpT9n2FWT3t00JqUC1udz');

const router = express.Router();

const paymentModel = mongoose.model("Payment");

module.exports.controller = function(app) {
  
  //api to create new user
  router.post("/api/v1/customerPayment", function(req,res) {
      // console.log('asdhajsgdjasdgasd req.data', req.body.cus_token);
      // console.log('agentId req.data', req.body.agentId);
      // console.log('visitorId req.data', req.body.visitorId);
      // console.log('amount req.data', req.body.amount);
    const today = Date.now();
    const id = shortid.generate();
    var pkgAmountVal = req.body.amount * 100;
    stripe.charges.create({
        amount: pkgAmountVal,
        currency: 'usd',
        source: req.body.cus_token,
        description: 'Web Jazeera | DinoChat'
    }, (err, charge) => {
        if(err) {
           console.log(err);
        } else {
           //console.log(charge);

        const newPayment = new paymentModel({
            paymentId: id,
            visitor_Id: req.body.visitorId,
            agent_Id: req.body.agentId,
            amount: pkgAmountVal,
            source: req.body.cus_token,
            description: 'Web Jazeera | DinoChat',
            status: charge.status,
            receipt_url: charge.receipt_url,
            createdOn: today
        });
    
        newPayment.save(function(err, result) {
          if (err) {
            console.log("Error " + err);
            //return "error";
            res.json("error");
          } else if (result == undefined || result == null || result == "") {
            console.log("Result Undefined " + result);
            //return "error";
            res.json("error");
          } else {
            //console.log("Payment Success " + result);
            //return "success";
            res.json("success");
          }
        });

        }
    });

    //create user.
    //res.json("success");
  });


  app.use("/payment", router);
}; //signup controller end
