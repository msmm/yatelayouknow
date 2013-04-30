
function vbrands(params){
    
    var decorator = require("utils/decorators");
    var publicSubDirectory = require('controllers/publicSubDirectory').publicSubDirectory;
var loadingView = decorator.loadingIndicator();
var locationValue=Titanium.App.Properties.getString('location','{"municipio":"Guadalajara","inicio":"44009","fin":"49994"}');
locationValue=JSON.parse(locationValue);
    var areaLocations=[];
    areaLocations[locationValue.municipio]={"inicio":locationValue.inicio,"fin":locationValue.fin};
    params.stopLoading();
    // main Window  ///
var window = Ti.UI.createWindow({
     backgroundColor:'white',
     title: "V-Brands",
     barImage: "images/empresarial/BarraTitulo.png"
});

window.add(loadingView);

/// ScrolVIEW principal     ////
var mainScrollView = Ti.UI.createScrollView({
  contentWidth: decorator.screenWidth,
  contentHeight: 'auto',
  showHorizontalScrollIndicator: false,
  height: "100%",
  width: decorator.screenWidth,
  backgroundColor:"#e7e7e7",
  layout:"horizontal"
});


//////////////////
////  HEADER        ////
var header = Ti.UI.createView({
    height:32,
    width:decorator.screenWidth,
    backgroundColor:"#f7f7f7"
});

var textField = Ti.UI.createTextField({
  color: 'black',
  borderColor:"#005890",
  borderRadius:3,
  top: 1, left: 82,
  width: (decorator.screenWidth-119), height: 29
});

var searchButton = Ti.UI.createButton({
    zIndex:1,
    height:29,
    top:1,
    width:42,
    right:0,
    backgroundImage:'images/empresarial/lupa.png'
    
});

searchButton.addEventListener('click',function(e){
    
     var url="http://www.vielite.com/ws_v-brand_search.php?keyword="+(textField.getValue())+"&rango="+areaLocations[location.text].inicio+","+areaLocations[location.text].fin;
    //Ti.API.info(url);
    var client = Ti.Network.createHTTPClient({
         // function called when the response data is available
         onload : function(e) {
            //Ti.API.info(this.responseText);
            psd = new publicSubDirectory({
                    'response':this.responseText,
                    'requestData':false,
                    'closeWindow' : params.closeWindow
                });
         params.openWindow(psd);
         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
             alert("Error de conexión.");
         },
         timeout : 15000  // in milliseconds
     });
     // Prepare the connection.
     client.open("GET", url);
     // Send the request.
     client.send(); 
    
});

var location = Ti.UI.createLabel({
    text:locationValue.municipio,
    color: "#005890",
    height:29,
    left:0,
    top:1,
    width:80,
    font: {
            fontSize:15 ,fontFamily: 'Source Sans Pro'
    },
});


function crearPickerArea(e){
    location.removeEventListener('click',crearPickerArea);
    loadingView.show();
    function crearPicker(result){
        function changePicked(a){
     //  //Ti.API.info(JSON.stringify(areaLocations[a]));        
 location.text=a;
 Titanium.App.Properties.setString('location','{"municipio":"'+a+'","inicio":"'+areaLocations[a].inicio+'","fin":"'+areaLocations[a].fin+'"}');
    }
    
    var arrayCds=JSON.parse(result);
    var picker_data = [];
        for(var i = 0, j = arrayCds.areas.length; i < j; i++){
            picker_data.push(arrayCds.areas[i].municipio);
            areaLocations[arrayCds.areas[i].municipio]={"inicio":arrayCds.areas[i].inicio, "fin":arrayCds.areas[i].fin};
        }
    
    var picker = decorator.picker({
        'showButton': location,
        'picked': changePicked,
        'data' : picker_data
    });
    
    window.add(picker);
    loadingView.hide();
    picker.salir();
    }
    
    getData(crearPicker,function(){loadingView.hide();});
}

location.addEventListener('click',crearPickerArea);

header.add(location);
header.add(textField);
header.add(searchButton);
mainScrollView.add(header);


///////////////////////
// Categorias    ///

var cats=['Deportes','Entretenimiento','Gastronomía','Hogar','Moda','Salud y Belleza','Servicios','Tecnología','Viajes'];

function createIcon(img,texto,dif){
    
    var iconView = Ti.UI.createView({
        width:(decorator.screenWidth/3)-dif,
        height:((decorator.trueHeight-31)/3),
        categoria:texto,
        backgroundColor:"#f7f7f7"
    });
    var mainLabel = Ti.UI.createLabel({
    width: 96,
    height:15,
    text:texto,
    color:"#999999",
    bottom:4,
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
    font: {
            fontSize:11 ,fontFamily: 'Source Sans Pro'
    },
    touchEnabled:false
    });
    var imgView = Ti.UI.createView({
        height:60,
        width:63,
        touchEnabled:false,
        backgroundImage:("images/intereses/"+img+".png")
    });
    iconView.add(mainLabel);
    iconView.add(imgView);
    
    iconView.morf = function(){
        imgView.backgroundImage=("images/intereses/"+img+"On.png");
        setTimeout(function(){
        imgView.backgroundImage=("images/intereses/"+img+".png");
        }, 300);
    };
    
    return iconView;
}

for(var i=0,j=cats.length;i<j;i++){
        
        var img=getImg(cats[i]);
        var icon = createIcon(img,cats[i],(i%3==1 ? 0:1));
        icon.left=(i%3!=0 ? 1:0 );
        icon.top=(i>2 ? 1:0 );
        mainScrollView.add(icon);
        
    }


mainScrollView.addEventListener('click',function(e){
    
    //Ti.API.info(JSON.stringify(e));
   
    if(e.source.categoria){
        e.source.morf();
         var cat=(getCategoria(e.source.categoria));
        
          psd = new publicSubDirectory({
                    'requestData':true,
                    'categoria' : cat,
                    'inicio' : areaLocations[location.text].inicio,
                     'fin' : areaLocations[location.text].fin,
                    'closeWindow' : params.closeWindow
                });
         params.openWindow(psd);
    }
    
});


window.add(mainScrollView);
loadingView.hide();
return window;
}

