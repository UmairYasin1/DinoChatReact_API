$ (function(){

  var socket = io('/chat');

  var username = $('#agent').val();
  var agent_id = $('#agent_id').val();
  var noChat = 0; //setting 0 if all chats histroy is not loaded. 1 if all chats loaded.
  var msgCount = 0; //counting total number of messages displayed.
  var oldInitDone = 0; //it is 0 when old-chats-init is not executed and 1 if executed.
  var roomId;//variable for setting room.


  //passing data on connection.
  socket.on('connect',function(){
    socket.emit('set-user-data', agent_id);
    // setTimeout(function() { alert(username+" logged In"); }, 500);

    socket.on('broadcast',function(data){
    //document.getElementById("hell0").innerHTML += '<li>'+ data.description +'</li>';
    // $('#hell0').append($('<li>').append($(data.description).append($('<li>');
    //$('#hell0').scrollTop($('#hell0')[0].scrollHeight);

  });

  });//end of connect event.

  
  //receiving onlineStack.
  socket.on('onlineStack',function(stack){
    //$('.ChatTable table tbody').empty();

    $('#ChatTableOnline table tbody').empty();
    $('#ChatTableOffline table tbody').empty();
    
    $('#contactsList ul').empty();
   // $('#list').empty();
   // $('#list').append($('<li>').append($('<button id="ubtn" class="btn btn-danger btn-block btn-lg"></button>').text("Group").css({"font-size":"18px"})));
    var totalOnline = 0;
    var totalOffline = 0;
    var totalVisitors = 0;

    //console.log(stack);
  
    for (var visitor_id in stack){
      
     // console.log(visitor_name);

      //setting txt1. shows users button.
      if(visitor_id == agent_id){
       // var txt1 = $('<button class="boxF disabled"> </button>').text(visitor_name).css({"font-size":"18px"});
      }
      else{
        socket.emit('get_visitor_id',visitor_id, function (response) {

          //console.log(response);
          //var txt1 = $('<button id="ubtn" class="btn btn-success  btn-md">').text(response.visitor_name).attr("rel" , response.visitor_id).css({"font-size":"18px"});
          
          if(stack[response.visitor_id] == "Online"){
            var countryShortCode = response.country;
            var countryFlag = countryShortCode.toLowerCase();
          //  var txt2 = $('<span class="badge"></span>').text("*"+stack[response.visitor_name]).css({"float":"right","color":"#009933","font-size":"18px"});
            //console.log(flag.selectByTopLevelDomain("uk"));
            //var a = '<tr><td><a href="javascript:;"><img src="/pics/clickicon.png" alt="-" /></a></td><td><span class="userNameIntable"><a href="#" onclick="javascript:openChatAgent(this.rel)" id="ubtnDirect" rel='+response.visitor_id+'>'+response.visitor_name+'</a><i class="fa fa-check-circle-o" aria-hidden="true"></i></span></td><td><img src="/pics/statsintable.jpg" alt="alternative text" title="Country : '+ response.country +', Browser : '+ response.browser +', OS : '+ response.os +', Platform : '+ response.platform +'" /></td><td>'+ response.totaltimeshort +'</td><td>'+response.agent_name+'</td><td>Logo Viction | Client Area..</td><td><img src="/pics/gicon.png" alt="-" />  google.com</td><td>1</td><td>1</td></tr>';
            var a = '<tr><td><a href="javascript:;"><img src="/images/clickicon.png" alt="-" /></a></td><td><span class="userNameIntable"><a href="#" onclick="javascript:openChatAgent(this.rel)" id="ubtnDirect" rel='+response.visitor_id+'>'+response.visitor_name+'</a></span></td><td><i class="'+countryFlag+' flag"></i><img src="/images/'+response.browser+'.jpg" alt="-"><img src="/images/system-pc.jpg" alt="-"><img src="/images/system-mac.jpg" alt="-"></td><td>'+ response.totaltimeshort +'</td><td>'+response.agent_name+'</td><td>Dino Chat | Client Area..</td><td><img src="/images/gicon.png" alt="-" />google.com</td><td>1</td><td>1</td></tr>';
            var b = '<li class="contact ubtn" dataname='+response.visitor_name+' rel='+response.visitor_id+'><div class="wrap"><div class="img"> '+ response.visitor_name.substr(0, 2).toUpperCase() +' </div><div class="meta"><p class="name">'+response.visitor_name+'</p><p class="preview"></p></div></div></li>';
            totalOnline++;
            totalVisitors++;

          }
          else{
            var countryShortCode = response.country;
            var countryFlag = countryShortCode.toLowerCase();
            //var a = '<tr><td><a href="javascript:;"><img src="/pics/clickicon.png" alt="-" /></a></td><td><span class="userNameIntable"><a href="#" onclick="javascript:openChatAgent(this.rel)" id="ubtnDirect" rel='+response.visitor_id+'>'+response.visitor_name+'</a> <i class="fa fa-ban" aria-hidden="true"></i></span></td><td><img src="/pics/statsintable.jpg" alt="alternative text" title="Country : '+ response.country +', Browser : '+ response.browser +', OS : '+ response.os +', Platform : '+ response.platform +'" /></td><td>'+ response.totaltimeshort +'</td><td>'+response.agent_name+'</td><td>Logo Viction | Client Area..</td><td><img src="/pics/gicon.png" alt="-" />  google.com</td><td>1</td><td>1</td></tr>';
            var c = '<tr><td><a href="javascript:;"><img src="/images/clickicon.png" alt="-" /></a></td><td><span class="userNameIntable"><a href="#" onclick="javascript:openChatAgent(this.rel)" id="ubtnDirect" rel='+response.visitor_id+'>'+response.visitor_name+'</a></span></td><td><i class="'+countryFlag+' flag"></i><img src="/images/'+response.browser+'.jpg" alt="-"><img src="/images/system-pc.jpg" alt="-"><img src="/images/system-mac.jpg" alt="-"></td><td>'+ response.totaltimeshort +'</td><td>'+response.agent_name+'</td><td>Dino Chat | Client Area..</td><td><img src="/images/gicon.png" alt="-" />google.com</td><td>1</td><td>1</td></tr>';
            var b = '<li class="contact ubtn" dataname='+response.visitor_name+' rel='+response.visitor_id+'><div class="wrap"><div class="img"> '+ response.visitor_name.substr(0, 2).toUpperCase() +' </div><div class="meta"><p class="name">'+response.visitor_name+'</p><p class="preview"></p></div></div></li>';              
            totalOffline++;
            totalVisitors++;
    
          //  var txt2 = $('<span class="badge"></span>').text(stack[response.visitor_name]).css({"float":"right","color":"#a6a6a6","font-size":"18px"});
          }

          //listing all users.
          //$('#list').append($('<li>').append(txt1,txt2));

          //$('.ChatTable table tbody').append(a);

          $('#ChatTableOnline table tbody').append(a);
          $('#ChatTableOffline table tbody').append(c);
          $('#contactsList ul').append(b);

          $('#totalOnline').text('(' + totalOnline + ')');
          $('#totalOffline').text('(' + totalOffline + ')');
          $('#totalVisitors').text('(' + totalVisitors + ')');

      });

      }
      //setting txt2. shows online status.
    
    }//end of for.
    $('#scrl1').scrollTop($('#scrl1').prop("scrollHeight"));
  }); //end of receiving onlineStack event.


  $(document).on("click",".ubtn",function(){

    $('#messages').empty();
    $('#typing').text("");
    msgCount = 0;
    noChat = 0;
    oldInitDone = 0;

    toUser = $(this).attr("rel");
    visitor_id = $(this).attr("rel");

    //$(".contact-profile h3").text(toUser);
    //$("#visitorName").text(toUser);

    $("#toVisitor").val(toUser);
    $('#frndName').text(toUser);
    //$('#initMsg').hide();

    $('#contactsList > ul > li.active').removeClass('active');
    $('#contactsList > ul > li[rel="' + toUser + '"]').addClass('active');

    socket.emit('update-room',{ visitor_id : visitor_id , agent_id : agent_id , agent : username});

    socket.emit('get_visitor_id',toUser, function (response) {
       $(".contact-profile h3").text(response.visitor_name);
       $("#visitorName").text(response.visitor_name);
       $("#visitorNameInitials").text(response.visitor_name.substr(0, 2).toUpperCase());
       $("#visitorLocation").text(response.country);
       $("#visitorIpAddress").text(response.ipaddress);
       $("#visitorOS").text(response.os);
       $("#visitorBrowser").text(response.browser);
       $("#visitorPlatform").text(response.platform);
       $("#visitorTotalTime").text(response.totaltimeshort);
       $("#visitorTime").text(response.createdate);
    });

  });

  
  $(document).on("click","#ubtnDirect",function(){
    
    var a = $(this).attr('rel');
    $('#messages').empty();
    $('#typing').text("");
    msgCount = 0;
    noChat = 0;
    oldInitDone = 0;

    toUser = a;
    visitor_id = a;


    $("#toVisitor").val(toUser);
    $('#frndName').text(toUser);

    socket.emit('update-room',{ visitor_id : visitor_id , agent_id : agent_id , agent : username});

      socket.emit('get_visitor_id',toUser, function (response) {
        $(".contact-profile h3").text(response.visitor_name);
        $("#visitorName").text(response.visitor_name);
        $("#visitorNameInitials").text(response.visitor_name.substr(0, 2).toUpperCase());
        $("#visitorLocation").text(response.country);
        $("#visitorIpAddress").text(response.ipaddress);
        $("#visitorOS").text(response.os);
        $("#visitorBrowser").text(response.browser);
        $("#visitorPlatform").text(response.platform);
        $("#visitorTotalTime").text(response.totaltimeshort);
        $("#visitorTime").text(response.createdate);
      });
  });
  // $(document).on("click","#ubtn",function(){

  //   $('#messages').empty();
  //   $('#typing').text("");
  //   msgCount = 0;
  //   noChat = 0;
  //   oldInitDone = 0;

  //   toUser = $(this).text("rel");
  //   visitor_id = $(this).attr("rel");

  //   $("#toVisitor").val(toUser);
  //   $('#frndName').text(toUser);
  //   //$('#initMsg').hide();

  //   socket.emit('update-room',{ visitor_id : visitor_id , agent_id : agent_id , agent : username});

  // });

  //event for setting roomId.
  socket.on('update-room',function(room){
    //empty messages.
    $('#messages').empty();
    $('#typing').text("");
    msgCount = 0;
    noChat = 0;
    oldInitDone = 0;
    //assigning room id to roomId variable. which helps in one-to-one and group chat.
    roomId = room;
    //event to get chat history on button click or as room is set.
    socket.emit('old-chats-init',{room:roomId,username:agent_id,msgCount:msgCount});

  }); //end of set-room event.

  //on scroll load more old-chats.
  // $('#scrl2').scroll(function(){

  //   if($('#scrl2').scrollTop() == 0 && noChat == 0 && oldInitDone == 1){
  //     $('#loading').show();
  //     socket.emit('old-chats',{room:roomId,username:username,msgCount:msgCount});
  //   }

  // }); // end of scroll event.

  //listening old-chats event.
  socket.on('old-chats',function(data){
    $(".replymsg").empty();
    $(".messages ul").empty();
    if(data.room == roomId){
      oldInitDone = 1; //setting value to implies that old-chats first event is done.
      if(data.result.length != 0){
        $('#noChat').hide(); //hiding no more chats message.
        for (var i = 0;i < data.result.length;i++) {

               socket.emit('get_reply_msg', data.result[i].msgId   , function (response) {

                var visitorImg = $("<img>").attr("src" , "/pics/visitor.jpeg");
                var agentImg = $("<img>").attr("src" , "/pics/agent.png");

                
                 //styling of chat message.
                 //var chatDate = moment(response.createdOn).format("MMMM Do YYYY, hh:mm:ss a");
                 var chatDate = moment(response.createdOn).format("hh:mm a");
                 var txt1 = $('<span></span>').text(response.msgFrom+" : ");
                 var txt2 = $('<span></span>').text(chatDate);
                 var txt3 = $('<p></p>').append(txt1,txt2);
                 var txt4 = $('<p></p>').text(response.msg);
                 if(response.file != ''){
                   var txt5 = $("<img style='height: 100px;width: 100px;'>").attr("src" , "/uploads/" + response.file);
                   }else{
                     var txt5 = "";
                   }
                 //showing chat in chat box.
                 var finalMsg1 = $('<div></div>').html(txt4);
                 finalMsg1 = finalMsg1.append(txt5);
                //var reschatDate = moment(response.repcreatedOn).format("MMMM Do YYYY, hh:mm:ss a");
                var reschatDate = moment(response.repcreatedOn).format("hh:mm a");
                 var restxt1 = $('<span></span>').text(response.repmsgFrom+" : ");
                 var restxt2 = $('<span class="timeStamp"></span>').text(reschatDate);
                 var restxt3 = $('<p></p>').append(restxt1,restxt2);
                 var restxt4 = $('<p></p>').text(response.repmsg);
                 if(response.repfile != ''){
                   var restxt5 = $("<img style='height: 100px;width: 100px;'>").attr("src" , "/uploads/" + response.repfile);
                   }else{
                     var restxt5 = "";
                   }
                   var finalMsg = $('<div></div>').html(restxt4);
                  finalMsg = finalMsg.append(restxt5);
                   if(agent_id == response.repmsgFrom){
                    //var clas = "sent";
                    var clas = "replies";
                    var usrImg = agentImg;
                  }else{
                    //var clas = "replies";
                    var clas = "sent";
                    var usrImg = visitorImg;
                  }

                   if(response.msgFrom == ""){
                    $('#messages').prepend($('<li>').append(restxt3,finalMsg).attr("rel" , response.msgId));
                    $('.messages ul').prepend($('<li class='+clas+'>').append(usrImg,restxt2,finalMsg).attr("rel" , response.msgId));
                 
                   }else{
                    $('#messages').prepend($('<li>').append(restxt3,finalMsg).attr("rel" , response.msgId).append($("<ul class='replymsg'>").append($("<li>").append(txt3,finalMsg1).attr("rel" , response.msgId))));
                    $('.messages ul').prepend($('<li class='+clas+'>').append(usrImg,restxt2,finalMsg).attr("rel" , response.msgId));
                 
                   }
                 
                 
            })

          
            //}
          //showing chat in chat box.
        
          msgCount++;

        }//end of for.
      }
      else {
        $('#noChat').show(); //displaying no more chats message.
        noChat = 1; //to prevent unnecessary scroll event.
      }
      //hiding loading bar.
      $('#loading').hide();

      //setting scrollbar position while first 5 chats loads.
      if(msgCount <= 5){
        $('#scrl2').scrollTop($('#scrl2').prop("scrollHeight"));
      }
    }//end of outer if.

  }); // end of listening old-chats event.


  // keyup handler.
  $('#myMsg').keyup(function(){
    if($('#myMsg').val()){
      $('#sendBtn').show(); //showing send button.
    }
    else{
      $('.typing').text('');
      $('#sendBtn').hide(); //hiding send button to prevent sending empty messages.
    }
  }); //end of keyup handler.

  socket.on('typingResponse', function(message) {
    $('.typing').text('('+ message +')');
  });

  socket.on('typingClearResponse', function(message) {
    $('.typing').text('');
  });

  //sending message.
  $('#chatForm').submit(function(e){
    
    if($('#myMsg').val() == null || $('#myMsg').val() == "")
    {
      return false;
    }
    e.preventDefault();
      var formData = new FormData(this);

      $.ajax({
        type: "POST",
        url: "http://localhost:5002/upload/file",
        //url: "https://192.168.1.110:5000/upload/file",
        //url: "https://umairyasin1-dinochat.glitch.me/upload/file",
        //url: "https://dinochat.glitch.me/upload/file",
        //url: "https://dinochat.netlify.app/upload/file",
        //url: "https://dinochat1.herokuapp.com/upload/file",
        data: formData,
        processData: false,
        contentType: false,
        success: function(result){
          if(result.file == ""){
            toVisit = $("#toVisitor").val();
            socket.emit('chat-msg',{msg:result.message,msgFrom: agent_id , msgTo:toVisit,date:Date.now(),type:"agent",file:"",repMsgId:result.replymsgId});
          }else{
            toVisit = $("#toVisitor").val();
            socket.emit('chat-msg',{msg:result.message,msgFrom: agent_id ,msgTo:toVisit,date:Date.now(),type:"agent",file:result.file,repMsgId:result.replymsgId});
          }

          $("#repMsgId").val("");
          $("#replyMsg").empty();
          $("#photos-input").val("");
        },
        error: function (e) {
            console.log("some error", e);
        }
    });

    
    $('#myMsg').val("");
    return false;
  }); //end of sending message.

  // $(document).on("click","#messages li",function(){
  //   $('#replyMsg').empty();
  //   var msgId = $(this).attr("rel");

  //   //console.log(msgId);
  //   socket.emit('get_reply_msg',msgId , function (response) {
  //       //styling of chat message.
  //       var chatDate = moment(response.repcreatedOn).format("MMMM Do YYYY, hh:mm:ss a");
  //       var txt1 = $('<span></span>').text(response.repmsgFrom+" : ");
  //       var txt2 = $('<span></span>').text(chatDate);
  //       var txt3 = $('<p></p>').append(txt1,txt2);
  //       var txt4 = $('<p></p>').text(response.repmsg);
  //       if(response.repfile != ''){
  //         var txt5 = $("<img>").attr("src" , "/uploads/" + response.repfile);
  //         }else{
  //           var txt5 = "";
  //         }
  //       //showing chat in chat box.
  //       $('#replyMsg').prepend($('<li>').append(txt3,txt4,txt5).attr("rel" , response.msgId ));
  //       $("#repMsgId").val(response.msgId);
  //   })
  // })

  //receiving messages.
  socket.on('chat-msg',function(data){
    //styling of chat message.

    var visitorImg = $("<img>").attr("src" , "/pics/visitor.jpeg");
    var agentImg = $("<img>").attr("src" , "/pics/agent.png");
    
    //var chatDate = moment(data.date).format("MMMM Do YYYY, hh:mm:ss a");
    var chatDate = moment(data.date).format("hh:mm a");
    var txt1 = $('<span></span>').text(data.msgFrom+" : ");
    var txt2 = $('<span class="timeStamp"></span>').text(chatDate);
    var txt3 = $('<p class="abc"></p>').append(txt1,txt2);
    var txt4 = $('<p class="xyz"></p>').text(data.msg);
    if(data.file != ""){
      var txt5 = $("<img style='height: 100px;width: 100px;'>").attr("src" , "/uploads/" + data.file);
      }else{
        var txt5 = "";
      }
      var finalMsg1 = $('<div></div>').html(txt4);
      finalMsg1 = finalMsg1.append(txt5);
      if(agent_id == data.msgFrom){
        //var clas = "sent";
        var clas = "replies";
        var usrImg = agentImg;
        
      }else{
        //var clas = "replies";
        var clas = "sent";
        var usrImg = visitorImg;
        
                  // $(window).on("blur focus", function(e) {
        //   var prevType = $(this).data("prevType");
      
        //   if (prevType != e.type) {   //  reduce double fire issues
        //       switch (e.type) {
        //           case "blur":
        //               setNotification();
        //               break;
        //           case "focus":
        //               break;
        //       }
        //   }
      
        //   $(this).data("prevType", e.type);
        // });
        //window.onblur = setNotification();
        if (!document.hasFocus()) {
          setNotification();
          blinkTitle("New Message!","Dino Chat",1000,true);  
        }

        
        
      }
    
    if(data.repMsg != ""){

      var replychatDate = moment(data.repDate).format("MMMM Do YYYY, hh:mm:ss a");
      var replytxt1 = $('<span></span>').text(data.repFrom+" : ");
      var replytxt2 = $('<span  class="timeStamp"></span>').text(replychatDate);
      var replytxt3 = $('<p></p>').append(replytxt1,replytxt2);
      var replytxt4 = $('<p></p>').text(data.repMsg);
      if(data.repfile != ""){
        var replytxt5 = $("<img style='height: 100px;width: 100px;'>").attr("src" , "/uploads/" + data.repfile);
        }else{
          var replytxt5 = "";
        }
        var finalMsg = $('<div></div>').html(replytxt4);
      finalMsg = finalMsg.append(replytxt5);
      $('#messages').append($('<li class='+clas+'>').append(replytxt3,finalMsg).attr("rel" , data.id).append($("<ul class='replymsg'>").append($("<li>").append(txt3,finalMsg1))));
      $('.messages ul').append($('<li class='+clas+'>').append(usrImg,replytxt2,finalMsg).attr("rel" , data.id));             
      
    }
    else{
      
      $('#messages').append($('<li class='+clas+'>').append(txt3,finalMsg1).attr("rel" , data.id));
      $('.messages ul').append($('<li class='+clas+'>').append(usrImg,txt2,finalMsg1).attr("rel" , data.id));
      
    }

    //showing chat in chat box.
    
      msgCount++;
      //console.log(msgCount);
      $('#typing').text("");
      // $('#scrl2').scrollTop($('#scrl2').prop("scrollHeight"));
      $(".messages").animate({ scrollTop: $('.messages').prop("scrollHeight") }, "fast");

      function setNotification() {
        showDesktopNotification("Dino Chat", 'New Message!', '/pics/agent.png');
        sendNodeNotification("Dino Chat", 'New Message!', '/pics/agent.png');
      }
  }); //end of receiving messages.

  socket.on('show_notification', function (data) {
    showDesktopNotification(data.title, data.message, data.icon);
  });

  var Notification = window.Notification || window.mozNotification || window.webkitNotification;
    Notification.requestPermission(function (permission) {
  });
  
  function requestNotificationPermissions() {
    if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
        });
    }
  }


  function showDesktopNotification(message, body, icon, sound, timeout) {
    if (!timeout) {
        timeout = 4000;
    }
    requestNotificationPermissions();
    var instance = new Notification(
            message, {
                body: body,
                icon: icon,
                sound: sound
            }
    );
    instance.onclick = function () {
        window.focus();
    };
    instance.onerror = function () {
        // Something to do
    };
    instance.onshow = function () {
        // Something to do
    };
    instance.onclose = function () {
        // Something to do
    };
    if (sound)
    {
        instance.sound;
    }
    setTimeout(instance.close.bind(instance), timeout);
    return false;
  }

  function sendNodeNotification(title, message, icon) {
    socket.emit('new_notification', {
        message: message,
        title: title,
        icon: icon,
    });
  }

  
  var hold;
  function blinkTitle (message, title, delay, notifyOffPage) {
    //if (!opts) opts = {}
    
    // var delay = opts.delay || 0
    // var message = opts.message || ''
    // var notifyOffPage = opts.notifyOffPage || false
    var timeout = false;
    // var title = opts.title || document.title


    // alert(delay + ' delay');
    // alert(message + ' message');
    // alert(notifyOffPage + ' notifyOffPage');
    // alert(timeout + ' timeout');
    // alert(title + ' title');
    
    if (notifyOffPage) {
      hold = setInterval(function () {
        if (document.hidden) blink()
      }, delay)
    } else {
      hold = setInterval(function () {
        blink()
      }, delay)
    }

    function blink () {
      document.title === title ?
        document.title = message :
        document.title = title
    }

    if (timeout) setTimeout(blinkTitleStop, timeout)

  }

  function blinkTitleStop () {
    clearInterval(hold)
  }



    //receiving agents list.
    socket.on('agentsList',function(stack){
      $('.agentsList table tbody').empty();
      var totalOnline = 0;
      for (var agent_id in stack)
      {
        socket.emit('get_agent_id',agent_id, function (response) {
          if(stack[response.agent_id] == "Online")
          { 
            var a = '<tr> <td><a href="javascript:;"><span class="agentPic"></span></td><td><span class="userNameIntable">'+response.agent_name+'</span></td><td>'+response.agent_name+'</td><td>melvin_mraz@sipes.name</td><td><img src="/pics/crown.jpg" class="imgWdth" alt="-"/> Owner/Administrator</td><td><span class="green far fa-check"></span> Enabled</td></tr>';
            totalOnline++;
          }
          else
          {
            var a='<tr> <td><a href="javascript:;"><span class="agentPic"></span></td><td><span class="userNameIntable">'+response.agent_name+'</span><i class="fa fa-ban" aria-hidden="true"></i></td><td>'+response.agent_name+'</td><td>melvin_mraz@sipes.name</td><td><img src="/pics/crown.jpg" class="imgWdth" alt="-"/> Owner/Administrator</td><td><span class="green far fa-check"></span> Enabled</td></tr>';
            //var a = '<tr><td><a href="javascript:;"><img src="/pics/clickicon.png" alt="-" /></a></td><td><span class="userNameIntable"><a href="#" onclick="javascript:openChatAgent(this.rel)" id="ubtnDirect" rel='+response.visitor_id+'>'+response.visitor_name+'</a> <i class="fa fa-ban" aria-hidden="true"></i></span></td><td><img src="/pics/statsintable.jpg" alt="alternative text" title="Country : '+ response.country +', Browser : '+ response.browser +', OS : '+ response.os +', Platform : '+ response.platform +'" /></td><td>'+ response.totaltimeshort +'</td><td>'+response.agent_name+'</td><td>Logo Viction | Client Area..</td><td><img src="/pics/gicon.png" alt="-" />  google.com</td><td>1</td><td>1</td></tr>';
          }

          $('.agentsList table tbody').append(a);

      });
        
      }
    }); //end of receiving agents list.

    
  //on disconnect event.
  //passing data on connection.
  socket.on('disconnect',function(){


    //showing and hiding relevant information.
    $('#list').empty();
    $('#messages').empty();
    $('#typing').text("");
    $('#frndName').text("Disconnected..");
    $('#loading').hide();
    $('#noChat').hide();
    $('#initMsg').show().text("...Please, Refresh Your Page...");
    $('#chatForm').hide();
    msgCount = 0;
    noChat = 0;
  });//end of connect event.



});//end of function.
