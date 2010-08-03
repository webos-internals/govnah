function profilesModel()
{
	this.cookie =		new Mojo.Model.Cookie('profiles');
	this.cookieData =	false;
	
	this.controller = false;

	this.profiles =		[];
	
	this.load();
	this.loadDefaults();
	
	this.setRequests = new Array();
	this.setRequests["cpufreq"]  = false;
	this.setRequests["compcache"] = false;
	
	this.applyCompleteCpufreq  = this.applyComplete.bindAsEventListener(this, "cpufreq");
	this.applyCompleteCompcache  = this.applyComplete.bindAsEventListener(this, "compcache");

	this.stickRequests = new Array();
	this.stickRequests["cpufreq"]  = false;
	this.stickRequests["compcache"] = false;

	this.stickCompleteCpufreq  = this.stickComplete.bindAsEventListener(this, "cpufreq");
	this.stickCompleteCompcache  = this.stickComplete.bindAsEventListener(this, "compcache");
};
profilesModel.prototype.findProfile = function(governor, settingsStandard, settingsSpecific, settingsOverride, settingsCompcache)
{
	if (this.profiles.length > 0)
	{
		for (var p = 0; p < this.profiles.length; p++)
		{
			if (this.profiles[p]) 
			{
				//alert(this.profiles[p].governor);

				if (this.profiles[p].governor == governor &&
					(!this.profiles[p].settingsStandard || !this.profiles[p].settingsStandard.length ||
					 (this.profiles[p].settingsStandard.length == settingsStandard.length)) &&
					(!this.profiles[p].settingsSpecific || !this.profiles[p].settingsSpecific.length || 
					 (this.profiles[p].settingsSpecific.length == settingsSpecific.length)) &&
					(!this.profiles[p].settingsOverride || !this.profiles[p].settingsOverride.length ||
					 (this.profiles[p].settingsOverride.length == settingsOverride.length)) &&
					(!this.profiles[p].settingsCompcache || !this.profiles[p].settingsCompcache.length ||
					 (this.profiles[p].settingsCompcache.length == settingsCompcache.length)))
				{
					var match = true;
					
					//alert("Checking match");
					
					if (this.profiles[p].settingsStandard && this.profiles[p].settingsStandard.length > 0)
					{
						alert("Checking settingsStandard");

						for (var s = 0; s < this.profiles[p].settingsStandard.length; s++)
						{
							if (this.profiles[p].settingsStandard[s].name != settingsStandard[s].name ||
								this.profiles[p].settingsStandard[s].value != settingsStandard[s].value)
							{
								match = false;
							}
						}
					}
					if (this.profiles[p].settingsSpecific && this.profiles[p].settingsSpecific.length > 0)
					{
						alert("Checking settingsSpecific");

						for (var s = 0; s < this.profiles[p].settingsSpecific.length; s++)
						{
							if (this.profiles[p].settingsSpecific[s].name != settingsSpecific[s].name ||
								this.profiles[p].settingsSpecific[s].value != settingsSpecific[s].value)
							{
								match = false;
							}
						}
					}
					if (this.profiles[p].settingsOverride && this.profiles[p].settingsOverride.length > 0)
					{
						alert("Checking settingsOverride");

						for (var s = 0; s < this.profiles[p].settingsOverride.length; s++)
						{
							if (this.profiles[p].settingsOverride[s].name != settingsOverride[s].name ||
								this.profiles[p].settingsOverride[s].value != settingsOverride[s].value)
							{
								match = false;
							}
						}
					}
					if (this.profiles[p].settingsCompcache && this.profiles[p].settingsCompcache.length > 0)
					{
						alert("Checking settingsCompcache");

						for (var s = 0; s < this.profiles[p].settingsCompcache.length; s++)
						{
							if (this.profiles[p].settingsCompcache[s].name != settingsCompcache[s].name ||
								this.profiles[p].settingsCompcache[s].value != settingsCompcache[s].value)
							{
								match = false;
							}
						}
					}
					
					if (match)
					{
						return this.profiles[p];
					}
				}
			}
		}
	}
	else
	{
		return false;
	}
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
profilesModel.prototype.getProfileFromId = function(id)
{
	if (this.profiles.length > 0)
	{
		for (var p = 0; p < this.profiles.length; p++)
		{
			if (this.profiles[p].id == id)
			{
				return this.profiles[p];
			}
		}
	}
	return false;
};
profilesModel.prototype.getProfileFromName = function(name)
{
	if (this.profiles.length > 0)
	{
		for (var p = 0; p < this.profiles.length; p++)
		{
			if (this.profiles[p].name == name)
			{
				return this.profiles[p];
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
				var dup = this.getProfileFromName(profilesModel.defaultProfiles[d].name);

				if (dup) {
					this.deleteProfile(dup.id);
				}

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
};
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
};
profilesModel.prototype.applyComplete = function(payload, location)
{
	//alert('===========');
	//for (p in payload) alert(p+' : '+payload[p]);

	this.setRequests[location] = false;

	if (!this.setRequests["cpufreq"] &&
		!this.setRequests["compcache"] &&
		!this.stickRequests["cpufreq"] &&
		!this.stickRequests["compcache"]) {
		this.controller.stageController.popScene();
	}
};
profilesModel.prototype.stickComplete = function(payload, location)
{
	//alert('===========');
	//for (p in payload) alert(p+' : '+payload[p]);

	this.stickRequests[location] = false;

	if (!this.setRequests["cpufreq"] &&
		!this.setRequests["compcache"] &&
		!this.stickRequests["cpufreq"] &&
		!this.stickRequests["compcache"]) {
		this.controller.stageController.popScene();
	}
};


function profileModel(params) 
{
    this.id =				params.id;
	this.name =				params.name;
	
	this.version =			params.version;
	this.locked =			params.locked;
	
	this.governor =			params.governor;
	
	this.settingsStandard  = params.settingsStandard;
	this.settingsSpecific  = params.settingsSpecific;
	this.settingsOverride  = params.settingsOverride;
	this.settingsCompcache = params.settingsCompcache;
};
profileModel.prototype.apply = function()
{
	var standardParams  = [];
	var specificParams  = [];
	var overrideParams  = [];
	var compcacheConfig = [];

	standardParams.push({name:'scaling_governor', value:this.governor});
	
	for (var s = 0; s < this.settingsStandard.length; s++) {
		if ((this.settingsStandard[s].name == "scaling_min_freq") &&
			(parseFloat(this.settingsStandard[s].value) > parseFloat(dataHandler.currentLimits.max))) {
			alert("newmin: "+this.settingsStandard[s].value+" greater than oldmax: "+dataHandler.currentLimits.max);
			// Push the max frequency first to allow for the new min
			standardParams.push({name:"scaling_max_freq", value:this.settingsStandard[s].value});
		}
		if ((this.settingsStandard[s].name == "scaling_max_freq") &&
			(parseFloat(this.settingsStandard[s].value) < parseFloat(dataHandler.currentLimits.min))) {
			alert("newmax: "+this.settingsStandard[s].value+" less than oldmin: "+dataHandler.currentLimits.min);
			// Push the min frequency first to allow for the new max
			standardParams.push({name:"scaling_min_freq", value:this.settingsStandard[s].value});
		}
		standardParams.push(this.settingsStandard[s]);
	}
	
	if (this.settingsSpecific) {
		for (var s = 0; s < this.settingsSpecific.length; s++) {
			specificParams.push(this.settingsSpecific[s]);
		}
	}

	if (this.settingsOverride) {
		for (var s = 0; s < this.settingsOverride.length; s++) {
			overrideParams.push(this.settingsOverride[s]);
		}
	}

	if (profiles.setRequests['cpufreq']) profiles.setRequests['cpufreq'].cancel();
	profiles.setRequests["cpufreq"] = service.set_cpufreq_params(profiles.applyCompleteCpufreq, standardParams, specificParams, overrideParams);
	if (profiles.stickRequests['cpufreq']) profiles.stickRequests['cpufreq'].cancel();
	profiles.stickRequests['cpufreq'] = service.stick_cpufreq_params(profiles.stickCompleteCpufreq, standardParams, specificParams, overrideParams);
	
	if (this.settingsCompcache) {
		for (var s = 0; s < this.settingsCompcache.length; s++) {
			compcacheConfig.push(this.settingsCompcache[s]);
		}
		if (profiles.setRequests['compcache']) profiles.setRequests['compcache'].cancel();
		profiles.setRequests["compcache"] = service.set_compcache_config(profiles.applyCompleteCompcache, compcacheConfig);
		if (profiles.stickRequests['compcache']) profiles.stickRequests['compcache'].cancel();
		profiles.stickRequests["compcache"] = service.stick_compcache_config(profiles.stickCompleteCompcache, compcacheConfig);
	}
};
profileModel.prototype.getListObject = function()
{
	var tmpName = this.name;
	if (dataHandler.profile && dataHandler.profile.name == this.name) tmpName = '<b>' + this.name + '</b>';
	
	var obj =
	{
		key:	profiles.getProfileArrayKey(this.id),
		id:		this.id,
		name:	tmpName,
		locked:	this.locked,
		
		governor: this.governor,
		data:	this.getDataString()
	};
	
	return obj;
};
profileModel.prototype.getDataString = function()
{
	var data = '<span class="name">Governor</span><span class="value">' + this.governor + '</span>';
	for (var s = 0; s < this.settingsStandard.length; s++) {
		var row = this.getDataSettingString(this.settingsStandard[s].name, this.settingsStandard[s].value);
		data += '<br /><span class="name">' + row[0] + '</span><span class="value">' + row[1] + '</span>';
	}
	if (this.settingsSpecific) {
		for (var s = 0; s < this.settingsSpecific.length; s++) {
			var row = this.getDataSettingString(this.settingsSpecific[s].name, this.settingsSpecific[s].value);
			data += '<br /><span class="name">' + row[0] + '</span><span class="value">' + row[1] + '</span>';
		}
	}
	if (this.settingsOverride) {
		for (var s = 0; s < this.settingsOverride.length; s++) {
			var row = this.getDataSettingString(this.settingsOverride[s].name, this.settingsOverride[s].value);
			data += '<br /><span class="name">' + row[0] + '</span><span class="value">' + row[1] + '</span>';
		}
	}
	if (this.settingsCompcache) {
		for (var s = 0; s < this.settingsCompcache.length; s++) {
			var row = this.getDataSettingString(this.settingsCompcache[s].name, this.settingsCompcache[s].value);
			data += '<br /><span class="name">' + row[0] + '</span><span class="value">' + row[1] + '</span>';
		}
	}
	return data;
};
profileModel.prototype.getDataSettingString = function(name, value)
{
	if (dataHandler.settings[name])
	{
		switch(dataHandler.settings[name].type)
		{
			case 'listFreq':
				if ((parseInt(value) / 1000) >= 1000)
					return [dataHandler.settingLabel(name), ((parseInt(value)/1000)/1000) + ' GHz'];
				else
					return [dataHandler.settingLabel(name), (parseInt(value)/1000) + ' MHz'];
				break;
			case 'listPcnt':
				return [dataHandler.settingLabel(name), value + ' %'];
				break;
			case 'listPowr':
				return [dataHandler.settingLabel(name), value];
				break;
			case 'listSamp':
				var min = 0;
				var sec = (parseInt(value) / 1000000);
				if (sec / 60 >= 1)
				{
					min = Math.floor(sec / 60);
					sec = (sec % 60);
				}
				var display = '';
				if (min > 0) display += min+' Min';
				if (min > 1) display += 's ';
				else display += ' ';
				if (sec > 0) display += sec+' Sec';
				return [dataHandler.settingLabel(name), display];
				break;
			case 'listSampDown':
				return [dataHandler.settingLabel(name), value];
				break;
			case 'listMem':
				return [dataHandler.settingLabel(name), value/1024 + ' MB'];
				break;
			case 'listWindow':
				return [dataHandler.settingLabel(name), value/1000 + ' Sec'];
				break;
				
			case 'toggleTF':
				return [dataHandler.settingLabel(name), (value == 1 ? 'true' : 'false')];
				break;

			case 'listTemp':
				return [dataHandler.settingLabel(name), value + ' C'];
				break;

			case 'listVolts':
				return [dataHandler.settingLabel(name), ((value * 12.5) + 600) + ' mV'];
				break;
		}
	}
	else
	{
		return [tmpParam.name.replace(/_/g, " "), value];
	}
};



// Local Variables:
// tab-width: 4
// End:
