
/*Escoger el area donde te encuentras para filtrar el directorio*/
var UI 			= require('utils/ui');
var area='';
var isAndroid	= Ti.Platform.osname == 'android';

///		Http Webservice	 mandar el formulario	///
function getData(picker){
	
	var url="http://www.vielite.com/ws_areas.php";
	
	var client = Ti.Network.createHTTPClient({
         // function called when the response data is available
         onload : function(e) {
         	 
         	//Ti.API.info(this.responseText);
         	
         	loadPicker(this.responseText,picker);
         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
             Ti.API.error(e.error);
             
         },
         timeout : 15000  // in milliseconds
     });
     // Prepare the connection.
     client.open("GET", url);
     // Send the request.
     client.send(); 
	
}

function loadPicker(params,picker){
	var arrayCds=JSON.parse(params);
	area=arrayCds.areas;
	var picker_data = [];
		for(var i = 0, j = arrayCds.areas.length; i < j; i++){
			picker_data.push(Ti.UI.createPickerRow({ title: arrayCds.areas[i].municipio }));
		}
		 
		picker.add(picker_data);
	
}

module.exports = function(vielite){
	var cd='';
	//Window
	var self = Ti.UI.createWindow({
		backgroundImage: '/images/login/bg.png',
		barColor:'#3A6F8F',
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
    
    
    /////		LABELS		////
    var labelTitle = Ti.UI.createLabel({
	  font: { fontSize:24},
	  color: 'white',
	  text: L('selArea_title'),
	  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	  top: 30,
	  width: 'auto', height: 'auto'
	});
	var labelTitlee = Ti.UI.createLabel({
	  font: { fontSize:34, fontWeight : 'bold' },
	  color: 'white',
	  text: L('selArea_titlee'),
	  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	  top: 0,
	  width: 'auto', height: 'auto'
	});
	
	
///		Botones		////
	
	var buttonSiguiente= UI.Buttons({
		title: L('login'),
		top:60,
		width: '80%',
		backgroundImage : '/images/login/buttonFP.png',
		borderRadius: 2
		
	});
	
	//save all data and send it
	buttonSiguiente.addEventListener('click', function(e){
	//Ti.API.info('cd¡¡¡¡¡¡ '+ JSON.stringify(cd));
	if(cd==''){
		alert("Escoge un area");
	}else{
	    
			Ti.App.Properties.setString('ciudad', JSON.stringify(cd));
			var publicDirectory = require('controllers/publicDirectory').publicDirectory;
	pd = new publicDirectory({
				login : function(){Ti.App.fireEvent("session:asklogin")},
				headerBar : true
				});
	self.close();
	pd.open();
	
			
		}
	
	});
	
	var buttonArea= UI.Buttons({
		title: '...',
		top :5,
		height : 35,
		width: '80%',
		borderRadius:2,
		backgroundImage : null,
		backgroundColor : 'white',
		color : '#3A6F8F'
		
	});
	
	
	/// Imagenes		////
	var logo = UI.ImageView({
	height: Ti.UI.SIZE,
	width: Ti.UI.SIZE,
	top: 10,
	image: '/images/login/logo.png'
});

var upperSeparator = UI.ImageView({
	height: Ti.UI.SIZE,
	width: Ti.UI.SIZE,
	top: 10,
	image: '/images/login/line.png'
});

var bottomSeparator = UI.ImageView({
	height: Ti.UI.SIZE,
	width: Ti.UI.SIZE,
	top: 30,
	image: '/images/login/line.png'
});

///		Picker		///
	var genres =  [
		'Selecciona un municipio'
	];
	
	var info={
				hideChild: true,
				pickerType: Ti.UI.PICKER_TYPE_PLAIN, 
				pickerData: genres,
				callback: function(value){
					//Ti.API.info(value);
					//Ti.API.info(area[value-1]);
					cd= value>0 ? area[value-1] : '';
					buttonArea.title= value>0 ? area[value-1].municipio : '...';
									}
							};
	var pickerArea;
	if(isAndroid){
		pickerArea	= Ti.UI.createPicker({
			top : 5
		});
		pickerArea.addEventListener('change', function(e){
			//Ti.API.info('picker '+e.row.title);
			cd=e.row.title;
		})
	}else{
			pickerArea = UI.Picker({
							data: info.pickerData,
							type: info.pickerType,
							callback: info.callback,
							//value: list[i].valueData
						});
	}

						
		
	if(!isAndroid){
		self.add(pickerArea.container);
		 buttonArea.addEventListener('click', function(e){
		pickerArea.slideInCallback();
		 });	
	}
	
	isAndroid ? getData(pickerArea) : getData(pickerArea.picker);
		
	//Acomodo en la scrollview de childs
	self.add(scrollView);
	
	scrollView.add(logo);
	scrollView.add(upperSeparator);
	scrollView.add(labelTitle);
	scrollView.add(labelTitlee);
	isAndroid ? scrollView.add(pickerArea) : scrollView.add(buttonArea);
	scrollView.add(bottomSeparator);
	scrollView.add(buttonSiguiente);
	
	
	
	
	return {
		self: self,
		open: function(){
			self.open();
		}
	};
};