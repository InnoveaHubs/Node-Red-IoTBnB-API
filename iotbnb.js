

module.exports = function(RED) {
    function iotbnb(n) {
        RED.nodes.createNode(this,n);
        var node = this;
        this.on('input', function(msg) {

            var path_InfoItem, token, operations, type1, reputation, price;

            var iotbnbcons = require('node-red-contrib-iotbnb/iotbnbcons/iotbnbcons.js');

            var omiN = new iotbnbcons();

            if(typeof msg.operations!="undefined"){
                operations= n.operations || msg.operations;
            }
            else{
                operations= n.operations;
            }
	
            if (n.type1=="" && typeof msg.type1=="undefined"){
                type1="all";
            }
            else{
                type1=n.type1 || msg.type1;
            }

            if (n.price=="" && typeof msg.price=="undefined"){
                price=0;
            }
            else{
                price=n.price || msg.price;
            }

            if (n.reputation=="" && typeof msg.reputation=="undefined"){
                reputation="all";
            }
            else{
                reputation=n.reputation || msg.reputation;
            }

            if (n.service=="" && typeof msg.service=="undefined"){
                service="Objects/";
            }
            else{
                service=n.service || msg.service;
            }

        var options = {
                operations: operations,
                type1: type1,
                price: price,
                reputation: reputation,
                service: service
          };

            /*
            console.log("---=====//////////////-----");
            console.log(operations);
            console.log(type1);
            console.log(price);
            console.log(reputation);
            console.log("---=====//////////////-----");  
            */            

          if (operations == "getAllServices"){
            var oper_type="";
                omiN.callMethod(options, function(err, events) {
                    msg.payload = events;
                    msg.err = err;
                    node.send(msg);
                });
            }
             else if (operations == "searchServices"){
                omiN.callMethod(options, function(err, events) {
                    msg.payload = events;
                    msg.err = err;
                    node.send(msg);
                });
            }
            else if (operations == "getServiceAccessInformation"){
                omiN.callMethod(options, function(err, events) {
                    msg.payload = events;
                    msg.err = err;
                    node.send(msg);
                });
            }
            else{
                node.send("There is a problem because no operation has been selected");
            }
        });
}
RED.nodes.registerType("iotbnb",iotbnb);

};



