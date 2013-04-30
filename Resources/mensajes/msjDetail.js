
function mensajeDetail(params){
    
    var decorator = require("utils/decorators");
    var loadingView = decorator.loadingIndicator();
    var involved="";
    var index=-1;

    var window = Ti.UI.createWindow({
     backgroundColor:'white',
     title: params.title,
     barImage: "images/empresarial/BarraTitulo.png"
    });
    
    window.add(loadingView);
    

    var table = Ti.UI.createTableView({
        top:0,
        width:"100%",
        height:(decorator.trueHeight-34)
    });

    
    window.add(table);
    
    loadMsjs();
    
    
    
    function loadMsjs(){
        
       var url = "http://www.vielite.com/ws_mensaje_detalle.php?id="+params.id;
     
      //Ti.API.info("url detail Msj "+url);
        
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
         //Ti.API.info("Detalle  MSJ "+this.responseText);
         fillTable(this.responseText,false);
       
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
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
    
    function fillTable(info,respuesta){
        var res = JSON.parse(info);
        
        if(respuesta){
            res.mensajes=res.msg;
        }else{
           involved = res.involved[0].ids;
        //Ti.API.info("involved "+involved); 
        }
        
        if(res.alerta){
            loadingView.hide();
        }else{
        for(var i=0,j=res.mensajes.length;i<j;i++){
            
            var row = Ti.UI.createTableViewRow({
                height:Ti.UI.SIZE,
                selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
            });
            var foto = Ti.UI.createImageView({
                image:('http://www.vielite.com/'+res.mensajes[i].foto),
                height:50,
                width:50,
                hires:true,
                top:2,
                left:2
            });
            var nombre = Ti.UI.createLabel({
                text:res.mensajes[i].fullname,
                width:Ti.UI.FILL,
                height:16,
                textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                top:1,
                color:"#005890",
                font:{fontFamily:'Source Sans Pro', fontSize:16,fontWeight:"bold"}
            });
            var msj = Ti.UI.createLabel({
                text:res.mensajes[i].textoMensaje,
                width:Ti.UI.FILL,
                textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                height:Ti.UI.SIZE,
                top:2,
                color:"black",
                font:{fontFamily:'Source Sans Pro', fontSize:13}
            });
            var fecha = Ti.UI.createLabel({
                text:res.mensajes[i].fechaMensaje,
                width:Ti.UI.FILL,
                height:14,
                textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                top:2,
                color:"black",
                font:{fontFamily:'Source Sans Pro', fontSize:12}
            });
            var viewContenedor = Ti.UI.createView({
                layout:'vertical',
                height:Ti.UI.SIZE,
                top:2,
                left:56,
                width:(decorator.screenWidth-56)
            });
            row.add(foto);
            viewContenedor.add(nombre);
            viewContenedor.add(msj);
            viewContenedor.add(fecha);
            row.add(viewContenedor);
            
            table.appendRow(row);
            index++;
        }
            loadingView.hide();
            if(respuesta)table.scrollToIndex(index);
        }
        
    }
    
    var mainView = Ti.UI.createView({
      width: Ti.UI.FILL,
      backgroundColor: "#ebebeb",
      height: 38,
      bottom:0,
      zIndex:5
  });
  
  var realTextField = Ti.UI.createTextField({
  color: 'black',
  backgroundColor: "#d8d8d8",
  borderWidth:1,
  borderColor:"#005890",
  borderRadius: 2,
  paddingLeft:7,
  width: 300, height: 30
    });
    
    realTextField.addEventListener('blur',function(){
        textField.setValue(realTextField.getValue());
        realTextField.setValue('');
    });
  
  var textField = Ti.UI.createTextField({
  color: 'black',
  backgroundColor: "#d8d8d8",
  borderWidth:1,
  borderColor:"#005890",
  borderRadius: 2,
  top: 4, left: 4,
  keyboardToolbar:[realTextField],
  paddingLeft:7,
  width: 225, height: 30
    });
    
     textField.addEventListener('focus',function(e){
        // setTimeout(function(){
            // mainView.bottom=216;
            realTextField.focus();
   //      },100);
     });
    // textField.addEventListener('blur',function(e){
        // setTimeout(function(){
            // mainView.bottom=0;
        // },75);
    // });
  var button = Titanium.UI.createButton({
   title: 'Enviar',
   borderRadius:2,
   backgroundImage: 'images/login/btn1.png',
   right:3,
   font:{fontFamily: 'Source Sans Pro', fontSize:13},
   top: 4,
   width: 82,
   height: 30
    });
    
    button.addEventListener('click',function(e){
        if(textField.value!="" && textField.value!=" "){
         button.touchEnabled=false;
         setTimeout(function(){button.touchEnabled=true;},2000);
         
        var url = "http://www.vielite.com/ws_mensaje_reply.php?sender="+decorator.idPerfil()+"&keyConv="+params.id+"&txt="+textField.value;
     //Ti.API.info("responder msj: "+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("Comentar "+this.responseText);
       fillTable(this.responseText,true);
    textField.value="";
    mainView.bottom=0;
    textField.blur();
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
         alert("Error de conexión.");
     },
     timeout : 10000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
        }
    });
    
    
    mainView.add(textField);
    mainView.add(button);
    window.add(mainView);
    
    return window;
}

module.exports = mensajeDetail;