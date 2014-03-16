/**
 * @author Wuliang
 */

var manager = {
	_players : [],
	simulators : [],
	contents : '',
	ready : {size : 0},
    fapaiOK : {size : 0},
	_msgListeners : {},
	open : function(url, name, options) {
		var win = window.open(url, name, options), simulator = {
			win : win
		};
		this.simulators[this.simulators.length] = simulator ;
		
		var self = this.simulators.length - 1, forward = self - 1, backward = self + 1;
		
		if (forward < 0) {//first
			forward = this._players.length - 1;
		}

		if (backward == this._players.length) {
			backward = 0;
		}
		
		simulator.self = this._players[self];
		
		var data = {
			players : this._players,
			self:this._players[self],
			forward : this._players[forward],
			backward : this._players[backward],
			playNum : this._players.length,
		};
		setTimeout(function() {
			win.postMessage(JSON.stringify({
				action : 'reg',
				data : data,
			}), "*");
		}, 400);
	},
	
	build : function(option) {
		var size = option.size || 0;
		for (var i = 0; i < size; i++) {
			this._players.push({
				ip : '192.168.0.10' + i,
				position : i,
				name : 'player_' + i
			});
		}
	},
	size : function() {
		return this._players.length;
	},
	debug : function(msg) {
		manager.contents = document.getElementById("text").innerHTML + "<p class='debug'>" + msg +'</p>';
		document.getElementById("text").innerHTML = manager.contents;
	},
	info : function(msg) {
		manager.contents = document.getElementById("text").innerHTML + "<p class='info'>" + msg +'</p>';
		document.getElementById("text").innerHTML = manager.contents;
	},
	warn : function(msg) {
		manager.contents = document.getElementById("text").innerHTML + "<p class='warn'>" + msg +'</p>';
		document.getElementById("text").innerHTML = manager.contents;
	},
	error : function(msg) {
		manager.contents = document.getElementById("text").innerHTML + "<p class='error'>" + msg +'</p>';
		document.getElementById("text").innerHTML = manager.contents;
	},
	listeners : function(action) {
		return this._msgListeners[action] || [];
	},
	addMessageListener : function(action, fn) {
		var listeners = this._msgListeners[action] || [];
		listeners.push(fn);
		this._msgListeners[action] = listeners;
	},
	close : function() {
		for (var i = 0; i < this.simulators.length; i++) {
			var simulator = this.simulators[i];
			simulator.win.close();
		}
		this._players = [];
		this.ready = {};
		this.simulators =[];
		this.contents = '';
		this.ready = [];
	},
	
};

window.addEventListener('message', function(event) {
	var data = JSON.parse(event.data);
	
	if(data.action) {
		var listeners = manager.listeners(data.action);
		for (var i = 0; i < listeners.length; i++) {
			listeners[i](data);
		}
	}
}, false);

// 主窗体关闭,附属子窗体都关闭。
window.addEventListener('unload', function(e) {
	manager.close();
}, false);

manager.addMessageListener('log', function(data) {
	manager.info( data.from.name + ":" + data.data);
});

manager.addMessageListener('close', function(data) {
	manager.warn(data.from.name + "关闭");
});

manager.addMessageListener('ready', function(data) {
	if(!(data.from.name in manager.ready)){
		manager.info(data.from.name + "get Ready");
		manager.ready[data.from.name] = data.from;
		manager.ready.size = manager.ready.size + 1;
	}
	
	manager.info("ready size :"+manager.ready.size);
	if(manager.ready.size === manager.simulators.length){
		manager.info("所有玩家ready");
		for(var i=0;i<manager.simulators.length ;i++){
			var postData = JSON.stringify({
				action:'onready',
				data : '',
			});
			manager.simulators[i].win.postMessage(postData,"*");
		}
	}
	
});

manager.addMessageListener('postall', function(data) {
	for(var i=0;i<manager.simulators.length ;i++){
		var simulator = manager.simulators[i];
        if(data.data.eventTag=="fapaiOK"){
                if(!(data.data.from in manager.fapaiOK)){
                    manager.fapaiOK.size = manager.fapaiOK.size + 1;
                }
                manager.info("fapaiOK size :"+manager.fapaiOK.size);
                if(manager.fapaiOK.size === manager.simulators.length){
                    manager.info("所有玩家fapaiOK");
                }
        }
	//	if(simulator.self.name != data.from.name){
			simulator.win.postMessage(JSON.stringify({
				action : 'lcmessage',
				data : data.data,
			}),"*");
			manager.debug("来自:" + data.from.name + " 的消息发送到:" + simulator.self.name  );
//		}
	}
});

