//global vars
var categoria=0;
var tableData='';
var flyer=0;
var inicio, fin;
var self;

exports.publicSubDirectory = function(args) {
	
if (Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
	alert('No hay Red');
	var noInternetWindow = require('controllers/noInternet').noInternet;
		niw = new noInternetWindow();
		niw.open();
}
else {
    
     var peObject = require('controllers/perfilEmpresarial');
     
	//Window
	 self = Ti.UI.createWindow({
		barImage: "images/empresarial/BarraTitulo.png",
		titleImage: 'images/title.png'
	});
	self.addEventListener('close', function(e)
	{
	flyer=0;
	
	});
	
	

	//TableView
	var tableview = Ti.UI.createTableView({
		top:0,
		left:0,
		height:Ti.UI.FILL,
	});
	 	
	
	//Get WebService
	if(args.requestData){
	    categoria=args.categoria;
    inicio=args.inicio;
    fin=args.fin;
	requestTvData(tableview, 2,args.closeWindow);
	}else{
	    loadTvData(args.response,tableview,2);
	}
	
	
////	//Listener de la TV
	tableview.addEventListener('click', function(e) {
		
/*

		var url = "http://www.vielite.com/ws_perfil_empresa_home.php?id="+e.row.id;
		
		
	*/	
  
   var url = "http://www.vielite.com/ws_perfil_empresa_home.php?id="+e.row.id;
 var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     //  //Ti.API.info("perfil empresa "+this.responseText);
       
        var pe = new peObject.mainWindow(this.responseText);
        pe.open({transition: Titanium.UI.iPhone && Titanium.UI.iPhone.AnimationStyle.CURL_DOWN});
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         
     },
     timeout : 10000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
 


	});
	
	self.add(tableview);

	return self;	
		
	}
}

function requestTvData(tv, mode, closeWindow){
	// var ciudad=Ti.App.Properties.getString('ciudad','{"ciudad":[{"inicio": 44009, "fin":49994}]}');
	// Titanium.API.info("ciudad "+ciudad);
    // ciudad=JSON.parse(ciudad);
	//var url="http://www.vielite.com/ws_publicDirectory.php?mode="+mode+"&categoria="+categoria+"&inicio="+ciudad.inicio+"&fin="+ciudad.fin;
	var url="http://www.vielite.com/ws_publicDirectory.php?mode="+mode+"&categoria="+categoria+"&inicio="+inicio+"&fin="+fin;
	var client = Ti.Network.createHTTPClient({
         // function called when the response data is available
         onload : function(e) {
         //	 //Ti.API.info(this.responseText);
            var requestJson= JSON.parse(this.responseText);
            if(requestJson.error){
            	
				setTimeout(function(e){closeWindow(self)},1000);
				setTimeout(function(e){alert("Categoría vacia")},1300);
            }else{
            loadTvData(this.responseText,tv,mode);	
            }
            
         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
             Ti.API.debug(e.error);
             
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
	
	if(requestJson.error || requestJson.directorio[0].alerta){
		
      setTimeout(function(e){alert("0 resultados.")},1000);
		
	}else{
		
		
		//modo 2 son subcategorias
		
		flyer=1;
		for (var i = 0, j = requestJson.directorio.length; i < j; i ++) {
	var row = Ti.UI.createTableViewRow({
                layout:"horizontal",
                id:requestJson.directorio[i].id,
                height:54,
                hasChild:true
            });
            var foto = Ti.UI.createImageView({
                image:("http://www.vielite.com"+requestJson.directorio[i].foto),
                height:50,
                width:50,
                defaultImage:'images/fotodefault.jpg',
                borderWidth:1,
                borderColor:"#e7e7e7",
                hires:true,
                top:2
            });
            var nombre = Ti.UI.createLabel({
                text:requestJson.directorio[i].nombre,
                width:232,
                height:24,
                top:15,
                left:8,
                color:"#005890",
                font:{fontFamily:'Source Sans Pro', fontSize:20,fontWeight:"bold"}
            });
            row.add(foto);
            row.add(nombre);
	rows.push(row);
		
	}
	}
	
	tv.setData(rows);
		
	}
	
