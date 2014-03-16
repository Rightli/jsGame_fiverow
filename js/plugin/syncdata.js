(function() {
	var __syncdata = {}, __syncListeners = {};
	$.extend({
		syncdata : function(key, value) {
			if (value) {
				__syncdata[key] = value;
				$.lc.notify('all', {
					from : $.lc.self(),
					eventTag : 'sync',
					key : key,
					value : value,
				});
			} else {
				return __syncdata[key];
			}
		},
		onSyncDataChange : function(key, fn) {
			__syncListeners[key] = fn;
		}
	});

	$.addRemoteEventListener('sync', function(msg) {
		console.log(msg);
		var key = msg.key, value = msg.value;
		__syncdata[key] = value;
		if (__syncListeners[key]) {
			__syncListeners[key](key, value);
		}
	});
})();
