var CustomRow = function(/*Object*/ _params) {
	var row = Ti.UI.createTableViewRow({
		backgroundColor:'transparent',
		height:60
	});
	var rowImage = Ti.UI.createImageView({
		defaultImage: 'images/buttons/fb_activo.png',
		image: _params.foto,
		height:50,
		width:50,
		left:4
	});
	row.add(rowImage);
	
	var primaryLabel = Ti.UI.createLabel({
		text:_params.primarylabel,
		font:{
			fontSize:16,
			fontWeight:'bold'
		},
		color:'black',
		top:20,
		left:75,
		height:'auto'
	});
	row.add(primaryLabel);
	var addButton = Ti.UI.createButton({
		backgroundImage:_params.estado==1 ? 'images/pleca.jpg':'images/dejarDeSeguir.jpg',
		title : _params.estado==1 ? 'Seguir': 'Siguiendo',
		height:40,
		width:85,
		right:10,
		mode:_params.estado,
		cuenta: _params.id
	});
	row.add(addButton);
	return row;
};

module.exports = CustomRow;