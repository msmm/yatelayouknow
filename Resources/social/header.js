//Encabezado de la seccion social
function header(id,open,close){
    
    var decorator = require("utils/decorators");
    var minScrollSize=160;
    var tablaFoto="";
    
        var mainView = Ti.UI.createView({
        top:0,
        width: decorator.screenWidth,
        height: minScrollSize,
        zIndex:3
    });
    function createHeader(params){
        
    var altoFoto = (params.alto_img*decorator.ratioAnchoaScreenWidth(decorator.screenWidth+2,params.ancho_img));
    //Ti.API.info("altoFoto "+altoFoto);

    
    var foto = Ti.UI.createImageView({
        image:(decorator.sitio+params.foto),
         width: (decorator.screenWidth+2),
         defaultImage:'images/fotodefault.jpg',
         activada:false,
         hires:false,
       height: altoFoto
    });
    
    var openArrow = Ti.UI.createView({
        width:46,
        height:46,
        backgroundImage:"images/social/abrirFoto.png",
        top:10,
        right:10,
        estado:"abrir",
        zIndex:3
    });
    var info = Ti.UI.createView({
        width:46,
        height:46,
        backgroundImage:"images/social/info.png",
        bottom:2,
        right:2,
        showing:false,
        zIndex:3
    });
    info.hide();
    
    var barraInfo = Ti.UI.createView({
        width:300,
        height:40,
        backgroundColor: "#85000000",
        top:115,
        layout: "horizontal"
    });
    
    function createButtonBarra(title,value){
        var view = Ti.UI.createView({
        width:75,
        height:40,
        borderWidth:1,
        borderColor:"#999999"
        });
        var label = Ti.UI.createLabel({
          color:'white',
          text: title,
          font:{fontFamily:'Source Sans Pro', fontSize:13},
          top: 4,
          height: 15
        });
        var label2 = Ti.UI.createLabel({
          color:'white',
          font:{fontFamily:'Source Sans Pro', fontSize:15, fontWeight:'bold'},
          text: value,
          bottom: 4,
          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
          width:73,
          height: 15
        });
        
        view.add(label);
        view.add(label2);
        return view;
    }
    
    var seg = createButtonBarra("Seguidores",params.followers);
    seg.addEventListener('click',function(e){
        
      if(tablaFoto=="")tablaFoto=require('ui/tablaConFoto');
      var listaSeg = new tablaFoto({
          title:'Seguidores',
          url: ('http://www.vielite.com/ws_followers.php?id='+id),
          type:'usuario',
          openW:open,
          closeW:close
      });
       var window = Ti.UI.createWindow({
        backgroundColor:'white',
     title: 'Seguidores',
     barImage: "images/empresarial/BarraTitulo.png"
    });
    window.add(listaSeg);
        open(window);
    });
    var sig = createButtonBarra("Siguiendo",params.following);
    sig.addEventListener('click',function(e){
        
      if(tablaFoto=="")tablaFoto=require('ui/tablaConFoto');
      var listaSig = new tablaFoto({
          title:'Siguiendo',
           type:'usuario',
          url: ('http://www.vielite.com/ws_following.php?id='+id),
           openW:open,
           closeW:close
      });
       var window = Ti.UI.createWindow({
        backgroundColor:'white',
     title: 'Siguiendo',
     barImage: "images/empresarial/BarraTitulo.png"
    });
    window.add(listaSig);
        open(window);
    });
    var fav = createButtonBarra("Marcas",params.favoritas);
    fav.addEventListener('click',function(e){
        
      if(tablaFoto=="")tablaFoto=require('ui/tablaConFoto');
      var listaFav = new tablaFoto({
          title:'Marcas',
          type:'empresarial',
          url: ('http://www.vielite.com/ws_favs.php?id='+id),
           openW:open,
           closeW:close
      });
       var window = Ti.UI.createWindow({
        backgroundColor:'white',
     title: 'Marcas',
     barImage: "images/empresarial/BarraTitulo.png"
    });
    window.add(listaFav);
        open(window);
    });
    var vie = createButtonBarra("Vielites",params.vielites);
    barraInfo.add(seg);
    barraInfo.add(sig);
    barraInfo.add(fav);
    barraInfo.add(vie);
    
    
////////     view info     //////////
    var infoView = Ti.UI.createView({
        backgroundColor:"#85000000",
        height:altoFoto,
        width:"100%",
        zIndex:2,
        top:0
    });
    
    function createLabelInfo(text,left,fw,top,fz){
           var label = Ti.UI.createLabel({
        text: text,
        color: "white",
        left:left,
        top:top,
        height:Ti.UI.SIZE,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font:{fontFamily: 'Source Sans Pro', fontSize:fz, fontWeight:fw}
    });
    return label; 
    }
    var titleH= (params.nombre!="" ? "Nombre:\n\n" : "")+""+(params.username!="" ? "Nombre de Usuario:\n\n":"")+""+(params.cumple!="" ? "Cumpleaños:\n\n":"")+""+(params.cd_nacimiento!="" ? "Ciudad de Origen:\n\n":"")+""+(params.ciudad!="" ? "Ciudad Actual:\n\n":"")+""+(params.invitadoPor!="" ? "Invitado por:\n\n":"")+""+(params.miembroDesde!="" ? "Comienzo en VIELITE:\n\n":"");
    var nombre = createLabelInfo(titleH,10,"normal",4,14);
    infoView.add(nombre);

    var resH= (params.nombre!="" ? (params.nombre+"\n\n") : "")+""+(params.username!="" ? (params.username+"\n\n"):"")+""+(params.cumple!="" ? (params.cumple+"\n\n"):"")+""+(params.cd_nacimiento!="" ? (params.cd_nacimiento+"\n\n"):"")+""+(params.ciudad!="" ? (params.ciudad+"\n\n"):"")+""+(params.invitadoPor!="" ? (params.invitadoPor+"\n\n"):"")+""+(params.miembroDesde!="" ? (params.miembroDesde+"\n\n"):"");
    var nombreInfo = createLabelInfo(resH,25,"bold",15,14);
    infoView.add(nombreInfo);



///////////////////////////////////
    
    mainView.add(foto); 
    mainView.add(barraInfo);
    mainView.add(openArrow);
    infoView.hide();
    mainView.add(infoView);
    mainView.add(info);
    
    
///////     LISTENEERS     ////////
  //  var lock=false;

    infoView.addEventListener('click',function(){
      
        infoView.hide();
     
    });
    foto.addEventListener('click',function(){
        
        if(foto.activada){
            infoView.show();
        }else{
          //  if(!lock){
          //  lock=!lock;
           // mainView.animate(animationCrecer);
            openArrow.estado="cerrar";
            openArrow.backgroundImage="images/social/cerrarFoto.png"
           mainView.setHeight(altoFoto);
           foto.activada=true;
           info.show();
           barraInfo.hide();
      //  }
        }
    });
    
    info.addEventListener('click',function(){
        if(info.showing){
            infoView.hide();
             info.showing=false; 
        }else{
           infoView.show();
        info.showing=true; 
        }
        
    });
    
    openArrow.addEventListener('click',function(){
        
        if(openArrow.estado=="abrir"){
           // if(!lock){
            openArrow.estado="cerrar";
            openArrow.backgroundImage="images/social/cerrarFoto.png"
          // lock=!lock;
          //  mainView.fireEvent('headerCrece');
           // mainView.animate(animationCrecer);
          mainView.setHeight(altoFoto);
           foto.activada=true;
           info.show();
           barraInfo.hide();
         //  }
        }else if(openArrow.estado=="cerrar"){
           
        //    if(!lock){
                 openArrow.estado="abrir";
                 foto.activada=false;
           openArrow.backgroundImage= "images/social/abrirFoto.png";
                info.hide();
          //  lock=!lock;
        infoView.hide();
        mainView.setHeight(minScrollSize);
       //mainView.fireEvent('headerDecrece');
      // mainView.animate(animationDecrecer);
       
        barraInfo.show();
        //}
        }
    });
    
    /////  Animations       ////
    // var animationCrecer = Titanium.UI.createAnimation();
    // animationCrecer.height = altoFoto;
    // animationCrecer.duration = 500;
    // animationCrecer.addEventListener('complete',function(){
        // lock=false;
        // });
    // var animationDecrecer = Titanium.UI.createAnimation();
    // animationDecrecer.height = minScrollSize;
    // animationDecrecer.duration = 500;
    // animationDecrecer.addEventListener('complete',function(){
        // barraInfo.show();
        // lock=false;
        // });

        
    }
    

   
   mainView.constructor=createHeader;
    return mainView;
}

module.exports=header;