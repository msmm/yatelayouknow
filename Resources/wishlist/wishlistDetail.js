
function wishlistDetail(params){
    
    var decorator = require("utils/decorators");
    var loadingView = decorator.loadingIndicator();
    var detalleFotoObj="",detalleVideoObj="",detalleProdObj="";
    var pagina=1;
    var bodyView;
    var scrollWidth = (decorator.screenWidth*0.94);
     var publObj = require("ui/publicacionFoV");
    
     var window = Ti.UI.createWindow({
     backgroundColor:'white',
     title: params.nombre,
     barImage: "images/empresarial/BarraTitulo.png"
    });
    
    window.add(loadingView);
    
    function reload(){
    var url = decorator.sitio+"/ws_wishlists_items.php?idUser="+params.id+"&id="+params.key+"&pagina="+pagina;
    //Ti.API.info("url ws detail: "+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
         if(pagina==1){
            constructor(this.responseText); 
         }else{
             addItems(this.responseText);
         }
        pagina++;
        
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         alert("Error de conexión.");
         Ti.API.debug(e.error);
     },
     timeout : 10000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
    }
    reload();
    
    function constructor(res){
    
   
    var socialWindowObj=require('social/socialWindow');
    var peObject = require('controllers/perfilEmpresarial'); 
   
    var data = JSON.parse(res);
     Ti.API.info("wishlist detail: "+res);
      
   
   
     /// ScrolVIEW principal     ////
var mainScrollView = Ti.UI.createScrollView({
  contentWidth: decorator.screenWidth,
  contentHeight: 'auto',
  showHorizontalScrollIndicator: false,
  height: "100%",
  width: decorator.screenWidth,
  backgroundColor:"white",
  layout:"vertical",
  horizontalBounce:false
});
     bodyView = Ti.UI.createView({
        height:Ti.UI.SIZE,
        width: (scrollWidth-1),
        top:0,
        layout:"vertical"
    });
    
    var header = Ti.UI.createView({
        width:(scrollWidth-1),
        height:60
        
    });
   
    var icono = Ti.UI.createView({
        backgroundImage : "images/wishlist/"+data.header[0].icono+"Azul.png",
        height:50,
        width:50,
        top:10,
        left:2
    });
    
    var nombre = Ti.UI.createLabel({
        width:(scrollWidth-45),
        height:10,
        left:54,
        color:'#404040',
        font:{fontFamily: 'Source Sans Pro', fontSize:14, fontWeight:"bold"},
        text:params.nombre,
        top:19
    });
    
    var fecha = Ti.UI.createLabel({
        width:(scrollWidth-45),
        height:10,
        color:'#404040',
        font:{fontFamily: 'Source Sans Pro', fontSize:11},
        left:54,
        text:data.header[0].fecha,
        top:29
    });
    var tipo = Ti.UI.createLabel({
        width:(scrollWidth-45),
        height:10,
        left:54,
        color:'#404040',
        font:{fontFamily: 'Source Sans Pro', fontSize:11},
        text:data.header[0].leyenda,
        top:39
    });
    
    header.add(icono);
    header.add(nombre);
    header.add(fecha);
    header.add(tipo);
    bodyView.add(header);
    
 ////////////////////////////////
 ////   Involucrados        //////
 
 if(data.involved){
 function createInvolucrado(foto,numCuenta){
     
     var img = Ti.UI.createImageView({
         image: (decorator.sitio+foto),
         height: 41,
         top:7,
         width:41,
         defaultImage:'images/fotodefault.jpg',
         hires:true,
         action:'normalUser',
         left:7,
         idCuenta: numCuenta
     });
     
     return img;
     
 }
 var involucradosHolder = Ti.UI.createView({
     height:Ti.UI.SIZE,
     top:5,
     width:(scrollWidth-1),
     layout:"horizontal",
 });
 
 for(var i=0;i<data.involved.length;i++){
     var obj = createInvolucrado(data.involved[i].foto,data.involved[i].numCuenta);
     involucradosHolder.add(obj);
 }
 
    bodyView.add(involucradosHolder);
    }
 ///////////////////////////////////
 /// ELEMENTOS de la lista  ///////
 if(data.items[0].alerta){
     
 }else{
 //Ti.API.info("leeength "+data.items.length);
 for(var i=0;i<data.items.length;i++){
     data.items[i].anchoTabla=(scrollWidth-1);
     data.items[i].compartido="";
    // //Ti.API.info(data.items[i]);
     var obj = new publObj(data.items[i]);
     bodyView.add(obj);
 }
 setTimeout(function(){bodyView.setHeight(Ti.UI.SIZE)},700); 
 }   
    
    
    
 ////////  TABLE LISTENER       ///   
 
    bodyView.addEventListener('click',function(e){
      //  Ti.API.info(JSON.stringify(e.source));
        bodyView.touchEnabled = false;
       setTimeout(function(){ bodyView.touchEnabled = true},3000);
         if(e.source.action=='normalUser' || e.source.action=='guest'){
           var socialHome=new socialWindowObj({
         id:e.source.idCuenta,
         stopLoading:function(){},
         openW:params.openW,
         closeW:params.closeW
         });
           params.openW(socialHome);
       }else if(e.source.action=='empresarial'){
           var url = "http://www.vielite.com/ws_perfil_empresa_home.php?id="+e.source.idCuenta;
 var client = Ti.Network.createHTTPClient({
     onload : function(e) {
       //Ti.API.info("perfil empresa "+this.responseText);
       
        var pe = new peObject.mainWindow(this.responseText);
        pe.open({transition: Titanium.UI.iPhone && Titanium.UI.iPhone.AnimationStyle.CURL_DOWN});
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         alert("Error de conexión.");
     },
     timeout : 10000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
           
       }else if(e.source.action!='vlike'){
            var url="";
            switch(e.source.action){
             case 'store':
             url="http://www.vielite.com/ws_producto_detalle.php?idUser="+decorator.idPerfil()+"&id="+e.source.keyPublicacion;
             break;
             case 'beneficio':
               url="http://www.vielite.com/ws_beneficio_detalle.php?idUser="+decorator.idPerfil()+"&id="+e.source.keyPublicacion;
             break;
             
             default:
             url = "http://www.vielite.com/ws_publicacion_detalle.php?idUser="+decorator.idPerfil()+"&id="+e.source.keyPublicacion;
             break;  
                
            }
         ////Ti.API.info("URL "+url);
          var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(http) {
       //Ti.API.info("Detalle Publ "+this.responseText);
        var args=JSON.parse(this.responseText);
      
        // args.index=e.index;
        // args.rowIndex=e.row.rowIndex;
        // args.delete=deletePubl;
           
       if(e.source.action=='foto'){
           
   //////////   FOOOTOOOOO      /////////
           args=args.publicacion[0];
        args.morfFather=function(){
            e.source.morf();
            };
            
        args.openW = function(wndw){
          params.openW(wndw);  
        };
           if(detalleFotoObj=="")detalleFotoObj = require('empresarial/detalleFoto');
           var detalle = new detalleFotoObj(args);
            params.openW(detalle);
           
        }else if(e.source.action=='video'){
    
    //////////   VIIIDEEOOOO      /////////
            args=args.publicacion[0];
        args.morfFather=function(){
            e.source.morf();
            };
            
        args.openW = function(wndw){
          params.openW(wndw);  
        };
           if(detalleVideoObj=="") detalleVideoObj= require('empresarial/detalleVideo');
           var detalle = new detalleVideoObj(args);
            params.openW(detalle);
        }else if(e.source.action=='store'){
     //////////   STOOOOREEE      /////////       
            args=args.productos[0];
            args.tipo="productos";
           
        args.morfFather=function(){
            e.source.morf();
            };
           
        args.openW = function(wndw){
          params.openW(wndw);  
        };
        if(detalleProdObj=="") detalleProdObj=require('empresarial/detalleBeneficio');
         var detalle = new detalleProdObj(args);
         
            params.openW(detalle);   
        }
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
         alert("Error de conexión.");
     },
     timeout : 5000  // in milliseconds
     });
     // Prepare the connection.
     client.open("GET", url);
     // Send the request.
     client.send(); 
            
        }else{
            bodyView.touchEnabled = true;
        }
    });
    
    //////   RELOAD del scrollview   ////
    var offset = mainScrollView.contentOffset.y;
    function scrollLoad(e){
        // Ti.API.info('near bottom'+ (bodyView.getRect().height-510));
        // Ti.API.info(" offset "+offset);
         offset = e.source.contentOffset.y;
           if(offset>(bodyView.getRect().height-510) && e.dragging===false){
              loadingView.show();
              mainScrollView.removeEventListener("scroll",scrollLoad);
                   //Ti.API.info("GET MORE!");
              reload();
               setTimeout(function(){
                   loadingView.hide();
            mainScrollView.addEventListener("scroll",scrollLoad);
        }, 5000);
               

           }
    }
    mainScrollView.add(bodyView);
    mainScrollView.addEventListener("scroll",scrollLoad);
    
    window.add(mainScrollView);
     loadingView.hide();
}

 
function addItems(items){
    //Ti.API.info("wishlist addItems: "+items);
    var data = JSON.parse(items);
 if(data.items[0].alerta){
     
 }else{
 ////Ti.API.info("leeength "+data.items.length);
 for(var i=0;i<data.items.length;i++){
     data.items[i].anchoTabla=(scrollWidth-1);
     data.items[i].compartido="";
     //Ti.API.info(data.items[i]);
     var obj = new publObj(data.items[i]);
     bodyView.add(obj);
 }
 setTimeout(function(){bodyView.setHeight(Ti.UI.SIZE)},700); 
 }   
}
    
    
    return window;
    
}


module.exports = wishlistDetail;
