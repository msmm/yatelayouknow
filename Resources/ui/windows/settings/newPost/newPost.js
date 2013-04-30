App.UI.NewPost = function(params){
	var settings = params || {};
	var style;
	var window="";
	var sendBtn;
	var message;
	var imgView;
	var imgSent;
	var cambiarImgPerfil=false;
	var fbActive=false;
	var twActive=false;
	var contacts, usernames, hashtags;
	//var mencionesView;
	var header;
	var mencScrollView,viewMenc;
	//var mencionesViewtable;
	var boolMen, inicio;
	var boolHash;
	var toolbar;
	var screenWidth=Ti.Platform.displayCaps.platformWidth;
	var screenHeight=Ti.Platform.displayCaps.platformHeight; 
	var pickerOn=false;
	var categoria = -1;
	  function blurKeyb(){
           message.blur();
       }
	var decorator = require("utils/decorators");
	
	//Facebook credentials
	Titanium.Facebook.appid = "422325314446439";
	Titanium.Facebook.permissions = ['publish_stream'];
	
	
		if(settings.fullControls){
			//Ti.API.info("fullControls");
		_init();
	}else{
		_photoDialog();
	}
	
	
	
	
	

//Escribir Texto Postear
function _postMessage(){
		//contacts=fillContacts();
		usernames=fillUsernames();
		boolMen=false;
		style 	= App.Styles.NewPost;
		window 	= UI.Win(style[vielite.platform].win);
		if(settings.to)window.title="Para "+settings.to.name;
		message = UI.TextArea(style[vielite.platform].message);
		 sendBtn = UI.Buttons(style[vielite.platform].sendBtn);
		sendBtn.addEventListener('click', _sendEvt);
		var cancelBtn = UI.Buttons(style[vielite.platform].cancelBtn);
		cancelBtn.addEventListener('click', _closeWindow);
		window.rightNavButton = sendBtn;
		window.leftNavButton = cancelBtn;
		message.setKeyboardToolbar(crearToolbar(message));
		//_addMencionesView(message);
		window.add(message);
		imgSent=false;
		setTimeout(function(){
			message.focus();
		}, 1000);
		//window.open();
		vielite.ui.navigation.open(window);
	}
	
	
	/////     ToolBar		/////
	function crearToolbar(message){
	var hashtag = Titanium.UI.createButton({
    title: '#',
     width: 35,
    height: Ti.UI.FILL
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
        var newText=message.value.substr(0,(n+1));
        //Ti.API.info("newText "+newText);
        message.value=newText+''+(e.source.text);
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
			backgroundImage:'/images/buttons/fb_inactivo.png',
			backgroundSelectedImage:'/images/buttons/fb_presionado.png',
			left : 5,
			width:35,
			height:35
		});
		
		
		
    var buttonTw = Titanium.UI.createButton({
			backgroundImage:'/images/buttons/tw_inactivo.png',
			backgroundSelectedImage:'/images/buttons/tw_presionado.png',
			left : 5,
			width:35,
			height:35
		});

    var mencion = Titanium.UI.createButton({
    title:'@',
    width: 35,
    height: Ti.UI.FILL
    });
    
    mencion.addEventListener('click',function(e){
    
    function mencionEscogida(e){
        boolMen=false;
        //Ti.API.info("murio mencion");
        if(typeof e.source.text != "undefined") {
        var n=message.value.lastIndexOf("@");
        //Ti.API.info("n "+n);
        var newText=message.value.substr(0,(n+1));
        //Ti.API.info("newText "+newText);
        message.value=newText+''+(e.source.text);
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
    systemButton: Titanium.UI.iPhone.SystemButton.CAMERA,
     width: 35,
    height: Ti.UI.FILL
    });

camera.addEventListener('click',function(e){
    _photoDialog();
});

 toolbar = Titanium.UI.iOS.createToolbar({
    items:[hashtag,flexSpace, mencion,flexSpace, camera, flexSpace, buttonTw,flexSpace, buttonFb],
    bottom:0,
    width:320
});
toolbar.restore=function(){
    toolbar.setItems([hashtag, flexSpace, mencion,flexSpace, camera, flexSpace, buttonTw,flexSpace, buttonFb]);
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
                    buttonFb.updateLayout({image:'/images/buttons/fb_activo.png'});
                }
                
                }else{
                 buttonFb.updateLayout({image:'/images/buttons/fb_inactivo.png'});    
                }
                                                });
        
        Ti.Facebook.addEventListener('login', function(e) {
        if(e.success){
             buttonFb.updateLayout({image:'/images/buttons/fb_activo.png'});
              setTimeout(function(){
             message.focus();
        }, 800);
         }
        else if(e.error) {
            alert("Error conectándose con Facebook");
             buttonFb.updateLayout({image:'/images/buttons/fb_inactivo.png'});
        } else if(e.cancelled) {
            fbActive=!fbActive; 
            buttonFb.updateLayout({image:'/images/buttons/fb_inactivo.png'});
        }
    });
    
    buttonTw.addEventListener('click', function()
        {
       function logT(){
      	message.focus();
      }
        if( !twitter.isAuthorized() )twitter.authorize(logT);
            twActive=!twActive;
            buttonTw.image = (twActive ? '/images/buttons/tw_activo.png' : '/images/buttons/tw_inactivo.png');            
            //twitter.friends(prnt);
            ////Ti.API.info();
        });
        //Listener si cierran la ventana de login
        Ti.App.addEventListener('twWindowClosed',function(e){
        twActive=false;
        buttonTw.image =  '/images/buttons/tw_inactivo.png';
        });

return toolbar;
	}
	

	
