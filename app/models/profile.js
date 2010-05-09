function profilesModel()
{
	this.cookie =		new Mojo.Model.Cookie('profiles');
	this.cookieData =	false;
	
	this.profiles =		[];
	
	this.load();
};
profilesModel.prototype.getProfileArrayKey = function(id)
{
	if (this.profiles.length > 0)
	{
		for (var pf = 0; p < this.profiles.length; p++)
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
			if (update) newProfile.update();
			this.profiles.push(newProfile);
		}
	} 
	catch (e) 
	{
		Mojo.Log.logException(e, 'profiles#loadProfile');
	}
};
profilesModel.prototype.newFriend = function(params)
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
profilesModel.prototype.deleteFriend = function(id)
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
    this.id =	params.id;
	this.name =	params.name;
	
}
profileModel.prototype.getListObject = function()
{
	var obj =
	{
		key:	profiles.getProfileArrayKey(this.id),
		id:		this.id,
		name:	this.name
	};
	
	return obj;
}
profileModel.prototype.getEditObject = function()
{
	var obj = 
	{
		id:		this.id,
		name:	this.name
	};
	return obj;
}
profileModel.prototype.saveInfo = function(params)
{
	if (profileModel.validateNewFriend(params, false, false)) 
	{
		//this.id =		params.id;
		this.name =		params.name;
		
		var profileCookie = new Mojo.Model.Cookie('profile-' + this.id);
		profileCookie.put(params);
	}
}


// Local Variables:
// tab-width: 4
// End:
