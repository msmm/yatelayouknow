
function detalleVideo(res){
    Ti.API.info("detalle VIDEO res "+JSON.stringify(res));
    var decorator =  require('utils/decorators');

       //Window
    var window = Titanium.UI.createWindow({
    tabBarHidden: true,
    title: "Detalle Video",
    barImage: "images/empresarial/BarraTitulo.png"
    });
   
   //ScrollView
    var scrollView = Ti.UI.createScrollView({
      contentWidth: decorator.screenWidth,
      contentHeight: 'auto',
      showVerticalScrollIndicator: false,
      height: "100%",
      width: '100%',
      backgroundColor: 'white',
      layout:'vertical'
    });
    window.add(scrollView);
   
   
///  HEADER     ////

var headerView = Ti.UI.createView({
    width : decorator.screenWidth,
    height : 45
});
   
   var avatar = Ti.UI.createImageView({
    image : (decorator.sitio+res.foto),
    width : 35,
    height : 35,
    defaultImage:'images/fotodefault.jpg',
    borderWidth: 1,
    borderColor: "#999999",
    top : 10,
    left : 10,
    hires:true
});
if(res.index){
var den_eli = Ti.UI.createView({
    backgroundImage : 'images/empresarial/ico_den-eliPublicacion.png',
    right:10,
    width:30,
    height: 30,
    action:'eliminar'
});
den_eli.addEventListener("click",function(e){
        
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
        
    });
}
var labelMencion = Ti.UI.createLabel({
  color: '#404040',
  font: { fontSize:13, fontFamily: 'Source Sans Pro' },
  text: res.username,
  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  top: 26,
  left: 55,
  width : (decorator.screenWidth/1.6),
  height : 15,
});
var labelUser = Ti.UI.createLabel({
  color: '#005890',
  font: { fontSize:13, fontWeight:'bold' ,fontFamily: 'Source Sans Pro'},
  text: res.fullname,
  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  top: 12,
  left: 55,
  width : (decorator.screenWidth/1.6),
  height : 15,
});

headerView.add(avatar);
if(res.index)headerView.add(den_eli);
headerView.add(labelMencion);
headerView.add(labelUser);
   
/// BODY    ////

var thmbnailView = Ti.UI.createView({
    left:10,
    right:10,
    height : 186,
    top:10
});
var imgcontainer = Ti.UI.createView({
    height:700,
    widht : 700
});
var videoLogo = Ti.UI.createImageView({
    image: "images/empresarial/video.png",
    width:75,
   height:75
});
var thmbnail = Ti.UI.createImageView({
    image: res.thumbnail,
    defaultImage:'images/fotodefault.jpg',
});
imgcontainer.add(thmbnail);
thmbnailView.add(imgcontainer);
thmbnailView.add(videoLogo);

thmbnailView.addEventListener('click',function(e){
    
   
    var wv = decorator.webview({url:res.contenido});
    wv.open();
});

///////////////////////////////////////////////////////

var wrapBeg='<html><body><p style="font-size:13px;font-family: Source Sans Pro;">';
    var wrapEnd='</p></body></html>';
    // Create a WebView
    var descripcionLabel = Ti.UI.createWebView({
        top: 5,
  left:10,
  right:10,
  height: Ti.UI.SIZE
    });
    descripcionLabel.addEventListener('touchstart',function(){
});
    
    var contenido=wrapBeg+(decorator.parseHtml(res.descripcion))+wrapEnd;
    //Ti.API.info(contenido);
    descripcionLabel.setHtml(contenido);
    /*
var descripcionLabel = Ti.UI.createLabel({
  color: '#404040',
  font: { fontSize:13, fontFamily: 'Source Sans Pro'},
  text: res.descripcion,
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  top: 5,
  left:10,
  right:10
});
*/

//////   FOOTER   ////

var footerView = Ti.UI.createView({
    width: decorator.screenWidth,
    height: 50,
    top:10
});
var fechaLabel = Ti.UI.createLabel({
  color: '#929292',
  font: { fontSize:12, fontFamily: 'Source Sans Pro'},
  text: ("Publicado "+res.fechaInsercion),
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  top: 0,
  right:10
});
var wishlistButton = Ti.UI.createButton({
    image : 'images/empresarial/icoWishlist.png',
    height : 23,
    width : 32,
    bottom : 2,
    right : 88,
    style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
});
wishlistButton.addEventListener("click",function(e){
	var wl=decorator.wishList(res.keyPublicacion,"publicacion");
    wl.open();
});

var likeButton =  decorator.likeButton({
      "totLikes":res.totLikes,
       "bottom" : 2,
       "likeUser":res.likeUser,
       "right" : 8,
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
    left : "",
    right:138
    });


footerView.add(fechaLabel);
footerView.add(wishlistButton);
footerView.add(likeButton);
footerView.add(shareButton);

////////////////////////////////////////////
////        Tabla de Comments       ////////
////////////////////////////////////////////
    var commentsTableObj = require('empresarial/commentsTable');
    var commentsTable = new commentsTableObj({
        "id": res.keyPublicacion,
        "width" : 0.94,
        "top" : 20
    });
    


/// Acomodo///
scrollView.add(headerView);
scrollView.add(thmbnailView);
scrollView.add(descripcionLabel);
scrollView.add(footerView);
scrollView.add(commentsTable);
var espacioBottom = Ti.UI.createView({
        height:33
    });
    scrollView.add(espacioBottom);
    
////////Commentar//////
var barraC=decorator.barraComment(res.keyPublicacion,commentsTable.recharge);
window.add(barraC);
   return window;
}

module.exports = detalleVideo;