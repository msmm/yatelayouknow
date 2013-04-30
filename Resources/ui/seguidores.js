//////////////////////////////
// RECIBE :
//  params={
//    id: id de la empresa
//        }
///////////////////////////////

function seguidores(params,openW){
    
    var pagina=1;
    var decorator = require("utils/decorators");
	var dataIndex=[];
	 var socialWindowObj=require('social/socialWindow');
///     Reloads     ////
    function reloadTable() {
    
     var url = params+"&pagina="+pagina;
    //Ti.API.info("URL Swguidores"+url);
    var client = Ti.Network.createHTTPClient({
     onload : function(e) {
       //Ti.API.info("Seguidores "+this.responseText);
       pagina++;
       tv.addRows(this.responseText);
     },
     onerror : function(e) {
         alert("Error en la conexión");
         Ti.API.error(e.error);
     },
     timeout : 5000
 });
 client.open("GET", url);
 client.send(); 
    }
    function fakeLoad(){
       tv.fireEvent('data:finishreloading');
   }
////////////////////////////////////////////
   
    var window = Ti.UI.createWindow({
        title: "Seguidores",
        "barImage": "images/empresarial/BarraTitulo.png"
    });
    
    var tv = Ti.UI.createTableView({
        width:decorator.screenWidth,
        height:Ti.UI.FILL,
        showVerticalScrollIndicator : false,
    });
    
    tv.addRows = function(res){
        var datos = JSON.parse(res);
        datos= datos.followers;
        if(datos[0].alerta){
            
        }else{

        for(var i=0,j=datos.length;i<j;i++){
            
            var row = Titanium.UI.createTableViewRow({
                className:'seguidoresRow',
                height: 60,
                layout: "horizontal",
                hasChild: true,
                idCuenta: datos[i].numCuenta
            });
            var nombre = Ti.UI.createLabel({
                text: datos[i].fullname,
                left: 10,
                font:{fontFamily: 'Source Sans Pro', fontSize:14, fontWeight:'bold'},
            });
            var foto = Ti.UI.createImageView({
                image : (decorator.sitio+datos[i].foto),
                defaultImage:'images/fotodefault.jpg',
                width : Ti.UI.FILL
            });
            var marco = Ti.UI.createView({
                height : 54, 
                width : 54,
                left : 10,
                top : 3
            });
            marco.add(foto);
            row.add(marco);
            row.add(nombre);          
            tv.appendRow(row);
            var len=dataIndex.length;
            dataIndex[len]=datos[i];
        }
        tv.len=dataIndex.length;
        }
        
         tv.fireEvent('data:finishreloadingOld');
        
    };
    decorator.pullPush(tv,fakeLoad,reloadTable);
    
    tv.addEventListener('click',function(e){
          var socialHome=new socialWindowObj({
         id:e.row.idCuenta,
         stopLoading:function(){},
         openW:function(e){},
         closeW:function(e){}
         });
         openW(socialHome);
        
        
    });
    
    
    window.add(tv);
    reloadTable();
    return window;
}

module.exports=seguidores;