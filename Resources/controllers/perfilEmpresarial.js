
function mainWindow(data) {
    
///     Data    ///
var datos = JSON.parse(data);
var decorator = require("utils/decorators");
var windowD = Ti.UI.createWindow({
   backgroundImage:'images/bg.jpg',    
        barImage: "images/empresarial/BarraTitulo.png",
        title : "Denunciar"
});
    
    //MAIN tabgroup
     var tabGroup = Titanium.UI.createTabGroup({
        id:'tabGroup',
        tabsBackgroundColor : "red"
        });
        
        function openWin(w){
            tabGroup.activeTab.open(w);
        }
    // tabGroup.addEventListener('focus', function(e) {
         // //Ti.API.info('tabGroup.addEventListener '+JSON.stringify(e));
            // e.tab.setIcon("images/empresarial/secciones/ico"+e.tab.iconId+"On.png");
    // });
   
   function cb(){
        var cb = Titanium.UI.createButton({
       title: 'cerrar',
       width: 100,
       height: 50
    });
    cb.addEventListener('click',function(e){
    tabGroup.close({transition: Titanium.UI.iPhone && Titanium.UI.iPhone.AnimationStyle.CURL_UP});
    });
    return cb;
   }

    
    //Windows
  
    var _home = require('empresarial/home');
    var home = new _home(tabGroup,datos.home_empresa);
    home.setLeftNavButton(cb());
    var _tips = require('empresarial/tips');
    var tips = new _tips(openWin,datos.home_empresa[0].numCuenta);
    tips.setLeftNavButton(cb());
    var _info = require('empresarial/info');
    datos.info_empresa[0].numCuenta=datos.home_empresa[0].numCuenta;
    var info = new _info(tabGroup,datos.info_empresa);
    info.setLeftNavButton(cb());
    var _cuadricula = require('empresarial/cuadricula');
    var cuadricula = new _cuadricula(tabGroup,datos.home_empresa);
    cuadricula.setLeftNavButton(cb());
    ////////
    var wB= Ti.UI.createWindow({
                backgroundColor:"white",
                barImage: "images/empresarial/BarraTitulo.png",
                title:"Beneficios"
            });
     var emptyBen = decorator.emptyTab("images/empresarial/secciones/icoBeneficio.png","Por el momento no hay beneficios que mostrar.");
     wB.add(emptyBen);
     emptyBen.hide();
            var jsoB= {
             "top":12,
             "tabGroup": tabGroup,
             "reload": "yes",
             "id" : datos.home_empresa[0].numCuenta,
             "tipo" : "beneficios",
             "width" : 0.94,
             "size" :"full",
             "show" : function(){emptyBen.show();}
             };
         var benefObject = require('empresarial/beneficiosTable');
         var beneficiosTable = new benefObject(jsoB);
         wB.add(beneficiosTable);
         wB.setLeftNavButton(cb());
    var wP= Ti.UI.createWindow({
                backgroundColor:"white",
                barImage: "images/empresarial/BarraTitulo.png",
                title:"Productos"
            });
     var emptyPro = decorator.emptyTab("images/empresarial/secciones/icoProductos.png","Por el momento no hay productos que mostrar.");
      wP.add(emptyPro);
     emptyPro.hide();
            var jsoP= {
             "top":0,
             "tabGroup": tabGroup,
             "reload": "yes",
             "id" : datos.home_empresa[0].numCuenta,
             "tipo" : "productos",
             "width" : 0.94,
              "size" :"full",
              "show" : function(){emptyPro.show();}
             };
         var productosTable = new benefObject(jsoP);
         wP.add(productosTable);
         wP.setLeftNavButton(cb());
     var mencionesObj=require('empresarial/menciones');
     var windowM=new mencionesObj(tabGroup,datos.home_empresa[0].numCuenta);
     windowM.setLeftNavButton(cb());
    var denunciar_silenciar=require('empresarial/denunciar_silenciar');
            var windowS=denunciar_silenciar.silenciar({
                'image':datos.home_empresa[0].foto,
                 'tab':tabGroup,
                 'id' : datos.home_empresa[0].numCuenta,
                 'muted':datos.home_empresa[0].muted,
                 'refreshDatos' : function(e){
                    // //Ti.API.info("before "+datos.home_empresa[0].muted);
                     datos.home_empresa[0].muted=e;
                    // //Ti.API.info("after "+datos.home_empresa[0].muted);
                 }
            });
     windowS.setLeftNavButton(cb());
    function crearDenunciar(){
       
        var url = "http://www.vielite.com/ws_denuncia_opciones.php";
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
      // //Ti.API.info("opciones denunciar "+this.responseText);
       var opciones=JSON.parse(this.responseText);
      // //Ti.API.info("antes d agregar viewD");
            var viewD=denunciar_silenciar.denunciar({
                 'image':datos.home_empresa[0].foto,
                 'tab':tabGroup,
                 'id' : datos.home_empresa[0].numCuenta,
                 'data': opciones,
                 'close' : function(){
                     tabGroup.activeTab.close(windowD);
                 }
            });
            windowD.setLeftNavButton(cb());
            windowD.add(viewD);
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
         
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
 
    }
    crearDenunciar();
    
    //TABS

var homeTab = Titanium.UI.createTab({
    title:'Home',
    icon:'images/empresarial/secciones/home.png',
    iconId:'Perfil',
    window:home
});
var infoTab = Titanium.UI.createTab({
    title:'Info',
    icon:'images/empresarial/secciones/info.png',
    iconId:'Info',
    window:info
});
var cuadriculaTab = Titanium.UI.createTab({
    title:'Publicaciones',
    icon:'images/empresarial/secciones/publicaciones.png',
    iconId:'Publicaciones',
    window:cuadricula
});
var tipsTab = Titanium.UI.createTab({
    title:'Tips',
    icon:'images/empresarial/secciones/tips.png',
    iconId:'Tips',
    window:tips
});
tipsTab.addEventListener("focus",function(){
    tipsTab.window.refreshT();
});

var beneficiosTab = Titanium.UI.createTab({
   title:'Beneficios',
    icon:'images/empresarial/secciones/beneficios.png',
    window:wB
});
var productosTab = Titanium.UI.createTab({
   title:'Productos',
    icon:'images/empresarial/secciones/productos.png',
    window:wP
});
var mencionesTab = Titanium.UI.createTab({
   title:'Menciones',
    icon:'images/empresarial/secciones/menciones.png',
    window:windowM
});
var ocultarTab = Titanium.UI.createTab({
   title:'Ocultar',
    icon:'images/empresarial/secciones/silenciar.png',
    window:windowS
});

 var denunciarTab = Titanium.UI.createTab({
   title:'Denunciar',
    icon:'images/empresarial/secciones/denunciar.png',
    window:windowD
});  
            


 tabGroup.addTab(homeTab);
 tabGroup.addTab(infoTab);
 tabGroup.addTab(cuadriculaTab);
 tabGroup.addTab(tipsTab);
 tabGroup.addTab(beneficiosTab);
 tabGroup.addTab(productosTab);
 tabGroup.addTab(mencionesTab);
 tabGroup.addTab(ocultarTab);
 tabGroup.addTab(denunciarTab);
 
 return tabGroup;
}

 
exports.mainWindow = mainWindow;