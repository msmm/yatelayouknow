
function mencionesTable(res){
    
var decorator = require('utils/decorators');
var pagina=1;
var actual='2011-01-01 19:13:46';
var erased=0;
var detalleFoto="",detalleVideo="",detalleTexto="";
var anchoTabla=(decorator.screenWidth*res.width);

        /////// Funciones generales     /////
        


///  refrescar info de la tabla / Actualizarla      ////
function reloadViejasTable(a) {
    
    if(res.tipo=="mencion"){
        var url = "http://www.vielite.com/ws_pubs_mencionado.php?idUser="+decorator.idPerfil()+"&id="+res.id+"&pagina="+pagina;
    }else{
        var url = "http://www.vielite.com/ws_publicaciones_empresa.php?idUser="+decorator.idPerfil()+"&id="+res.id+"&pagina="+pagina;
    }
    Ti.API.info("URL PUBLS"+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       Ti.API.info("MENCIONES "+this.responseText);
       pagina++;
       if(a){
            mencionesTableView.addScrollRows(this.responseText,false);
       }else{
             mencionesTableView.addRows(this.responseText,false);
       }
     
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error("no menciones");
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
    }

function reloadNuevasTable() {
     if(res.tipo=="mencion"){
         var url = "http://www.vielite.com/ws_pubs_mencionado.php?idUser="+decorator.idPerfil()+"&id="+res.id+"&fecha="+actual;
     }else{
         var url = "http://www.vielite.com/ws_publicaciones_empresa.php?idUser="+decorator.idPerfil()+"&id="+res.id+"&fecha="+actual;
     }
    Ti.API.info("URL "+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       Ti.API.info("MENCIONES nvas "+this.responseText);
       mencionesTableView.addRows(this.responseText, true);
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


    // TableView data.
    var tableData = [];
   
   var spacio = Ti.UI.createView({
       backgroundColor:"white",
       height:20
   });
     // Create  TableView.
    var mencionesTableView = Ti.UI.createTableView({
        top:res.top,
        width: (decorator.screenWidth*res.width),
        separatorColor:"transparent",
        showVerticalScrollIndicator:false,
        headerView: spacio,
        height:(res.size=="compacto" ? Ti.UI.SIZE:(decorator.trueHeight-45)),
        scrollable : (res.muerta ? false : true)
    });
    

    

//////         agregar Row         //////

 mencionesTableView.addRows=function(data, nuevas) {
  
   var datos = JSON.parse(data);
   (res.tipo=='mencion' ? datos=datos.publicaciones_mencionado : datos=datos.publicaciones);
   
   if(datos[0].alerta){
       
       mencionesTableView.fireEvent('data:finishreloading');
   }else{
       if(!nuevas && pagina==2 && res.hide)res.hide();
        if(datos[0].fechaNatural>actual)actual=datos[0].fechaNatural;
   //Ti.API.info("actual "+actual);
   

 //Llenado de el arreglo
    for(var i=0,j=datos.length;i<j;i++ ){
    Ti.API.info("row publs "+JSON.stringify(datos[i]));
    //Row
    var row = Ti.UI.createTableViewRow({
    className:'mencionesRow', // used to improve table performance
    layout:"vertical",
    rowIndex:tableData.length, // custom property, useful for determining the row during events
    height:Ti.UI.SIZE,
    top:20,
    selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
    });
    
    //Views
    if(datos[i].tipo=='foto' || datos[i].tipo=='foto_ext'){
         //Ti.API.info("alto "+datos[i].alto_img+" ratio "+decorator.ratioAnchoaScreenWidth(anchoTabla,datos[i].ancho_img)+" total "+alto);
         var alto = 170;
         if(datos[i].alto_img!=null){
             var alto=(datos[i].alto_img*(decorator.ratioAnchoaScreenWidth(anchoTabla,datos[i].ancho_img)));
        }
    }
    
    var viewContent = Titanium.UI.createView({
   width:(decorator.screenWidth*res.width),
   height:(datos[i].tipo=='foto' ? alto : Ti.UI.SIZE),
   backgroundColor: '#f7f7f7',
   borderWidth:1,
   borderColor:"#e5e5e5",
   top:0,
    });
    var viewFooter = Titanium.UI.createView({
   width:Ti.UI.FILL,
   height:30,
   top:0,
   backgroundImage: (res.tipo=="mencion" ?'images/empresarial/plecaMencionMarca.png':'images/empresarial/plecaPublicacionMarca.png' )
    });
    
    
/// View Content
    switch(datos[i].tipo)
        {
        case 'estado':
          var label = Ti.UI.createLabel({
            color:'#404040',
            font:{fontFamily:'Source Sans Pro', fontSize:13},
            text:datos[i].contenido,
            left:10, top: 10, bottom:10,
           right:(datos[i].compartido=="" ? 10 : 60),
             height: Titanium.UI.SIZE
          });
          viewContent.add(label);
          break;
        case 'foto':
          var foto = Ti.UI.createImageView({
            image: (res.tipo=='mencion' ? datos[i].contenido : (decorator.sitio+datos[i].contenido)),
            hires:"true",
            height:alto,
            defaultImage:'images/fotodefault.png',
            width:anchoTabla
          });
        viewContent.add(foto);
        //viewContent.addEventListener('postlayout',reloadContent);
         
          break;
           case 'foto_ext':
          var foto = Ti.UI.createImageView({
            image: datos[i].contenido,
            hires:"true",
            defaultImage:'images/fotodefault.png',
            height:alto,
            width:anchoTabla
          });
        viewContent.add(foto);
       
        //viewContent.addEventListener('postlayout',reloadContent);
         
          break;
          case 'video':
         var video = Ti.UI.createImageView({
            image: datos[i].thumbnail,
            left:0,
            defaultImage:'images/fotodefault.png',
            width:anchoTabla,
          });
        var logoVideo = Ti.UI.createView({
            backgroundImage: "images/empresarial/video.png",
            width: 89,
            height:89,
            zIndex:1
        });
       // foto.addEventListener('postlayout',reload);
         viewContent.add(video);
         viewContent.add(logoVideo);
         viewContent.setHeight(220);
          break;
        case 'link':
           var label = Ti.UI.createLabel({
            color:'#404040',
            font:{fontFamily:'Source Sans Pro', fontSize:13},
            text:datos[i].contenido,
            left:10, top: 10, bottom:10,
           right:(datos[i].compartido=="" ? 10 : 60),
             height: Titanium.UI.SIZE
          });
          viewContent.add(label);
          break;
        }

if(datos[i].compartido && datos[i].compartido!=null){
       var shareFlag = Ti.UI.createView({
            backgroundImage: 'images/empresarial/indicadorCompartido.png',
            top:0,
            right:14,
            zIndex:1,
            height:60,
            width:38
          }); 
          viewContent.add(shareFlag);
    }
    
    row.add(viewContent);
/// view footer
     var labelFecha = Ti.UI.createLabel({
            color:'#fefefe',
            font:{fontFamily:'Source Sans Pro', fontSize:13},
            text:datos[i].fecha,
            left:6,
            width:Titanium.UI.SIZE, height: 20
          });
  viewFooter.add(labelFecha);
  
 //buttons
  var likeB =  decorator.likeButton({
      "totLikes":datos[i].totLikes,
      "right" : 5,
      "likeUser":datos[i].likeUser,
      "keyPublicacion":datos[i].keyPublicacion,
      "numCuenta": res.id,
      "tn" :12
  });
    viewFooter.add(likeB);
    row.add(viewFooter);

  
    datos[i].morf=likeB.morf;
    tableData.push(datos[i]);
  (nuevas ? mencionesTableView.insertRowBefore(i,row):mencionesTableView.appendRow(row));
    }
    mencionesTableView.setHeight(1);
    mencionesTableView.setHeight(Ti.UI.SIZE);
    
 if(nuevas){
     mencionesTableView.fireEvent('data:finishreloading');
 }else{
     mencionesTableView.fireEvent('data:finishreloadingOld');
 }

      mencionesTableView.len= (tableData.length-erased);
      
   }


}


//// aadd para el scrollView de home        /////
 mencionesTableView.addScrollRows=function(data, nuevas) {
  
   var datos = JSON.parse(data);
   (res.tipo=='mencion' ? datos=datos.publicaciones_mencionado : datos=datos.publicaciones);
   
   if(datos[0].alerta){
       
   }else{
       if(!nuevas && pagina==2 && res.hide)res.hide();
        if(datos[0].fechaNatural>actual)actual=datos[0].fechaNatural;
   ////Ti.API.info("actual "+actual);
   

 //Llenado de el arreglo
    for(var i=0,j=datos.length;i<j;i++ ){
    
    //Row
    var row = Ti.UI.createTableViewRow({
    className:'mencionesRow', // used to improve table performance
    layout:"vertical",
    rowIndex:tableData.length, // custom property, useful for determining the row during events
    height:Ti.UI.SIZE,
    top:20,
    selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
    });
    
    //Views
    if(datos[i].tipo=='foto'){
        
        var alto=(datos[i].alto_img*(decorator.ratioAnchoaScreenWidth(anchoTabla,datos[i].ancho_img)));
        ////Ti.API.info("alto "+datos[i].alto_img+" ratio "+decorator.ratioAnchoaScreenWidth(anchoTabla,datos[i].ancho_img)+" total "+alto);
        
    }
    
    var viewContent = Titanium.UI.createView({
   width:(decorator.screenWidth*res.width),
   height:(datos[i].tipo=='foto' ? alto : Ti.UI.SIZE),
   backgroundColor: '#f7f7f7',
   borderWidth:1,
   borderColor:"#e5e5e5",
   top:0,
    });
    var viewFooter = Titanium.UI.createView({
   width:Ti.UI.FILL,
   height:30,
   top:0,
   backgroundImage: (res.tipo=="mencion" ?'images/empresarial/plecaMencionMarca.png':'images/empresarial/plecaPublicacionMarca.png' )
    });
    
    
/// View Content
    switch(datos[i].tipo)
        {
        case 'estado':
          var label = Ti.UI.createLabel({
            color:'#404040',
            font:{fontFamily:'Source Sans Pro', fontSize:13},
            text:datos[i].contenido,
            left:10, top: 10, bottom:10,
           right:(datos[i].compartido=="" ? 10 : 60),
             height: Titanium.UI.SIZE
          });
          viewContent.add(label);
          break;
        case 'foto':
          var foto = Ti.UI.createImageView({
            image: (decorator.sitio+datos[i].contenido),
            hires:"true",
            height:alto,
            width:anchoTabla
          });
        viewContent.add(foto);
        //viewContent.addEventListener('postlayout',reloadContent);
         
          break;
          case 'video':
         var video = Ti.UI.createImageView({
            image: datos[i].thumbnail,
            left:0,
            width:anchoTabla,
          });
        var logoVideo = Ti.UI.createView({
            backgroundImage: "images/empresarial/video.png",
            width: 89,
            height:89,
            zIndex:1
        });
       // foto.addEventListener('postlayout',reload);
         viewContent.add(video);
         viewContent.add(logoVideo);
         viewContent.setHeight(220);
          break;
        case 'link':
           var label = Ti.UI.createLabel({
            color:'#404040',
            font:{fontFamily:'Source Sans Pro', fontSize:13},
            text:datos[i].contenido,
            left:10, top: 10, bottom:10,
           right:(datos[i].compartido=="" ? 10 : 60),
             height: Titanium.UI.SIZE
          });
          viewContent.add(label);
          break;
        }

if(datos[i].compartido && datos[i].compartido!=null){
       var shareFlag = Ti.UI.createView({
            backgroundImage: 'images/empresarial/indicadorCompartido.png',
            top:0,
            right:14,
            zIndex:1,
            height:60,
            width:38
          }); 
          viewContent.add(shareFlag);
    }
    
    row.add(viewContent);
/// view footer
     var labelFecha = Ti.UI.createLabel({
            color:'#fefefe',
            font:{fontFamily:'Source Sans Pro', fontSize:13},
            text:datos[i].fecha,
            left:6,
            width:Titanium.UI.SIZE, height: 20
          });
  viewFooter.add(labelFecha);
  
 //buttons
  var likeB =  decorator.likeButton({
      "totLikes":datos[i].totLikes,
      "right" : 5,
      "likeUser":datos[i].likeUser,
      "keyPublicacion":datos[i].keyPublicacion,
      "numCuenta": res.id,
      "tn" :12
  });
    viewFooter.add(likeB);
    row.add(viewFooter);

  
    datos[i].morf=likeB.morf;
    tableData.push(datos[i]);
  (nuevas ? mencionesTableView.insertRowBefore(i,row):mencionesTableView.appendRow(row));
    }
    mencionesTableView.setHeight(1);
    mencionesTableView.setHeight(Ti.UI.SIZE);
    
 if(nuevas){
 }else{
 }

      mencionesTableView.len= (tableData.length-erased);
      
   }


}

///     Delete row      ///
function deletePubl(id,index,close,indexRow){
    
    var url = "http://www.vielite.com/ws_eliminar.php?idUser="+res.id+"&id="+id;
     
    Ti.API.info("URL delete"+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
      Ti.API.info("DELETE "+this.responseText);
       var result=JSON.parse(this.responseText);
       
       if(result.eliminar[0].exitoso==1){
        mencionesTableView.deleteRow(index);
        erased++;
        mencionesTableView.len= (tableData.length-erased);
       close();
       }else{
         alert(result.eliminar[0].alerta);  
       }
       
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


  ///       Pull y Push     ////
    decorator.pullPush(mencionesTableView,reloadNuevasTable,reloadViejasTable);


//// LISTENER       ///
   mencionesTableView.addEventListener('click',function(e){
      ////Ti.API.info("click event"+JSON.stringify(e));
       ////Ti.API.info(JSON.stringify(tableData[e.row.rowIndex]));
       
       if(e.source.action=='vlike'){
       
       }else{
           
         var url = "http://www.vielite.com/ws_publicacion_detalle.php?idUser="+res.id+"&id="+tableData[e.row.rowIndex].keyPublicacion;
         ////Ti.API.info("URL "+url);
          var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(http) {
       ////Ti.API.info("Detalle Publ "+this.responseText);
       var args=JSON.parse(this.responseText);
       args=args.publicacion[0];
       args.index=e.index;
       args.rowIndex=e.row.rowIndex;
       args.delete=deletePubl;
       
       args.morfFather=function(){
           tableData[e.row.rowIndex].morf();
           };
           
       args.openW = function(wndw){
         res.tabGroup.activeTab.open(wndw);  
       };
           
          if(tableData[e.row.rowIndex].tipo=='estado'){
          var detalleObj = require('empresarial/detalleComment');
           var detalle = new detalleObj(args);
           res.tabGroup.activeTab.open(detalle);  
       }else if(tableData[e.row.rowIndex].tipo=='foto' || tableData[e.row.rowIndex].tipo=='foto_ext'){
           var detalleObj = require('empresarial/detalleFoto');
           var detalle = new detalleObj(args);
           res.tabGroup.activeTab.open(detalle);
       }else if(tableData[e.row.rowIndex].tipo=='video'){
           var detalleObj = require('empresarial/detalleVideo');
           var detalle = new detalleObj(args);
           res.tabGroup.activeTab.open(detalle);
           
       }else if(tableData[e.row.rowIndex].tipo=='link'){
          var detalleObj = require('empresarial/detalleComment');
           var detalle = new detalleObj(args);
           res.tabGroup.activeTab.open(detalle);  
       }
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
   });
   
   
   reloadViejasTable();
   mencionesTableView.reloadOld=reloadViejasTable;
    return mencionesTableView;
    
    
}



 
module.exports = mencionesTable;