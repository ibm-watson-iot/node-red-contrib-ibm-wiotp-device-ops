# node-red-contrib-ibm-wiotp-device-ops

A collection of Node-RED nodes to perform device and gateway operations using the Watson IoT Platform.

![IBM Watson IoT Device / Device Type Operations](http://developer.ibm.com/iotplatform/wp-content/uploads/sites/24/2016/10/Device-Manager.png)

Install
-------
Install from [npm](http://npmjs.org)
```
npm install node-red-contrib-ibm-wiotp-device-ops
```

##Device Type Manager node:

Device Type Manager node can perform actions on device types in the IBM Watson IoT Platform.  For some fields, the value can be passed in the `msg`.  Any fields set on the node explicitly take precedence.

### Authentication
##### Authentication type :  
1. Bluemix Service - Uses the Watson IoT Platform service bound to the application.
2. API Key - Use an API key for your Watson IoT Platform organization.

### Device Type

Available for delete, retrieve single device type or update operations, this specifies the Device type for the operation.  May be specified by `msg.payload.deviceType`.

### Class Id
Available for create operation.  Either 'Gateway' or 'Device'.

### Operations
Specifies the operation to be performed.  For more information, read the [Watson IoT Platform documentation](https://console.ng.bluemix.net/docs/services/IoT/index.html).  May be specified by `msg.operation`.

### Serial Number (Optional property)
Serial Number can form one aspect of a devices identifying attributes. Serial numbers are likely to be unique within a model number, but cannot be taken as a device identifier alone.  May be specified by `msg.payload.serialNumber`.

### Device Info Description (Optional property)
This will be copied to all devices of this type when they are added to the Watson IoT Platform.  May be specified by `msg.payload.infoDescription`.

### Manufacturer (Optional property)
The attribute lists the manufacturer of devices in this device type. May be specified by `msg.payload.manufacturer`.

### Firmware Version (Optional property)
Current firmware version installed on the device.  May be specified by `msg.payload.firmwareVersion`.

### Model (Optional property)
This denote groups of devices that serve the same function or have the same characteristics, but may have different hardware versions. May be specified by`payload as msg.payload.model`.

### Hardware Version of a device (Optional property)
May be specified by `msg.payload.hardwareVersion`.

### Device Class (Optional property)
A class of devices is a grouping of devices sharing certain characteristics. A device class usually serves a descriptive function. May be specified by `msg.payload.deviceClass`.

### Descriptive Location (Optional property)
The descriptive location of a device is a separate attribute of a device, and gives a descriptive location rather than a specific measured location. May be specified by `msg.payload.descriptiveLocation`.

### Metadata (Optional property)
Metadata can be used to define custom attribute fields that are not provided by the Watson IoT Platform. May be specified by `msg.payload.metadata`.

-------
## Device manager node :
Device manager node lets you perform actions on devices that are connected to IBM Watson IoT Platform.  For some fields, the value can be passed in the `msg`.  Any fields set on the node explicitly take precedence.


### Authentication
##### Authentication type:
1.	Bluemix Service - Use the Watson IoT service bound to the application.
2.	API Key - Use an API key for your Watson IoT Platform organization.

### Device Type
The device type for the operation. May be specified by `msg.payload.deviceType`.

### Device Operation
Operations that can be performed on the device on Watson IoT Platform. For more information, read the [Watson IoT Platform documentation](https://console.ng.bluemix.net/docs/services/IoT/index.html). May be specified by `msg.operation.xxx` where `xxx` values supported are:

*	GetAll
*	Create
*	Get
*	Update
*	Delete
*	GetLoc
*	UpdateLoc
*	GetDm

## Examples

### Create device using `msg.payload.`:

```

    {
        "deviceId": "string",
        "authToken": "string",
        "deviceInfo": {
            "serialNumber": "string",
            "manufacturer": "string",
            "model": "string",
            "deviceClass": "string",
            "description": "string",
            "fwVersion": "string",
            "hwVersion": "string",
            "descriptiveLocation": "string"
        },
        "location": {
            "longitude": 0,
            "latitude": 0,
            "elevation": 0,
            "accuracy": 0,
            "measuredDateTime": "2016-08-07T18:50:51.553Z"
        },
        "metadata": {}
    }

```

### Bulk create/delete, pass the the input as an array in `msg.payload`:

```
    [
      {
        "typeId": "RaspberryPi",
        "deviceId": "pi01"
      },
        {
        "typeId": "RaspberryPi",
        "deviceId": "pi02"
      }
    ]

```

Copyright and license
----------------------
Copyright 2014, 2016 IBM Corp. under the [Apache 2.0 license](http://www.apache.org/licenses/LICENSE-2.0).