function getImg(text){
    var result="";
    switch(text){
        case 'Moda':
        result="moda";
        break
         case 'Salud y Belleza':
        result="saluybelleza";
        break
         case 'Deportes':
        result="deportes";
        break
         case 'Entretenimiento':
        result="entretenimiento";
        break
         case 'Gastronomía':
        result="gastronomia";
        break
         case 'Hogar':
        result="hogar";
        break
         case 'Servicios':
        result="servicios";
        break
         case 'Tecnología':
        result="tecnologia";
        break
         case 'Viajes':
        result="viajes";
        break
        
    }
    
    return result;
}

function getData(crearPicker,hide){
    
    var url="http://www.vielite.com/ws_areas.php";
    
    var client = Ti.Network.createHTTPClient({
         // function called when the response data is available
         onload : function(e) {
            //Ti.API.info(this.responseText);
            crearPicker(this.responseText);
         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
             alert("Error de conexión.");
             hide();
         },
         timeout : 15000  // in milliseconds
     });
     // Prepare the connection.
     client.open("GET", url);
     // Send the request.
     client.send(); 
    
}

function getCategoria(text){
    
    var result=1;
    switch(text){
        case 'Moda':
        result=17;
        break
         case 'Salud y Belleza':
        result=12;
        break
         case 'Deportes':
        result=4;
        break
         case 'Entretenimiento':
        result=5;
        break
         case 'Gastronomía':
        result=6;
        break
         case 'Hogar':
        result=7;
        break
         case 'Servicios':
        result=18;
        break
         case 'Tecnología':
        result=13;
        break
         case 'Viajes':
        result=15;
        break
        
    }
    return result;
    
}

module.exports = vbrands;
