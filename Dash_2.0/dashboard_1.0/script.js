$(document).ready(function () {
	console.log('document is ready')
	startConnect()
}) 

topics = ['/rgb_light', '/toggle_light', '/temp_sensor', '/test']
devices = []

function init_devices() {

    let toggle_light = new Sonoff_Basic('toggle_light')
    let dht_11 = new DHT_11('temp_sensor')

    let toggle_light_disp = new Sonoff_Basic_Display("#toggle_light_disp", toggle_light);
    let dht_11_temp_disp = new DHT_11_Display("#temp_sensor_disp", dht_11)
    let dht_11_humid_disp = new DHT_11_Display("#humid_sensor_disp", dht_11)
    let dht_11_dual_disp = new DHT_11_Display("#dual_dht_disp", dht_11)

}

// ######## DEVICE SIMS ######## //
setInterval(function() {
    json = {
        "temp": parseInt(Math.random() * 100),
        "hum": parseInt(Math.random() * 100)
    }
    
    message = new Paho.MQTT.Message(JSON.stringify(json))
    message.destinationName = "/temp_sensor"
    client.send(message)
}, 4000)

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
    console.log("On Connect Done")
    updateScroll();
    init_devices()
    
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
    document.getElementById("messages").innerHTML += '<span>Topic: ' + message.destinationName + '  | ' + message.payloadString + '</span><br/>';
	updateScroll()

	devices.forEach(function(device) {
		
		if (device.MQTT_topics.includes(message.destinationName)) {
			device.notify(message.payloadString, message.destinationName)
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

