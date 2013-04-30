
function loginW(){
    
   var siteLocation=require('utils/ui').siteLocation();
var UI      = require('utils/ui');
var decorator = require('utils/decorators');

var loging = false;

//Facebook credentials
    Titanium.Facebook.appid = "422325314446439";
    Titanium.Facebook.permissions = ['publish_stream'];
//Ti.API.info("[ModuloLogin]");
    
var win = Ti.UI.createWindow({
    backgroundColor:'white',
    title:L("sign_in"),
    orientationModes:[Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT, Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
});



var logo = UI.ImageView({
    height: Ti.UI.SIZE,
    width: Ti.UI.SIZE,
    top: 40,
    image: 'images/login/logo.png'
});
logo.addEventListener('click', function(){
    username.blur();
    password.blur();
});


var btnJoin = UI.Buttons({
    title: L('join_vielite'),
    height: 30,
    top: 40,
    textAlign: 'center',
    width: 230,
    style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
    color: '#8CAFD2', 
    font: {
        fontSize: 14
    }

});

btnJoin.addEventListener('click', function(){


    var join = require('ui/register');
    var joinWindow = join();
    joinWindow.open();

});



var vwLogIn = UI.View({
    layout:'vertical',
    top:0,
    height: Ti.UI.FILL,
    width: Ti.UI.FILL,
    backgroundImage: 'images/bg.jpg',
    backgroundColor: '#000'
});

function inicSes() {
    
    if(!loging){
    loging=true;
    setTimeout(function(){loging=false;    },3000);
    if((decorator.removeAllSpaces(username.value))!="" && (decorator.removeAllSpaces(username.value))!=""){
    username.blur();
    password.blur();
    Ti.App.fireEvent('session:login',{
        user: username.value,
        pass: password.value
    });
    }else{
        alert("Campo vacio.");
    }
    }
}


var btnIn = UI.Buttons({
    backgroundImage: 'images/login/btn1.png',
    title: L('login'),
    height: 30,
    top: 10,
    width: 230,

});

btnIn.addEventListener('click',inicSes);



var btnForgot = UI.Buttons({
    title: L('forgot_password'),
    height: 33,
    top: 10,
    width: Ti.UI.SIZE,
    color: '#8CAFD2', 
    font: {
        fontSize: 14
    },
    style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
});

btnForgot.addEventListener('click', function() {
    var fgt = require('ui/forgotPwd');
    var fgtWindow = fgt();
    fgtWindow.open();
});

var username = Ti.UI.createTextField({
    hintText:L('account'),
    paddingLeft:10,
    backgroundColor: 'white',
    borderRadius: 2,
    autocapitalization:Ti.TEXT_AUTOCAPITALIZATION_NONE,
    autocorrect:false,
    width:230,
    height:35,
    returnKeyType : Ti.UI.RETURNKEY_NEXT,
    top: 40,
    font: {
        fontSize: 15
    }
});
username.addEventListener('return',function(){
    password.focus();
});

var password = Ti.UI.createTextField({
    hintText:L('password'),
    paddingLeft:10,
    passwordMask:true,
    borderRadius:2,
    width:230,
    height:35,
    returnKeyType:Ti.UI.RETURNKEY_GO,
    top: 10,
    backgroundColor: 'white',
    
    font: {
        fontSize: 15
    }
});

password.addEventListener('return',inicSes);


/////////////////////////////////////
////        Orientation changes     /////

function landscapeMode(){
    
    vwLogIn.updateLayout({layout:'composite'});
    logo.updateLayout({top:10});
    btnForgot.updateLayout({top:250, left:14});
    username.updateLayout({top:100, width:'42%',left:15});
    btnJoin.updateLayout({top:250, left:285});
    btnIn.updateLayout({top:155,left:265,width:'42%'});
    password.updateLayout({top:100, width:'42%', left:265});
}
function portMode(){
    
    vwLogIn.updateLayout({layout:'vertical'});
    logo.updateLayout({top:40});
    btnForgot.updateLayout({top:10, left:80});
    username.updateLayout({top:40, width:230, left:45});
    btnJoin.updateLayout({top:40, left:40});
    password.updateLayout({top:10, width:230, left:45});
    
     btnIn.updateLayout({top:10,left:45,width:230});
}

function loginOrient(e) {
    switch (Titanium.Gesture.orientation) {
 
        case Titanium.UI.LANDSCAPE_LEFT:
        landscapeMode();
        break;
        case Titanium.UI.LANDSCAPE_RIGHT:
            landscapeMode();
        break;
        case Titanium.UI.PORTRAIT:
        portMode();
        break;
        case Titanium.UI.UPSIDE_PORTRAIT:
        portMode();
        break;
    }
}

Titanium.Gesture.addEventListener('orientationchange', loginOrient);

win.borrar = function(){
   Titanium.Gesture.removeEventListener('orientationchange', loginOrient); 
   win.close();
};


vwLogIn.add(logo);
vwLogIn.add(username);
vwLogIn.add(password);
vwLogIn.add(btnIn);
vwLogIn.add(btnForgot);
vwLogIn.add(btnJoin);
win.add(vwLogIn);
//viewLogin.add(vwLogIn);
//win.add(vwLogIn);
return win; 
    
    
}
module.exports = loginW;
