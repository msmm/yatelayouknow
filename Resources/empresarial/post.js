
///     Post Tip        ///

exports.tip = function(id){
    
    
    // Create a Button.
    var enviarButton = Ti.UI.createButton({
        title : 'Enviar'
    });
    
    // Listen for click events.
    enviarButton.addEventListener('click', function() {
       
(function() {
        var url = "http://www.vielite.com/ws_tip_publicar.php?id="+id+"&txt="+(encodeURIComponent(textArea.value));
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("Publish TIP "+this.responseText);
       window.close();
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
         
     },
     timeout : 10000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
    })();
    
    });
    
    var window = Ti.UI.createWindow({
        rightNavButton: enviarButton,
        title: "Publicar Tip",
        barImage: "images/empresarial/BarraTitulo.png"
    });
    
    var mainView = Ti.UI.createView({
        height:Ti.UI.FILL,
        width:Ti.UI.FILL,
        backgroundColor : 'white'
    });
    
    var textArea = Ti.UI.createTextArea({
      borderWidth: 1,
      borderColor: '#bbb',
      borderRadius: 2,
      color: '#404040',
            font: {
                fontFamily: 'Source Sans Pro',
                fontSize: 14
            },
      textAlign: 'left',
      top: 5,
      width: '97%',
      height : 196,
      suppressReturn : false,
      keyboardType: Ti.UI.KEYBOARD_ASCII
    });
    setTimeout(function(){
            textArea.focus();
        }, 800);
    
    mainView.add(textArea);
    window.add(mainView);
    return window;
    
};

exports.privateMessage = function(settings){
    
    var decorator= require('utils/decorators');
    var multiPickTObj = "";
    
    var involved=[];
    var fotitosInfo=[];
    // Create a Button.
    var enviarButton = Ti.UI.createButton({
        title : 'Enviar'
    });
    
    // Listen for click events.
    enviarButton.addEventListener('click', function() {
    
    if(textArea.value!="" && textArea.value!=" "){
    
    var url = "http://www.vielite.com/ws_mensaje_privado.php?sender="+decorator.idPerfil()+"&involved="+(involved.toString())+"&txt="+textArea.value;
    //Ti.API.info("send msj url: "+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("Msj enviado "+this.responseText);
       settings.closeW(window);
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
         
     },
     timeout : 10000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
}else{
    alert("Mensaje vacio.");
}

    });
    
    var window = Ti.UI.createWindow({
        rightNavButton: enviarButton,
        barImage: "images/empresarial/BarraTitulo.png",
        title: "Mensaje Privado"
    });
    
    var mainView = Ti.UI.createView({
        height:Ti.UI.FILL,
        width:Ti.UI.FILL,
        backgroundColor : '#f7f7f7',
        layout: 'vertical'
    });
    
    
////        De - Para         /////
var deParaView = Ti.UI.createView({
        top:20,
        height:50,
        width:300,
        backgroundColor : '#f7f7f7'
    });
var paraView = Ti.UI.createScrollView({
        height:Ti.UI.FILL,
        width:196,
        contentWidth: 'auto',
        contentHeight: 50,
        backgroundColor : 'white',
        layout:'horizontal',
        right:30
    });

var addButton = Ti.UI.createButton({
    backgroundImage:"images/buttons/masMenos.png",
    right:2,
    width:30,
    top:10,
    height:30,
    zIndex:1,
    style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
}); 

addButton.addEventListener('click',function(){
    if(multiPickTObj=="")multiPickTObj=require('mensajes/multiPickTable');
    
    var mptWindow = new multiPickTObj(addMultDest,fotitosInfo);
    mptWindow.open({
        modal:true
    });
    
});  
    
    
var fotoP= Ti.App.Properties.getString("foto");
var De = Ti.UI.createImageView({
        height:40,
        width:40,
        left: 2,
        top:5,
        hires:true,
        image: (decorator.sitio+"/sites/www.vielite.com/files/images/perfil/mini_360/"+fotoP)
    });