/*

	////	Menciones View		////
function _addMencionesView(TextArea){
  mencionesView = Titanium.UI.createView({
   borderRadius:10,
   backgroundColor:'transparent',
   width:Ti.UI.FILL,
   height:1,
   top:0
});
 mencionesViewtable = Ti.UI.createTableView({
 	rowHeight: 35
 });
 mencionesViewtable.addEventListener('click',function(e){
 	
 	var texto=TextArea.value;
 	var n=texto.lastIndexOf("@");
 	texto=texto.slice(0,n+1);
 	TextArea.value=texto.concat(e.rowData.title+" ");
 	boolMen=false;
	mencionesView.height=1;
 });
mencionesView.add(mencionesViewtable);
window.add(mencionesView);
}

*/

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
              left: 9,
              text: hashtags[i],
              textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
            }));
        
    }
//mencionesViewtable.setData(tableData);
}
mencScrollView.add(viewMenc);
//viewMenc.addEventListener ('postlayout', ivpostlayout);
}
}

}

///		Funcion para llenar la view "Menciones"		///
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
	//	mencionesViewtable.hide();
	//	mencionesView.height=1;
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
		
		if(usernames[i].search(patt)>=0){
			//Ti.API.info(usernames[i]);
		viewMenc.add(
		label2 = Ti.UI.createLabel({
			  left: 5,
			  text: usernames[i],
			  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
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


function fillContacts(){
	var array=[];
	var contacts =  JSON.parse(Ti.App.Properties.getString('vieliteContactsFollowing','{"contacto":[{"nombre":"vacio"}]}'));
	var contact;
	for(var i = 0, j = contacts.contacto.length; i < j; i++){
				contact = contacts.contacto[i];
				array.push(contact.nombre);
			}
			return array;
}
function fillUsernames(){
  
	var array=[];
	var contacts =  JSON.parse(Ti.App.Properties.getString('vieliteContactsFollowing','{"contacto":[{"nombre":"vacio"}]}'));
	//Ti.API.info('contacts.contacto[0]' +JSON.stringify(contacts.contacto[0].nombre));
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
        
        var client = Ti.Network.createHTTPClient({
         onload : function(e) {
             //Ti.API.info("_reloadContactsList "+this.responseText);
         Ti.App.Properties.setString('vieliteContactsFollowing',this.responseText);
          
         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
             Ti.API.debug(e.error);
         },
         timeout : 10000  // in milliseconds
     });
     // Prepare the connection.
     client.open("GET", siteLocation + 'ws_seguirSeguidor.php?group=' + 0 + '&id=' + settings.to.userID);
     // Send the request.
     client.send(); 
    
    }
	
	//Dialogo de inicio
function _init(){
		
	if(optionsOpen){
		return;
	}
	optionsOpen = true;
	
	if(settings.profile){
		
		var options = [
		L('edit_profile'),
		L('change_photo'),
		L('publicar_mensaje'),
		L('cancel')
	];
		
	}else{
		var options = [
		L('publicar_mensaje'),
		L('cancel')
	];
		
	}
	
	var dialog = UI.OptionDialog({
		titleid: 'settings',
		options: options,
		cancel: (settings.profile ? 4 : 2)
	});

	dialog.addEventListener('click', settingsDialogSelection);
	dialog.show();
}


//Seleccion en el diálogo
function settingsDialogSelection(evt){
	optionsOpen = false;
	
	if(settings.profile){
		
		switch(evt.index){
		case 0:
			var Settings 	= require('ui/windows/settings/settings').init();
			settingsWin 	= Settings.ui;
			vielite.ui.navigation.open(settingsWin);
			break;
		case 1:
		cambiarImgPerfil=true;
			_photoDialog();
			break;
		case 2:
			
			_postMessage();
			break;
	}
	}else{
		
		switch(evt.index){
		case 0:
			
			_postMessage();
			break;

	}
	}
	
	
}

function _photoDialog(){
	var options = [
		L('camera'),
		L('album'),
		L('cancel')
	];
	var dialog = UI.OptionDialog({
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
			success: (cambiarImgPerfil ? profileImg : _addImgEvt),
			saveToPhotoGallery: true,
			allowEditing: true,
			mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
			cancel: function(){message.focus();}
		});
			break;
		case 1:
			Ti.Media.openPhotoGallery({
			success: (cambiarImgPerfil ? profileImg : _addImgEvt),
			saveToPhotoGallery: false,
			allowEditing: true,
			mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
			cancel: function(){message.focus();}
		});
	}
}

function prnt(e){
	//Ti.API.info("friends "+ e);
	var res=JSON.parse(e);
	twitter.lookUp(res.ids);
	//Ti.API.info("print "+ res.ids);
}



	
	
	function profileImg(e){
					var PhotoWindow = require('ui/windows/settings/profileImage');
					var photo = new PhotoWindow({ image: e.media });
						vielite.ui.navigation.open(photo.ui);
				}
	
	
	function postMencion(media){
       
        var url = "http://www.vielite.com/ws_cats_publicar.php";
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
       //Ti.API.info("opciones post mencion "+this.responseText);
       var opciones=JSON.parse(this.responseText);

	_addImage(media,opciones);

     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
         alert("Error en tu conexión de Internet.")
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
 
    }
	function _addImgEvt(evt){
		
		if(evt.mediaType == Ti.Media.MEDIA_TYPE_PHOTO){
			postMencion(evt.media);
		}
	}


//procesar la imagen para que entre en el server
	function _addImage(image,data){
		
	
	if(window==""){
			window 	= UI.Win(style[vielite.platform].win);
		 sendBtn = UI.Buttons(style[vielite.platform].sendBtn);
		sendBtn.addEventListener('click', _sendEvt);
		var cancelBtn = UI.Buttons(style[vielite.platform].cancelBtn);
		cancelBtn.addEventListener('click', _closeWindow);
		window.rightNavButton = sendBtn;
		window.leftNavButton = cancelBtn;
	}

		
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
		
		
		while(hei>(screenHeight/2 ) || wid >screenWidth){
            
            hei=hei*0.99;
            wid=wid*0.99;
            
        }
        
        
		//Image view Usado para insertarlo en la View como PREVIEW
			imgView = Ti.UI.createView({
				top:165,
    width:wid,
    height:hei,
    backgroundImage:image
   
		});
		// message = Ti.UI.createTextArea();
		// message.value="";
		
		window.add(imgView);
		 var ImageFactory = require('ti.imagefactory');
        imgSent = ImageFactory.compress(image,0.2);
		
		 ///////Picker////////
sendBtn.removeEventListener('click',_sendEvt);
sendBtn.addEventListener('click',blurKeyb);
pickerOn=true;
var picks=[];
    var picked='';
function changePicked(a){
        picked=a;
        var i=1;
        for(x in picks){
            if(picks[x]==picked)break;
            i++;
        }
        //Ti.API.info('picked '+picked+"index "+i);
        categoria=i;
        _sendEvt();
    }
for(x in data){
    var stringily=data[x][0];
   picks.push(stringily);
}
    
    var picker = decorator.picker({
        'showButton': sendBtn,
        'picked': changePicked,
        'data' : picks
    });
    window.add(picker);
//_sendEvt();
		if(window=="")vielite.ui.navigation.open(window);
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
			

	function _sendEvt(){
		
			settings.send(message.value, (imgSent!=false ? imgSent : null), fbActive, twActive,categoria);
	}

	// function _closeWindow(){
		// message.value = '';
		// window.close();
		// //Ti.API.info("close window");
	// }
	

	function _closeWindow(){
		message.value = '';
		//imgSent==false ? vielite.ui.navigation.close(window):window.close();
		vielite.ui.navigation.close(window);
	}

	return {
		window: window,
		message: message,
		closeWindow: _closeWindow
	}
};