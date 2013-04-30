/**
 * Modal Info View module - Titanium JS
 * @author César Cavazos - @cesarcvz
 * Based on: https://github.com/appcelerator/KitchenSink
 */

/**
 * Open an infomation modal anywhere in hour app
 * @param {String} text
 * @param {Object} params
 */
exports.showInfo = function(text, params) {
        //TODO: Add params like images/icons
        params = (params) ? params : {};
	var infoWindow = Titanium.UI.createWindow({
		height:80,
		width:200,
		touchEnabled:false
	});
	var background = Titanium.UI.createView({
		height:80,
		width:200,
		backgroundColor:'#000',
		borderRadius:10,
		opacity:0.8,
		touchEnabled:false
	});
	infoWindow.add(background);
	var message = Titanium.UI.createLabel({
		text:text,
		color:'#fff',
		textAlign:'center',
		font:{fontSize:18,fontWeight:'bold'},
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE
	});
	infoWindow.add(message);
	infoWindow.open();
	var animationProperties = {delay: 1500, duration: 300, opacity: 0.1};
	if (Ti.Platform.osname == "iPhone OS") {
		animationProperties.transform = Ti.UI.create2DMatrix().translate(-200,200).scale(0);
	}
	infoWindow.animate(animationProperties, function(){ infoWindow.close(); });
};