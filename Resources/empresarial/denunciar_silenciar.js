
var decorator = require('utils/decorators');

///     Ventana Silenciar          ///
function silenciar(settings){
    var silenciar = (settings.muted==0 ? 'yes': 'no');
    //Ti.API.info("sienciar "+silenciar);
    var window = Ti.UI.createWindow({
        backgroundImage:'images/bg.jpg',
        layout: 'vertical',
        barImage: "images/empresarial/BarraTitulo.png",
        title: "Ocultar"
    });
    
    var marcoImagen = Ti.UI.createView({
        top:40,
        width:150,
        height: 150,
        borderWidth: 1,
       borderRadius:2,
       borderColor: "#999999",
       backgroundColor : "#f7f7f7"
    });
    
    var imagenHolder = Ti.UI.createView({
        width:170,
        height: 170
    });
    var imagen = Ti.UI.createImageView({
        image: (decorator.sitio+settings.image)
    });
    imagenHolder.add(imagen);
    
    var label = Ti.UI.createLabel({
         color: 'white',
    font: { fontSize:13,fontFamily: 'Source Sans Pro'},
          text: 'El  ocultar esta marca implica que sus publicaciones no serán visibles en tu home, si decides cambiar de opinión puedes regresar y hacerla visible de nuevo.',
          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
          top: 0,
          height:125,
          width: '90%',
    });
    
    var boton = Ti.UI.createButton({
      title: (silenciar=='yes' ? 'Ocultar Empresa' : 'Mostrar Empresa'),
      backgroundImage:(silenciar=='yes' ? 'images/buttons/buttonVielite.png' : 'images/empresarial/btnFav1.png'),
       top: 0,
       width: 210,
       height: 30,
       font: { fontSize:13,fontFamily: 'Source Sans Pro'}
       
    });
    boton.addEventListener('click',function(e){
        
       (function() {
        var url = "http://www.vielite.com/ws_silenciar.php?idUser="+decorator.idPerfil()+"&silenciar="+silenciar+"&target="+settings.id;
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("silenciar "+this.responseText);
       var r= (silenciar=='yes' ? 1 : 0);
       silenciar = (silenciar=='no' ? 'yes': 'no');
       boton.title = (silenciar=='no' ? 'Mostrar Empresa': 'Ocultar Empresa');
       boton.backgroundImage=(silenciar=='yes' ? 'images/buttons/buttonVielite.png' : 'images/empresarial/btnFav1.png');
       settings.refreshDatos(r);
       settings.tab.activeTab.close(window); 
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
        alert("Error en la conexión.");
         
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
    })();
       
    });
    marcoImagen.add(imagenHolder);
    window.add(marcoImagen);
    window.add(label);
    window.add(boton);
    return window;
}


function denunciar(settings){
    
    var mainView = Ti.UI.createWindow({
        height:"100%",
        width:"100%"
    });
    
    var marcoImagen = Ti.UI.createView({
        top:40,
        width:150,
        height: 150,
           borderWidth: 1,
       borderColor: "#999999",
       backgroundColor : "#f7f7f7",
       borderRadius:2
    });
    
    var imagenHolder = Ti.UI.createView({
        width:170,
        height: 170
    });
    
    var imagen = Ti.UI.createImageView({
        image: (decorator.sitio+settings.image)
    });
    imagenHolder.add(imagen);
    
    var labelInstr = Ti.UI.createLabel({
    text: 'Elige un motivo por el cual denunciar',
    font: { fontSize:13,fontFamily: 'Source Sans Pro'},
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  top:222,
  color:"white"
    });
    var botonPicker = Ti.UI.createButton({
      title: '...',
       top: 240,
       width: 210,
       height: 30,
      style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
      backgroundColor: "white",
       color:"#219ff0",
       font: { fontSize:13,fontFamily: 'Source Sans Pro'}
    });
    var boton = Ti.UI.createButton({
      title: 'Denunciar Empresa',
      backgroundImage:'images/buttons/buttonVielite.png',
       top: 315,
       width: 210,
       height: 30,
       font: { fontSize:13,fontFamily: 'Source Sans Pro'}
    });
    var picks=[];
    var picked='';
    boton.addEventListener('click',function(e){
        var i=1;
        for(x in picks){
            if(picks[x]==picked)break;
            i++;
        }
        //Ti.API.info('picked '+picked+"index "+i);
        
         (function() {
        var url = "http://www.vielite.com/ws_denunciar.php?idUser="+decorator.idPerfil()+"&denunciar=yes&target="+settings.id+"&motivo="+i;
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("denunciar "+this.responseText);
       var alerta=JSON.parse(this.responseText);
       alert(alerta.denuncia[0].alerta);
        settings.close();
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
    
   
    
    
    function changePicked(a){
        picked=a;
        botonPicker.title=a;
    }
    
    for(x in settings.data){
    var stringily=settings.data[x][0];
   picks.push(stringily);
}
    
    var picker = decorator.picker({
        'showButton': botonPicker,
        'picked': changePicked,
        'data' : picks
    });
    mainView.add(picker);
    marcoImagen.add(imagenHolder);
    mainView.add(marcoImagen);
    mainView.add(labelInstr);
    mainView.add(botonPicker);
    mainView.add(boton);
    return mainView;
}






exports.silenciar=silenciar;
exports.denunciar=denunciar;