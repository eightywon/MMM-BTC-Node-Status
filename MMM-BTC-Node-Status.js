Module.register("MMM-BTC-Node-Status", {
	start: function() {
		var self=this;
		this.sendSocketNotification('CONFIG',this.config);
		setInterval(function() {
			self.getTicker();
		}, 100000)
		this.getTicker();
	},

	getDom: function() {
	        var data = this.result

		if (data) {
			var wrapper=document.createElement('table')
			wrapper.className='small MMM-BTC-Node-Status'
			for (i = 0; i < data.length; i++) {
				var thisStat=data[i]
				var trWrapper=document.createElement('tr')
				trWrapper.className='stat'
				var tdWrapper=document.createElement('td')
				tdWrapper.innerHTML=thisStat.name
				trWrapper.appendChild(tdWrapper)
				var tdWrapper=document.createElement('td')
				tdWrapper.innerHTML=thisStat.value
				trWrapper.appendChild(tdWrapper)
				wrapper.appendChild(trWrapper)
			}
			return wrapper
		}
	},

	getTicker: function() {
		var url='lightning'
		this.sendSocketNotification('get_ticker', url)
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification==='got_result') {
			this.result=payload
			if (payload!='undefined') {
				this.updateDom()
			}
		}
	},

 	getStyles: function() {
		return ['MMM-BTC-Node-Status.css']
	},
})
