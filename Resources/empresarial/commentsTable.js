
function commentsTable(settings){
    
    var decorator = require('utils/decorators');
    var alto =Ti.UI.SIZE;
    // Create a TableView.
    var commentsTable = Ti.UI.createTableView({
        backgroundColor:"white",
        top:settings.top,
       height:300,
      separatorColor:"transparent",
      width:(decorator.screenWidth*settings.width)
    });
    
    // Populate the TableView data.
    var data = [];
 
 
 // Recargar la tabla   ///
  commentsTable.recharge = function(res){
    
     // data=[];
     // commentsTable.setData(data);
     // reload();
     commentsTable.addRows(res);
     
 };
 
 ///refrescar la tabla      ////
 function reload() {
    
    var url = "http://www.vielite.com/ws_publicacion_detalle_comments.php?id="+settings.id;
    
    //Ti.API.info("URL comments "+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("Comments "+this.responseText);
       commentsTable.addRows(this.responseText);
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
    }
 
 
 /// add rows a la tableview    ///
 commentsTable.addRows =  function(res){
    
    var comments=JSON.parse(res); 
    comments=comments.comentarios;
    if(comments[0].alerta){
        commentsTable.setHeight(1);
    }else{
    	
    	var rows = [];
      
      for(var i=0,j=comments.length;i<j;i++){
        
        var row = Ti.UI.createTableViewRow({
    className:'comments', // used to improve table performance
    rowIndex:data.length, // custom property, useful for determining the row during events
    height:Ti.UI.SIZE,
    width:(decorator.screenWidth*settings.width),
    selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
    layout: 'vertical',
    top:20
  });


///     Top     ////

    var topView = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
    });

     var fotoPerfil = Ti.UI.createImageView({
        width : 35,
        height : 35,
        borderWidth:1,
        borderColor: "#999999",
        left: 0,
        top:0,
        image : (decorator.sitio+comments[i].foto),
    });
    var nombre =  Ti.UI.createLabel({
        width : (decorator.screenWidth*0.7),
        height : 16,
        left: 44,
        top:0,
        text : comments[i].fullname,
        font: { fontSize:13 ,fontFamily: 'Source Sans Pro', fontWeight:"bold"},
        color: '#005890'
    });
    var content =  Ti.UI.createLabel({
        width : ((decorator.screenWidth*settings.width)-50),
        height : Ti.UI.SIZE,
        color:"#404040",
        left: 44,
        top:19,
        text : comments[i].texto,
        font: { fontSize:13 ,fontFamily: 'Source Sans Pro'}
    });
    
    if(comments[i].idUser==decorator.idPerfil()){
    var deleteButton = Ti.UI.createButton({
        width : 17,
        height : 17,
        image : 'images/empresarial/ico_den-eliPublicacion.png',
        right : 4,
        top: 0,
    style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
    action : 'delete'
    });
    }
///     Bottom      ///
    var botView = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: 24,
        top:10
    });
     var fecha = Ti.UI.createLabel({
        width : (decorator.screenWidth/2),
        height: 15,
        font: { fontSize:12 ,fontFamily: 'Source Sans Pro'},
        left : 44,
        color: '#929292',
        text : ("Publicado "+comments[i].fecha)
    });
    var likeB =  decorator.likeButton({
      "totLikes":comments[i].totLikes,
      "likeUser":comments[i].likeUser,
      "keyPublicacion":comments[i].keyComentario,
      "numCuenta": comments[i].idUser,
      "tn" :13
  });
    

    topView.add(nombre);
    topView.add(fotoPerfil);
    topView.add(content);
    if(comments[i].idUser==decorator.idPerfil())topView.add(deleteButton);
    botView.add(fecha);
    botView.add(likeB);
    row.add(topView);
    row.add(botView);
    data.push(comments[i]);
    rows.push(row);
    //commentsTable.appendRow(row);
    
    }
    commentsTable.appendRow(rows);
      if(settings.fullScreen){
          commentsTable.height=(decorator.trueHeight-38);
      }
      else{
        //  commentsTable.setHeight(1);
          setTimeout(function(){
            commentsTable.height=Ti.UI.SIZE;
        }, 800);
          
      }
    }
    
    };
        
    // Listen for click events.
    commentsTable.addEventListener('click', function(e) {
        //Ti.API.info('Comment '+ JSON.stringify(e));
      //   //Ti.API.info('DATA Comment '+ JSON.stringify(data[e.row.rowIndex]));
       //Ti.API.info('DATA Comment '+ data[e.row.rowIndex].texto);
        if(e.source.action=="delete"){
             if(data[e.row.rowIndex].idUser==decorator.idPerfil()){
                 deleteComment(data[e.row.rowIndex].keyComentario, e.index);
             }
             
        }
    });
   
 ///  DELETE COMMENT        ///
    function deleteComment(id, index){
        //Ti.API.info("erasing comm "+id+" inddex "+index);
        
        var url = "http://www.vielite.com/ws_eliminar_comentario.php?idUser="+decorator.idPerfil()+"&id="+id;
    
    //Ti.API.info("URL comments "+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("DELETE Comments "+this.responseText);
       var response=JSON.parse(this.responseText);
       
       if(response.eliminarComentario[0].exitoso==1){
           if(settings.refresh)settings.refresh();
           commentsTable.deleteRow(index);
       }else{
           alert("Error de conexión");
       }    
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         alert("Error de conexión");
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
 
    }
    
    reload();
    return commentsTable;
}


module.exports = commentsTable;