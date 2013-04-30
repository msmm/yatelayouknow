//Pantalla de tips
function tips(openWin,id) {
    
    var decorator = require("utils/decorators");
    //Window
    var window = Titanium.UI.createWindow({
        backgroundColor:'white',
        title: "Tips",
        barImage: "images/empresarial/BarraTitulo.png"
    });
    var publicacionButton = Ti.UI.createButton({
        systemButton: Titanium.UI.iPhone.SystemButton.COMPOSE,
        borderRadius: 3
    });
    
    publicacionButton.addEventListener('click', function(){
        var postObj = require('empresarial/post');
         var tip = postObj.tip(id);
         tip.addEventListener('close',window.refreshT);
         openWin(tip);
    });
    window.rightNavButton=publicacionButton;
    var emptyView = decorator.emptyTab("images/empresarial/secciones/icoTips.png","Por el momento no hay tips que mostrar."); 
    window.add(emptyView);
    
    var tableTipsObj=require('empresarial/tipsTable');
    var tableTips = new tableTipsObj({
     "top":0,
     "width": 0.92,
     "id" : id,
     "compacto" : false,
     "scrollable" : true
     });
    
   window.refreshT = function() {
       emptyView.hide();
        var url = "http://www.vielite.com/ws_tips.php?idUser="+decorator.idPerfil()+"&id="+id+"&pagina=1";
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
         tableTips.reset();
       //Ti.API.info("TIPS "+this.responseText);
       var res=JSON.parse(this.responseText);
       if(res.tips[0].alerta){
           emptyView.show();
       }else{
          tableTips.addRows(res); 
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
    };
    
 
 window.add(tableTips);
    return window;
}

module.exports = tips;