//Ti.API.info("foto DE "+(decorator.sitio+"/sites/www.vielite.com/files/images/perfil/mini_360/"+fotoP));

function addDest(foto){
    var Para = Ti.UI.createImageView({
        height:40,
        width:40,
        left: 6,
        top:5,
        image: (decorator.sitio+foto),
        hires:true
    }); 
paraView.add(Para);
}

function addMultDest(arr){
    involved=[];
    fotitosInfo=arr;
    var hijos = paraView.getChildren();
    for(var i=0;i<hijos.length;i++){
        
       paraView.remove(hijos[i]);
        
    }
    
    for(var i=0;i<fotitosInfo.length;i++){
        
        addDest(fotitosInfo[i].foto);
        involved.push(fotitosInfo[i].id);
        
    }
    //Ti.API.info("involved: "+involved.toString());
}

if(settings.foto){
addMultDest([{foto:settings.foto, id:settings.idDestinatario}]);
}
var flecha = Ti.UI.createView({
        height:25,
        width:25,
        backgroundImage : 'images/empresarial/flechaMsjPrivado.png',
        left: 46,
        top:12
    });    
deParaView.add(De);
deParaView.add(flecha);
deParaView.add(paraView);
deParaView.add(addButton);


/////     TextArea        /////
    var textArea = Ti.UI.createTextArea({
      borderWidth: 0,
      borderColor: '#bbb',
      borderRadius: 2,
      font: {fontSize:20},
      textAlign: 'left',
      top: 1,
      width: 300,
      height : '60%'
    });
    
    mainView.add(deParaView);
    mainView.add(textArea);
    window.add(mainView);
    function initW(){
        textArea.focus();
        window.removeEventListener('open',initW);
    }
    window.addEventListener('open',initW);
    
    return window;
};



    /////////////////////////////////////
    /////       POST MEncion     ////
    ////////////////////////////////////
    
