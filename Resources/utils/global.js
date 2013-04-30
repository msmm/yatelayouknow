/* global exports Ti*/
// Aqui tenemos variables globales.


var iPhone	= Ti.Platform.osname == 'iphone';
var Android	= Ti.Platform.osname == 'android';
var iPad	= Ti.Platform.osname == 'ipad';
var db, logW="";
var siteLocation = 'http://www.vielite.com/'
exports.CurrentWindow			= null;
exports.CurrentActivty			= {};
exports.isAndroidInBackground	= false;
var loginObj=require("ui/login");
exports.iPad = iPad;		// true or false
exports.iPhone = iPhone;
exports.Android = Android;



var TabGroup = {};
exports.changeTabGroup = function(obj){
	exports.TabGroup = obj;
};
exports.TabGroup = TabGroup;

var SplitView = {};
exports.changeSplitView = function(obj){
	exports.SplitView = obj;
};
exports.SplitView = SplitView;

/////////////////////////////////////////////////////////
var vielite = {
	platform: Ti.Platform.osname
};
var navContainer;

exports.getGlobals = function() {
	return vielite;
};

vielite.data = {
	connection: Ti.Network.createHTTPClient(),
	currentProfile: []
};

vielite.utilerias = {
	NoComentarios: Ti.UI.createAlertDialog ({
						buttonNames: ['Ok'],
						message: 'Esta publicación no tiene comentarios',
						title: 'Aviso'
				})
};

vielite.settings = {
	ROWAPPEND_INTERVAL: 0,
	BANNER_TIMEOUT: 60000,
	UPDATE_TIMEOUT: 15000
};
vielite.global = {};
exports.setValue   = function(varName, value) {
    this.global[varName] = value;
};

vielite.ui = {
	navigation: {}
};

vielite.ui.navigation.setContainer = function(container) {
	navContainer = container;
};
vielite.ui.navigation.open = function(window) {
	if (Ti.Platform.osname == "android") {
		window.modal = true;
		window.open();
	} else {
		navContainer.open(window);
	}
};

vielite.ui.navigation.close = function(window) {
	
		navContainer.close(window);
	
};

vielite.events = {};
exports.addEvent = function(name, fn) {
	vielite.events[name] = fn;
};

function getSessID(cookie) {
    var split1=cookie.split(';');
    var split2=split1[0].split('PHPSESSID=');
    return split2[1];
}

vielite.events.doAutologin = function(evt) {
	

	Ti.API.info("doAutologin");
	if (Ti.App.Properties.hasProperty("username") && Ti.App.Properties.hasProperty("pass")) {
	    Ti.API.info("hasProperty");
		var username = Ti.App.Properties.getString("username");
		Ti.API.info(username);
		var pass = Ti.App.Properties.getString("pass");
		vielite.events.doLogin({
			user: username,
			hashedpass:pass,
			autologin:true
		});
		
	} else {
	
		Ti.API.info("SHOW LOGIN");
		vielite.events.showLogin();
	}
};
vielite.data.user = {
	// userID:Titanium.App.Properties.getString('userID'), 
	// displayName:Titanium.App.Properties.getString('displayName'),
	// email:Titanium.App.Properties.getString('email'),
	// userType:Titanium.App.Properties.getString('userType'),
	notif:0
	};
	
	
	/////Do Logiin//////
