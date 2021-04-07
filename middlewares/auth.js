const mongoose = require("mongoose");

module.exports.checkLogin = function(req, res, next) {
  //console.log('chhotaa',req);
  if (!req.user && !req.session.user) {
    //console.log('chhota');
    // console.log(req.user);
    // console.log(req.session.user);
    //res.redirect("/visitor/visitorsignup");
    res.redirect("/newvisitor/newvisitorsignup");
    //res.redirect("/newvisitor/newchatwidget");
    
    // res.status(404).json({
    //   success: false,
    //   message: "user session expires"
    // });
  } else {
    //console.log('hussainn');
    // res.rem
    req.session.user = req.session.user;
    req.chat = req.session.chat;
    next();
    //res.render("/newvisitor/newchatwidget", req);
    // res.status(200).json({
    //   success: true,
    //   user: req.session.user,
    //   chat: req.session.chat
    // });
  }
};

module.exports.loggedIn = function(req, res, next) {
  if (!req.user && !req.session.user) {
    next();
  } else {
    //res.redirect("/chat");
    res.redirect("/newchat");
    //res.redirect("/newvisitor/newchatwidget");
    // res.status(200).json({
    //   success: true,
    //   user: req.session.user,
    //   chat: req.session.chat
    // });
  }
};
