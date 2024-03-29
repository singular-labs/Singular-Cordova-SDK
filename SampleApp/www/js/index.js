var controller;
var app = {
    // Application Constructor
    initialize: function() {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            document.addEventListener("deviceready", this.onDeviceReady, false);
        } else {
            this.onDeviceReady();
        }
    },

    onDeviceReady: function() {
        controller = new Controller();
        var singularConfig = new cordova.plugins.SingularCordovaSdk.SingularConfig("key", "secret");
        var linkHandler = function(data){
            navigator.notification.alert('link activated: ' + JSON.stringify(data), function(){}, ['alert'], ['ok'])
        }
        var conversionHandler = function(data){
            navigator.notification.alert('conversion callback value: ' + JSON.stringify(data), function(){}, ['alert'], ['ok'])
        }
        var conversionHandlerSkan4 = function(data){
            navigator.notification.alert('SKAN4 conversion callback value: ' + JSON.stringify(data), function(){}, ['alert'], ['ok'])
        }
        singularConfig.withConversionValueUpdatedHandler(conversionHandler);
        singularConfig.withConversionValuesUpdatedHandler(conversionHandlerSkan4);
        singularConfig.withSingularLink(linkHandler);
        singularConfig.withLoggingEnabled();
        singularConfig.withLogLevel(3);
        singularConfig.withSkAdNetworkEnabled(true);
        singularConfig.withManualSkanConversionManagement();
        singularConfig.withESPDomains(["bit.ly"]);
        singularConfig.withFacebookAppId("facebook_app_id");

         var deviceAttributionHandler = function(deviceAttributionInfo){
            navigator.notification.alert('device attribution callback value: ' + JSON.stringify(deviceAttributionInfo), function(){}, ['alert'], ['ok'])
        }
        
        singularConfig.withDeviceAttributionCallbackHandler(deviceAttributionHandler);

        var didSetSdidCallback = function(result) {
            navigator.notification.alert('did set custom sdid: ' + result, function(){}, ['alert'], ['ok'])
        }

       var sdidReceivedCallback = function(result) {
            navigator.notification.alert('received sdid: ' + result, function(){}, ['alert'], ['ok'])
        }

       singularConfig.withCustomSdid("custom-sdid", didSetSdidCallback, sdidReceivedCallback);
       cordova.plugins.SingularCordovaSdk.init(singularConfig);
    },

};


app.initialize();
