//rate view Constructor
function rate(res) {
    
    var decorator = require('utils/decorators');
    var estrellas = [];
    
    var window =  Ti.UI.createWindow({
        tabBarHidden: true,
        title: 'Califica',
        barImage: "images/empresarial/BarraTitulo.png"
    });
    // Views
    var mainView = Ti.UI.createView({
     backgroundImage:'images/bg.jpg',
     width: res.screenWidth,
     height: Ti.UI.FILL
    });
    var starsView = Ti.UI.createView({
        backgroundColor : 'transparent',
        layout: 'horizontal',
        height: 60,
        width: Ti.UI.SIZE,
        top: 275
    });
    
    // ImageViews
    var logo = Ti.UI.createImageView({
        image:(decorator.sitio+res.image),
        top:80,
        height: 150,
        width: 150,
        borderRadius:8
        });
    var califView = Ti.UI.createView({
        backgroundImage:'images/empresarial/calificacion.png',
        top:70,
        left: (res.screenWidth*0.60),
        height: 64,
        width: 64,
        zindex:1
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
    califView.add(primerD);
    califView.add(punto);
    califView.add(segundoD);
    var calif=JSON.parse(res.calif);
    calif=calif[0];
 if(calif.evaluacion!=null){
    var evaluacion=calif.evaluacion;
    primerD.setImage("images/empresarial/numeros/"+evaluacion.charAt(0)+".png");
    segundoD.setImage("images/empresarial/numeros/"+evaluacion.charAt(2)+".png");
    }else{
        punto.hide();
    }

      var imgUrl='';
    for(var i=1;i<6;i++){
        calif.evalUser>=i ? imgUrl='images/empresarial/estrellaCalificacionOn.png' :imgUrl='images/empresarial/estrellaCalificacionOff.png';
        var image = Ti.UI.createButton({
        backgroundImage:imgUrl,
        left:7,
        id:i,
        height: 44,
        width: 46
        });
        estrellas.push(image);
        starsView.add(image);
    }
    
    mainView.add(logo);
    mainView.add(califView);
    mainView.add(starsView);
    
    starsView.addEventListener('click',function(e){
        //Ti.API.info("estrellas "+estrellas.length);
        for(var i=0;i<estrellas.length;i++){
            //Ti.API.info(JSON.stringify(estrellas[i]));
        estrellas[i].backgroundImage=(e.source.id>i ? 'images/empresarial/estrellaCalificacionOn.png' :'images/empresarial/estrellaCalificacionOff.png');
        
        }
        
        (function() {
        var url = "http://www.vielite.com/ws_evalua_empresa.php?idUser="+decorator.idPerfil()+"&id="+res.id+"&eval="+e.source.id;
        //Ti.API.info(url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
         //Ti.API.info(this.responseText);
         var resp=JSON.parse(this.responseText);
         resp=resp[0];
         res.refresh(resp.evaluacion);
      setTimeout(function(){
            window.close();
        }, 500);
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
        alert("Problema de conexión.");
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
    })();
        
    })
   
   window.add(mainView);
    return window;
}

module.exports = rate;