vielite.events.doLogin = function(evt) {
	var hashedpass;
	if (evt.autologin) {
		hashedpass = evt.hashedpass;
	
	} else {
		hashedpass = Ti.Utils.md5HexDigest(evt.pass);
		// Store variables
		Ti.App.Properties.setString("username", evt.user);
		Ti.App.Properties.setString("pass", hashedpass);
		
	}
	var client = vielite.data.connection;
	client.onerror = function(e) {
		alert("Tu conexión no es buena");
	   vielite.events.showLogin();
	};
	client.onload = function(e) {
	Ti.API.info("Received text: " + this.responseText);
		
		if (this.readyState == 4) {
			
			if (this.responseXML == null) {
				Ti.App.fireEvent('error:noconnection');
				return;
			}
			var xml = this.getResponseXML().documentElement;
			
			if (xml.getElementsByTagName("info").length == 0) {
				Ti.App.fireEvent('error:noconnection');
				
				return;
			}
			var info = xml.getElementsByTagName("info").item(0);
			var logged = info.getElementsByTagName("logueado").item(0).getAttribute("value");
			if (logged == "YES") {
				vielite.data.cookie = "PHPSESSID="+getSessID(this.getResponseHeader("Set-Cookie"));
				//Ti.API.info('vielite.data.user.userID = info.getElementsByTagName '+info.getElementsByTagName("numCuenta").item(0).getAttribute("value"));
				vielite.data.user.userID = info.getElementsByTagName("numCuenta").item(0).getAttribute("value");
				vielite.data.user.displayName = info.getElementsByTagName("nameUser").item(0).getAttribute("value");
				vielite.data.user.email = info.getElementsByTagName("emailUser").item(0).getAttribute("value");
				vielite.data.user.userType = info.getElementsByTagName("tipoUser").item(0).getAttribute("value");
				//Ti.API.info('Titanium.App.Properties.setString '+vielite.data.user.userID);
	/////////			Chacar si las vamos a usar			//////////////
				Titanium.App.Properties.setString('userID', vielite.data.user.userID);
				Titanium.App.Properties.setString('displayName', vielite.data.user.displayName);
				Titanium.App.Properties.setString('location', '{"municipio":"Guadalajara","inicio":"44009","fin":"49994"}');
				Titanium.App.Properties.setString('userType',vielite.data.user.userType);
				Titanium.App.Properties.setString('foto',(info.getElementsByTagName("foto").item(0).getAttribute("value")));
	/////////							         			//////////////
	
				vielite.events.loginSuccess(evt.autologin);
			} else {
				Ti.API.warn("[SESSION] Login failed!");
				vielite.events.doLogout();
				var error = info.getElementsByTagName("error").item(0).getAttribute("value");
				if (evt.autologin) 
					Ti.App.fireEvent("session:asklogin");
				else
					alert(error);
			}
		}
	};
	client.open("POST", siteLocation + "mobile_valida_user.php");
	client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	client.send({
		username: evt.user, 
		pass: hashedpass
	
	});	
	
	
	
};
vielite.events.showLogin = function(evt) {
	
	
     logW = new loginObj();
	logW.open();
	//Ti.App.fireEvent("session:asklogin");
	
};
vielite.events.doLogout = function(evt) {
	
	Titanium.App.Properties.removeProperty('username');
	Titanium.App.Properties.removeProperty('pass');
	Titanium.App.Properties.removeProperty('userID');
	Titanium.App.Properties.removeProperty('email');
	Titanium.App.Properties.removeProperty('userType');
	Titanium.App.Properties.removeProperty('vieliteProfile');
	Titanium.App.Properties.removeProperty('vieliteContactsFollowing');
	vielite.data.user.userID=null;
	Ti.Facebook.logout();
	twitter.deauthorize();
	Titanium.UI.iPhone.setAppBadge(null);
	vielite.events.registerPush(1);
	vielite.events.showLogin();
	//Ti.App.fireEvent("session:asklogin");
	
};
vielite.events.loginSuccess = function(evt) {
	//Ti.API.info('loginSuccess');
	//vielite.events.getUserInfo();
	if(logW!="")logW.borrar();
	var dashboardObj = require("dashboard");
	 db = new dashboardObj();
	db.open();
	vielite.events.registerPush(0);
	if(evt){
	setTimeout(function(){
	   db.fireHome();
	},200);
	}
};


