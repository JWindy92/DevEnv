

class Observable {
	
	constructor() {
		this.observers = [];
	}
	
	subscribe(obj) {
		this.observers.push(obj)
	}
	
	unsubscribe(obj) {
		this.observers = this.observers.filter(subscriber => subscriber !== obj);
	}
	
	// To be overridden
	notify(data, topic) {
        console.log(data)
	}
	
}

class Device extends Observable {
	
	constructor(id) {
		super()
		this.id = id
		this.base_topic = "/" + id
		this.MQTT_topics = []
		this.MQTT_topics.push(this.base_topic)
		this.data = ""
		// this.API_endpoint = base_endpoint + id
		// this.data = {}
		devices.push(this)
		
	}

	notify(data) {
        this.observers.forEach(element => {
            element.update(data)
        });
	}
	
}

class Sonoff_Basic extends Device {
	
	constructor(id) {
		super(id)
		this.stat_topic = "/stat" + this.base_topic + "/RESULT"
		this.cmd_topic = "/cmnd" + this.base_topic + "/POWER"
		this.MQTT_topics.push(this.cmd_topic)	
		this.MQTT_topics.push(this.stat_topic)
		console.log("init")
		client.subscribe(this.stat_topic)
	}

	notify(data) {{
			this.observers.forEach(element => {
				element.update(data)
			});
		}
	}

	get_state() {
		try {
			let message = new Paho.MQTT.Message("")
			message.destinationName = this.cmd_topic
			client.send(message)
		} catch (err) {
			console.error(err)
		}
	}

	toggle(toggle_state) {
		let payload = (toggle_state) ? "ON" : "OFF"
		let message = new Paho.MQTT.Message(payload)
		message.destinationName = this.cmd_topic
		client.send(message)
	}

}

class DHT_11 extends Device {

	constructor(id) {
		super(id);
	}

	notify(data) {
		try {
			let json = JSON.parse(data)
			this.observers.forEach(element => {
				element.update(json)
			});
		} catch(err) {
			console.error(err)
		}
	}

}