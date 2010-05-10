function profilesModel()
{
	this.cookie =		new Mojo.Model.Cookie('profiles');
	this.cookieData =	false;
	
	this.profiles =		[];
	
	this.load();
	this.loadDefaults();
	
};
profilesModel.prototype.getProfileArrayKey = function(id)
{
	if (this.profiles.length > 0)
	{
		for (var p = 0; p < this.profiles.length; p++)
		{
			if (this.profiles[p].id == id)
			{
				return p;
			}
		}
	}
	return false;
};
profilesModel.prototype.getListObjects = function()
{
	var returnArray = [];
	if (this.profiles.length > 0)
	{
		for (var p = 0; p < this.profiles.length; p++)
		{
			if (this.profiles[p]) 
			{
				returnArray.push(this.profiles[p].getListObject());
			}
		}
	}
	return returnArray;
};
profilesModel.prototype.loadDefaults = function()
{
	try
	{
		var highestVersion = prefs.get().defaultProfileVersion;
		
		for (var d = 0; d < profilesModel.defaultProfiles.length; d++)
		{
			if (profilesModel.defaultProfiles[d].version > prefs.get().defaultProfileVersion)
			{
				this.newProfile(profilesModel.defaultProfiles[d]);
				
				if (profilesModel.defaultProfiles[d].version > highestVersion)
				{
					highestVersion = profilesModel.defaultProfiles[d].version;
				}
			}
		}
		
		if (highestVersion > prefs.get().defaultProfileVersion)
		{
			prefs.put('defaultProfileVersion', highestVersion);
		}
	} 
	catch (e) 
	{
		Mojo.Log.logException(e, 'profiles#loadDefaults');
	}
};
profilesModel.prototype.load = function()
{
	try
	{
		this.profiles = [];
		
		this.cookieData = this.cookie.get();
		if (this.cookieData)
		{
			if (this.cookieData.profiles && this.cookieData.profiles.length > 0) 
			{
				for (var p = 0; p < this.cookieData.profiles.length; p++) 
				{
					this.loadProfile(this.cookieData.profiles[p]);
				}
			}
		}
		else
		{
			this.cookieData = 
			{
				serial: 0,
				profiles: []
			};
		}
	} 
	catch (e) 
	{
		Mojo.Log.logException(e, 'profiles#load');
	}
};
profilesModel.prototype.loadProfile = function(id)
{
	try
	{
		var profileCookie = new Mojo.Model.Cookie('profile-' + id);
		var profileParams = profileCookie.get();
		if (profileParams)
		{
			profileParams.profiles = this;
			var newProfile = new profileModel(profileParams);
			this.profiles.push(newProfile);
		}
	} 
	catch (e) 
	{
		Mojo.Log.logException(e, 'profiles#loadProfile');
	}
};
profilesModel.prototype.newProfile = function(params)
{
	try
	{
		this.cookieData.serial++;
		this.cookieData.profiles.push(this.cookieData.serial);
		this.cookie.put(this.cookieData);
		
		params.id = this.cookieData.serial;
		var profileCookie = new Mojo.Model.Cookie('profile-' + params.id);
		profileCookie.put(params);
		
		this.loadProfile(params.id);
	}
	catch (e) 
	{
		Mojo.Log.logException(e, 'profiles#newProfile');
	}
}
profilesModel.prototype.deleteProfile = function(id)
{
	try
	{
		this.cookieData.profiles = this.cookieData.profiles.without(id);
		this.cookie.put(this.cookieData);
		
		var profileCookie = new Mojo.Model.Cookie('profile-' + id);
		profileCookie.remove();
		
		var key = this.getProfileArrayKey(id);
		this.profiles[key] = false;
	} 
	catch (e)
	{
		Mojo.Log.logException(e, 'profiles#deleteProfile');
	}
}


function profileModel(params) 
{
    this.id =				params.id;
	this.name =				params.name;
	
	this.version =			params.version;
	this.locked =			params.locked;
	
	this.governor =			params.governor;
	
	this.settingsStandard =	params.settingsStandard;
	this.settingsSpecific =	params.settingsSpecific;
}
profileModel.prototype.apply = function()
{
	var params = [];
	params.push({name:'scaling_governor', value:this.governor});
	
	for (var s = 0; s < this.settingsStandard.length; s++)
	{
		params.push(this.settingsStandard[s]);
	}
	
	service.set_cpufreq_params(this.applyComplete.bindAsEventListener(this), params);
	
	
	var params = [];
	
	for (var s = 0; s < this.settingsSpecific.length; s++)
	{
		params.push(this.settingsSpecific[s]);
	}
	
	service.set_cpufreq_params(this.applyComplete.bindAsEventListener(this), params, this.governor);
}
profileModel.prototype.applyComplete = function(payload)
{
	alert('===========');
	for (p in payload) alert(p+' : '+payload[p]);
}
profileModel.prototype.getListObject = function()
{
	var data = 'Governor: '+this.governor;
	for (var s = 0; s < this.settingsStandard.length; s++)
	{
		data += '<br />'+this.settingsStandard[s].name+': '+this.settingsStandard[s].value;
	}
	for (var s = 0; s < this.settingsSpecific.length; s++)
	{
		data += '<br />'+this.settingsSpecific[s].name+': '+this.settingsSpecific[s].value;
	}
	
	var obj =
	{
		key:	profiles.getProfileArrayKey(this.id),
		id:		this.id,
		name:	this.name,
		locked:	this.locked,
		
		data:	data
	};
	
	return obj;
}



// Local Variables:
// tab-width: 4
// End:
