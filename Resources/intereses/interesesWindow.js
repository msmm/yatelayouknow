/*
 * params:
 * -fullControls:boolean  ----- si son tus intereses editables o ajenos solo para ver
 */
function interesesWindow(params){

var decorator = require("utils/decorators");
var loadingView = decorator.loadingIndicator();
var activos=[];

// main Window  ///
var window = Ti.UI.createWindow({
     backgroundColor:'white',
     title: (params.fullControls ? "Mis Intereses" :"Intereses"),
     barImage: "images/empresarial/BarraTitulo.png"
});

window.add(loadingView);

    var url = "http://www.vielite.com/ws_intereses.php?id="+params.id;
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
        constructor(this.responseText);
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


function constructor(res){
    
    //Ti.API.info("intereses: "+res);
    var intereses=JSON.parse(res);
    intereses=intereses.intereses;
    
    
   /// ScrolVIEW principal     ////
var mainScrollView = Ti.UI.createScrollView({
  contentWidth: decorator.screenWidth,
  contentHeight: 'auto',
  showHorizontalScrollIndicator: false,
  height: "100%",
  width: decorator.screenWidth,
  backgroundColor:"#e7e7e7",
  layout:"horizontal"
});

if(params.fullControls){
    var doneButton = Ti.UI.createButton({
    title : "Guardar"
    });
    
    
    window.setRightNavButton(doneButton);
    
    var mainLabel = Ti.UI.createLabel({
    width: decorator.screenWidth,
    height:40,
    backgroundColor:"#f7f7f7",
    font: {
            fontSize:13 ,fontFamily: 'Source Sans Pro'
    },
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
    text:"Elige las categorías que más se adecuen a tus intereses",
    color:"#404040"
});
mainScrollView.add(mainLabel);
}



function createIcon(img,texto,dif,index){
    
    var iconView = Ti.UI.createView({
        width:(decorator.screenWidth/3)-dif,
        height:120,
        interes:texto,
        backgroundColor:"#f7f7f7",
        index:index
    });
    var mainLabel = Ti.UI.createLabel({
    width: 96,
    height:15,
    text:texto,
    color:"#999999",
    bottom:4,
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
    font: {
            fontSize:11 ,fontFamily: 'Source Sans Pro'
    },
    touchEnabled:false
    });
    var imgView = Ti.UI.createView({
        height:60,
        width:63,
        touchEnabled:false,
        backgroundImage:(img)
    });
    iconView.add(mainLabel);
    iconView.add(imgView);
    
    iconView.morf = function(image){
        imgView.backgroundImage=image;
    };
    
    return iconView;
}


//////      ARREGLO de categorias   ///

//var cats = ["AIRE LIBRE","ANIMALES","ARTE Y CULTURA","DEPORTES","ENTRETENIMIENTO","GASTRONOMIA","HOGAR","INFANTIL","MODA HOMBRE","MODA MUJER","NOTICIAS","Salud Y BELLEZA","TECNOLOGIA","TRANSPORTE","VIAJES","VIDASOCIAL"];
  var cats = [];
    for(x in intereses){
        cats.push(intereses[x].nombre);
        activos.push({'id':intereses[x].id , 'activo':intereses[x].activo});
        //Ti.API.info(intereses[x].nombre+": "+intereses[x].activo);
}
    var indiceAgregado=0;
    for(var i=0,j=cats.length;i<j;i++){
        
        var img=getImg(cats[i],activos[i].activo);
        var icon = createIcon("images/intereses/"+img+".png",cats[i],(indiceAgregado%3==1 ? 0:1),i);
        icon.left=(indiceAgregado%3!=0 ? 1:0 );
        icon.top=(indiceAgregado>2 ? 1:0 );
        if(params.fullControls || (activos[i].activo==1)){
        mainScrollView.add(icon);
        indiceAgregado++;
        }
    }
    
    if(params.fullControls){
    doneButton.addEventListener('click',function(e){
       
       var interesesActivos="";
       for(var i=0,j=activos.length;i<j;i++){
           if(activos[i].activo==1)interesesActivos = interesesActivos.concat((","+activos[i].id));
       }
       
       if(interesesActivos.charAt(0)==",")interesesActivos=interesesActivos.substr(1);
       
       var url = decorator.sitio+"/ws_intereses_update.php?idUser="+params.id+"&intereses="+interesesActivos;
        //Ti.API.info(url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("intereses guardados "+this.responseText);
       alert("Guardados");
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         alert("Error de conexión");
     },
     timeout : 9000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
        
    });
    
    
    mainScrollView.addEventListener("click",function(e){
        ////Ti.API.info(JSON.stringify(e));
        var ind=e.source.index;
        var value=activos[ind].activo;
        activos[ind].activo=(value==0 ? 1:0);
        var img=getImg(cats[ind],activos[ind].activo);
        e.source.morf("images/intereses/"+img+".png");
        
    });
    }
    
    window.add(mainScrollView);
     loadingView.hide();
}

    
    
    params.stopLoading();
    return window;
}

