
function tipsTable(settings){

    var pagina=2;
    // TableView data.
    var tableData = [];
    var decorator = require('utils/decorators');

    var spacio = Ti.UI.createView({
       backgroundColor:"white",
       height:20
   });
     // Create a TableView.
    var tipsTableView = Ti.UI.createTableView({
        backgroundColor:'white',
        data:tableData,
        top:settings.top,
        headerView: spacio,
        showVerticalScrollIndicator : false,
        width: (settings.width*decorator.screenWidth),
        height:(settings.compacto ? Ti.UI.SIZE : Ti.UI.FILL),
        separatorColor:"transparent",
        allowsSelection: false,
        scrollable : (settings.scrollable ? true : false)
    });
    
    
tipsTableView.reset = function(){
    tableData=[];
    pagina=2;
    tipsTableView.setData(tableData);
}
    
    
/// Agregar Rows a la tabla ///
tipsTableView.addRows =  function(res){
    
    
    if(res.tips[0].alerta){
        
    }else{
         //Llenado de el arreglo
    for(var i=0,j=res.tips.length;i<j;i++ ){
    //Row
    var row = Ti.UI.createTableViewRow({
    className:'tipsRow', // used to improve table performance
    layout:"vertical",
    rowIndex:tableData.length, // custom property, useful for determining the row during events
    height:Ti.UI.SIZE,
    top:20
   // width:Ti.UI.FILL
    });
    
    //View
    var view = Titanium.UI.createView({
   width:(settings.width*decorator.screenWidth),
   height:Ti.UI.SIZE,
   top:0
    });
    var footer = Titanium.UI.createView({
   width:Ti.UI.FILL,
   height:Ti.UI.SIZE,
   top:10
    });
   //Img avatar
    var imageAvatar = Ti.UI.createImageView({
    image: (decorator.sitio+""+res.tips[i].foto),
    left:0, top:3,
    width:35, height:35,
    borderWidth:1,
    borderColor:"#999999",
    hires:true
  });
  view.add(imageAvatar);
  
  var imageComas = Ti.UI.createImageView({
    image: 'images/empresarial/comillasTip.png',
    left:49, top:20,
    width:20, height:15
  });
  view.add(imageComas);
  
  //labels
  var labelUserName = Ti.UI.createLabel({
    color:'#005890',
    font:{fontFamily: 'Source Sans Pro', fontSize:13, fontWeight:'bold'},
    text:res.tips[i].fullname,
    left:49, top: 3,
    width:200, height: 15
  });
  view.add(labelUserName);
  var labelTip = Ti.UI.createLabel({
    color:'#404040',
    font:{fontSize:13, fontStyle:'italic',fontFamily: 'Source Sans Pro'},
    text:res.tips[i].txt,
    left:79, top: 20,
    right:2,
    height: Titanium.UI.SIZE
  });
  view.add(labelTip);
  
  
  //buttons
  var likeB =  decorator.likeButton({
      "totLikes":res.tips[i].totLikes,
      "likeUser":res.tips[i].likeUser,
      "right" : 0,
      "keyPublicacion":res.tips[i].keyTip,
      "numCuenta": res.tips[i].idUser,
      "tn" :40
  });
  footer.add(likeB);
  row.add(view);
  row.add(footer);
  tableData.push(row);
  tipsTableView.appendRow(row);
    }
    
    tipsTableView.fireEvent('data:finishreloadingOld');
    tipsTableView.len= tableData.length;
    
    if(settings.compacto){
    tipsTableView.setHeight(1);
    setTimeout(function(){
            tipsTableView.height=Ti.UI.SIZE;
        }, 100);
    }
   }
    
};

    function fakeLoad(){
       tipsTableView.fireEvent('data:finishreloading');
   }
   
   function reloadTable() {
        var url = "http://www.vielite.com/ws_tips.php?idUser="+decorator.idPerfil()+"&id="+settings.id+"&pagina="+pagina;
    var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
         pagina++;
       //Ti.API.info("TIPS "+this.responseText);
       var res=JSON.parse(this.responseText);
       if(res.tips[0].alerta){
           tipsTableView.fireEvent('data:finishreloadingOld');
       }else{
          tipsTableView.addRows(res); 
       }
      
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         
     },
     timeout : 5000  // in milliseconds
 });
 // Prepare the connection.
 client.open("GET", url);
 // Send the request.
 client.send(); 
    }

    decorator.pullPush(tipsTableView,fakeLoad,reloadTable);
    
    // Add to the parent view.
    return tipsTableView;
    
    
}



module.exports = tipsTable;