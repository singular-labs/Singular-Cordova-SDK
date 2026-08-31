var controller;
var app = {
    // Application Constructor
    initialize: function() {
        
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            document.addEventListener('deviceready', function() {
                if (typeof FirebasePlugin !== 'undefined') {
                    await FirebasePlugin.grantPermission();
                    
                    FirebasePlugin.getToken(function(token) {
                        console.log("Firebase token: " + token);
                    });
                    
                    FirebasePlugin.hasPermission(function(enabled) {
                        if (enabled) {
                            console.log("🔔 Push notification permission granted.");
                        } else {
                            console.log("🔕 Push notification permission NOT granted.");
                        }
                    });
                    
                    // Handle notifications received in foreground
                    FirebasePlugin.onMessageReceived(function(message) {
                        if (message.tap == 'background') {
                            console.log("Background message:", message);
                            cordova.plugins.SingularCordovaSdk.handlePushNotification(message);
                        } else {
                            console.log("Foreground message:", message);
                        }
                    }, function(error) {
                        console.error("Error setting message receiver:", error);
                    });
                } else {
                    console.error("FirebasePlugin not available");
                }

                // singular sdk
                initSingularSDK();
            }, false);
        } else {
            this.onDeviceReady();
        }
    },
    
    onDeviceReady: function() {
        controller = new Controller();
    },
};


function initSingularSDK() {
    var singularConfig = new cordova.plugins.SingularCordovaSdk.SingularConfig("key", "secret");
    
    var linkHandler = function(data) {
        navigator.notification.alert('link activated: ' + JSON.stringify(data), function(){}, ['alert'], ['ok'])
    }
    
    var conversionHandler = function(data) {
        navigator.notification.alert('conversion callback value: ' + JSON.stringify(data), function(){}, ['alert'], ['ok'])
    }
    
    var conversionHandlerSkan4 = function(data) {
        navigator.notification.alert('SKAN4 conversion callback value: ' + JSON.stringify(data), function(){}, ['alert'], ['ok'])
    }
    var deviceAttributionHandler = function(deviceAttributionInfo){
        navigator.notification.alert('device attribution callback value: ' + JSON.stringify(deviceAttributionInfo), function(){}, ['alert'], ['ok'])
    }
    singularConfig.withDeviceAttributionCallbackHandler(deviceAttributionHandler);
    singularConfig.withConversionValueUpdatedHandler(conversionHandler);
    singularConfig.withConversionValuesUpdatedHandler(conversionHandlerSkan4);
    singularConfig.withSingularLink(linkHandler);
    singularConfig.withLoggingEnabled();
    singularConfig.withLogLevel(3);
    singularConfig.withSkAdNetworkEnabled(true);
    singularConfig.withManualSkanConversionManagement();
    singularConfig.withESPDomains(["bit.ly"]);
    singularConfig.withFacebookAppId("facebook_app_id");
    
    var didSetSdidCallback = function(result) {
        navigator.notification.alert('did set custom sdid: ' + result, function(){}, ['alert'], ['ok'])
    }
    
    var sdidReceivedCallback = function(result) {
        navigator.notification.alert('received sdid: ' + result, function(){}, ['alert'], ['ok'])
    }
    
    singularConfig.withCustomSdid("customSdid", didSetSdidCallback, sdidReceivedCallback);
    singularConfig.withPushNotificationsLinkPaths([['sng_link']]);
    cordova.plugins.SingularCordovaSdk.init(singularConfig);
}

app.initialize();
