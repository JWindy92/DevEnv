class Observer {
	
	// to be overridden
	update(data) {
		console.log(data);
	}
	
}

class DisplayElement extends Observer{
	
	constructor(dom_selector) {
        super();
		this.dom_selector = dom_selector;
	}
    
    update(data) {
		$(this.dom_selector).find('.value').text(data)
    }
    
}

class DHT_11_Display extends DisplayElement {

    constructor(dom_selector, type) {
        super(dom_selector);
        this.valid_values = ["temperature", "humidity"]
        if (!this.valid_values.includes(type)) {
            console.error("Invalid type for DHT_11 display")
        } else {
            this.type = type
        }
        this.value = null;
    }

    update(data) {
        switch(this.type) {
            case "temperature":
                this.value = data.temp
                break;
            case "humidity":
                this.value = data.hum
                break;
        }
        $(this.dom_selector).find('.value').text(this.value)
    }

}