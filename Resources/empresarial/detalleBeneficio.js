

//detalleBeneficio view Constructor
function detalleBeneficio(res) {
    var decorator =  require('utils/decorators');
    var fotos =[];
   //Window
    var window = Titanium.UI.createWindow({
    tabBarHidden: true,
    title:(res.tipo=="beneficios" ? "Detalle Beneficio" : "Detalle Producto"),
    barImage: "images/empresarial/BarraTitulo.png"
    });
   //Ti.API.info("detalle PROD/BENEF res "+JSON.stringify(res));

	if(res.tipo=="beneficios"){
		 var mainView = Ti.UI.createScrollView({
        width : decorator.screenWidth,
    contentWidth: (decorator.screenWidth),
  contentHeight: (decorator.trueHeight),
    height : Titanium.UI.FILL,
    top : 0,
    left : 0,
    backgroundColor: 'black',
    maxZoomScale :2
    });
    
    var imagenPrincipal = Ti.UI.createImageView({
    image:(decorator.sitio+res.fotoBeneficio),
    width: decorator.screenWidth
    });
    mainView.add(imagenPrincipal);
		imagenPrincipal.addEventListener('singletap',function(e){
        detailView.show();
    });
		
	}else{
		
		///		FOTO 1
	
	    var scrollV1 = Ti.UI.createScrollView({
        width : decorator.screenWidth,
    contentWidth: (decorator.screenWidth),
  contentHeight: (decorator.trueHeight),
    height : Titanium.UI.FILL,
    top : 0,
    left : 0,
    backgroundColor: 'black',
    maxZoomScale :2
    });
    
    var imgUrl=(res.tipo=="beneficios" ? res.fotoBeneficio : res.foto);
    //Ti.API.info("DETALLE PRODUCTO FOTOO "+decorator.sitio+imgUrl);
    var imagenPrincipal = Ti.UI.createImageView({
    image:(decorator.sitio+imgUrl),
    width: decorator.screenWidth
    });
    scrollV1.add(imagenPrincipal);
	fotos.push(scrollV1);

///		FOTO 2
if(res.foto2){
	    var scrollV2 = Ti.UI.createScrollView({
        width : decorator.screenWidth,
    contentWidth: (decorator.screenWidth),
  contentHeight: (decorator.trueHeight),
    height : Titanium.UI.FILL,
    top : 0,
    left : 0,
    backgroundColor: 'black',
    maxZoomScale :2
    });
    
    //Ti.API.info("DETALLE PRODUCTO FOTOO "+decorator.sitio+imgUrl);
    var imagenPrincipal2 = Ti.UI.createImageView({
    image:(decorator.sitio+res.foto2),
    width: decorator.screenWidth
    });
    scrollV2.add(imagenPrincipal2);
	fotos.push(scrollV2);
}

///		FOTO 3
	if(res.foto3){
	    var scrollV3 = Ti.UI.createScrollView({
        width : decorator.screenWidth,
    contentWidth: (decorator.screenWidth),
  contentHeight: (decorator.trueHeight),
    height : Titanium.UI.FILL,
    top : 0,
    left : 0,
    backgroundColor: 'black',
    maxZoomScale :2
    });
    
    var imagenPrincipal3 = Ti.UI.createImageView({
    image:(decorator.sitio+res.foto3),
    width: decorator.screenWidth
    });
    scrollV3.add(imagenPrincipal3);
    fotos.push(scrollV3);
   }
    // imagenPrincipal.addEventListener('pinch', function(e) { 
        // if(e.scale<2.1){
        // //    scale=e.scale;
        // var t = Ti.UI.create2DMatrix().scale(e.scale);
        // imagenPrincipal.transform = t; 
        // }
        // });
       
    //View
    
    var mainView = Ti.UI.createScrollableView({
    showPagingControl:true,
    views:fotos,disableBounce:true,
});
	
	mainView.addEventListener('singletap',function(e){
        detailView.show();
    });
	}

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
          case 'wish':
          var key= (res.tipo=="beneficios" ? res.keyBeneficio:res.keyProducto);
          var tipo= (res.tipo=="beneficios" ? "beneficio":"store");
          var wl=decorator.wishList(key,tipo);
          wl.open();
          break;
          default:
          detailView.hide(); 
      }
   
  });
  
  


