///     Variables generales     //
var screenWidth = Ti.Platform.displayCaps.platformWidth;
exports.screenWidth=screenWidth;    
exports.screenHeight=Ti.Platform.displayCaps.platformHeight;
exports.trueHeight=Ti.Platform.displayCaps.platformHeight-64;
exports.fotoPerfilMini='http://www.vielite.com/sites/www.vielite.com/files/images/perfil/mini_35/';
exports.sitio = 'http://www.vielite.com';
function getId(){
  var  str =Ti.App.Properties.getString('userID');
    //Ti.API.info("decorator getId func "+str);
    return str;
}
exports.idPerfil = getId;


/// fecha de hoy    ///
exports.getEncodedDate = function(){
  
  var dia="";
  var d = new Date();
  dia=""+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+"%20"+(d.toTimeString().substring(0,8));
  Ti.API.info("getEncodedDate: "+dia);
  return dia;
};

/// Borrar espacios al inicio y final///
exports.trimSpaces = function(str){
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};
exports.removeAllSpaces = function(str){
    return str.replace(/\s/g, "") ;
};

///     Picker      ///
exports.picker = function(settings){
   var pickerOn=false;
  var picker_view = Titanium.UI.createView({
    height:251,
    bottom: -252,
    backgroundColor:'green',
    zIndex:1
});
 
var cancel =  Titanium.UI.createButton({
    title:'Cancelar',
    style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});
 
var done =  Titanium.UI.createButton({
    title:'Ok',
    style:Titanium.UI.iPhone.SystemButtonStyle.DONE
});
 
var spacer =  Titanium.UI.createButton({
    systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
 
var toolbar =  Titanium.UI.iOS.createToolbar({
    top:0,
    items:[cancel,spacer,done],
    barColor:"transparent",
    backgroundImage: "images/empresarial/BarraTitulo.png",
    translucent:true

});
 
var picker = Titanium.UI.createPicker({
        top:43
});
picker.selectionIndicator=true;
 
var picker_data = [];
for(x in settings.data){
    var stringily=settings.data[x];
    var row=Titanium.UI.createPickerRow({
    	title: stringily,
    	fontSize:13
    	});
   picker_data.push(row);
}
 
picker.add(picker_data);
 
picker_view.add(toolbar);
picker_view.add(picker);

var slide_in =  Titanium.UI.createAnimation({bottom:0});
var slide_out =  Titanium.UI.createAnimation({bottom:-251});
settings.showButton.addEventListener('click',function() {
    if(!pickerOn){
        pickerOn=true;
        picker_view.animate(slide_in);
    }
    
});

function donePicking() {
    settings.picked(picker.getSelectedRow(0).title);
    picker_view.animate(slide_out);
}

done.addEventListener('click',donePicking);
cancel.addEventListener('click',function() {
    pickerOn=false;
    picker_view.animate(slide_out);
});

picker_view.salir=function(){
     picker_view.animate(slide_in);
};
picker_view.setPickerOn=function(value){
     pickerOn=value;
};
return picker_view;
};


//////////////////////////////////////////////
///     Agregar Pull y Push a una tabla     ///
exports.pullPush = function(tableview, reload, oldLoad) {
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
            tableview.appendRow(loading);
            actInd2.show();
            lastRow = tableview.len;
            oldLoad();
        } 
    }
    
    function endReloading() {
        lastRow = tableview.len;
        //Ti.API.info("LASTROW "+lastRow);
        tableview.setContentInsets({top:0},{animated:true});
        reloading = false;
        actInd.hide();
    }
    function endReloadOld(){
        Ti.API.info("LASTROW loadOLD"+lastRow);
          oldloading=false;
          tableview.deleteRow(lastRow);
          lastRow = tableview.len;
    }
    tableview.addEventListener('data:finishreloading', endReloading);
    tableview.addEventListener('data:finishreloadingOld', endReloadOld);

    tableview.addEventListener('scroll',function(e) {
       
        var offset = e.contentOffset.y;
          // //Ti.API.info("offset: "+offset);
          // //Ti.API.info(' e.size.height '+e.size.height+' e.contentSize.height '+e.contentSize.height);

        if (offset <= -45.0 && !pulling) {
            pulling = true;
        //    //Ti.API.info("activado pull");
        } else if (pulling && offset > -45.0 && offset < 0) {
            pulling = false;
           
        }
        
        if ((e.size.height+offset) >= (e.contentSize.height+5) && !pushing) {
            pushing = true;     
        
            if(!reloading)beginOldLoad();
            //cw.opacity=0.5;   
        
           //Ti.API.info("activado push");
        
        }else if ((e.size.height+offset) <= (e.contentSize.height+5) && pushing) {
             pushing = false;
           //Ti.API.info("desactivando push");
         }
    });
    
    tableview.addEventListener('dragEnd',function(e) {
        
        if (pulling && !reloading) {
            reloading = true;
            pulling = false;
           
            actInd.show();
            tableview.setContentInsets({top:60},{animated:true});
            beginReloading();
        }
    });

    tableview.headerPullView = tableHeader;
};

