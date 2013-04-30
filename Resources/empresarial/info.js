//Pantalla de info
function info(tabGroup,data) {
    
    var datos=data[0];
    var seguidoresObj="";
    var decorator = require('utils/decorators');
    var postObj="";
    //Ti.API.info("Info'''''''"+JSON.stringify(datos));
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
    //scroll View
    var scrollView = Ti.UI.createScrollView({
      contentWidth: 320,
      contentHeight: 'auto',
      showVerticalScrollIndicator: true,
      height: '100%',
      width: "100%",
      layout : "vertical",
      backgroundColor: 'white'
    });
    
//////    Header View       ////
    var mapHolderView = Titanium.UI.createView({
       backgroundColor:'transparent',
       width:decorator.screenWidth,
       height:175,
       top:0
    });
    
    var headerView = Titanium.UI.createView({
       backgroundColor:'transparent',
       width:Ti.UI.FILL,
       height:200
    });
    ///MAPA///
 //  Sacar las coordenadas      //
 var str = datos.coordsGoogle;
 var n=str.indexOf(",");
 var a=str.substring(0,n);
 var b=str.substring(n+1)
 //Ti.API.info("COOORDSS GOOGLE "+a+" "+b);
//Anotation
var Annotation = Titanium.Map.createAnnotation({
    latitude:a,
    longitude:b,
    title:datos.nombre,
    pincolor:Titanium.Map.ANNOTATION_RED,
    animate:true
});

    //MapView
    var mapview = Titanium.Map.createView({
    mapType: Titanium.Map.STANDARD_TYPE,
    region: {latitude:a, longitude:b,latitudeDelta:0.005,longitudeDelta:0.005},
    animate:true,
    regionFit:true,
    annotations:[Annotation],
       touchEnabled : false
    });
   mapview.zoom(-5);
   
    mapHolderView.add(mapview);
    
    ///MAPVIEW listener////
    mapHolderView.addEventListener('click',function(e){
        
        var closeB = Ti.UI.createButton({
      title:"cerrar"
  });
  closeB.addEventListener('click',function(e){
      windowMv.close();
  });
  var windowMv = Ti.UI.createWindow({
      "modal": true,
      "leftNavButton" : closeB,
      "title" : "Ubicación",
      barImage: "images/empresarial/BarraTitulo.png"
  });
  var Annotation2 = Titanium.Map.createAnnotation({
    latitude:a,
    longitude:b,
    title:datos.nombre,
    pincolor:Titanium.Map.ANNOTATION_RED,
    animate:true
});

    //MapView
    var mapview2 = Titanium.Map.createView({
    mapType: Titanium.Map.STANDARD_TYPE,
    region: {latitude:a, longitude:b,latitudeDelta:0.01,longitudeDelta:0.01},
    animate:true,
    regionFit:true,
    annotations:[Annotation2]
    });
    mapview2.zoom(-20);
    
  windowMv.add(mapview2);
  windowMv.open();
    });
    ////ImageView
    
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
    var avatarViewHolder = Ti.UI.createView({
        width : 170,
        height : 170,
    });
     var image = Ti.UI.createImageView({
      image:(decorator.sitio+datos.foto),
      defaultImage : 'images/icons/directory.png',
      hires : true
    });
    avatarViewHolder.add(image);
    avatarView.add(avatarViewHolder);
    
    
    
    

    // Boton de Seguidores.
    var seguirButton = Ti.UI.createButton({
        title : 'Seguidores: '+datos.followers,
        height : 30,
        width : 147,
        font: { fontSize:13,fontFamily: 'Source Sans Pro'},
        bottom : 0,
        right : 10,
        backgroundImage : "images/login/btn1.png",
        borderRadius: 3
    });
    
    seguirButton.addEventListener("click",function(e){
        if(seguidoresObj==""){
          seguidoresObj = require('ui/seguidores');
         }
        
       var sWindow = new seguidoresObj(("http://www.vielite.com/ws_followers.php?id="+datos.numCuenta),function(e){
           tabGroup.activeTab.open(e);
       });  
        
        
        tabGroup.activeTab.open(sWindow);
    });


    
    // Add to the parent view.
    headerView.add(mapHolderView);
    headerView.add(avatarView);
    headerView.add(seguirButton);
    
    

/////////////////////////////////////////////////////////////

//////         Acerca De       //////
    ///Title
    var labelTitle = Ti.UI.createLabel({
      color: '#404040',
      text: 'Acerca de ',
      
      font: { fontSize:13,fontFamily: 'Source Sans Pro', fontWeight:"bold"},
      width: 'auto', height: 'auto'
    });
    var labelTitle2 = Ti.UI.createLabel({
      color: '#005890',
      text: datos.nombre,
      left:4,
      font: { fontSize:13,fontFamily: 'Source Sans Pro', fontWeight:"bold"},
      width: 'auto', height: 'auto'
    });
    var titleView =  Ti.UI.createView({
       left : 10,
      top: 10,
      layout:"horizontal",
      height:15
    });
    titleView.add(labelTitle);
    titleView.add(labelTitle2);
    
    /////Text Area///
    
    var labelMas = Ti.UI.createLabel({
      color: '#888',
      font: { fontSize:15 },
      text: 'Ver todo',
      top: 0,
      width: Ti.UI.SIZE, height: 22
    });
    
    // Create an ImageView.
    var flechaInfo = Ti.UI.createImageView({
        image : 'images/empresarial/trienguloDesplegarInfo.png',
        width : 31,
        height : 10,
        top : 0
    });
    
    var verMas = Ti.UI.createView({
        top:10,
        height: 49,
        width: 70,
        layout:'vertical'
    });
    verMas.add(labelMas);
    verMas.add(flechaInfo);
    
    verMas.hide();
    verMas.addEventListener('click',function(e){
        
        textArea.text=datos.acercaDe;
        textArea.updateLayout({height:Ti.UI.SIZE});
        verMas.hide();
        
    });
    var acercaDe=""+datos.acercaDe;
    

    if(acercaDe.length>200){
        var strr="...";
        acercaDe=acercaDe.substring(0,200);
        
        acercaDe=acercaDe.concat(strr);
    
        verMas.show();
    }else{
        verMas.setHeight(1);
    }
    
      var textArea = Ti.UI.createLabel({
     
      color: '#404040',
      font: { fontSize:13,fontFamily: 'Source Sans Pro'},
      textAlign: 'left',
      text: acercaDe,
      top: 10,
      left: 10, height : Ti.UI.SIZE,
      right:10
    });



scrollView.add(headerView); 
    scrollView.add(titleView);
    scrollView.add(textArea);
    scrollView.add(verMas);
    
    
    
///////////////////////////////////////////////////////////////////
////       Datos de la empresa      /////
    //Title Datos contacto
    var labelTitleDatosContacto = Ti.UI.createLabel({
      color: '#404040',
      font: { fontSize:13,fontFamily: 'Source Sans Pro', fontWeight:"bold"},
      text: 'Datos de Contacto',
      left : 10,
      top: 15,
      width: 'auto', height: 'auto'
    });
    scrollView.add(labelTitleDatosContacto);
    if(datos.direccion!=""){
            var labelDireccion = Ti.UI.createLabel({
       color: '#404040',
      font: { fontSize:13,fontFamily: 'Source Sans Pro'},
      text: 'Dirección: '+datos.direccion,
      left : 10,
      top: 10,
      width: 'auto', height: 'auto'
    });
        
        scrollView.add(labelDireccion);
    }

    if(datos.telefono){
    var labelTelefonoTitle = Ti.UI.createLabel({
      color: '#404040',
      font: { fontSize:13,fontFamily: 'Source Sans Pro'},
      text: 'Teléfono: ',
      left : 0,
      width: 'auto', height: 'auto'
    });
    var labelTelefono = Ti.UI.createLabel({
      color: '#005890',
      font: { fontSize:14,fontFamily: 'Source Sans Pro', fontWeight:"bold"},
      text: datos.telefono,
      left:4,
      width: 'auto', height: 'auto'
    });
        labelTelefono.addEventListener('click',function(e){
            var teel='tel:'+datos.telefono+'';
            //Ti.API.info(teel);
        Ti.Platform.openURL(teel);
    });
    var telView = Ti.UI.createView({
        layout:"horizontal",
        left : 10,
      top: 1,
      width: decorator.screenWidth, height: 20
    });
    telView.add(labelTelefonoTitle);
    telView.add(labelTelefono);
    
    scrollView.add(telView);
    }
    
    if(datos.ciudad!=""){
    var labelCiudad = Ti.UI.createLabel({
       color: '#404040',
      font: { fontSize:13,fontFamily: 'Source Sans Pro'},
      text: 'Ciudad: '+datos.ciudad,
      left : 10,
      top: 1,
      width: 'auto', height: 'auto'
    });
    
    scrollView.add(labelCiudad);
    }
    
    if(datos.cp!=""){
    var labelCP = Ti.UI.createLabel({
       color: '#404040',
      font: { fontSize:13,fontFamily: 'Source Sans Pro'},
      text: 'Código Postal: '+datos.cp,
      left : 10,
      top: 1,
      width: 'auto', height: 'auto'
    });
    scrollView.add(labelCP);
    }
    
    if(datos.horario!=""){
    var labelHorario = Ti.UI.createLabel({
       color: '#404040',
      font: { fontSize:13,fontFamily: 'Source Sans Pro'},
      text: 'Horario: '+datos.horario,
      left : 10,
      top: 1,
      width: 'auto', height: 'auto'
    });
    scrollView.add(labelHorario);
    }
    
    
///////////////////////////////////////////////////////////////////
////       FOOTER      /////

if(datos.sitioWeb!=""){
    //Sitioweb label
    var labelSitioWebTitle = Ti.UI.createLabel({
      color: '#404040 ',
      font: { fontSize:13,fontFamily: 'Source Sans Pro', fontWeight:"bold"},
      text: 'Sitio Web',
      textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
      top: 16,
      left : 10,
      width: 'auto', height: 'auto'
    });
    var labelSitioWeb = Ti.UI.createLabel({
      color: '#005890',
      font: { fontSize:14,fontFamily: 'Source Sans Pro', fontWeight:"bold"},
      text: datos.sitioWeb,
      textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
      top: 4,
      left : 10,
      width: 'auto', height: 'auto'
    });
    labelSitioWeb.addEventListener('click',function(e){
        
        var url= (datos.sitioWeb.charAt(0)=='w') ? "http://"+datos.sitioWeb+"" : ""+datos.sitioWeb+"";
        //Ti.API.info(url);
    Titanium.Platform.openURL(url);
});

    scrollView.add(labelSitioWebTitle);
    scrollView.add(labelSitioWeb);
    }
    
   // //email label///
   if(datos.email!=""){
   var labelEmailTitle = Ti.UI.createLabel({
      color: '#404040 ',
      font: { fontSize:13,fontFamily: 'Source Sans Pro', fontWeight:"bold"},
      text: 'Correo electrónico',
      textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
      top: 25,
      left : 10,
      width: 'auto', height: 'auto'
    });
    var labelEmail = Ti.UI.createLabel({
      color: '#005890',
      font: { fontSize:14,fontFamily: 'Source Sans Pro', fontWeight:"bold"},
      text: datos.email,
      textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
      top: 4,
      left : 10,
      width: 'auto', height: 'auto'
    });
    var recip=""+datos.email+"";
    
        var emailDialog = Ti.UI.createEmailDialog();
    labelEmail.addEventListener('click',function(e){
     emailDialog.toRecipients = [recip];
    emailDialog.open();

});
    scrollView.add(labelEmailTitle);
    scrollView.add(labelEmail);
    }
    

    var espacioBottom = Ti.UI.createView({
        height:37
    });
    scrollView.add(espacioBottom);
    window.add(scrollView);
    
//////////////////////////////////
/////  POST LISTENER   ///////////
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
         tabGroup.activeTab.open(tip);
         break;
         
         case 2:
         if(postObj=="")postObj = require('empresarial/post');
         var pm = postObj.privateMessage({
             "foto":datos.foto,
             "idDestinatario": datos.numCuenta,
             "closeW":function(w){tabGroup.activeTab.close(w);}
         });
         tabGroup.activeTab.open(pm);
         break;
         
     }
  });
  dialog.show();
  
        
    });
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
         tabGroup.activeTab.open(mencionar);
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

module.exports = info;
