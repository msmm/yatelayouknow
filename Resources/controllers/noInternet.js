

exports.noInternet = function(args) {
	//Window
	var self = Ti.UI.createWindow({
		backgroundImage : 'images/login/bg.png',
		title : 'Problemas de conexion'
	});
	
	self.addEventListener('click', function(e)
	{
	if (Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
	alert('No hay Red');
}else{
	self.close();
	Ti.App.fireEvent("actInd");
}
	
	});
	
	return self;	
		
}

