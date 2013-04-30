
function beneficiosTable(res){
    
var decorator = require('utils/decorators');
var pagina=1;



        /////// Funciones generales     /////
        
 /// Refrescar tamaño de la imagen      ////
function reload(e){
    e.source.removeEventListener('postlayout',reload);
    var h = e.source.toImage().height;
    var w = 600;
    var proporcion=decorator.screenWidth;
    proporcion=(proporcion*res.width);
    var ratio=(proporcion/w);
    e.source.height=(h*ratio);
    e.source.width=(w*ratio);
    e.source.updateLayout();
    e.source.viewContent.updateLayout({height:(h*ratio)});
    e.source.rowPapa.updateLayout({height:(h*ratio)});
    Titanium.API.info(JSON.stringify(e.source.viewContent));
    Titanium.API.info('w '+w+' proporcion '+proporcion+' ratio '+ratio+' nvo height '+(h* ratio));
}

///  WS que trae la //Ti.API.info    ///
function reloadTable() {
    
    if(res.tipo=="beneficios"){
        var url = "http://www.vielite.com/ws_beneficios.php?id="+res.id+"&pagina="+pagina;
    }else{
        var url = "http://www.vielite.com/ws_productos.php?id="+res.id+"&pagina="+pagina;
    }
  //  //Ti.API.info("URL Beneficios"+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("Productos/beneficios "+this.responseText);
       pagina++;
       beneficiosTableView.addRows(this.responseText);
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
    var beneficiosTableView = Ti.UI.createTableView({
        top:0,
        width: (decorator.screenWidth*res.width),      
        separatorColor:"transparent",
        showVerticalScrollIndicator:false,
        height: (res.size=="compacto" ? Ti.UI.SIZE:Ti.UI.FILL)
    });
    
   if(res.size!="compacto")beneficiosTableView.setHeaderView(spacio);
    

//////         agregar Row         //////

 beneficiosTableView.addRows=function(data) {
  //  //Ti.API.info("beneficios/producto "+data);
   var datos = JSON.parse(data);
  
   (res.tipo=='beneficios' ? datos=datos.beneficios : datos=datos.productos);
   if(datos[0].alerta){
       if(pagina==2)res.show();
       beneficiosTableView.fireEvent('data:finishreloadingOld');
   }else{

 //Llenado de el arreglo
    for(var i=0,j=datos.length;i<j;i++ ){
    
    //Row
    var row = Ti.UI.createTableViewRow({
    className:'beneficiosRow', // used to improve table performance
    layout:"vertical",
    rowIndex:tableData.length, // custom property, useful for determining the row during events
    height:Ti.UI.SIZE,
    top:20,
    selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
    });
    
    //Views

    var viewContent = Titanium.UI.createView({
   width:Ti.UI.FILL,
   height:175,
   backgroundColor: '#f7f7f7',
   top:0,
    });
    var viewFooter = Titanium.UI.createView({
   width:Ti.UI.FILL,
   height:30,
   top:0,
   backgroundImage: 'images/empresarial/plecaProductosBeneficios.png'
    });
    
    
/// View Content

 var logo = Ti.UI.createImageView({
    backgroundImage: (res.tipo=="beneficios" ? 'images/empresarial/indicadorBeneficio.png': 'images/empresarial/indicadorProductos.png'),
            top:0,
            right:14,
            zIndex:1,
            height:60,
            width:38
  });
  viewContent.add(logo);
    var imgUrl=res.tipo=="beneficios" ? datos[i].fotoBeneficio : datos[i].foto ;
  //  //Ti.API.info("PRODUCTO/BENEFICIO "+imgUrl);
   var foto = Ti.UI.createImageView({
        image: (decorator.sitio+imgUrl),
        width:Ti.UI.FILL,
   });

   // foto.addEventListener('postlayout',reload);
   viewContent.add(foto);
    
    row.add(viewContent);
/// view footer
     var labelFecha = Ti.UI.createLabel({
            color:'white',
            font:{fontFamily:'Source Sans Pro', fontSize:13},
            text:datos[i].fecha,
            left:6,
            width:Titanium.UI.SIZE, height: 20
          });
  viewFooter.add(labelFecha);
  
 //buttons
  var likeB =  decorator.likeButton({
      "totLikes":datos[i].totLikes,
      "likeUser":datos[i].likeUser,
      "keyPublicacion":(res.tipo=="beneficios" ? datos[i].keyBeneficio : datos[i].keyProducto),
      "numCuenta": datos[i].idEmpresarial,
      "tn" :12,
      "right" : 5
  });
    viewFooter.add(likeB);
    row.add(viewFooter);

  
    datos[i].morf=likeB.morf;
    tableData.push(datos[i]);
  beneficiosTableView.appendRow(row);
    }
    
 
beneficiosTableView.fireEvent('data:finishreloadingOld');
       beneficiosTableView.len= tableData.length;
   }


}
    

   
   beneficiosTableView.addEventListener('click',function(e){
      // //Ti.API.info(JSON.stringify(e));
       //Ti.API.info(JSON.stringify(tableData[e.row.rowIndex]));
       
       if(e.source.action=='vlike'){
       
       }else{
           
         var url = res.tipo=="beneficios" ? "http://www.vielite.com/ws_beneficio_detalle.php?idUser="+decorator.idPerfil()+"&id="+tableData[e.row.rowIndex].keyBeneficio : "http://www.vielite.com/ws_producto_detalle.php?idUser="+decorator.idPerfil()+"&id="+tableData[e.row.rowIndex].keyProducto;
       //  //Ti.API.info("URL "+url);
          var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(http) {
       //Ti.API.info("Detalle PRODUCT/BENEFICIO "+this.responseText);
       var args=JSON.parse(this.responseText);
       args=(res.tipo=="beneficios" ? args.beneficio[0] : args.productos[0]);
        args.tipo=res.tipo;
        args.morfFather=function(){
           tableData[e.row.rowIndex].morf();
           };
           var detalleObj = require('empresarial/detalleBeneficio');
           var detalle = new detalleObj(args);
           res.tabGroup.activeTab.open(detalle);
       
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
   
   function fakeLoad(){
       beneficiosTableView.fireEvent('data:finishreloading');
   }
   
       decorator.pullPush(beneficiosTableView,fakeLoad,reloadTable);

   if(res.reload=="yes") reloadTable();
    return beneficiosTableView;
    
    
}



 
module.exports = beneficiosTable;