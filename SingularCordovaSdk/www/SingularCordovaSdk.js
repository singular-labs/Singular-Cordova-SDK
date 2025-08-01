var exec = require('cordova/exec');
const PLUGIN_VERSION = "1.8.0"
const ADMON_REVENUE_EVENT_NAME = '__ADMON_USER_LEVEL_REVENUE__';

module.exports.init = function(singularConfig) {
    var singularLinkHandler = singularConfig.singularLinkHandler;
    var conversionValueUpdatedHandler = singularConfig.conversionValueUpdatedHandler;
    var conversionValuesUpdatedHandler = singularConfig.conversionValuesUpdatedHandler;
    var deviceAttributionCallbackHandler = singularConfig.deviceAttributionCallbackHandler;
    var sdidReceivedCallback = singularConfig.sdidReceivedCallback;
    var didSetSdidCallback = singularConfig.didSetSdidCallback;
    var callback = function(message) {
        var messageObject = JSON.parse(message);
        switch(messageObject.type) {
            case "SingularLinkHandler":
                if (typeof singularLinkHandler === "function") {
                    singularLinkHandler(messageObject.data);
                }
                break;
            case "ConversionValueUpdatedHandler":
                if (typeof conversionValueUpdatedHandler === "function") {
                    conversionValueUpdatedHandler(messageObject.data);
                }
                break;
            case "ConversionValuesUpdatedHandler":
                if (typeof conversionValuesUpdatedHandler === "function") {
                    conversionValuesUpdatedHandler(messageObject.data);
                }
                break;
            case "DeviceAttributionCallbackHandler":
                if (typeof deviceAttributionCallbackHandler === "function") {
                   deviceAttributionCallbackHandler(messageObject.data);
                }
                break;
            case "sdidReceivedCallback":
                if (typeof sdidReceivedCallback === "function") {
                    sdidReceivedCallback(messageObject.result);
                }
                break;
            case "didSetSdidCallback":
                if (typeof didSetSdidCallback === "function") {
                    didSetSdidCallback(messageObject.result);
                }
                break;
            case "InitDone":
                break;
        }
    }
    
    exec(callback, function(){}, 'SingularCordovaSdk', 'init', [singularConfig]);
    exec(function (){}, function (){}, 'SingularCordovaSdk', 'setSDKVersion', ["Cordova", PLUGIN_VERSION]);
}

module.exports.createReferrerShortLink = function(url, refName, refId, passthroughParams, resultHandler) {

    var onSuccess = resultHandler.onSuccess;
    var onError = resultHandler.onError;
    var callback  = function(message) {
        var messageObject = JSON.parse(message);
        switch(messageObject.type) {
            case "OnSuccess":
                onSuccess(messageObject.data);
                break;
            
            case "OnError":
                onError(messageObject.data);
                break;

            case "Done":
                break;
        }
    }
    
    exec(callback, function(){}, 'SingularCordovaSdk', 'createReferrerShortLink', [url, refName, refId, passthroughParams]);   
}

module.exports.event = function(eventName) {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'event', [eventName]);   
}

module.exports.eventWithArgs = function(eventName, args) {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'eventWithArgs', [eventName, args]);   
}

module.exports.adRevenue = function(adData) {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'eventWithArgs', [ADMON_REVENUE_EVENT_NAME, adData]); 
}

module.exports.revenue = function(currency, amount) {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'revenue', [currency, amount]);   
}

module.exports.revenueWithArgs = function(currency, amount, args) {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'revenueWithArgs', [currency, amount, args]);   
}

module.exports.customRevenue = function(eventName, currency, amount) {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'customRevenue', [eventName, currency, amount]);   
}

module.exports.customRevenueWithArgs = function(eventName, currency, amount, args) {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'customRevenueWithArgs', [eventName, currency, amount, args]);   
}

module.exports.setUninstallToken = function(token) {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'setUninstallToken', [token]);   
}

module.exports.trackingOptIn = function() {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'trackingOptIn', []);   
}

module.exports.trackingUnder13 = function() {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'trackingUnder13', []);   
}

module.exports.stopAllTracking = function() {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'stopAllTracking', []);   
}

module.exports.resumeAllTracking = function() {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'resumeAllTracking', []);   
}

module.exports.isAllTrackingStopped = function(success) {
    exec(function(res) {
        if (res == 'true') {
            success(true);
        } else {
            success(false);
        }
    }, function(){}, 'SingularCordovaSdk', 'isAllTrackingStopped', []);   
}

module.exports.limitDataSharing = function(value) {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'limitDataSharing', [value]);   
}

module.exports.getLimitDataSharing = function(success) {
    exec(function(res) {
        if (res == 'true') {
            success(true);
        } else {
            success(false);
        }
    }, function(){}, 'SingularCordovaSdk', 'getLimitDataSharing', []);   
}

module.exports.skanUpdateConversionValue = function(value, success) {
    exec(function(res) {
        if (res == 'true') {
            success(true);
        } else {
            success(false);
        }
    }, function(){}, 'SingularCordovaSdk', 'skanUpdateConversionValue', [value]);   
}

module.exports.skanUpdateConversionValues = function(value, coarse, lock, success) {
    exec(function(res) {
        if (res == 'true') {
            success(true);
        } else {
            success(false);
        }
    }, function(){}, 'SingularCordovaSdk', 'skanUpdateConversionValues', [value, coarse, lock]);   
}

module.exports.skanGetConversionValue = function(success) {
    exec(function(res) {
        success(+res);
    }, function(){}, 'SingularCordovaSdk', 'skanGetConversionValue', []);   
}

module.exports.setGlobalProperty = function(key, value, overrideExisting, success) {
    exec(function (res) {
        if (res == 'true') {
            success(true);
        } else {
            success(false);
        }
    }, function(){}, 'SingularCordovaSdk', 'setGlobalProperty', [key, value, overrideExisting]);   
}

module.exports.unsetGlobalProperty = function(key) {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'unsetGlobalProperty', [key]);   
}

module.exports.clearGlobalProperties = function() {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'clearGlobalProperties', []);   
}

module.exports.getGlobalProperties = function(success) {
    exec(function(res) {
        success(JSON.parse(res));
    }, function(){}, 'SingularCordovaSdk', 'getGlobalProperties', []);   
}

module.exports.skanRegisterAppForAdNetworkAttribution = function() {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'skanRegisterAppForAdNetworkAttribution', []);   
}

module.exports.setCustomUserId = function(userId) {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'setCustomUserId', [userId]);   
}

module.exports.unsetCustomUserId = function(userId) {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'unsetCustomUserId', []);   
}

module.exports.handlePushNotification = function(pushNotificationPayload) {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'handlePushNotification', [pushNotificationPayload]);
}

module.exports.setLimitAdvertisingIdentifiers = function(enabled) {
    exec(function(){}, function(){}, 'SingularCordovaSdk', 'setLimitAdvertisingIdentifiers', [enabled]);
}
