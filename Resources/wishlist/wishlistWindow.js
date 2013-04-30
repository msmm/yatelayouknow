
function wishlistWindow(params){
    var decorator = require("utils/decorators");
    var loadingView = decorator.loadingIndicator();
    var wlDetail = "";

    var window = Ti.UI.createWindow({
     backgroundColor:'white',
     title: "WishList",
     barImage: "images/empresarial/BarraTitulo.png"
    });
    
    window.add(loadingView);
    
    var url = decorator.sitio+"/ws_wishlists.php?id="+params.id;
     //Ti.API.info(url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
         Ti.API.info(this.responseText);
        constructor(this.responseText);
        
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         //Ti.API.info(JSON.stringify(e));
         Ti.API.debug(e.error);
     },
     timeout : 8000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
 
 function constructor(res){
    
    var scrollWidth = (decorator.screenWidth*0.94);
    
    //Ti.API.info("wishlist: "+res);
    
     var wl=JSON.parse(res);
    wl=wl.listas; 
   
   
     /// ScrolVIEW principal     ////
var mainScrollView = Ti.UI.createScrollView({
  contentWidth: (300),
  contentHeight: 'auto',
  showHorizontalScrollIndicator: false,
  height: "100%",
  width: 300,
  horizontalBounce:false,
  backgroundColor:"transparent",
  layout:"horizontal"
});

function createList(img,nombre,fecha,keyList,icono,izq){
    
    var mainView = Ti.UI.createView({
        top:10,
        left: izq,
        borderWidth:1,
        borderColor:"#999999",
        width: ((scrollWidth/2)-10),
        height: 220,
        backgroundColor:"#f7f7f7",
        layout:"vertical",
        key:keyList,
        nombre:nombre
    });
   
    var imageLoader = Ti.UI.createImageView({
        image:(img),
        height:Ti.UI.SIZE,
        defaultImage:'images/fotodefault.jpg',
        width:Ti.UI.SIZE,
        touchEnabled:false
    });
    //Ti.API.info((img));
    var imageHolder = Ti.UI.createView({
        width:450,
        height:360
    });
    imageHolder.add(imageLoader);
    var image = Ti.UI.createView({
        width:Ti.UI.FILL,
        height:180,
        touchEnabled:false
    });
    image.add(imageHolder);
    
    var badge = Ti.UI.createView({
        height:40,
        width:40,
        right:5,
        top:5,
        backgroundImage:"images/wishlist/"+icono+".png",
        zIndex:1,
        touchEnabled:false
    });
    image.add(badge);
    var name = Ti.UI.createLabel({
        text:("  "+nombre),
        top:8,
        height:15,
        color:'#404040',
        width:((scrollWidth/2)-5),
        textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
        font:{fontFamily: 'Source Sans Pro', fontSize:14, fontWeight:"bold"},
        touchEnabled:false
    });
    mainView.add(image);
    mainView.add(name);
    if(fecha!=undefined){
    var date = Ti.UI.createLabel({
        text:("  "+fecha),
        height:12,
          width:Ti.UI.FILL,
          color:'#404040',
        textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
        font:{fontFamily: 'Source Sans Pro', fontSize:11},
        touchEnabled:false
    });
    mainView.add(date);
    }
    
    
    
    
    
    return mainView;
}

    
    for(var i=0,j=wl.length;i<j;i++){
        
       var list = createList(wl[i].foto,wl[i].nombre,wl[i].fecha,wl[i].keyLista,wl[i].icono,(i%2==1 ? 10:2));
        mainScrollView.add(list);
        
    }
    
    mainScrollView.addEventListener('click',function(e){
        if(e.source.nombre){
        //Ti.API.info("nombre: "+e.source.nombre+" key: "+e.source.key);
        if(wlDetail=="")wlDetail= require("wishlist/wishlistDetail");
        var wlDW = new wlDetail({
            id:params.id,
            nombre:e.source.nombre,
            key:e.source.key,
            openW:params.open
            });
        params.open(wlDW);
        }
    });
    
    window.add(mainScrollView);
     loadingView.hide();
     
}

    
    
    params.stopLoading();
    
    return window;
}

module.exports = wishlistWindow;
