$ (function(){

    var socket = io('/chat');

    var visitorname = $('#visitor').val();
    var visitorId = $('#visitor_id').val();
    var brand_idVal = $('#brand_id').val();
    var brand_teamIdVal = $('#brand_teamId').val();

    console.log('check user name', visitorname);
    console.log('check user id', visitorId);

    var noChat = 0; //setting 0 if all chats histroy is not loaded. 1 if all chats loaded.
    var msgCount = 0; //counting total number of messages displayed.
    var oldInitDone = 0; //it is 0 when old-chats-init is not executed and 1 if executed.
    var roomId;//variable for setting room.
    var toUser;

      //passing data on connection.
  socket.on('connect',function(){
    socket.emit('set-user-data',visitorId);
  });//end of connect event.

  var currentRoom = visitorId;
  var reverseRoom = "";
  socket.emit('set-room',{name1:currentRoom,name2:reverseRoom, brand_id: brand_idVal, brand_teamId: brand_teamIdVal});

   //event for setting roomId.
   socket.on('set-room',function(room){
    //empty messages.
    $('#messages').empty();
    $('#typing').text("");
    msgCount = 0;
    noChat = 0;
    oldInitDone = 0;
    //assigning room id to roomId variable. which helps in one-to-one and group chat.
    roomId = room;
    console.log("roomId : "+roomId);
    //event to get chat history on button click or as room is set.
    socket.emit('old-chats-init',{room:roomId,username:visitorId,msgCount:msgCount});

  }); //end of set-room event.

  socket.on('show-payment-form-btn-ui',function(data){
    //console.log('payment ui data',data);

    $('#hdnpmntAgent').val(data.agent_Id);
    $('#hdnpmntVisitor').val(data.visitor_Id);
    $('#hdnpmntAmount').val(data.amount);
    socket.on('payment-form-assignroom',function(data){
      $('#hdnpmntChatRoom').val(data);
    });
    
    

    $('.open-payment').show();

  });

  socket.on('open-visitor-chatwidget',function(room){
    
    if($('.outerWrapWidget').css('display') == 'none')
    {
        $(".outerWrapWidget").fadeToggle('slow');
        $(".messages").animate({ scrollTop: $('.messages').prop("scrollHeight") }, "fast");
        setTimeout(function () {
          $(".chatWithUsBox").fadeToggle('fast');
        }, 800);
    }
  });

  socket.on('send-visitor-payment-paid-msg',function(data){
    //console.log('check console visitor payment resp', data);
    //socket.emit('chat-msg',{msg:result.message, msgFrom : visitorId ,msgTo:"",date:Date.now(),type:"visitor",file:result.file,repMsgId:result.replymsgId});
    socket.emit('chat-msg',{msg:data.msg, msgFrom: data.msgFrom, msgTo:"", date:Date.now(),type:data.type,file:"",repMsgId: ""});
  });
  

    //on scroll load more old-chats.
    $('#scrl3').scroll(function(){

        if($('#scrl3').scrollTop() == 0 && noChat == 0 && oldInitDone == 1){
          $('#loading').show();
          socket.emit('old-chats',{room:roomId,username:visitorId,msgCount:msgCount});
        }
    
      }); // end of scroll event.
    

      socket.on('old-chats',function(data){
        if(data.room == roomId){
          oldInitDone = 1; 
          if(data.result.length != 0)
          {
            $('#noChat').hide(); 
            $('#messages').empty();
            for (var i = 0;i < data.result.length;i++)
            {  
              var chatDate = moment(data.result[i].createdOn).format("MMMM Do YYYY, hh:mm:ss a");
              if(visitorId == data.result[i].msgFrom)
              {
                var clas = "visitorMsg";
              }else{
                var clas = "OtherUser";
              }
  
                var fileUpload = '';
                if(data.result[i].file != '')
                {
                  fileUpload = "<img src='/uploads/" + data.result[i].file+"'>";
                }
                else
                {
                  fileUpload = '';
                }


                if(data.result[i].msgFrom == visitorId)
                {
                  $('#messages').append($('<li  class='+clas+' rel="'+data.result[i].msgId+'"><div class="userImgAndChat"><div class="userImg"><img src="/newWidget/assets/images/avatar.jpg" class="img-responsive"></div> <div class="userChat"><p>'+data.result[i].msg+'</p><div class="chatImages">'+fileUpload+'</div></div><div class="dateTime">'+chatDate+'</div></div></li>'));
                }
                else
                {
                  $('#messages').append($('<li  class='+clas+' rel="'+data.result[i].msgId+'"><div class="userImgAndChat"><div class="userImg"><img src="/newWidget/assets/images/agentavatar.jpg" class="img-responsive"></div> <div class="userChat"><p>'+data.result[i].msg+'</p><div class="chatImages">'+fileUpload+'</div></div><div class="dateTime">'+chatDate+'</div></div></li>'));
                }
              msgCount++;
    
            }

          }
          else {
            $('#noChat').show(); //displaying no more chats message.
            noChat = 1; //to prevent unnecessary scroll event.
          }
          //hiding loading bar.
          $('#loading').hide();

          //setting scrollbar position while first 5 chats loads.
          if(msgCount <= 5)
          {
            //$('#scrl3').scrollTop($('#scrl3').prop("scrollHeight"));
            $(".messages").animate({ scrollTop: $('.messages').prop("scrollHeight") }, "fast");
          }
        }//end of outer if.

      }); // end of listening old-chats event.
      
      //#region old-chats backup

      // socket.on('old-chats',function(data){
      //   if(data.room == roomId){
      //     oldInitDone = 1; //setting value to implies that old-chats first event is done.
      //     if(data.result.length != 0){
      //       $('#noChat').hide(); //hiding no more chats message.
      //       $('#messages').empty();
      //       for (var i = 0;i < data.result.length;i++) {
      //         //styling of chat message.
      //         //console.log('aa', data.result[i].msgId);
      //         socket.emit('get_reply_msg', data.result[i].msgId, function (response) 
      //         {
      //           //styling of chat message.
      //           var chatDate = moment(response.repcreatedOn).format("MMMM Do YYYY, hh:mm:ss a");
      //           // var txt1 = $('<span></span>').text(response.msgFrom+" : ");
      //           // var txt2 = $('<span></span>').text(chatDate);
      //           // var txt3 = $('<p></p>').append(txt1,txt2);

      //           //var txt6 = $("<img>").attr("src" , "/pics/userimg.jpg");
      //           var visitorImg = $("<img>").attr("src" , "/newWidget/assets/images/avatar.jpg");
      //           var agentImg = $("<img>").attr("src" , "/newWidget/assets/images/agentavatar.jpg");

      //           var msg = $('<p></p>').text(response.msg);
      //           if(response.file != '')
      //           {
      //             var file = $("<img>").attr("src" , "/uploads/" + response.file);
      //           }
      //           else
      //           {
      //               var file = "";
      //           }
                
      //           var finalMsg1 = $('<div></div>').html(msg);
      //           finalMsg1 = finalMsg1.append(file);
      //           //showing chat in chat box.
                
      //           var repmsg = $('<p></p>').text(response.repmsg);
      //           if(response.repfile != ''){
      //             var repfile = $("<img>").attr("src" , "/uploads/" + response.repfile);
      //             }else{
      //               var repfile = "";
      //             }
      //             var finalMsg = $('<div></div>').html(repmsg);
      //             finalMsg = finalMsg.append(repfile);
      //             if(visitorId == response.repmsgFrom){
      //               //var clas = "sent";
      //               var clas = "visitorMsg";
      //               var usrImg = visitorImg;
      //             }else{
      //               //var clas = "replies";
      //               var clas = "OtherUser";
      //               var usrImg = agentImg;
      //             }
    
      //             var bc = '';
      //             if(response.repfile != ''){
      //                 bc = "<img src='/uploads/" + response.repfile+"'>";
      //             }else{
      //                 bc = '';
      //             }


      //             if(response.repmsgFrom == visitorId){
      //               //console.log('bb', response);
      //               //$('#messages').prepend($('<li class='+clas+'>').append(usrImg,finalMsg).attr("rel" , response.msgId));
      //               $('#messages').append($('<li  class='+clas+' rel="'+response.msgId+'"><div class="userImgAndChat"><div class="userImg"><img src="/newWidget/assets/images/avatar.jpg" class="img-responsive"></div> <div class="userChat"><p>'+response.repmsg+'</p><div class="chatImages">'+bc+'</div></div><div class="dateTime">'+chatDate+'</div></div></li>'));
                    
      //             }else{
      //               //console.log('cc', response);
      //               //$('#messages').prepend($('<li class='+clas+'>').append(usrImg,finalMsg).attr("rel" , response.msgId).append($("<ul class='replymsg'>").append($("<li>").append(usrImg,finalMsg1).attr("rel" , response.msgId))));
      //               $('#messages').append($('<li  class='+clas+' rel="'+response.msgId+'"><div class="userImgAndChat"><div class="userImg"><img src="/newWidget/assets/images/agentavatar.jpg" class="img-responsive"></div> <div class="userChat"><p>'+response.repmsg+'</p><div class="chatImages">'+bc+'</div></div><div class="dateTime">'+chatDate+'</div></div></li>'));
      //             }
                
                
      //      })
      //         msgCount++;
    
      //       }//end of for.
      //   //console.log(msgCount);
      // }
      // else {
      //   $('#noChat').show(); //displaying no more chats message.
      //   noChat = 1; //to prevent unnecessary scroll event.
      // }
      // //hiding loading bar.
      // $('#loading').hide();

      // //setting scrollbar position while first 5 chats loads.
      // if(msgCount <= 5){
      //   //$('#scrl3').scrollTop($('#scrl3').prop("scrollHeight"));
      //   $(".messages").animate({ scrollTop: $('.messages').prop("scrollHeight") }, "fast");
      // }
      //   }//end of outer if.

      // }); // end of listening old-chats event.


      //#endregion
      


  $('#myMsg').keyup(function(){
    if($('#myMsg').val()){
      $('#sendBtn').show(); //showing send button.
      socket.emit('typing', this.value, visitorId);
      // socket.on('typingResponse', function(message) {
      //   console.log(message);
      //   $('.typing').text('('+ message +')');
      // });
    }
    else{
      // $('.typing').text('');
      socket.emit('typingClear', visitorId);
      $('#sendBtn').hide(); //hiding send button to prevent sending empty messages.
    }
  }); //end of keyup handler.

    //sending message.
  $('#visitorchatForm').submit(function(e){
 
    if($('#photos-input').val() != null || $('#photos-input').val() != ''){
      
    }
    else if($('#myMsg').val() == null || $('#myMsg').val() == "")
    {
      return false;
    }
    

    //console.log('313123213',$('#photos-input').val());
    if($('#visitor_id').val() == null || $('#visitor_id').val() == "")
    {
      return false;
    }
    
    e.preventDefault();
    var formData = new FormData(this);
    //console.log('formData visitor', formData);
    $.ajax({
      type: "POST",
      //url: "http://localhost:5002/upload/file",
      url: "http://173.254.252.226:5001/upload/file",
      //url: "https://umairyasin1-dinochat.glitch.me/upload/file",
      // url: "https://dinochat.glitch.me/upload/file",
      //url: "https://dinochat.netlify.app/upload/file",
      //url: "https://dinochat1.herokuapp.com/upload/file",
      data: formData,
      processData: false,
      contentType: false,
      success: function(result){
        // console.log('result.file',result.file);
        // console.log('complete result', result);
        if(result.file == ""){

          socket.emit('chat-msg',{msg:result.message,msgFrom : visitorId , msgTo:"",date:Date.now(),type:"visitor",file:"",repMsgId:result.replymsgId});
        }else{
          socket.emit('chat-msg',{msg:result.message,msgFrom : visitorId ,msgTo:"",date:Date.now(),type:"visitor",file:result.file,repMsgId:result.replymsgId});
        }

        $("#repMsgId").val("");
        $("#replyMsg").empty();
        $("#photos-input").val("");
        $('.custom-file-upload.uploadname').text('');
      },
      error: function (e) {
          console.log("some error", e.msg);
      }
  });

     
     $('#myMsg').val("");
    return false;
  }); //end of sending message.


  //receiving messages.
  socket.on('chat-msg',function(data)
  {
    
    //styling of chat message.
    var chatDate = moment(data.date).format("MMMM Do YYYY, hh:mm:ss a");
    // var txt1 = $('<span></span>').text(data.msgFrom+" : ");
    // var txt2 = $('<span></span>').text(chatDate);
    // var txt3 = $('<p></p>').append(txt1,txt2);
    // var txt6 = $("<img>").attr("src" , "/pics/userimg.jpg");
    //$('#messages').empty();
    // var visitorImg = $("<img>").attr("src" , "/newWidget/assets/images/avatar.jpg");
    // var agentImg = $("<img>").attr("src" , "/newWidget/assets/images/dinoavatar.jpg");
    var visitorImg = "/newWidget/assets/images/avatar.jpg";
    var agentImg = "/newWidget/assets/images/agentavatar.jpg";
    var txt4 = $('<p></p>').text(data.msg);
    //console.log(data.file);
    if(data.file != "")
    {
        var txt5 = $("<img>").attr("src" , "/uploads/" + data.file);
    }
    else
    {
      var txt5 = "";
    }
    var bc = '';
    if(data.file != ''){
        bc = "<img src='/uploads/" + data.file+"'>";
    }else{
        bc = '';
    }


    var finalMsg1 = $('<div class="userChat"></div>').html(txt4);
    finalMsg1 = finalMsg1.append(txt5);
    //console.log(data);
    //showing chat in chat box.

    if(visitorId == data.msgFrom)
    {
      //var clas = "sent";
      var clas = "visitorMsg";
      var usrImg = visitorImg;
    }
    else
    {
      //var clas = "replies";
      var clas = "OtherUser";
      var usrImg = agentImg;
    }

    if(data.repMsg != "")
    {

        var replychatDate = moment(data.repDate).format("MMMM Do YYYY, hh:mm:ss a");
        // var replytxt1 = $('<span></span>').text(data.repFrom+" : ");
        // var replytxt2 = $('<span></span>').text(replychatDate);
        // var replytxt3 = $('<p></p>').append(replytxt1,replytxt2);
        //var replytxt6 = $("<img>").attr("src" , "/pics/userimg.jpg");
        
        var replytxt4 = $('<p></p>').text(data.repMsg);
        if(data.repfile != "")
        {
            var replytxt5 = $("<img>").attr("src" , "/uploads/" + data.repfile);
        }
        else
        {
            var replytxt5 = "";
        }
        var finalMsg = $('<div></div>').html(replytxt4);
        finalMsg = finalMsg.append(replytxt5);
        //$('#messages').append($('<li  class='+clas+'>').append(usrImg,finalMsg).attr("rel" , data.id).append($("<ul class='replymsg'>").append($("<li>").append(usrImg,finalMsg1))));
        $('#messages').prepend($('<li class='+clas+'>').append(usrImg,finalMsg).attr("rel" , data.id).append($("<ul class='replymsg'>").append($("<li>").append('<div class="userImgAndChat"><div class="userImg"><img src="https://uifaces.co/our-content/donated/gPZwCbdS.jpg" class="img-responsive" alt="-" /></div><div class="userChat"><p>Hey there, any updates</p></div><div class="dateTime">2 days ago</div></div>').attr("rel" , data.id))));
    }
    else
    {
      //$('#messages').append($('<li  class='+clas+'>').append(usrImg,finalMsg1).attr("rel" , data.id));
      $('#messages').append($('<li class='+clas+' rel="'+data.msgId+'"><div class="userImgAndChat"><div class="userImg"><img src="'+ usrImg +'" class="img-responsive"></div> <div class="userChat"><p>'+data.msg+'</p><div class="chatImages">'+bc+'</div></div><div class="dateTime">'+chatDate+'</div></div></li>'));
    }

    //$('#messages').append($('<li>').append(txt3,txt4,txt5));
      msgCount++;
      //console.log(msgCount);
      $('#typing').text("");
      // $('#scrl3').scrollTop($('#scrl3').prop("scrollHeight"));
      $(".messages").animate({ scrollTop: $('.messages').prop("scrollHeight") }, "fast");

  }); //end of receiving messages.

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