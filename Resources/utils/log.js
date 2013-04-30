(function(debug){
	exports.Info = function(text){
		if(debug){
			//Ti.API.info('<INFO> '+text);
		}
	}
	exports.Error = function(text){
		if(debug){
			Ti.API.error('<INFO-E> '+text);
		}
	}
	exports.Warn = function(text){
		if(debug){
			Ti.API.warn('<WARN> '+text);
		}
	}
	exports.Json = function(text){
		if(debug){
			try{
				//Ti.API.info('<JSON> '+JSON.parse(text));
			} catch(err){
				//Ti.API.info('<JSON> '+JSON.stringify(text));				
			}
		}
	}

	
})(true);