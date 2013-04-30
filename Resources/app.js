    
var isAndroid = (Ti.Platform.name == 'android');
var gproxy = Ti.Gesture;
var wproxy = Ti.UI.WebView;
var vielite = require('utils/global').getGlobals();
var uielements = require('uielements');
var notifIsInForeground = true;
 
Ti.App.addEventListener('pause', function(){
    notifIsInForeground = false;
});
 
 Ti.App.addEventListener('resume', function(){
    setTimeout(function(){
        notifIsInForeground = true;
        },5000);
        if(vielite.data.user.userID){
            //Ti.API.info("registerin con "+vielite.data.user.userID);
        vielite.events.registerPush(0);
        }
        
});
if(!isAndroid)Titanium.UI.iPhone.setAppBadge(null);
Ti.UI.setBackgroundColor('#FFF');
Ti.App.addEventListener('session:login',vielite.events.doLogin);
Ti.App.addEventListener('session:logout',vielite.events.doLogout);
Ti.App.addEventListener('session:autologin',vielite.events.doAutologin);
Ti.App.addEventListener('error:noconnection',vielite.events.noConnection);



Ti.App.fireEvent('session:autologin');
var App = {
    Models: {},
    Controllers: {},
    UI: {},
    Styles: {}
};
Ti.include('utils/http.js');
    Modal= require( 'controllers/twLibrary/infomodalview');
    twitter= require( 'controllers/Twitter' ).create( this.Modal);
