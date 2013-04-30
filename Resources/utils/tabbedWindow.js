/*
	params: {
		[tabHeight],
		[tabBackgroundColor],
		[tabBackgroundSelectedColor],
		[tabImageWidth],
		[tabImageHeight]
		tabInfo: [
			{
				image,
				title,
				view
			}
		]
	}
*/
function InternalTabbedWindow(params){
	var settings	= params || {};
	var UI;
	var window;

	var tabs;
	var current;

	_init();
	function _init(){
		tabs 		= [];
		UI			= require('utils/ui');
		window 		= UI.Win({
			width: '100%',
			height: '100%'
		});
		var tabInfo	= settings.tabInfo || [];


		var percent = Ti.Platform.displayCaps.platformWidth / tabInfo.length;
		var tabBar 	= UI.View({
			width: 				'100%',
			height: 			settings.tabHeight || 40,
			backgroundColor: 	settings.tabBackgroundColor || '#000',
			bottom: 0
		});

		for(var i = 0, j = tabInfo.length; i < j; i++){
			var tab = UI.View({
				left: i * percent,
				width: percent,
				height: '100%',
				index: i
			});
			var image = UI.ImageView({
				top: 3,
				width: settings.tabImageWidth || 'auto',
				height: settings.tabImageHeight || 'auto',
				image: tabInfo[i].image,
				touchEnabled: false,
				preventDefaultImage: true
			});
			var label = UI.Label({
				width: 'auto',
				height: 'auto',
				text: tabInfo[i].title,
				touchEnabled: false,
				bottom: 3,
				color: settings.titleColor || '#FFF',
				font: {
					fontFamily: 'Helvetica',
					fontSize: 9
				}
			});
			tab.add(image);
			tab.add(label);
			tabBar.add(tab);
			tabInfo[i].view.hide();
			window.add(tabInfo[i].view);
			tabs.push({
				button: tab,
				imgView: image,
				label: label,
				view: tabInfo[i].view,
				title: tabInfo[i].title
			});
		}
		tabBar.addEventListener('click', _selectTab);
		window.add(tabBar);
		current = 1;
		_setCurrent(0);
	}

	function setTabImg (index, image) {
		tabs[index].imgView.image = image;
	}

	function setTabText (index, text) {
		tabs[index].label.text = text;
	}

	function _selectTab(evt){
		var index = evt.source.index;
		if(index != null){
			_setCurrent(index);
		}
	}

	function _setCurrent(index){
		
		if(current != index){
			tabs[current].view.hide();
			tabs[current].button.backgroundColor = settings.tabBackgroundColor || '#000';
			
			tabs[index].view.show();
			tabs[index].button.backgroundColor = settings.tabBackgroundSelectedColor || '#00426b';
			window.title = tabs[index].title;
			current = index;
		}
	}

	function getCurrentTab(){
		return current;
	}
	
	return {
		window: window,
		getCurrentTab: getCurrentTab,
		setTabImg: setTabImg,
		setTabText: setTabText,
		setCurrent: _setCurrent
	}
};

module.exports = InternalTabbedWindow;
