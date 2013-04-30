App.Styles.NewPost = {
	android: {},
	iphone: {
		win: {
			//modal: true,
			//hideNavBar: false,
			title: L('new_post')
		},

		flexSpace: {
			systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		},
		cameraBtn: {
			systemButton:Ti.UI.iPhone.SystemButton.CAMERA
		},
		libraryBtn: {
			systemButton:Ti.UI.iPhone.SystemButton.BOOKMARKS
		},
		sendBtn: {
			width: 'auto',
			height: 'auto',
			title: L('send'),
			font: {
				fontFamily: 'Helvetica',
				fontSize: 10
			}
		},
		cancelBtn: {
			width: 'auto',
			height: 'auto',
			title: L('cancel'),
			font: {
				fontFamily: 'Helvetica',
				fontSize: 10
			}
		},
		message: {
			top: 5,
			width: '100%',
			height: 160,
			suppressReturn: true,
			returnKeyType: Titanium.UI.RETURNKEY_DEFAULT,
			keyboardToolbarColor: '#3A6F8F',
			color: '#333',
			font: {
				fontFamily: 'Helvetica',
				fontSize: 21
			}
		},
		image: {
			width: 40,
			height: 40,
			top: 3,
			right: 5,
			borderRadius: 5,
		},
		header: {
			width: Ti.UI.FILL,
			//height: 48,
			touchEnabled: true,
			backgroundColor: '#EEE',
			layout: 'horizontal'
		},
		to: {
			width: 100,
			height: 38,
			left: 10,
			color: '#333',
			font: {
				fontFamily: 'Helvetica-Bold',
				fontSize: 14
			}
		},
		toImg: {
			width: 35,
			height: 35,
			left: 10,
			borderRadius: 3
		}
	}
};