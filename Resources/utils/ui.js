/*global require Ti */

//Guardar en variables:

var iPad	= Ti.Platform.osname == 'ipad';
var iPhone	= Ti.Platform.osname == 'iphone';
var Android	= Ti.Platform.osname == 'android';


//========================================================
exports.TABLE_GROUPED = (iPhone || iPad) ? Ti.UI.iPhone.TableViewStyle.GROUPED : '';
exports.TABLE_PLAIN = (iPhone || iPad) ? Ti.UI.iPhone.TableViewStyle.PLAIN : '';
exports.DISCLOSURE_BUTTON = iPhone ? Ti.UI.iPhone.SystemButton.DISCLOSURE : '';

exports.SIZE = Ti.UI.SIZE;
exports.FILL = Ti.UI.FILL;
//========================================================
// Especifico de android
var A = {};
A.Button = function(params) {
	params.height = params.height || 50;
	return Ti.UI.createButton(params);
};
A.Toolbar = function(params) {
	params.height = 50;
	params.backgroundColor = '#ccc';
	return Ti.UI.createView(params);
};

exports.siteLocation = function() {
	
	//var siteLocation = 'http://localhost:8888/vielite/'
	// var siteLocation = 'http://192.168.0.197:8888/vielite/'
	// var siteLocation = 'http://192.168.0.124:8080/vielite/'
	var siteLocation = 'http://www.vielite.com/'
	return siteLocation;
};

exports.webView = function(params) {
	params = params || {};
	return Ti.UI.createWebView(params);
};
exports.textField = function(params) {
	params = params || {};
	return Ti.UI.createTextField(params);
};

exports.Switch = function(params) {
	params = params || {};
	return Ti.UI.createSwitch(params);
};

exports.TabbedBar = function(params) {
	params = params || {};
	return Ti.UI.IOS.createTabbedBar(params);
};
exports.Table = function(params) {
	params = params || {};
	return Ti.UI.createTableView(params);
};

exports.TableRow = function(params) {
	params = params || {};
	return Ti.UI.createTableViewRow(params);
};
exports.NavigationGroup = function(params) {
	params = params || {};
	return Ti.UI.iPhone.createNavigationGroup(params);
};
exports.OptionDialog = function(params) {
	params = params || {};
	return Ti.UI.createOptionDialog(params);
};
exports.TextArea = function(params) {
	params = params || {};
	return Ti.UI.createTextArea(params);
};
exports.ScrollView = function(params) {
	params = params || {};
	return Ti.UI.createScrollView(params);
};
exports.ScrollableView = function(params) {
	params = params || {};
	return Ti.UI.createScrollableView(params);
};
exports.View = function(params) {
	params = params || {};
	return Ti.UI.createView(params);
};
exports.ImageView = function(params) {
	params = params || {};
	return Ti.UI.createImageView(params);
};
exports.TextField = function(params) {
	params = params || {};
	return Ti.UI.createTextField(params);
};

exports.Matrix2D = function(params) {
	params = params || {};
	return Ti.UI.create2DMatrix(params);
};
exports.Alert = function(params, callback) {
	params = params || {};
	callback = callback || function() {};
	var _alert = Ti.UI.createAlertDialog(params);
	_alert.addEventListener('click', callback);
	return _alert;
};

exports.Dashboard = function(params) {
	params = params || {};
	if(iPhone) {
		return Ti.UI.createDashboardView(params);
	} else if(Android) {
		return A.Button(params);
	} else {
		return Ti.UI.createButton(params);
	}
};
exports.DashboardItem = function(params) {
	params = params || {};
	if(iPhone) {
		return Ti.UI.createDashboardItem(params);
	} else if(Android) {
		return A.Button(params);
	} else {
		return Ti.UI.createButton(params);
	}
};
exports.Buttons = function(params) {
	params = params || {};
	if(iPhone) {
		params.height = params.height || 44;
		return Ti.UI.createButton(params);
	} else if(Android) {
		return A.Button(params);
	} else {
		return Ti.UI.createButton(params);
	}
};
exports.Label = function(params) {
	params = params || {};
	params.color = params.color || 'black';
	return Ti.UI.createLabel(params);
};