exports.mencionar=function(settings){
    //Ti.API.info(JSON.stringify(settings));
    var window;
    var message;
    var imgView;
    var imgSent;
    var fbActive=false;
    var twActive=false;
    var contacts, usernames, hashtags;
    var header;
    var mencScrollView,viewMenc;
    //var mencionesViewtable;
    var boolMen, inicio;
    var boolHash;
    var toolbar;
    var pickerOn=false;
    var decorator = require("utils/decorators");
    //Facebook credentials
    Titanium.Facebook.appid = "422325314446439";
    Titanium.Facebook.permissions = ['publish_stream'];
    

        usernames=fillUsernames();
        boolMen=false;
        
        function blurKeyb(){
           message.blur();
       }
        
  ///Window     /////
        window  = Ti.UI.createWindow({
            title: settings.nombre,
            backgroundColor:"#f7f7f7",
            barImage: "images/empresarial/BarraTitulo.png"
        });
        var AI = decorator.loadingIndicator();
    
     window.add(AI);
     AI.hide();
        message = Ti.UI.createTextArea({
            top: 9,
            right: 8,
            left:7,
            height: 146,
            value: (""+settings.username),
            suppressReturn: false,
            keyboardToolbarColor: '#3A6F8F',
            borderWidth:1,
            borderColor:"#e7e7e7",
            borderRadius:2,
            color: '#404040',
            font: {
                fontFamily: 'Source Sans Pro',
                fontSize: 14
            }
        });
        var sendBtn = Titanium.UI.createButton({
            title: L('send')
        });
       sendBtn.addEventListener('click',_sendEvt);
        var cancelBtn = Titanium.UI.createButton({
            title: L('cancel')
        });
        cancelBtn.addEventListener('click', function(){
            if(settings.cancelPost){
                settings.cancelPost(window);
            }
            else if(settings.closeW){
                settings.closeW(window);
            }else{
             window.close();   
            }
            
        });
        window.rightNavButton = sendBtn;
        window.leftNavButton = cancelBtn;
        message.setKeyboardToolbar(crearToolbar(message));
        
        var charCount = Ti.UI.createLabel({
            top:141,
            right:11,
            font: {
                fontFamily: 'Source Sans Pro',
                fontSize: 12,
                fontWeight: "bold"
           },
           color:"#005890",
           text:"",
           zIndex:2
        });
        message.addEventListener('change',function(e){
            charCount.text=(280-e.value.length);
            if(e.value.length>280){
                message.value=e.value.substr(0,280);
                charCount.text="0";
            }
        });
        window.add(charCount);
        window.add(message);
        imgSent=false;
        setTimeout(function(){
            if(message.value!="")message.setValue(message.value.concat(" "));
            message.focus();
        }, 1000);
    
    
    
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
     font:{fontFamily: 'Source Sans Pro', fontSize:13}
  });
  resultadoView.add(resultadoImage);
  resultadoView.add(resultadoLabel);
  window.add(resultadoView);
  resultadoView.hide();
    
    
    /////     ToolBar       /////
    function crearToolbar(message){
    var hashtag = Titanium.UI.createButton({
    backgroundImage:'/images/empresarial/toolbar/icoHastagToolbar.png',
     width: 22,
    height: 22
    });
   hashtags='';
    hashtag.addEventListener('click',function(e){
    if(hashtags=='')getHashtags();
    boolHash=false;
    function hashtagEscogida(e){
        boolHash=false;
        //Ti.API.info("murio hash");
         if(typeof e.source.text != "undefined") {
        var n=message.value.lastIndexOf("#");
        //Ti.API.info("n "+n);
        var newText=message.value.substr(0,(n));
        //Ti.API.info("newText "+newText);
        message.value=newText+''+(e.source.text)+' ';
        }
        //Ti.API.info(JSON.stringify(e));
        mencScrollView.removeEventListener('click',hashtagEscogida);
        message.removeEventListener('change',_hashtags);
        toolbar.restore();
    }    
    
    message.value=message.value+'#';
    message.addEventListener('change',_hashtags);
    
    mencScrollView = Ti.UI.createScrollView({
      contentWidth: 'auto',
      contentHeight: 'auto',
      height: 44,
      width: 320,
      layout:'horizontal',
      scrollType:'horizontal',
      backgroundColor:'transparent'
    });
     mencScrollView.addEventListener('click',hashtagEscogida);
     viewMenc = Ti.UI.createView({
      backgroundColor:'transparent',
      height: 40,
      width: 1000,
      layout: 'horizontal'
    });
    mencScrollView.add(viewMenc);
    toolbar.setItems([mencScrollView]);
    toolbar.updateLayout();
    
    });
    var buttonFb = Titanium.UI.createButton({
            backgroundImage:'/images/empresarial/toolbar/icoFacebookToolbar.png',
            backgroundSelectedImage:'/images/empresarial/toolbar/icoFacebookToolbarON.png',
            left : 5,
            width:22,
            height:22
        });
        
        
        
    var buttonTw = Titanium.UI.createButton({
            backgroundImage:'/images/empresarial/toolbar/icoTwitterToolbar.png',
            backgroundSelectedImage:'/images/empresarial/toolbar/icoTwitterToolbarON.png',
            left : 5,
            width:22,
            height:22
        });

    var mencion = Titanium.UI.createButton({
    backgroundImage:'/images/empresarial/toolbar/icoMencionToolbar.png',
    width: 22,
    height: 22
    });
    
    mencion.addEventListener('click',function(e){
    
    function mencionEscogida(e){
        boolMen=false;
        //Ti.API.info("murio mencion");
        if(typeof e.source.text != "undefined") {
        var n=message.value.lastIndexOf("@");
        //Ti.API.info("n "+n);
        var newText=message.value.substr(0,(n));
        //Ti.API.info("newText "+newText);
        message.value=newText+''+(e.source.text)+' ';
        }
      
        //Ti.API.info(JSON.stringify(e));
        mencScrollView.removeEventListener('click',mencionEscogida);
        message.removeEventListener('change',_menciones);
        toolbar.restore();
    }
    
    message.addEventListener('change',_menciones);
    message.value=message.value+'@';
    mencScrollView = Ti.UI.createScrollView({
      contentWidth: 'auto',
      contentHeight: 'auto',
      height: 44,
      width: 320,
      layout:'horizontal',
      scrollType:'horizontal',
      backgroundColor:'transparent'
    });
    mencScrollView.addEventListener('click',mencionEscogida);
     viewMenc = Ti.UI.createView({
      backgroundColor:'transparent',
      height: 40,
      width: 1000,
      layout: 'horizontal'
    });
    mencScrollView.add(viewMenc);
    toolbar.setItems([mencScrollView]);
    toolbar.updateLayout();
    });

flexSpace = Titanium.UI.createButton({
    systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});


var camera = Titanium.UI.createButton({
        backgroundImage:'/images/empresarial/toolbar/icoFotoToolbar.png',
     width: 22,
    height: 22
    });

camera.addEventListener('click',function(e){
    _photoDialog();
});

 toolbar = Titanium.UI.iOS.createToolbar({
    barColor:"#002947",
    items:[mencion,flexSpace, hashtag,flexSpace, camera, flexSpace, buttonTw,flexSpace, buttonFb],
    bottom:0,
    width:320
});
toolbar.restore=function(){
    toolbar.setItems([mencion, flexSpace, hashtag, flexSpace, camera, flexSpace, buttonTw,flexSpace, buttonFb]);
    toolbar.updateLayout();
    }
    
    buttonFb.addEventListener('click', function(e){
            fbActive=!fbActive;
            //Ti.API.info('fbActive '+fbActive);
            if(fbActive){
                if(!Ti.Facebook.loggedIn){
                    message.blur();
                    Ti.Facebook.authorize();
                }else{
                    buttonFb.image='/images/empresarial/toolbar/icoFacebookToolbarON.png';
                }
                
                }else{
                 buttonFb.image='/images/empresarial/toolbar/icoFacebookToolbar.png';    
                }
                                                });
        
        Ti.Facebook.addEventListener('login', function(e) {
         if(e.success){
             buttonFb.image='/images/empresarial/toolbar/icoFacebookToolbarON.png';
              setTimeout(function(){
             message.focus();
        }, 800);
         }
        else if (e.error) {
            alert("Error conectándose con Facebook");
            buttonFb.image='/images/empresarial/toolbar/icoFacebookToolbar.png';
        } else if (e.cancelled) {
            fbActive=!fbActive; 
            buttonFb.image='/images/empresarial/toolbar/icoFacebookToolbar.png';
            setTimeout(function(){
            message.focus();
        }, 800);
        }
    });
    
    buttonTw.addEventListener('click', function()
        {
      function logT(){
        message.focus();
      }
        if( !twitter.isAuthorized() )twitter.authorize(logT);
            twActive=!twActive;
            buttonTw.image = (twActive ? '/images/empresarial/toolbar/icoTwitterToolbarON.png' : '/images/empresarial/toolbar/icoTwitterToolbar.png');            
            //twitter.friends(prnt);
            ////Ti.API.info();
        });
        //Listener si cierran la ventana de login
        Ti.App.addEventListener('twWindowClosed',function(e){
        twActive=false;
        buttonTw.image =  '/images/empresarial/toolbar/icoTwitterToolbar.png';
        message.focus();
        });

return toolbar;
    }
    

