//global vars
var categoria=0;
var tableData='';
var flyer=0;
var cancelButton;
var isAndroid	= Ti.Platform.osname == 'android';

exports.publicDirectory = function(args) {
	
if (Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
	alert('No hay Red');
	var noInternetWindow = require('controllers/noInternet').noInternet;
		niw = new noInternetWindow();
		niw.open();
}
else {
	
	//Window
	var self = Ti.UI.createWindow({
		backgroundImage : 'images/login/bg.png',
		barColor:'#3A6F8F',
		titleImage: 'images/title.png'
	});
	
	//root Window para iOS navigation
	 if(args.headerBar && !isAndroid){
	 	var win = Titanium.UI.createWindow();
	 	var nav = Titanium.UI.iPhone.createNavigationGroup({
       window: self
    });
      win.add(nav);
	 }
	  

	self.addEventListener('close', function(e)
	{
	flyer=0;
	
	});
    
	
	//TableView
	var tableview = Ti.UI.createTableView({
		top:0,
		left:0,
		height:(args.headerBar ? "91%" : "100%"),
		backgroundColor : 'white'
	});
	
	
	//Get WebService
	requestTvData(tableview, 1);

	
////	//Listener de la TV
	tableview.addEventListener('click', function(e) {
		
		categoria=e.row.id;
		
		var publicSubDirectory = require('controllers/publicSubDirectory').publicSubDirectory;
		psd = new publicSubDirectory({
					'categoria' : categoria,
					'headerBar' : args.headerBar,
					'login'  : args.login,
					'navG' : args.headerBar ? nav : vielite.ui.navigation
				});
				
		if(args.headerBar){
			nav.open(psd);
	}else{
	vielite.ui.navigation.open(psd);
	
	}
	
		
	});
	
	
	self.add(tableview);
	
///////	//Botones

	//Check if its the public Directory
	
	if(args.login!=''){
		
		var buttonLogin = Titanium.UI.createButton({
   title: 'Login',
   backgroundImage :'/images/pleca.jpg',
   bottom: 4,
   right:10,
   borderRadius : 5,
   width: 120,
   height: '7%'
});

function login(){
	if(args.headerBar && !isAndroid){
	 //   //Ti.API.info("close");
		nav.close(self);
		win.close();
	}else{
		self.close();
	}
  
}
buttonLogin.addEventListener('click',function(e)
{
 login(); 
  args.login();
});
var buttonRegister = Titanium.UI.createButton({
   title: L('Registrarse'),
   backgroundImage :'/images/pleca.jpg',
   left : 10,
   borderRadius : 5,
   bottom: 4,
   width: 120,
   height: '7%'
});
buttonRegister.addEventListener('click',function(e)
{

 var join = require('ui/register');
	var joinWindow = join();
	joinWindow.open();

});

self.add(buttonRegister);
self.add(buttonLogin);
		
	}
	 if(args.headerBar && !isAndroid){
	 	return win;	
	 }else{
	 	return self;
	 }
	
		
	}
	
}



function changeCity(){
    
    Ti.App.Properties.setString('ciudad', JSON.stringify(cd));
    
}



//Webservice que trae las categorias
function requestTvData(tv, mode){
	
	
	var url="http://www.vielite.com/ws_publicDirectory.php?mode="+mode;
	
	
	var client = Ti.Network.createHTTPClient({
         // function called when the response data is available
         onload : function(e) {
         //	 //Ti.API.info(this.responseText);
            loadTvData(this.responseText,tv,mode);
         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
             Ti.API.error(e.error);
         },
         timeout : 15000  // in milliseconds
     });
     // Prepare the connection.
     client.open("GET", url);
     // Send the request.
     client.send(); 
}


//Cargar la info a la tableView
function loadTvData(request,tv, mode){
	
	var requestJson= JSON.parse(request);
	
	var rows=[];
	
	if(requestJson.error){
		
		alert("Categoría vacia");
		
		
	}else{
		
		//Mode 1 son categorias
		if(mode==1){
		tableData=request;
		for (var i = 0, j = requestJson.directorio.length; i < j; i ++) {
	
		
	rows.push({
		'title': requestJson.directorio[i].categoria,
		'id' : requestJson.directorio[i].id,
		'rightImage' : '/images/buttons/flecha.png'
	});
		
	}
	}
	tv.setData(rows);
	}
	
	
	
}