//////////////////////
//// LIKEBUTTON ////
/////////////////////

exports.likeButton = function(e){
    
    if(e.bottom){
          var view = Ti.UI.createView({
       width: 63,
       height: 24,
       right: (e.right ? e.right : 0),
       bottom : e.bottom
   }); 
    }else{
           var view = Ti.UI.createView({
       width: 63,
       height: 24,
       right: (e.right ? e.right : 0),
   });
    }

  //buttons
  
  var likeHeart = Ti.UI.createButton({
        height : 22,
        width : 23,
        right : (e.totLikes > 0  ? 30 : 2),
        image: (e.likeUser > 0  ? 'images/empresarial/likeRojo.png' :'images/empresarial/likeGris.png'),
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        action: 'vlike',
        zIndex:1
    });
    
    if(e.totLikes>0){
        var likeText = Ti.UI.createButton({
        title : e.totLikes,
        color: '#005890',
        height : 17,
        width : 40,
        right : 0,
        backgroundColor:"white",
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        borderWidth:1,
        borderColor:"#e7e7e7",
        borderRadius:3,
        textAlign: Titanium.UI.TEXT_ALIGNMENT_RIGHT,
        font:{fontFamily: 'Source Sans Pro', fontSize:13},
        action: 'vlike',
        
    });  
    view.add(likeText);
    }
   
    view.add(likeHeart);
    function morf(){
        view.removeEventListener('click',clicked);
        Ti.API.info("''''''morfin'''''''''''");
     var totLikesInt = new Number(e.totLikes);
      // if(e.totLikes>0){
          // var totLikesInt = new Number(likeText.title);
      // }else{
           // var totLikesInt = 0;
      // }
       totLikesInt++;
           likeHeart.image='images/empresarial/likeRojo.png';
           likeHeart.right=30;
           var likeText = Ti.UI.createButton({
            title : (totLikesInt),
	        color: '#005890',
	        height : 17,
	        width : 40,
	        right : 0,
	        backgroundColor:"white",
	        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	        borderWidth:1,
	        borderColor:"#e7e7e7",
	        borderRadius:3,
	        textAlign: Titanium.UI.TEXT_ALIGNMENT_RIGHT,
	        action: 'vlike',
            font:{fontFamily: 'Source Sans Pro', fontSize:13}
    });  
    view.add(likeText);
       
    }
    
    function clicked(){
        
        Ti.API.info(JSON.stringify(e));
    view.touchEnabled = false;
       setTimeout(function(){ view.touchEnabled = true},2000);
    
    var url = "http://www.vielite.com/ws_vlikeEmpresarial.php";
    var data={
        idUser:getId(),
        idPub:e.keyPublicacion,
        tipoNoti:e.tn,
        idPubOwner:(""+e.numCuenta)
    }
    Ti.API.info("---Dando like con : "+JSON.stringify(data));
    
    (function() {
        
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(eee) {
       Ti.API.info("LIKE "+this.responseText);
       morf();
       if(e.morfFather){
            Ti.API.info("father morf");
           e.morfFather();
          
       }
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("POST", url);
 // Send the request.
 client.send(data); 
    })();
     
    }
    
    
    if(e.likeUser==0){
        view.addEventListener('singletap',clicked); 
        }
     view.morf=morf;
        
    return view;
};


//////////////////////
////LOADING VIEW    /////
/////////////////////////

exports.loadingIndicator = function(){
  
  var view = Ti.UI.createView({
      width: Ti.UI.FILL,
      height: Ti.UI.FILL,
      backgroundColor : '#85000000',
      zIndex : 10
  });
  

var AI = Ti.UI.createActivityIndicator({
  height:Ti.UI.SIZE,
  width:Ti.UI.SIZE
});
    
    view.add(AI);
    AI.show();
    return view;
};


///     Denunciar       ////
exports.denunciar=function(id,tipo){
    var url = "http://www.vielite.com/ws_denunciar.php?idUser="+getId()+"&denunciar=yes&target="+id+"&tipo="+tipo;
//Ti.API.info(url);
    (function() {
        
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("Denuncia "+this.responseText);
       var resp=JSON.parse(this.responseText);
       alert(resp.denuncia[0].alerta);
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
    })();
};



//////////////////////////////////////
////        Wiswh list          &/////

exports.wishList = function(objectKey,tipo){
    //Ti.API.info(objectKey);
  var closeB = Ti.UI.createButton({
      title:"close"
  });
  closeB.addEventListener('click',function(e){
      window.close();
  });
  var window = Ti.UI.createWindow({
      "title": "Añadir a Wishlist",
      "modal": true,
      "leftNavButton" : closeB,
      "barImage": "images/empresarial/BarraTitulo.png",
      "backgroundColor" : "#f7f7f7"
  });
  
  var resultadoView = Ti.UI.createView({
      backgroundColor: '#85000000',
      height: Ti.UI.FILL,
      width: Ti.UI.FILL,
      layout:"vertical",
      zIndex:2
  });
  var resultadoImage = Ti.UI.createImageView({
      width:85,
      height:85,
      top:90
  });
  var resultadoLabel = Ti.UI.createLabel({
      top:10,
      color:"white",
      textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,
     font:{fontFamily: 'Source Sans Pro', fontSize:13}
  });
  resultadoView.add(resultadoImage);
  resultadoView.add(resultadoLabel);
  window.add(resultadoView);
  resultadoView.hide();
  
    var url = "http://www.vielite.com/ws_listas_user.php?id="+(getId());
    //Ti.API.info("Wish listsss "+url);
     
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("wishlists "+this.responseText);
    var result=JSON.parse(this.responseText);
    result=result.listas;
    // Populate the TableView data.
    var data = [];
    
    for(var key in result){
        //Ti.API.info("obj "+JSON.stringify(result[key]));
        for(var x in result[key]){
        //Ti.API.info("llaves "+x);
        //Ti.API.info("lista "+result[key][x]);
        data.push({title:result[key][x],llave:x, font:{fontFamily: 'Source Sans Pro', fontSize:20, fontWeight:20},color:"#404040", height:60,backgroundColor:"#f7f7f7"});
    }
        
    }
    
    wishLTv.setData(data);
       wishLTv.setHeight(Ti.UI.SIZE);
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
    
    
    // Create a TableView.
    var wishLTv = Ti.UI.createTableView({
        top : 0
    });

    
    // Listen for click events.
    wishLTv.addEventListener('click', function(e) {
        //Ti.API.info('title: \'' + e.row.title + '\', llaveLista: \'' + e.row.llave);
        
        
         var url = "http://www.vielite.com/ws_agregar_a_lista.php?id="+objectKey+"&keyLista="+(e.row.llave=="NULL" ? "":e.row.llave)+"&tipo="+tipo;
     //Ti.API.info("agregar Wish "+url);
     
    var net = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(ee) {
       //Ti.API.info("agregar Wish "+this.responseText);
       
       var res = JSON.parse(this.responseText);
       if(res.agregado[0].exitoso==1){
           resultadoImage.image='images/empresarial/correcto.png';
           resultadoLabel.text="Agregado Correctamente a la lista "+e.row.title;
           resultadoView.show();
           setTimeout(function(){
            window.close();
        }, 2000);
       }else{
           resultadoImage.image='images/empresarial/incorrecto.png';
           resultadoLabel.text="No se ha podido agregar correctamente a la lista "+e.row.title;
           resultadoView.show();
           setTimeout(function(){
            window.close();
        }, 2000);
       }
        
       
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 net.open("GET", url);
 // Send the request.
 net.send(); 
        
    });
    
    // Add to the parent view.
    window.add(wishLTv);
    
return window;

    
};


//////Barra COMMENTAR PUBL///////

//    id : id de la publ

exports.barraComment = function(id, recharge){
  
  var mainView = Ti.UI.createView({
      width: Ti.UI.FILL,
      backgroundColor: "#ebebeb",
      height: 38,
      bottom:0,
      zIndex:5
  });
  var realTextField = Ti.UI.createTextField({
  color: 'black',
  backgroundColor: "#d8d8d8",
  borderWidth:1,
  borderColor:"#005890",
  borderRadius: 2,
  paddingLeft:7,
  width: 300, height: 30
    });
    
    realTextField.addEventListener('blur',function(){
        textField.setValue(realTextField.getValue());
      //  realTextField.setValue('');
    });
  var textField = Ti.UI.createTextField({
  color: 'black',
  backgroundColor: "#d8d8d8",
  borderWidth:1,
  keyboardToolbar:[realTextField],
  borderColor:"#005890",
  borderRadius: 2,
  top: 4, left: 4,
  paddingLeft:7,
  width: 225, height: 30
    });
    
    textField.addEventListener('focus',function(e){
        // setTimeout(function(){
            // mainView.bottom=216;
        // },100);
        realTextField.focus();
    });
    // textField.addEventListener('blur',function(e){
        // setTimeout(function(){
            // mainView.bottom=0;
        // },75);
    // });
  var button = Titanium.UI.createButton({
   title: 'Comentar',
   borderRadius:2,
   backgroundImage: 'images/login/btn1.png',
   right:3,
   font:{fontFamily: 'Source Sans Pro', fontSize:13},
   top: 4,
   width: 82,
   height: 30
    });
    
    button.addEventListener('click',function(e){
        if(textField.value!="" && textField.value!=" "){
             var url = "http://www.vielite.com/ws_comentar_publicacion.php?idUser="+getId()+"&id="+id+"&comment="+(encodeURIComponent(textField.value));
     Ti.API.info("url comm: "+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       Ti.API.info("Comentar "+this.responseText);
       recharge(this.responseText);
    textField.value="";
     realTextField.setValue('');
    mainView.bottom=0;
    textField.blur();
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
    
    
    mainView.add(textField);
    mainView.add(button);
    
    return mainView;
    
};
//////////////////////////
///////   SHARE   ///////////
////params ={
  //id : id de la publicacion
  // right : distancia en right
//}
exports.share = function(params){
    var shareButton = Ti.UI.createButton({
        width : 32,
        height : 23,
        image : 'images/empresarial/icoCompartir.png',
        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
        action: "share"
    });
    if(params.left!="")shareButton.left=params.left;
    if(params.bottom!="")shareButton.bottom=params.bottom;
    if(params.right!="")shareButton.right=params.right;
    
    shareButton.addEventListener('click',function(){
            var url = "http://www.vielite.com/ws_share.php?idUser="+getId()+"&id="+params.id;
     
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("SHARE "+this.responseText);
        var res = JSON.parse(this.responseText);
        if(res.share[0].exitoso==1){
            shareButton.image='images/empresarial/publicacionCompartida.png';
        }
        alert(res.share[0].alerta);
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
    });
return shareButton;
};


////////////
// webview///
exports.webview = function(params){
    var closeB = Ti.UI.createButton({
      title:"close"
  });
  closeB.addEventListener('click',function(e){
      window.close();
  });
  var window = Ti.UI.createWindow({
      "modal": true,
      "leftNavButton" : closeB,
      barImage: "images/empresarial/BarraTitulo.png"
  });
      var webview = Titanium.UI.createWebView({url:params.url});
    window.add(webview);
    
    return window;
    
};


//////////////////////
//// HTML parser    ///////
///// menciones hashs links////
////////////////////////////////
exports.parseHtml = function(text){
  
  var response="";
    /***********************/
    /*Comprobamos los links*/
    /***********************/
    
    function urlify(a) {
    
    var event="'app:openLink'";
    var urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    return a.replace(urlRegex, function(url) {
        return '<bdi onclick="Ti.App.fireEvent('+event+', { message:\''+url+'\' });" ; style="color:blue">' + url + '</bdi>';
    });
    }
   
   response=urlify(text);
   
   var event="'app:openMencion'";
function mencionify(a) {
    var urlRegex = /(^|[^@\w])@(\w{1,25})\b/g;
    return a.replace(urlRegex, function(url) {
        return '<bdi onclick="Ti.App.fireEvent('+event+', { message:\''+url+'\' });" ; style="color:blue">' + url + '</bdi>';
    });
    }
    function hashify(a) {
    var urlRegex = /(^|[^#\w])#(\w{1,25})\b/g;
    return a.replace(urlRegex, function(url) {
        return '<bdi style="color:blue">' + url + '</bdi>';
    });
    }
    response=mencionify(response);
    response=hashify(response);
     return response;
};

/////   Sacar Ratio hacia lo ancho    //////
exports.ratioAnchoaScreenWidth = function(widthScreen,width){
  
  var ratio = (widthScreen/width);
  
    return ratio;
};

exports.emptyTab = function(foto,texto){
    
    var view = Ti.UI.createView({
        width: "100%",
        height: "100%",
        backgroundColor:"white",
        layout: "vertical",
        zIndex:11
    });
    
    var image = Ti.UI.createImageView({
        image: foto,
        top:110,
        width:101,
        height:96
    });
    
    var label = Ti.UI.createLabel({
        text: texto,
        color: "gray",
        right:40,
        left:40,
        top:20,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font:{fontFamily: 'Source Sans Pro', fontSize:13, fontWeight:"bold"}
    });
    
    view.add(image);
    view.add(label);
    return view;
};

