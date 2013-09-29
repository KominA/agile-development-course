var FBSiteTracker =
{
	initialize:function(id)
	{
	    FBSiteTracker.img = new Image();
		FBSiteTracker.id = id;
		FBSiteTracker.home = (typeof(fbbbhome)!="undefined"&&typeof(fbbbhome)!="unknown"?fbbbhome:"http://feeds.feedburner.com/~bb/");
		FBSiteTracker.url = parent.location.href;
		
		FBSiteTracker.initCookies();
		FBSiteTracker.doView();
	},

	regEvent: function(el, evt, hdlr)
	{
		if ( el.attachEvent )
		{
			el.attachEvent("on"+evt, hdlr);
		}
		else
		{
			el.addEventListener(evt, hdlr, false);
		}
	},

	getCookie: function(name)
	{
		var parts = document.cookie.split(";");
	    for(var x = 0; x < parts.length; x++)
	    {
	    	if (parts[x].indexOf(name,0) != -1) return parts[x].slice(parts[x].indexOf("=")+1);
	    }
	    return "";
	},

	setCookie: function(name, val, ext)
	{
		document.cookie = name + "=" + escape(val) 
			+ ";path=/;"
			+ (ext != null ? ext : "");
	},

	makeUniqueId : function(x)
	{
		return (Math.floor(Math.random()*2147483647) - 31337 + Math.floor(Math.random()*2147483647));
	},
	
	encode : function(x)
	{
		return encodeURIComponent(x);
	},
		
	initCookies : function()
	{
		var val = FBSiteTracker.getCookie("fbbb_");
		var sep = ".";
		var d = new Date();
		
		if ( val == "" )
		{
			FBSiteTracker.uid = FBSiteTracker.makeUniqueId();
			FBSiteTracker.lastVisit = d.getTime();
			FBSiteTracker.repeat = "0";
		}
		else
		{
			var parts = val.split(sep);
			FBSiteTracker.uid = parts[0];
			FBSiteTracker.lastVisit = parts[1];
			FBSiteTracker.repeat = "1";
		}
		
		val = FBSiteTracker.getCookie("fbbbs");
		if ( val == "" )
		{
			val = FBSiteTracker.makeUniqueId();
			FBSiteTracker.setCookie("fbbbs", val);
		}
		
		FBSiteTracker.sid = val;
		val = FBSiteTracker.uid + sep + d.getTime();
		FBSiteTracker.setCookie("fbbb_", val, "expires=Sun, 08 Dec 2030 00:00:00 GMT;");
	},
	
	notify : function(p)
	{
		var d = new Date();
	    
	    FBSiteTracker.img.src = FBSiteTracker.home + FBSiteTracker.id + "?" +
		    "p=" + FBSiteTracker.encode(FBSiteTracker.url) + 
		    "&pt=" + FBSiteTracker.encode(document.title) +
		    "&u=" + FBSiteTracker.uid + "&s=" + FBSiteTracker.sid + "&ur=" + FBSiteTracker.repeat + "&v=" + FBSiteTracker.encode(FBSiteTracker.lastVisit) +
			(document.referrer != "" ? "&r=" + FBSiteTracker.encode(document.referrer) : "") + 
			"&sw=" + screen.width + "&sh=" + screen.height + 
			(p != null ? p : "");
	},

	hookClick:function()
	{
	    for(var x = 0; x < document.links.length; x++)
		{
			FBSiteTracker.regEvent(document.links[x], "click", FBSiteTracker.doClick);
		}
	},

	doClick : function(e)
	{
		if (!e) e = window.event;
		var obj = typeof(e.srcElement)=="undefined"?e.target:e.srcElement;
		var txt = typeof(obj.innerText)=="undefined"?obj.text:obj.innerText;
		var href = typeof(e.currentTarget)!="undefined"?e.currentTarget:obj.href;

		if ( obj.tagName=="IMG" )
		{
			txt = obj.alt?obj.alt:obj.title?obj.title:obj.src;
			if (typeof(obj.parentElement)!="undefined") href = obj.parentElement.href;
		}

	    if( href ) FBSiteTracker.notify("&n=" + FBSiteTracker.encode(txt) + "&l=" + FBSiteTracker.encode(href));
	},
	
	doView: function()
	{
		FBSiteTracker.regEvent(window, "load", FBSiteTracker.hookClick);
		FBSiteTracker.notify();
		FBSiteTracker.repeat = 1;
	}
}

FBSiteTracker.initialize(FBSiteTrackerUri);
