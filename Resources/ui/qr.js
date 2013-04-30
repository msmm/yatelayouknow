

function qr(params){
    
    var decorator = require("utils/decorators");
    var loadingView = decorator.loadingIndicator();
    
    var qrHome = Ti.UI.createWindow({
     backgroundColor:'#fff',
     title: L('qr'),
     barImage: "images/empresarial/BarraTitulo.png"
    });
    
    qrHome.add(loadingView);
    
    
    var Barcode = require('ti.barcode');
    Barcode.allowRotation = true;
    Barcode.displayedMessage = '';
    
    
    var scrollView = Ti.UI.createView({
        top: 0,
    });
    
    /**
     * Create a chrome for the barcode scanner.
     */
    var overlay = Ti.UI.createView({
        backgroundColor: 'transparent',
        top: 0, right: 0, bottom: 0, left: 0
    });
    var watermark = Ti.UI.createImageView({
        image: 'images/watermark.png',
        opacity: 0.5,
        width: 320,
        height: 119,
        left: 0,
        bottom: 0,
        touchEnabled: false
    });
    overlay.add(watermark);
    
    var cancelButton = Ti.UI.createButton({
        title: L('cancel'), 
        textAlign: 'center',
        color: '#000', 
        backgroundColor: '#fff', 
        style: 0,
        font: { 
            fontWeight: 'bold', 
            fontSize: 16
        },
        borderColor: '#000', 
        borderRadius: 10, 
        borderWidth: 1,
        opacity: 0.5,
        width: 120,
        height: 22,
        bottom: 20,
    });
    cancelButton.addEventListener('click', function () {
        Barcode.cancel();
    });
    
    overlay.add(cancelButton);
    
    /**
     * Create a button that will trigger the barcode scanner.
     */
   
    var myQR = Ti.UI.createImageView({
        backgroundColor: '#fff',
        width: 300,
        height: 300,
        top:40
    });
    
    scrollView.add(myQR);
    
    var scanCode = Ti.UI.createButton({
        backgroundImage:'images/empresarial/BarraTitulo.png',
        title: L('scan_code'),
        width: (decorator.screenWidth*0.96),
        borderRadius:3,
        height: 25,
        bottom: 20
    });

    scanCode.addEventListener('click',activateScan);
scrollView.add(scanCode);


    function activateScan() {

       reset();
        Barcode.capture({
            animate: true,
            overlay: overlay,
            showCancel: false,
            showRectangle: true,
            keepOpen: false,
            acceptedFormats: [Barcode.FORMAT_QR_CODE]
        });
        
    }
    
    

    
    /**
     * Now listen for various events from the Barcode module. This is the module's way of communicating with us.
     */
    var scannedBarcodes = {}, scannedBarcodesCount = 0;
    function reset() {
        scannedBarcodes = {};
        scannedBarcodesCount = 0;
        cancelButton.title = L('cancel');
        
    }
    
  
    
    Barcode.addEventListener('success', function (e) {
       
       //alert(e.result);
        var infoo = e.result.split("-");
       var scanUserId=infoo[0];
        
            var client = Ti.Network.createHTTPClient({
         // function called when the response data is available
         onload : function(e) {
            
           // alert(this.responseText);
            var res = JSON.parse(this.responseText);
            if(res.userType=='normalUser'){
                var socialWindowObj=require('social/socialWindow');
                var socialHome=new socialWindowObj({
         id:scanUserId,
         stopLoading:function(){ },
         openW:params.openW,
         closeW:params.closeW
         });
     params.openW(socialHome);
            }

         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
           //  alert(JSON.stringify(e));
           alert("Error de conexión.");
         },
         timeout : 5000  // in milliseconds
     });
     // Prepare the connection.
     client.open("GET", (decorator.sitio + '/ws_userType.php?id=' + scanUserId));
     // Send the request.
     client.send(); 
        
    });
    
    qrHome.add(scrollView);
    
    function updateQr(){
          var client = Ti.Network.createHTTPClient({
         // function called when the response data is available
         onload : function(e) {
            //Ti.API.info("QQRR UPDATE "+this.responseText);
            var data = JSON.parse(this.responseText);
            myQR.image = (decorator.sitio +data.qr[0].path);
         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
             loadingView.hide();
         },
         timeout : 5000  // in milliseconds
     });
     // Prepare the connection.
     client.open("GET", (decorator.sitio + '/ws_qr_update.php?id='+decorator.idPerfil()));
     // Send the request.
     client.send(); 
    }
    
    qrHome.addEventListener("open", function() {
        //Ti.API.info((decorator.sitio + '/ws_qr.php?id='+decorator.idPerfil()));
           var client = Ti.Network.createHTTPClient({
         // function called when the response data is available
         onload : function(e) {
            //Ti.API.info("QQRR "+this.responseText);
             var data = JSON.parse(this.responseText);
             if(data.codigo_qr[0].alerta)updateQr();
             loadingView.hide();
            myQR.image = decorator.sitio +data.codigo_qr[0].path;
            
         },
         // function called when an error occurs, including a timeout
         onerror : function(e) {
             loadingView.hide();
         },
         timeout : 5000  // in milliseconds
     });
     // Prepare the connection.
     client.open("GET", (decorator.sitio + '/ws_qr.php?id='+decorator.idPerfil()));
     // Send the request.
     client.send(); 
        
        
    });
    
    return qrHome;    
}

module.exports=qr;
