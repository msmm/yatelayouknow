
function multiPickTable(addDest,arrChecked){
    //Ti.API.info("MultiPick recibe como agregados alrdy "+JSON.stringify(arrChecked));
   var pagina=1;
   var dataTable=0;
   var dests=arrChecked;
   var destsIndex=[];
    for(var i=0;i<dests.length;i++){
        destsIndex.push(dests[i].id);
    }
   
   var decorator = require("utils/decorators");
    
    var closeButton = Ti.UI.createButton({
        systemButton: Titanium.UI.iPhone.SystemButton.DONE
    });
    closeButton.addEventListener('click',function(){
        //Ti.API.info("addDest "+JSON.stringify(dests));
        addDest(dests);
        window.close();
    });
    var window = Ti.UI.createWindow({
        backgroundColor:'white',
     title: "Escoge Destinatarios",
     barImage: "images/empresarial/BarraTitulo.png",
     rightNavButton:closeButton
    });
    
    var search = Titanium.UI.createSearchBar({
    barColor:'#000', 
    showCancel:true,
    height:43,
    top:0,
    });
    
    var table = Ti.UI.createTableView({
        top:0,
        search:search,
        showVerticalScrollIndicator:false,
    });
    
    table.addEventListener('click',rowSel);
    
    function loadTable(data){
        ////Ti.API.info(data);
        var datos=JSON.parse(data);
        datos=datos.following;
        
        if(datos[0].alerta){
           table.fireEvent('data:finishreloadingOld');
        }else{
          
        for(var i=0,j=datos.length;i<j;i++){
            
            var row = Ti.UI.createTableViewRow({
                layout:"horizontal",
                idPerfil:datos[i].numCuenta,
                foto:datos[i].foto,
                height:54,
                color:"#005890",
                font:{fontFamily:'Source Sans Pro', fontSize:16,fontWeight:"bold"},
                title:datos[i].fullname
            });
            
          //  //Ti.API.info("index id en los ya seleccionados "+arrChecked.indexOf(datos[i].numCuenta));
            if(destsIndex.indexOf(datos[i].numCuenta)>-1)row.hasCheck=true;
            
            // var foto = Ti.UI.createImageView({
                // image:('http://www.vielite.com'+datos[i].foto),
                // height:50,
                // width:50,
                // hires:true,
                // top:2
            // });
            // var nombre = Ti.UI.createLabel({
                // text:datos[i].fullname,
                // width:240,
                // height:24,
                // top:15,
                // color:"#005890",
                // font:{fontFamily:'Source Sans Pro', fontSize:16,fontWeight:"bold"}
            // });
            // row.add(foto);
            // row.add(nombre);
            table.appendRow(row);
              dataTable++;
        }
        table.len=(dataTable);
         table.fireEvent('data:finishreloadingOld');
        
        }
        
    }
    
    function reloadTable() {
    var url = 'http://www.vielite.com/ws_following.php?id='+decorator.idPerfil()+"&images=no";
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
       // //Ti.API.info(JSON.stringify(e));
        e.row.hasCheck=(!e.row.hasCheck);
        var str=""+e.row.idPerfil;
        if(e.row.hasCheck){
           dests.push({
               foto:e.row.foto,
               id:e.row.idPerfil
           });
           destsIndex.push(str);
        }else{
            var n=destsIndex.indexOf(str);
            dests.splice(n,1);
        }
      
      
    }
    
   // decorator.pullPush(table,fakeLoad,reloadTable);
    window.add(table);
    reloadTable();
    return window;
    
}

module.exports=multiPickTable;
