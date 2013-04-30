
function notificaciones(params){
    
    var pagina=1;
    var decorator=require('utils/decorators');
     var detalleComObj="",detalleVideoObj="",detalleFotoObj="",detalleObj="";
     var msjDetail="", peObject = "";
     var loadingView = decorator.loadingIndicator();
     var socialWindowObj=require('social/socialWindow');
     var fechaReciente ="2010-04-15 10:00:00";
     
     
    var mainView = Ti.UI.createView({
        width: "100%",
        height:"100%",
        backgroundColor:"white"
    });
    mainView.add(loadingView);

    var table = Ti.UI.createTableView({
        width:"100%",
        height:"100%"
    });
    table.len=0;
    mainView.add(table);
    
    
    
    function refresh(mode){
        if(table.len<1)mode=false;
       var url="";
       if(mode){
         //  pagina=1;
        //   table.setData([]);
        //   loadingView.show();
        //   table.len=0;
         url = "http://www.vielite.com/ws_notificaciones.php?id="+params.id+"&fecha="+fechaReciente;
         url = encodeURI(url);
       }else{
         url = "http://www.vielite.com/ws_notificaciones.php?id="+params.id+"&pagina="+pagina;
       }
       
        
Ti.API.info("url notificaciones "+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
      Ti.API.info("Notificaciones "+this.responseText);
       if(!mode)pagina++;
      fillTable(this.responseText,mode);
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
         alert("Error de Conexión");
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send();
        
    }
    
    function fillTable(info, mode){
        var res = JSON.parse(info);
        if(res.notificaciones[0].alert){
            loadingView.hide();
            mode ? table.fireEvent('data:finishreloading') : table.fireEvent('data:finishreloadingOld');
        }else{
        
        for(var i=0,j=res.notificaciones.length;i<j;i++){
            if(fechaReciente<res.notificaciones[i].fechaNatural)fechaReciente = res.notificaciones[i].fechaNatural;
            var row = Ti.UI.createTableViewRow({
                keyPub:res.notificaciones[i].keyPub,
                height:74,
                action:"row",
                tipo:res.notificaciones[i].tipoPub,
                id:res.notificaciones[i].numCuenta,
                backgroundColor: (res.notificaciones[i].leido==0  ? '#FEF9D6' : "white")
            });
            var foto = Ti.UI.createImageView({
                image:('http://www.vielite.com'+res.notificaciones[i].foto),
                height:50,
                width:50,
                hires:true,
                defaultImage:'images/fotodefault.jpg',
                borderWidth:1,
                borderColor:'#e7e7e7',
                action:"perfil",
                id:res.notificaciones[i].numCuenta,
                tipoUser:res.notificaciones[i].tipoUser,
                top:12,
                left:2
            });
            var nombre = Ti.UI.createLabel({
                text:res.notificaciones[i].nombre,
                width:(decorator.screenWidth-56),
                height:24,
                top:6,
                touchEnabled:false,
                left:54,
                color:"#005890",
                font:{fontFamily:'Source Sans Pro', fontSize:16,fontWeight:"bold"}
            });
            var ultMsj = Ti.UI.createLabel({
                text:res.notificaciones[i].leyenda,
                width:(decorator.screenWidth-56),
                height:24,
                top:24,
                touchEnabled:false,
                left:54,
                color:"black",
                font:{fontFamily:'Source Sans Pro', fontSize:13}
            });
            var fecha = Ti.UI.createLabel({
                text:res.notificaciones[i].fecha,
                width:(decorator.screenWidth-56),
                height:13,
                top:54,
                touchEnabled:false,
                left:54,
                color:"black",
                font:{fontFamily:'Source Sans Pro', fontSize:13}
            });
            row.add(foto);
            row.add(nombre);
            row.add(ultMsj);
            row.add(fecha);
            if(mode){
               table.insertRowBefore(0,row); 
            }else{
              table.appendRow(row);  
            }
            
            table.len++;
        }
        mode ? table.fireEvent('data:finishreloading') : table.fireEvent('data:finishreloadingOld');
            loadingView.hide();
        }
        
    }
    
    function getNew(){
        refresh(true);
    }
    decorator.pullPush(table,getNew,refresh);
    mainView.refresh = refresh;
    
    
    /////////////////////////////
////////  TABLE LISTENER        //////

    table.addEventListener('click',function(e){
        
        if(e.row.backgroundColor!='white'){
            e.row.backgroundColor='white';
        }
     Ti.API.info(JSON.stringify(e));
  ////      ABRIIIRR PERFIL /////////  
        if(e.source.action=="perfil" || e.source.tipo=="perfil"){
            
            if(e.source.tipoUser=='normalUser' || e.source.tipo=="perfil"){
            
            var socialHome=new socialWindowObj({
         id:e.source.id,
         stopLoading:function(){ },
         openW:params.openW,
         closeW:params.closeW
         });
     params.openW(socialHome);
            }else{
                 if(peObject=="") peObject = require('controllers/perfilEmpresarial');
                var url = "http://www.vielite.com/ws_perfil_empresa_home.php?id="+e.source.id;
 var client = Ti.Network.createHTTPClient({
     onload : function(e) {
      // //Ti.API.info("perfil empresa "+this.responseText);
      
        var pe = new peObject.mainWindow(this.responseText);
        pe.open({transition: Titanium.UI.iPhone && Titanium.UI.iPhone.AnimationStyle.CURL_DOWN});
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         alert("Error de conexión.")
     },
     timeout : 10000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
                
            }
        }else if(e.source.tipo=="mensaje"){
  /////ABRIIIIIR  MENSAJEE      //////      
        if(msjDetail=="")msjDetail=require('mensajes/msjDetail');
        var md = new msjDetail({
            id:e.source.keyPub
        });
        params.openW(md);
        
            
        }else {
          var url="";
          if(e.source.tipo=="beneficio"){
          url = "http://www.vielite.com/ws_beneficio_detalle.php?idUser="+params.id+"&id="+e.source.keyPub;
          }else if(e.source.tipo=="producto"){
          url = "http://www.vielite.com/ws_producto_detalle.php?idUser="+params.id+"&id="+e.source.keyPub;
          }else{
            url = "http://www.vielite.com/ws_publicacion_detalle.php?idUser="+params.id+"&id="+e.source.keyPub;  
          }
          
                
         Ti.API.info("URL "+url);
          var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(http) {
      Ti.API.info("Detalle Publ "+this.responseText);
        var args=JSON.parse(this.responseText);
        
       if(e.source.tipo=="beneficio"){
          args.beneficio[0];
          args.tipo="beneficios";
          }else if(e.source.tipo=="producto"){
         args.productos[0];
         args.tipo="productos";
          }else{
          args=args.publicacion[0]; 
          
          }
         
          
        
        args.morfFather=function(){
           
            };
            
        args.openW = function(wndw){
          params.openW(wndw);  
        };
           
        if(e.source.tipo=='foto' || e.source.tipo=='foto_ext'){
//            
   // //////////   FOOOTOOOOO      /////////
         
          if(detalleFotoObj=="")detalleFotoObj = require('empresarial/detalleFoto');
            var detalle = new detalleFotoObj(args);
             params.openW(detalle);
            
         }else if(e.source.tipo=='video'){
//     
    // //////////   VIIIDEEOOOO      /////////
            if(detalleVideoObj=="") detalleVideoObj= require('empresarial/detalleVideo');
            var detalle = new detalleVideoObj(args);
             params.openW(detalle);
         }else if(e.source.tipo=='estado' || e.source.tipo=='link'){
       // ////////    ESTADOO      //////////////
//             
              if(detalleComObj=="") detalleComObj = require('empresarial/detalleComment');
            var detalle = new detalleComObj(args);
            params.openW(detalle);  
         }else if(e.source.tipo=='beneficio' || e.source.tipo=='producto'){
            
            if (detalleObj=="") detalleObj = require('empresarial/detalleBeneficio');
            var detalle = new detalleObj(args);
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
            
        }
        
    });
    
    return mainView;
}

module.exports = notificaciones;