function getHashtags(){
    var url="http://www.vielite.com/ws_hashtags.php";
    
    var client = Ti.Network.createHTTPClient({
         // function called when the response data is available
         onload : function(e) {
             //Ti.API.info("HAAASHTAGS"+this.responseText);
            hashtags=this.responseText;
            hashtags=JSON.parse(hashtags);
         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
              
             alert("Internet fallando");
         },
         timeout : 10000  // in milliseconds
     });
     // Prepare the connection.
     client.open("GET", url);
     // Send the request.
     client.send(); 
}

///     Funcion para llenar la view "hashtags"     ///
function _hashtags(text){
    
//Ti.API.info("text.value.length-1 "+text.value.charAt(text.value.length-1));
        if(!boolHash){
          boolHash=true;
        inicio=text.value.length-1; 
           //Ti.API.info("inicio "+inicio);
        }
    if(text.value.charAt(text.value.length-1)==" " || text.value.charAt(text.value.length-1)==""){
        boolHash=false;
        //Ti.API.info("murio boolHash");
        message.removeEventListener('change',_hashtags);
        toolbar.restore();
    }
if(boolHash){
    text.value=text.value.substr(inicio);
    //Ti.API.info("hashtag "+text.value);
        if(text.value.length>1){
    mencScrollView.remove(viewMenc);
 viewMenc = Ti.UI.createView({
  backgroundColor:'transparent',
  height: 40,
  width: 7000,
  layout: 'horizontal'
});
//header.updateLayout({height:58});
    var patt=new RegExp(text.value,'i');
    
    for(var i=0,j=hashtags.length;i<j;i++){
        
        if(hashtags[i].search(patt)>=0){
            //Ti.API.info(hashtags[i]);
        viewMenc.add(
        label2 = Ti.UI.createLabel({
            font: { fontSize:13,fontFamily: 'Source Sans Pro'},
              top: 10,
              left: 9,
              text: ("#"+hashtags[i]),
              textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
              backgroundColor:"#eaf6ff",
              color:"#000000"
            }));
        
    }
}
mencScrollView.add(viewMenc);
//viewMenc.addEventListener ('postlayout', ivpostlayout);
}
}

}