//Push Notifications Register  mode 0 register || mode 1 Deregister
vielite.events.registerPush = function(mode) {
//Ti.API.info('Registered');

Ti.Network.registerForPushNotifications({    types: [      Ti.Network.NOTIFICATION_TYPE_BADGE,      Ti.Network.NOTIFICATION_TYPE_ALERT    ],    success:function(e) {      var deviceToken = e.deviceToken;     	var client = Ti.Network.createHTTPClient({         // function called when the response data is available         onload : function(e) {         	//alert(this.responseText);
         	         },         // function called when an error occurs, including a timeout         onerror : function(e) {             Ti.API.debug(e.error);             alert('Tu conexión no es buena');         },         timeout : 10000  // in milliseconds     });     // Prepare the connection.     client.open("GET", siteLocation + 'pushNotif.php?token='+e.deviceToken+'&idUser='+vielite.data.user.userID+'&mode='+mode);     // Send the request.     client.send();    },    error:function(e) {     // alert("push notifications disabled: "+ JSON.stringify(e));    },    callback:function(e) {
	
	   // alert("callbaaaack "+JSON.stringify(e));
	//alert('isInForeground '+notifIsInForeground);
	if(mode!=1 && !notifIsInForeground){
	//Titanium.UI.iPhone.setAppBadge(null);
	var numBad=Titanium.UI.iPhone.getAppBadge();
	//alert(numBad);
	numBad--;
	//alert(numBad);
	Titanium.UI.iPhone.setAppBadge(numBad);
	notifIsInForeground = true;
	db.addNotif();
	db.morphNotifBtn();
	//alert("info pal detail "+ e.data.notifData.keyPub + " type "+e.data.notifData.type);
	//vielite.events.getNotifData(e.data.notifData.keyPub,e.data.notifData.type);
	}
	    }  }); 

};

//GEt WS with the notif data
vielite.events.getNotifData = function(keyPub, type) {
	
	var url=siteLocation + 'ws_notifData.php?keyPublicacion='+keyPub;
	if(type=='message')url=siteLocation + 'ws_notifDataMsg.php?keyMensaje='+keyPub;
		//alert(url);
	var client = Ti.Network.createHTTPClient({
         // function called when the response data is available
         onload : function(e) {
         	
         	//alert(this.responseText);
         	type=='timeline' ? processNotifDataTimeline(this.responseText) : processNotifDataMsg(this.responseText);
         	
         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
         
             alert('error '+e.error);
         },
         timeout : 10000  // in milliseconds
     });
     // Prepare the connection.
     client.open("GET", url);
     // Send the request.
     client.send();
	
}

 //Process the notif data
function processNotifDataMsg(result){
	//alert("processMsg");
var request = JSON.parse(result);
	var messages = request.mensaje;
			for (var i = 0, j = messages.length; i < j; i++) {
				var message = messages[i];
				var from 	= message.sender;
				var to 		= message.recipient;
				var data = {
					from: {
						userID: 		from.id,
						name: 			from.name,
						displayPicture: from.photo
					},
					to: {
						userID: 		to.id,
						name: 			to.name,
						displayPicture: to.photo
					},
					message: {
						id: 	message.keyMensaje,
						title: 	message.asunto,
						text: 	message.textoMensaje,
						date: 	message.fechaMensaje
					}
				};
				
			}
			var comments = new App.Controllers.chatMsg(data);
			comments.open();
}

 //Process the notif datafunction processNotifDataTimeline(request){
	//alert("processTimelne");		var wall =  JSON.parse(request);
		if(wall.error){
		alert("Error de conexión");
		}else{

			var text;
			var media;
			var detail;
			for (var i = 0, j = wall.lineaTimeline.length; i < j; i ++) {
				
				wallItem = wall.lineaTimeline[i];
				var pic = wallItem.foto;
				var type = wallItem.tipoNew;
				
				

				switch(type){
					case 'estado':
						text 	= wallItem.contenido;
							
						media 	= '';
						type 	= 'message';
						break;
					case 'foto perfil':
					
					text 	= wallItem.leyenda;
					media 	= wallItem.contenido;
					var location = 'perfil';
					media 	= siteLocation + 'sites/www.vielite.com/files/images/' + location + '/mini_360/' + media;
					detail 	= media;
					type 	= 'image';
					break;
					
					case 'foto share':
						text 	= wallItem.leyenda;
						media 	= wallItem.contenido;
						location = 'share';
						
						if(wallItem.detail){
							var detail 	= siteLocation + 'sites/www.vielite.com/files/images/' + location + '/foto_600/' + media;
						}else{
							var detail 	= siteLocation + 'sites/www.vielite.com/files/images/' + location + '/' + media;
							}
						media 	= siteLocation + 'sites/www.vielite.com/files/images/' + location + '/mini_360/' + media;
						type 	= 'image';
						location = null;
						break;
					case 'video':
					
						text 	= wallItem.leyenda;
						
						media 	= wallItem.contenido;
		
						type 	= 'video';
						break;
					case 'vielitestore':
					
						text 	= wallItem.leyenda;
						media 	= wallItem.contenido;
						media 	= siteLocation + 'sites/www.vielite.com/files/images/store/mini_360/' + media;
						type 	= 'image';
						
						break;
					case 'link':
						text 	= wallItem.leyenda;
						
						media 	= wallItem.enlace;
						
						type 	= 'link';
						break;
					
					
					case 'grupo':
					
						text =  wallItem.leyenda;
						media = wallItem.contenido;
					type 	= 'grupo';
					break;
					
					case 'evento':
						
						text =  wallItem.leyenda;
						media = wallItem.contenido;
						type 	= 'evento';
						break;
					
					case 'conexion':
					text 	= wallItem.leyenda;
					type = 'conexion';
					
					break;
					default:
						text 	= '';
						media 	= '';
						type 	= 'message';
				}
					
			
				var data = {
					from: {
						userID: 		wallItem.idUser,
						name: 			wallItem.name,
						displayPicture: pic,
					},
					message: {
						id: 	wallItem.KeyPub,
						text: 	text,
						media: 	media,
						detail: detail || '',
						date: 	wallItem.fecInc,
						nLikes: wallItem.nices,
						type: 	type,
						savedData: 'vieliteTimeline',
						tipoPublicacion : 12//wallItem.tipoPublicacion
					}
				};
				if(wallItem.paraId != '' && wallItem.paraId){
					
					data.to = {
						userID: 	wallItem.paraId,
						name: 		wallItem.paraNombre,
						displayPicture: wallItem.paraFoto
					};
				}
				
			}
		
			
		}		
	
		
			var detail = new App.Controllers.Detail(data);
		detail.open();
		
	}