exports.ButtonBar = function(params) {
	params = params || {};
	if(iPhone) {
		params.height = params.height || 44;
		return Titanium.UI.createButtonBar(params);
	} else if(Android) {
		return A.Button(params);
	} else {
		return Ti.UI.createButton(params);
	}
};
exports.rowFooter = function(params, callback){
	var rowFooter = Ti.UI.createView({
		backgroundImage: 'images/row_footer.png',
		width: 310,
		height: 23,
		bottom: 0
	});
	var _title = params.title;
	var _subtitle = params.subtitle;
	var titleLabel = Ti.UI.createLabel({
		text: _title,
		font: {
			fontSize:16,
			fontWeight: 'bold'
		},
		color: 'black',
		top:10,
		left: 10,
		width:250,
		height: Ti.UI.SIZE
	});
	var subtitleLabel = Ti.UI.createLabel({
		top:5,
		left:10,
		text: _subtitle,
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE,
		color:'lightGray'
	});
	var moneyLabel = Ti.UI.createLabel({
		right:10,
		text: _money,
		color:'#4072aa',
		width:Ti.UI.SIZE,
		height:Ti.UI.SIZE
	});
	
	var view = Ti.UI.createView({
		width:Ti.UI.FILL,
		height:Ti.UI.FILL,
		layout:'vertical'
	});
	view.add(titleLabel);
	view.add(subtitleLabel);
	var row = Ti.UI.createTableViewRow({
		height: 70,
		backgroundColor: 'white',
		hasChild:true,
		className: 'cuentas_row'
	});
	row.add(view);
	row.add(moneyLabel);
	return row;
};

exports.Tab = function(params) {
	params = params || {};
	return Ti.UI.createTab(params);
};
exports.TabGroup = function(params) {
	params = params || {};
	return Ti.UI.createTabGroup(params);
};

exports.ToolBar = function(params) {
	params = params || {};
	if(Android) {
		return A.Toolbar(params);
	} else {
		return Ti.UI.createToolbar(params);
	}
	var v = UI.Toolbar();
};

exports.WebView = function(params) {
	params = params || {};
	return Ti.UI.createWebView(params);
};

exports.Picker = function(params){
	params = params || {};
	var rowIndex;
	var picker_view = Titanium.UI.createView({
		height:251,
		bottom:-251,
		backgroundColor:'silver',
		zIndex: 1000
	});
	 
	 var done =  Titanium.UI.createButton({
		title: L('Done')
	});
	if(Android){
		var cancel =  Titanium.UI.createButton({
		title: L('Cancel')
	});
	 
	}else{
	
	var cancel =  Titanium.UI.createButton({
		title: L('Cancel'),
		style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});
	 
	
	 
	var spacer =  Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	 
	 var toolbar =  Ti.UI.iOS.createToolbar({
		 top: 0,
		 items:[cancel,spacer,done]
	 });
	 picker_view.add(toolbar);
	} 
	  
	var picker = Titanium.UI.createPicker({
		top:43,
		type: params.type,
		selectionIndicator: true
	});
	
	if(params.data){
		var picker_data = [];
		for(var i = 0, j = params.data.length; i < j; i++){
			picker_data.push(Ti.UI.createPickerRow({ title: params.data[i] }));
		}
		 
		picker.add(picker_data);
	}
	 
	
	picker_view.add(picker);

	//Animations
	var slide_in =  Titanium.UI.createAnimation({bottom:0});
	var slide_out =  Titanium.UI.createAnimation({bottom:-251});

	var callback = function(){
		picker_view.animate(slide_in);
	};
	 
	cancel.addEventListener('click',function() {
		picker_view.animate(slide_out);
	});

	picker.addEventListener('change', function(e){
		rowIndex = e.rowIndex;
	})

	done.addEventListener('click',function(e) {
		if(params.callback){
			if(picker.type === Ti.UI.PICKER_TYPE_DATE && picker.value){
				params.callback(picker.value);
			} else {
				params.callback(rowIndex);
			}
		}
		picker_view.animate(slide_out);
	});

	return{
		container: picker_view,
		picker: picker,
		slideInCallback: callback
	};
}

