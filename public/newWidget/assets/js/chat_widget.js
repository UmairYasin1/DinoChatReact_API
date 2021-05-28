$(function() {
    url = parent.document.URL;
    var iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'customer-chatbox');
    iframe.setAttribute("src", "http://173.254.252.226:5001/newchat?v=" + url);
    iframe.style.width = "340px";
    iframe.style.height = "100%";
    iframe.style.position = 'fixed';
    iframe.style.overflow = 'hidden';
    iframe.style.zIndex = 999999;
    iframe.style.right = 0;
    iframe.style.marginRight = '5px';
    // iframe.style.marginBottom = '-374px';
    iframe.style.bottom = 0;
    iframe.border = 0;
    iframe.marginwidth = 0;
    iframe.marginWidth = 0;
    iframe.marginheight = 0;
    iframe.marginHeight = 0;
    iframe.frameBorder = 0;
    document.body.prepend(iframe);
    document.body.appendChild(iframe);
    window.addEventListener('message', receiveMessage, false);
    var responsive_width = "768";

    function receiveMessage(event) {
        console.log(event.data);
        if (event.data == "show_hide") {
            var x = document.getElementById("customer-chatbox");
            //check if window is full screen
            if (x.style.height == "100%" && $(window).width() > responsive_width) {
                x.style.width = "340px";
                x.style.height = "423px";
                x.contentWindow.postMessage('small_screen', '*');
            } else {
                x.style.height = "423px";
                x.contentWindow.postMessage('small_screen', '*');
            }
            if ($(window).width() > responsive_width) {
                //if this is desktop window 
                if (x.style.marginBottom != "0px") {
                    $(x).animate({ marginBottom: '0px' });
                    x.contentWindow.postMessage('class_down', '*');
                } else {
                    $(x).animate({ marginBottom: '-374px' });
                    x.contentWindow.postMessage('class_up', '*');
                }
            } else {
                //if this is responsive window 
                if (x.style.marginBottom != "0px") {
                    x.style.height = "100%";
                    $(x).animate({ marginBottom: '0px' });
                    x.contentWindow.postMessage('full_screen', '*');
                    x.contentWindow.postMessage('class_down', '*');
                } else {
                    $(x).animate({ marginBottom: '-374px' });
                    x.contentWindow.postMessage('class_up', '*');
                }
            }
        } else if (event.data == "show_fullscreen") {
            var x = document.getElementById("customer-chatbox");
            if (x.style.width == "340px") {
                x.style.width = "100%";
                x.style.height = "100%";
                x.style.marginRight = '0px';
                x.contentWindow.postMessage('full_screen', '*');
            } else {
                x.style.width = "340px";
                x.style.height = "423px";
                x.style.marginRight = '5px';
                x.contentWindow.postMessage('small_screen', '*');
            }
        }
    }
    $(window).on('load resize', function(e) {
        if ($(window).width() <= responsive_width) {
            var x = document.getElementById("customer-chatbox");
            $(x).css("width", "100%");
            if (x.style.marginBottom != "0px") {
                $(x).css("height", "423px");
            } else {
                $(x).css("height", "100%");
            }
            $(x).css("margin-right", "0px");
            x.contentWindow.postMessage('responsive', '*');
        } else {
            var x = document.getElementById("customer-chatbox");
            $(x).css("width", "340px");
            $(x).css("margin-right", "5px");
            $(x).css("height", "423px");
            x.contentWindow.postMessage('desktop', '*');
        }
    });
});