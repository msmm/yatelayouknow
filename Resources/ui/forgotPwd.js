/*Sign up to vielite.com*/
var UI 			= require('utils/ui');


//validar campos necesarios

function validEmail(str){
	var atpos=str.indexOf("@");
	var dotpos=str.lastIndexOf(".");
	if (atpos<1 || dotpos<atpos+2 || dotpos+2>=str.length)
  	{
  	alert("Email invalido");
  	return false;
  	}else{
  		return true;
  	}
}


///		Http Webservice	 mandar el formulario	///
function sendData(mail){
	
	var url="http://www.vielite.com/index.php?page=olvidaste";
	var data = {
		enviar : "mail",
		email : mail
	};
	
	var client = Ti.Network.createHTTPClient({
         // function called when the response data is available
         onload : function(e) {
         	 ////Ti.API.info(this.responseText);
         	 alert("Se ha enviado un link a tu correo electrónico para reestablecer tu contraseña.");
         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
             alert("Internet fallando");
         },
         timeout : 15000  // in milliseconds
     });
     // Prepare the connection.
     client.open("POST", url);
     // Send the request.
     client.send(data); 
	
}


module.exports = function(){

	//Window
	var self = Ti.UI.createWindow({
		backgroundImage : 'images/bg.jpg',
		barColor:'#003366',
			});
	
	//Scroll View
	var scrollView = Ti.UI.createScrollView({
      contentWidth: 320,
      contentHeight: 'auto',
      showVerticalScrollIndicator: true,
      height: '100%',
      width: "100%",
      layout : "vertical"
    });
    
    //Close button
    var cancelButton = Ti.UI.createButton({
    	 systemButton: Ti.UI.iPhone.SystemButton.CANCEL 
    	 });
   cancelButton.addEventListener('click',function(e){
    	self.close();
    });
    self.setLeftNavButton(cancelButton);
    
    /////		LABELS		////
    var labelTitle = Ti.UI.createLabel({
	  font: { fontSize:22},
	  color: 'white',
	  text: L('fgtpwd_title'),
	  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	  top: 80,
	  width: 'auto', height: 'auto'
	});
	var labelTitlee = Ti.UI.createLabel({
	  font: { fontSize:32, fontWeight : 'bold' },
	  color: 'white',
	  text: L('fgtpwd_titlee'),
	  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	  top: 0,
	  width: 'auto', height: 'auto'
	});
	
	
///		Botones		////
	
	var buttonSiguiente= UI.Buttons({
		title: L('fgtpwd_boton'),
		top:40,
		width: '80%',
		backgroundImage : 'images/login/btn1.png',
		borderRadius: 2
		
	});
	
	//save all data and send it
	buttonSiguiente.addEventListener('click', function(e){
	
	if(validEmail(textFieldEmail.value)){
		sendData(textFieldEmail.value);
		self.close();
	}
	
	
	});

	
	////		textFields		////
	var textFieldEmail = Ti.UI.createTextField({
  	borderRadius: 2,
  	backgroundColor : 'white',
  	top: 25,
  	keyboardType:Ti.UI.KEYBOARD_EMAIL,
  	width: '80%', 
  	height: 40,
  	autocapitalization:Ti.TEXT_AUTOCAPITALIZATION_NONE,
    autocorrect:false,
  	hintText : L('fgtpwd_subtitle')
	});
		
	//Acomodo en la scrollview de childs
	self.add(scrollView);
	
	scrollView.add(labelTitle);
	scrollView.add(labelTitlee);
	scrollView.add(textFieldEmail);
	scrollView.add(buttonSiguiente);
	
	/////////////////////////////////////
////        Orientation changes     /////

function landscapeMode(){
    labelTitle.updateLayout({top:0});
    textFieldEmail.updateLayout({top:3});
}
function portMode(){
    labelTitle.updateLayout({top:80});
    textFieldEmail.updateLayout({top:25});
}

function loginOrient(e) {
    switch (Titanium.Gesture.orientation) {
 
        case Titanium.UI.LANDSCAPE_LEFT:
        landscapeMode();
        break;
        case Titanium.UI.LANDSCAPE_RIGHT:
            landscapeMode();
        break;
        case Titanium.UI.PORTRAIT:
        portMode();
        break;
        case Titanium.UI.UPSIDE_PORTRAIT:
        portMode();
        break;
    }
}

Titanium.Gesture.addEventListener('orientationchange', loginOrient);
	self.addEventListener('close',function(){
	   Ti.API.info('clossee fgtpwd');
	    Titanium.Gesture.removeEventListener('orientationchange', loginOrient);
	});
	
	return {
		self: self,
		open: function(){
			self.open({
				modal : true,
				modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL
			});
		}
	};
};