exports.getDate=function(){
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var seconds = currentTime.getSeconds();
	 
	return year + '-' + month + '-' + day + '_' + hours + ':' + minutes + ':' + seconds ;
} 


function openProfile(data){
	var vielite = require('utils/global').getGlobals();
	if(vielite.data.currentProfile[vielite.data.currentProfile.length - 1] != data.userID){
		Ti.App.Properties.setString('BND_Actualizacion','1');
		var profiles = require('ui/profile').init(data);
		vielite.ui.navigation.open(profiles);
	}
}

/*
 *   creates and return a profile name label with an event to open the main profile window
 * 	 @params {params.profileInfo profileInfo}
 *	 @params {params.style style}
 */
exports.ProfileName = function(params){
	var settings = params || {};
	if(settings.profileInfo){
		var label = Ti.UI.createLabel(settings.style || {
			height: '15',
			width: 'auto',
			top: 8,
			left: 88,
			action: 'profileInfo',
			color: '#3333AA',
			font: {
				fontFamily: 'Verdana-Bold',
				fontSize: 12
			}
		});
		label.addEventListener('click', function(evt){
			openProfile(settings.profileInfo);
		});
		return label;
	} else {
		return false
	}
}

/*
 * Replaces the current style properties for the new ones specified
 */
exports.replaceStyle = function(component, style){
	if(component && style){
		for(var key in style){
			component[key] = style[key];
		}
	}
}

/*
 *   creates and return a profile avatar imageView with an event to open the main profile window
 * 	 @params {params.profileInfo profileInfo}
 *	 @params {params.style style}
 */
exports.ProfileAvatar = function(params){
	var settings = params || {};
	if(settings.profileInfo){
		var image = Ti.UI.createImageView(settings.style || {
			action: 'profileInfo',
			width: 'auto',
			height: 'auto',
			left: 10,
			borderColor: '#88d',
			borderRadius: 3,
		});
		image.addEventListener('click', function(evt){
			openProfile(settings.profileInfo);
		});
		return image;
	} else {
		return false
	}
}

exports.ActivityIndicator = function(params){
	return Ti.UI.createActivityIndicator(params || {
		color: '#000',
		style:Ti.UI.iPhone.ActivityIndicatorStyle.LIGHT,
		height: 'auto',
		width: 'auto',
		zIndex: 999
	});
}


