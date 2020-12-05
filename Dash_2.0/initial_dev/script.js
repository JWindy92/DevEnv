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
	
	notify() {
        this.observers.forEach(element => {
            element.update()
        });
	}
	
}

class Observer {
	
	// to be overridden
	update() {
		console.log(data);
	}
	
}

class DisplayElement extends Observer{
	
	constructor(dom_selector) {
        super();
		this.dom_selector = dom_selector;
	}
    
    update() {
		let val = Math.floor((Math.random() * 100) + 1)
		$(this.dom_selector).find('.value').text(val)
    }
    
}


class Device extends Observable {
	
	constructor(id) {
		this.id
		this.MQTT_topic = base_topic + id
		this.API_endpoint = base_endpoint + id
		this.data = {}
	}
	
	listener() {
		//the logic to subscribe and listen to MQTT for updates
		//recieves the message and assigns message to this.data
		//then calls notify(this.data)
	}
	
}

let observable_button = new Observable();

let device_1 = new DisplayElement("#device_1");
let device_2 = new DisplayElement("#device_2");
let device_3 = new DisplayElement("#device_3");

observable_button.subscribe(device_1)
observable_button.subscribe(device_2)
observable_button.subscribe(device_3)

$("#test-btn").click(function() {
    console.log(observable_button.notify())
})


