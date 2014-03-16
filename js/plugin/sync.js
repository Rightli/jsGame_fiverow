(function() {
	var uuid = function(len, radix) {
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		var uuid = [], i;
		radix = radix || chars.length;
		if (len) {
			// Compact form
			for ( i = 0; i < len; i++)
				uuid[i] = chars[0 | Math.random() * radix];
		} else {
			// rfc4122, version 4 form
			var r;
			// rfc4122 requires these characters
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';
			// Fill in random data.  At i==19 set the high bits of clock sequence as
			// per rfc4122, sec. 4.1.5
			for ( i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}
		return uuid.join('');
	}, SyncArray = function() {
		var x = Array.apply(null, arguments);
		for (var p in x)
		this[p] = x[p];
		this.length = x.length;
		this.__id = uuid(8, 16);
		this.__type = 'SyncArray';
	}, syncVal = function(prop, oldval, val) {
		//var obj = JSON.stringify(this);
		//console.log(obj);
		$.lc.notify('all', {
			eventTag : 'sync',
			id : this.__id,
			type : 'object',
			prop : prop,
			oldval : oldval,
			val : val,
		});
	}, syncArr = function() {
		var action = arguments[0], args = [];
		for (var i = 1; i < arguments.length; i++) {
			args[args.length] = arguments[i];
		}
		$.lc.notify('all', {
			eventTag : 'sync',
			id : this.__id,
			type : 'array',
			action : action,
			args : args,
		});
	};
	SyncArray.prototype = new Array();
	SyncArray.prototype.constructor = SyncArray;
	SyncArray.prototype.push = function() {
		Array.prototype.push.apply(this, arguments);
		syncArr.apply(this, 'push', arguments[0]);
	};
	SyncArray.prototype.pop = function() {
		Array.prototype.pop.apply(this, arguments);
		syncArr.apply(this, 'pop');
	};
	SyncArray.prototype.set = function(index, value) {
		this[index] = value;
		syncArr.apply(this, 'set', index, value);
	};

	window.SyncArray = SyncArray;
	(function() {
		if (!Object.prototype.watch) {
			Object.prototype.watch = function(prop, handler) {
				var val = this[prop], getter = function() {
					return val;
				}, setter = function(newval) {
					var _oldval = val;
					val = newval;
					handler.call(this, prop, _oldval, newval);
				};
				if (Object.defineProperty) {// ECMAScript 5
					Object.defineProperty(this, prop, {
						get : getter,
						set : setter
					});
				} else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) {
					// legacy
					Object.prototype.__defineGetter__.call(this, prop, getter);
					Object.prototype.__defineSetter__.call(this, prop, setter);
				}
			};
		}

		// object.unwatch
		if (!Object.prototype.unwatch) {
			Object.prototype.unwatch = function(prop) {
				var val = this[prop];
				delete this[prop];
				// remove accessors
				this[prop] = val;
			};
		}
	})();
	$.addRemoteEventListener('sync', function(msg) {
		if (msg.type === 'object') {
			$.syncObjct(msg);
		}

		if (msg.type === 'array') {
			$.syncArray(msg);
		}
	});

	$.addRemoteEventListener('syncStart', function(msg) {
		console.log('__watchVals:'+JSON.stringify ( $.__watchVals[msg.index] ));
		var data = msg.data, index = msg.index, localdata = $.__watchVals[index], changeID = function(src, dist) {
			for (var name in src) {
				if (name === '__id') {
					
					dist.__id = src[name];
					console.log("dist:"+JSON.stringify(dist)+"src:"+JSON.stringify(src));
				}
				if ($.type(dist[name]) === 'object') {
					changeID(src[name], dist[name]);
				}
			}
		};
		changeID(data,localdata);
		console.log("self:"+JSON.stringify($.lc.self())+"__watchVals:"+JSON.stringify ( $.__watchVals ));
	});
	Mind.extend({
		__watchVals : [],
		__onsync : function(){},
		syncObjct : function(msg) {
			var id = msg.id, prop = msg.prop, oldval = msg.oldval, val = msg.val, values = $.__watchVals, change = function(obj, id, prop, oldval, val) {
				if ( prop in obj && obj.id === id) {
					obj[prop] = val;
					$._onsync.call(obj,'object',prop,oldval,val);
				} else {
					for (var name in obj) {
						if ($.type(obj[name]) === 'object' && obj.__type !== 'SyncArray') {
							change(obj[name], id, prop, oldval, val);
						}
					}
				}
			};
			for (var i = 0; i < values.length; i++) {
				var obj = values[i];
				change(obj, id, prop, oldval, val);
			}
		},
		syncArray : function(msg) {
			var id = msg.__id, action = msg.action, args = msg.args, values = $.__watchVals, change = function(obj, id, action, args) {
				if (obj.id === id) {
					obj[action](args);
					$._onsync.call(obj,'array',action,args);
				} else {
					for (var name in obj) {
						change(obj, id, action, args);
					}
				}
			};
			for (var i = 0; i < values.length; i++) {
				var obj = values[i];
				change(obj, id, action, args);
			}
		},
		sync : function(obj) {
			$.__watchVals[$.__watchVals.length] = obj;
			$.__mark(obj);
			
			if ($.lc.self().position === 0) {
				$.lc.notify('all', {
					eventTag : 'syncStart',
					data : obj,
					index : ($.__watchVals.length - 1),
				});
			}
		},
		__mark : function(obj){
			if ($.type(obj) === 'object') {
				if (obj.__type !== 'SyncArray') {
					for (var name in obj) {
						if ($.type(obj[name]) !== 'object' && $.type(obj[name]) !== 'function') {
							obj.watch(name, syncVal);
						}
						if ($.type(obj[name]) === 'object') {
							$.__mark(obj[name]);
						}
					}
					obj.__id = uuid(8, 16);
				}
			}
		},
		onSync : function(fn){
			$.__onsync = fn;
		}
	});
})();
