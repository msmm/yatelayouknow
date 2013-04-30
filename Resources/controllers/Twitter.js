/**
 * @var "settings" A dictionary containing "consumerKey", "consumerSecret", and "site". "site" defaults to Twitter. 
 */
var settings = {
    site			: 'Twitter',
    consumerKey		: 'yuPf3vaTIyP3pLIIRpCfuQ',
    consumerSecret	: 'gsdcVcGB7oBBkLRveBlalUojpZtKdCkpsGhg22YkY'
}

/**
 * Initializes the module with the passed in settings.
 * @returns An object that can be used to share with the created site.
 */
exports.create = function (modal) {
	Ti.include('/controllers/twLibrary/titanium_oauth.js');
	var oauth = null;

    // And return the site to the user.
    return {
        isAuthorized: function () {
            return oauth ? oauth.loggedIn() : false;
        },
        deauthorize: function () {
        	if(!oauth) return;
            oauth.logout();
			delete oauth;
			oauth = null;
        },
        authorize: function (callback) {
            oauth = new TitaniumOAuth(settings.consumerKey, settings.consumerSecret);
			var twLI = function(){
				callback && callback('Conectado con Twitter');
				// oauth.removeEventListener('login', twLI);
			}
			var twLO = function(){
				callback && callback('Desconectado de Twitter');
				// oauth.removeEventListener('logout', twLO);
			}
			
			oauth.addEventListener('login', twLI);
			oauth.addEventListener('logout', twLO);
			
			oauth.requestToken();
			
        },
        share: function (data) {
        	var args = {
		        message: data,
		        success: function() {
		            modal.showInfo('Tweeted!');
		        },
		        failure: function(error) {
		            modal.showInfo('Oh no!\nHubo un error con twitter');
		            //Ti.API.info('[V] Twitter: '+error);
		        }
		    }
        	if(!oauth){
        		//Ti.API.info("!oauth");
        		return;
        	} 
            var options = {
	            method: 'POST',
	            action: 'https://api.twitter.com/1/statuses/update.json',
	            parameters: [
		               ['status', args.message ]
	            ]
	        };
		    oauth.request(options, args.success, args.failure);
        },
        friends: function (func) {
        	var args = {
		     
		        success: function(e) {
		        	func(e);
		         //   //Ti.API.info(e);
		        },
		        failure: function(error) {
		            modal.showInfo('Oh no!\nHubo un error');
		            //Ti.API.info('[V] Twitter: '+error);
		        }
		    }
        	if(!oauth){
        		//Ti.API.info("!oauth");
        		return;
        	} 
            var options = {
	            method: 'GET',
	            action: 'https://api.twitter.com/1.1/friends/ids.json',
	            parameters: [
		               
	            ]
	        };
		    oauth.request(options, args.success, args.failure);
        },
        lookUp: function (ids) {
        	//Ti.API.info("print inside Lookup"+ ids);
        	var args = {
		     
		        success: function(e) {
		            //Ti.API.info(e);
		        },
		        failure: function(error) {
		            modal.showInfo('Oh no!\nHubo un error');
		            //Ti.API.info('[V] Twitter: '+error);
		        }
		    }
        	if(!oauth){
        		//Ti.API.info("!oauth");
        		return;
        	} 
            var options = {
	            method: 'POST',
	            action: 'https://api.twitter.com/1.1/users/lookup.json',
	            parameters: [
		             ['user_id', ids ]
	            ]
	        };
		    oauth.request(options, args.success, args.failure);
        }
    };
};