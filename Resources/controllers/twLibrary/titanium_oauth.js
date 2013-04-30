/*
* Titanium OAuth Client
*
* Copyright 2010, Social Vitamin, Inc.
* Licensed under the MIT
* Copyright (c) 2010 Social Vitamin, Inc.
*
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

Ti.include('/controllers/twLibrary/sha1.js');
Ti.include('/controllers/twLibrary/oauth.js');

var TitaniumOAuth = function(ck, cs) {

	var self = this;
	// var currentWin = Ti.UI.currentWindow;
	var authWebView = null;
	var oauthWin = null;

	var consumer = {
	    consumerKey:      ck,
	    consumerSecret:   cs,
	    serviceProvider: {
	        signatureMethod:     'HMAC-SHA1',
	        requestTokenURL:     'https://twitter.com/oauth/request_token',
	        userAuthorizationURL:'https://twitter.com/oauth/authorize',
	        accessTokenURL:      'https://twitter.com/oauth/access_token',
			oauthVersion:        '1.0'
	    }
	};
	
	var accessor = {
	    consumerSecret: consumer.consumerSecret,
	    tokenSecret: ''
	};

	this.loggedIn = function() {
		return  (Ti.App.Properties.getString('accessToken', null) == null && Ti.App.Properties.getString('accessTokenSecret') == null) ? false : true;
	};
	
	// Get Authorization PIN
	var getPIN = function(e)
	{
		
		var html = authWebView.evalJS("document.getElementById('oauth_pin').innerHTML");
		//Ti.API.info("get pin" + html);
		if (html != '') {
			var regex = new RegExp("([0-9]+)", "m"); 
			if (regex) {
				var pin = html.match(regex)[0]; 
				//Ti.API.info("Pin "+pin);
				if (pin) {
					self.accessToken(pin);
					if(oauthWin != null) {
						oauthWin.close();
					}				
				}
			}
		}
	};
	
	// Request Token
	this.requestToken = function(callback){
		
		if (Ti.App.Properties.getString('accessToken', null) != null &&
		Ti.App.Properties.getString('accessTokenSecret', null) != null) {
		//Ti.API.info('[V] Request Token Properties - '+Ti.App.Properties.getString('accessToken', null)+ ' - '+Ti.App.Properties.getString('accessTokenSecret', null));
			// Login
			self.dispatch('login');

			callback && callback();

			return;

		}
		//Ti.API.info('[V] Request token - 1');
		var message = {
		    method: 'GET',
		    action: consumer.serviceProvider.requestTokenURL,
		    parameters: [
		       ['oauth_signature_method', consumer.serviceProvider.signatureMethod],
		       ['oauth_consumer_key', consumer.consumerKey],
		       ['oauth_version', consumer.serviceProvider.oauthVersion]
		   ]
		};
		//Ti.API.info('[V] Request token - 2');
		OAuth.setTimestampAndNonce(message);
		//Ti.API.info('[V] Request token - 3');
		OAuth.setParameter(message, "oauth_timestamp", OAuth.timestamp());
		//Ti.API.info('[V] Request token - 4');
		OAuth.SignatureMethod.sign(message, accessor);
		//Ti.API.info('[V] Request token - 5');
		var finalUrl = OAuth.addToURL(message.action, message.parameters);
		//Ti.API.info('[V] Request token - final url: '+finalUrl);
		var xhr = Titanium.Network.createHTTPClient();
		xhr.onload = function()
		{
			//Ti.API.info('[V] Request token - XHR load: ');
			if (!this.responseText.match(/oauth_token=([^&]+)&/)){
				self.logout();
			}
			
			// Set Tokens
			Ti.App.Properties.setString('oauthToken', this.responseText.match(/oauth_token=([^&]+)/)[1]);
			Ti.App.Properties.setString('oauthTokenSecret', this.responseText.match(/oauth_token_secret=([^&]+)/)[1]);
			
			// Access Token Secret
			accessor.tokenSecret = Ti.App.Properties.getString('accessTokenSecret', null);
			
			// Verify if we have an access token if we dont show auth webview
			if (Ti.App.Properties.getString('accessToken', null) == null && 
					Ti.App.Properties.getString('accessTokenSecret', null) == null) {
					//Ti.API.info(consumer.serviceProvider.userAuthorizationURL + '?' + this.responseText + '&force_login=true');
				self.oauthWebView({
					url: consumer.serviceProvider.userAuthorizationURL + '?' + this.responseText + '&force_login=true'
				});
			} else {
				callback && callback();
			}
			
		};
		xhr.onerror = function(e) {
			Ti.UI.createAlertDialog({
                title: 'Service Unavailable',
                message: 'Service unavailable please try again later.'+e.error
            }).show();
			
			// Logout
			self.logout();
		};
		xhr.open('GET', finalUrl);
		xhr.send();
	
	};
	
	// Access Token
	this.accessToken = function(pin, callback){
		
	    var message = {
	        method: 'GET',
	        action: consumer.serviceProvider.accessTokenURL,
		   parameters: [
	           ['oauth_signature_method', consumer.serviceProvider.signatureMethod],
	           ['oauth_consumer_key', consumer.consumerKey],
	           ['oauth_version', consumer.serviceProvider.oauthVersion],
	           ['oauth_token', Ti.App.Properties.getString('oauthToken', null)],
	           ['oauth_verifier', pin]
	       ]
	    };

	    OAuth.setTimestampAndNonce(message);
	    OAuth.setParameter(message, "oauth_timestamp", OAuth.timestamp());
	    OAuth.SignatureMethod.sign(message, accessor);
		
	    var finalUrl = OAuth.addToURL(message.action, message.parameters);
		//Ti.API.info('[V] Access token - final url: '+finalUrl);
		var xhr = Titanium.Network.createHTTPClient();
		xhr.onload = function()
		{
			
			if (!this.responseText.match(/oauth_token=([^&]+)&/)){
				self.logout();
			}
			
			Ti.App.Properties.setString('accessToken', this.responseText.match(/oauth_token=([^&]+)&/)[1]);
			Ti.App.Properties.setString('accessTokenSecret', this.responseText.match(/oauth_token_secret=([^&]+)&/)[1]);	

			// Login
			self.dispatch('login');
		};
		xhr.onerror = function(e) {

			Ti.UI.createAlertDialog({
                title: 'Service Unavailable',
                message: 'Service unavailable please try again later\n'+e.error
            }).show();
			
			// Logout
			self.logout();
		};
		xhr.open('GET', finalUrl);
		xhr.send();

	};
	
	// Show Authorization Web View
	this.oauthWebView = function(params)
	{
		
		var t = Titanium.UI.create2DMatrix().scale(0);
		
		var win = Ti.UI.createWindow({
			// backgroundColor:'#fff',
			navBarHidden:true,
			transform: t,
			opacity: (Ti.Platform.osname=='android') ? 0 : 1
        });
        
        var view = Ti.UI.createView({
        	backgroundColor:'#fff',
			borderWidth:4,
			borderColor:'#52D3FE',
			height:'95%',
			width:'95%',
			borderRadius:10,
			navBarHidden:true,
			opacity: (Ti.Platform.osname=='android') ? 0.8 : 1
        });

		// WebView
	    authWebView = Ti.UI.createWebView({
				url: params.url,
				height:'95%',
				width:'95%',
			});
		
		authWebView.addEventListener('load', getPIN);
		view.add(authWebView);
	    win.add(view);
		
		// Remove window button
		var cl = Ti.UI.createLabel({
			width: 30,
			height: 30,
			right: 10, 
			top: 10,
			borderRadius: 6,
			borderColor: '#52D3FE',
			backgroundColor: '#52D3FE',
			text: 'X',
			textAlign: 'center',
			font:{fontSize:11, fontWeight: 'bold'},
			color:'#fff'
		});
		
		cl.addEventListener('click', function(e){
			win.close();
			Ti.App.fireEvent('twWindowClosed');
		});
		
		win.add(cl);
		//Ti.API.info('[V] OPEN: '+win);
		win.open();
		
		// Window Animation
		var t1 = Ti.UI.create2DMatrix().scale(0);
		var t2 = Ti.UI.create2DMatrix().scale(1.1);
		var t3 = Ti.UI.create2DMatrix().scale(1.0);
		
		var a = Titanium.UI.createAnimation({transform: t1, duration: 300});
		var a2 = Titanium.UI.createAnimation({transform: t2, duration: 350});
		var a3 = Titanium.UI.createAnimation({transform: t3, duration: 400});
		
		win.animate(a);
		
		a.addEventListener('complete', function()
		{
			win.animate(a2);
		});
		
		a2.addEventListener('complete', function()
		{
			win.animate(a3);
		});
		
		// Set the window so we can remove it in the callback
		oauthWin = win;
	
	};
	
	// Request
	this.request = function(options, callback, failure) {
		 
        var message = {
			method: options.method,
			action: options.action,
			parameters: [
			['oauth_signature_method', consumer.serviceProvider.signatureMethod],
			['oauth_consumer_key', consumer.consumerKey],
			['oauth_version', consumer.serviceProvider.oauthVersion],
			['oauth_token', Ti.App.Properties.getString('accessToken', null)]
			]
		};

		for (param in options.parameters) {
			message.parameters.push(options.parameters[param]);
		};

		// Access Token Secret
		accessor.tokenSecret = Ti.App.Properties.getString('accessTokenSecret', null);

		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, accessor);

		var finalUrl = OAuth.addToURL(message.action, message.parameters);
		//Ti.API.info('[V] Request - final url: '+finalUrl);
		var xhr = Titanium.Network.createHTTPClient({
			timeout: 200000
		});
		xhr.onload = function() {
			callback(this.responseText);
		};
		xhr.onerror = function(e) {
			if(failure)
				failure(e.error);
			else{
				Ti.UI.createAlertDialog({
					title: 'Service Unavailable',
					message: 'An error ocurred while making a request\n'+e.error
				}).show();
	
				// Logout
				self.dispatch('logout');
			}
		};
		xhr.open(options.method, finalUrl, false);
		xhr.send();
		
	};
	
	this.logout = function() {
		Ti.App.Properties.removeProperty('oauthToken');
	    Ti.App.Properties.removeProperty('oauthTokenSecret');
		Ti.App.Properties.removeProperty('accessToken');
	    Ti.App.Properties.removeProperty('accessTokenSecret');

		// Logout
		self.dispatch('logout');
	};

};

// Dispatcher
function Dispatcher() {
	this.events = [];
};

Dispatcher.prototype.addEventListener = function(event,callback){
	this.events[event] = this.events[event] || [];
	if ( this.events[event] ) {
		this.events[event].push(callback);
	}
};

Dispatcher.prototype.removeEventListener = function(event,callback){
	if ( this.events[event] ) {
		var listeners = this.events[event];
		for ( var i = listeners.length-1; i>=0; --i ){
			if ( listeners[i] === callback ) {
				listeners.splice( i, 1 );
				return true;
			}
		}
	}
	return false;
};

Dispatcher.prototype.dispatch = function(event){
	if ( this.events[event] ) {
		var listeners = this.events[event], len = listeners.length;
		while ( len-- ) {
			listeners[len](this);
		}		
	}
};

TitaniumOAuth.prototype = new Dispatcher();
