
function homeWindow(params){
    
    var decorator = require("utils/decorators");
    var postObj="";
    var loadingViewT = decorator.loadingIndicator();
    loadingViewT.opacity = 0.10;
    var loadingViewS = decorator.loadingIndicator();
    function stpLoadT(){
        loadingViewT.hide();
    }
    function stpLoadS(){
       // //Ti.API.info("stoploadS");
        loadingViewS.hide();
    }
    
    var window = Ti.UI.createWindow({
        title:"Home",
        backgroundColor:'white',
        barImage: "images/empresarial/BarraTitulo.png"
    });
    
    var todoView = Ti.UI.createView({
        top:0,
        height: (decorator.trueHeight),
        width: "100%"
    });
   // todoView.add(loadingViewT);
    var siguiendoView = Ti.UI.createView({
        height: (decorator.trueHeight),
        width: "100%",
        top:0
    });
    siguiendoView.add(loadingViewS);
    siguiendoView.hide();


 ///     Tablas homeWindow     ////
     
  var todoTableObject = require('home/todoTable');
  var todoTable = new todoTableObject({
      openW:params.openW,
      closew: params.closeW,
      stopLoading :stpLoadT,
      idPerfil:params.id,
      url:false,
      busqueda:false,
      dinamicButtons:dinamicButtons
  });
   todoView.add(todoTable);
   
  var seguidoresTableObject = require('home/seguidoresTable');
  var seguidoresTable = new seguidoresTableObject({
      openW:params.openW,
      closew: params.closeW,
      stopLoading :stpLoadS,
      idPerfil:params.id,
      dinamicButtons:dinamicButtons
  });
   siguiendoView.add(seguidoresTable);
    
    
 ///////   BOTONES DE PIE   //////
 
 function dinamicButtons(hide){
     
     if(hide){
       todoBoton.hide();  
       siguiendoBoton.hide();
     }else{
         todoBoton.show();  
       siguiendoBoton.show();
     }
     
 }
 
 var todoBoton = Ti.UI.createView({
        height: 36,
        width: "50%",
        backgroundImage:'images/empresarial/BarraTitulo.png',
        bottom:0,
        left:0,
        zIndex:1,
        activado:true
    });
 var textTodo = Ti.UI.createLabel({
     text:"Todo",
     color: "white",
     font:{fontFamily: 'Source Sans Pro', fontSize:13, fontWeight:"bold"}
 });
 todoBoton.add(textTodo);
var siguiendoBoton = Ti.UI.createView({
        height: 36,
        width: "50%",
        backgroundImage:'images/buttons/btnoff.png',
        bottom:0,
        right:0,
        zIndex:1,
        activado:false
    });
    var textsiguiendo = Ti.UI.createLabel({
     text:"Siguiendo",
     color: "#005890",
     font:{fontFamily: 'Source Sans Pro', fontSize:13, fontWeight:"bold"}
 });
    siguiendoBoton.add(textsiguiendo);
    
    
    todoBoton.addEventListener('click',function(){
        if(!todoBoton.activado){
            todoView.show();
            siguiendoView.hide();
            todoBoton.backgroundImage='images/empresarial/BarraTitulo.png';
            siguiendoBoton.backgroundImage='images/buttons/btnoff.png';
            textsiguiendo.color="#005890";
            textTodo.color="white";
            todoBoton.activado=true;
        siguiendoBoton.activado=false;
            }else{
                todoTable.scrollToTop(0);
            }
        
    });
    var first=true;
    siguiendoBoton.addEventListener('click',function(){
        if(!siguiendoBoton.activado){
        siguiendoView.show();
        todoView.hide();
        
        todoBoton.backgroundImage='images/buttons/btnoff.png';
        siguiendoBoton.backgroundImage='images/empresarial/BarraTitulo.png';
        textsiguiendo.color="white";
            textTodo.color="#005890";
        todoBoton.activado=false;
        siguiendoBoton.activado=true;
        if(first){
            seguidoresTable.reload();
         first=false;   
        }
        }else{
            seguidoresTable.scrollToTop(0);
        }
        
    });
    
    
    
     ////////////////////////////////////
 //////         POSTIIINGGG     ////////////
    var publicacionButton = Ti.UI.createButton({
        systemButton: Titanium.UI.iPhone.SystemButton.COMPOSE,
        borderRadius: 3
    });
    publicacionButton.addEventListener('click',postMencion);
    function postMencion(){
        publicacionButton.removeEventListener('click',postMencion);
        setTimeout(function(){
            publicacionButton.addEventListener('click',postMencion);
        },2000);
        
        var url = "http://www.vielite.com/ws_cats_publicar.php";
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
    //   //Ti.API.info("opciones post mencion "+this.responseText);
       var opciones=JSON.parse(this.responseText);
       if(postObj=="")postObj = require('empresarial/post');
         var mencionar = postObj.mencionar({
             numCuenta : decorator.idPerfil(),
             data : opciones,
             nombre: "Publicar",
             username: "",
             closeW: params.closeW
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
    window.rightNavButton=publicacionButton;
    
    
    
    window.add(todoBoton);
    window.add(siguiendoBoton);
    window.add(todoView);
    window.add(siguiendoView);
    params.stopLoading();
    return window;
}


module.exports = homeWindow;