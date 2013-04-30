
function buscar(params){
    
    var decorator = require('utils/decorators');
    var loadingView = decorator.loadingIndicator();
    var resultObj = require('dashboard/resultadosBusqueda');
    
     var mainView = Ti.UI.createView({
        width: "100%",
        height:"100%",
        backgroundColor:"white"
    });
    //////////////////
////  HEADER        ////
var header = Ti.UI.createView({
    height:31,
    top:15,
    width:decorator.screenWidth
});

var textField = Ti.UI.createTextField({
  color: 'black',
  borderColor:"#005890",
  borderRadius:3,
  hintText:" Buscar",
  top: 1, left: 8,
  width: (decorator.screenWidth-40), height: 29
});

var searchButton = Ti.UI.createButton({
    right:8,
    zIndex:1,
    height:29,
    top:1,
    width:42,
    backgroundImage:'images/empresarial/lupa.png'
    
});
    
    searchButton.addEventListener('singletap',function(){
        
       var rb = new resultObj({
           key:textField.value,
           openW:params.openW,
      closeW: params.closeW,
      idPerfil:params.id,
       });
        params.openW(rb);
    });
    
    var infoLbl = Ti.UI.createLabel({
        height:Ti.UI.SIZE,
        width:(decorator.screenWidth-40),
        text: 'Busca en VIELITE: Amigos, Empresas y Publicaciones',
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        top:130
    });
    
    
    header.add(textField);
    header.add(searchButton);
    
    mainView.add(header);
    mainView.add(infoLbl);
    
    mainView.activar = function(){textField.focus();};
    mainView.desactivar = function(){textField.blur();};
    
    return mainView;
    
    
}

module.exports = buscar;