///     Funcion para llenar la view "Menciones"     ///
function _menciones(text){
    
//Ti.API.info("text.value.length-1 "+text.value.charAt(text.value.length-1));
    //Titanium.API.info("remove view"+ JSON.stringify(mencScrollView.getChildren()));
    //if(text.value.charAt(text.value.length-1)=="@"){
        if(!boolMen){
         
          boolMen=true;
        inicio=text.value.length-1; 
           //Ti.API.info("inicio "+inicio);
        }
        
    //}
    if(text.value.charAt(text.value.length-1)==" " || text.value.charAt(text.value.length-1)==""){
        boolMen=false;
        //Ti.API.info("murio");
        message.removeEventListener('change',_menciones);
        toolbar.restore();
        //mencionesViewtable.data=[];
        //header.updateLayout({height:42});
    //  mencionesViewtable.hide();
    //  mencionesView.height=1;
    }
if(boolMen){
    text.value=text.value.substr(inicio);
    //Ti.API.info("username "+text.value);
        if(text.value.length>1){
    mencScrollView.remove(viewMenc);
    //mencionesViewtable.show();
    //mencionesView.height=50;
//var tableData = [];
 viewMenc = Ti.UI.createView({
  backgroundColor:'transparent',
  height: 40,
  width: 7000,
  layout: 'horizontal'
});
//header.updateLayout({height:58});
    var patt=new RegExp(text.value,'i');
    
    for(var i=0,j=usernames.length;i<j;i++){
        //Ti.API.info(usernames[i]);
        if(usernames[i].search(patt)>=0){
            //Ti.API.info(usernames[i]);
        viewMenc.add(
        label2 = Ti.UI.createLabel({
            font: { fontSize:17},
              top: 10,
              left: 5,
              text: "@"+usernames[i],
              textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
              backgroundColor:"#f7f7f7"
            }));
        
    }
//mencionesViewtable.setData(tableData);
}
mencScrollView.add(viewMenc);
//viewMenc.addEventListener ('postlayout', ivpostlayout);
}
}

}


//Update layout de menciones
/*
function ivpostlayout(e) {
                    
                    viewMenc.removeEventListener ('postlayout', ivpostlayout);
                    
                    viewMenc.updateLayout({width:Ti.UI.SIZE});
                    mencScrollView.updateLayout({width:Ti.UI.SIZE});
                    }
        */          

