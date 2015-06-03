Ajax.Request.addMethods({
    initialize: function($super, url, options){
    	if (typeof options.loaderArea == 'undefined') {
    		options.loaderArea = false;
    	}
        $super(options);
        this.transport = Ajax.getTransport();
        if (!this.options.parameters) {
            this.options.parameters = {};
        }
        
        if (!this.options.parameters.form_key && typeof FORM_KEY != 'undefined') {
            this.options.parameters.form_key = FORM_KEY;
        }
        
        this.request(url);
    }
});

var _ewoldobserve = Event.observe;
Event.observe = function(element, eventName, handler) {
	if (document.loaded && (element == window || element == document) && (eventName == 'load' || eventName == 'dom:loaded')) {
		handler.call(document);
	} else _ewoldobserve(element, eventName, handler);
	return element;
}
