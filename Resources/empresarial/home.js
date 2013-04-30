 

//Pantalla de home
function home(settings, data) {
    
/// variables       ///
var datos=data[0];
//Ti.API.info(datos);
var rateObject="", postObj="";
var decorator = require('utils/decorators');
 var benefObject = require('empresarial/beneficiosTable');

///          BASE           ////

    //Window
    var window = Titanium.UI.createWindow({
        title: datos.nombre,
        barImage: "images/empresarial/BarraTitulo.png"
    });
    var publicacionButton = Ti.UI.createButton({
        systemButton: Titanium.UI.iPhone.SystemButton.COMPOSE,
        borderRadius: 3
    });
    window.rightNavButton=publicacionButton;
    
     var mainView = Ti.UI.createView({
        backgroundColor:'white',
        width : "100%",
        height : Ti.UI.SIZE,
        top : 0,
        left : 0,
        layout:'vertical'
    });
    
    //ScrollView
    var scrollView = Ti.UI.createScrollView({
      contentWidth: decorator.screenWidth,
      contentHeight: 'auto',
      showVerticalScrollIndicator: false,
      height: "100%",
      width: '100%',
      backgroundColor: 'white',
      layout:'vertical'
    });
    
    
///         HEADER          ///
    
    var headerView = Ti.UI.createView({
        width : "100%",
        height : 190,
        top : 0,
        left : 0
    });
    
    var bannerView = Ti.UI.createView({
        width : decorator.screenWidth,
        height : 175,
        top : 0,
        left : 0
    });
    
    var coverImageload = Ti.UI.createImageView({
        image : (decorator.sitio+datos.banner),
        hires:true,
        height:Ti.UI.SIZE
    });

 bannerView.add(coverImageload);
    function coverI(e){
        var hei=coverImageload.toImage().height;
        var wid=coverImageload.toImage().width;
        //Ti.API.info("cover loaded "+hei);
        if(hei<355){
            
             var ratio = (355/hei);
          //  coverImageload.setHeight(370);
            coverImageload.setWidth(wid*ratio);
        }
        coverImageload.removeEventListener('load',coverI);
    }
        coverImageload.addEventListener('load',coverI);
        


    var avatarView = Ti.UI.createView({
        width : 130,
        height : 130,
        borderRadius : 2,
        borderWidth:1,
        borderColor:"#999999",
       backgroundColor : "#f7f7f7",
        bottom : 0,
        left : 11,
        zindex : 1
    });
    var avatarImage = Ti.UI.createImageView({
        image : (decorator.sitio+datos.foto)
    });
    
    function coverAvatarImage(e){
        var hei=avatarImage.toImage().height;
        var wid=avatarImage.toImage().width;
        //Ti.API.info("avatarImage loaded "+wid+" x "+hei);
      window.remove(avatarImage);
            avatarView.add(avatarImage);
            
            if(hei>wid){
               var ratio = (352/wid);
           avatarImage.setHeight(hei*ratio);  
            }else{
                 var ratio = (352/hei);
           avatarImage.setWidth(wid*ratio);
            }
            
         //  avatarImage.setWidth(wid*ratio);
       avatarImage.show();
        avatarImage.removeEventListener('load',coverAvatarImage);
    }
        avatarImage.addEventListener('load',coverAvatarImage);
    var avatarLogo = Ti.UI.createView({
        backgroundImage : 'images/empresarial/v-brands.png',
        width : 39,
        height : 48,
        bottom :5,
        right : 5,
        zindex : 1
    });
    window.add(avatarImage);
    avatarImage.hide();
    avatarView.add(avatarLogo);
    
    
    
    var rateButton = Ti.UI.createView({
        backgroundImage : 'images/empresarial/calificacion.png',
        width : 64,
        height : 64,
        top : 4,
        right : 8,
        zindex : 1
    });
    
    var primerD = Ti.UI.createImageView({
        height : 27,
        width : 23,
        top : 13,
        left : 3
    });
    var punto = Ti.UI.createImageView({
        height : 27,
        width : 23,
        top : 13,
        image:"images/empresarial/numeros/punto.png",
        left : 19
    });
    var segundoD = Ti.UI.createImageView({
        height : 27,
        width : 23,
        top : 13,
        right : 4
    });
    rateButton.add(primerD);
    rateButton.add(punto);
    rateButton.add(segundoD);
    if(datos.evaluacion!=null){
    var evaluacion=datos.evaluacion;
    primerD.setImage("images/empresarial/numeros/"+evaluacion.charAt(0)+".png");
    segundoD.setImage("images/empresarial/numeros/"+evaluacion.charAt(2)+".png");
    }else{
        punto.hide();
    }
    var evaluaLabel = Ti.UI.createImageView({
        height : 12,
        width:39,
        top : 46,
        image:"images/empresarial/numeros/evalua.png",
        right : 19,
        zindex : 2
    });
    

    var favoritosButton = Ti.UI.createButton({
        title : (datos.followed==0 ? 'Seguir' : 'Dejar de seguir'),
        color: 'white',
        height : 30,
        width : 147,
        font: { fontSize:13,fontFamily: 'Source Sans Pro'},
        bottom : 0,
        right : 10,
        backgroundImage:  (datos.followed==0 ? 'images/login/btn1.png' : 'images/empresarial/btnFav1.png'),
        borderRadius: 3
    });


///         BODY        ///

    var viewContenido = Titanium.UI.createView({
       width:decorator.screenWidth,
       height:Ti.UI.SIZE,
       layout: "vertical",
       top:5
    });

if(datos.fotoBeneficio!=null){
    //Ti.API.info('datos.fotoBeneficio  '+datos.fotoBeneficio);
         var jsoB= {
     "top":10,
     "width": 0.92,
     "tabGroup": settings,
     "reload": "no",
     "tipo" : "beneficios",
     "size" : "compacto"
     };

     var benef=     {"beneficios":[
     {"keyBeneficio":datos.keyBeneficio,
     "idEmpresarial":datos.numCuenta,
     "fotoBeneficio":datos.fotoBeneficio,
     "porcentaje":"",
     "fecha": datos.fechaBeneficio,
     "descripcion":"",
     "destacado":"0",
     "totLikes":datos.likesBeneficio,
     "likeUser":datos.likeUserBeneficio
     }]
     };
 

 var beneficiosTable = new benefObject(jsoB);
 beneficiosTable.addRows(JSON.stringify(benef));
viewContenido.add(beneficiosTable);
}else{
    //Ti.API.info("Datos beneficio null");
}


if(datos.keyProducto!=null){
var jsoSt= {
     "top":10,
     "width": 0.92,
     "tabGroup": settings,
     "reload": "no",
     "tipo" : "productos",
     "size" : "compacto"
};
 var prod=     {"productos":[
     {"keyProducto":datos.keyProducto,
     "idEmpresarial":datos.numCuenta,
     "foto":datos.fotoProducto,
     "porcentaje":"",
     "fecha": datos.fechaProducto,
     "descripcion":"",
     "destacado":"0",
     "totLikes":datos.likesProducto,
     "likeUser":datos.likeUserProducto
     }]
     };
     
  var productosTable = new benefObject(jsoSt);
  //Ti.API.info(JSON.stringify(prod));
 productosTable.addRows(JSON.stringify(prod));
    viewContenido.add(productosTable);
}




///     Button  Listeners for click events      ///
    
    publicacionButton.addEventListener('click', function() {
       var opts = {
          cancel: 3,
          options: ['Mencionar', 'Tip', 'Mensaje Privado', 'Cancel'],
        };

  var dialog = Ti.UI.createOptionDialog(opts);
  dialog.addEventListener('click',function(e){
     //Ti.API.info(JSON.stringify(e));
     switch(e.index){
         case 0:
         postMencion();
         
         break;
         case 1:
         if(postObj=="")postObj = require('empresarial/post');
         var tip = postObj.tip(datos.numCuenta);
         settings.activeTab.open(tip);
         break;
         
         case 2:
         if(postObj=="")postObj = require('empresarial/post');
         var pm = postObj.privateMessage({
             "foto":datos.foto,
             "idDestinatario": datos.numCuenta,
             "closeW":function(w){settings.activeTab.close(w);}
         });
         settings.activeTab.open(pm);
         break;
         
     }
  });
  dialog.show();
  
        
    });
    
    
////        Favoritos Button        ////
    favoritosButton.addEventListener('click', function() {
       
       if(datos.followed==0){
            var url = "http://www.vielite.com/ws_follow.php?idUser="+decorator.idPerfil()+"&id="+datos.numCuenta+"&action=follow";
       }else{
            var url = "http://www.vielite.com/ws_follow.php?idUser="+decorator.idPerfil()+"&id="+datos.numCuenta+"&action=unfollow";
       }
      //Ti.API.info("url fav "+url);
    (function() {
        
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("Fav "+this.responseText);
       datos.followed=(datos.followed==0 ? 1 : 0);
       favoritosButton.title = (datos.followed==0 ? 'Seguir' : 'Dejar de seguir');
       favoritosButton.backgroundImage = (datos.followed==0 ? 'images/login/btn1.png' : 'images/empresarial/btnFav1.png');
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

////        Rate Button        ////    
    rateButton.addEventListener('click', function() {
      (function() {
        var url = "http://www.vielite.com/ws_evalua_empresa.php?idUser="+decorator.idPerfil()+"&id="+datos.numCuenta;
        //Ti.API.info(url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("RATE "+this.responseText);
       var res={
            'screenWidth':decorator.screenWidth,
            'screenHeight':decorator.screenHeight,
            'nombre' : datos.nombre,
            'image' : datos.foto,
            "id" : datos.numCuenta,
            'calif' : this.responseText,
            'refresh' : function(r){
                evaluacion=r;
                primerD.setImage("images/empresarial/numeros/"+r.charAt(0)+".png");
                segundoD.setImage("images/empresarial/numeros/"+r.charAt(2)+".png");
                punto.show();
            }
        }
        if(rateObject=="")rateObject = require('empresarial/rate');
        var rateView = new rateObject(res);
        settings.activeTab.open(rateView);
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
    
    
     
 ///       Tips     ///
 
 if(datos.lastTip_fullname!="" || datos.tipDestacado_fullname!=""){
      var jsoT= {
     "top":0,
     "width": 0.92,
     "id" : datos.numCuenta,
     "compacto" : true,
     "scrollable" :false
 };
 var tipsInfo = {"tips":[]};
  if(datos.tipDestacado_fullname!=""){
     tipsInfo.tips.push({
         "foto":datos.tipDestacado_foto,
         "fullname":datos.tipDestacado_fullname,
         "txt": datos.tipDestacado_txt,
         "totLikes":datos.tipDestacado_totLikes,
         "likeUser":datos.tipDestacado_likeUser,
         "keyTip":datos.tipDestacado_keyTip,
         "idUser":datos.tipDestacado_idUser
     });
 }
 if(datos.lastTip_fullname!=""){
     tipsInfo.tips.push({
          "foto":datos.lastTip_foto,
         "fullname":datos.lastTip_fullname,
         "txt":datos.lastTip_txt ,
         "totLikes":datos.lastTip_totLikes,
          "likeUser":datos.lastTip_likeUser,
           "keyTip":datos.lastTip_keyTip,
           "idUser":datos.lastTip_idUser
     });
 }


 var tipsObject = require('empresarial/tipsTable');
 var tipsTable = new tipsObject(jsoT);

tipsTable.addRows(tipsInfo);
 }


///     Publicaciones       ///
 var jsoP= {
     "top":10,
     "tabGroup":settings,
     "width": 0.92,
     "id": datos.numCuenta,
     "tipo": "publicacion",
     "size" : "compacto",
     "muerta" : true
 };

 var publicacionObject = require('empresarial/mencionesTable');
 var publicacionTable = new publicacionObject(jsoP);


    
    
  // Add to the parent view.
     headerView.add(bannerView);
     headerView.add(avatarView);
     headerView.add(rateButton);
     headerView.add(evaluaLabel);
     headerView.add(favoritosButton);
     mainView.add(headerView);
   //  viewContenido.add(beneficiosTable);
   //  viewContenido.add(storeTable);
    if(datos.lastTip_fullname!="" || datos.tipDestacado_fullname!="") viewContenido.add(tipsTable);
     mainView.add(viewContenido);
     scrollView.add(mainView);
    scrollView.add(publicacionTable);
    
    
//////   RELOAD del scrollview   ////
    var offset = scrollView.contentOffset.y;
    var AI = decorator.loadingIndicator();
    window.add(AI);
     AI.hide();
    function scrollLoad(e){
        
        ////Ti.API.info("DRAGGING "+e.dragging+" offset "+offset);
         offset = e.source.contentOffset.y;
           if(offset>0 && e.dragging===false){
               AI.show();
               scrollView.removeEventListener("scroll",scrollLoad);
                   //Ti.API.info("GET MORE!");
              publicacionTable.reloadOld(true);
              
               setTimeout(function(){
                   AI.hide();
            scrollView.addEventListener("scroll",scrollLoad);
        }, 6000);
               

           }
    }
    
    scrollView.addEventListener("scroll",scrollLoad);
    
 //////////////////////////////////////////
 
    
    window.add(scrollView);
    
    function postMencion(){
       
        var url = "http://www.vielite.com/ws_cats_publicar.php";
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("opciones post mencion "+this.responseText);
       var opciones=JSON.parse(this.responseText);
       if(postObj=="")postObj = require('empresarial/post');
         var mencionar = postObj.mencionar({
             numCuenta : datos.numCuenta,
             data : opciones,
             nombre: datos.nombre,
             username: datos.username
             });
         settings.activeTab.open(mencionar);
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
   
    
    return window;
}

module.exports = home;
