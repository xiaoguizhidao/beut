var EWUserGuide = Class.create({
	area: '',
	requestPath: '',
    initialize: function (options) {
        Object.extend(this, options || {});
        this.enabled = 1;
        if (Prototype.Browser.IE) {
        	if (parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) < 8) {
        		this.enabled = 0;
        	}
        }
    },
    
    rewritePage: function() {
    	if (!this.enabled) return;
    	
    	var body = $$('body').first();
    	if (!body) return;
    	body.insert({bottom: '<div id="user-guide-button"></div>'});
    	body.insert({bottom: '<div id="user-guide-bar" style="display: none"><span class="rwheader">Extendware User Guide</span><div class="rwclose"><div>X</div></div></div><div id="user-guide-frame" style="display: none"><div id="user-guide-frame-loader"><b>Loading content...</b></div></div>'});
    	
    	$('user-guide-button').observe('click', function(e) {
    		this.show();
    	}.bind(this));
    	
    	$$('#user-guide-bar div.rwclose').first().observe('click', function(e) {
    		this.hide();
    	}.bind(this));

    	if (this.auto_open && this.identifier == this.readCookie('ewguide_open_flag')) {
        	this.show();
        	Effect.Pulsate($$('#user-guide-bar div.rwclose').first(), { pulses: 3, duration: 4.5 });
        }
    },
    
    frameLoaded: function() {
    	$('user-guide-frame-loader').hide();
    	!$$('#user-guide-frame > iframe').first().show();
    },
    
    show: function() {
    	try { rwdemoguide.hide() } catch(e) {}
    	if (!$$('#user-guide-frame > iframe').first()) {
			$('user-guide-frame').insert({bottom: '<iframe src="' + this.url + '" style="display: none" onload="ewuserguide.frameLoaded()"></iframe>'});
		}
		Effect.Fade('user-guide-button', { duration: 0.3 });
		Effect.Appear('user-guide-bar', { duration: 0.3 });
		Effect.Appear('user-guide-frame', { duration: 0.3 });
		this.createCookie('ewguide_open_flag', this.identifier);
    },
    
    hide: function() {
    	Effect.Fade('user-guide-bar', { duration: 0.3 });
    	Effect.Fade('user-guide-frame', { duration: 0.3 });
		Effect.Appear('user-guide-button', { duration: 0.3 });
		this.createCookie('ewguide_open_flag', '');
    },
    
    createCookie: function(name, value) {
    	document.cookie = name+'='+value+'; path=/';
    },
    
    readCookie: function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}
});