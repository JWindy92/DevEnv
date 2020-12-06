$(document).ready(function () {
	console.log('document is ready')
	startConnect()
}) 

topics = ['/test', '/device_1', '/device_2', '/device_3', '/dht_1']
devices = []


// ###### Observer Logic Starts Here ###### //

// class Observable {
	
// 	constructor() {
// 		this.observers = [];
// 	}
	
// 	subscribe(obj) {
// 		this.observers.push(obj)
// 	}
	
// 	unsubscribe(obj) {
// 		this.observers = this.observers.filter(subscriber => subscriber !== obj);
// 	}
	
// 	// To be overridden
// 	notify(data) {
//         console.log(data)
// 	}
	
// }

// class Device extends Observable {
	
// 	constructor(id) {
// 		super()
// 		this.id = id
// 		this.MQTT_topic = "/" + id
// 		this.data = ""
// 		// this.API_endpoint = base_endpoint + id
// 		// this.data = {}
// 		devices.push(this)
		
// 	}

// 	notify(data) {
//         this.observers.forEach(element => {
//             element.update(data)
//         });
// 	}
	
// }

// class DHT_11 extends Device {

// 	constructor(id) {
// 		super(id);
// 	}

// 	notify(data) {
// 		try {
// 			let json = JSON.parse(data)
// 			this.observers.forEach(element => {
// 				element.update(json)
// 			});
// 		} catch(err) {
// 			console.error(err)
// 		}
// 	}

// }

// class Observer {
	
// 	// to be overridden
// 	update(data) {
// 		console.log(data);
// 	}
	
// }

// class DisplayElement extends Observer{
	
// 	constructor(dom_selector) {
//         super();
// 		this.dom_selector = dom_selector;
// 	}
    
//     update(data) {
// 		$(this.dom_selector).find('.value').text(data)
//     }
    
// }

let device_1 = new Device('device_1')
let device_2 = new Device('device_2')
let device_3 = new Device('device_3')
let dht_11 = new DHT_11('dht_1')

let device_1_disp = new DisplayElement("#device_1");
let device_2_disp = new DisplayElement("#device_2");
let device_3_disp = new DisplayElement("#device_3");
let dht_11_temp_disp = new DHT_11_Display("#dht_11_temp", "temperature")
let dht_11_hum_disp = new DHT_11_Display("#dht_11_hum", "humidity")

let dht_observer = new Observer()

device_1.subscribe(device_1_disp)
device_2.subscribe(device_2_disp)
device_3.subscribe(device_3_disp)

dht_11.subscribe(dht_observer)
dht_11.subscribe(dht_11_temp_disp)
dht_11.subscribe(dht_11_hum_disp)




// ########  MQTT LOGIC STARTS HERE #######

function onFailure() {
    console.log("YOU FAILED MF")
}
// Called after form input is processed
function startConnect() {
    // Generate a random client ID
    clientID = "clientID-" + parseInt(Math.random() * 100);
    console.log(clientID)
    // Fetch the hostname/IP address and port number from the form
    host = "10.0.0.228";
    port = 9001;

    // Print output for the user in the messages div
    document.getElementById("messages").innerHTML += '<span>Connecting to: ' + host + ' on port: ' + port + '</span><br/>';
    document.getElementById("messages").innerHTML += '<span>Using the following client value: ' + clientID + '</span><br/>';

    // Initialize new Paho client connection
	client = new Paho.MQTT.Client(host, Number(port), clientID);

    // Set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // Connect the client, if successful, call onConnect function
    client.connect({ 
        onSuccess: onConnect,
        onFailure: onFailure
	});

	updateScroll();
}

// Called when the client connects
function onConnect() {    

    // Subscribe to the requested topic
    topics.forEach((topic) => {
		console.log('Subscribing to: ', topic)
		document.getElementById("messages").innerHTML += '<span>Subscribing to: ' + topic + '</span><br/>';
		client.subscribe(topic)
	})
	updateScroll();

}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
    document.getElementById("messages").innerHTML += '<span>ERROR: Connection lost</span><br/>';
    if (responseObject.errorCode !== 0) {
        document.getElementById("messages").innerHTML += '<span>ERROR: ' + + responseObject.errorMessage + '</span><br/>';
	}
	startConnect()
}

// Called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived: " + message.payloadString);
    document.getElementById("messages").innerHTML += '<span>Topic: ' + message.destinationName + '  | ' + message.payloadString + '</span><br/>';
	updateScroll()

	
	console.log("Full message:", message)
	devices.forEach(function(device) {
		
		if (device.MQTT_topic == message.destinationName) {
			device.notify(message.payloadString)
		}
	})
}

// Called when the disconnection button is pressed
function startDisconnect() {
    client.disconnect();
    document.getElementById("messages").innerHTML += '<span>Disconnected</span><br/>';
}

// Updates #messages div to auto-scroll
function updateScroll() {
    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
}

