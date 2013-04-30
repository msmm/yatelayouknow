//detalleFoto view Constructor
function detalleFoto(res) {
  var decorator =  require('utils/decorators');
  var dialog;
    
   //Window
    var window = Titanium.UI.createWindow({
    tabBarHidden: true,
    title: "Detalle Foto",
    barImage: "images/empresarial/BarraTitulo.png"
    });
   Ti.API.info("detalle FOTO res "+JSON.stringify(res));
   
    //View
    var mainView = Ti.UI.createScrollView({
    width : decorator.screenWidth,
    contentWidth: 'auto',
  contentHeight: 'auto',
    height : Titanium.UI.FILL,
    top : 0,
    left : 0,
    backgroundColor: 'black',
    maxZoomScale :2
    });
    
    if(res.tipoPublicacion!="foto_ext")res.contenido=(decorator.sitio+res.contenido);
   
    if(res.alto_img>0){
        var ratio = (decorator.ratioAnchoaScreenWidth(decorator.screenWidth,res.ancho_img));
     //   Ti.API.info("RATIO: "+ratio);
        var alto=(res.alto_img*ratio);
    //    Ti.API.info("ALTO : "+alto + " url. "+res.contenido);
        }
   
    var imagenPrincipal = Ti.UI.createImageView({
    image:(decorator.removeAllSpaces(res.contenido)),
    defaultImage:'images/fotodefault.png',
    height:alto,
    width:320,
    hires:true
    });
    
    
    mainView.add(imagenPrincipal);
    //mainView.scrollTo((decorator.screenWidth/2),(decorator.screenWidth/2.3));
    window.add(mainView);
 
    var detailView = Ti.UI.createView({
    backgroundColor: '#85000000',
    width : decorator.screenWidth,
    height : decorator.trueHeight,
    top : 0,
    left : 0,
   // layout: 'vertical',
    });
     detailView.addEventListener('click',function(e){
      //Ti.API.info("detailView.addEventListener('click'"+ JSON.stringify(e));
      
      switch(e.source.action){
          case 'vlike':
          //Ti.API.info(e.source.action);
          break;
          case 'share':
          //Ti.API.info(e.source.action);
          break;
          case 'comment':
          //Ti.API.info(e.source.action);
          (function() {
        
              var closeB = Ti.UI.createButton({
      title:"close"
  });
  closeB.addEventListener('click',function(e){
      cw.close();
  });
  var cw = Ti.UI.createWindow({
      "modal": true,
      "leftNavButton" : closeB,
      "barImage": "images/empresarial/BarraTitulo.png",
      "title":"Comentarios",
      "backgroundColor" : "white"
  });
  function refreshNumC(){
       var numC = commentButton.title;
       numC--;
       commentButton.title=numC;
    }
  
          var commentsTableObj = require('empresarial/commentsTable');
          var commentsTable = new commentsTableObj({
        "id": res.keyPublicacion,
        "width" : 0.94,
        "fullScreen" : true,
        "top" : 10,
        "refresh":refreshNumC
    }); 
    cw.add(commentsTable);
    function refreshCommnts(res){
       var numC = commentButton.title;
       numC++;
       commentButton.title=numC;
        commentsTable.recharge(res);
    }
    var barraC=decorator.barraComment(res.keyPublicacion,refreshCommnts);
    cw.add(barraC);
    cw.open();
    })();

          break;
          case 'eliminar':
          
           if(res.idUser==decorator.idPerfil()){
                dialog = Ti.UI.createOptionDialog({
             title: '¿Estas seguro de eliminar la publicación?',
             options : ['Aceptar','Cancelar']
             });
            // window.add(dialog);
             dialog.show();
             
             dialog.addEventListener('click',function(e){
                 
                if(e.index==0) {
                res.delete(res.keyPublicacion,res.index, function(e){
            if(res.closeW){
                res.closeW(window);
            }else{
                window.close(); 
            } 
           
        },res.rowIndex);
                                }
               
             });
               
            
        }else{

             dialog = Ti.UI.createOptionDialog({
             title: '¿Estas seguro de denunciar la publicación?',
             options : ['Aceptar','Cancelar']
             });
            // window.add(dialog);
             dialog.show();
             
             dialog.addEventListener('click',function(e){
                 
                if(e.index==0) decorator.denunciar(res.keyPublicacion,res.tipoPublicacion);
             });
        }

          break;
          case 'wish':
          var wl=decorator.wishList(res.keyPublicacion,"publicacion");
          wl.open();
          break;
          case 'footer':
         
          break;
          default:
          detailView.hide(); 
      }
   
  });
  
  imagenPrincipal.addEventListener('singletap',function(e){
        detailView.show();
    });


///     Header      ///

var header = Ti.UI.createView({
    width : decorator.screenWidth,
    height : 60,
    top : 0,
    left : 0,
    });

var avatar = Ti.UI.createImageView({
    image : (decorator.sitio+res.foto),
    width : 35,
    height : 35,
    borderWidth: 1,
    borderColor: "#999999",
    top : 10,
    left : 10,
    hires:true
});

if(res.index || res.index===0){
var den_eli = Ti.UI.createView({
    backgroundImage : 'images/empresarial/ico_den-eliPublicacion.png',
    right:10,
    width:30,
    height: 30,
    action:'eliminar'
});
}

var labelMencion = Ti.UI.createLabel({
  color: 'white',
  font: { fontSize:13, fontFamily: 'Source Sans Pro' },
  text: res.username,
  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  top: 26,
  left: 55,
  width : (decorator.screenWidth/1.6),
  height : 15,
});
var labelUser = Ti.UI.createLabel({
  color: 'white',
  font: { fontSize:15, fontWeight:'bold' ,fontFamily: 'Source Sans Pro'},
  text: res.fullname,
  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  top: 12,
  left: 55,
  width : (decorator.screenWidth/1.6),
  height : 15,
});

header.add(avatar);
if(res.index || res.index===0)header.add(den_eli);
header.add(labelMencion);
header.add(labelUser);

///         Content         ////

var descripcion = Ti.UI.createTextArea({
  color: 'white',
  editable:false,
  font: { fontSize:13, fontFamily: 'Source Sans Pro'},
  value:res.descripcion,
 // value:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eros turpis, ullamcorper sit amet elementum id, accumsan nec liga. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eros turpis, ullamcorper sit amet elementum id, accumsan nec liga eros turpis adipiscin",
  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  top: 50,
  height: (decorator.trueHeight-196),
  left:3,
  right:3,
  backgroundColor:'transparent',
  touchEnabled: false
});

/// Pre footer7///
 var fechaLabel = Ti.UI.createLabel({
  color: 'white',
  font: { fontSize:13, fontFamily: 'Source Sans Pro'},
  text: res.fechaInsercion,
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  bottom: 70,
  right:10
});
var categoriaImagen = Ti.UI.createImageView({
    image : ('images/empresarial/categorias/'+res.categoImg),
    width : 20,
    height : 20,
    bottom : 70,
    left : 10
});
var categoriaLabel = Ti.UI.createLabel({
  color: 'white',
  font: { fontSize:13, fontFamily: 'Source Sans Pro'},
  text: res.catego,
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  bottom: 70,
  left: 32
});

if(res.site!=null){
    var siteTitleLbl = Ti.UI.createLabel({
    text:"V-Share desde:",
    font:{ fontSize:13, fontFamily: 'Source Sans Pro'},
    height:24,
    width:87,
    bottom:115,
    color:'white',
    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
    left:8 
    });
var siteLbl = Ti.UI.createLabel({
    text:(res.site),
    font:{ fontSize:13, fontFamily: 'Source Sans Pro', fontWeight:'bold'},
    height:24,
    width:210,
    bottom:115,
    color:'#98d9ff',
    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
    left:95
    });
    
    siteLbl.addEventListener('click',function(){
        Ti.Platform.openURL(res.site);
    });
}

///         Footer          ///

var footer = Ti.UI.createView({
    width : res.screenWidth,
    height : 70,
    bottom : 12,
    action:'footer',
    left : 0,
    });
    


// if(res.vigencia){
    // var vigenciaLabel = Ti.UI.createLabel({
  // color: 'white',
  // font: { fontSize:10},
  // text: 'Vigencia 12-12-12',
  // textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  // top: 5,
  // right:5
// });
// }


var wishlistButton = Ti.UI.createButton({
    image : 'images/empresarial/icoWishlist.png',
    height : 23,
    width : 32,
    bottom : 2,
    left : 100,
    style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
    action: 'wish'
});
var likeButton =  decorator.likeButton({
      "totLikes":res.totLikes,
       "bottom" : 2,
       "likeUser":res.likeUser,
      "right" : 90,
      "keyPublicacion":res.keyPublicacion,
      "numCuenta": res.idUser,
      "morfFather":function(){
          res.morfFather();
      },
      "tn" :12
  });
 var shareButton = decorator.share({
        id:res.keyPublicacion,
        bottom : 2,
    left : 15,
    right:""
    });
var commentButton = Ti.UI.createButton({
    backgroundImage : 'images/empresarial/icoComentar.png',
    title : res.numComments,
    color: "#005890",
    height : 23,
    width : 32,
    bottom : 2,
    right : 10,
    style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
   	font: { fontSize:13, fontFamily: 'Source Sans Pro'},
    action : 'comment'

});


//footer.add(vigenciaLabel);
footer.add(wishlistButton);
footer.add(likeButton);
footer.add(commentButton);
footer.add(shareButton);




///     Acomodo     ///

detailView.add(header);
detailView.add(descripcion);
detailView.add(fechaLabel);
detailView.add(categoriaImagen);
detailView.add(categoriaLabel);
if(res.site!=null){
    detailView.add(siteTitleLbl);
    detailView.add(siteLbl);
}
detailView.add(footer);
window.add(detailView);
detailView.hide();
  
    return window;
}

module.exports = detalleFoto;
