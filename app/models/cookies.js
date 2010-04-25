function preferenceCookie()
{
	this.cookie = false;
	this.prefs = false;
	this.load();
};
preferenceCookie.prototype.get = function(reload)
{
	try 
	{
		if (!this.prefs || reload) 
		{
			// setup our default preferences
			this.prefs = 
			{
				// Global Group
				theme: 'palm-default',
				
			};
			
			// uncomment to delete cookie for testing
			//this.cookie.remove();
			var cookieData = this.cookie.get();
			if (cookieData) 
			{
				for (i in cookieData) 
				{
					this.prefs[i] = cookieData[i];
				}
			}
			else 
			{
				this.put(this.prefs);
			}
		}
		
		return this.prefs;
	} 
	catch (e) 
	{
		Mojo.Log.logException(e, 'preferenceCookie#get');
	}
};
preferenceCookie.prototype.put = function(obj, value)
{
	try
	{
		this.load();
		if (value)
		{
			this.prefs[obj] = value;
			this.cookie.put(this.prefs);
		}
		else
		{
			this.cookie.put(obj);
		}
	} 
	catch (e) 
	{
		Mojo.Log.logException(e, 'preferenceCookie#put');
	}
};
preferenceCookie.prototype.load = function()
{
	try
	{
		if (!this.cookie) 
		{
			this.cookie = new Mojo.Model.Cookie('preferences');
		}
	} 
	catch (e) 
	{
		Mojo.Log.logException(e, 'preferenceCookie#load');
	}
};

// Local Variables:
// tab-width: 4
// End:
