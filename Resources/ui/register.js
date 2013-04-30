/*Sign up to vielite.com*/
var UI 			= require('utils/ui');
var personalInfo=[];
personalInfo[7]='';
personalInfo[8]='';
var isAndroid	= Ti.Platform.osname == 'android';

//validar campos necesarios
function validName(str){
	if(str!='' && str!=' '){
		return true;
	}else{
		return false;
	}
	
}
function validLastName(str){
	if(str!='' && str!=' '){
		return true;
	}else{
		return false;
	}
}
function validEmail(str){
	var atpos=str.indexOf("@");
	var dotpos=str.lastIndexOf(".");
	
	if (atpos<1 || dotpos<atpos+2 || dotpos+2>=str.length)
  	{
  	return false;
  	}else{
  		return true;
  	}
}
function validCp(str){
	
	var digits= /^\d{5}/.test(str);
	if(digits && str.length<6){
		return true;
	}else{
		return false;
	}
	
}
function validContra(a, b){
    if(a=='' || a.length<6)return false;
    if(a==b){
        return true;
    }else{
        return false;
    }
}

function validUsername(u){
    
    if(/\s/g.test(u)){
        alert("Usuario contiene espacios.");
        return false;
    }
     if(u=='' || u.length<3){
         return false;
     }else{
         return true;
     }
}

function validPickers(){
    if(personalInfo[7]=='' || personalInfo[8]==''){
        return false;
    }else{
        return true;
    }
}



module.exports = function(){
    
    /////funciones internas/////
    ///     Http Webservice  mandar el formulario   ///
function sendData(){
    
    var url="http://www.vielite.com/ws_registerUser.php";
    var data = {
        info : JSON.stringify(personalInfo)
    };
    
    var client = Ti.Network.createHTTPClient({
         // function called when the response data is available
         onload : function(e) {
             //Ti.API.info(this.responseText);
            respuesta(this.responseText);
         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
            alert("Error al establecer conexión");
             
         },
         timeout : 15000  // in milliseconds
     });
     // Prepare the connection.
     client.open("POST", url);
     // Send the request.
     client.send(data); 
    
}

//Procesar la respuesta del servidor
    function respuesta(e){
    e=JSON.parse(e);
    if(e[0]=='username'){
        alert("usuario en uso, escoge otro.");
    }else if(e[0]=='email'){
        
         alert("email en uso, escoge otro.");
   }else{
        self.close();
        alert("Tu solicitud fué enviada, espera un correo para continuar.");
         
    }
    
}
function logConFb(e){
    
     if (e.success) {
        Ti.Facebook.removeEventListener('login', logConFb);
        
        Ti.Facebook.requestWithGraphPath('me', {}, 'GET', function(ee) {
    if (ee.success) {
        
        var res=JSON.parse(ee.result);
        
        textFieldNombre.value=res.first_name;
        textFieldApaterno.value = res.last_name;
        textFieldEmail.value = res.email;
        personalInfo[7]= res.gender == 'male' ? 'M':'F';
        buttonSexo.title=res.gender == 'male' ? 'M':'F';
    }
    else if (ee.error) {
        alert(ee.error);
    }

    });
        
    } else if (e.error) {
        alert(e.error);
    }
    
}

    
    
   
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
      width: '100%'
    });
    
    var mainView = Ti.UI.createView({
        width:"100%",
        height:Ti.UI.SIZE,
      layout : "vertical"
    });
    
    //Close button
    var cancelButton = Ti.UI.createButton({
    	 systemButton: Ti.UI.iPhone.SystemButton.CANCEL 
    	 });
   cancelButton.addEventListener('click',function(e){    	self.close();    });    self.setLeftNavButton(cancelButton);
    
    /////		LABELS		////
    var labelTitle = Ti.UI.createLabel({
	  color: 'white',
	  font: { fontSize:20 },
	  text: L('register_title'),
	  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	  top: 10,
	  width: 'auto', height: 'auto'
	});
	var labelTitle2 = Ti.UI.createLabel({
	  color: 'white',
	  font: { fontSize : 31, fontWeight : 'bold' },
	  text: L('register_titlee'),
	  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	  top: 0,
	  width: 'auto', height: 'auto'
	});
	
	var labelFechaNac = Ti.UI.createLabel({
	  color: 'white',
	  font: { fontSize:16 },
	  text: L('register_fechanac'),
	  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	  top : 10,
	  width: 'auto', height: 'auto'
	});
	var labelSexo = Ti.UI.createLabel({
	  color: 'white',
	  font: { fontSize:16 },
	  text: L('register_sexo'),
	  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	  top : 10,
	  width: 'auto', height: 'auto'
	});
	
	
	////		textFields		////
	var textFieldNombre = Ti.UI.createTextField({
  	borderRadius: 2,
  	backgroundColor : 'white',
  	width: '80%', 
  	height: 40,
  	top : 20,
  	hintText : L('register_nombre')
	});
	var textFieldApaterno = Ti.UI.createTextField({
	borderRadius: 2,
  	backgroundColor : 'white',  	
  	width: '80%', 
  	height: 40,
  	top : 10,
  	hintText : L('register_apaterno')
	});
	var textFieldAmaterno = Ti.UI.createTextField({
	borderRadius: 2,
  	backgroundColor : 'white',
  	width: '80%', 
  	height: 40,
  	top : 10,
  	hintText : L('register_amaterno')

	});
	var textFieldEmail = Ti.UI.createTextField({
	borderRadius: 2,
  	backgroundColor : 'white',
  	width: '80%', 
  	height: 40,
  	keyboardType:Ti.UI.KEYBOARD_EMAIL,
  	autocapitalization:Ti.TEXT_AUTOCAPITALIZATION_NONE,
    autocorrect:false,
  	  	top : 10,
  	 hintText : L('register_email'),
	});
	var textFieldCP = Ti.UI.createTextField({
		borderRadius: 2,
  	backgroundColor : 'white',
  	width: '80%', 
  	height: 40,
  	  	top : 10,
  	  	hintText: L('register_cp')

	});
	var textFieldCiudad = Ti.UI.createTextField({
	borderRadius: 2,
  	backgroundColor : 'white', 
  	width: '80%', 
  	height: 40,
  	  	top : 10,
  	  	hintText : L('register_ciudad')
	});
	var textFieldUser = Ti.UI.createTextField({
    borderRadius: 2,
    backgroundColor : 'white',
    width: '80%', 
    height: 40,
    top : 15,
    hintText : L('register_Usuario')
    });
    var textFieldContra = Ti.UI.createTextField({
        borderRadius: 2,
    backgroundColor : 'white',
    width: '80%', 
    height: 40,
    top : 15,
    passwordMask: true,
    hintText : L('register_Contraseña')
    });
    var textFieldConfirmContra = Ti.UI.createTextField({
        borderRadius: 2,
    backgroundColor : 'white',
    width: '80%', 
    height: 40,
    top : 15,
    passwordMask: true,
    hintText : L('register_ConfirmarContraseña')
    });
	
