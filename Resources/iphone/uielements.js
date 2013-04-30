var Log		= require('utils/log');

exports.newWindow = function() {
	var win = Ti.UI.createWindow({
	  
	    navBarHidden: false,
	    barColor: '#3A6F8F',
	   
	    backgroundColor:'#fff',
	    
	});
	
	return win;
};
  
exports.newModalWindow = function() {
	var win = Ti.UI.createWindow({
	    navBarHidden: false,
	    modal: true,
	   
	    barColor: '#3A6F8F',
	    backgroundColor:'#fff',
	    
	});
	
	return win;
};
 
 
exports.newFlipWindow = function() {
	var win = Ti.UI.createWindow({
		orientationModes: [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT, Ti.UI.PORTRAIT],
	
		navBarHidden: false,
		modal: true,
		barColor: '#3A6F8F',
		
		
		backgroundColor:'#fff',
		
	});
	
	return win;
};

exports.spacer = function() {
	return Titanium.UI.createButton({
    	systemButton: Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
};
exports.dashboardView = function(properties) {
	var dashboardContainer = Ti.UI.createView(properties);
	dashboardContainer.dashboard = null;
	dashboardContainer.items = [];
	
	
	dashboardContainer.setData = function(data) {
		for (var i=0; i < data.length; i++) {
			dashboardView.addElement(data[i].element);
		}
		dashboardContainer.refresh();
	}
	
	dashboardContainer.addElement = function(element) {
		var item = Titanium.UI.createDashboardItem({
			image: element.image,
			label: element.label,
			name: element.name,
			canDelete:false
		});
		container = Ti.UI.createView({
			label: element.label,
		    height : 100,
		    width : 150
		});
		container.add(Ti.UI.createImageView({
			image: element.image,
		    width : 80,
		    height : 80,
		    top : 0
		}));
		container.add(Ti.UI.createLabel({
		    text : element.label,
		    textAlign : 'center',
		    color : 'white',
		    font : {fontSize:15},
		    height : 18,
		    bottom : 0,
		    width: 100, 
		    borderRadius: 5,
		    color: '#000',
		    backgroundColor: '#fff',
		    borderColor: '#000',
		    borderWidth: 1
		}));
		item.add(container);

		// TODO listeners
	};
	
	dashboardContainer.refresh = function() {
		var dashboard = Titanium.UI.createDashboardView({
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
		    data: dashboardContainer.items,
		    editable: false
		});
	};
	
	return dashboardContainer;
};

exports.addPullToRefresh = function(tableview) {
	
	var pulling = false;
	var reloading = false;
	var lastRow = tableview.data.length;
	var data;
	
	function beginReloading() {
		Log.Info('[UI] Start reloading');
		
		if (tableview.reload != null)
			tableview.reload();
		else
			setTimeout(endReloading, 2000);
	}
	
	function endReloading() {
		
		lastRow = tableview.data.length;
		
		tableview.setContentInsets({top:0},{animated:true});
		reloading = false;
		lastUpdatedLabel.text = L('last_updated')+formatDate();
		statusLabel.text = L('pull_to_refresh');
		actInd.hide();
		arrow.show();
		if (tableview.last_id != null)
			Log.Info("[DATA] Last post loaded: " + tableview.last_id);
	}
	tableview.addEventListener('data:finishreloading', endReloading);
	tableview.addEventListener('scroll',function(e) {
		var offset = e.contentOffset.y;
		if (offset <= -65.0 && !pulling) {
			var t = Ti.UI.create2DMatrix();
			t = t.rotate(-180);
			pulling = true;
			arrow.animate({transform:t,duration:180});
			statusLabel.text = L('release_to_refresh');
		} else if (pulling && offset > -65.0 && offset < 0) {
			pulling = false;
			var t = Ti.UI.create2DMatrix();
			arrow.animate({transform:t,duration:180});
			statusLabel.text = L('pull_to_refresh');
		}
	});
	
	tableview.addEventListener('scrollEnd',function(e) {
		if (pulling && !reloading && e.contentOffset.y <= -65.0) {
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
		backgroundColor:"#576c89",
		height:2,
		bottom:0
	});
	
	var tableHeader = Ti.UI.createView({
		backgroundColor:"#e2e7ed",
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
		height:"auto",
		color:"#576c89",
		textAlign:"center",
		shadowColor:"#999",
		shadowOffset:{x:0,y:1},
		font:{fontSize:12,fontWeight:"bold"}
	});
	
	var lastUpdatedLabel = Ti.UI.createLabel({
		text: L('last_updated')+formatDate(),
		left:45,
		width:220,
		bottom:15,
		height:"auto",
		color:"#576c89",
		textAlign:"center",
		font:{fontSize:11},
		shadowColor:"#999",
		shadowOffset:{x:0,y:1}
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

var webview = null;
var browserwindow = exports.newWindow();
exports.getBrowserWindow = function(url) {
	if (webview == null) {
		webview = Ti.UI.createWebView({url: url});		
		browserwindow.add(webview);
	} else {
		webview.setUrl(url);		
	}
	return browserwindow;
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