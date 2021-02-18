$ (function(){

    var socket = io('/chat');

    var visitorname = $('#visitor').val();
    var visitorId = $('#visitor_id').val();
    var noChat = 0; //setting 0 if all chats histroy is not loaded. 1 if all chats loaded.
    var msgCount = 0; //counting total number of messages displayed.
    var oldInitDone = 0; //it is 0 when old-chats-init is not executed and 1 if executed.
    var roomId;//variable for setting room.
    var toUser;

      //passing data on connection.
  socket.on('connect',function(){
    socket.emit('set-user-data',visitorId);
    // setTimeout(function() { alert(username+" logged In"); }, 500);

    socket.on('broadcast',function(data){
    //document.getElementById("hell0").innerHTML += '<li>'+ data.description +'</li>';
    // $('#hell0').append($('<li>').append($(data.description).append($('<li>');
    $('#hell0').scrollTop($('#hell0')[0].scrollHeight);

});

  });//end of connect event.

  var currentRoom = visitorId;
  var reverseRoom = "";
  socket.emit('set-room',{name1:currentRoom,name2:reverseRoom});

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


    //on scroll load more old-chats.
    $('#scrl3').scroll(function(){

        if($('#scrl3').scrollTop() == 0 && noChat == 0 && oldInitDone == 1){
          $('#loading').show();
          socket.emit('old-chats',{room:roomId,username:visitorId,msgCount:msgCount});
        }
    
      }); // end of scroll event.
    
      socket.on('old-chats',function(data){

        if(data.room == roomId){
          oldInitDone = 1; //setting value to implies that old-chats first event is done.
          if(data.result.length != 0){
            $('#noChat').hide(); //hiding no more chats message.
            $('#messages').empty();
            for (var i = 0;i < data.result.length;i++) {
              //styling of chat message.
            
              socket.emit('get_reply_msg', data.result[i].msgId   , function (response) {
    
                //styling of chat message.
                // var chatDate = moment(response.createdOn).format("MMMM Do YYYY, hh:mm:ss a");
                // var txt1 = $('<span></span>').text(response.msgFrom+" : ");
                // var txt2 = $('<span></span>').text(chatDate);
                // var txt3 = $('<p></p>').append(txt1,txt2);

                //var txt6 = $("<img>").attr("src" , "/pics/userimg.jpg");
                var visitorImg = $("<img>").attr("src" , "/pics/visitor.jpeg");
                var agentImg = $("<img>").attr("src" , "/pics/agent.png");

                var txt4 = $('<p></p>').text(response.msg);
                if(response.file != ''){
                  var txt5 = $("<img>").attr("src" , "/uploads/" + response.file);
                  }else{
                    var txt5 = "";
                  }
                  var finalMsg1 = $('<div></div>').html(txt4);
                  finalMsg1 = finalMsg1.append(txt5);
                //showing chat in chat box.
    
              //  var reschatDate = moment(response.repcreatedOn).format("MMMM Do YYYY, hh:mm:ss a");
              //   var restxt1 = $('<span></span>').text(response.repmsgFrom+" : ");
              //   var restxt2 = $('<span></span>').text(reschatDate);
              //   var restxt3 = $('<p></p>').append(restxt1,restxt2);
                //var restxt6 = $("<img>").attr("src" , "/pics/userimg.jpg");
                
                var restxt4 = $('<p></p>').text(response.repmsg);
                if(response.repfile != ''){
                  var restxt5 = $("<img>").attr("src" , "/uploads/" + response.repfile);
                  }else{
                    var restxt5 = "";
                  }
                  var finalMsg = $('<div></div>').html(restxt4);
                  finalMsg = finalMsg.append(restxt5);
                  if(visitorId == response.repmsgFrom){
                    //var clas = "sent";
                    var clas = "replies";
                    var usrImg = visitorImg;
                  }else{
                    //var clas = "replies";
                    var clas = "sent";
                    var usrImg = agentImg;
                  }
    
                  if(response.msgFrom == ""){
                   $('#messages').prepend($('<li class='+clas+'>').append(usrImg,finalMsg).attr("rel" , response.msgId));
                
                  }else{
                   $('#messages').prepend($('<li class='+clas+'>').append(usrImg,finalMsg).attr("rel" , response.msgId).append($("<ul class='replymsg'>").append($("<li>").append(usrImg,finalMsg1).attr("rel" , response.msgId))));
                
                  }
                
                
           })
              msgCount++;
    
            }//end of for.
        //console.log(msgCount);
      }
      else {
        $('#noChat').show(); //displaying no more chats message.
        noChat = 1; //to prevent unnecessary scroll event.
      }
      //hiding loading bar.
      $('#loading').hide();

      //setting scrollbar position while first 5 chats loads.
      if(msgCount <= 5){
        //$('#scrl3').scrollTop($('#scrl3').prop("scrollHeight"));
        $(".messages").animate({ scrollTop: $('.messages').prop("scrollHeight") }, "fast");
      }
    }//end of outer if.

  }); // end of listening old-chats event.

  
  // $('#myMsg').keypress(function(){
  //   socket.emit("typing");
  // });

  $('#myMsg').keyup(function(){
    if($('#myMsg').val()){
      $('#sendBtn').show(); //showing send button.
      socket.emit('typing', this.value);
      // socket.on('typingResponse', function(message) {
      //   console.log(message);
      //   $('.typing').text('('+ message +')');
      // });
    }
    else{
      // $('.typing').text('');
      socket.emit('typingClear');
      $('#sendBtn').hide(); //hiding send button to prevent sending empty messages.
    }
  }); //end of keyup handler.

  //receiving typing message.
  // socket.on('typing',function(msg){
  //   var setTime;
  //   console.log('test');
  //   //clearing previous setTimeout function.
  //   clearTimeout(setTime);
  //   //showing typing message.
  //   $('#typing').text(msg);
  //   //showing typing message only for few seconds.
  //   setTime = setTimeout(function(){
  //     $('#typing').text("");
  //   },3500);
  // }); //end of typing event.
  // socket.on("typing", function() {
  //   console.log('test vvvv');
  // });


    //sending message.
  $('#visitorchatForm').submit(function(e){
 
    if($('#myMsg').val() == null || $('#myMsg').val() == "")
    {
      return false;
    }
    
    e.preventDefault();
    var formData = new FormData(this);

    $.ajax({
      type: "POST",
      //url: "http://localhost:5002/upload/file",
      url: "http://10.1.30.146:5002/upload/file",
      //url: "https://umairyasin1-dinochat.glitch.me/upload/file",
      // url: "https://dinochat.glitch.me/upload/file",
      //url: "https://dinochat.netlify.app/upload/file",
      //url: "https://dinochat1.herokuapp.com/upload/file",
      data: formData,
      processData: false,
      contentType: false,
      success: function(result){
        if(result.file == ""){
          socket.emit('chat-msg',{msg:result.message,msgFrom : visitorId , msgTo:"",date:Date.now(),type:"visitor",file:"",repMsgId:result.replymsgId});
        }else{
          socket.emit('chat-msg',{msg:result.message,msgFrom : visitorId ,msgTo:"",date:Date.now(),type:"visitor",file:result.file,repMsgId:result.replymsgId});
        }

        $("#repMsgId").val("");
        $("#replyMsg").empty();
        $("#photos-input").val("");
      },
      error: function (e) {
          console.log("some error", e.msg);
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
    // var chatDate = moment(data.date).format("MMMM Do YYYY, hh:mm:ss a");
    // var txt1 = $('<span></span>').text(data.msgFrom+" : ");
    // var txt2 = $('<span></span>').text(chatDate);
    // var txt3 = $('<p></p>').append(txt1,txt2);
    // var txt6 = $("<img>").attr("src" , "/pics/userimg.jpg");
    //$('#messages').empty();
    var visitorImg = $("<img>").attr("src" , "/pics/visitor.jpeg");
    var agentImg = $("<img>").attr("src" , "/pics/agent.png");
    var txt4 = $('<p></p>').text(data.msg);
    console.log(data.file);
    if(data.file != ""){
    var txt5 = $("<img>").attr("src" , "/uploads/" + data.file);
    }else{
      var txt5 = "";
    }
    var finalMsg1 = $('<div></div>').html(txt4);
    finalMsg1 = finalMsg1.append(txt5);
    //console.log(data);
    //showing chat in chat box.

    if(visitorId == data.msgFrom){
      //var clas = "sent";
      var clas = "replies";
      var usrImg = visitorImg;
    }else{
      //var clas = "replies";
      var clas = "sent";
      var usrImg = agentImg;
    }

    if(data.repMsg != ""){

      //var replychatDate = moment(data.repDate).format("MMMM Do YYYY, hh:mm:ss a");
      // var replytxt1 = $('<span></span>').text(data.repFrom+" : ");
      // var replytxt2 = $('<span></span>').text(replychatDate);
      // var replytxt3 = $('<p></p>').append(replytxt1,replytxt2);
      //var replytxt6 = $("<img>").attr("src" , "/pics/userimg.jpg");
      
      var replytxt4 = $('<p></p>').text(data.repMsg);
      if(data.repfile != ""){
        var replytxt5 = $("<img>").attr("src" , "/uploads/" + data.repfile);
        }else{
          var replytxt5 = "";
        }
        var finalMsg = $('<div></div>').html(replytxt4);
    finalMsg = finalMsg.append(replytxt5);
      $('#messages').append($('<li  class='+clas+'>').append(usrImg,finalMsg).attr("rel" , data.id).append($("<ul class='replymsg'>").append($("<li>").append(usrImg,finalMsg1))));
   
    }else{

      $('#messages').append($('<li  class='+clas+'>').append(usrImg,finalMsg1).attr("rel" , data.id));
   
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