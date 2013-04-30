
function resultados(params){
    
    var decorator = require('utils/decorators');
    var loadingView = decorator.loadingIndicator();
    var tablaFoto=require('ui/tablaConFoto');
    var actEmpre=0,actUser=0;
    
    var window = Ti.UI.createWindow({
     backgroundColor:'white',
     title: params.key,
     barImage: "images/empresarial/BarraTitulo.png"
    });
    window.add(loadingView);
    
    
    function menuManager(e){
      //  //Ti.API.info(JSON.stringify(e));
        switch(e.source.title){
            case'Publicaciones':
            publicButton.backgroundImage="images/empresarial/btnFav1.png";
            usuariosButton.backgroundImage="images/empresarial/BarraTitulo.png";
            empresaButton.backgroundImage="images/empresarial/BarraTitulo.png";
            usuariosView.hide();
            empresasView.hide();
            pubsView.show();
            break;
            case'Usuarios':
             publicButton.backgroundImage="images/empresarial/BarraTitulo.png";
            usuariosButton.backgroundImage="images/empresarial/btnFav1.png";
            empresaButton.backgroundImage="images/empresarial/BarraTitulo.png";
            pubsView.hide();
            empresasView.hide();
            if(actUser==0)activateUsers();
            
            usuariosView.show();
            break;
            case'Empresa':
            
             publicButton.backgroundImage="images/empresarial/BarraTitulo.png";
            usuariosButton.backgroundImage="images/empresarial/BarraTitulo.png";
            empresaButton.backgroundImage="images/empresarial/btnFav1.png";
            pubsView.hide();
            usuariosView.hide();
            if(actEmpre==0)activateEmpresas();
            empresasView.show();
            break;
            
        }
        
    }
    
    var buttonsHolder = Ti.UI.createView({
        height:33,
        width:300,
        left:10,
        borderRadius:2,
        top:10,
        layout:'horizontal'
    });
    
    var publicButton = Ti.UI.createButton({
       width:100,
       height:33,
       color:"white",
       font:{fontFamily:'Source Sans Pro', fontSize:13},
       backgroundImage:'images/empresarial/btnFav1.png',
       title: 'Publicaciones'
    });
    publicButton.addEventListener('click',menuManager);
    var usuariosButton = Ti.UI.createButton({
       width:100,
       height:33,
       color:"white",
       font:{fontFamily:'Source Sans Pro', fontSize:13},
       backgroundImage:'images/empresarial/BarraTitulo.png',
       title: 'Usuarios'
    });
    usuariosButton.addEventListener('click',menuManager);
    var empresaButton = Ti.UI.createButton({
       width:100,
       height:33,
       color:"white",
       font:{fontFamily:'Source Sans Pro', fontSize:13},
       backgroundImage:'images/empresarial/BarraTitulo.png',
       title: 'Empresa'
    });
    empresaButton.addEventListener('click',menuManager);
    
     
    
    buttonsHolder.add(publicButton);
    buttonsHolder.add(usuariosButton);
    buttonsHolder.add(empresaButton);
    window.add(buttonsHolder);
    
 ////////////  Publicaciones View   ///////////
 var pubsView = Ti.UI.createView({
     height:(decorator.trueHeight-53),
     width:300,
     top:53,
     left:10
 });
 
 var todoTableObject = require('home/todoTable');
  var todoTable = new todoTableObject({
      openW:params.openW,
      closeW: params.closeW,
      stopLoading :function(){
          loadingView.hide();
          },
      noResults : function(){
          noResults('publicaciones',pubsView);
      },
      idPerfil:params.idPerfil,
      url:("http://www.vielite.com/ws_buscar_pubs.php?key="+params.key),
      anchoTabla : 300,
      busqueda:true
  });
  pubsView.add(todoTable);
 window.add(pubsView);
 
 ////////////  Usuarios View   ///////////
 
 
 var usuariosView = Ti.UI.createView({
     height:(decorator.trueHeight-53),
     width:300,
     top:53,
     left:10
 });
 function activateUsers(){
     loadingView.show();
      actUser++;
      var listaSig = new tablaFoto({
          title:'rb',
          stopLoading:function(){
              loadingView.hide();
          },
           noResults : function(){
          noResults('usuarios',usuariosView);
      },
           type:'usuario',
          url: ('http://www.vielite.com/ws_buscar_users.php?key='+params.key),
           openW:params.openW,
           closeW:params.closeW
      });
      //setTimeout(function(){loadingView.hide();},3000);
 usuariosView.add(listaSig);
 }

 usuariosView.hide();
 window.add(usuariosView);
 
 ////////////  Empresas View   ///////////
    
    
    var empresasView = Ti.UI.createView({
     height:(decorator.trueHeight-53),
     width:300,
     top:53,
     left:10
 });
 function activateEmpresas(){
     loadingView.show();
     actEmpre++;
      var listaEmpre = new tablaFoto({
          title:'empresas',
           type:'empresarial',
           stopLoading:function(){
              loadingView.hide();
          },
           noResults : function(){
          noResults('empresas',empresasView);  
      },
          url: ('http://www.vielite.com/ws_buscar_empresas.php?key='+params.key),
           openW:params.openW,
           closeW:params.closeW
      });
     // setTimeout(function(){loadingView.hide();},3000);
 empresasView.add(listaEmpre);
 }

 empresasView.hide();
 window.add(empresasView);
 
 function noResults(tipo,view){
     Ti.API.info("no resutls");
     var bgImge="";
     if(tipo=='publicaciones'){
         bgImge='images/dashboard/icoPublicaciones.png';
     }else if(tipo=='empresas'){
         bgImge='images/dashboard/icoEmpresas.png';
     }else{
         bgImge='images/dashboard/icoUsuarios.png';
     }
    
     var imagen = Ti.UI.createView({
    height:96,
    width:101,
    top:100,
    backgroundImage:bgImge,
    layout:'vertical'
});

var textLbl = Ti.UI.createLabel({
    text:('Lo sentimos no hay '+tipo+' que coincidan con tu criterio de búsqueda'),
    font:{fontFamily: 'Source Sans Pro', fontSize:13, fontWeight:"bold"},
    height:Ti.UI.SIZE,
    width:Ti.UI.SIZE,
    top:200,
    color:'gray',
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
    });
     
     view.add(imagen);
     view.add(textLbl);
 }
 
 
    return window;
    
    
}

module.exports = resultados;