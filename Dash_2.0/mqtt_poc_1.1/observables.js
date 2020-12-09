

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
	notify(data) {
        console.log(data)
	}
	
}

class Device extends Observable {
	
	constructor(id) {
		super()
		this.id = id
		this.MQTT_topic = "/" + id
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