function fillUsernames(){
  
    var array=[];
    var contacts =  JSON.parse(Ti.App.Properties.getString('vieliteContactsFollowing','{"contacto":[{"nombre":"vacio"}]}'));
    Ti.API.info('contacts.contacto[0]' +JSON.stringify(contacts));
    if(contacts.contacto[0].nombre=="vacio"){
    _reloadContactsList();
    }else{
       for(var i = 0, j = contacts.contacto.length; i < j; i++){
     array.push(contacts.contacto[i].username);
    }
    }
            return array;
}

function _reloadContactsList(){
        
        var url='http://www.vielite.com/ws_seguirSeguidor.php?group=' + 0 + '&id=' + decorator.idPerfil();
        Ti.API.info("reload contacts "+url);
        var client = Ti.Network.createHTTPClient({
         onload : function(e) {
             Ti.API.info("_reloadContactsList "+this.responseText);
         Ti.App.Properties.setString('vieliteContactsFollowing',this.responseText);
          
         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
             Ti.API.debug(e.error);
         },
         timeout : 10000  // in milliseconds
     });
     // Prepare the connection.
     client.open("GET", url);
     // Send the request.
     client.send(); 
    
    }
    


function _photoDialog(){
    var options = [
        L('camera'),
        L('album'),
        L('cancel')
    ];
    var dialog = Ti.UI.createOptionDialog({
        titleid: 'change_photo',
        options: options,
        cancel: 2 
    });
    dialog.addEventListener('click', imageDialogSelection);
    dialog.show();
}



function imageDialogSelection(evt){
    
    switch(evt.index){
        case 0:
            Ti.Media.showCamera({
            success: _addImgEvt,
            saveToPhotoGallery: true,
            allowEditing: false,
            mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
            cancel: function(){message.focus();}
        });
            break;
        case 1:
            Ti.Media.openPhotoGallery({
            success: _addImgEvt,
            saveToPhotoGallery: false,
            allowEditing: false,
            mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
            cancel: function(){message.focus();}
        });
    }
}
    
    function _addImgEvt(evt){
        
        if(evt.mediaType == Ti.Media.MEDIA_TYPE_PHOTO){
            _addImage(evt.media);
        }
    }


//procesar la imagen para que entre en el server
    function _addImage(image){
        
    
    //Image View que será redimensionado y enviado al server    
    var getInfoImg = Ti.UI.createImageView({

    height:Titanium.UI.SIZE,
    width:Titanium.UI.SIZE,
    image:image

        });
//         
//         
//         
        var hei=getInfoImg.toImage().height;
        var wid=getInfoImg.toImage().width;        
//         
        // while(hei>250 || wid >250){
//             
            // hei=hei*0.99;
            // wid=wid*0.99;
//             
        // }
        
        // imgSent.height=hei;
        // imgSent.width=wid;
//         
        while(hei>(decorator.screenHeight/2 ) || wid >decorator.screenWidth){
            
            hei=hei*0.99;
            wid=wid*0.99;
            
        }
        
        
        //Image view Usado para insertarlo en la View como PREVIEW
            imgView = Ti.UI.createImageView({
            top:165,
            image:image,
            width:wid,
            height:hei
        });
        // message = Ti.UI.createTextArea();
        // message.value="";
        
        window.add(imgView);
        var ImageFactory = require('ti.imagefactory');
        var correctaImg=getInfoImg.toImage( );
        //imgSent=correctaImg;
        imgSent = ImageFactory.compress(correctaImg,0.3);
        ///////Picker////////
sendBtn.removeEventListener('click',_sendEvt);
sendBtn.addEventListener('click',blurKeyb);
pickerOn=true;
var picks=[];
    var picked='';
function changePicked(a){
        picked=a;
     
        for(x in settings.data){
            if(settings.data[x].nombre==picked){
                //Ti.API.info('picked '+picked+"index "+settings.data[x].id);
                 _sendEvt(settings.data[x].id);
                break;
                }
        }
        
       
    }
for(x in settings.data){
    var stringily=settings.data[x].nombre;
   picks.push(stringily);
}
    
    var picker = decorator.picker({
        'showButton': sendBtn,
        'picked': changePicked,
        'data' : picks
    });
    window.add(picker);
//_sendEvt();
        
    }

    function _removeImage(evt){
        if(evt.source == imgView){
            message.blur();
            imgView.removeEventListener('singletap', _removeImage);
            window.remove(imgView);
            imgView = null;
            setTimeout(function(){
                message.focus();
            }, 500);
        }
    }
    
    //Facebook publish Module
    function postFacebook(msg) {
    var text = msg;
    //Ti.API.info('text value::'+text+';');
    if( (text === '')){
        Ti.UI.createAlertDialog({ tile:'ERROR', message:'Mensaje vacio'}).show();   
    }
    else
    {
        Titanium.Facebook.requestWithGraphPath('me/feed', {message: text}, "POST", function(e) {
        if (e.success) {
           // alert("Publicación con Facebook");
        } else if (e.error) {
            alert("No se pudo conectar con Facebook");
        } else {
            alert('No se pudo conectar con Facebook');
        }
    });
    }
    
}

