
function mensajesTable(params){
    
    var decorator = require("utils/decorators");
    var loadingView = decorator.loadingIndicator();
    var msjDetail = "",pmObj= "";
    
    
    var escribirMsj = Ti.UI.createButton({
        systemButton:Titanium.UI.iPhone.SystemButton.COMPOSE
    });
    
    escribirMsj.addEventListener('click',function(e){
        if(pmObj=="") pmObj = require('empresarial/post');
    var pm = pmObj.privateMessage({
        foto:false,
        idDestinatario:false,
        closeW:function(wind){
            params.closeW(wind);
            table.setData([]);
            loadMsjs();
        }
    });
    params.openW(pm);
    });
    
    var window = Ti.UI.createWindow({
     backgroundColor:'white',
     title: "Mensajes",
     rightNavButton:escribirMsj,
     barImage: "images/empresarial/BarraTitulo.png"
    });
    
    window.add(loadingView);
    

    var table = Ti.UI.createTableView({
        width:"100%",
        height:"100%"
    });
    
    table.addEventListener('click',function(e){
        
        //Ti.API.info(e.row);
        openMsj(e.row.id);
        
    });
    
    window.add(table);
    
    loadMsjs();
    
    
    
    function loadMsjs(){
        
        var url = "http://www.vielite.com/ws_mensajes.php?id="+params.id;
     
      //Ti.API.info("url MEnsajes "+url);
        
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
         
       Ti.API.info("Repsosne  MSjs "+this.responseText);
    fillTable(this.responseText);
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         loadingView.hide();
         alert("Error de conexión");
         Ti.API.debug(e.error);
         
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
        
    }
    
    function fillTable(info){
        var res = JSON.parse(info);
        
        if(res.conversaciones[0].alerta){
            loadingView.hide();
        }else{
        
        for(var i=0,j=res.conversaciones.length;i<j;i++){
            
            var row = Ti.UI.createTableViewRow({
                id:res.conversaciones[i].keyConversacion,
                height:54
            });
            //Ti.API.info(('http://www.vielite.com'+res.conversaciones[i].foto));
            var foto = Ti.UI.createImageView({
                image:('http://www.vielite.com/'+res.conversaciones[i].foto),
                height:50,
                width:50,
                hires:true,
                defaultImage:'images/fotodefault.jpg',
                top:2,
                left:2
            });
            var nombre = Ti.UI.createLabel({
                text:res.conversaciones[i].nombre,
                width:(decorator.screenWidth-56),
                height:24,
                top:2,
                left:54,
                color:"#005890",
                font:{fontFamily:'Source Sans Pro', fontSize:16,fontWeight:"bold"}
            });
            var ultMsj = Ti.UI.createLabel({
                text:res.conversaciones[i].ultimoMsg,
                width:(decorator.screenWidth-56),
                height:24,
                bottom:2,
                left:54,
                color:"black",
                font:{fontFamily:'Source Sans Pro', fontSize:13}
            });
            row.add(foto);
            row.add(nombre);
            row.add(ultMsj);
            
            table.appendRow(row);
        }
            loadingView.hide();
        }
        
    }
    
    function openMsj(id){
        if(msjDetail=="")msjDetail=require('mensajes/msjDetail');
        var md = new msjDetail({
            id:id
        });
        params.openW(md);
        
         
        
    }
    
    
    return window;
}

module.exports = mensajesTable;