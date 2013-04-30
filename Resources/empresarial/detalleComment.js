
function detalleComment(settings){
    Ti.API.info("detalle coment info "+JSON.stringify(settings));
    var decorator = require('utils/decorators');

///     Base        ///   
    var window = Ti.UI.createWindow({
        title: settings.fullname,
        barImage: "images/empresarial/BarraTitulo.png",
            tabBarHidden: true,
            backgroundColor:"white"
    });
    
    var scrollView = Ti.UI.createScrollView({
        height : Ti.UI.FILL,
        width: decorator.screenWidth,
        contentWidth: 'auto',
        contentHeight: 'auto',
        layout: 'vertical'
    });

////////////////////////////////////////////
////        Comment principal       ////////
////////////////////////////////////////////

///     Header      ///
    var headerView = Ti.UI.createView({
        width : decorator.screenWidth,
        height : 43
    });
    var fotoPerfil = Ti.UI.createImageView({
        width : 35,
        height : 35,
        left: 10,
        hires:true,
        borderWidth:1,
        borderColor: "#999999",
        top:10,
        image : (decorator.sitio+settings.foto)
    });
    var nombre =  Ti.UI.createLabel({
        width : (decorator.screenWidth/1.6),
        height : 15,
        left: 55,
        top:10,
        text : (settings.fullname),
        font: { fontSize:13 ,fontFamily: 'Source Sans Pro', fontWeight:"bold"},
        color: '#005890'
    });
    var username = Ti.UI.createLabel({
        width : (decorator.screenWidth/1.6),
        height : 20,
        left: 55,
        font: { fontSize:13 ,fontFamily: 'Source Sans Pro'},
        top:23,
        color: '#929292',
        text : (settings.username),
    });
    var deleteButton = Ti.UI.createButton({
        width : 30,
        height : 30,
        image : 'images/empresarial/ico_den-eliPublicacion.png',
        right : 10,
    style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
    });
    
    deleteButton.addEventListener("click",function(e){
        
        if(settings.idUser==decorator.idPerfil()){
            
            dialog = Ti.UI.createOptionDialog({
             title: '¿Estas seguro de eliminar la publicación?',
             options : ['Aceptar','Cancelar']
             });
            // window.add(dialog);
             dialog.show();
             
             dialog.addEventListener('click',function(e){
                 
                if(e.index==0) {
               settings.delete(settings.keyPublicacion,settings.index, function(e){
             if(settings.closeW){
                settings.closeW(window);
            }else{
                window.close(); 
            } 
        },settings.rowIndex);
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
                if(e.index==0)  decorator.denunciar(settings.keyPublicacion,settings.tipoPublicacion);
             });
        }
        
    });
    
    headerView.add(fotoPerfil);
    headerView.add(nombre);
    headerView.add(username);
    headerView.add(deleteButton);

///     Compartido      ////
if(settings.compartido){
    var compartView = Ti.UI.createView({
        layout:"horizontal",
        width:Ti.UI.FILL,
        height:40,
        top:10
    });
    var shareImg = Ti.UI.createImageView({
    	left:10,
        width:32,
        height:23,
        image:"images/empresarial/publicacionCompartida.png"
    });
    
    var label1= Ti.UI.createLabel({
        height : 40,
        left: 4,
        font: { fontSize:13 ,fontFamily: 'Source Sans Pro'},
        color: '#929292',
        text : "A través de ",
    });
    var autor = Ti.UI.createLabel({
        height : 40,
        left: 2,
        font: { fontSize:13 ,fontFamily: 'Source Sans Pro',fontWeight:"bold"},
        color: '#005890',
        text : settings.nombreCompartido,
    });
    compartView.add(shareImg);
    compartView.add(label1);
    compartView.add(autor);
    
}
 
///     Body        ///

    // var content = Ti.UI.createLabel({
		// left:10,
		// right:10,
        // height: Ti.UI.SIZE,
        // top:10,
        // font: { fontSize:13 ,fontFamily: 'Source Sans Pro'},
        // color:"#404040",
        // text : settings.contenido
    // });
    
    
    
    var text=settings.contenido;
    var wrapBeg='<html><body><p style="font-size:13px;font-family: Source Sans Pro;">';
    var wrapEnd='</p></body></html>';
    // Create a WebView
    var aWebView = Ti.UI.createWebView({
        left:6,
        right:10,
        height: Ti.UI.SIZE,
        top:10
    });
    
    var contenido=wrapBeg+(decorator.parseHtml(text))+wrapEnd;
    //Ti.API.info(contenido);
    aWebView.setHtml(contenido);
//    aWebView.addEventListener('touchstart',function(){
//});
///     Footer      ///

    var footerView = Ti.UI.createView({
        width : decorator.screenWidth,
        height: 50,
        top:0
    });
    var fecha = Ti.UI.createLabel({
        width : decorator.screenWidth,
        height: 15,
        font: { fontSize:12 ,fontFamily: 'Source Sans Pro'},
        left : 10,
        color: '#929292',
        text : ("Publicado "+settings.fechaInsercion)
    });
    var shareButton = decorator.share({
        id:settings.keyPublicacion,
        right : 90,
        bottom : "",
    left : ""
    });
    var likeB =  decorator.likeButton({
      "totLikes":settings.totLikes,
      "likeUser":settings.likeUser,
      "right":10,
      "keyPublicacion":settings.keyPublicacion,
      "numCuenta": settings.idUser,
       "morfFather":function(){
          settings.morfFather();
      },
      "tn" :12
     
  });
    footerView.add(fecha);
    footerView.add(shareButton);
    footerView.add(likeB);
    
    
    scrollView.add(headerView);
   if(settings.compartido) scrollView.add(compartView);
    scrollView.add(aWebView);
    scrollView.add(footerView);
    
    
////////////////////////////////////////////
////        Tabla de Comments       ////////
////////////////////////////////////////////
    var commentsTableObj = require('empresarial/commentsTable');
    var commentsTable = new commentsTableObj({
        "id": settings.keyPublicacion,
        "width" : 0.94
    });
    
    scrollView.add(commentsTable);
    var espacioBottom = Ti.UI.createView({
        height:33
    });
    scrollView.add(espacioBottom);
    window.add(scrollView);
    
    
////////Commentar//////
var barraC=decorator.barraComment(settings.keyPublicacion,commentsTable.recharge);
window.add(barraC);

    return window;
}

module.exports = detalleComment;