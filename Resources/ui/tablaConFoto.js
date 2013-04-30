
function tabla(params){
     var pagina=1;
      var dataTable=0;
    if(params.type=='usuario'){
        var socialWindowObj=require('social/socialWindow');
            
        }else if(params.type=='empresarial'){
         var peObject = require('controllers/perfilEmpresarial');    
            
        }
       
   var decorator = require("utils/decorators");
    
    
   
    
    var table = Ti.UI.createTableView({
        top:0,
        showVerticalScrollIndicator:false,
    });
    table.addEventListener('click',rowSel);
    function loadTable(data){
        //Ti.API.info(data);
        var datos=JSON.parse(data);
        
        switch(params.title){
            case'Seguidores':
             datos=datos.followers;
            break;
            case'Siguiendo':
            datos=datos.following;
            break;
            case'Marcas':
            datos=datos.favs;
            break;
            case'empresas':
             datos=datos.empresas;
            break;
           default:
            datos=datos.users;
            break;
            
        }
        
        
        if(datos[0].alerta){
           table.fireEvent('data:finishreloadingOld');
           if(params.stopLoading!=false && pagina==2){
               params.stopLoading();
               params.noResults();
               table.separatorColor="transparent";
               }
        }else{
          
        for(var i=0,j=datos.length;i<j;i++){
            var row = Ti.UI.createTableViewRow({
                layout:"horizontal",
                idPerfil:datos[i].numCuenta,
                height:62,
                hasChild:true
            });
            
            var foto = Ti.UI.createImageView({
                image:('http://www.vielite.com'+datos[i].foto),
                height:50,
                width:50,
                borderWidth:1,
                defaultImage:'images/fotodefault.jpg',
                borderColor:'#e7e7e7',
                hires:true,
                top:6
            });
            var nombre = Ti.UI.createLabel({
                text:(datos[i].fullname ? datos[i].fullname : datos[i].nombre),
                width:(datos[i].fullname ? 240 : 220),
                height:24,
                left:6,
                top:15,
                color:"#005890",
                font:{fontFamily:'Source Sans Pro', fontSize:20,fontWeight:"bold"}
            });
            row.add(foto);
            row.add(nombre);
            
            table.appendRow(row);
              dataTable++;
        }
        table.len=(dataTable);
         table.fireEvent('data:finishreloadingOld');
         params.stopLoading();
        }
        
    }
    
    function reloadTable() {
    var url = params.url+"&pagina="+pagina;
    //Ti.API.info("url ws tabla con Foto: "+url);
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
         pagina++;
        loadTable(this.responseText);
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         alert("Error de conexión.");
         Ti.API.debug(e.error);
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
    
    }
   function fakeLoad(){
       table.fireEvent('data:finishreloading');
   }
 
 ///////////////////////////////////////
 /////          Seleccion de Row       /////
    function rowSel(e){
        //Ti.API.info(JSON.stringify(e));
        if(e.row.idPerfil){
        if(params.type=='usuario'){
            var perfil=new socialWindowObj({
         id:e.row.idPerfil,
         stopLoading:function(){},
         openW:params.openW,
         closeW:params.closeW
         });
         Ti.API.info('Right waaay');
         params.openW(perfil);
            
        }else if(params.type=='empresarial'){
            
             var url = "http://www.vielite.com/ws_perfil_empresa_home.php?id="+e.row.idPerfil;
 var client = Ti.Network.createHTTPClient({
     onload : function(e) {
       //Ti.API.info("perfil empresa "+this.responseText);
       
        var pe = new peObject.mainWindow(this.responseText);
        pe.open({transition: Titanium.UI.iPhone && Titanium.UI.iPhone.AnimationStyle.CURL_DOWN});
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         alert("Error de conexión.")
     },
     timeout : 10000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
            
        }
     }
    }
    
    decorator.pullPush(table,fakeLoad,reloadTable);
    reloadTable();
    return table;
    
}

module.exports=tabla;
