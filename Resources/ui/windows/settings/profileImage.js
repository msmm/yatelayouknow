function ProfileImage(params){
	Ti.include('ui/windows/settings/style.js');
	var settings = params || {};
	var UI;
	var siteLocation;
	var vielite;
	var newFoto;
	var window;
	var newImage;

	_init();

	function _init(){
		UI 				= require('utils/ui');
		vielite 		= require('utils/global').getGlobals();
		siteLocation 	= UI.siteLocation();

		window 			= UI.Win(style[vielite.platform].win);
	
		var saveBtn 	= UI.Buttons(style[vielite.platform].saveBtn);
		saveBtn.addEventListener('click', _eventSave);

		window.rightNavButton = saveBtn;
		
		var scrollView = Ti.UI.createScrollView({
          contentWidth: 'auto',
          contentHeight: 'auto',
          height: '100%',
          width: '100%'
            });
		/*+++++++++++++++++++++
		 * //Proceso de edicion crop
		 * +++++++++++++++++++
		*/
		
	var baseImage = Titanium.UI.createImageView({
    image:settings.image,
    height:Titanium.UI.SIZE,
  	width:Titanium.UI.SIZE
    });
    var preview = Titanium.UI.createImageView({
    image:settings.image,
    height:Titanium.UI.SIZE,
    width:Titanium.UI.SIZE
    });
 	baseImage.addEventListener('postlayout',redimension);
 	scrollView.add(baseImage);
 	scrollView.hide();
 	window.add(scrollView);
 	window.add(preview);
 	
 	function redimension(){
 	baseImage.removeEventListener('postlayout',redimension);
    //Height and Width of the img
    var hei=baseImage.toImage().height;
    var wid=baseImage.toImage().width;
    var heiDummy=hei;
    //Ti.API.info("---Hei y Wid: "+hei+" "+wid);
    if(wid>750 || hei>750){
        
       var coef=1;
            
            while((heiDummy*coef)>710){
                
                coef=coef-(0.01);
                
            }
            hei=hei*coef;
            wid=wid*coef;
    //Ti.API.info("---Hei y Wid 2: "+hei+" "+wid);     
   
    }
    // newImage = Titanium.UI.createImageView({
   // image:settings.image,
   // height:hei,
   // width:wid
    // });
    var ImageFactory = require('ti.imagefactory');
        newImage = ImageFactory.compress(settings.image,0.2);
    /*
    var baseImage2 = Titanium.UI.createImageView({
    image:settings.image,
        height:hei,
    width:wid
});


        if(wid>hei){
            
            var coef=1;
            
            while(wid>hei){
                
                coef=coef-(0.01);
                wid=wid*coef;
                
            }
            
            
            // Here's the view we'll use to do the cropping. 
// It's never displayed either.
var cropView = Titanium.UI.createView({
    width:wid, height:hei
});
  
// Add the image to the crop-view.
// Position it left and above origin.
cropView.add(baseImage2);

var res=((widOriginal-wid)/2);

baseImage2.left=-res;
baseImage2.top=0;
 
// now convert the crop-view to an image Blob
var croppedImg = cropView.toImage();
  
         newImage = Titanium.UI.createImageView({
    image:settings.image,
        height:Ti.UI.SIZE,
    width:Ti.UI.SIZE
});
alert("Se recortó la imagen en proporciones de imagen de perfil");
    
    
        }else{
            
             newImage = Titanium.UI.createImageView({
   image:settings.image,
        height:Ti.UI.SIZE,
    width:Ti.UI.SIZE
});
        }
        */
 	}

		
	}


////      Mandar foto al servidor       ///
	function _eventSave(evt){
        
       alert("Actualizando foto.");
       
		var xhr = Titanium.Network.createHTTPClient();
		xhr.onerror = function(e){
			UI.Alert({title:'Error', message:e.error}).show();
			
		};
		xhr.setTimeout(20000);
		xhr.onload = function(e){
			//Ti.API.info(this.responseText);
			_eventCancel();
		};		

		xhr.open("POST", (siteLocation + "mobile_updateFotoPerfil.php"));
		xhr.setRequestHeader('cookie', vielite.data.cookie);
		xhr.send({
			IdUsuario: vielite.data.user.userID,
			foto: newImage
		});
	
	}
	
	
	

	function _eventCancel(evt){
		vielite.ui.navigation.close(window);
	}

	return {
		ui: window
	};
};

module.exports = ProfileImage;