function errorSending(e){
    Ti.API.error(e);
     AI.hide();
             message.blur();
           //  alert(e);
              resultadoImage.image='images/empresarial/publicadoError.png';
           resultadoLabel.text="No se ha podido publicar correctamente.";
           resultadoView.show();
           setTimeout(function(){
            resultadoView.hide();
          if(!pickerOn) sendBtn.addEventListener('click', _sendEvt);
        }, 5000);
        setTimeout(function(){
            alert("Puedes intentar de nuevo.");
        }, 5100);
}

    function _sendEvt(index){
        message.blur();
       if(!pickerOn)sendBtn.removeEventListener('click', _sendEvt);
       
            AI.show();
            if(imgSent==false){
               var  url =  "http://www.vielite.com/mobile_publicar.php";
               var data = {
                idUser: decorator.idPerfil(),
                idPerfil: settings.numCuenta,
                content: message.value,
                type: "estado",
                foto: ""
            };
            
               
            }else{
                var  url = "http://www.vielite.com/mobile_publicarFoto.php";
                var data = {
                idUser: decorator.idPerfil(),
                idPerfil: settings.numCuenta,
                textoP: message.value,
                type: "foto",
                categoria:index,
                foto: imgSent
            };
            
                
            }
         
         Ti.API.info(data);   
            var client = Ti.Network.createHTTPClient({
         // function called when the response data is available
         onload : function(e) {
             var response = decorator.trimSpaces(this.responseText);
            Ti.API.info(response);
             if(response=="El archivo que subiste no es una imagen válida"){
                errorSending(e); 
             }else{
                  Ti.API.info("img uploaded "+response);
              var jsonResp = JSON.parse(this.responseText);   
              if(jsonResp.resultado==true){
              	 AI.hide();
            message.blur();
          Ti.API.info(this.responseText);
            if(fbActive)postFacebook(message.value);
            if(twActive){
            	var msgTw=(message.value);
            	if(imgSent!=false)msgTw=msgTw.concat((" http://www.vielite.com/publicacion.php?key="+jsonResp.keyPublicacion));
            	Ti.API.info("pal twitteer "+msgTw);
                setTimeout(function(e){twitter.share(msgTw)},1000);
            }
             resultadoImage.image='images/empresarial/publicadoExito.png';
           resultadoLabel.text="Publicación realizada con éxito";
           resultadoView.show();
           setTimeout(function(){
           if(settings.closeW){
                settings.closeW(window);
            }else{
             window.close();   
            }
        }, 3000); 
              }else{
              	errorSending(e);
              }          
            
             }
                
         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
             Ti.API.error(JSON.stringify(e));
             picker.setPickerOn(false);
            errorSending(e);
         },
         timeout : 30000  // in milliseconds
     });
     // Prepare the connection.
     client.open("POST", url);
     // Send the request.
     client.send(data);
    
            
      
      
        
    }



    return window;
};
