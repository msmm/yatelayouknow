
function socialWindow(params){
    
  var decorator = require("utils/decorators");
  var publObj = require("ui/publicacionFoV");
  var loadingView = decorator.loadingIndicator();
   var pagina=1;
   var perfilData={nombre:""};
   var detalleComObj="",detalleVideoObj="",detalleFotoObj="", pmObj="";
   var scrollWidth = (decorator.screenWidth*0.94);
   var fechaAncla=decorator.getEncodedDate();
   var perfilPropio=(params.id==decorator.idPerfil());
   var wlWObj = "",qr="", intWObj = "", msjObj = "",postObj="";
   var objetos=[];
    var  window = Ti.UI.createWindow({
        title:"Perfil",
        backgroundColor:'white',
        barImage: "images/empresarial/BarraTitulo.png"
    });
    
    
    ////////////////////////////////////
 //////         POSTIIINGGG     ////////////
    var publicacionButton = Ti.UI.createButton({
        systemButton: Titanium.UI.iPhone.SystemButton.COMPOSE,
        borderRadius: 3
    });
    publicacionButton.addEventListener('click', postMencion);
    function postMencion(){
         publicacionButton.removeEventListener('click', postMencion);
         setTimeout(function(){
              publicacionButton.addEventListener('click', postMencion);
         },2000);
       if(perfilData.nombre!==""){
        var url = "http://www.vielite.com/ws_cats_publicar.php";
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("opciones post mencion "+this.responseText);
       var opciones=JSON.parse(this.responseText);
       if(postObj=="")postObj = require('empresarial/post');
         var mencionar = postObj.mencionar({
             numCuenta : params.id,
             data : opciones,
             nombre: (perfilPropio ? "" : perfilData.nombre),
             username: (perfilPropio ? "" : perfilData.username),
             closeW: function(w){
                 params.closeW(w);
                if(perfilPropio) refresh(1);
             },
             cancelPost:function(w){
                 params.closeW(w);
             }
             });
            
         params.openW(mencionar);
         
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
         alert("Error en tu conexión de Internet.")
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
 }
    }
    window.rightNavButton=publicacionButton;
    
    
    
    window.add(loadingView);
     // setTimeout(function(){
                   // loadingView.hide();
        // }, 4000);
    
    
 ///  carga de datos    ////
 function reload(mode){
 var url = "http://www.vielite.com/ws_publicaciones_empresa.php?idUser="+decorator.idPerfil()+"&id="+params.id+"&pagina="+(mode ? 1 : pagina)+"&fechaInicio="+fechaAncla;
     Ti.API.info(url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
         Ti.API.info("PERFIL: "+this.responseText);
         pagina++;
         
         if(mode){
             var js = JSON.parse(this.responseText);
             if(js.publicaciones[0])refresh(js.publicaciones[0]);
             
         }else{
            addPubls(this.responseText); 
         }
        
        
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
    }
   
    
 /////// constructor    /////
 
        
    var mainView = Ti.UI.createScrollView({
        top:0,
        width: decorator.screenWidth,
        height: "100%",
        contentHeight: Ti.UI.SIZE,
        contentWidth: decorator.screenWidth,
        layout:"vertical"
    });
    
    var bodyView = Ti.UI.createView({
        height:Ti.UI.SIZE,
        width: (decorator.screenWidth-1),
        top:0,
        layout:"vertical"
    });
    
    
///////    HEADER    ///////
////    Load data     //////
var headerObj = require("social/header");
var header = new headerObj(params.id,params.openW,params.closeW);
    mainView.add(header);
   
function initPerfil(){
 var url = "http://www.vielite.com/ws_perfil_user.php?id="+params.id;
 //Ti.API.info("url header "+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       Ti.API.info("Header "+this.responseText);
       var datos=JSON.parse(this.responseText);
       datos=datos[0];
       perfilData.foto=datos.foto;
       perfilData.nombre=datos.nombre;
       perfilData.username=datos.username;
       
       if(!perfilPropio){
         seguirButton.title= (datos.following_user==0 ? 'Seguir' : 'Dejar de seguir');
   seguirButton.backgroundImage=(datos.following_user==0 ? 'images/login/btn1.png' : 'images/empresarial/btnFav1.png');
   seguirButton.mode=datos.following_user;
       seguirButton.show();
       }
      header.constructor(datos);
 
 reload(false);
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
    

var lineaPendejaDelBerna = Ti.UI.createView({
    backgroundColor:'#005890',
    width:decorator.screenWidth,
    height:1
});  
bodyView.add(lineaPendejaDelBerna); 
    
    
    /////////////////////////////////// 

///////   barra botones    //////////

var barraBotones = Ti.UI.createView({
    width: (scrollWidth+1),
    height: 30,
    top:15,
    borderRadius:2,
    layout:"horizontal"
});

/// crear barra perfil propio o perfil ajeno
if(perfilPropio){
    
    var buttonWishlist = Titanium.UI.createButton({
   title: 'Wishlist',
   width: (scrollWidth/3),
   height: 30,
   left:0,
   font: { fontSize:13,fontFamily: 'Source Sans Pro'},
   backgroundImage:'images/empresarial/BarraTitulo.png'
});
var buttonMsj = Titanium.UI.createButton({
   title: 'Mensajes',
   width: (scrollWidth/3),
   height: 30,
   font: { fontSize:13,fontFamily: 'Source Sans Pro'},
   left:0,
   backgroundImage:'images/empresarial/BarraTitulo.png'
});
var buttonQr = Titanium.UI.createButton({
   title: 'Código QR',
   font: { fontSize:13,fontFamily: 'Source Sans Pro'},
   width: (scrollWidth/3),
   height: 30,
   left:0,
   backgroundImage:'images/empresarial/BarraTitulo.png'
});

//////LISTENERS&////////
buttonWishlist.addEventListener('click',function(){
    if(wlWObj=="") wlWObj = require("wishlist/wishlistWindow");
    var wlw = new wlWObj({
                stopLoading:function(){ loadingView.hide();},
                open:params.openW,
                id:params.id
            });
    params.openW(wlw);
});

buttonMsj.addEventListener('click',function(){
    
       if(msjObj=="")msjObj=require('mensajes/mensajesTable');
       var msjsTable = new msjObj({
           id:params.id,
           openW:params.openW,
           closeW:params.closeW
       });
       params.openW(msjsTable);
    
});

buttonQr.addEventListener('click',function(){
    
            
    if(qr == ""){
              qr = require('ui/qr');
            }
            var qrW = new qr();
            params.openW(qrW);
});

barraBotones.add(buttonWishlist);
barraBotones.add(buttonMsj);
barraBotones.add(buttonQr);
    
}else{
     ///////////////     Seguir BOton      //////////////////
  var seguirButton = Ti.UI.createButton({
      title: 'Seguir',
   font: { fontSize:13,fontFamily: 'Source Sans Pro'},
   width: scrollWidth,
   height: 30,
   top:20,
   backgroundImage:'images/empresarial/btnFav1.png'
  });
  
  seguirButton.addEventListener('singletap',function(){
      
      //Ti.API.info("Siguiendo: "+seguirButton.mode);
      if(seguirButton.mode==0){
            var url = "http://www.vielite.com/ws_follow.php?idUser="+decorator.idPerfil()+"&id="+params.id+"&action=follow";
       }else{
            var url = "http://www.vielite.com/ws_follow.php?idUser="+decorator.idPerfil()+"&id="+params.id+"&action=unfollow";
       }
      //Ti.API.info("url seguir/dejar seguir "+url);
    (function() {
        
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("seguir/dejar seguir "+this.responseText);
       seguirButton.mode=(seguirButton.mode==0 ? 1 : 0);
       seguirButton.title = (seguirButton.mode==0 ? 'Seguir' : 'Dejar de seguir');
       seguirButton.backgroundImage = (seguirButton.mode==0 ? 'images/login/btn1.png' : 'images/empresarial/btnFav1.png');
       Titanium.App.Properties.removeProperty('vieliteContactsFollowing');
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
    })();
      
  });
  
  bodyView.add(seguirButton);
  seguirButton.hide();
    
    var buttonWishlist = Titanium.UI.createButton({
   title: 'Wishlist',
   width: (scrollWidth/3),
   height: 30,
   left:0,
   font: { fontSize:13,fontFamily: 'Source Sans Pro'},
   backgroundImage:'images/empresarial/BarraTitulo.png'
});
var buttonMsj = Titanium.UI.createButton({
   title: 'Enviar Mensaje',
   width: (scrollWidth/3),
   height: 30,
   font: { fontSize:13,fontFamily: 'Source Sans Pro'},
   left:0,
   backgroundImage:'images/empresarial/BarraTitulo.png'
});
var buttonIntereses = Titanium.UI.createButton({
   title: 'Intereses',
   font: { fontSize:13,fontFamily: 'Source Sans Pro'},
   width: (scrollWidth/3),
   height: 30,
   left:0,
   backgroundImage:'images/empresarial/BarraTitulo.png'
});

//////LISTENERS&////////
buttonWishlist.addEventListener('click',function(){
    if(wlWObj=="") wlWObj = require("wishlist/wishlistWindow");
    var wlw = new wlWObj({
                stopLoading:function(){ loadingView.hide();},
                open:params.openW,
                id:params.id
            });
    params.openW(wlw);
});

buttonMsj.addEventListener('click',function(){
    
   if(pmObj=="") pmObj = require('empresarial/post');
    var pm = pmObj.privateMessage({
        foto:perfilData.foto,
        idDestinatario:params.id,
        closeW:params.closeW
    });
    params.openW(pm);
});

buttonIntereses.addEventListener('click',function(){
    if(intWObj=="") intWObj = require("intereses/interesesWindow");
    var iw = new intWObj({
                  id:params.id,
                fullControls:false,
                stopLoading:function(){ loadingView.hide();}
            });
            params.openW(iw);
});

barraBotones.add(buttonWishlist);
barraBotones.add(buttonIntereses);
barraBotones.add(buttonMsj);
    
}

    
 


bodyView.add(barraBotones);
mainView.add(bodyView);
    
    function procesarClick(e){
        //Ti.API.info(JSON.stringify(e.source));
        bodyView.removeEventListener('click',procesarClick);
        setTimeout(function(){bodyView.addEventListener('click',procesarClick);},3000);
        if(e.source.action){
            
             
        var url = "http://www.vielite.com/ws_publicacion_detalle.php?idUser="+decorator.idPerfil()+"&id="+e.source.keyPublicacion;
                
         //Ti.API.info("URL "+url);
          var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(http) {
       //Ti.API.info("Detalle Publ "+this.responseText);
        var args=JSON.parse(this.responseText);
        
       
         
          args=args.publicacion[0];
          if(!args.alerta){
           if(perfilPropio){
          args.index=e.source.index;
        args.rowIndex=1;
         args.delete=e.source.deletePub;
         args.closeW=params.closeW;
        }
        args.morfFather=function(){
            e.source.morf();
            };
            
        args.openW = function(wndw){
          params.openW(wndw);  
        };
           
       if(e.source.action=='foto'){
           
   //////////   FOOOTOOOOO      /////////
         
           if(detalleFotoObj=="")detalleFotoObj = require('empresarial/detalleFoto');
           var detalle = new detalleFotoObj(args);
            params.openW(detalle);
           
        }else if(e.source.action=='video'){
    
    //////////   VIIIDEEOOOO      /////////
           if(detalleVideoObj=="") detalleVideoObj= require('empresarial/detalleVideo');
           var detalle = new detalleVideoObj(args);
            params.openW(detalle);
        }else if(e.source.action=='estado' || e.source.action=='link'){
       ////////    ESTADOO      //////////////
            
             if(detalleComObj=="") detalleComObj = require('empresarial/detalleComment');
           var detalle = new detalleComObj(args);
           params.openW(detalle);  
        }
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
    }

    
    bodyView.addEventListener('click',procesarClick);
    
    //////   RELOAD del scrollview   ////
    var offset = mainView.contentOffset.y;
    function scrollLoad(e){
        
        // Ti.API.info("DRAGGING "+e.dragging+" offset "+offset);
         // Ti.API.info('near bottom'+ bodyView.getRect().height);// - e.y) <= (mainView.getRect().height));
        
         offset = e.source.contentOffset.y;
           if(offset>(bodyView.getRect().height-350)){ //&& e.dragging===false){
               loadingView.show();
               mainView.removeEventListener("scroll",scrollLoad);
                   //Ti.API.info("GET MORE!");
              reload(false);
              
               setTimeout(function(){
                   loadingView.hide();
            mainView.addEventListener("scroll",scrollLoad);
        }, 5000);
               

           }
    }
    
    mainView.addEventListener("scroll",scrollLoad);
    window.add(mainView);
    initPerfil();
    
    function deletePub(id,index,close,indexRow){
         
           var url = "http://www.vielite.com/ws_eliminar.php?idUser="+decorator.idPerfil()+"&id="+id;
     
    ////Ti.API.info("URL delete"+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("DELETE "+this.responseText);
       var result=JSON.parse(this.responseText);
       
       if(result.eliminar[0].exitoso==1){
        bodyView.remove(objetos[index]);
        objetos[index]="";
         close();
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

/////////////////////////////////////////
///////     Publicaciones       ////////
function addPubls(res){
   
    var data = JSON.parse(res);
     //Ti.API.info("addpubls");
     if(data.publicaciones[0].alerta){
         loadingView.hide();
     }else{
     
     for(var i=0;i<data.publicaciones.length;i++){
     data.publicaciones[i].anchoTabla=(scrollWidth);
     data.publicaciones[i].tipoPub=data.publicaciones[i].tipo;
     data.publicaciones[i].fotoItem=data.publicaciones[i].contenido;
     data.publicaciones[i].keyItem=data.publicaciones[i].keyPublicacion;
     data.publicaciones[i].pubPerfil=true;
     data.publicaciones[i].color="verde";
     data.publicaciones[i].numCuentaPropietario=(""+params.id);
   // Ti.API.info("-------------");
     
   // Ti.API.info(data.publicaciones[i]);
     var obj = new publObj(data.publicaciones[i]);
     
     obj.index=objetos.length;
     obj.deletePub=deletePub;
     objetos[obj.index]=obj;
     
     
  bodyView.add(obj);
 }
 // bodyView.setHeight(Ti.UI.FILL);
  setTimeout(function(){
      bodyView.setHeight(Ti.UI.SIZE);
      loadingView.hide();
      },700); 
     }
  
 
}



//////////////////////////////////////////
/////         REFRESH         ///////////

function refresh(step){
    //Ti.API.info('refreessh');
 
 /////      Pasoo  1        /////
    if(step===1){
         //Ti.API.info('step 1');
        loadingView.show(); 
   
   for(x in objetos){
       if(objetos[x]!="")bodyView.remove(objetos[x]);
   }
   reload(true);
    }else{
    /////      Pasoo  2        /////    
    
     step.anchoTabla=(scrollWidth);
     step.tipoPub=step.tipo;
     step.fotoItem=step.contenido;
     step.keyItem=step.keyPublicacion;
     step.pubPerfil=true;
     step.color="verde";
    // //Ti.API.info("-------------");
     
     ////Ti.API.info(data.publicaciones[i]);
     var obj = new publObj(step);
     
     
     obj.deletePub=deletePub;
     objetos.unshift(obj);
  
    for(var i=0;i<objetos.length;i++){
        if(objetos[i]!=""){
         objetos[i].index=i;
       bodyView.add(objetos[i]);   
        }
       
   }
  
   setTimeout(function(){
      bodyView.setHeight(Ti.UI.SIZE);
      loadingView.hide();
      },700); 
     }
        
    
   
}

 
    
    
    
    params.stopLoading();
   return window;
}

module.exports = socialWindow;