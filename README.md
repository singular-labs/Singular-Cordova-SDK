
  
<img src="https://www.singular.net/wp-content/uploads/2022/02/singular_15012020.png">  
  
# Cordova Singular plugin for Android and iOS.   
[![npm version](https://badge.fury.io/js/singular_cordova_sdk.svg)](https://badge.fury.io/js/https://www.npmjs.com/package/singular_cordova_sdk)  
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)   
[![Downloads](https://img.shields.io/npm/dm/singular_cordova_sdk.svg)](https://www.npmjs.com/package/singular_cordova_sdk)  



  
## Table of content  
  
- [SDK versions](#plugin-build-for)  
- [Installation](#installation)  
- [Guides](#guides)  
- [Setup](#setup)  
- [Sample App](#sample-app)    
- [Ionic](#ionic)  
  
  
### <a id="plugin-build-for"> This plugin is built for  
  
- iOS Singular SDK **v12.0.7**  
- Android Singular SDK **12.1.3**  
  

  
  
## <a id="installation">📲Installation  
  
```  
$ cordova plugin add singular_cordova_sdk  
```  

  
> **_NOTE:_** for Ionic installation see [this](#ionic) section  

  
## <a id="guides"> 📖 Guides  
  
Great installation, usage and setup guides can be viewed [here](https://support.singular.net/hc/en-us/articles/8586543222683).  


  
  
## <a id="setup"> 🚀 Setup  
  
####  Prepare your Singular API Key and Secret Key
  
  
Add the following lines to your code to be able to initialize tracking with your own Singular API Key and Secret Key:  
  
  
```javascript  
document.addEventListener('deviceready', function() {  
  
    var singularConfig = new cordova.plugins.SingularCordovaSdk.SingularConfig("apiKey", "secretKey");
    cordova.plugins.SingularCordovaSdk.init(singularConfig);
}, false);  
```  
---  
  
  
  
  
## <a id="sample-app"> 📱 Sample App  
A sample app can be found in [here](https://github.com/singular-labs/Singular-Cordova-SDK/tree/main/SampleApp)
## <a id="ionic"> 📍 Ionic  

  
###  Using the `cordova` object directly  
Install the cordova plugin:  
```  
$ ionic cordova plugin add singular_cordova_sdk  
```  
In your main ts file, declare a window variable:  
```javascript  
declare var cordova;  
```  
Now you can use the Singular plugin directly from cordova:  
```javascript  
import {Component} from '@angular/core';  
import {Platform} from '@ionic/angular';  
  
declare var cordova;  
...  
export class HomePage {  
  constructor(public platform: Platform) {  
  this.platform.ready().then(() => {  
    var singularConfig = new cordova.plugins.SingularCordovaSdk.SingularConfig("apiKey", "secretKey");
    cordova.plugins.SingularCordovaSdk.init(singularConfig);  
 }); }}  
```  
  

