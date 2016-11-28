/**
 * Copyright 2014, 2015, 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    "use strict";
    var cfEnv = require("cfenv");
    var IBMIoTF = require('ibmiotf');

    var appClient;

    //support for multiple orgs
    var wiot_services  = cfEnv.getAppEnv().services['iotf-service'];

    var wiotp_creds = {};

    function connectBluemix() {
      if (wiot_services) {
        // TODO: remove this when we need to support multiple orgs
        var serviceCreds = wiot_services[0];

        wiotp_creds = {
          org: serviceCreds.credentials.org,
          id: Date.now().toString(),
          "auth-key": serviceCreds.credentials.apiKey,
          "auth-token": serviceCreds.credentials.apiToken
          };
        appClient = new IBMIoTF.IotfApplication(wiotp_creds);

      }
    }

    function connectApiKey(creds) {
        wiotp_creds = {
          org: creds.user.split('-')[1],
          id: Date.now().toString(),
          "auth-key": creds.user,
          "auth-token": creds.password
          };
        appClient = new IBMIoTF.IotfApplication(wiotp_creds);

    }
    //initialize with Bluemix service
    connectBluemix();

    RED.httpAdmin.get('/watsoniot/devicemanager/orgid', function(req,res) {
        res.send(JSON.stringify(wiotp_creds.org));
    });

    RED.httpAdmin.get('/watsoniot/devicemanager/getbluemixtypes', function(req,res) {

        connectBluemix();
        res.send('success');
    });

    RED.httpAdmin.get('/watsoniot/devicemanager/gettypes', function(req,res) {

      if(appClient) {
        appClient.getAllDeviceTypes().then (function onSuccess (response) {
              res.send(response);
          }, function onError (error) {
              res.status(403).send("No device types");
        });
      } else {
        res.status(401).send('Uninitialized Error');
      }
    });

    RED.httpAdmin.post('/watsoniot/devicemanager/newapikey', function(req,res) {

      if(req.body.credentials && req.body.credentials.user && req.body.credentials.password) {
        connectApiKey(req.body.credentials);
      } else {
        var deviceNode = RED.nodes.getNode(req.body.id);
        connectApiKey(deviceNode.credentials);
      }

      res.status(201).send('success');
    });

    function DeviceFactoryHandler(config) {
        RED.nodes.createNode(this,config);

        var authSelected = config.auth;

        if(authSelected === 'bluemix') {

          connectBluemix();

        } else if(authSelected === 'api'){

          var deviceNode = RED.nodes.getNode(config.apiKey);
          connectApiKey(deviceNode.credentials);

        }
        var node = this;

        this.on('input', function(msg) {

          // Functions for success and failure for rest calls.
          var clearStatus = function(){
            setTimeout( function(){
              node.status({});
            },2000);
          }

          var onSuccess = function(argument) {
                  var msg = {
                    payload : argument
                  }
                  node.send(msg);
                  node.status({fill:"green",shape:"dot",text:"Success"});
                  clearStatus();
          };

          var onError =  function(argument) {
                  var msg = {
                    payload : argument
                  }
                  node.send(msg);

                  node.status({fill:"red",shape:"dot",text:"Error. Refer to debug tab"});
          };


          node.status({fill:"blue",shape:"dot",text:"Requesting"});

          //pass the operation name in msg
          var operation = msg.operation ? msg.operation : config.method;
		      var operation_lowercase=operation.toLowerCase();

          //rest all values from msg.payload
          //try to parse the payload if its string
          if( typeof msg.payload === 'string') {
            try {
              msg.payload = JSON.parse(msg.payload);
            } catch( exception) {

            }
          }
          var ignore = config.ignore ? config.ignore : msg.payload.ignore;

          // check if he is trying for bulk operation.
          // If the payload is an array, use BULK operation.
          if(Array.isArray(msg.payload)) {

            switch (operation_lowercase) {
                case "create":
                  appClient.registerMultipleDevices(msg.payload).then(onSuccess,onError);
                  break;

                case "delete":
                  appClient.deleteMultipleDevices(msg.payload).then(onSuccess,onError);
                  break;

                default :
                  node.error("Unsupport Bulk operation " +operation+ ". Supported operations are Create and Delete");
                  clearStatus();
                }

            return;
          }

          // take the values from config, if not get it from msg.
          var deviceType = config.deviceType ? config.deviceType : msg.payload.deviceType;
          var deviceId = config.deviceId ? config.deviceId : msg.payload.deviceId;


          // get the values from msg.
          var authToken = msg.payload.authToken ? msg.payload.authToken : undefined;
          var desc = msg.payload.description ? msg.payload.description :  "";
          var metadata = msg.payload.metadata ? msg.payload.metadata : {};
          var deviceInfo = msg.payload.deviceInfo ? msg.payload.deviceInfo : {};
          var location = msg.payload.location ? msg.payload.location : {};
          var extensions = msg.payload.extensions ? msg.payload.extensions : {};
          var status = msg.payload.status ? msg.payload.status : {};


          if(!deviceType ){
            node.error("DeviceType must be set for "+operation+" operation. You can either set in the configuration or must be passed as msg.payload.deviceType");
            clearStatus();
            return;
          }

          if((operation_lowercase !== 'getall' ) && !deviceId ){
            node.error("DeviceId must be set for "+operation+" operation. You can either set in the configuration or must be passed as msg.payload.deviceId");
            clearStatus();
            return;
          }

          switch (operation_lowercase) {
                case "create":
                  var errorHandler =function(argument){
                    if(argument.status == 409 && ignore){
                      node.status({fill:"yellow",shape:"dot",text:"Device Id aready exist"});
                      clearStatus();
                    }else{
                      onError(argument)
                    }
                  }
                  appClient.registerDevice(deviceType, deviceId, authToken, deviceInfo, location, metadata).then(onSuccess,errorHandler);
                  break;
                case "update":
                  appClient.updateDevice(deviceType, deviceId, deviceInfo, status, metadata, extensions).then(onSuccess,onError);
                  break;
                case "delete":
                  appClient.unregisterDevice(deviceType, deviceId).then(onSuccess,onError);
                  break;
                case "get":
                  appClient.getDevice(deviceType, deviceId).then(onSuccess,onError);
                  break;
                case "getall":
                  appClient.listAllDevicesOfType(deviceType).then(onSuccess,onError);
                  break;
                case "getloc":
                  appClient.getDeviceLocation(deviceType, deviceId).then(onSuccess,onError);
                  break;
                case "updateloc":
                  if(!location) {
                    node.error("Location must be set. It can be set using msg.location");
                    return;
                  }
                  appClient.updateDeviceLocation(deviceType, deviceId, location).then(onSuccess,onError);
                  break;
                case "getdm":
                  appClient.getDeviceManagementInformation(deviceType, deviceId).then(onSuccess,onError);
                  break;
                case "get all gw":
                  break;
          }

        });
    }


    RED.nodes.registerType("device-manager",DeviceFactoryHandler);


    function WIoTPNode(n) {
      RED.nodes.createNode(this,n);
      this.name = n.name;

    }
    RED.nodes.registerType("wiotp",WIoTPNode, {
      credentials: {
        user: {type:"text"},
        password: {type:"password"}
      }
    });
}