////	///		Pickers		///		////
	var genres =  [
		L('male'),
		L('female')
	];
	var infoSexo={
				hideChild: true,
				pickerType: Ti.UI.PICKER_TYPE_PLAIN, 
				pickerData: genres,
				callback: function(value){
					var s =value == 1 ? 'F' : 'M';
					personalInfo[7]= s;
					buttonSexo.title = s== 'F' ? 'Femenino' : 'Masculino';
					//Ti.API.info(value);
									}
							};
		var pickerSexo,pickerFecha;					
		if(isAndroid){
		pickerSexo	= Ti.UI.createPicker({
			top : 5
		});
		genres[0]=Ti.UI.createPickerRow({title: L('male') });
		genres[1]=Ti.UI.createPickerRow({title: L('female') });
		pickerSexo.add(genres);
		pickerSexo.addEventListener('change', function(e){
			//Ti.API.info('picker '+e.row.title);
			//cd=e.row.title;
		});
	}else{
			 pickerSexo = UI.Picker({
							data: infoSexo.pickerData,
							type: infoSexo.pickerType,
							callback: infoSexo.callback
						});
	self.add(pickerSexo.container);
	}

    
	var infoFecha={
				hideChild: true,
				pickerContainer: self,
				pickerType: Ti.UI.PICKER_TYPE_DATE,
				callback: function(e){
						var mes=e.getMonth();
						var fecha = new Date(e.getFullYear(),mes,e.getDate());
						var fstr=fecha.toJSON();
						var f = fstr;
						buttonFecha.title=fstr.substr(0,10);
					personalInfo[8]=f;
									}
		};
		
		if(isAndroid){
		pickerFecha	= Ti.UI.createPicker({
			type:Ti.UI.PICKER_TYPE_DATE,
			top : 5,
			minDate:new Date(1950,0,1),
  			maxDate:new Date(1994,11,31),
		});
		pickerFecha.addEventListener('change', function(e){
			//Ti.API.info('pickerFecha '+ JSON.stringify(e));
			//cd=e.row.title;
		});
	}else{
			 pickerFecha = UI.Picker({
							type: infoFecha.pickerType,
							callback: infoFecha.callback,
						});
	pickerFecha.picker.minDate=new Date(1950,0,1);
  	pickerFecha.picker.maxDate=new Date(1994,11,31),
	self.add(pickerFecha.container);
	}

	