vielite.events.getUserInfo = function(evt) {

	var client = Ti.Network.createHTTPClient();
	client.onload = function(evt) {
		if (client.readyState == 4) {
		
			var xml = this.getResponseXML().documentElement;
			var info = xml.getElementsByTagName("datosUser").item(0);
			var displayname = info.getElementsByTagName("nombre").item(0).getAttribute("value");
			var displaypicture = info.getElementsByTagName("foto").item(0).getAttribute("value");
			vielite.data.user.displayPicture = displaypicture;
			vielite.data.user.name = info.getElementsByTagName("nombre").item(0).getAttribute("value");
			vielite.data.user.lastname = info.getElementsByTagName("apaterno").item(0).getAttribute("value");
			var wallData = [];
			var wall = xml.getElementsByTagName("Publicaciones").item(0).getElementsByTagName("Publicacion");
			var wallItem;
			for (var i=0; i<wall.length; i++) {
				wallItem = wall.item(i);
				var author = wallItem.getElementsByTagName("infoUser").item(0);
				var post = wallItem.getElementsByTagName("infoPublicacion").item(0);
				var insert = {
					author: {
						id: author.getElementsByTagName("numCuenta").item(0).getAttribute("value"),
						name: author.getElementsByTagName("nombre").item(0).getAttribute("value"),
						photo: author.getElementsByTagName("foto").item(0).getAttribute("value")
					},
					post: {
						id: post.getElementsByTagName("keyPublicacion").item(0).getAttribute("value"),
						type: post.getElementsByTagName("tipo").item(0).getAttribute("value"),
						date: post.getElementsByTagName("fechaInsercion").item(0).getAttribute("value")
					}
				};
				if (post.getElementsByTagName("enlace").length > 0) 
					insert.post.url = post.getElementsByTagName("enlace").item(0).getAttribute("value");
				if (post.getElementsByTagName("contenido").length > 0) 
					insert.post.content = post.getElementsByTagName("contenido").item(0).getAttribute("value");
				wallData.push(insert);
			}
			Ti.App.fireEvent('data:gotuserinfo',{wall:wallData});
			Ti.App.fireEvent('data:loadfriends');
		}
	};
	client.open("POST", siteLocation + "mobile_perfil.php?id=" + vielite.data.user.userID);
	client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	if (Ti.Platform.osname != "android")
		client.setRequestHeader('Cookie', vielite.data.cookie);
	client.send();
};
vielite.events.noConnection = function() {
	alert(L('no_response_from_server'));
};