//////////////////////////////
exports.addPullToRefresh = function(tableview, reload, oldLoad) {
	var pulling = false;
	var reloading = false;
	var oldloading = false;
	var lastRow = tableview.data.length;
	var data;
	var pushing = false;
	
	
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
			setTimeout(function(e){oldloading=false},7500);
			oldLoad();
		} else {
			//setTimeout(endReloading, 2000);
		}
	}
	
	function endReloading() {
		lastRow = tableview.data.length;
		tableview.setContentInsets({top:0},{animated:true});
		reloading = false;
		lastUpdatedLabel.text = L('last_updated')+formatDate();
		statusLabel.text = L('pull_to_refresh');
		actInd.hide();
		arrow.show();
		//if (tableview.last_id != null)
			//Ti.API.info("[DATA] Last post loaded: " + tableview.last_id);
	}
	tableview.addEventListener('data:finishreloading', endReloading);

	tableview.addEventListener('scroll',function(e) {
		var offset = e.contentOffset.y;
		if (offset <= -65.0 && !pulling) {
			pulling = true;
			var t = Ti.UI.create2DMatrix();
			t = t.rotate(-180);
			arrow.animate({transform:t,duration:180});
			statusLabel.text = L('release_to_refresh');
		} else if (pulling && offset > -65.0 && offset < 0) {
			pulling = false;
			var t = Ti.UI.create2DMatrix();
			arrow.animate({transform:t,duration:180});
			statusLabel.text = L('pull_to_refresh');
		}
		
		if ((e.size.height+offset) >= (e.contentSize.height+70) && !pushing) {
			pushing = true;		
		
			if(!reloading)beginOldLoad();
			//cw.opacity=0.5;	
		
			////Ti.API.info("activado push");
		
		}else if ((e.size.height+offset) <= (e.contentSize.height+10) && pushing) {
			 pushing = false;
			////Ti.API.info("desactivando push");
		 }
	});
	
	tableview.addEventListener('dragEnd',function(e) {
		if (pulling && !reloading) {
			reloading = true;
			pulling = false;
			arrow.hide();
			actInd.show();
			statusLabel.text = L('reloading');
			tableview.setContentInsets({top:60},{animated:true});
			arrow.transform=Ti.UI.create2DMatrix();
			beginReloading();
		}
	});
	var border = Ti.UI.createView({
		backgroundColor:"#000",
		height:2,
		bottom:0
	});
	
	var tableHeader = Ti.UI.createView({
		backgroundColor:"#333",
		width:320,
		height:60
	});
	
	var arrow = Ti.UI.createView({
		backgroundImage:"images/whiteArrow.png",
		width:23,
		height:60,
		bottom:10,
		left:20
	});
	
	var statusLabel = Ti.UI.createLabel({
		text: L('pull_to_refresh'),
		left:55,
		width:200,
		bottom:30,
		height: Ti.UI.SIZE,
		color:"#CCC",
		textAlign:"center",
		shadowColor:"#999",
		shadowOffset:{
			x:0,
			y:1
		},
		font:{
			fontFamily: 'Helvetica-Bold',
			fontSize:12
		}
	});
	
	var lastUpdatedLabel = Ti.UI.createLabel({
		text: L('last_updated')+formatDate(),
		left:45,
		width:220,
		bottom:15,
		height: Ti.UI.SIZE,
		color:"#DDD",
		textAlign:"center",
		font:{
			fontFamily: 'Helvetica',
			fontSize:11
		},
		shadowColor:"#999",
		shadowOffset:{
			x:0,
			y:1
		}
	});
	var actInd = Titanium.UI.createActivityIndicator({
		left:20,
		bottom:13,
		width:30,
		height:30
	});
	
	tableHeader.add(border);
	tableHeader.add(arrow);
	tableHeader.add(statusLabel);
	tableHeader.add(lastUpdatedLabel);
	tableHeader.add(actInd);
	tableview.headerPullView = tableHeader;
	

};
function formatDate() {
	var date = new Date();
	var datestr = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ';
	if (date.getHours() >= 12) {
		datestr += (date.getHours() == 12 ? date.getHours() : date.getHours() - 12) + ':' + date.getMinutes() + L('pm');
	} else {
		datestr += date.getHours() + ':' + date.getMinutes() + L('am');
	}
	return datestr;
}	
///////////////////////////////////////
exports.Win = function(params) {
	var G = require('utils/global');
	params = params || {};
	// especifico de android:
	params.fullscreen = params.fullscreen || false;
	params.backgroundColor = params.backgroundColor || 'white';
	if(iPhone || iPad) {
		params.barColor = params.barColor || '#3A6F8F';
	}
	var win = Ti.UI.createWindow(params);
	
	function openEvent() {
		win.removeEventListener('open', openEvent);

		G.CurrentWindow = win;
		if(win.isActivity) {
			var activity = win.activity;
			G.CurrentActivty = activity;
			G.isAndroidInBackground = false;
			
			if(activity.addEventListener) {
			
				activity.addEventListener('resume', function() {
					G.isAndroidInBackground = false;
				});
				activity.addEventListener('pause', function() {
					G.isAndroidInBackground = true;
				});
			
			
			}
		}
	}

	function closeEvent() {
		win.removeEventListener('close', closeEvent);
	}


	win.addEventListener('close', closeEvent);
	win.addEventListener('open', openEvent);
	return win;
};
