
function menciones(tabGroup, id){
    
    var decorator = require("utils/decorators");
    
    var window = Ti.UI.createWindow({
        title:"Menciones",
        backgroundColor:'white',
        barImage: "images/empresarial/BarraTitulo.png"
    });
    var emptyView = decorator.emptyTab("images/empresarial/secciones/icoMenciones.png","Por el momento no hay menciones que mostrar."); 
    window.add(emptyView);
    

///     Tabla Menciones     ////
     var jsoM= {
     "top":0,
     "tabGroup":tabGroup,
     "width": 0.92,
     "id": id,
     "tipo": "mencion",
     "size": "completo",
      "hide" : function(){emptyView.hide();}
 };
 var mencionesObject = require('empresarial/mencionesTable');
 var mencionesTable = new mencionesObject(jsoM);
    window.add(mencionesTable);
    return window;
}


module.exports = menciones;