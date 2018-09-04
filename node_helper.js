var NodeHelper = require('node_helper');
const Client=require("bitcoin-core");
var client;

module.exports = NodeHelper.create({
	start: function () {
		console.log('BTC Node Status module loaded!')
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === 'get_ticker') {
			this.getTickers(payload)
		}
		if (notification === 'CONFIG') {
			this.config=payload;
			client=new Client({host: this.config.host,
				username: this.config.rpcusername,
				password: this.config.rpcpassword,
				port: this.config.port,});
		}
	},

	getTickers: function (url,payload) {
		const self=this;
		var retObj=[];

		client.upTime().then(function(ret) {
			var seconds=parseInt(ret,10);
			var days=Math.floor(seconds/(3600*24));
			seconds-=days*3600*24;
			var hrs=Math.floor(seconds/3600);
			seconds-=hrs*3600;
			var mnts=Math.floor(seconds/60);
			seconds-=mnts*60;
			self.upTime=days+"d "+hrs+"h "+mnts+"m "+seconds+"s"
		})

		client.getBlockchainInfo().then(function(resp) {
			self.lastBlock=resp["blocks"]
		})

		client.getNetworkInfo().then(function(resp) {
			self.conCount=resp["connections"]
			self.version=resp["subversion"].substring(9,15)
		})
		retObj.push({"name":"Up:","value":self.upTime});
		retObj.push({"name":"Last Block:","value":self.lastBlock});
		retObj.push({"name":"Connections:","value":self.conCount});
		retObj.push({"name":"Version:","value":self.version});
		//console.log(retObj);
		self.sendSocketNotification('got_result',retObj)

  	}
})
