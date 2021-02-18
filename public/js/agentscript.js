//code for checking unique username and email.
// also for verifying deatils.
$(function(){

    var socket = io('/agent');

    $("#agentLogin").submit(function(e){
      e.preventDefault();
     var formData = $("#agentLogin").serialize();

        $.ajax({
          type: "POST",
          url: "http://localhost:5002/agent/api/v1/login",
          //url: "https://192.168.1.110:5000/agent/api/v1/login",
          //url: "https://umairyasin1-dinochat.glitch.me/agent/api/v1/login",
          //url: "https://dinochat.glitch.me/agent/api/v1/login",
          //url: "https://dinochat.netlify.app/agent/api/v1/login",
          //url: "https://dinochat1.herokuapp.com/agent/api/v1/login",
          data: formData,
          success: function(result){
           if(result == '1'){
              $(".error").text("Some Error Occured During Login.");
           }

           if(result == "2"){
            $(".error").text("User Not Found. Please Check Your Username and Password.");
           }

           if(result == "3"){
            window.location.href = "http://localhost:5002/agent/dashboard";
            //window.location.href = "https://192.168.1.110:5000/agent/dashboard";
            //window.location.href = "https://umairyasin1-dinochat.glitch.me/agent/dashboard";
            //window.location.href = "https://dinochat.glitch.me/agent/dashboard";
            //window.location.href = "https://dinochat.netlify.app/agent/dashboard";
            //window.location.href = "https://dinochat1.herokuapp.com/agent/dashboard";
           }

          },
          error: function (e) {
            alert(result);
            alert(e.data);
          }
      });
    })
    
  
    var  eflag = 0;
    var  pflag = 1;
  
    //checking for email.
     $('#agent_email').keyup(function(){
  
       var email = $('#agent_email').val();
       var atpos = email.indexOf("@");
       var dotpos = email.lastIndexOf(".");
  
       if (atpos < 1 || dotpos < atpos+2 || dotpos+2 >= email.length){
         eflag = 0;
         $('#error1').show().text("Please Enter Valid Email.");
    
       }
       else{
         socket.emit('checkAgentEmail',email);
         socket.on('checkAgentEmail',function(data){
           if(data == 1){
             eflag = 1;
             $('#error1').hide();
           }
           else{
             eflag = 0;
             $('#error1').show().text("Email Already Exists. Please, Change.");
           }
         });
       }
     }); //end of checking for email.
  
    // //checking password.
    // $('#password').keyup(function(){
    //   var pass = $('#password').val();
    //   if(pass.length < 5){
    //     pflag = 0;
    //     $('#ik2').hide();
    //     $('#ir2').show();
    //     $('#error1').show().text("Password Should Have Atleast 5 Characters.");
    //   }
    //   else{
    //     pflag = 1;
    //     $('#ik2').show();
    //     $('#ir2').hide();
    //     $('#error1').hide();
    //   }
    // }); //end of checking password.
  
    //on form submit code.
    $('form').submit(function(){
      //validate action.
      if(eflag == 1 && pflag == 1){
        return true;
      }
      else{
        $('#error1').show().text("Input Is Incorrect. Please, Change.");
        return false;
      }
    });
  
  });//end of function.
  