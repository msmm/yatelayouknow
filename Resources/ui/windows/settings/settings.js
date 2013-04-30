exports.init = function(params){
	var settings = params || {};
	var siteLocation=require('utils/ui').siteLocation();
	var UI;
	var vielite;
	var window;
	var wrapper;

	//secondary windows
	var personalInfo;
	var privacy;
	var notifications;
	var facebook;
	var policies;

	var countries;
	var professions, cargos;
	var genres =  [
		L('male'),
		L('female')
	];
	Ti.include('ui/windows/settings/style.js');
	
	_settings();
	function _settings(){
		var settingsList = [
			[	
				'personal_info',
				'Configurar_Servicios'
			], [
				'privacy',
				// 'notifications'
			], [
				'Encuentra_amigos'
			]
		];
		UI 			= require('utils/ui');
		vielite 	= require('utils/global').getGlobals();
		window 		= UI.Win(style[vielite.platform].win);
		window.title = L('settings');
		wrapper 	= UI.Table(style[vielite.platform].list);
		var list 	= [];
		for(var i = 0, j = settingsList.length; i < j; i++){
			var section = Ti.UI.createTableViewSection();
			var data 	= _getRowList(settingsList[i]);
			for(var a = 0, b = data.length; a < b; a++){
				section.add(data[a]);
			};
			list.push(section);
		}
		wrapper.data = list;
		wrapper.addEventListener('click', _openWindow);
		window.add(wrapper);
		_fillCountries();
		_fillProfessions();
		_fillCargos();
	}

	function _openWindow(evt){
		var windowToOpen;
		var userData;
		switch(evt.source.action){
			case 'personal_info':
				_initPersonalInfo();
				_getPersonalInfoData();
				windowToOpen = personalInfo;
				break;
			case 'privacy':
				userData = _getPrivacyData();
				_initPrivacy(userData);
				windowToOpen = privacy;
				break;
			case 'notifications':
				userData = _getNotificationsData();
				_initNotifications(userData);
				windowToOpen = notifications;
				break;
			case 'Encuentra_amigos':
				
				windowToOpen = _encontrarAmigos();
				
				break;
			case 'Configurar_Servicios':
			
				windowToOpen = 	_initConexiones();
				break;
			case 'policies':
				userData = _getPoliciesData();
				_initPolicies(userData);
				windowToOpen = policies;
		}
		windowToOpen.window.title = L(evt.source.action);
		vielite.ui.navigation.open(windowToOpen.window);
	}


	function _getRowList(list){
		var data = [];
		for(var i = 0, j = list.length; i < j; i++){
			var title = list[i].title ? list[i].title : list[i];
			var row = UI.TableRow({
				action: list[i].action ? list[i].action : title,
				backgroundColor:'white',
				hasChild: !list[i].hideChild
			});
			if(list[i].hideChild){
				row.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
			}
			var titleLbl 	= UI.Label(style[vielite.platform].rowTitle);
			titleLbl.text 	= L(title);
			row.add(titleLbl);

			if(list[i].type){
				UI.replaceStyle(titleLbl, style[vielite.platform].rowSubtitle);
				var component;
				switch(list[i].type){
					case 'password':
						var isPassword = true;
						break;
					case 'field':
						component = UI.TextField(style[vielite.platform].rowField);
						component.passwordMask = isPassword;
						component.value = list[i].valueData;
						//Ti.API.info("index "+i+" "+list[i].keyboardType);
						component.keyboardType = (list[i].keyboardType ? list[i].keyboardType : Titanium.UI.KEYBOARD_DEFAULT);
						component.hintText = L(title);
						if(list[i].callback){
							component.addEventListener('blur', list[i].callback);
						}
						break;
					case 'button':
						component = UI.Buttons(style[vielite.platform].rowButton);
						component.title = list[i].valueData;
						if(list[i].callback){
							component.addEventListener('click', list[i].callback);
						}
						break;
					case 'label':
						component = UI.Label(style[vielite.platform].rowLabel);
						component.text = list[i].valueData;
						if(list[i].callback){
							component.addEventListener('click', list[i].callback);
						}
						break;
					case 'switch':
						component = UI.Switch(style[vielite.platform].rowSwitch);
						component.value = list[i].valueData;
						if(list[i].callback){
							component.addEventListener('change', list[i].callback);
						}
						break;
					case 'picker':
						var component = UI.Buttons(style[vielite.platform].rowButton);
						component.title = list[i].valueData;
						component.value = list[i].realValue || list[i].valueData;
						var pickerData = UI.Picker({
							data: list[i].pickerData,
							type: list[i].pickerType,
							callback: list[i].callback,
							value: list[i].valueData
						});
						component.addEventListener('click', pickerData.slideInCallback);
						list[i].pickerContainer.add(pickerData.container);
						break;
				}
				if(list[i].sourceData){
					component.sourceData = list[i].sourceData;
				}
				list[i].component = component;
				row.add(component);
			}

			data.push(row);
		}
		return data;
	}

	function _initPersonalInfo(){
		if(!personalInfo){
			var personalInfoWin = UI.Win(style[vielite.platform].win);
			//_fillCargos();
			var saveBtn = UI.Buttons(style[vielite.platform].saveBtn);
			saveBtn.addEventListener('click', _savePersonalInfo);
			personalInfoWin.rightNavButton = saveBtn;
			personalInfo = {
				window: personalInfoWin,
				save: saveBtn,
				// data: data
			}
		}
	}

	function _setPersonalInfoData(){
		if(personalInfo){
			var listWrapper = UI.Table(style[vielite.platform].list);
			var list 		= [];
			if(personalInfo.wrapper){
				personalInfo.window.remove(personalInfo.wrapper);
				personalInfo.wrapper = null;
			}
			personalInfo.window.add(listWrapper);
			personalInfo.wrapper = listWrapper;
			for(var key in personalInfo.data){
				var section = Ti.UI.createTableViewSection({
					headerTitle: L(key)
				}); 
				var rows 	= _getRowList(personalInfo.data[key]);
				for(var i = 0, j = rows.length; i < j; i++){
					section.add(rows[i]);
				}
				list.push(section);
			}
			listWrapper.data = list;
		}
	}

/////////////////
////////////////
///////
	function _savePersonalInfo(evt){
		var data = personalInfo.data;
		var personal;
		if(vielite.data.user.userType=='empresarial'){
			
			personal = {
			numCuenta: 	vielite.data.user.userID,
			nombre: 	data.personal[0].component.value,
			apaterno: 	data.personal[1].component.value,
			amaterno: 	data.personal[2].component.value,
			email: 		data.personal[3].component.value,
			celular: 	data.personal[4].component.value,
			telFijo: 	data.personal[5].component.value,
			calleNum: 	data.address[0].component.value,
			colonia: 	data.address[1].component.value,
			pais: 		data.address[2].component.value,
			estado: 	data.address[3].component.value,
			ciudad: 	data.address[4].component.value,
			cp: 		data.address[5].component.value,
			seccion: 	4
		};
			
		}else{
			
			personal = {
			numCuenta: 	vielite.data.user.userID,
			nombre: 	data.personal[0].component.value,
			apaterno: 	data.personal[1].component.value,
			amaterno: 	data.personal[2].component.value,
			fechaNac: 	data.personal[3].component.value,
			sexo: 		data.personal[4].component.value,
			email: 		data.personal[5].component.value,
			lugarNac: 	data.personal[6].component.value,
			celular: 	data.personal[7].component.value,
			telFijo: 	data.personal[8].component.value,
			calleNum: 	data.address[0].component.value,
			colonia: 	data.address[1].component.value,
			pais: 		data.address[2].component.value,
			estado: 	data.address[3].component.value,
			ciudad: 	data.address[4].component.value,
			cp: 		data.address[5].component.value,
			empresa: 	data.professional[0].component.value,
			profesion: 	data.professional[1].component.value,
			seccion: 	3
		};
		
		}
			
		new App.HTTP({
			url: siteLocation + 'mobile_updateInfoPersonal.php',
			text: true,
			data: personal,
			method: 'POST',
			callback: function(request){
				
					//Ti.API.info(request.text);
				
				vielite.ui.navigation.close(personalInfo.window)
				}
		
			

		});
		
	}



	function _initPrivacy(userData){
		if(!privacy){
			var data = [
				{ title: 'username', 			type: 'field', 	valueData: vielite.data.user.displayName, hideChild: true },
				{ title: 'new_password', 		type: 'password', 	hideChild: true },
				{ title: 'confirm_password', 	type: 'password', 	hideChild: true },
				{ title: 'current_password', 	type: 'password', 	hideChild: true },
				// { 
				// 	title: 'private_account', 	
				// 	type: 'switch', 
				// 	hideChild: true,
				// }
			];
			if(userData){
				_addUserDataToData(data, userData);
			}
			var privacyWin 		= UI.Win(style[vielite.platform].win);
			var privacyList		= UI.Table(style[vielite.platform].list);
			var saveBtn = UI.Buttons(style[vielite.platform].saveBtn);
			privacyWin.rightNavButton = saveBtn;
			privacyList.data 	= _getRowList(data);
			privacyWin.add(privacyList);
			saveBtn.addEventListener('click', _savePrivacy);
			privacy = {
				window: privacyWin,
				data: data
			}
		}
	}

	function _savePrivacy(){
		var data = {
			idUser: vielite.data.user.userID,
			username: privacy.data[0].component.value,
			oldPass: privacy.data[3].component.value,
			newPass: privacy.data[1].component.value,
			confirmPass: privacy.data[2].component.value,
			// privacy: privacy.data[4].component.value,
		};
		if((data.confirmPass != data.newPass) || (data.oldPass == '')){
			alert('Las contraseñas no corresponden');
			privacy.data[3].component.value = '';
			privacy.data[2].component.value = '';
			privacy.data[1].component.value = '';
			privacy.data[1].component.focus();
			return;
		}
		data.oldPass = Ti.Utils.md5HexDigest(data.oldPass);
		data.newPass = Ti.Utils.md5HexDigest(data.newPass);
		new App.HTTP({
			method: 'POST',
			callback: function(request){
				if(request.error){
					Ti.API.error('Error [settings/save/privacy]: ' + request.data);
				} else {
					alert('Sus cambios se han guardado');
				}
			},
			url: siteLocation + 'mobile_updateUser_Pass.php',
			data: data
		});
		vielite.ui.navigation.close(privacy.window);
	}
	
	function _initNotifications(userData){
		if(!notifications){
			var data = [
				{ title: 'by_email', 	type: 'switch', hideChild: true},
				{ title: 'push', 		type: 'switch', hideChild: true}
			];
			if(userData){
				_addUserDataToData(data, userData);
			}
			var notificationsWin 		= UI.Win(style[vielite.platform].win);
			var notificationsList		= UI.Table(style[vielite.platform].list);
			notificationsList.data 		= _getRowList(data);
			notificationsWin.add(notificationsList);

			notifications = {
				window: notificationsWin,
				data: data
			}
		}
	}
	
////	Encontrar Amigos		//////
	function _encontrarAmigos(){
		//Facebook credentials
	Titanium.Facebook.appid = "422325314446439";
	Titanium.Facebook.permissions = ['publish_stream'];
	
	
////		Ventana					//////		
		var faceWin = UI.Win(style[vielite.platform].win);
		faceWin.backgroundColor="#DEDEDE";


////  		Boton (Encontrar a tus amigos)		//////

		 var tableData = [];
     var row = Ti.UI.createLabel({
        height: 40,
        width: '90%',
        text : "   Con Facebook",
        font:{ fontSize:14,fontFamily: 'Source Sans Pro', fontWeight:"bold"},
        backgroundColor : "white",
        borderWidth : 2,
        borderColor:"#cccccc",
        top:15
      });
    
			row.addEventListener('click',function()			{				 if(Titanium.Facebook.getLoggedIn()){				 Ti.Facebook.requestWithGraphPath('me/friends', {}, 'GET', function(e) {		        if (e.success) {		            //Ti.API.info(e.result);		            facebookFriends(e.result);		            //var newView=facebookFriendsView(e.result);		           //newView.open();		        } else if (e.error) {		            alert("No hay conexión");		        } else {		            alert('Respuesta desconocida');		        }		    	});				 }else{				 Ti.Facebook.authorize();				 }			});
///			Acomodo en la ventana			//////
		
		faceWin.add(row);
		
		var wind = {
			window : faceWin
		}

				return wind;
			
		}
	
	function _initConexiones(){
		//Facebook credentials
	Titanium.Facebook.appid = "422325314446439";
	Titanium.Facebook.permissions = ['publish_stream'];
	
	
////		Ventana					//////		
		var conexWin = UI.Win(style[vielite.platform].win);
		conexWin.backgroundColor="#f7f7f7";
////			Switch			////////
		var switchFb = UI.Switch({
			value: (Titanium.Facebook.getLoggedIn() ? true:false),
			top:6,
			right:5,
			width:100
		});
		
		switchFb.addEventListener('change',function(e){
		
		if(switchFb.value){
			 
			 Ti.Facebook.addEventListener('login', function(e) {
        if (e.success) {
           switchFb.value=true;
        } else if (e.error) {
            switchFb.value=false;
        } else if (e.cancelled) {
           switchFb.value=false;
        }
    });
			Ti.Facebook.authorize();
		}else{
			Ti.Facebook.logout();
		}
      	
   		 
   		 });
   	
   	var switchTw = UI.Switch({
			value: (twitter.isAuthorized() ? true:false),
			top:6,
            right:5,
            width:100
		});	
	switchTw.addEventListener('change',function(e){
		
      	if(switchTw.value){
      		twitter.authorize();
      	}else{
      		twitter.deauthorize();
      	}
   		 
   		 });
   		Ti.App.addEventListener('twWindowClosed',function(e){
   		switchTw.setValue(false);	
   		});
   	
  /////  		Label Conexion(switch)		///////
		var labelConectado = UI.Label({
		      text: '  Facebook',
		      font: { fontSize:22, fontWeight:'bold' },
		      textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		      left: 5,
		      top:7,
		      width: Titanium.UI.SIZE, height: Ti.UI.SIZE
		});
		
		var labelConectadoTw = UI.Label({
		      text: '  Twitter',
		      font: { fontSize:22, fontWeight:'bold' },
		      textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		      left: 5,
		      top:7,
		      width: 100, height: Ti.UI.SIZE
		});

        var facebHolder = Ti.UI.createView({
            height:40,
            width:300,
            top:20,
            left:10,
            borderWidth:1,
            borderColor:'#a9acb3',
            borderRadius:2,
            backgroundColor:'white',
        });
        var twHolder = Ti.UI.createView({
            height:40,
            width:300,
            top:59,
            borderWidth:1,
            borderColor:'#a9acb3',
            borderRadius:2,
            left:10,
            backgroundColor:'white',
        });

///			Acomodo en la ventana			//////
		facebHolder.add(labelConectado);
		facebHolder.add(switchFb);
		twHolder.add(labelConectadoTw);
		twHolder.add(switchTw);
		
		conexWin.add(facebHolder);
		conexWin.add(twHolder);

        
		var wind = {
			window : conexWin
		}

				return wind;
}
	
	//Match facebook friends with Vielite users
	function facebookFriends(list){
		
	var jsonList=JSON.parse(list);
	var stringQuery="";
	stringQuery=stringQuery.concat("'"+jsonList.data[0].id+"'");
	var j=jsonList.data.length;
	for(var i=1;i<j;i++) {
	stringQuery=stringQuery.concat(",'"+jsonList.data[i].id+"'");
	}
	var wsData={
		list : stringQuery,
		loggedId: vielite.data.user.userID
	}
	//Ti.API.info(stringQuery);
	
	//// 		Conection	WEB Service	///
	var client = Ti.Network.createHTTPClient({
         // function called when the response data is available
         onload : function(e) {
         	//Ti.API.info(this.responseText);
            var newView=facebookFriendsView(this.responseText);
           newView.open();
         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
             Ti.API.debug(e.error);
             
         },
         timeout : 15000  // in milliseconds
     });
     // Prepare the connection.
     client.open("POST", siteLocation + 'ws_facebookFriends.php');
     // Send the request.
     client.send(wsData); 
	
	}
	
/////	FUNCION 	Facebook Friends View	 ///////
	function facebookFriendsView(list){
		
		var jsonList=JSON.parse(list);
      
       //Ti.API.info(jsonList.users);
       
       
	///		View		////
		var view = Titanium.UI.createWindow({
		 modal: true,
		 backgroundColor:'white',
		 barColor: '#3A6F8F'
		});
		       
   ///		Close button		/////
   var closeButton = Titanium.UI.createButton({
	       systemButton:Titanium.UI.iPhone.SystemButton.DONE
        });
   closeButton.addEventListener('click',function(e){
   	view.close();
   });
   view.setLeftNavButton(closeButton);
        if(jsonList.error){
        	alert("Nada que mostrar");
        }else{

   ///		ROWS		/////     
   var CustomRow = require('ui/windows/settings/customFbRow');
   var imgRoute = siteLocation + "sites/www.vielite.com/files/images/perfil/mini_360/";
   
		// declare an array to hold your table rows
		var tbldata = [];
		// use a loop to create rows, instantiate a new custom row in each iteration
		var j=jsonList.users.length;
		for(var i=0;i<j;i++) {
			tbldata.push(new CustomRow({
				primarylabel: jsonList.users[i].nombre+ " " + jsonList.users[i].paterno,
				foto: imgRoute + jsonList.users[i].foto,
				id : jsonList.users[i].id,
				estado : jsonList.users[i].estado
			}));
		}

		// define the tableview and assign its data/rows here
		var table = Ti.UI.createTableView({
			width:Ti.UI.FILL,
			height:Ti.UI.FILL,
			top:0,
			backgroundColor:'transparent'
		});
		
		table.setData(tbldata);
		
		////		Function Seguir 	////
		function seguir(_mode, e){
			
			var data = {
				idUser: vielite.data.user.userID,
				idEmpresarial: e.source.cuenta,
				mode: _mode
				};
			
				var client = Ti.Network.createHTTPClient({
		         // function called when the response data is available
		         onload : function(http) {
		
		             //Ti.API.info("Received text: " + this.responseText);
		             var res=JSON.parse(this.responseText);
		              //Ti.API.info("json text: " + res.seguir);
		             if(res.seguir==0){
		             	e.source.backgroundImage = 'images/dejarDeSeguir.jpg';
						e.source.title = 'Siguiendo';
						e.source.mode=2;
		             }else if(res.seguir==1){
		             	e.source.backgroundImage = 'images/dejarDeSeguir.jpg';
		             	e.source.font = { fontSize: 10 };
						e.source.title = 'Solicitud Enviada';
						e.source.mode=4;
		             }else{
		             		e.source.backgroundImage = 'images/pleca.jpg';
							e.source.title = 'Seguir';
							e.source.mode=1;
		             }
		           
				
		            
		         },
			         // function called when an error occurs, including a timeout
			     onerror : function(e) {
			             alert("error en la conexión");
			     },
			      timeout : 15000  // in milliseconds
			     });
			     // Prepare the connection.
			     client.open("POST", siteLocation + 'ws_seguir.php');
			     // Send the request.
			     client.send(data); 
			     
		}
		
		
///			TableListener		////
		table.addEventListener('click', function(e){
			
			seguir(e.source.mode, e);
			
		});
		view.add(table);
		 	
        	
        	
        }
		
	return view;	
	}
	
	
	function _initPolicies(){
		if(!policies){
			var data = this.responseText;
			var policiesWin 	= UI.Win(style[vielite.platform].win);
			var policiesWrapper = UI.WebView({
				url: siteLocation + 'legal.php?userID=' + vielite.data.user.userID
			});	
			policiesWin.add(policiesWrapper);
			policies = {
				window: policiesWin
			}
		}
	}

	function _getPersonalInfoData(){
		var url= (vielite.data.user.userType=='empresarial' ? siteLocation + 'mobile_perfilEmpresarial.php?id=' + vielite.data.user.userID  : siteLocation + 'mobile_perfil.php?id=' + vielite.data.user.userID);
		
		new App.HTTP({
			method: 'GET',
			url: url,
			callback: function(request){
				//Ti.API.info("mobile_perfil "+ request.text);
				if(request.error){
					Ti.API.error('Error [settings/getPersonalInfo]: ' + request.data);
				} else {
					try{
						var xml 		= request.xml;
						var userData 	= xml.getElementsByTagName("datosUser").item(0);
						if(vielite.data.user.userType=='empresarial'){
							
							personalInfo.data = {
							personal: [
								{ 	title: 'name',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('nombre').item(0).getAttribute('value'),
									callback: _noEmptyField
								},
								{	title: 'lastname',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('apaterno').item(0).getAttribute('value'),
									callback: _noEmptyField
								},
								{	title: 'lastname2',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('amaterno').item(0).getAttribute('value'),
									callback: _noEmptyField
								},
								{	title: 'email',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('email').item(0).getAttribute('value'),
									callback: _noEmptyField
								},
								
								{	title: 'cellphone',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('celular').item(0).getAttribute('value')
								},
								{	title: 'phone',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('telFijo').item(0).getAttribute('value')
								}
							],
							address: [
								{	title: 'address_detail',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('calleNum').item(0).getAttribute('value')
								},
								{	title: 'address_detail2',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('colonia').item(0).getAttribute('value')
								},
								{	title: 'country',
									type: 'picker',
									hideChild: true,
									pickerContainer: personalInfo.window,
									pickerType: Ti.UI.PICKER_TYPE_PLAIN,
									pickerData: countries,
									valueData: _getCountry(userData.getElementsByTagName('pais').item(0).getAttribute('value') || 0),
									realValue: userData.getElementsByTagName('pais').item(0).getAttribute('value'),
									callback: function(value){
										personalInfo.data.address[2].component.title = countries[value];
										personalInfo.data.address[2].component.value = value + 1;
									}
								},
								{	title: 'state',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('estado').item(0).getAttribute('value')
								},
								{	title: 'city',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('ciudad').item(0).getAttribute('value')
								},
								{	title: 'zip_code',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('cp').item(0).getAttribute('value')
								}
							]
						};
							
						}else{
							
							personalInfo.data = {
							personal: [
								{ 	title: 'name',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('nombre').item(0).getAttribute('value'),
									callback: _noEmptyField
								},
								{	title: 'lastname',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('apaterno').item(0).getAttribute('value'),
									callback: _noEmptyField
								},
								{	title: 'lastname2',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('amaterno').item(0).getAttribute('value'),
									callback: _noEmptyField
								},
								{	title: 'birthdate',
									type: 'picker',
									hideChild: true,
									pickerContainer: personalInfo.window,
									pickerType: Ti.UI.PICKER_TYPE_DATE,
									valueData: userData.getElementsByTagName('fechaNacimiento').item(0).getAttribute('value'),
									realValue: userData.getElementsByTagName('fechaNacimiento').item(0).getAttribute('value'),
									callback: function(e){
									
										var mes=e.getMonth();
										var fecha = new Date(e.getFullYear(),mes,e.getDate());
									personalInfo.data.personal[3].component.title = fecha;
									personalInfo.data.personal[3].component.value = fecha; //+ '-' + (value.getMonth() + 1) + '-' + (value.getDate() + 0);
										//Ti.API.info(fecha.toJSON());
									}
								},
								{	title: 'gender',
									type: 'picker',
									hideChild: true,
									pickerContainer: personalInfo.window,
									pickerType: Ti.UI.PICKER_TYPE_PLAIN, 
									pickerData: genres,
									valueData: _getGenre(userData.getElementsByTagName('sexo').item(0).getAttribute('value') || 'H'),
									realValue: userData.getElementsByTagName('sexo').item(0).getAttribute('value'),
									callback: function(value){
										personalInfo.data.personal[4].component.title = genres[value];
										personalInfo.data.personal[4].component.value = value == 0 ? 'M' : 'F';
									}
								},
								{	title: 'email',
									type: 'field',
									keyboardType:Ti.UI.KEYBOARD_EMAIL,
									hideChild: true,
									valueData: userData.getElementsByTagName('email').item(0).getAttribute('value'),
									callback: _noEmptyField
								},
								{	title: 'birthplace',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('lugarNacimiento').item(0).getAttribute('value')
								},
								{	title: 'cellphone',
									type: 'field',
									hideChild: true,
									keyboardType:Ti.UI.KEYBOARD_NUMBERS_PUNCTUATION,
									valueData: userData.getElementsByTagName('celular').item(0).getAttribute('value')
								},
								{	title: 'phone',
									type: 'field',
									hideChild: true,
									keyboardType:Ti.UI.KEYBOARD_NUMBERS_PUNCTUATION,
									valueData: userData.getElementsByTagName('telFijo').item(0).getAttribute('value')
								}
							],
							address: [
								{	title: 'address_detail',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('calleNum').item(0).getAttribute('value')
								},
								{	title: 'address_detail2',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('colonia').item(0).getAttribute('value')
								},
								{	title: 'country',
									type: 'picker',
									hideChild: true,
									pickerContainer: personalInfo.window,
									pickerType: Ti.UI.PICKER_TYPE_PLAIN,
									pickerData: countries,
									valueData: _getCountry(userData.getElementsByTagName('pais').item(0).getAttribute('value') || 0),
									realValue: userData.getElementsByTagName('pais').item(0).getAttribute('value'),
									callback: function(value){
										personalInfo.data.address[2].component.title = countries[value];
										personalInfo.data.address[2].component.value = value + 1;
									}
								},
								{	title: 'state',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('estado').item(0).getAttribute('value')
								},
								{	title: 'city',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('ciudad').item(0).getAttribute('value')
								},
								{	title: 'zip_code',
									type: 'field',
									hideChild: true,
									keyboardType:Ti.UI.KEYBOARD_NUMBERS_PUNCTUATION,
									valueData: userData.getElementsByTagName('cp').item(0).getAttribute('value')
								}
							],
							professional: [
								{	title: 'company',
									type: 'field',
									hideChild: true,
									valueData: userData.getElementsByTagName('empresa').item(0).getAttribute('value')
								},
								{	title: 'profession',
									type: 'picker',
									hideChild: true,
									pickerContainer: personalInfo.window,
									pickerType: Ti.UI.PICKER_TYPE_PLAIN,
									pickerData: professions,
									valueData: _getProfession(userData.getElementsByTagName('profesion').item(0).getAttribute('value')),
									realValue: userData.getElementsByTagName('profesion').item(0).getAttribute('value'),
									callback: function(value){
										personalInfo.data.professional[1].component.title = professions[value];
										personalInfo.data.professional[1].component.value = value + 1;
									}
								}
							]
						};
							
						}
						
						_setPersonalInfoData();
					} catch(err){
						Ti.API.error('Exception [seetings/profileInfo]: ' + err);
					}
				}
			}
		});
	}


	function _getPrivacyData(){
		return null;
	}

	function _getNotificationsData(){
		return null;
	}


	function _getPoliciesData(){
		return null;
	}

	function _fillCountries(){
		if(!countries){
			countries = [];
			new App.HTTP({
				method: 'GET',
				url: siteLocation + 'mobile_listaPaises.php',
				callback: function(request){
					if(request.error){
						//Ti.API.info('Error [settings/fillCountries]: ' + request.data);
					} else {
						var xml = request.xml;
						var countriesData = xml.getElementsByTagName('listaPaises');
						for(var i = 0, j = countriesData.length; i < j; i++){
							var country = countriesData.item(i);
							countries.push(country.getAttribute('Pais'));
						}
					}
				},
			});
		}
	}

	function _fillProfessions(){
		if(!professions){
			professions = [];
			new App.HTTP({
				method: 'GET',
				url: siteLocation + 'mobile_listaProfesional.php',
				callback: function(request){
					if(request.error){
						Ti.API.error('Error [settings/professions]: ' + request.data);
					} else {
						var xml = request.xml;
						var profData = xml.getElementsByTagName('listaProfesion');
						for(var i = 0, j = profData.length; i < j; i++){
							var profession = profData.item(i);
							professions.push(profession.getAttribute('profesion'));
						}
					}
				},
			});
		}
	}
	
	//Obetener tipos de cargo
	function _fillCargos(){
		
			
		//Ti.API.info('_fillCargos_fillCargos_fillCargos_fillCargos ');
	var url="http://www.vielite.com/ws_getCargos.php";

	
	var client = Ti.Network.createHTTPClient({
         // function called when the response data is available
         onload : function(e) {
         	 //Ti.API.info('cargos '+this.responseText);
            _cargos(this.responseText);
         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
             //Ti.API.info('cargos FALLO '+JSON.stringify(e));
             Ti.API.debug(e.error);
             
         },
         timeout : 15000  // in milliseconds
     });
     // Prepare the connection.
     client.open("GET", url);
     // Send the request.
     client.send(); 
		
	}
	
	//llenar arreglo cargos
	function _cargos(response){
		cargos = [];
		var res=JSON.parse(response);
		
		for(var i=0;i<res.length;i++){
			//Ti.API.info(res[i]);
			cargos.push(""+res[i]);
		}
		
	}
	

	function _getGenre(value){
		return genres[value == 'M' ? 0 : 1];
	}

	function _getDate(value){
		var t = value.split(/[- :]/);

		// Apply each element to the Date function
		var d = new Date(t[0], t[1]-1, t[2]);
		return d.toLocaleDateString();

	}

	function _getCountry(value){
		value = value == 1 ? 2 : value;
		return countries[value - 1];
	}

	function _getProfession(value){
		return professions[value - 1];
	}

	//WARNING: Please make sure your userData empty values have -1 instead of null or undefined
	function _addUserDataToData(data, userData){
		var areTheSame = true;
		for(var key in data){
			if(!userData[key]){
				areTheSame = false;
				break;
			}
		}
		if(areTheSame){
			for(var key in data){
				_addUserDataToData(data[key], userData[key]);
			}		
		} else {
			data.valueData = (userData == -1 ? null : userData);
		}
	}

	function _noEmptyField(evt){
		if(evt.source.value == ''){
			alert(L('campo_no_vacio'));
			evt.source.focus();
		}
	}

	return{
		ui: window
	}
};