# node-red-contrib-ibm-wiotp-device-ops

A collection of Node-RED nodes that can perform a wide range of device and gateway operations on the Watson IoT platform

##Device Type Manager node:

Device Type Manager node will help you to perform actions on device types in the IBM Watson IoT Platform
### Authentication
##### Authentication type :  
1. Bluemix Service - Uses the Watson IoT service bound to this application
2. API Key - Use the API key of your Organization of Watson IoT Platform

### Device Type

In case of delete, retrieve single device type or update operations, this lists the Device types present in your organization.

In case of Create operation, this value has to be passed. You can also pass this value from payload as msg.payload.deviceType. But values present in configuration takes more precedence.

### Class Id
This could either be Gateway or a Device

### Operations
 Operation that can be performed on the device types on Watson IoT Platform. For more information, visit [swagger page](https://docs.internetofthings.ibmcloud.com/swagger/v0002.html).

### Serial Number
Serial Number can form one aspect of a devices identifying attributes. Serial numbers are likely to be unique within a model number, but cannot be taken as a device identifier alone. This value could be passed from payload as `msg.payload.serialNumber`. But values present in configuration take more precedence.

### Device Info Description
This will be copied to all devices of this type when they are added to the Watson IoT Platform. This value could be passed from payload as `msg.payload.infoDescription`. But values present in configuration take more precedence.

### Manufacturer
The attribute lists the manufacturer of devices in this device type. This value could be passed from payload as `msg.payload.manufacturer`. But values present in configuration take more precedence.

### Firmware Version
  Current firmware version installed on the device. This value could be passed from payload as `msg.payload.firmwareVersion`. But values present in configuration take more precedence.

### Model
This denote groups of devices that serve the same function or have the same characteristics, but may have different hardware versions. This value could be passed from `payload as msg.payload.model`. But values present in configuration take more precedence.

### Hardware Version of a device
 This value could be passed from payload as `msg.payload.hardwareVersion`. But values present in configuration take more precedence.

### Device Class
A class of devices is a grouping of devices sharing certain characteristics. A device class usually serves a descriptive function. This value could be passed from payload as `msg.payload.deviceClass`. But values present in configuration take more precedence.

### Descriptive Location
The descriptive location of a device is a separate attribute of a device, and gives a descriptive location rather than a specific measured location. This value could be passed from payload as `msg.payload.descriptiveLocation`. But values present in configuration take more precedence.

### Metadata  
Metadata can be used to define custom attribute fields that are not provided by the Watson IoT Platform. This value could be passed from payload as `msg.payload.metadata`. But values present in configuration take more precedence.



-------
## Device manager node :
Device manager node lets you perform actions on devices that are connected to IBM Watson IoT Platform

### Authentication
##### Authentication type:
1.	Bluemix Service - Use the Watson IoT service bound to this application
2.	API Key - Use a Watson IoT Platform API key from your organization

### Device Type
Lists the device types that are present in your organization. You can also pass this value from a payload by using `msg.payload.deviceType`. However, values that are present in the configuration takes precedence.

### Device Operation
Operations that can be performed on the device on Watson IoT Platform. For more information, see the devices API documentation. You can also pass the value from a msg by using `msg.operation. `
The following values are supported:
*	GetAll
*	Create
*	Get
*	Update
*	Delete
*	GetLoc
*	UpdateLoc
*	GetDm

To pass the pass the values dynamically, you must pass the input in` msg.payload`.

For example, to create a device, pass the following JSON in ` msg.payload `

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

If you want to use the bulk create/delete operations, pass the the input as an array in `msg.payload`.

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
