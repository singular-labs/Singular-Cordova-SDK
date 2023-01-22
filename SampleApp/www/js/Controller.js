
var Controller = function() {
    var controller = {
        self: null,
        initialize: function() {
            self = this;
            self.bindEvents();
            self.renderEventView();
        },
        bindEvents: function() {
        	$('.tab-button').on('click', this.onTabClick);

        },
        onTabClick: function(e) {
        	e.preventDefault();
            if ($(this).hasClass('active')) {
                return;
            }

            var tab = $(this).data('tab');
            if (tab === '#event-tab') {
                self.renderEventView();
            }else if (tab === '#revenue-tab') {
                self.renderRevenueView();
            }else if (tab === '#purchase-tab') {
                self.renderPurchaseView();
            }else{
                self.renderOtherView();
            }
        },
        renderRevenueView: function() {
            $('.tab-button').removeClass('active');
            $('#revenue-tab-button').addClass('active');

            var $tab = $('#tab-content');
            $tab.empty();
            $("#tab-content").load("./views/revenue-view.html", function(data) {
                $("#revenue").on("click", self.revenueClicked);
                $("#ad_revenue").on("click", self.adRevenueClicked);
                $("#revenue_args").on("click", self.revenueArgsClicked);
                $("#custom_revenue").on("click", self.customRevenueClicked);
                $("#custom_revenue_args").on("click", self.customRevenueArgsClicked);
            });
        },
        renderOtherView: function() {
            $('.tab-button').removeClass('active');
            $('#other-tab-button').addClass('active');

            var $tab = $('#tab-content');
            $tab.empty();
            $("#tab-content").load("./views/other-view.html", function(data) {
                $("#short_link").on("click", self.shortLinkClicked);
                $("#limit_data_sharing_off").on("click", self.limitDataSharingOffClicked);
                $("#limit_data_sharing_on").on("click", self.limitDataSharingOnClicked);
                $("#get_limit_data_sharing").on("click", self.getLimitDataSharingClicked);
                $("#stop_all_tracking").on("click", self.stopAllTrackingClicked);
                $("#resume_all_tracking").on("click", self.resumeAllTrackingClicked);
                $("#is_all_tracking_stopped").on("click", self.isAllTrackingStoppedClicked);
                $("#skan_update_conversion_value").on("click", self.skanUpdateConversionValueClicked);
                $("#skan_update_conversion_values").on("click", self.skanUpdateConversionValuesClicked);
                $("#skan_get_conversion_value").on("click", self.skanGetConversionValueClicked);
                $("#set_global_property").on("click", self.setGlobalPropertyClicked);
                $("#unset_global_property").on("click", self.unsetGlobalPropertyClicked);
                $("#clear_global_properties").on("click", self.clearGlobalPropertiesClicked);
                $("#get_global_properties").on("click", self.getGlobalPropertiesClicked);
                $("#skan_register_app_for_ad_network_attribution").on("click", self.skanRegisterAppForAdNetworkAttributionClicked);
                $("#set_custom_user_id").on("click", self.setCustomUserIdClicked);
                $("#unset_custom_user_id").on("click", self.unsetCustomUserIdClicked);
            });
        },
        renderEventView: function() {
            $('.tab-button').removeClass('active');
            $('#event-tab-button').addClass('active');
            var $tab = $('#tab-content');
            $tab.empty();

            $("#tab-content").load("./views/event-view.html", function(data) {
                $("#event").on("click", self.eventClicked);
                $("#event_args").on("click", self.eventArgsClicked);
            });
        },
        renderPurchaseView: function() {
            $('.tab-button').removeClass('active');
            $('#purchase-tab-button').addClass('active');

            var $tab = $('#tab-content');
            $tab.empty();

            $("#tab-content").load("./views/purchase-view.html", function(data) {
                $("#buy_product").on("click", self.purchaseClicked);
                if (!window.store) {
                    console.log('Store not available');
                    return;
                }
            
                store.error(function(error) {
                    console.log('ERROR ' + error.code + ': ' + error.message);
                });
                
                store.register({
                    id:    'prod_1',
                    type:   store.NON_CONSUMABLE
                });
            
                store.when('prod_1').updated(self.onProductUpdated);
                store.refresh();
            });
        },
        onProductUpdated:function(product) {
            const info = product.loaded
                ? `title: ${product.title}<br/>` +
                  `desc: ${product.description}<br/>` +
                  `price: ${product.price}<br/>`
                : 'Retrieving info...';
            if (product.canPurchase){
                $("#buy_product").removeClass('disabled');
            }else{
                $("#buy_product").addClass('disabled');
            }

            const el = $('#prod_purchase');
            el.html(info);
            
        },
        onProductApproved:function(product) {
            store.when('prod_1 verified', self.onProductVerified);
            product.verify();
        
        },
        purchaseClicked:function() {
            store.when('prod_1 approved', self.onProductApproved);
            store.order('prod_1');
        },
        onProductVerified:function(product){
            const el = $('#prod_verified');
            el.html('Purchase successfull!');
            const iap = new cordova.plugins.SingularCordovaSdk.SingularIAP(product);
        
            cordova.plugins.SingularCordovaSdk.eventWithArgs('IAP_EVENT', 
            iap)
        },
        shortLinkClicked: function(){
            cordova.plugins.SingularCordovaSdk.createReferrerShortLink('https://sample.sng.link/B4tbm/v8fp?_dl=https%3A%2F%2Fabc.com', 
                'refName', 
                'refID',
                { channel:"sms"},
                {
                    onSuccess: function(data){
                        navigator.notification.alert('link: ' + data, function(){}, ['alert'], ['ok'])
                    },
                    onError: function(error){
                        navigator.notification.alert('error: ' + error, function(){}, ['alert'], ['ok'])
                    }
                }
            )
        },
        eventClicked: function(){
            cordova.plugins.SingularCordovaSdk.event('new event')
        },
        eventArgsClicked:function(){
            cordova.plugins.SingularCordovaSdk.eventWithArgs('new event with args', 
            {
                arg1:"val1",
                arg2:"val2"
            })
        },
        revenueClicked:function(){
            cordova.plugins.SingularCordovaSdk.revenue('ILS', 3.2)
        },
        adRevenueClicked:function(){
            const adData = new cordova.plugins.SingularCordovaSdk.SingularAdData("Medation_Platform","USD",0.05)
            .withNetworkName('networkName') 
            .withAdType('adType') 
            .withAdGroupType('adGroupType') 
            .withImpressionId('impressionId') 
            .withAdPlacementName('adPlacementName') 
            .withAdUnitId('adUnitId') 
            .withAdUnitName('adUnitName') 
            .withAdGroupId('adGroupId') 
            .withAdGroupName('adGroupName') 
            .withAdGroupPriority('adGroupPriority') 
            .withPrecision('precision') 
            cordova.plugins.SingularCordovaSdk.adRevenue(adData)
        },
        revenueArgsClicked:function(){
            cordova.plugins.SingularCordovaSdk.revenueWithArgs('USD', 3.2, 
            {
                arg1:"val1",
                arg2:"val2"
            })
        },
        customRevenueClicked:function(){
            cordova.plugins.SingularCordovaSdk.customRevenue('custom revenue','ILS', 3.2)
        },
        customRevenueArgsClicked:function(){
            cordova.plugins.SingularCordovaSdk.customRevenueWithArgs('custom revenue with args','USD', 3.2, 
            {
                arg1:"val1",
                arg2:"val2"
            })
        },
        limitDataSharingOffClicked:function(){
            cordova.plugins.SingularCordovaSdk.limitDataSharing(false)
        },
        limitDataSharingOnClicked:function(){
            cordova.plugins.SingularCordovaSdk.limitDataSharing(true)
        },
        getLimitDataSharingClicked:function(){
            cordova.plugins.SingularCordovaSdk.getLimitDataSharing(
                function(val){
                    navigator.notification.alert('value: ' + val, function(){}, ['alert'], ['ok'])
                })
        },
        resumeAllTrackingClicked:function(){
            cordova.plugins.SingularCordovaSdk.resumeAllTracking()
        },
        stopAllTrackingClicked:function(){
            cordova.plugins.SingularCordovaSdk.stopAllTracking()
        },
        isAllTrackingStoppedClicked:function(){
            cordova.plugins.SingularCordovaSdk.isAllTrackingStopped(
                function(val){
                    navigator.notification.alert('value: ' + val, function(){}, ['alert'], ['ok'])
                })
        },
        skanUpdateConversionValueClicked:function(){
            cordova.plugins.SingularCordovaSdk.skanGetConversionValue(
                function(val){
                    cordova.plugins.SingularCordovaSdk.skanUpdateConversionValue(val +1 ,
                        function(val){
                            navigator.notification.alert('value: ' + val, function(){}, ['alert'], ['ok'])
                        })
                })
            
        },
        skanUpdateConversionValuesClicked:function(){
            cordova.plugins.SingularCordovaSdk.skanUpdateConversionValues(1, 2, true,
                function(val){
                    navigator.notification.alert('value: ' + val, function(){}, ['alert'], ['ok'])
                })
            
        },
        skanGetConversionValueClicked:function(){
            cordova.plugins.SingularCordovaSdk.skanGetConversionValue(
                function(val){
                    navigator.notification.alert('value: ' + val, function(){}, ['alert'], ['ok'])
                })
        },
        setGlobalPropertyClicked:function(){
            cordova.plugins.SingularCordovaSdk.setGlobalProperty("prop1","val1",true,
                function(val){
                    navigator.notification.alert('value: ' + val, function(){}, ['alert'], ['ok'])
                })
        },
        unsetGlobalPropertyClicked:function(){
            cordova.plugins.SingularCordovaSdk.unsetGlobalProperty("prop1")
        },
        clearGlobalPropertiesClicked:function(){
            cordova.plugins.SingularCordovaSdk.clearGlobalProperties()
        },
        getGlobalPropertiesClicked:function(){
            cordova.plugins.SingularCordovaSdk.getGlobalProperties(
                function(data){
                    navigator.notification.alert('value: ' + JSON.stringify(data), function(){}, ['alert'], ['ok'])
                })
        },
        skanRegisterAppForAdNetworkAttributionClicked:function(){
            cordova.plugins.SingularCordovaSdk.skanRegisterAppForAdNetworkAttribution()
        },
        setCustomUserIdClicked:function(){
            cordova.plugins.SingularCordovaSdk.setCustomUserId('CustomUserId');
        },
        unsetCustomUserIdClicked:function(){
            cordova.plugins.SingularCordovaSdk.unsetCustomUserId();
        }
    }
    controller.initialize();
    return controller;
}
