package singular_cordova_sdk;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import java.util.ArrayList;
import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.Arrays;
import android.util.Log;

import com.singular.sdk.ShortLinkHandler;
import com.singular.sdk.Singular;
import com.singular.sdk.DeferredDeepLinkHandler;
import com.singular.sdk.SingularAdData;
import com.singular.sdk.SingularConfig;
import com.singular.sdk.SingularLinkParams;
import com.singular.sdk.SingularLinkHandler;
import com.singular.sdk.SingularDeviceAttributionHandler;
import com.singular.sdk.SDIDAccessorHandler;
import android.content.Context;
import org.json.JSONException;
import android.os.Looper;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import android.content.Intent;


/**
 * This class echoes a string called from JavaScript.
 */
public class SingularCordovaSdk extends CordovaPlugin {

    private static int currentIntentHash;
    private static SingularConfig config;
    private static SingularLinkHandler singularLinkHandler;
    private static String[][] pushNotificationsLinkPaths;


    private static SingularCordovaSdk instance;

    {
        instance = this;
    }

    public static void handleNewIntent(Intent intent) {
        if (intent == null) {
            return;
        }

        if (config == null) {
            return;
        }

        if (intent.hashCode() == currentIntentHash) {
            return;
        }

        currentIntentHash = intent.hashCode();

        // We want to trigger the singular link handler only if it's registered
        if (singularLinkHandler != null && intent.getData() != null) {
            config.withSingularLink(intent, singularLinkHandler);
        }

        if (intent.getExtras() != null && intent.getExtras().size() > 0 && pushNotificationsLinkPaths != null && pushNotificationsLinkPaths.length > 0) {
            config.withPushNotificationPayload(intent, pushNotificationsLinkPaths);
        }

        Context context = instance.cordova.getActivity().getApplicationContext();
        Singular.init(context, config);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("init")) {
            JSONObject config = args.getJSONObject(0);
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    init(config, callbackContext);
                }
            });
            return true;
        }

        if (action.equals("createReferrerShortLink")) {
            String url = args.getString(0);
            String refName = args.getString(1);
            String refId = args.getString(2);
            JSONObject passthroughParams = args.getJSONObject(3);
            this.createReferrerShortLink(url,
                    refName,
                    refId,
                    passthroughParams,
                    callbackContext);
            return true;
        }

        if (action.equals("event")) {
            String eventName = args.getString(0);
            this.event(eventName, callbackContext);
            return true;
        }

        if (action.equals("eventWithArgs")) {
            String eventName = args.getString(0);
            JSONObject arguments = args.getJSONObject(1);
            this.eventWithArgs(eventName, arguments, callbackContext);
            return true;
        }

        if (action.equals("revenue")) {
            String currency = args.getString(0);
            Double amount = args.getDouble(1);
            this.revenue(currency, amount, callbackContext);
            return true;
        }

        if (action.equals("revenueWithArgs")) {
            String currency = args.getString(0);
            Double amount = args.getDouble(1);
            JSONObject arguments = args.getJSONObject(2);
            this.revenueWithArgs(currency, amount, arguments, callbackContext);
            return true;
        }

        if (action.equals("customRevenue")) {
            String eventName = args.getString(0);
            String currency = args.getString(1);
            Double amount = args.getDouble(2);
            this.customRevenue(eventName, currency, amount, callbackContext);
            return true;
        }

        if (action.equals("customRevenueWithArgs")) {
            String eventName = args.getString(0);
            String currency = args.getString(1);
            Double amount = args.getDouble(2);
            JSONObject arguments = args.getJSONObject(3);
            this.customRevenueWithArgs(eventName, currency, amount, arguments, callbackContext);
            return true;
        }

        if (action.equals("stopAllTracking")) {
            this.stopAllTracking(callbackContext);
            return true;
        }

        if (action.equals("resumeAllTracking")) {
            this.resumeAllTracking(callbackContext);
            return true;
        }

        if (action.equals("isAllTrackingStopped")) {
            this.isAllTrackingStopped(callbackContext);
            return true;
        }

        if (action.equals("setGlobalProperty")) {
            String key = args.getString(0);
            String value = args.getString(1);
            Boolean overrideExisting = args.getBoolean(2);
            this.setGlobalProperty(key, value, overrideExisting, callbackContext);
            return true;
        }

        if (action.equals("unsetGlobalProperty")) {
            String key = args.getString(0);
            this.unsetGlobalProperty(key, callbackContext);
            return true;
        }

        if (action.equals("clearGlobalProperties")) {
            this.clearGlobalProperties(callbackContext);
            return true;
        }

        if (action.equals("getGlobalProperties")) {
            this.getGlobalProperties(callbackContext);
            return true;
        }

        if (action.equals("limitDataSharing")) {
            Boolean value = args.getBoolean(0);
            this.limitDataSharing(value, callbackContext);
            return true;
        }

        if (action.equals("getLimitDataSharing")) {
            this.getLimitDataSharing(callbackContext);
            return true;
        }

        if (action.equals("setUninstallToken")) {
            String token = args.getString(0);
            this.setUninstallToken(token,callbackContext);
            return true;
        }

        if (action.equals("trackingOptIn")) {
            this.trackingOptIn(callbackContext);
            return true;
        }

        if (action.equals("trackingUnder13")) {
            this.trackingUnder13(callbackContext);
            return true;
        }

        if (action.equals("setCustomUserId")) {
            String customUserId = args.getString(0);
            this.setCustomUserId(customUserId, callbackContext);
            return true;
        }

        if (action.equals("unsetCustomUserId")) {
            this.unsetCustomUserId(callbackContext);
            return true;
        }

        if (action.equals("setDeviceCustomUserId")) {
            String customUserId = args.getString(0);
            this.setDeviceCustomUserId(customUserId, callbackContext);
            return true;
        }

        if (action.equals("setSDKVersion")) {
            String wrapper = args.getString(0);
            String version = args.getString(1);
            this.setSDKVersion(wrapper, version, callbackContext);
            return true;
        }

        return false;
    }

    private void createReferrerShortLink(String url, String refName, String refId, JSONObject passthroughParams, CallbackContext callbackContext){
        Singular.createReferrerShortLink(url,
                refName,
                refId,
                passthroughParams,
                new ShortLinkHandler() {
                    @Override
                    public void onSuccess(final String link) {
                        try {
                            JSONObject res = new JSONObject();
                            res.put("type","OnSuccess");
                            res.put("data", link);
                            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, res.toString());
                            pluginResult.setKeepCallback(true); // keep callback
                            callbackContext.sendPluginResult(pluginResult);
                        } catch (Throwable e) { }
                    }

                    @Override
                    public void onError(final String error) {
                        try {
                            JSONObject res = new JSONObject();
                            res.put("type","OnError");
                            res.put("data", error);
                            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, res.toString());
                            pluginResult.setKeepCallback(true); // keep callback
                            callbackContext.sendPluginResult(pluginResult);
                        } catch (Throwable e) { }
                    }
                });

        try {
            JSONObject res = new JSONObject();
            res.put("type","Done");
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, res.toString());
            pluginResult.setKeepCallback(true); // keep callback
            callbackContext.sendPluginResult(pluginResult);
        } catch(Throwable e) { }
    }

    private void init(JSONObject config, CallbackContext callbackContext) {
        SingularConfig singularConfig = this.buildSingularConfig(config, callbackContext);
        Context context = this.cordova.getActivity().getApplicationContext();
        Singular.init(context, singularConfig);

        try {
            JSONObject res = new JSONObject();
            res.put("type","InitDone");
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, res.toString());
            pluginResult.setKeepCallback(true); // keep callback
            callbackContext.sendPluginResult(pluginResult);
        } catch (Throwable e) { }
    }

    private void event(String eventName, CallbackContext callbackContext) {
        Singular.event(eventName);
        callbackContext.success("ok");
    }

    private SingularConfig buildSingularConfig(JSONObject configJson, CallbackContext callbackContext) {
        String apikey = configJson.optString("apikey", null);
        String secret = configJson.optString("secret", null);

        config = new SingularConfig(apikey, secret);

        long ddlTimeoutSec = configJson.optLong("ddlTimeoutSec", 0);
        if (ddlTimeoutSec > 0) {
            config.withDDLTimeoutInSec(ddlTimeoutSec);
        }

        singularLinkHandler = new SingularLinkHandler() {
            @Override
            public void onResolved(SingularLinkParams singularLinkParams) {
                try {
                    JSONObject res = new JSONObject();
                    JSONObject data = new JSONObject();
                    res.put("type","SingularLinkHandler");
                    data.put("deeplink", singularLinkParams.getDeeplink());
                    data.put("passthrough", singularLinkParams.getPassthrough());
                    data.put("isDeferred", singularLinkParams.isDeferred());
                    data.put("urlParameters", singularLinkParams.getUrlParameters());
                    res.put("data", data);

                    PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, res.toString());
                    pluginResult.setKeepCallback(true); // keep callback
                    callbackContext.sendPluginResult(pluginResult);
                } catch (Throwable e) { }
            }
        };

        JSONArray pushNotificationLinkPaths = configJson.optJSONArray("pushNotificationsLinkPaths");
        String[][] pushSelectors = convertTo2DArray(pushNotificationLinkPaths);

        if (pushSelectors != null) {
            pushNotificationsLinkPaths = pushSelectors;
        }

        if (this.cordova.getActivity() != null &&  this.cordova.getActivity().getIntent() != null) {
            Intent intent = this.cordova.getActivity().getIntent();

            int intentHash = intent.hashCode();
            if (intentHash != currentIntentHash) {
                currentIntentHash = intentHash;
                long shortLinkResolveTimeout = configJson.optLong("shortLinkResolveTimeout", 10);
                config.withSingularLink(intent, singularLinkHandler, shortLinkResolveTimeout);

                if (intent.getExtras() != null && intent.getExtras().size() > 0) {
                    if (pushNotificationsLinkPaths != null) {
                        config.withPushNotificationPayload(intent, pushNotificationsLinkPaths);
                    }
                }
            }
        }

        String customUserId = configJson.optString("customUserId", null);
        if (customUserId != null) {
            config.withCustomUserId(customUserId);
        }

        String imei = configJson.optString("imei", null);
        if (imei != null) {
            config.withIMEI(imei);
        }

        int sessionTimeout = configJson.optInt("sessionTimeout", -1);
        if (sessionTimeout >= 0) {
            config.withSessionTimeoutInSec(sessionTimeout);
        }

        Object limitDataSharing = configJson.opt("limitDataSharing");
        if (limitDataSharing != JSONObject.NULL) {
            config.withLimitDataSharing((boolean)limitDataSharing);
        }

        boolean collectOAID = configJson.optBoolean("collectOAID", false);
        if (collectOAID) {
            config.withOAIDCollection();
        }

        boolean enableLogging = configJson.optBoolean("enableLogging", false);
        if (enableLogging) {
            config.withLoggingEnabled();
        }

        boolean limitAdvertisingIdentifiers = configJson.optBoolean("limitAdvertisingIdentifiers", false);
        if (limitAdvertisingIdentifiers) {
            config.withLimitAdvertisingIdentifiers();
        }

        int logLevel = configJson.optInt("logLevel", -1);
        if (logLevel >= 0) {
            config.withLogLevel(logLevel);
        }

        JSONArray espDomainsArray =  configJson.optJSONArray("espDomains");
        List<String> espDomainsList = convertJSONArrayToList(espDomainsArray);
        if (espDomainsList != null && espDomainsList.size() > 0) {
            config.withESPDomains(espDomainsList);
        }

        JSONArray brandedDomainsArray = configJson.optJSONArray("brandedDomains");
        List<String> brandedDomainsList = convertJsonArrayToList(brandedDomainsArray);
        if (brandedDomainsList != null && brandedDomainsList.size() > 0) {
            config.withBrandedDomains(brandedDomainsList);
        }

        String facebookAppId = configJson.optString("facebookAppId", null);
        if (facebookAppId != null) {
            config.withFacebookAppId(facebookAppId);
        }

        JSONObject globalProperties = configJson.optJSONObject("globalProperties");
        if (globalProperties != null) {
            Iterator<String> iter = globalProperties.keys();
            while (iter.hasNext()) {
                String key = iter.next();
                try {
                    JSONObject property = globalProperties.getJSONObject(key);
                    config.withGlobalProperty(property.getString("Key"),
                            property.getString("Value"),
                            property.getBoolean("OverrideExisting"));
                } catch (Throwable e) { }
            }
        }

        config.withSingularDeviceAttribution(new SingularDeviceAttributionHandler() {
            @Override
            public void onDeviceAttributionInfoReceived(Map<String, Object> deviceAttributionData) {
                try {
                    JSONObject deviceAttributionInfo = new JSONObject();
                    JSONObject deviceAttributionDataObject = new JSONObject(deviceAttributionData);
                    deviceAttributionInfo.put("type","DeviceAttributionCallbackHandler");
                    deviceAttributionInfo.put("data", deviceAttributionDataObject);

                    PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, deviceAttributionInfo.toString());
                    pluginResult.setKeepCallback(true); // keep callback
                    callbackContext.sendPluginResult(pluginResult);
                } catch (Throwable e) { }
            };
        });

        // SDID accessor handler
        String customSdid = configJson.optString("customSdid", null);
        if (!isValidNonEmptyString(customSdid)) {
            customSdid = null;
        }
        config.withCustomSdid(customSdid, new SDIDAccessorHandler() {
            @Override
            public void didSetSdid(String result) {
                try {
                    JSONObject didSetSdidData = new JSONObject();
                    didSetSdidData.put("type", "didSetSdidCallback");
                    didSetSdidData.put("result", result);

                    PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, didSetSdidData.toString());
                    pluginResult.setKeepCallback(true); // keep callback
                    callbackContext.sendPluginResult(pluginResult);
                } catch (Throwable e) { }
            }

            @Override
            public void sdidReceived(String result) {
                try {
                    JSONObject sdidReceivedData = new JSONObject();
                    sdidReceivedData.put("type", "sdidReceivedCallback");
                    sdidReceivedData.put("result", result);

                    PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, sdidReceivedData.toString());
                    pluginResult.setKeepCallback(true); // keep callback
                    callbackContext.sendPluginResult(pluginResult);
                } catch (Throwable e) { }
            }
        });

        return config;
    }

    private List<String> convertJSONArrayToList(JSONArray jsonArray) {
        try {
            if (jsonArray == null || jsonArray.length() <= 0) {
                return null;
            }

            List<String> result = new ArrayList<>();
            for(int i = 0; i < jsonArray.length(); i++) {
                result.add(jsonArray.getString(i));
            }

            return result;
        } catch (Throwable throwable) {
            return null;
        }
    }

    private String[][] convertTo2DArray(JSONArray jsonArray) {
        try {
            if (jsonArray == null || jsonArray.length() <= 0) {
                return null;
            }

            String[][] result = new String[jsonArray.length()][];

            for (int outerIndex = 0; outerIndex < jsonArray.length(); outerIndex++) {
                JSONArray innerArray = jsonArray.getJSONArray(outerIndex);
                result[outerIndex] = new String[innerArray.length()];
                for (int innerIndex = 0; innerIndex < innerArray.length(); innerIndex++) {
                    result[outerIndex][innerIndex] = innerArray.getString(innerIndex);
                }
            }

            return result;
        } catch (Throwable throwable) {
            return null;
        }
    }

    private void eventWithArgs(String name, JSONObject args, CallbackContext callbackContext) {
        Singular.event(name, args.toString());
        callbackContext.success("ok");
    }

    private void revenue(String currency, double amount, CallbackContext callbackContext) {
        Singular.revenue(currency, amount);
        callbackContext.success("ok");
    }

    private void revenueWithArgs(String currency, double amount, JSONObject args, CallbackContext callbackContext) {
        Singular.revenue(currency, amount, convertJsonToMap(args.toString()));
        callbackContext.success("ok");
    }

    private void customRevenue(String eventName, String currency, double amount, CallbackContext callbackContext) {
        Singular.customRevenue(eventName, currency, amount);
        callbackContext.success("ok");
    }

    private void customRevenueWithArgs(String eventName, String currency, double amount, JSONObject args, CallbackContext callbackContext) {
        Singular.customRevenue(eventName, currency, amount, convertJsonToMap(args.toString()));
        callbackContext.success("ok");
    }


    private void stopAllTracking( CallbackContext callbackContext) {
        Singular.stopAllTracking();
        callbackContext.success("ok");
    }

    private void resumeAllTracking(CallbackContext callbackContext) {
        Singular.resumeAllTracking();
        callbackContext.success("ok");
    }

    private void isAllTrackingStopped(CallbackContext callbackContext) {
        boolean res = Singular.isAllTrackingStopped();
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, res? "true": "false");
        callbackContext.sendPluginResult(pluginResult);
    }

    private void setGlobalProperty(String key, String value, boolean overrideExisting, CallbackContext callbackContext) {
        boolean res = Singular.setGlobalProperty(key,value,overrideExisting);
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, res? "true": "false");
        callbackContext.sendPluginResult(pluginResult);
    }

    private void unsetGlobalProperty(String key, CallbackContext callbackContext) {
        Singular.unsetGlobalProperty(key);
        callbackContext.success("ok");
    }

    private void clearGlobalProperties(CallbackContext callbackContext) {
        Singular.clearGlobalProperties();
        callbackContext.success("ok");
    }

    private void getGlobalProperties(CallbackContext callbackContext) {
        JSONObject res = new JSONObject(Singular.getGlobalProperties());
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, res.toString());
        callbackContext.sendPluginResult(pluginResult);
    }

    private void limitDataSharing(boolean limitDataSharingValue, CallbackContext callbackContext) {
        Singular.limitDataSharing(limitDataSharingValue);
    }

    private void getLimitDataSharing(CallbackContext callbackContext) {
        boolean res = Singular.getLimitDataSharing();
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, res? "true": "false");
        callbackContext.sendPluginResult(pluginResult);
    }

    private void setUninstallToken(String token, CallbackContext callbackContext) {
        Singular.setFCMDeviceToken(token);
        callbackContext.success("ok");
    }

    private void trackingOptIn(CallbackContext callbackContext) {
        Singular.trackingOptIn();
        callbackContext.success("ok");
    }

    private void trackingUnder13(CallbackContext callbackContext) {
        Singular.trackingUnder13();
        callbackContext.success("ok");
    }

    private void setCustomUserId(String customUserId, CallbackContext callbackContext) {
        Singular.setCustomUserId(customUserId);
        callbackContext.success("ok");
    }

    private void unsetCustomUserId(CallbackContext callbackContext) {
        Singular.unsetCustomUserId();
        callbackContext.success("ok");
    }

    private void setDeviceCustomUserId(String customUserId, CallbackContext callbackContext) {
        Singular.setDeviceCustomUserId(customUserId);
        callbackContext.success("ok");
    }

    private void setSDKVersion(String wrapper, String version, CallbackContext callbackContext) {
        Singular.setWrapperNameAndVersion(wrapper, version);
        callbackContext.success("ok");
    }

    private void setLimitAdvertisingIdentifiers(boolean limitAdvertisingIdentifiers, CallbackContext callbackContext) {
        Singular.setLimitAdvertisingIdentifiers(limitAdvertisingIdentifiers);
        callbackContext.success("ok");
    }

    private Map<String, Object> convertJsonToMap(String json) {
        Map<String, Object> args = new HashMap<>();

        try {
            JSONObject jsonObject = new JSONObject(json);
            Iterator<String> keys = jsonObject.keys();

            while (keys.hasNext()) {
                String key = keys.next();

                args.put(key, jsonObject.get(key));
            }

        } catch (Throwable e) { }

        return args;
    }

    private boolean isValidNonEmptyString(String nullableJavascriptString) {
        return nullableJavascriptString != null
                && nullableJavascriptString instanceof String
                && nullableJavascriptString.length() > 0
                && !nullableJavascriptString.toLowerCase().equals("null")
                && !nullableJavascriptString.toLowerCase().equals("undefined")
                && !nullableJavascriptString.toLowerCase().equals("false")
                && !nullableJavascriptString.equals("NaN");
    }

}
