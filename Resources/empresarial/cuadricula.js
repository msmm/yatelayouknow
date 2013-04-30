//Pantalla de cuadricula
function cuadricula(tabGroup, data) {
    var datos=data[0];
    var pagina=1;
    var fondo=80;
    var decorator = require('utils/decorators');
    var detalleObj = require('empresarial/detalleFoto');
    var detalleObjVid = require('empresarial/detalleVideo');
   var AI = decorator.loadingIndicator();
    //Window
    var window = Titanium.UI.createWindow({
    title:datos.nombre,
    barImage: "images/empresarial/BarraTitulo.png"
    });
    
     window.add(AI);
     AI.hide();
        //ScrollView
    var scrollView = Ti.UI.createScrollView({
      contentWidth: decorator.screenWidth,
      contentHeight: decorator.screenHeight,
      showVerticalScrollIndicator: false,
      height: "100%",
      width: '100%',
      backgroundColor: 'white',
      layout:'horizontal',
      detalle:false
    });
     
    function loadData(){
       
        var url = "http://www.vielite.com/ws_publicaciones_empresa.php?idUser="+decorator.idPerfil()+"&id="+datos.numCuenta+"&descarta=true&pagina="+pagina;
      //  //Ti.API.info("url cuadricula "+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
      // //Ti.API.info("CUADRICULA "+this.responseText);
       
      addToScroll(this.responseText);
      AI.hide();
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
         
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
 
    }
    
    function addToScroll(info){
        
    var res=JSON.parse(info);
    res = res.publicaciones;
    if(res[0].alerta){
      //  //Ti.API.info("dfhiñsuhfiuwefluewif");
        
    }else{
        pagina++;
        
    
    for(var i=0,j=res.length;i<j;i++){
        
        var marco = Ti.UI.createView({
            top:22,
            width:85,
            height:85,
            backgroundColor:"#f7f7f7",
            borderColor:"#999999",
            borderWidth:1,
            left:(i%3==0 ? 10 : 22)
        });
        var url=res[i].tipo=="foto" ? (decorator.sitio+res[i].contenido) : (res[i].thumbnail);
        var img = Ti.UI.createImageView({
            width: 170,
            image:url,
            keyPublicacion:res[i].keyPublicacion,
            detalle:true,
            tipo : res[i].tipo
        });
        
        if(res[i].tipo=="video"){
            //Ti.API.info("thumbnail"+url);
            var video = Ti.UI.createImageView({
            height:40,
            width: 40,
            image:'images/empresarial/video.png',
            zIndex:1,
            keyPublicacion:res[i].keyPublicacion,
            detalle:true,
            tipo: res[i].tipo
        });
        marco.add(video);
        }
        marco.add(img);
        scrollView.add(marco);
        
    }
    }
    
        
        
    }

///     Delete publ      ///
function deletePubl(id,index,close,rowIndex){
    
    var url = "http://www.vielite.com/ws_eliminar.php?idUser="+datos.numCuenta+"&id="+id;
     
    //Ti.API.info("URL delete"+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("DELETE "+this.responseText);
       var result=JSON.parse(this.responseText);
       
       if(result.eliminar[0].exitoso==1){
       clealScroll();
       close();
       pagina=1;
       loadData();
       }else{
         alert(result.eliminar[0].alerta);  
       }
       
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
    
}

///     Erase Childrens ///
function clealScroll(){
    
    var hijos=scrollView.getChildren();
    for(x in hijos){
        scrollView.remove(hijos[x]);
    }
    
}
    

///     Listener abrir una imagen   ///
   scrollView.addEventListener('click',function(e){
       
      //Ti.API.info("cuadricula click: "+JSON.stringify(e));
      
      
      if(e.source.detalle==true){
          var url = "http://www.vielite.com/ws_publicacion_detalle.php?idUser="+datos.numCuenta+"&id="+e.source.keyPublicacion;
         //Ti.API.info("URL "+url);
          var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(http) {
       //Ti.API.info("Detalle Publ Cuadr"+this.responseText);
       var args=JSON.parse(this.responseText);
       args=args.publicacion[0];
       args.delete=deletePubl;
       args.index=0;
       args.rowIndex=0;
       if(e.source.tipo=="video"){
       	 
           var detalle = new detalleObjVid(args);
           tabGroup.activeTab.open(detalle);
       }else{
       	 var detalle = new detalleObj(args);
           tabGroup.activeTab.open(detalle);
       }
          
       
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
     });
     // Prepare the connection.
     client.open("GET", url);
     // Send the request.
     client.send(); 
      }
       
   });
    
    
    
   scrollView.addEventListener('scroll',function(e){
       //var offset = e.contentOffset.y;
    //  //Ti.API.info("cuadricula offset: "+JSON.stringify(e));
      
      if(e.y>fondo){
          fondo+=340;
         AI.show();
         loadData();
         scrollView.setContentHeight(Ti.UI.SIZE);
      }
       
   });
   
   
  window.add(scrollView);
    loadData();
    return window;
}

module.exports = cuadricula;
