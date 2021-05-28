const socketio = require("socket.io");
const mongoose = require("mongoose");
const events = require("events");
const _ = require("lodash");
const shortid = require("shortid");
var moment = require('moment');
const eventEmitter = new events.EventEmitter();

//adding db models
require("../app/models/user.js");
require("../app/models/chat.js");
require("../app/models/room.js");
require("../app/models/agent.js");
require("../app/models/visitor.js");
require("../app/models/brand.js");
require("../app/models/visitorpath.js");
require("../app/models/package.js");
require("../app/models/team.js");

//using mongoose Schema models
const userModel = mongoose.model("User");
const chatModel = mongoose.model("Chat");
const roomModel = mongoose.model("Room");
const agentModel = mongoose.model("agent");
const visitorModel = mongoose.model("visitor");
const brandModel = mongoose.model("Brand");
const visitorpathModel = mongoose.model("visitorPath");
const packageModel = mongoose.model("Package");
const teamModel = mongoose.model("Team");

//reatime magic begins here
module.exports.sockets = function(http) {
  ioDirect = socketio.listen(http);

  //setting chat route
  const ioChat = ioDirect.of("/chat");
  //ioChat = socketio.listen(http);
  const userStack = {};
  const visitorStack = {};
  const agentStack = {};
  let oldChats, sendUserStack, setRoom , sendVisitorStack, sendAgentStack;
  const userSocket = {};
  const visitorSocket = {};
  const agentSocket = {};

  var allClients = [];

  var isReadVisitorId = 0;
  var currentClickedVisitorArray = [];
  var isReadMsgId = 0;
  // socket io direct on
  // ioDirect.on("connection", function(socket) {
  //   console.log("socketio connected.");
    
  //   socket.on("disconnect", function() {

  //   console.log("chat disconnected.");
    
  //   }); 
  // }); 

  //socket.io magic starts here
  ioChat.on("connection", function(socket) {
    console.log("socketio chat connected.");
    allClients.push(socket);



    socket.emit('testSumair');
    // socket.on('testSumair',function(){
    //           console.log('test');
    //           });
    
    //socket.emit('sumair');
    //function to get user name
    socket.on("set-user-data", function(username) {
      // const username = 'rBXxhnFCR';
      console.log(username + "  logged In");

      //storing variable.
      socket.username = username;
      userSocket[socket.username] = socket.id;
      visitorSocket[socket.username] = socket.id;
      agentSocket[socket.username] = socket.id;

      socket.broadcast.emit("broadcast", {
        description: username + " Logged In"
      });

      //getting all users list
      eventEmitter.emit("get-all-visitors");

      //sending all users list. and setting if online or offline.
      sendVisitorStack = function() {
        for (i in visitorSocket) {
          for (j in visitorStack) {
            if (j == i) {
              visitorStack[j] = "Online";
              //console.log(visitorStack);
            }
          }
        }
        //for popping connection message.
        //console.log('visitorStack',visitorStack);
        ioChat.emit("onlineStack", visitorStack);    
      }; //end of sendUserStack function.

      //getting all agents list
      eventEmitter.emit("get-all-agents");

      //sending all agent list. and setting if online or offline.
      sendAgentStack = function() {
        for (i in agentSocket) {
          for (j in agentStack) {
            if (j == i) {
              agentStack[j] = "Online";
            }
          }
        }
        //for popping connection message.
        ioChat.emit("agentsList", agentStack);    
      }; //end of sendUserStack function.

    }); //end of set-user-data event.

  

  socket.on("get_visitor_id", function(obj, callback) 
  {
    var visitId = obj.visitorId;
    var agentId = obj.agentId;
    var agentTeamId = obj.agent_teamId;
    var unReadMsgCountVal = 0;
    // console.log('visitId --1',visitId);
    // console.log('agentId --1',agentId);
    // console.log('agentTeamId --1',agentTeamId);

    visitorModel.findOne(
           { $and: [{ visitor_id: visitId }] },
           function(err, result) 
           {

            if(err)
            {
              visit_name =  "";
              agent_name = "";

              // response = { visitor_id: visitId , visitor_name : visit_name , agent_name : agent_name,
              //   country: countryVal,
              //   browser: browserVal,
              //   os: osVal,
              //   platform: platformVal,
              //   ipaddress : ipAddressVal,
              //   totalhournumber : totalHoursVal,
              //   totaltimeshort : totalTimeShortVal,
              //   totaltimelong : totalTimeExpVal,
              //   createdate : createdDateVal,
              //   createdOn : result.createdOn,
              //   payment_link : result.payment_link,
              //   brand_name : result.brand_name,
              //   brand_id : result.brand_id,
              //   phone_number : result.phone_number,
              //   visitor_email : result.visitor_email,
              //   visitor_uniqueNum : result.visitor_uniqueNum,
              //   timezone_location : timezoneLocationVal,
              //   no_of_visits : result.no_of_visits,
              //   web_path: result.web_path,
              //   unReadMsgCount : unReadMsgCountVal
              // }
              response = {}

              callback(response);
            }

            if(result!=null)
            {

              //#region getting values

            //console.log(result.visitor_region_privateIp.length || result.visitor_region_privateIp);
            
            //var countryVal2 = "-";
            // var browserVal2 = "-";
            // var osVal2 = "-";
            // var platformVal2 = "-";
            // var ipAddressVal2 = "-";
            // var totalHoursVal2 = "-";
            // var totalTimeShortVal2 = "-";
            // var totalTimeExpVal2 = "-";
            // var createdDateVal2 = "-";
            //console.log('result new user', result);
            //console.log('result new user created date', result.createdOn);
            var totalHoursVal2 = ( function() {
              date2 = result.createdOn;
              var then = moment(date2, "YYYY-MM-DD'T'HH:mm:ss:SSSZ");
              var now = moment(); 
              var ms = moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"));
              var d = moment.duration(ms);
              var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
              return s;
            })();

            var totalTimeShortVal2 = ( function() {
              date2 = result.createdOn;
              var dateVal = moment(date2, "YYYY-MM-DD'T'HH:mm:ss:SSSZ").fromNow();
              return dateVal;
            })();

            var totalTimeExpVal2 = ( function() {
              date2 = result.createdOn;

              var then = moment(date2, "YYYY-MM-DD'T'HH:mm:ss:SSSZ");
              var now = moment(); 
              var delta = Math.abs(now - then) / 1000;
              var days = Math.floor(delta / 86400);
              delta -= days * 86400;
              var hours = Math.floor(delta / 3600) % 24;
              delta -= hours * 3600;
              var minutes = Math.floor(delta / 60) % 60;
              delta -= minutes * 60;
              var seconds = delta % 60;
              var retVal;
              if(days != 0){
                retVal = days + " day, " + hours + " hour, " + minutes + " min, " + seconds.toFixed(0) + " sec ago";
              }
              else if (hours != 0){
                retVal = hours + " hour, " + minutes + " min, " + seconds.toFixed(0) + " sec ago";
              }
              else if (minutes != 0){
                retVal = minutes + " min, " + seconds.toFixed(0) + " sec ago";
              }
              else{
                retVal = seconds.toFixed(0) + " sec ago";
              }
              return retVal;

            })();

            var createdDateVal2 = ( function() {
              date2 = result.createdOn;
              var comeDate = moment(date2).format('MMMM Do YYYY, h:mm a');
              return comeDate;
            })();

            var countryVal2 = ( function() {
              if(result.visitor_region_privateIp.length != 0)
              {
                return result.visitor_region_privateIp[0].country;
              }
              else if(result.visitor_region_publicIp.length != 0)
              {
                return result.visitor_region_publicIp[0].country;
              }
              else{
                return "-";
              }
            })();

            var browserVal2 = ( function() {
              if(result.visitor_browser_and_os.length != 0)
              {
                return result.visitor_browser_and_os[0].browser;
              }
              else
              {
                return "-";
              }
            })();

            var osVal2 = ( function() {
              if(result.visitor_browser_and_os.length != 0)
              {
                return result.visitor_browser_and_os[0].os;
              }
              else
              {
                return "-";
              }
            })();

            var platformVal2 = ( function() {
              if(result.visitor_browser_and_os.length != 0)
              {
                return result.visitor_browser_and_os[0].platform;
              }
              else
              {
                return "-";
              }
            })();

            var ipAddressVal2 = ( function() {
              if(result.visitor_privateIp != null || result.visitor_privateIp != "")
              {
                return result.visitor_privateIp;
              }
              else if(result.visitor_publicIp != null || result.visitor_publicIp != "")
              {
                return result.visitor_publicIp;
              }
              else{
                return "-";
              }
            })();

            var timezoneLocationVal2 = ( function() {
              if(result.visitor_TimezoneLocation != '')
              {
                return result.visitor_TimezoneLocation;
              }
              else{
                return "-";
              }
            })();


           // console.log(result.visitor_region_privateIp);
            
             var countryVal =  countryVal2;
             var browserVal = browserVal2; //result.visitor_browser_and_os[0].browser;
             var osVal = osVal2; //result.visitor_browser_and_os[0].os;
             var platformVal = platformVal2; //result.visitor_browser_and_os[0].platform;
             var ipAddressVal = ipAddressVal2;
             var totalHoursVal = totalHoursVal2;
             var totalTimeShortVal = totalTimeShortVal2;
             var totalTimeExpVal = totalTimeExpVal2;
             var createdDateVal = createdDateVal2;
             var timezoneLocationVal = timezoneLocationVal2;

            //#endregion

             var  visit_name = result.visitor_name;

             if(visit_name == "")
             {
              console.log('--00000--');
              visit_name =  "";
              agent_name = "";

              
              response = { visitor_id: visitId , visitor_name : visit_name , agent_name : agent_name,
                country: countryVal,
                browser: browserVal,
                os: osVal,
                platform: platformVal,
                ipaddress : ipAddressVal,
                totalhournumber : totalHoursVal,
                totaltimeshort : totalTimeShortVal,
                totaltimelong : totalTimeExpVal,
                createdate : createdDateVal,
                createdOn : result.createdOn,
                payment_link : result.payment_link,
                brand_name : result.brand_name,
                brand_id : result.brand_id,
                phone_number : result.phone_number,
                visitor_email : result.visitor_email,
                visitor_uniqueNum : result.visitor_uniqueNum,
                timezone_location : timezoneLocationVal,
                no_of_visits : result.no_of_visits,
                web_path: result.web_path,
                unReadMsgCount : unReadMsgCountVal
              }

              callback(response); 
             }
             else 
             {
              //console.log('--11111--');
              visit_name =  visit_name;

              roomModel.findOne(
                { 
                  //$and: [{ name1 : visitId, name2 : agentId } || { name1 : visitId, name2 : ""}]
                  $and: [
                          {
                            $or: 
                            [
                              //{ name1 : visitId, name2 : agentId }, 
                              { name1 : visitId, brand_teamId : agentTeamId }, 
                              { name1 : visitId, name2 : '' },
                              { name1 : visitId, name2 : 'tFAE3OWtP' },
                            ]
                          }
                        ] 
                  //$and: [{ name1 : visitId }] 
                },
                function(err, res){

                  if(err)
                  {
                    visit_name =  visit_name;
                    agent_name = "";
                    // response = { visitor_id: visitId , visitor_name : visit_name , agent_name : agent_name,
                    //   country: countryVal,
                    //   browser: browserVal,
                    //   os: osVal,
                    //   platform: platformVal,
                    //   ipaddress : ipAddressVal,
                    //   totalhournumber : totalHoursVal,
                    //   totaltimeshort : totalTimeShortVal,
                    //   totaltimelong : totalTimeExpVal,
                    //   createdate : createdDateVal,
                    //   createdOn : result.createdOn,
                    //   payment_link : result.payment_link,
                    //   brand_name : result.brand_name,
                    //   brand_id : result.brand_id,
                    //   phone_number : result.phone_number,
                    //   visitor_email : result.visitor_email,
                    //   visitor_uniqueNum : result.visitor_uniqueNum,
                    //   timezone_location : timezoneLocationVal,
                    //   no_of_visits : result.no_of_visits,
                    //   web_path: result.web_path,
                    //   unReadMsgCount : unReadMsgCountVal
                    // }
                    response = {}

                      callback(response);
                  }

                  if(res!=null)
                  {
                    //console.log('resppp check 1!!!');
                  if(res.name2 == "")
                  {
                    //console.log('resppp check 2!!!');
                    chatModel.countDocuments({ $and: [{ msgFrom: visitId, isRead: false }] }, function (err, count) {
                      
                      unReadMsgCountVal = count;
                      //console.log('there are %d jungle adventures', unReadMsgCountVal);

                      //console.log('--33333--');
                      //console.log('2 else', res.name2);
                      visit_name =  visit_name;
                      //agent_name = "";
                      agent_name = "Unassigned";

                      //#region visitorPathList

                      var visitorPathList = [];
                      visitorpathModel.find({ $and: [{ visitor_id: visitId }] }, function(err, data) {
                        if (err) 
                        {
                          visitorPathList = {}; 
                        } 
                        else if (data == null || data == undefined || data == "") 
                        {
                          visitorPathList = {};
                        } 
                        else 
                        {
                          //console.log('muzii', data.completePath);
                          // visitorPathList = data;

                          response = { visitor_id: visitId , visitor_name : visit_name , agent_name : agent_name,
                            country: countryVal,
                            browser: browserVal,
                            os: osVal,
                            platform: platformVal,
                            ipaddress : ipAddressVal,
                            totalhournumber : totalHoursVal,
                            totaltimeshort : totalTimeShortVal,
                            totaltimelong : totalTimeExpVal,
                            createdate : createdDateVal,
                            createdOn : result.createdOn,
                            payment_link : result.payment_link,
                            brand_name : result.brand_name,
                            brand_id : result.brand_id,
                            phone_number : result.phone_number,
                            visitor_email : result.visitor_email,
                            visitor_uniqueNum : result.visitor_uniqueNum,
                            timezone_location : timezoneLocationVal,
                            no_of_visits : result.no_of_visits,
                            web_path: result.web_path,
                            unReadMsgCount : unReadMsgCountVal,
                            visitorPathList: data
                          }
                          callback(response);
                        }
                      });
                      //console.log('visitorPathList 2',visitorPathList, res.name1);
                      
                      //#endregion

                    });
                    

                  }
                  else
                  {
                    //console.log('4 else', res.name2);
                    //console.log('result -- 11', res);
                    //console.log('--44444--');
                    
                    visit_name =  visit_name;
                  // agentModel.findOne(
                  //   { $and: [{ agent_id : res.name2}] },
                  //   function(err, resp){
                  //     // console.log('respp!!! ------', res.name2);
                  //     // console.log('respp 222!!! ------', resp);
                  //     chatModel.countDocuments({ $and: [{ msgFrom: res.name1, isRead: false }] }, function (err, count) {
                  //       //console.log('there are %d jungle adventures', count);
                  //       unReadMsgCountVal = count;
                  //       //console.log('where clyde is hardcode',resp.agent_name); 
                  //       //#region visitorPathList
                  //       var visitorPathList = [];
                  //       visitorpathModel.find({ $and: [{ visitor_id: res.name1 }] }, function(err, data) {
                  //         if (err) 
                  //         {
                  //           visitorPathList = {}; 
                  //         } 
                  //         else if (data == null || data == undefined || data == "") 
                  //         {
                  //           visitorPathList = {};
                  //         } 
                  //         else 
                  //         {
                  //           //console.log('muzii', data.completePath);
                  //           // visitorPathList = data;
                  //           response = { visitor_id: res.name1 , visitor_name : visit_name , agent_name : resp.agent_name,//agent_name : 'Clyde',
                  //             country: countryVal,
                  //             browser: browserVal,
                  //             os: osVal,
                  //             platform: platformVal,
                  //             ipaddress : ipAddressVal,
                  //             totalhournumber : totalHoursVal,
                  //             totaltimeshort : totalTimeShortVal,
                  //             totaltimelong : totalTimeExpVal,
                  //             createdate : createdDateVal,
                  //             createdOn : result.createdOn,
                  //             payment_link : result.payment_link,
                  //             brand_name : result.brand_name,
                  //             brand_id : result.brand_id,
                  //             phone_number : result.phone_number,
                  //             visitor_email : result.visitor_email,
                  //             visitor_uniqueNum : result.visitor_uniqueNum,
                  //             timezone_location : timezoneLocationVal,
                  //             no_of_visits : result.no_of_visits,
                  //             web_path: result.web_path,
                  //             unReadMsgCount : unReadMsgCountVal,
                  //             visitorPathList: data
                  //           }
                  //           callback(response);
                  //         }
                  //       });
                  //       //console.log('visitorPathList 2',visitorPathList, res.name1);
                  //       //#endregion
                  //     });
                  //   }
                  // )


                  
                  chatModel.countDocuments({ $and: [{ msgFrom: res.name1, isRead: false }] }, function (err, count) {
                    unReadMsgCountVal = count;
                    
                    //#region visitorPathList
                    
                    var visitorPathList = [];
                    visitorpathModel.find({ $and: [{ visitor_id: res.name1 }] }, function(err, data) {
                      if (err) 
                      {
                        visitorPathList = {}; 
                      } 
                      else if (data == null || data == undefined || data == "") 
                      {
                        visitorPathList = {};
                      } 
                      else 
                      {
                        agentModel.findOne(
                          { $and: [{ agent_id : res.name2 }] },
                             function(err, resp){
                              response = { 
                                visitor_id: res.name1, 
                                visitor_name: visit_name, 
                                agent_name : resp.agent_name,//agent_name : 'Clyde',
                                agent_id : resp.agent_id,
                                agent_teamId : resp.agent_teamId,
                                country: countryVal,
                                browser: browserVal,
                                os: osVal,
                                platform: platformVal,
                                ipaddress : ipAddressVal,
                                totalhournumber : totalHoursVal,
                                totaltimeshort : totalTimeShortVal,
                                totaltimelong : totalTimeExpVal,
                                createdate : createdDateVal,
                                createdOn : result.createdOn,
                                payment_link : result.payment_link,
                                brand_name : result.brand_name,
                                brand_id : result.brand_id,
                                phone_number : result.phone_number,
                                visitor_email : result.visitor_email,
                                visitor_uniqueNum : result.visitor_uniqueNum,
                                timezone_location : timezoneLocationVal,
                                no_of_visits : result.no_of_visits,
                                web_path: result.web_path,
                                unReadMsgCount : unReadMsgCountVal,
                                visitorPathList: data
                              }
                              callback(response);
                             });
                        
                      }
                    });

                    //#endregion
                  });

                       

                  }
                }
                }
              )

              }
            }
              
          
           }
         );
  });

//#region get visitor id
  // var teamBrands = {};
  // socket.on("get_visitor_id", function(obj, callback) 
  // {
  //   var visitId = obj.visitorId;
  //   var agentId = obj.agentId;
  //   var agentTeamId = obj.agent_teamId;
  //   var unReadMsgCountVal = 0;
  //   // console.log('visitId --1',visitId);
  //   // console.log('agentId --1',agentId);
    
  //   // brandModel.find({ $and: [{ brand_teamId: agentTeamId }] }, 
  //   //   function(errBrand, brands) {
  //   //     teamBrands = brands
  //   //   }
    
  //   // );
  //   // //console.log('teamBrands', teamBrands);
  //   brandModel.find({ $and: [{ brand_teamId: agentTeamId }] },
  //     function(errBrands, resultBrands) 
  //     {

  //      if(errBrands)
  //      {
  //        response = {}
  //        callback(response);
  //      }

  //     if(resultBrands !== null || resultBrands.length !== 0 || resultBrands !== undefined)
  //     //if(resultBrands.length !== 0)
  //     {
        
  //       // var i;
  //       // for (i = 0; i < resultBrands.length; i++) 
  //       // {
  //       //   //console.log(resultBrands[i].brand_id);
  //       //   //text += resultBrands[i] + "<br>";
  //       // }
  //       if(resultBrands.length !== 0)
  //       {
  //         //teamBrands = resultBrands;
  //         console.log('ZZZZ',resultBrands)
  //         // var i;
  //         // for (i = 0; i < resultBrands.length; i++) 
  //         // {
  //         //   //console.log(resultBrands[i].brand_id);
  //         //   //text += resultBrands[i] + "<br>";
            
  //         // }
  //       }
  //       //console.log('ZZZZ',resultBrands)
        
        
  //      }
  //     }
  //   );
  // });


  socket.on("get_agent_id", function(agentId, callback) {

    agentModel.findOne(
           { $and: [{ agent_id: agentId }] },
           function(err, result) {
           
            if(err)
            {
              agent_name = "";

              response = { agent_id: agentId , agent_name : agent_name }

              callback(response);
            }

            if(result!=null)
            {
             var  agent_name = result.agent_name;

             if(agent_name == "")
             {
              agent_name = "";

              response = { agent_id: agentId , agent_name : agent_name }

              callback(response); 
             }
             else 
             {
              response = { agent_id: result.agent_id , agent_name : result.agent_name }

              callback(response);

              }
            }
              
          
           }
         );
  });

  socket.on("get_reply_msg", function( data , callback) {

     //console.log(data);
      var msgId = data.msgId;
      var isVisList = data.isVisitorList;
    //if(repId != ""){
     

      chatModel.findOne(
        { $and: [{ msgId : msgId}] },
        function(err, dat){

        //console.log('dat--1',dat);
        //  console.log(dat.msgId + ' - ' + repId);

          var msg = dat.msg;
          var msgId = dat.msgId;
          var msgFrom = dat.msgFrom;
          var msgTo = dat.msgTo;
          var file = dat.file;
          var createdOn = dat.createdOn;
          var room = dat.room;
          // var isReadVal = dat.isRead;
          //var isReadVal = true;
          //chatModel.updateMany({"msgId": msgId}, {"$set":{"isRead": true}});

          // if(isVisList == false)
          // {
          //   console.log('sunil bhai ----------------->>>>>>>>>>');
          //   chatModel.update({"msgId": msgId, "isRead": false}, {"$set":{"isRead": true}}, {"multi": true}, (err, writeResult) => {});
          // }
          
          if(dat.repMsgId == ""){
            //console.log('11 else');
            response = {  repId: dat.repMsgId, 
              msgId: msgId , 
              msgFrom : ""  , 
              msgTo : "",
              msg : "", 
              file : "", 
              createdOn : "",
              repmsgFrom :msgFrom  , 
              repmsgTo : msgTo,
              repmsg : msg, 
              repfile : file, 
              repcreatedOn : createdOn,
              reproomId : room,
              repIsRead : dat.isRead
            }

            callback(response);

          }else{
          
            //console.log('10 else');
          chatModel.findOne(
            {$and: [{ msgId : dat.repMsgId}]},function(err, res){

              response = {  repId: dat.repMsgId, 
                msgId: msgId , 
                msgFrom : msgFrom  , 
                msgTo : msgTo,
                msg : msg, 
                file : file, 
                createdOn : createdOn,
                repmsgFrom : res.msgFrom  , 
                repmsgTo : res.msgTo,
                repmsg : res.msg, 
                repfile : res.file, 
                repcreatedOn : res.createdOn,
                reproomId : room,
                repIsRead : res.isRead
              }
              callback(response);
   

            }
          )
          }

        }
      )

    // }else{
    //   console.log("2");
    //   chatModel.findOne(
    //     { $and: [{ msgId : msgId}] },
    //     function(err, res){
 
    //         response = {  repId: "", msgId: msgId ,  msgFrom : res.msgFrom  , msgTo : res.msgTo, msg : res.msg, file : res.file, room : res.room, createdOn : res.createdOn}
 
    //           callback(response);
    //     }
    //   )

    // }



    
  });


    //setting room.
    socket.on("set-room", function(room) {
      //console.log('sumair');
      //leaving room.
      socket.leave(socket.room);
      //getting room data.
      eventEmitter.emit("get-room-data", room);
      //setting room and join.
      setRoom = function(roomId) {
        socket.room = roomId;
        socket.join(socket.room);
        ioChat.to(userSocket[socket.username]).emit("set-room", socket.room);
      };
    }); //end of set-room event.

    socket.on("update-room", function(room) {
      // console.log('muzaffar room back',room);
      // console.log('muzaffar room agentId',room.agent_id);
      // console.log('muzaffar room visitorId',room.visitor_id.id);
      // console.log('muzaffar room isVisitorList',room.isVisitorList);
      // console.log('muzaffar room page',room.page);
      const filter = { name1: room.visitor_id.id };
      const update = { name2: room.agent_id };

      roomModel.findOne({ name1: room.visitor_id.id }, function(err,obj) { 
        //console.log('room->',room.visitor_id.id);
        //console.log('obj.name2', obj.name2);
        if(err)
        {
          socket.room =  obj._id;
          socket.join(socket.room);
          ioChat.to(userSocket[socket.username]).emit("update-room", socket.room);
        }
        if(obj != null)
        {
          //console.log('ji bhai');
          if(obj.name2 == "")
          {
            //console.log('ji bhai 2');
            roomModel.findOneAndUpdate(
              filter , update , function(err, result) {
              socket.room = result._id;
              chatModel.updateMany({ room : socket.room } , {$set: { msgTo: room.agent_id }} , function(err, result) { }  )
              if(room.isVisitorList == false)
              {
                //console.log('<---- msgs is read update ----> ji bhai 2');
                chatModel.update({room : socket.room, "isRead": false}, {"$set":{"isRead": true}}, {"multi": true}, (err, writeResult) => {});
              }
              socket.room = result._id;
              socket.join(socket.room);
              ioChat.to(userSocket[socket.username]).emit("update-room", socket.room);
            });
          }
          else if(obj.name2 == "tFAE3OWtP")
          {
            //console.log('ji bhai 2.11');
            roomModel.findOneAndUpdate(
              filter , update , function(err, result) {
              socket.room = result._id;
              chatModel.updateMany({ room : socket.room } , {$set: { msgTo: room.agent_id }} , function(err, result) { }  )
              if(room.isVisitorList == false)
              {
                //console.log('<---- msgs is read update ----> ji bhai 2.11');
                chatModel.update({room : socket.room, "isRead": false}, {"$set":{"isRead": true}}, {"multi": true}, (err, writeResult) => {});
              }
              socket.room = result._id;
              socket.join(socket.room);
              ioChat.to(userSocket[socket.username]).emit("update-room", socket.room);
            });
          }
          else
          {
              //console.log('ji bhai 3');
              socket.room =  obj._id;
              socket.join(socket.room);
              //console.log('rehan bhai', userSocket[socket.username]);
              if(room.isVisitorList == false)
              {
                //console.log('<---- msgs is read update ----> ji bhai 3');
                chatModel.update({room : socket.room, "isRead": false}, {"$set":{"isRead": true}}, {"multi": true}, (err, writeResult) => {});
              }
              ioChat.to(userSocket[socket.username]).emit("update-room", socket.room);
              //ioChat.emit("update-room", socket.room);
              // ioChat.emit("test-sumair", socket.room);
              // console.log('kamran ', userSocket[socket.username]);
          }
        } 
      });
    }); 


    // socket.on("update-room-unassigned", function(room) {
    //   console.log('muzaffar room back',room);
    //   console.log('muzaffar room agentId',room.agent_id);
    //   console.log('muzaffar room visitorId',room.visitor_id.id);
    //   const filter = { name1: room.visitor_id.id };
    //   const update = { name2: room.agent_id };

    //   roomModel.findOne({ name1: room.visitor_id.id }, function(err,obj) { 
    //     //console.log('room->',room.visitor_id.id);
    //     console.log('obj.name2', obj.name2);
    //     if(err)
    //     {
    //       socket.room =  obj._id;
    //       socket.join(socket.room);
    //       ioChat.to(userSocket[socket.username]).emit("update-room-unassigned", socket.room);
    //     }
    //     if(obj != null)
    //     {
    //       console.log('ji bhai');
    //       if(obj.name2 == "")
    //       {
    //         console.log('ji bhai 2');
    //         roomModel.findOneAndUpdate(
    //           filter , update , function(err, result) {
    //           socket.room = result._id;
    //           chatModel.updateMany({ room : socket.room } , {$set: { msgTo: room.agent_id }} , function(err, result) { }  )
    //           chatModel.update({room : socket.room, "isRead": false}, {"$set":{"isRead": true}}, {"multi": true}, (err, writeResult) => {});
    //             socket.room = result._id;
    //             socket.join(socket.room);
    //             ioChat.to(userSocket[socket.username]).emit("update-room-unassigned", socket.room);
    //         });
    //       }
    //       else
    //       {
    //           console.log('ji bhai 3');
    //           socket.room =  obj._id;
    //           socket.join(socket.room);
    //           //console.log('rehan bhai', userSocket[socket.username]);
    //           chatModel.update({room : socket.room, "isRead": false}, {"$set":{"isRead": true}}, {"multi": true}, (err, writeResult) => {});
    //           ioChat.to(userSocket[socket.username]).emit("update-room-unassigned", socket.room);
    //           //ioChat.emit("update-room", socket.room);
    //           // ioChat.emit("test-sumair", socket.room);
    //           // console.log('kamran ', userSocket[socket.username]);
    //       }
    //     } 
    //   });
    // }); //end of set-room event.



    //emits event to read old-chats-init from database.
    socket.on("old-chats-init", function(data) {
      //console.log('nasir bhai', data);
      eventEmitter.emit("read-chat", data);
    });

    //emits event to read old chats from database.
    socket.on("old-chats", function(data) {
      //console.log('danish bari backend', data);
      eventEmitter.emit("read-chat", data);
    });

    //sending old chats to client.
    oldChats = function(result, username, room) {
      // console.log('sajid bhai ',result);
      // console.log('sajid bhai room ',room);
      // console.log('sajid bhai room 2',userSocket[username]);
      // console.log('sajid bhai room 3',username);
      ioChat.to(userSocket[username]).emit("old-chats", {
        result: result,
        room: room
      });
      // ioChat.emit("old-chats", {
      //   result: result,
      //   room: room
      // });
    };

    //showing msg on typing.
    socket.on("typing", function(val, visitorId) {
      socket.to(socket.room).emit('typingResponse', val, visitorId);
      var data = {
          messageVal: val,
          visitId: visitorId
      };
      socket.to(socket.room).emit('typingResponse-saboor', data);
    });

    socket.on("typingClear", function(visitorId) {
      socket.to(socket.room).emit('typingClearResponse', visitorId);
    });


    socket.on("show-payment-form-btn", function(data) {
      //console.log(data);
      //console.log('check socket.room', socket.room);
      socket.to(socket.room).emit('show-payment-form-btn-ui', data);
      socket.to(socket.room).emit('payment-form-assignroom', socket.room);
    });

    socket.on('visitor-payment-response',function(data){
      // console.log('check console visitor payment resp', data);
      // console.log('check socket.room', data.room);
      socket.to(data.room).emit('send-visitor-payment-paid-msg',data);
      //socket.emit('chat-msg',{msg:result.message, msgFrom : visitorId ,msgTo:"",date:Date.now(),type:"visitor",file:result.file,repMsgId:result.replymsgId});
      //socket.emit('chat-msg',{msg:data.msg, msgFrom: data.msgFrom, msgTo:"", date:Date.now(),type:data.type,file:"",repMsgId: ""});
    });

    // socket.on('typing', function(val){ 
    //   //console.log(val);
    //   // write Your awesome code here
    //   //const userId = user[currentDrawer].ioid()
    //   socket.broadcast.emit('typingResponse', val);
    //   //socket.broadcast.emit('typingResponse');
    // });

    // socket.on('typingClear', function(){ 
    //   socket.broadcast.emit('typingClearResponse');
    // });

    // socket.on('typing',function(msg){
    //   var setTime;
    //   //clearing previous setTimeout function.
    //   clearTimeout(setTime);
    //   //showing typing message.
    //   $('#typing').text(msg);
    //   //showing typing message only for few seconds.
    //   setTime = setTimeout(function(){
    //     $('#typing').text("");
    //   },3500);
    // }); //end of typing event.

    // socket.on("msg-is-read", function(data) {
    //   console.log('nasir bhai', data);
    //   //isReadVisitorId = data.visitor_id;
    //   isReadMsgId = data.msgId;
    //   // chatModel.update({"msgFrom": data.visitor_id}, {"$set":{"isRead": true}}, {"multi": true}, (err, writeResult) => {});
    //   //chatModel.updateMany({msgFrom: data.visitor_id, msgId: data.msgId }, { $set :{isRead: true}}, {multi: true}, (err, writeResult) => {});
    // });

    // socket.on("active-visitor", function(data) {
    //   console.log('kamran bhai', data);
    //   isReadVisitorId = data.visitor_id;
    //   // currentClickedVisitorArray.push(isReadVisitorId);
    //   // console.log('current vis array', currentClickedVisitorArray);
    //   //isReadMsgId = data.msgId;
    //   // chatModel.update({"msgFrom": data.visitor_id}, {"$set":{"isRead": true}}, {"multi": true}, (err, writeResult) => {});
    //   //chatModel.updateMany({msgFrom: data.visitor_id, msgId: data.msgId }, { $set :{isRead: true}}, {multi: true}, (err, writeResult) => {});
    // });

    //#region when user is active on agent

    socket.on('get-current-visitor-response', function(currentVis, data, roomId){
      //console.log('check hogaya visitor'+ currentVis);
      //console.log('check hogaya visitor data'+ JSON.stringify(data));
      //var dataSave = JSON.stringify(data);
      //console.log('--------- socket io visitor -------', socket.room);
      //console.log('--------- visitor room id -------', roomId);
      //console.log('saboor');
      const id = shortid.generate();
        //emits event to save chat to database.
        //console.log('dataSave.msgFrom',data.msgFrom);
        if(currentVis == data.msgFrom)
        {
          console.log('is read true');

          eventEmitter.emit("save-chat", {
            msgFrom: data.msgFrom,
            msgTo: data.msgTo,
            msg: data.msg,
            file : data.file,
            // room: socket.room,
            room: roomId,
            type: data.type,
            id: id,
            repMsgId: data.repMsgId,
            date: data.date,
            isRead: true
          });
        }
        else{
          console.log('is read false');

          eventEmitter.emit("save-chat", {
            msgFrom: data.msgFrom,
            msgTo: data.msgTo,
            msg: data.msg,
            file : data.file,
            // room: socket.room,
            room: roomId,
            type: data.type,
            id: id,
            repMsgId: data.repMsgId,
            date: data.date,
            isRead: false
          });
        }
        
  
        //emits event to send chat msg to all clients.
         if(data.repMsgId != ""){
          chatModel.findOne(
            { $and: [{ msgId : data.repMsgId}] },
            function(err, res){
              if(currentVis == data.msgFrom)
              {
                // ioChat.to(socket.room).emit("chat-msg", {
                ioChat.to(roomId).emit("chat-msg", {
                  msgFrom: data.msgFrom,
                  file: data.file,
                  msg: data.msg,
                  id: id,
                  date: data.date,
                  repFrom : res.msgFrom,
                  repTo : res.msgTo,
                  repMsg : res.msg,
                  repfile: res.file,
                  repDate: res.createdOn,
                  isRead : true
                });
              }
              else
              {
                // ioChat.to(socket.room).emit("chat-msg", {
                ioChat.to(roomId).emit("chat-msg", {
                  msgFrom: data.msgFrom,
                  file: data.file,
                  msg: data.msg,
                  id: id,
                  date: data.date,
                  repFrom : res.msgFrom,
                  repTo : res.msgTo,
                  repMsg : res.msg,
                  repfile: res.file,
                  repDate: res.createdOn,
                  isRead : false
                });
              }
              
              
            }
          )
         }else{
           //console.log(' socket.room 2',socket.room);
           //console.log(' socket.room 3',data.date);
           if(currentVis == data.msgFrom)
           {
            // ioChat.to(socket.room).emit("chat-msg", {
            ioChat.to(roomId).emit("chat-msg", {
              msgFrom: data.msgFrom,
              file: data.file,
              msg: data.msg,
              id: id,
              date: data.date,
              repMsg : "",
              isRead : true
            });
           }
           else
           {
            // ioChat.to(socket.room).emit("chat-msg", {
            ioChat.to(roomId).emit("chat-msg", {
              msgFrom: data.msgFrom,
              file: data.file,
              msg: data.msg,
              id: id,
              date: data.date,
              repMsg : "",
              isRead : false
            });
           }
           
         }

    });

    // socket.on('get-current-visitor-response', function(currentVis, data){
    //   console.log('check hogaya visitor'+ currentVis);
    //   //console.log('check hogaya visitor data'+ JSON.stringify(data));
    //   //var dataSave = JSON.stringify(data);
    //   console.log('--------- socket io visitor -------', socket.room);

    //   const id = shortid.generate();
    //     //emits event to save chat to database.
    //     console.log('dataSave.msgFrom',data.msgFrom);
    //     eventEmitter.emit("save-chat", {
    //       msgFrom: data.msgFrom,
    //       msgTo: data.msgTo,
    //       msg: data.msg,
    //       file : data.file,
    //       room: socket.room,
    //       type: data.type,
    //       id: id,
    //       repMsgId: data.repMsgId,
    //       date: data.date,
    //       isRead: true
    //     });
        
  
    //     //emits event to send chat msg to all clients.
    //      if(data.repMsgId != ""){
    //       chatModel.findOne(
    //         { $and: [{ msgId : data.repMsgId}] },
    //         function(err, res){
    //           ioChat.to(socket.room).emit("chat-msg", {
    //             msgFrom: data.msgFrom,
    //             file: data.file,
    //             msg: data.msg,
    //             id: id,
    //             date: data.date,
    //             repFrom : res.msgFrom,
    //             repTo : res.msgTo,
    //             repMsg : res.msg,
    //             repfile: res.file,
    //             repDate: res.createdOn,
    //             isRead : true
    //           });
              
    //         }
    //       )
    //      }else{
    //        //console.log(' socket.room 2',socket.room);
    //        //console.log(' socket.room 3',data.date);
    //        ioChat.to(socket.room).emit("chat-msg", {
    //         msgFrom: data.msgFrom,
    //         file: data.file,
    //         msg: data.msg,
    //         id: id,
    //         date: data.date,
    //         repMsg : "",
    //         isRead : true
    //       });
           
    //      }

    // });

    //#endregion


    //for showing chats.
    socket.on("chat-msg", function(data) {
      // console.log('sokcet - room : ',socket.room);
      //console.log('chat-msg saboor: ',data);
      if(data.type == "visitor")
      {
        // ioChat.emit('get-current-visitor-req', data);
        //console.log('@@1!!', socket.room);
        roomModel.findOne({ _id: socket.room }, function(err,obj) { 
          if(obj.name2 == '')
          {
            //#region un assigned visitor msg save
            //console.log('*******');
            const id = shortid.generate();
            //emits event to save chat to database.
            eventEmitter.emit("save-chat", {
              msgFrom: data.msgFrom,
              msgTo: data.msgTo,
              msg: data.msg,
              file : data.file,
              room: socket.room,
              type: data.type,
              id: id,
              repMsgId: data.repMsgId,
              date: data.date,
              isRead: false
            });
      
            //emits event to send chat msg to all clients.
            if(data.repMsgId != ""){
              chatModel.findOne(
                { $and: [{ msgId : data.repMsgId}] },
                function(err, res){
      
                  ioChat.to(socket.room).emit("chat-msg", {
                    msgFrom: data.msgFrom,
                    file: data.file,
                    msg: data.msg,
                    id: id,
                    date: data.date,
                    repFrom : res.msgFrom,
                    repTo : res.msgTo,
                    repMsg : res.msg,
                    repfile: res.file,
                    repDate: res.createdOn,
                    isRead : false
                  });
                  
                }
              )
            }else{
              //console.log(' socket.room 2',socket.room);
              console.log(' socket.room 3',data.date);
              ioChat.to(socket.room).emit("chat-msg", {
                msgFrom: data.msgFrom,
                file: data.file,
                msg: data.msg,
                id: id,
                date: data.date,
                repMsg : "",
                isRead : false
              });
            }

            //#endregion
          }
          else
          {
            //console.log('~~~~~~~~~ msg nae araha ~~~~~~~~', obj);
            if(agentStack[obj.name2] == "Online")
            {
              console.log('if -> get-current-visitor-req');
              //ioChat.emit('get-current-visitor-req', data, socket.room);

              const id = shortid.generate();

              eventEmitter.emit("save-chat", {
                msgFrom: data.msgFrom,
                msgTo: obj.name2,
                msg: data.msg,
                file : data.file,
                room: socket.room,
                type: data.type,
                id: id,
                repMsgId: data.repMsgId,
                date: data.date,
                isRead: false
              });
              
              //emits event to send chat msg to all clients.
              if(data.repMsgId != ""){
                chatModel.findOne(
                  { $and: [{ msgId : data.repMsgId}] },
                  function(err, res){
                    ioChat.to(socket.room).emit("chat-msg", {
                      msgFrom: data.msgFrom,
                      file: data.file,
                      msg: data.msg,
                      id: id,
                      date: data.date,
                      repFrom : res.msgFrom,
                      repTo : res.msgTo,
                      repMsg : res.msg,
                      repfile: res.file,
                      repDate: res.createdOn,
                      isRead : false
                    });
                  }
                )
              }
              else
              {
                chatModel.findOne({ msgFrom: data.msgFrom, msg: data.msg, createdOn: data.date } , function(err,resCheckMsg){
                  console.log(resCheckMsg);
                  if(resCheckMsg == null)
                  {
                    ioChat.to(socket.room).emit("chat-msg", {
                      msgFrom: data.msgFrom,
                      file: data.file,
                      msg: data.msg,
                      id: id,
                      date: data.date,
                      repMsg : "",
                      isRead : false
                    });
                  }
                });
                
              }

            }
            else
            {
              //console.log('~~~~~~~~~ agent is offline ~~~~~~~~~', data);
              const id = shortid.generate();

              eventEmitter.emit("save-chat", {
                msgFrom: data.msgFrom,
                msgTo: obj.name2,
                msg: data.msg,
                file : data.file,
                room: socket.room,
                type: data.type,
                id: id,
                repMsgId: data.repMsgId,
                date: data.date,
                isRead: false
              });
              
              //emits event to send chat msg to all clients.
              if(data.repMsgId != ""){
                chatModel.findOne(
                  { $and: [{ msgId : data.repMsgId}] },
                  function(err, res){
                    ioChat.to(socket.room).emit("chat-msg", {
                      msgFrom: data.msgFrom,
                      file: data.file,
                      msg: data.msg,
                      id: id,
                      date: data.date,
                      repFrom : res.msgFrom,
                      repTo : res.msgTo,
                      repMsg : res.msg,
                      repfile: res.file,
                      repDate: res.createdOn,
                      isRead : false
                    });
                  }
                )
              }
              else
              {
                console.log('check double msg');
                chatModel.findOne({ msgFrom: data.msgFrom, msg: data.msg, createdOn: data.date } , function(err,resCheckMsg){
                  console.log(resCheckMsg);
                  if(resCheckMsg == null)
                  {
                    ioChat.to(socket.room).emit("chat-msg", {
                      msgFrom: data.msgFrom,
                      file: data.file,
                      msg: data.msg,
                      id: id,
                      date: data.date,
                      repMsg : "",
                      isRead : false
                    });
                  }
                });
                
              }

              //console.log('mil gaya ++++++++++++++++++++++++++++++',agentStack);
            }
            
          }
        });
                
      }
      else if(data.type == "agent")
      {
        console.log('--------- socket io agent -------', socket.room);

        const id = shortid.generate();
        //emits event to save chat to database.
        eventEmitter.emit("save-chat", {
          msgFrom: data.msgFrom,
          msgTo: data.msgTo,
          msg: data.msg,
          file : data.file,
          room: socket.room,
          type: data.type,
          id: id,
          repMsgId: data.repMsgId,
          date: data.date,
          isRead: false
        });
  
        //emits event to send chat msg to all clients.
         if(data.repMsgId != ""){
          chatModel.findOne(
            { $and: [{ msgId : data.repMsgId}] },
            function(err, res){
  
              ioChat.to(socket.room).emit("chat-msg", {
                msgFrom: data.msgFrom,
                file: data.file,
                msg: data.msg,
                id: id,
                date: data.date,
                repFrom : res.msgFrom,
                repTo : res.msgTo,
                repMsg : res.msg,
                repfile: res.file,
                repDate: res.createdOn,
                isRead : false
              });
              
            }
          )
         }else{
           //console.log(' socket.room 2',socket.room);
           //console.log(' socket.room 3',data.date);
           ioChat.to(socket.room).emit("chat-msg", {
             msgFrom: data.msgFrom,
             file: data.file,
             msg: data.msg,
             id: id,
             date: data.date,
             repMsg : "",
             isRead : false
           });
         }

         ioChat.to(socket.room).emit("open-visitor-chatwidget");
      }
      
    });


    // socket.on("chat-msg", function(data) 
    // {

    //   console.log('--------- socket io agent -------', socket.room);
    //   const id = shortid.generate();
        
    //   eventEmitter.emit("save-chat", {
    //       msgFrom: data.msgFrom,
    //       msgTo: data.msgTo,
    //       msg: data.msg,
    //       file : data.file,
    //       room: socket.room,
    //       type: data.type,
    //       id: id,
    //       repMsgId: data.repMsgId,
    //       date: data.date,
    //       isRead: false
    //     });
  
    //     //emits event to send chat msg to all clients.
    //      if(data.repMsgId != "")
    //      {
    //       chatModel.findOne(
    //         { $and: [{ msgId : data.repMsgId}] },
    //         function(err, res){
  
    //           ioChat.to(socket.room).emit("chat-msg", {
    //             msgFrom: data.msgFrom,
    //             file: data.file,
    //             msg: data.msg,
    //             id: id,
    //             date: data.date,
    //             repFrom : res.msgFrom,
    //             repTo : res.msgTo,
    //             repMsg : res.msg,
    //             repfile: res.file,
    //             repDate: res.createdOn,
    //             isRead : false
    //           });
              
    //         }
    //       )
    //      }
    //      else
    //      {
    //        ioChat.to(socket.room).emit("chat-msg", {
    //          msgFrom: data.msgFrom,
    //          file: data.file,
    //          msg: data.msg,
    //          id: id,
    //          date: data.date,
    //          repMsg : "",
    //          isRead : false
    //        });
    //      }
      
    // });

    //for popping page notification
    socket.on('new_notification', function(data) {
      //console.log(data.title,data.message);
      ioDirect.sockets.emit('show_notification', { 
        title: data.title, 
        message: data.message, 
        icon: data.icon, 
      });
    });

    socket.on("agent-logout", function(data) {
      // console.log(data);
      // console.log('agentStack',agentStack);
      console.log("agent chat disconnected.");

      if(socket.username != undefined)
      {
        _.unset(agentSocket, socket.username);
        agentStack[data] = "Offline";

      }
      //console.log('agentStack offline',agentStack);
      
    });

    function waitVisitorToDisconnect()
    {
      ioChat.emit("onlineStack", visitorStack);
    }
    //for popping disconnection message.
    socket.on("disconnect", function() {

      var i = allClients.indexOf(socket);
      allClients.splice(i, 1);
      
      console.log(socket.username + "  logged out");
      socket.broadcast.emit("broadcast", {
        description: socket.username + " Logged out"
      });
      isReadVisitorId = 0;
      //console.log('agentStack',agentStack);
      console.log("chat disconnected.");

      _.unset(userSocket, socket.username);
      userStack[socket.username] = "Offline";
      

      // console.log('userSocket ---',userSocket);
      // console.log('visitorSocket ---',visitorSocket);

      // console.log('userStack ****',userStack);
      // console.log('visitorStack ****',visitorStack);

      //console.log('socket.username ~~~~~',socket.username);

      if(socket.username != undefined)
      {
        _.unset(visitorSocket, socket.username);
        visitorStack[socket.username] = "Offline";
        
        setTimeout(waitVisitorToDisconnect, 15000);
        //console.log('socket.username ^^^^^^',socket.username);

        
      }
      
      //socket.emit('set-user-data', socket.username);
      //ioChat.emit("onlineStack", userStack);
    }); //end of disconnect event.
  }); //end of ioDirect.on(connection).
  //end of socket.io code for chat feature.

  //database operations are kept outside of socket.io code.
  //saving chats to database.
  eventEmitter.on("save-chat", function(data) {
    // var today = Date.now();
    //console.log('save-chat',data);
    if(data.type=="agent")
    {
      console.log('agent');
      var newChat = new chatModel({
        msgFrom: data.msgFrom,
        msgTo: data.msgTo,
        msg: data.msg,
        file: data.file,
        repMsgId : data.repMsgId,
        room: data.room,
        msgId:data.id,
        createdOn: data.date
      });
    
     newChat.save(function(err, result) {
      if (err) {
        console.log("Error : " + err);
      } else if (result == undefined || result == null || result == "") {
        console.log("Chat Is Not Saved.");
      } else {
        console.log("Chat Saved 1.");
      }
    });
    
    }
    else
    {
      //console.log('visitor');
      roomModel.findOne({ _id: data.room }, function(err,obj) { 
        //console.log('checking payement resp msg ', obj);
        agent_id = obj.name2;

        if(agent_id == "")
        {

          var newChat = new chatModel({
            msgFrom: data.msgFrom,
            msgTo: data.msgTo,
            msg: data.msg,
            repMsgId : data.repMsgId,
            file: data.file,
            msgId:data.id,
            room: data.room,
            createdOn: data.date,
            isRead: data.isRead
          });

          newChat.save(function(err, result) {
            if (err) {
              console.log("Error : " + err);
            } else if (result == undefined || result == null || result == "") {
              console.log("Chat Is Not Saved.");
            } else {
              console.log("Chat Saved 2.");
            }
         

        });

        }else{

          

          // agentModel.findOne({ agent_id: agent_id } , function(err,res)
          // {
          //   //console.log('isReadVisitorId -->',isReadVisitorId);
          //   // if(isReadVisitorId == data.msgFrom)
          //   // {
          //   //   var newChat = new chatModel({
          //   //     msgFrom: data.msgFrom,
          //   //     msgTo: res.agent_id,
          //   //     msgId:data.id,
          //   //     msg: data.msg,
          //   //     repMsgId : data.repMsgId,
          //   //     file: data.file,
          //   //     room: data.room,
          //   //     createdOn: data.date,
          //   //     isRead: data.isRead
          //   //   });
          //   // }
          //   // else
          //   // {
          //   //   var newChat = new chatModel({
          //   //     msgFrom: data.msgFrom,
          //   //     msgTo: res.agent_id,
          //   //     msgId:data.id,
          //   //     msg: data.msg,
          //   //     repMsgId : data.repMsgId,
          //   //     file: data.file,
          //   //     room: data.room,
          //   //     createdOn: data.date,
          //   //     isRead: data.isRead
          //   //   });
          //   // }
            
            

          // });

          console.log(data.msgTo, agent_id);
          
          var newChat = new chatModel({
            msgFrom: data.msgFrom,
            msgTo: data.msgTo,
            msgId:data.id,
            msg: data.msg,
            repMsgId : data.repMsgId,
            file: data.file,
            room: data.room,
            createdOn: data.date,
            isRead: data.isRead
          });
          chatModel.findOne({ msgFrom: data.msgFrom, msg: data.msg, createdOn: data.date } , function(err,resCheckMsg)
          {
            if(resCheckMsg == null)
            {
              newChat.save(function(err, result) {
                if (err) {
                  console.log("Error : " + err);
                } else if (result == undefined || result == null || result == "") {
                  console.log("Chat Is Not Saved.");
                } else {
                  // chatModel.findOne({ msgId: isReadMsgId }, function(err,obj) {
                  //   console.log('obj result ', obj);
                  // });
                  //console.log('is read vis id', isReadVisitorId);
                  // if(isReadVisitorId != 0)
                  // {
                  //     console.log('isReadMsgId', isReadMsgId);
                  //     chatModel.update({"msgId": isReadMsgId}, {"$set":{"isRead": true}}, {"multi": true}, (err, writeResult) => {});
                  // }
                  console.log("Chat Saved 3.");
                }
             
    
            });
            }
          });
          
        }

      });

    }

   
  }); //end of saving chat.

  //reading chat from database.
  eventEmitter.on("read-chat", function(data) {
    //console.log('adil bhai');
    chatModel
      .find({})
      .where("room")
      .equals(data.room)
      //.sort("-createdOn")
      //.sort({createdOn: 1})
      .skip(data.msgCount)
      .lean()
     // .limit(5)
      .exec(function(err, result) {
        if (err) {
          console.log("Error : " + err);
        } else {
          //calling function which emits event to client to show chats.
          //console.log('saboor', result);
          oldChats(result, data.username, data.room);
        }
      });
      //console.log('shoiab', data);
  }); //end of reading chat from database.


    //listening for get-all-users event. creating list of all users.
    eventEmitter.on("get-all-visitors", function() {
      visitorModel
        // .find({ $and: [{ brand_teamId: 'GzBcwRjSIV' }] })
        .find({})
        .select("visitor_name")
        .select("visitor_id")
        .exec(function(err, result) {
          if (err) {
            console.log("Error : " + err);
          } else {
            //console.log(result);
            for (var i = 0; i < result.length; i++) {
              visitorStack[result[i].visitor_id] = "Offline";
            }
            sendVisitorStack();
          }
        });
    }); //end of get-all-users event.

    //listening for get-all-agents event. creating list of all users.
    eventEmitter.on("get-all-agents", function() {
      agentModel
        .find({})
        .select("agent_name")
        .select("agent_id")
        .exec(function(err, result) {
          if (err) {
            console.log("Error : " + err);
          } else {
            for (var i = 0; i < result.length; i++) {
              agentStack[result[i].agent_id] = "Offline";
            }
            sendAgentStack();
          }
        });
    }); //end of get-all-agents event.


  //listening get-room-data event.
  // eventEmitter.on("get-room-data", function(room) {
  //   roomModel.find(
  //     {
  //       $or: [
  //         {
  //           name1: room.name1
  //         },
  //         {
  //           name1: room.name2
  //         }//,
  //         // {
  //         //   name2: room.name1
  //         // },
  //         // {
  //         //   name2: room.name2
  //         // }
  //       ]
  //     },
  //     function(err, result) {
  //       if (err) {
  //         console.log("Error : " + err);
  //       } else {
  //         if (result == "" || result == undefined || result == null) {
  //           var today = Date.now();

  //           visitorModel.findOne(
  //             { $and: [{ visitor_id: room.name1 }] },
  //             function(err, resultVisitor) {
  //               if (err) {
  //                 res.status(500).json({
  //                   success: false,
  //                   message: "Some Error Occured"
  //                 });
          
  //               } else if (resultVisitor == null || resultVisitor == undefined || resultVisitor == "") {

  //                 newRoom = new roomModel({
  //                   name1: room.name1,
  //                   name2: room.name2,
  //                   lastActive: today,
  //                   createdOn: today
  //                 });
  //                 newRoom.save(function(err, newResult) {
  //                   if (err) {
  //                     console.log("Error : " + err);
  //                   } else if (
  //                     newResult == "" ||
  //                     newResult == undefined ||
  //                     newResult == null
  //                   ) {
  //                     console.log("Some Error Occured During Room Creation.");
  //                   } else {
  //                     setRoom(newResult._id); //calling setRoom function.
  //                   }
  //                 }); //end of saving room.

  //               }
  //               else
  //               {
  //                 newRoom = new roomModel({
  //                   name1: room.name1,
  //                   name2: room.name2,
  //                   brand_id: resultVisitor.brand_id,
  //                   brand_teamId: resultVisitor.brand_teamId,
  //                   lastActive: today,
  //                   createdOn: today
  //                 });
  //                 newRoom.save(function(err, newResult) {
  //                   if (err) {
  //                     console.log("Error : " + err);
  //                   } else if (
  //                     newResult == "" ||
  //                     newResult == undefined ||
  //                     newResult == null
  //                   ) {
  //                     console.log("Some Error Occured During Room Creation.");
  //                   } else {
  //                     setRoom(newResult._id); //calling setRoom function.
  //                   }
  //                 }); //end of saving room.

  //               }
  //             });
            
  //         } else {
  //           var jresult = JSON.parse(JSON.stringify(result));
  //           setRoom(jresult[0]._id); //calling setRoom function.
  //         }
  //       } //end of else.
  //     }
  //   ); //end of find room.
  // }); //end of get-room-data listener.


  eventEmitter.on("get-room-data", function(room) {
    //console.log('uzair room -->', room);
    visitorModel.findOne(
      { $and: [{ visitor_id: room.name1, brand_id: room.brand_id, brand_teamId: room.brand_teamId  }] },
      function(err, resultVisitor) {
        if (err) {
          // res.status(500).json({
          //   success: false,
          //   message: "Some Error Occured"
          // });
        }
        else if (resultVisitor == null || resultVisitor == undefined || resultVisitor == "") {
          // res.status(404).json({
          //   success: false,
          //   message: "Visitor Not Found"
          // });
        }
        else
        {
          //console.log('vis brand id', resultVisitor.brand_id);
          roomModel.findOne({ name1: room.name1, brand_id: resultVisitor.brand_id, brand_teamId: resultVisitor.brand_teamId },
            function(errRoom, resultRoom) {
              //console.log('just check -->', resultRoom);
              var today = Date.now();
              if (errRoom) {
                // res.status(500).json({
                //   success: false,
                //   message: "Some Error Occured"
                // });
              }
              else if (resultRoom == "" || resultRoom == undefined || resultRoom == null)
              {
                //console.log('agaya new room', resultRoom);
                newRoom = new roomModel({
                  name1: room.name1,
                  name2: room.name2,
                  brand_id: resultVisitor.brand_id,
                  brand_teamId: resultVisitor.brand_teamId,
                  lastActive: today,
                  createdOn: today
                });
                newRoom.save(function(err, newResult) {
                  if (err) {
                    console.log("Error : " + err);
                  } else if (
                    newResult == "" ||
                    newResult == undefined ||
                    newResult == null
                  ) {
                    console.log("Some Error Occured During Room Creation.");
                  } else {
                    setRoom(newResult._id); //calling setRoom function.
                  }
                }); //end of saving room.
              }
              else
              {
                //console.log('agaya old room', resultRoom);
                var jresult = JSON.parse(JSON.stringify(resultRoom));
                //console.log('agaya old room ==> jresult', jresult._id);
                // setRoom(jresult[0]._id);
                setRoom(jresult._id);
              }
            });
        }
        
      });
  });

  //end of database operations for chat feature.

  //
  //



  //#region signup 

  //to verify for unique username and email at signup.
  //socket namespace for signup.
  const ioSignup = ioDirect.of("/signup");

  let checkUname, checkEmail; //declaring variables for function.

  ioSignup.on("connection", function(socket) {
    console.log("signup connected.");

    //verifying unique username.
    socket.on("checkUname", function(uname) {
      eventEmitter.emit("findUsername", uname); //event to perform database operation.
    }); //end of checkUname event.

    //function to emit event for checkUname.
    checkUname = function(data) {
      ioSignup.to(socket.id).emit("checkUname", data); //data can have only 1 or 0 value.
    }; //end of checkUsername function.

    //verifying unique email.
    socket.on("checkEmail", function(email) {
      eventEmitter.emit("findEmail", email); //event to perform database operation.
    }); //end of checkEmail event.

        //verifying unique email.
    socket.on("checkAgentEmail", function(email) {
      eventEmitter.emit("findAgentEmail", email); //event to perform database operation.
    }); //end of checkEmail event.

    //function to emit event for checkEmail.
    checkEmail = function(data) {
      ioSignup.to(socket.id).emit("checkEmail", data); //data can have only 1 or 0 value.
    }; //end of checkEmail function.

        //function to emit event for checkEmail.
        checkAgentEmail = function(data) {
          ioSignup.to(socket.id).emit("checkAgentEmail", data); //data can have only 1 or 0 value.
        }; //end of checkEmail function.

    //on disconnection.
    socket.on("disconnect", function() {
      console.log("signup disconnected.");
    });
  }); //end of ioSignup connection event.

  //#endregion
  
  
  //#region agent

  const ioAgent = ioDirect.of("/agent");

  let checkAgentEmail; //declaring variables for function.

  ioAgent.on("connection", function(socket) {
    console.log("Agent connected.");

        //verifying unique email.
    socket.on("checkAgentEmail", function(email) {
      eventEmitter.emit("findAgentEmail", email); //event to perform database operation.
    }); //end of checkEmail event.


        //function to emit event for checkEmail.
        checkAgentEmail = function(data) {
          ioAgent.to(socket.id).emit("checkAgentEmail", data); //data can have only 1 or 0 value.
        }; //end of checkEmail function.

    //on disconnection.
    socket.on("disconnect", function() {
      console.log("agent disconnected.");
    });
  }); //end of ioSignup connection event.

  //database operations are kept outside of socket.io code.
  //event to find and check username.
  eventEmitter.on("findUsername", function(uname) {
    userModel.find(
      {
        username: uname
      },
      function(err, result) {
        if (err) {
          console.log("Error : " + err);
        } else {
          //console.log(result);
          if (result == "") {
            checkUname(1); //send 1 if username not found.
          } else {
            checkUname(0); //send 0 if username found.
          }
        }
      }
    );
  }); //end of findUsername event.

  //event to find and check username.
  eventEmitter.on("findEmail", function(email) {
    userModel.find(
      {
        email: email
      },
      function(err, result) {
        if (err) {
          console.log("Error : " + err);
        } else {
          //console.log(result);
          if (result == "") {
            checkEmail(1); //send 1 if email not found.
          } else {
            checkEmail(0); //send 0 if email found.
          }
        }
      }
    );
  }); //end of findUsername event.

    //event to find and check username.
    eventEmitter.on("findAgentEmail", function(agent_email) {
      agentModel.find(
        {
          agent_email: agent_email
        },
        function(err, result) {
          if (err) {
            console.log("Error : " + err);
          } else {
            //console.log(result);
            if (result == "") {
              checkAgentEmail(1); //send 1 if email not found.
            } else {
              checkAgentEmail(0); //send 0 if email found.
            }
          }
        }
      );
    }); //end of findUsername event.

  //#endregion


  //#region new visitor

  // const ioNewVisitor = ioDirect.of("/newvisitor");

  // ioNewVisitor.on("connection", function(socket) {
  //   console.log("newvisitor signup connected.");

  //   socket.on('save-walking-customer',function(data, callback){
  //     //console.log("data server",data.visitor_uniqueNumVal);

  //     //#region make user

  //     visitorModel.findOne(
  //       { $and: [{ visitor_uniqueNum: data.visitor_uniqueNumVal }] },
  //       function(err, result) {
  //         if (result == null || result == undefined || result == "") {

  //           brandModel.findOne(
  //             { brand_url: { $regex: '.*' + data.visitor_host + '.*' } },
  //             function(err, result) {
  //               if (result != null || result != undefined || result != "") 
  //               {
  //                   const today = Date.now();
  //                   const id = shortid.generate();
                
  //                   //console.log([data.visitor_GeoLocValue]);
  //                   const newVisitor = new visitorModel({
  //                     visitor_id: id,
  //                     visitor_name: "WC_" + id,
  //                     visitor_email: "walkingcustomer_" + id + "@dc.com",
  //                     visitor_uniqueNum: data.visitor_uniqueNumVal,
  //                     phone_number: "000",
  //                     web_path: data.visitor_web_path,
  //                     brand_id : result.brand_id,
  //                     brand_name : result.brand_name,
  //                     visitor_publicIp: data.visitor_PublicIpValue,
  //                     visitor_privateIp: data.visitor_PrivateIpValue,
  //                     visitor_region_publicIp: data.visitor_GeoLocValue,
  //                     visitor_region_privateIp: data.visitor_GeoLocValuePrivate,
  //                     visitor_browser_and_os: data.visitor_BrowserAndOSValue,
  //                     visitor_TimezoneLocation: data.visitor_TimezoneLocation,
  //                     createdOn: today
  //                 });

  //                 //console.log(newVisitor);
                
  //                 newVisitor.save(function(err, result) {
  //                   if (err) {
  //                     console.log('error 1');
  //                     res.status(500).json({
  //                       success: false,
  //                       message: "Some Error Occured"
  //                     });
                
  //                   } else if (result == null || result == undefined || result == "") {
  //                     console.log('error 2');
  //                     res.status(404).json({
  //                       success: false,
  //                       message: "Data Not Found"
  //                     });
                
  //                   } 
  //                   else 
  //                   {
  //                     //console.log('solve');
  //                     if(data.visitor_web_path != null || data.visitor_web_path != undefined || data.visitor_web_path != "")
  //                     {
  //                       const pathDate = Date.now();
  //                       const pathShortId = shortid.generate();
  //                       const newVisitorPath = new visitorpathModel({
  //                         path_id: pathShortId,
  //                         visitor_id: result.visitor_id,
  //                         visitor_name: result.visitor_name,
  //                         visitor_email: result.visitor_email,
  //                         visitor_uniqueNum: result.visitor_uniqueNum,
  //                         completePath: data.visitor_web_path,
  //                         createdOn: pathDate
  //                       });
  //                       newVisitorPath.save();
  //                     }

  //                     // response = {  repId: dat.repMsgId, 
  //                     //   msgId: msgId , 
  //                     //   msgFrom : ""  , 
  //                     //   msgTo : "",
  //                     //   msg : "", 
  //                     //   file : "", 
  //                     //   createdOn : "",
  //                     //   repmsgFrom :msgFrom  , 
  //                     //   repmsgTo : msgTo,
  //                     //   repmsg : msg, 
  //                     //   repfile : file, 
  //                     //   repcreatedOn : createdOn,
  //                     //   reproomId : room,
  //                     //   repIsRead : dat.isRead
  //                     // }
                
  //                     callback(result.visitor_id);
  //                   }
  //                 });
  //               }
  //             });
            
  //         } 
  //         else{
  //           if(data.visitor_web_path != null || data.visitor_web_path != undefined || data.visitor_web_path != "")
  //           {
  //             const pathDate = Date.now();
  //             const pathShortId = shortid.generate();
  //             const newVisitorPath = new visitorpathModel({
  //               path_id: pathShortId,
  //               visitor_id: result.visitor_id,
  //               visitor_name: result.visitor_name,
  //               visitor_email: result.visitor_email,
  //               visitor_uniqueNum: result.visitor_uniqueNum,
  //               completePath: data.visitor_web_path,
  //               createdOn: pathDate
  //             });
  //             newVisitorPath.save();
  //           }  
  //           callback(result.visitor_id);
  //         }
  //       }
  //     );

  //     // response = {  repId: dat.repMsgId, 
  //     //   msgId: msgId , 
  //     //   msgFrom : ""  , 
  //     //   msgTo : "",
  //     //   msg : "", 
  //     //   file : "", 
  //     //   createdOn : "",
  //     //   repmsgFrom :msgFrom  , 
  //     //   repmsgTo : msgTo,
  //     //   repmsg : msg, 
  //     //   repfile : file, 
  //     //   repcreatedOn : createdOn,
  //     //   reproomId : room,
  //     //   repIsRead : dat.isRead
  //     // }

  //     // callback(response);

  //     //#endregion
  //   });   
    
  //   socket.on("set-user-data", function(username) {
  //     // const username = 'rBXxhnFCR';
  //     console.log(username + "  logged In");

  //     //storing variable.
  //     socket.username = username;
  //     userSocket[socket.username] = socket.id;
  //     visitorSocket[socket.username] = socket.id;
  //     agentSocket[socket.username] = socket.id;

  //     socket.broadcast.emit("broadcast", {
  //       description: username + " Logged In on signup"
  //     });

  //     //getting all users list
  //     eventEmitter.emit("get-all-visitors");

  //     //sending all users list. and setting if online or offline.
  //     sendVisitorStack = function() {
  //       for (i in visitorSocket) {
  //         for (j in visitorStack) {
  //           if (j == i) {
  //             visitorStack[j] = "Online";
  //           }
  //         }
  //       }
  //       //console.log(visitorStack);
  //       //for popping connection message.
  //       ioChat.emit("onlineStack", visitorStack);

  //     }; //end of sendUserStack function.


  //     eventEmitter.emit("get-all-agents");

  //     //sending all agent list. and setting if online or offline.
  //     sendAgentStack = function() {
  //       for (i in agentSocket) {
  //         for (j in agentStack) {
  //           if (j == i) {
  //             agentStack[j] = "Online";
  //           }
  //         }
  //       }
  //       //for popping connection message.
  //       ioChat.emit("agentsList", agentStack);    
  //     }; //end of sendUserStack function.

  //   });
    
  //   socket.on("disconnect", function() {
  //     console.log("newvisitor signup disconnected.");
  //   });
  // });
  //#endregion

  //
  //

  return ioDirect;
};
