var style = {
	android: {},
	iphone: {
		win:{
			navBarHidden: false,
		    barImage: "images/empresarial/BarraTitulo.png",
		    backgroundColor:'#FFF',
		    // backButtonTitleImage: 'images/buttons/dashboard.png'
		},
		wrapper: {
			width: '100%',
			height: '100%',
			top: 0,
			left: 0,
			backgroundColor: '#444',
			layout: 'vertical',
			contentHeight: Ti.UI.SIZE
		},
		list: {
			width: '100%',
			minRowHeight: 40,
			top: 0,
			bottom: 0,
			backgroundColor:'#f7f7f7',
			style: Titanium.UI.iPhone.TableViewStyle.GROUPED
		},
		rowTitle: {
			height: 20,
			width: '100%',
			left: 10,
			color: '#333',
			textAlign: 'left',
			touchEnabled: false,
			font: {
				fontFamily: 'Verdana-Bold',
				fontSize: 14
			}
		},
		rowSubtitle: {
			height: 30,
			width: '30%',
			left: 5,
			color: '#999',
			textAlign: 'right',
			font: {
				fontFamily: 'Verdana',
				fontSize: 9
			}
		},
		rowLabel: {
			left: 10,
			height: Ti.UI.SIZE,
			width: '30%',
			textAlign: 'right',
			touchEnabled: false,
			color: '#666',
			font: {
				fontFamily: 'Verdana',
				fontSize: 12
			}
		},
		rowField: {
			width: '60%',
			height: 30,
			right: 5,
			clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS,
			color: '#666',
			font: {
				fontFamily: 'Verdana-Bold',
				fontSize: 12
			}
		},
		rowSwitch: {
			width: 40,
			height: 25,
			right: 45
		},
		rowButton: {
			width: '63%',
			height: 30,
			right: 5,
			color: '#666',
			textAlign: 'left',
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
			font: {
				fontFamily: 'Verdana-Bold',
				fontSize: 12
			}
		},
		saveBtn: {
			width: Ti.UI.SIZE,
			height: 20,
			title: L('save')
		}
	}
};