///     Header      ///

var header = Ti.UI.createView({
    width : decorator.screenWidth,
    height : 60,
    top : 0,
    left : 0,
    });

var avatar = Ti.UI.createImageView({
    image : (decorator.sitio+res.fotoEmpresa),
    width : 35,
    height : 35,
    borderWidth: 1,
    borderColor: "#999999",
    top : 10,
    left : 10,
    hires:true
});


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
  text: res.nombreEmpresa,
  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  top: 12,
  left: 55,
  width : (decorator.screenWidth/1.6),
  height : 15,
});

header.add(avatar);
header.add(labelMencion);
header.add(labelUser);

///         Content         ////

if(res.tipo=="productos"){
    var costoTitleLabel = Ti.UI.createLabel({
  color: 'white',
  font: { fontSize:13, fontFamily: 'Source Sans Pro', fontWeight:'bold'},
  text: "Costo",
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  top: 50,
  left:10
});
 var costoLabel = Ti.UI.createLabel({
  color: 'white',
  font: { fontSize:13, fontFamily: 'Source Sans Pro',fontWeight:'bold'},
  text: (res.precioVielites+" Vielites / $"+res.precio),
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  top: 64,
  left:10
}); 
detailView.add(costoTitleLabel);
detailView.add(costoLabel);

}

 var descripcionTitleLabel = Ti.UI.createLabel({
  color: 'white',
  font: { fontSize:13, fontFamily: 'Source Sans Pro',fontWeight:'bold'},
  text: "Descripción:",
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  top: (res.tipo=="productos" ? 90:50),
  left:10
});
var descripcion = Ti.UI.createTextArea({
  color: 'white',
  editable:false,
  font: { fontSize:13, fontFamily: 'Source Sans Pro'},
  value:res.descripcion,
 // value:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eros turpis, ullamcorper sit amet elementum id, accumsan nec liga. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eros turpis, ullamcorper sit amet elementum id, accumsan nec liga eros turpis adipiscin",
  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  top: (res.tipo=="productos" ? 115:60),
  height: (decorator.trueHeight-210),
  left:3,
  right:3,
  backgroundColor:'transparent',
  touchEnabled: true
});

/// Pre footer7//
if(res.tipo!="productos"){
 var fechaLabel = Ti.UI.createLabel({
  color: 'white',
  font: { fontSize:13, fontFamily: 'Source Sans Pro'},
  text: ("Vigencia "+res.vigencia),
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  top: 230,
  right:10
});

detailView.add(fechaLabel);
}else{
  var categoriaImagen = Ti.UI.createImageView({
    image : 'images/empresarial/categorias/AIRELIBRE.png',
    width : 20,
    height : 20,
    top : 325,
    left : 10
});
var categoriaLabel = Ti.UI.createLabel({
  color: 'white',
  font: { fontSize:13, fontFamily: 'Source Sans Pro'},
  text: res.categoria,
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  top: 325,
  left: 32
});

detailView.add(categoriaImagen);
detailView.add(categoriaLabel);
  
}


///         Footer          ///

var footer = Ti.UI.createView({
    width : res.screenWidth,
    height : 70,
    bottom : 12,
    left : 0,
    });
    


var wishlistButton = Ti.UI.createButton({
    image : 'images/empresarial/icoWishlist.png',
    height : 23,
    width : 32,
    bottom : 2,
    left : ((decorator.screenWidth/4)),
    style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
    action: 'wish'
});
var likeButton =  decorator.likeButton({
      "totLikes":res.totLikes,
      "likeUser":res.likeUser,
       "bottom" : 2,
      "right" : (decorator.screenWidth/4),
      "keyPublicacion":(res.tipo=="beneficios" ? res.keyBeneficio:res.keyProducto),
      "numCuenta": res.idEmpresarial,
      "morfFather":function(){
          res.morfFather();
      },
      "tn" :12
  });



//footer.add(vigenciaLabel);
footer.add(wishlistButton);
footer.add(likeButton);




///     Acomodo     ///

detailView.add(header);
detailView.add(descripcionTitleLabel);
detailView.add(descripcion);
detailView.add(footer);
window.add(detailView);
detailView.hide();
  
    return window;
}

module.exports = detalleBeneficio;
