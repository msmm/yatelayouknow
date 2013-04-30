function publicacion(params){
    
  var decorator = require("utils/decorators");
   //var datos = JSON.parse(params);
    //Ti.API.info("Crandio publ con "+JSON.stringify(params));
    //Row
    var row = Ti.UI.createView({
    layout:"vertical",
    height:Ti.UI.SIZE,
    top:20,
    });
 
    //Views
    if(params.tipoPub=='foto' || params.tipoPub=='foto_ext'){
        
        
        if(params.ancho_img!=null){
            var ratio = (params.anchoTabla/params.ancho_img);
   var alto=(params.alto_img*ratio);
   if(alto>680)alto=680;
        }else{
            var alto = 150;
        }
        
        // var viewContent = Titanium.UI.createView({
   // width:params.anchoTabla,
   // height:((alto>params.anchoTabla) ? params.anchoTabla : alto),
   // backgroundColor: '#f7f7f7',
   // borderWidth:1,
   // borderColor:"#e5e5e5",
   // top:0,
   // touchEnabled:false
    // });
    }else{
        
        var viewContent = Titanium.UI.createView({
   width:params.anchoTabla,
   height:(Ti.UI.SIZE),
   backgroundColor: '#f7f7f7',
   borderWidth:1,
   borderColor:"#e5e5e5",
   top:0,
   touchEnabled:false
    });
        
        
    }

    
    
    var viewFooter = Titanium.UI.createView({
   width:params.anchoTabla,
   height:30,
   top:0,
   backgroundImage: getPleca(params.color)
    });
    
    row.keyPublicacion=params.keyItem
// /// View Content
    switch(params.tipoPub)
        {
           case 'estado':
          var label = Ti.UI.createLabel({
            color:'#404040',
            font:{fontFamily:'Source Sans Pro', fontSize:13},
            text:params.contenido,
            left:10, top: 10, bottom:10,
           right:(params.compartido==null ? 10 : 60),
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
            text:params.contenido,
            left:10, top: 10, bottom:10,
           right:(params.compartido==null ? 10 : 60),
             height: Titanium.UI.SIZE,
             touchEnabled:false
          });
          viewContent.add(label);
          row.action='link';
          break;
        case 'foto':
          var viewContent = Ti.UI.createImageView({
            image: (params.pubPerfil ? decorator.removeAllSpaces(decorator.sitio+params.fotoItem):decorator.removeAllSpaces(params.fotoItem)),
            hires:"true",
            height:alto,
            width:params.anchoTabla,
            defaultImage:'images/fotodefault.jpg',
            touchEnabled:false
          });
        //viewContent.add(foto);
        row.action='foto';
        //viewContent.addEventListener('postlayout',reloadContent);
         
          break;
          case 'foto_ext':
          
          var viewContent = Ti.UI.createImageView({
            image: decorator.removeAllSpaces(params.fotoItem),
            hires:"true",
            height:alto,
            defaultImage:'images/fotodefault.jpg',
            width:params.anchoTabla,
            touchEnabled:false
          });
       // viewContent.add(foto);
        row.action='foto';
        //viewContent.addEventListener('postlayout',reloadContent);
         
          break;
          case 'video':
         var video = Ti.UI.createImageView({
            image: (params.thumbnail ? params.thumbnail:params.fotoItem),
            hires:"true",
            defaultImage:'images/fotodefault.jpg',
            width:params.anchoTabla,
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
    
   var foto = Ti.UI.createImageView({
        image: decorator.removeAllSpaces(decorator.sitio+params.fotoItem),
        width:Ti.UI.FILL,
        touchEnabled:false
   });
   
   row.action='store';
   

   viewContent.add(foto);
   
          break;

        }
// 
 row.add(viewContent);
//     
//     
// ////////////////////////////////
// /////   USEr Section          /////
if(!params.pubPerfil){
var userView = Ti.UI.createView({
    width:params.anchoTabla,
    height:50,
    backgroundColor:"#ebebeb",
    touchEnabled:true,
    action:params.tipoUserPropietario,
    idCuenta:params.numCuentaPropietario
});

var dp = Ti.UI.createImageView({
    height:40,
    width:40,
    defaultImage:'images/fotodefault.jpg',
    left:4,
    hires:true,
    image: (decorator.sitio+params.foto),
    touchEnabled:false
});

var nombre = Ti.UI.createLabel({
    width:(params.anchoTabla-54),
    height:15,
    top: 10,
    left:47,
    text: params.nombre ,
    color:"#005890",
    font:{fontFamily: 'Source Sans Pro', fontSize:13, fontWeight:"bold"},
    touchEnabled:false
});

var username = Ti.UI.createLabel({
    width:(params.anchoTabla-54),
    height:15,
    top: 25,
    left:47,
    text: params.username,
    font:{fontFamily: 'Source Sans Pro', fontSize:13},
    touchEnabled:false
});

userView.add(dp);
userView.add(nombre);
userView.add(username);

if(params.compartido && params.compartido!=""){
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
//     



row.add(userView);

// 
// 
// ////////////////////////////////
// /// Texto Descripcion Section  /////
var descripcionView = Ti.UI.createView({
    width:params.anchoTabla,
    height:Ti.UI.SIZE,
    backgroundColor:"white",
    borderWidth:1,
   borderColor:"#e5e5e5",
    touchEnabled:false
});

var descripcion = Ti.UI.createLabel({
    width:(params.anchoTabla-4),
    top: 2,
    left:4,
    text: params.desc,
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
            text:(params.fechaInsercion ? params.fechaInsercion : params.fecha),
            left:6,
            width:Titanium.UI.SIZE, height: 20,
            touchEnabled:false
          });
  viewFooter.add(labelFecha);
 //buttons
  var likeB =  decorator.likeButton({
      "totLikes":params.totLikes,
      "right" : 5,
      "likeUser":params.likeUser,
      "keyPublicacion":params.keyItem,
      "numCuenta": params.numCuentaPropietario,
      "tn" :12
  });
     viewFooter.add(likeB);
    row.add(viewFooter);
// 
//   
    row.morf=likeB.morf;
    
    return row;
}

function getPleca(str){
    
    var res="";
    switch(str){
        case 'purple':
        res="images/empresarial/plecaProductosBeneficios.png";
        break;
        case 'verde':
        res="images/empresarial/plecaMencionMarca.png";
        break;
        default:
        //Ti.API.info("ewñouehfuieawhuiafehuaeiwfhpuashfudaihfulaidhfuiadhvuiadshviulasvluiadñadskjbnñjzuvda");
        res="";
        break;
    }
    return res;
}


module.exports=publicacion;