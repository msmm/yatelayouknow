
function todoTabla(params){
    
    var decorator = require("utils/decorators");
    var socialWindowObj=require('social/socialWindow');
    var peObject = "";
 //   var advImgObj = require('home/advFotos');
    var detalleFotoObj="",detalleVideoObj="",detalleProdObj="",detalleComObj="";
    var anchoTabla=params.url ? params.anchoTabla : (decorator.screenWidth*0.96);
    var pagina =1;
    var actual='2011-01-01 19:13:46';
    var fechaAncla=decorator.getEncodedDate();
    var tableLength=0;
  var imagenes = [];
 var niveles = [];
    
   
   var spacio = Ti.UI.createView({
       backgroundColor:"white",
       height:20
   });
     // Create  TableView.
    var todoTableView = Ti.UI.createTableView({
        top:0,
        width: anchoTabla,
        separatorColor:"transparent",
        showVerticalScrollIndicator:false,
        headerView: spacio,
        backgroundColor:'transparent',
        height:Ti.UI.FILL
    });
    
    
    
    ///  refrescar info de la tabla / Actualizarla      ////
function reloadViejasTable() {
     var url="";
        if(params.url){
        url = params.url+"&pagina="+pagina;
        }else{
          url = "http://www.vielite.com/ws_feed_home.php?id="+params.idPerfil+"&pagina="+pagina+"&fechaInicio="+fechaAncla;
    }
    Ti.API.info("URL Home TODO"+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       Ti.API.info("Todo feed "+this.responseText);
       pagina++;
       addRows(this.responseText,false);
     
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
     },
     timeout : 15000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
    }
    
    function reloadTable() {
    
        var url = "http://www.vielite.com/ws_feed_home.php?id="+params.idPerfil+"&fecha="+actual;
    
    Ti.API.info("URL Home TODO"+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       Ti.API.info("Todo feed "+this.responseText);
       addRows(this.responseText,true);
     
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         alert("Error de conexión.");
         Ti.API.error(e.error);
     },
     timeout : 15000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
    }
    
    

 /////  Erase imageViews images ////
 
 function emptyImages(index){
     for(n  in imagenes){
       
       if(index!=n){
           
        for(x in imagenes[n]){
            if(imagenes[n][x].image == 'images/bck.png')break;
         imagenes[n][x].image = 'images/bck.png';
                            }
                                
        }else{
            
         for(x in imagenes[n]){
         imagenes[n][x].image = imagenes[n][x].imagenReal;
                            }   
             }
        
     }
     
 }
    
 ////       Agregar publicaciones      ///
    function addRows(res,nuevas){
     //   emptyImages();
        var data = JSON.parse(res);
        
        if(data.publicaciones[0].alerta){
            todoTableView.fireEvent('data:finishreloading');
            if(params.url && pagina==2){
            params.stopLoading();
            params.noResults();
            }
        }else{
          //   Ti.API.info('data.publicaciones.length '+data.publicaciones.length);
             var grupoImagenes = [];
             
           for(var i=0;i<data.publicaciones.length;i++){
        var datos = data.publicaciones[i];
      
        if(datos.fechaNatural>actual)actual=datos.fechaNatural;
        
    
 
    //Views
    var alto=false;
    if(datos.tipo=='foto' || datos.tipo=='foto_ext'){
        
        var row = Ti.UI.createTableViewRow({
    layout:"vertical",
    height:Ti.UI.SIZE,
    top:20,
    className:'todoTableImage',
    selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
    keyPublicacion: datos.keyPublicacion
    });
        
        if(datos.ancho_img!=null){
           var ratio = (anchoTabla/datos.ancho_img);
    alto=(datos.alto_img*ratio);
   if(alto>680)alto=680; 
            
        }else{
            alto=150;
        }
        
        // var viewContent = Titanium.UI.createView({
   // width:anchoTabla,
   // height:(alto>anchoTabla) ? anchoTabla : alto,
   // backgroundColor: '#f7f7f7',
   // borderWidth:1,
   // borderColor:"#e5e5e5",
   // top:0,
   // touchEnabled:false
    // });
    }else{
        
        
        var row = Ti.UI.createTableViewRow({
    layout:"vertical",
    height:Ti.UI.SIZE,
    top:20,
    className:'todoTable',
    selectionStyle:Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
    keyPublicacion: datos.keyPublicacion
    });
        
        var viewContent = Titanium.UI.createView({
   width:anchoTabla,
   height:Ti.UI.SIZE,
   backgroundColor: '#f7f7f7',
   borderWidth:1,
   borderColor:"#e5e5e5",
   top:0,
   touchEnabled:false
    });
        
    }
    
    
    
    
    var viewFooter = Titanium.UI.createView({
   width:Ti.UI.FILL,
   height:30,
   top:0,
   backgroundImage: getPleca(datos.color)
    });
    
    
// /// View Content
    switch(datos.tipo)
        {

        case 'foto':
        var urlImg = decorator.removeAllSpaces(decorator.sitio+datos.contenido);
          var viewContent = Ti.UI.createImageView({
            image:urlImg ,
            hires:true,
            height: alto,
            defaultImage:'images/fotodefault.png',
            width:anchoTabla,
            imagenReal:urlImg,
            touchEnabled:false
          });
     grupoImagenes.push(viewContent);
    // row.add(foto);
       // viewContent.add(foto);
        row.action='foto';
         
          break;
        
          case 'foto_ext':
          
            var urlImg = decorator.removeAllSpaces(datos.contenido);
          
          var viewContent = Ti.UI.createImageView({
            image: urlImg,
            imagenReal:urlImg,
            hires:true,
            height:alto,
            defaultImage:'images/fotodefault.png',
            width:anchoTabla,
            touchEnabled:false
          });
          grupoImagenes.push(viewContent);
        //viewContent.add(foto);
        row.action='foto';
        //viewContent.addEventListener('postlayout',reloadContent);
        //  row.add(foto);
          break;
          case 'video':
          
        Ti.API.info("datos.thumbnail "+datos.thumbnail);
         var video = Ti.UI.createImageView({
            image: datos.thumbnail,
            hires:"true",
            defaultImage:'images/fotodefault.png',
            width:anchoTabla,
            touchEnabled:false
          });
          row.action='video';
        var logoVideo = Ti.UI.createView({
            backgroundImage: "images/empresarial/video.png",
            width: 89,
            height:89,
            zIndex:1,
            touchEnabled:false
        });
       // foto.addEventListener('postlayout',reload);
         viewContent.add(video);
         viewContent.add(logoVideo);
         viewContent.setHeight(220);
         // row.add(video);
          break;
          
          case 'vielitestore':
          viewContent.setHeight(175);
          var logo = Ti.UI.createImageView({
    backgroundImage: 'images/empresarial/indicadorProductos.png',
            top:0,
            right:14,
            zIndex:1,
            height:60,
            width:38,
            touchEnabled:false
            
  });
  viewContent.add(logo);
    
  //  //Ti.API.info("PRODUCTO/BENEFICIO "+imgUrl);
   var foto = Ti.UI.createImageView({
        image: (decorator.sitio+datos.contenido),
        width:Ti.UI.FILL,
        touchEnabled:false
   });
   
   row.action='store';

   viewContent.add(foto);
   
          break;
         case 'estado':
          var label = Ti.UI.createLabel({
            color:'#404040',
            font:{fontFamily:'Source Sans Pro', fontSize:13},
            text:datos.contenido,
            left:10, top: 10, bottom:10,
           right:(datos.compartido==null ? 10 : 60),
             height: Titanium.UI.SIZE,
             touchEnabled:false
          });
          viewContent.add(label);
          row.action='estado';
          break;
          case 'link':
          var label = Ti.UI.createLabel({
            color:'#404040',
            font:{fontFamily:'Source Sans Pro', fontSize:13},
            text:datos.contenido,
            left:10, top: 10, bottom:10,
           right:(datos.compartido==null ? 10 : 60),
             height: Titanium.UI.SIZE,
             touchEnabled:false
          });
          viewContent.add(label);
          row.action='link';
          break;
          
         }


    
    row.add(viewContent);
//     

//     
// ////////////////////////////////
// /////   USEr Section          /////

var userView = Ti.UI.createView({
    width:anchoTabla,
    height:50,
    backgroundColor:"#ebebeb",
    touchEnabled:true,
    action:datos.tipoUserPropietario,
    idCuenta:datos.numCuentaPropietario
});

var dp = Ti.UI.createImageView({
    height:40,
    width:40,
    left:4,
    defaultImage:'images/fotodefault.jpg',
    hires:true,
    image: (decorator.sitio+datos.foto_propietario),
    touchEnabled:false
});

var nombre = Ti.UI.createLabel({
    width:(anchoTabla-94),
    height:15,
    top: 10,
    left:47,
    text: datos.nombrePropietario ,
    color:"#005890",
    font:{fontFamily: 'Source Sans Pro', fontSize:13, fontWeight:"bold"},
    touchEnabled:false
});

var username = Ti.UI.createLabel({
    width:(anchoTabla-94),
    height:15,
    top: 25,
    left:47,
    text: datos.usernamePropietario,
    font:{fontFamily: 'Source Sans Pro', fontSize:13},
    touchEnabled:false
});

userView.add(dp);
userView.add(nombre);
userView.add(username);

if(datos.compartido && datos.compartido!=null){
        var shareFlag = Ti.UI.createView({
            backgroundImage: 'images/iconoCompartir.png',
           // top:0,
            right:10,
            zIndex:2,
            height:29,
            width:32
           }); 
           userView.add(shareFlag);
    }
    
row.add(userView);
// 
// 

// ////////////////////////////////
// /// Texto Descripcion Section  /////

if(datos.desc!=""){

var descripcionView = Ti.UI.createView({
    width:anchoTabla,
    height:Ti.UI.SIZE,
    backgroundColor:"white",
    borderWidth:1,
   borderColor:"#e5e5e5",
    touchEnabled:false
});

var descripcion = Ti.UI.createLabel({
    top: 10,
    color:"#404040",
    left:10,
    right:10,
    text: (""+datos.desc+" \n "),
    font:{fontFamily: 'Source Sans Pro', fontSize:13},
    touchEnabled:false
});
descripcionView.add(descripcion);
  row.add(descripcionView);  
    }
//     
// /// view footer
     var labelFecha = Ti.UI.createLabel({
            color:'#fefefe',
            font:{fontFamily:'Source Sans Pro', fontSize:13},
            text:datos.fecha,
            left:6,
            width:Titanium.UI.SIZE, height: 20,
            touchEnabled:false
          });
  viewFooter.add(labelFecha);
  
 //buttons
  var likeB =  decorator.likeButton({
      "totLikes":datos.totLikes,
      "right" : 5,
      "likeUser":datos.likeUser,
      "keyPublicacion":datos.keyPublicacion,
      "numCuenta": datos.numCuentaPropietario,
      "tn" :12
  });
     viewFooter.add(likeB);
    row.add(viewFooter);
// 
//   
    row.morf=likeB.morf;
        nuevas ? todoTableView.insertRowBefore(0,row) :  todoTableView.appendRow(row);
        tableLength++;
         
        
     
        }
       
        }
        
        
        if(nuevas){
     
     todoTableView.fireEvent('data:finishreloading');
     }else{
         if(pagina==2)params.stopLoading();
         todoTableView.fireEvent('data:finishreloadingOld');
         imagenes[imagenes.length] = grupoImagenes;
     }
     todoTableView.len=tableLength;
 
    }
    
    
    
    
    ///     Delete row      ///
function deletePubl(id,index,close,indexRow){
    
    var url = "http://www.vielite.com/ws_eliminar.php?idUser="+params.idPerfil+"&id="+id;
     
    ////Ti.API.info("URL delete"+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       ////Ti.API.info("DELETE "+this.responseText);
       var result=JSON.parse(this.responseText);
       
       if(result.eliminar[0].exitoso==1){
        todoTableView.deleteRow(index);
        tableLength--;
        todoTableView.len= (tableLength);
       close();
       }else{
         alert(result.eliminar[0].alerta);  
       }
       
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         alert("Error de conexión.");
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
    
}


    
    
    
    //// LISTENER       ///
   todoTableView.addEventListener('click',function(e){
      Ti.API.info("click event"+JSON.stringify(e));
      
       ////Ti.API.info(JSON.stringify(tableData[e.row.rowIndex]));
       todoTableView.touchEnabled = false;
       setTimeout(function(){ todoTableView.touchEnabled = true},3000);
       if(e.source.action=='vlike'){
       todoTableView.touchEnabled = true;
       }else if(e.source.action=='normalUser' || e.source.action=='guest'){
           
           var socialHome=new socialWindowObj({
         id:e.source.idCuenta,
         stopLoading:function(){},
         openW:params.openW,
         closeW:params.closeW
         });
           params.openW(socialHome);
       }else if(e.source.action=='empresarial'){
           
           var url = "http://www.vielite.com/ws_perfil_empresa_home.php?id="+e.source.idCuenta;
 var client = Ti.Network.createHTTPClient({
     onload : function(e) {
       //Ti.API.info("perfil empresa "+this.responseText);
       if(peObject=="") peObject = require('controllers/perfilEmpresarial');
        var pe = new peObject.mainWindow(this.responseText);
        pe.open({transition: Titanium.UI.iPhone && Titanium.UI.iPhone.AnimationStyle.CURL_DOWN});
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         alert("Error de conexión.")
     },
     timeout : 10000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
           
       }else{
           if(e.source.keyPublicacion){
              
              var url="";
            switch(e.source.action){
             case 'store':
             url="http://www.vielite.com/ws_producto_detalle.php?idUser="+params.idPerfil+"&id="+e.source.keyPublicacion;
             break;
             case 'beneficio':
               url="http://www.vielite.com/ws_beneficio_detalle.php?idUser="+params.idPerfil+"&id="+e.source.keyPublicacion;
             break;
             
             default:
             url = "http://www.vielite.com/ws_publicacion_detalle.php?idUser="+params.idPerfil+"&id="+e.source.keyPublicacion;
             break;  
                
            }
         //Ti.API.info("URL "+url);
          var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(http) {
       //Ti.API.info("Detalle Publ "+this.responseText);
       var args=JSON.parse(this.responseText);
        
  
         if(e.source.action=='foto'){
           
   //////////   FOOOTOOOOO      /////////
           args=args.publicacion[0];
        args.morfFather=function(){
            e.source.morf();
            };
            
        args.openW = function(wndw){
          params.openW(wndw);  
        };
         args.index=e.index;
         args.rowIndex=e.index;
       args.delete=deletePubl;
           if(detalleFotoObj=="")detalleFotoObj = require('empresarial/detalleFoto');
           var detalle = new detalleFotoObj(args);
            params.openW(detalle);
           
        }else if(e.source.action=='video'){
    
    //////////   VIIIDEEOOOO      /////////
            args=args.publicacion[0];
        args.morfFather=function(){
            e.source.morf();
            };
            
        args.openW = function(wndw){
          params.openW(wndw);  
        };
         args.index=e.index;
         args.rowIndex=e.index;
       args.delete=deletePubl;
           if(detalleVideoObj=="") detalleVideoObj= require('empresarial/detalleVideo');
           var detalle = new detalleVideoObj(args);
            params.openW(detalle);
        }else if(e.source.action=='store'){
     //////////   STOOOOREEE      /////////       
            args=args.productos[0];
            args.tipo="productos";
           
        args.morfFather=function(){
            e.source.morf();
            };
           
        args.openW = function(wndw){
          params.openW(wndw);  
        };
         args.index=e.index;
         args.rowIndex=e.index;
       args.delete=deletePubl;
        if(detalleProdObj=="") detalleProdObj=require('empresarial/detalleBeneficio');
         var detalle = new detalleProdObj(args);
         
            params.openW(detalle);   
        }else if(e.source.action=='estado' || e.source.action=='link'){
       ////////    ESTADOO      //////////////
            args=args.publicacion[0];
        args.morfFather=function(){
            e.source.morf();
            };
            
        args.openW = function(wndw){
          params.openW(wndw);  
        };
         args.index=e.index;
         args.rowIndex=e.index;
       args.delete=deletePubl;
             if(detalleComObj=="") detalleComObj = require('empresarial/detalleComment');
           var detalle = new detalleComObj(args);
           params.openW(detalle);  
        }
        
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         alert("Error de conexión.");
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
     });
     // Prepare the connection.
     client.open("GET", url);
     // Send the request.
     client.send(); 
               
           }
        
       }
       
   });
   
   if(params.url){
    pullPush(function(){todoTableView.fireEvent('data:finishreloading');},reloadViejasTable);
    }else{
     pullPush(reloadTable,reloadViejasTable);   
    }
   
   function pullPush(reload, oldLoad) {
    var pulling = false;
    var reloading = false;
    var oldloading = false;
    var lastRow = -1;
    var data;
    var pushing = false;
     var tableHeader = Ti.UI.createView({
        backgroundColor:"#333",
        width:320,
        height:60
    });
    
    var actInd = Titanium.UI.createActivityIndicator({
         left:135,
        bottom:15,
        width:30,
        height:30
    });
    var tableHeader2 = Ti.UI.createView({
        backgroundColor:"#333",
        width:320,
        height:90
    });
    
    var actInd2 = Titanium.UI.createActivityIndicator({
        left:149,
        bottom:45,
    });
    
    tableHeader.add(actInd);
    actInd.show();
    tableHeader2.add(actInd2);
    var loading = Titanium.UI.createTableViewRow();
    loading.add(tableHeader2);
    
    
    function beginReloading() {
        if (reload){
            reload();
        } else {
            setTimeout(endReloading, 2000);
        }
    }
    function beginOldLoad(){
        if (oldLoad && !oldloading){
            oldloading=true;
           
            todoTableView.appendRow(loading);
            actInd2.show();
            lastRow = todoTableView.len;
            oldLoad();
        } 
    }
    
    function endReloading() {
        lastRow = todoTableView.len;
        //Ti.API.info("LASTROW "+lastRow);
        todoTableView.setContentInsets({top:0},{animated:true});
        reloading = false;
        actInd.hide();
    }
    function endReloadOld(){
        Ti.API.info("LASTROW loadOLD"+lastRow);
          oldloading=false;
          todoTableView.deleteRow(lastRow);
          lastRow = todoTableView.len;
    }
    todoTableView.addEventListener('data:finishreloading', endReloading);
    todoTableView.addEventListener('data:finishreloadingOld', endReloadOld);
    
     var posAnterior=2;
    var escondidos=false;
    var offset=0;
    
    todoTableView.addEventListener('scroll',function(e) {
       
        offset = e.contentOffset.y;
         // Ti.API.info("offset: "+offset);
         // Ti.API.info(' e.size.height '+e.size.height+' e.contentSize.height '+e.contentSize.height);

        if (offset <= -45.0 && !pulling) {
            pulling = true;
        //    //Ti.API.info("activado pull");
        } else if (pulling && offset > -45.0 && offset < 0) {
            pulling = false;
           
        }
        
        if ((e.size.height+offset) >= (e.contentSize.height+5) && !pushing) {
            pushing = true;     
        
            if(!oldloading){
            niveles.push(e.contentSize.height);
            beginOldLoad();
            }
            //cw.opacity=0.5;   
        
           //Ti.API.info("activado push");
        
        }else if ((e.size.height+offset) <= (e.contentSize.height+5) && pushing) {
             pushing = false;
           //Ti.API.info("desactivando push");
         }
         if(params.busqueda==false){
       
       if(e.contentOffset.y>7){
        if(posAnterior<e.contentOffset.y && !escondidos) {
            
           params.dinamicButtons(true);
           escondidos=true;
        }else if(posAnterior>e.contentOffset.y && escondidos){
            //Ti.API.info("aparecer");
          // Ti.API.info("e.contentOffset.y "+e.contentOffset.y + ' e.size.height '+e.size.height + ' e.contentSize.height '+ e.contentSize.height);
            if(e.contentOffset.y+e.size.height<e.contentSize.height){
                params.dinamicButtons(false); 
            escondidos=false;
            }
            
        }
        }
        posAnterior=e.contentOffset.y;
        
    
    }
    });
    
    todoTableView.addEventListener('dragEnd',function(e) {
        
        if (pulling && !reloading) {
            reloading = true;
            pulling = false;
           
            actInd.show();
            todoTableView.setContentInsets({top:60},{animated:true});
            beginReloading();
        }
        
        
    });
    

    todoTableView.headerPullView = tableHeader;

}

/////// Scroll end  ///////
function scrollParado(e){
      todoTableView.removeEventListener('scrollEnd',scrollParado);
      Ti.API.info("scroll stoped "+e.contentOffset.y);
       var indice=0;   
        for(var i=0;i< niveles.length;i++){
          Ti.API.info("niveles[i] "+niveles[i]);
          if(e.contentOffset.y>niveles[i]){
              indice=i+1;
          }
      }
       Ti.API.info("nivel EN EL Q ESTOY "+indice);  
       emptyImages(indice);
      todoTableView.addEventListener('scrollEnd',scrollParado);
  }
  
    
    todoTableView.addEventListener('scrollEnd',scrollParado);
    
    reloadViejasTable();
    return todoTableView;
    
}
function getPleca(str){
    
    var res="";
    switch(str){
        case 'purple':
        res="images/empresarial/plecaProductosBeneficios.png";
        break;
        case 'rojo':
        res="images/plecaNoticias.png";
        break;
        case 'verde':
        res="images/empresarial/plecaMencionMarca.png";
        break;
        case 'azul':
        res="images/empresarial/plecaPublicacionMarca.png";
        break;
        default:
        //Ti.API.info("ewñouehfuieawhuiafehuaeiwfhpuashfudaihfulaidhfuiadhvuiadshviulasvluiadñadskjbnñjzuvda");
        res="";
        break;
    }
    return res;
}

module.exports=todoTabla;