///		Botones		////

	if(!isAndroid){
		var buttonSexo= UI.Buttons({
		title: '...',
		top:5,
		height : 35,
		width: '80%',
		borderRadius:2,
		backgroundImage : null,
		backgroundColor : 'white',
		color : '#3A6F8F'
		
	});
	buttonSexo.addEventListener('click', pickerSexo.slideInCallback);
	
	var buttonFecha= UI.Buttons({
		title: '...',
		top :5,
		height : 35,
		width: '80%',
		borderRadius:2,
		backgroundImage : null,
		backgroundColor : 'white',
		color : '#3A6F8F'
		
	});
	buttonFecha.addEventListener('click', pickerFecha.slideInCallback);
	}
	
	var buttonFacebook= UI.Buttons({
        title: L('register_fbLogin'),
        top:20,
        width: '80%',
        backgroundImage : '/images/login/btn1.png',
        image: '/images/login/facebookLogin.png',
        borderRadius: 3
        
    });
    
    buttonFacebook.addEventListener('click',function(e){

    
    if(Ti.Facebook.getLoggedIn()){
        var e={
            'success':true
        };
        logConFb(e);
    }else{
    Ti.Facebook.addEventListener('login', logConFb);
    Ti.Facebook.authorize();
    }
    });
	
	var buttonSiguiente= UI.Buttons({
		title: 'Registrar',
		top:20,
		width: '80%',
		backgroundImage : '/images/login/btn1.png',
		borderRadius: 3
		
	});
	
	
	
	
	//save all data and send it
	buttonSiguiente.addEventListener('click', function(e){
	
// //Ti.API.info('validName'+validName(textFieldNombre.value));
// //Ti.API.info('validLastName'+validLastName(textFieldApaterno.value));
// //Ti.API.info('validEmail'+validEmail(textFieldEmail.value));
// //Ti.API.info('validCp'+validCp(textFieldCP.value));
// //Ti.API.info('validContra'+validContra(textFieldConfirmContra.value,textFieldContra.value));
// //Ti.API.info('validUsername'+validUsername(textFieldUser.value));
	if(validPickers() && validName(textFieldNombre.value) && validLastName(textFieldApaterno.value) && validEmail(textFieldEmail.value) && validCp(textFieldCP.value) && validContra(textFieldConfirmContra.value,textFieldContra.value) && validUsername(textFieldUser.value)){
	
	var dialog = Ti.UI.createAlertDialog({
    cancel: 1,
    buttonNames: ['Aceptar', 'Cancelar'],
    message: 'Estoy de acuerdo con los terminos y condiciones de vielite, buscalos en la versión web',
    title: 'Registro'
  });
  dialog.addEventListener('click', function(e){
    //Ti.API.info('e ' + JSON.stringify(e));
    if(e.index==0){
       
    personalInfo[0]=textFieldNombre.value;
    personalInfo[1]=textFieldApaterno.value;
    personalInfo[2]=textFieldAmaterno.value;
    personalInfo[3]=textFieldEmail.value;
    personalInfo[4]=textFieldCP.value;
    personalInfo[5]=textFieldCiudad.value;
    personalInfo[9]=textFieldUser.value;
    personalInfo[10]=textFieldContra.value;
    sendData(); 
    }
  });
  dialog.show();

	}else{
		alert("Completa los campos obligatorios con *");
	}
	
	
	//Ti.API.info(JSON.stringify(personalInfo));
	});
		
	//Acomodo en la scrollview de childs
	
	 
	mainView.add(labelTitle);
	mainView.add(labelTitle2);
	mainView.add(buttonFacebook);
	mainView.add(textFieldNombre);
	mainView.add(textFieldApaterno);
	mainView.add(textFieldAmaterno);
	mainView.add(textFieldEmail);
	mainView.add(textFieldCiudad);
	mainView.add(textFieldCP);
	mainView.add(labelFechaNac);
	isAndroid ? mainView.add(pickerFecha) : mainView.add(buttonFecha);
	mainView.add(labelSexo);
	isAndroid ? mainView.add(pickerSexo) : mainView.add(buttonSexo);
	mainView.add(textFieldUser);
    mainView.add(textFieldContra);
    mainView.add(textFieldConfirmContra);
	mainView.add(buttonSiguiente);
	scrollView.add(mainView);
	self.add(scrollView);
	
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