function getImg(text,mode){
    var result="";
    switch(text){
        case 'Aire libre':
        result=(mode==0 ? "airelibre":"airelibreOn");
        break
         case 'Animales':
        result=(mode==0 ? "animales":"animalesOn");
        break
         case 'Arte y cultura':
        result=(mode==0 ? "arteycuktura":"arteyculturaon");
        break
         case 'Deportes':
        result=(mode==1 ? "deportesOn":"deportes");
        break
         case 'Entretenimiento':
        result=(mode==1 ? "entretenimientoOn":"entretenimiento");
        break
         case 'Gastronomía':
        result=(mode==1 ? "gastronomiaOn":"gastronomia");
        break
         case 'Hogar':
        result=(mode==1 ? "hogarOn":"hogar");
        break
         case 'Infantil':
        result=(mode==1 ? "infantilOn":"infantil");
        break
         case 'Moda Hombre':
        result=(mode==1 ? "modahombreOn":"modahombre");
        break
         case 'Moda mujer':
        result=(mode==1 ? "modamujerOn":"modamujer");
        break
         case 'Noticias':
        result=(mode==1 ? "noticiasOn":"noticias");
        break
         case 'Salud y belleza':
        result=(mode==1 ? "saluybellezaOn":"saluybelleza");
        break
         case 'Tecnología':
        result=(mode==1 ? "tecnologiaOn":"tecnologia");
        break
         case 'Transporte':
        result=(mode==1 ? "transporteOn":"transporte");
        break
         case 'Viajes':
        result=(mode==1 ? "viajesOn":"viajes");
        break
         case 'Vida social':
        result=(mode==1 ? "vidasocialOn":"vidasocial");
        break
        case 'Comida y bebida':
        result=(mode==1 ? "comidaybebidaOn":"comidaybebida");
        break
        case 'Decoración':
        result=(mode==1 ? "decoracionOn":"decoracion");
        break
        case 'Cine y tv':
        result=(mode==1 ? "cineytvOn":"cineytv");
        break
        case 'Gadgets':
        result=(mode==1 ? "gadgetsOn":"gadgets");
        break
        case 'Diseño':
        result=(mode==1 ? "disenoOn":"diseno");
        break
        case 'Fotografía':
        result=(mode==1 ? "fotografiaOn":"fotografia");
        break
        case 'Citas y libros':
        result=(mode==1 ? "librosycitasOn":"librosycitas");
        break
        case 'Negocios':
        result=(mode==1 ? "negociosOn":"negocios");
        break
        case 'Humor':
        result=(mode==1 ? "humorOn":"humor");
        break
        case 'Música':
        result=(mode==1 ? "musicaOn":"musica");
        break
        case 'Arquitectura':
        result=(mode==1 ? "arquitecturaOn":"arquitectura");
        break
        
        
    }
    
    return result;
}


module.exports=interesesWindow;