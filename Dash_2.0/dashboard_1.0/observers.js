class Observer {
	
	// to be overridden
	update(data) {
		console.log(data);
	}
	
}

class DisplayElement extends Observer{
	
	constructor(dom_selector, device) { // maybe "device" should be "subscribe_to" to be more general for future types of Observables
        super();
        this.dom_selector = dom_selector;
        this.device = device;
        this.device.subscribe(this)
	}
    
    update(data) {
		$(this.dom_selector).find('.value').text(data)
    }
    
}

class Sonoff_Basic_Display extends DisplayElement {
    constructor(dom_selector, device) {
        super(dom_selector, device)
        
        this.switch = $(dom_selector).find("input.toggle")
        $(this.switch).click(() => {
            this.device.toggle($(this.switch).prop("checked"))
        })
        
        this.device.get_state()
    }

    update(data) {
        let json = JSON.parse(data)
        if (json.POWER == "ON") {
            $(this.switch).prop("checked", true)
        } else {
            $(this.switch).prop("checked", false)
        }
        $(this.dom_selector).find('.value').text(json.POWER)
    }
}

class DHT_11_Display extends DisplayElement {

    constructor(dom_selector, device) {
        super(dom_selector, device);
        this.temperature = null;
        this.humidity = null;
    }

    update(data) {
        if($(".value.temp").length) {
            this.temperature = data.temp
            $(this.dom_selector).find('.value.temp').text(this.temperature)
        }
        if($(".value.humid").length) {
            this.humidity = data.hum
            $(this.dom_selector).find('.value.humid').text(this.humidity)
        }
    }

}