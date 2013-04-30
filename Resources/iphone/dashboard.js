
function createDashboard(){
  
var vielite = require('utils/global').getGlobals();

var  qr, optionsOpen;
var notifN=0;

var Settings="", peObject ="";
var intWObj = require("intereses/interesesWindow");
var wlWObj = require("wishlist/wishlistWindow");
var decorator = require("utils/decorators");
var pdObj = require("empresarial/vbrands");
var socialWindowObj=require('social/socialWindow');
var homeWindowObj=require('home/homeWindow');
var notificacionesObj = require('dashboard/notificaciones');
var buscarObj = require('dashboard/buscar');

var winVielite = Ti.UI.createWindow({
	navBarHidden: true,
	title:"Dashboard"
});


var settingsBtn = Ti.UI.createView({
	backgroundImage:"images/buttons/configuracion.png",
	width:30,
    height:28
});
settingsBtn.addEventListener('click', openSettingsDialog);
var notifBtn = Ti.UI.createButton({
    backgroundImage:"images/buttons/notificaciones.png",
    width:30,
    height:28
});
var notifBtnOn = Ti.UI.createButton({
    backgroundImage:"images/buttons/notificacionesOn.png",
    width:30,
    color:"#005890",
    height:28
});
var dashboardBtn = Ti.UI.createView({
    backgroundImage:"images/dashboard/dashboard.png",
    width:30,
    height:28
});
dashboardBtn.addEventListener('click', function(e){
    scrollableView.scrollToView(1);
});

notifBtn.addEventListener('click', function(e){
    scrollableView.scrollToView(0);
});
notifBtnOn.addEventListener('click', function(e){
    scrollableView.scrollToView(0);
});


var winDash = Ti.UI.createWindow({
	navBarHidden: false,
	backgroundColor:'white',
	title:'Dashboard',
    titleImage: 'images/title.png',
    barImage: "images/empresarial/BarraTitulo.png",
    rightNavButton: settingsBtn,
    leftNavButton: notifBtn
}); 



var navMain = Titanium.UI.iPhone.createNavigationGroup({
	backgroundColor: '#FFF',
    backgroundImage: 'images/bar.png',
    backButtonTitleImage: 'images/buttons/dashboard.png',
	window: winDash
});
winVielite.add(navMain);

vielite.ui.navigation.setContainer(navMain);
var data = [];


//Ti.API.info("userTYpe: "+vielite.data.user.userType);


	
	var labels = [
	'HOME',
	'PERFIL', 
	'WISHLIST', 
	'CODIGO QR', 
	'INTERESES',
	'V-BRANDS'
    ];
    var icons = [
    'home',
    'perfil', 
    'wishlist', 
    'qr', 
    'intereses',
    'Vbrands'
    ];
	

var dashboard = Ti.UI.createView({
	width: (decorator.screenWidth-50),
	height: decorator.trueHeight,
	layout: "horizontal"
});
for(var i = 0, j = labels.length; i < j; i++){

	var item = Ti.UI.createButton({
		width: "50%",
		height: "33%",
		action: labels[i],
		style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	});
	item.add(Ti.UI.createImageView({
		width: 84,
		height: 69,
		backgroundImage: 'images/dashboard/' + icons[i] + '.png',
		touchEnabled: false
	}));
	item.add(Ti.UI.createLabel({
		bottom: 10,
		height: 20,
		text: labels[i],
		textAlign: 'center',
		color: '#999999',
		touchEnabled: false,
		font: {
			fontSize:14 ,fontFamily: 'Source Sans Pro', fontWeight:"bold"
		}
	}));
	dashboard.add(item);
}


var loadingView = decorator.loadingIndicator();
winDash.add(loadingView);


function openWindow(w){
    vielite.ui.navigation.open(w);
}
function closeWindow(w){
    vielite.ui.navigation.close(w);
}

function fireHome(){
    var windowHome=new homeWindowObj({
        id:vielite.data.user.userID,
         stopLoading:function(){ loadingView.hide();},
         openW:openWindow,
         closeW:closeWindow
         });
     vielite.ui.navigation.open(windowHome);
}
winVielite.fireHome = fireHome;

dashboard.addEventListener('singletap', function(evt){
	
    loadingView.show();

	
	switch(evt.source.action){
		case 'PERFIL':

     var socialHome=new socialWindowObj({
         id:vielite.data.user.userID,
         stopLoading:function(){ loadingView.hide();},
         openW:openWindow,
         closeW:closeWindow
         });
     vielite.ui.navigation.open(socialHome);
			break;
		case 'HOME':
     fireHome();
			break;
		case 'WISHLIST':
		//Ti.API.info("open wish");
			var wlw = new wlWObj({
                stopLoading:function(){ loadingView.hide();},
                open:openWindow,
                id:vielite.data.user.userID
            }); 
            
            vielite.ui.navigation.open(wlw);
			break;
		case 'V-BRANDS':
			
			var pd = new pdObj({
			    closeWindow:closeWindow,
			    stopLoading:function(){ loadingView.hide();},
			    openWindow:openWindow
			});
			vielite.ui.navigation.open(pd);
			
			break;
		case 'INTERESES':
			
			var iw = new intWObj({
			    id:vielite.data.user.userID,
			    fullControls:true,
			    stopLoading:function(){ loadingView.hide();}
			}); 
			vielite.ui.navigation.open(iw);
			//Ti.App.fireEvent("actInd");
			break;
		case 'CODIGO QR':
			if(qr == null){
				qr = require('ui/qr');
			}
			var qrW = new qr({
			     'openW':openWindow,
         'closeW':closeWindow
			});
			vielite.ui.navigation.open(qrW);
			loadingView.hide();
			break;
	}
	
});

var notificaciones = new notificacionesObj({
    id:vielite.data.user.userID,
     closeW:closeWindow,
     openW:openWindow
});
var buscar = new buscarObj({
    id:vielite.data.user.userID,
     closeW:closeWindow,
     openW:openWindow
});

var scrollableView = Ti.UI.createScrollableView({
    height:'100%',
  views:[notificaciones,dashboard,buscar],
  showPagingControl:false,
  disableBounce:true,
  lastPage:1
});
scrollableView.setCurrentPage(1);


/////////////////////////////////////////////////////////
///////  SWIIIPEE EVEENTSSS     ///////////////
scrollableView.addEventListener("scrollEnd",function(e){
    if(e.currentPage!=1){
        
        winDash.setLeftNavButton(dashboardBtn);
        if(e.currentPage==0 && e.source.lastPage!=0){
            buscar.desactivar();
            notifN=0;
            notifBtnOn.setTitle("");
            notificaciones.refresh(true);
        }
    }else{
        buscar.desactivar();
       notifN==0 ? winDash.setLeftNavButton(notifBtn) : winDash.setLeftNavButton(notifBtnOn);
        //Ti.API.info("morph2");
    }
    e.source.lastPage=e.currentPage;
});

winDash.add(scrollableView);



function openSettingsDialog(){
	if(optionsOpen){
		return;
	}
	optionsOpen = true;
	var options = [
		L('edit_profile'),
		L('change_photo'),
		L('logout'),
		L('cancel')
	];
	var dialog = Ti.UI.createOptionDialog({
		titleid: 'settings',
		options: options,
		destructive: 2, //2
		cancel: 3 //3
	});

	dialog.addEventListener('click', settingsDialogSelection);
	dialog.show();
}

function settingsDialogSelection(evt){
	optionsOpen = false;
	switch(evt.index){
		case 0:
			 if(Settings=="") Settings 	= require('ui/windows/settings/settings').init();
			settingsWin 	= Settings.ui;
			navMain.open(settingsWin);
			break;
		case 1:
			_changePhoto();
			break;
		case 2: 
			closeAll();
			break;
	}
}



function _changePhoto(){
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
				allowEditing: true,
				animated: true,
				saveToPhotoGallery: true,
				mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
				success: function(e){
					var PhotoWindow = require('ui/windows/settings/profileImage');
					var photo = new PhotoWindow({ image: e.media });
						vielite.ui.navigation.open(photo.ui);
				}
			});
			break;
		case 1:
			Ti.Media.openPhotoGallery({
				allowEditing: true,
				animated: true,
				success: function(e){
					var PhotoWindow = require('ui/windows/settings/profileImage');
					var photo = new PhotoWindow({ image: e.media });
					vielite.ui.navigation.open(photo.ui);
				}
			});
	}
}

