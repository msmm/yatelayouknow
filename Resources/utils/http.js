App.HTTP = function(params){
var settings = params || {};
var xhr;
var vielite;
_init();

function _init(){

vielite = require('utils/global').getGlobals();
settings.timeout = 20000;
try{
xhr = Ti.Network.createHTTPClient({
timeout: settings.timeout,
onload: function(e){
//Ti.API.info("size:" +this.responseData.size);
settings.callback({
text: this.responseText,
xml: (settings.text ? null : this.responseXML.documentElement)
});
},
onerror: function(e){
//alert("entro a error: "+e.error);
settings.callback({
error: true,
data: e
});
},
});
xhr.open(settings.method, settings.url, true);

xhr.setRequestHeader('cookie', vielite.data.cookie);
xhr.send(settings.data);
} catch(err) {
settings.callback({
error: true,
data: err
});
}
}

return {

}
};