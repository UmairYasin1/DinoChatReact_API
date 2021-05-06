$ (function(){

    var socket = io('/newvisitor');

    var visitor_uniqueNumVal = $('#hdnVisitorUniqueNum').val();
    var visitor_web_path = $('#hdnVisitorWebPath').val();
    var visitor_host = $('#hdnVisitorHost').val();
    var visitor_TimezoneLocation = $('#hdnVisitorFP_TimezoneLocation').val();
    var visitor_PublicIpValue = $('#hdnPublicIpValue').val();
    var visitor_PrivateIpValue = $('#hdnPrivateIpValue').val();

    var visitor_GeoLocValue = $('#hdnGeoLocValue').val();
    var visitor_GeoLocValuePrivate = $('#hdnGeoLocValuePrivate').val();
    var visitor_BrowserAndOSValue = $('#hdnBrowserAndOSValue').val();

    
    var visitorURL = "";
    var visitorHost = "";
    if(visitor_web_path != null || visitor_web_path != undefined || visitor_web_path != "")
    {
      visitorURL = visitor_web_path;
    }
    if(visitor_host != null || visitor_host != undefined || visitor_host != "")
    {
      visitorHost = visitor_host;
    }

    socket.on('connect',function(){
        // console.log('visitor_uniqueNumVal ===', visitor_uniqueNumVal);
        // console.log('visitor_web_path ===', visitor_web_path);
        // console.log('visitor_host ===', visitor_host);
        // console.log('visitor_TimezoneLocation ===', visitor_TimezoneLocation);
        // console.log('visitor_PublicIpValue ===', visitor_PublicIpValue);
        // console.log('visitor_PrivateIpValue ===', visitor_PrivateIpValue);

        // console.log('visitor_GeoLocValue ===', visitor_GeoLocValue);
        // console.log('visitor_GeoLocValuePrivate ===', visitor_GeoLocValuePrivate);
        // console.log('visitor_BrowserAndOSValue ===', visitor_BrowserAndOSValue);
        var visitor_GeoLocVal_1;
        var visitor_GeoLocValPrivate_1;
        var visitor_BrowserAndOSVal_1;

        if(visitor_GeoLocValue != null && visitor_GeoLocValue != "" && visitor_GeoLocValue != [])
        {
            visitor_GeoLocVal_1 = JSON.parse(visitor_GeoLocValue);
        }
        else
        {
            visitor_GeoLocVal_1 = [];
        }

        if(visitor_GeoLocValuePrivate != null && visitor_GeoLocValuePrivate != "" && visitor_GeoLocValuePrivate != [])
        {
            visitor_GeoLocValPrivate_1 = JSON.parse(visitor_GeoLocValuePrivate);
        }
        else
        {
            visitor_GeoLocValPrivate_1 = [];
        }

        if(visitor_BrowserAndOSValue != null && visitor_BrowserAndOSValue != "" && visitor_BrowserAndOSValue != [])
        {
            visitor_BrowserAndOSVal_1 = JSON.parse(visitor_BrowserAndOSValue);
        }
        else
        {
            visitor_BrowserAndOSVal_1 = [];
        }


        var data = {
            visitor_uniqueNumVal: visitor_uniqueNumVal,
            visitor_web_path: visitorURL,
            visitor_host: visitorHost,
            visitor_TimezoneLocation: visitor_TimezoneLocation,
            visitor_PublicIpValue: visitor_PublicIpValue,
            visitor_PrivateIpValue: visitor_PrivateIpValue,
            visitor_GeoLocValue: visitor_GeoLocVal_1,
            visitor_GeoLocValuePrivate: visitor_GeoLocValPrivate_1,
            visitor_BrowserAndOSValue: visitor_BrowserAndOSVal_1
        };
        socket.emit('save-walking-customer',data, function (response) {
            console.log('111',response);
            socket.emit('set-user-data',response);
            $("#visitor").val(response);
            $("#visitor_id").val(response);
        });

        //socket.emit('set-user-data',visitorId);
    });

    socket.on('disconnect',function(){
        console.log('disconnect signup visitor script');
    });

});//end of function.