function openLink(e) {
    //Ti.API.info(e.message);
   var ww = decorator.webview({
    url:e.message
   });
   ww.open();
    }
    
Ti.App.addEventListener('app:openLink', openLink);

function openMencion(e) {
    //Ti.API.info(e.message);
    var indexAt=e.message.indexOf("@");
    indexAt++;
     var url = "http://www.vielite.com/ws_username_2_id.php?username="+e.message.substr(indexAt);
     //Ti.API.info(url);
 var client = Ti.Network.createHTTPClient({
     onload : function(e) {
       //Ti.API.info("abriendo mencion id "+this.responseText);
       var res = this.responseText;
       res=JSON.parse(res);
      
      if(res.idUser[0].tipoUser=="normalUser"){
          
           var socialHome=new socialWindowObj({
         id:res.idUser[0].id,
         stopLoading:function(){ },
         openW:function(){ },
         closeW:function(){ }
         });
     vielite.ui.navigation.open(socialHome);
          
      }else if(res.idUser[0].tipoUser=="empresarial"){
          var url = "http://www.vielite.com/ws_perfil_empresa_home.php?id="+res.idUser[0].id;
 var client = Ti.Network.createHTTPClient({
     onload : function(e) {
       //Ti.API.info("perfil empresa "+this.responseText);
       
        if(peObject=="") peObject = require('controllers/perfilEmpresarial');
           var pe = new peObject.mainWindow(this.responseText);
        pe.open({transition: Titanium.UI.iPhone && Titanium.UI.iPhone.AnimationStyle.CURL_DOWN});
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         alert("Error de conexión.")
     },
     timeout : 10000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
           
      }
           
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         alert("Error de conexión.")
     },
     timeout : 10000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
    
    }
    Ti.App.addEventListener('app:openMencion',openMencion);

function closeAll() {
	winVielite.close();
	winVielite.remove(navMain);
	qr=null;
	Ti.App.removeEventListener('app:openLink', openLink);
	Ti.App.removeEventListener('app:openMencion',openMencion);
	Ti.App.fireEvent("session:logout");
}

	loadingView.hide();
	
	winVielite.morphNotifBtn = function(e){
	    winDash.setLeftNavButton(notifBtnOn);
    notifBtnOn.setTitle(notifN);
	};
	
	winVielite.addNotif = function(e){
    notifN++;
    };
	
	return winVielite;
	

}

module.exports = createDashboard;