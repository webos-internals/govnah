function ProfileSaveAssistant()
{
	// setup menu
	this.menuModel =
	{
		visible: true,
		items:
		[
			{
				label: $L("Help"),
				command: 'do-help'
			}
		]
	};
	
	this.governorModel = 
	{
		value: dataHandler.governor,
		choices: []
	};
	
	this.settingsModel = {};
	this.settingsLocation = {};
	
	this.profileModel = {name: 'Profile ' + (profiles.cookieData.serial + 1)};
	
};

ProfileSaveAssistant.prototype.setup = function()
{
	// setup menu
	this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);

	this.controller.setupWidget
	(
		'profileName',
		{
			focus: false,
			autoFocus: false,
			modelProperty: 'name',
			multiline: false,
			enterSubmits: false,
			changeOnKeyPress: true
		},
		this.profileModel
	);
	
	this.controller.setupWidget
	(
		'saveAsProfileButton',
		{
			type: Mojo.Widget.activityButton
		},
		{
			buttonLabel: $L("Save As New Profile")
		}
	);
	this.saveAsProfileButtonElement = this.controller.get('saveAsProfileButton');
	this.saveAsProfileButtonPressed = this.saveAsProfileButtonPressed.bindAsEventListener(this);
	this.controller.listen('saveAsProfileButton', Mojo.Event.tap, this.saveAsProfileButtonPressed);

	this.onGetParamsStandard  = this.onGetParams.bindAsEventListener(this, "standard");
	this.onGetParamsSpecific  = this.onGetParams.bindAsEventListener(this, "specific");
	this.onGetParamsOverride  = this.onGetParams.bindAsEventListener(this, "override");
	this.onGetParamsCompcache = this.onGetParams.bindAsEventListener(this, "compcache");

	// make it so nothing is selected by default
	this.controller.setInitialFocusedElement(null);

	this.reloadSettings();
	
	this.controller.get('save-as-title').innerHTML = $L("Save As New Profile");
	this.controller.get('profile-name-title').innerHTML = $L("Profile Name");
	this.backElement = this.controller.get('header');
	this.backTapHandler = this.backTap.bindAsEventListener(this);
	this.controller.listen(this.backElement, Mojo.Event.tap, this.backTapHandler);
};
ProfileSaveAssistant.prototype.backTap = function(event)
{
	if (Mojo.Environment.DeviceInfo.modelNameAscii == 'TouchPad') this.controller.stageController.popScene();
};
ProfileSaveAssistant.prototype.reloadSettings = function()
{
	this.settingsModel = {};
	this.settingsLocation = {};
	
	if (this.getRequest) this.getRequest.cancel();
	this.getRequest  = service.get_cpufreq_params(this.onGetParamsStandard);
};

ProfileSaveAssistant.prototype.onGetParams = function(payload, location)
{
	if (payload.returnValue == false) {
		this.errorMessage("Govnah", payload.errorText, payload.stdErr, function(){});
	}

	if (payload.params)
	{
		// only loop
		for (var param = 0; param < payload.params.length; param++)
		{
			tmpParam = payload.params[param];

			if (tmpParam.writeable && tmpParam.name != 'scaling_governor')
			{
				//alert('-----');
				//for (p in tmpParam) alert(p + " : " + tmpParam[p]);
				
				this.settingsModel[tmpParam.name] = tmpParam.value;
				this.settingsLocation[tmpParam.name] = location;
			}
			else if (tmpParam.name == 'scaling_governor')
			{
				this.governorModel.value = "";
				this.governorModel.value = trim(tmpParam.value);
			}
		}
	}

	if (location == "standard") {
		if (this.getRequest) this.getRequest.cancel();
		this.getRequest  = service.get_cpufreq_params(this.onGetParamsSpecific, this.governorModel.value);
	}
	else if (location == "specific") {
		if (this.getRequest) this.getRequest.cancel();
		this.getRequest = service.get_cpufreq_params(this.onGetParamsOverride, "override");
	}
	else if (location == "override") {
		if (this.getRequest) this.getRequest.cancel();
		this.getRequest = service.get_compcache_config(this.onGetParamsCompcache);
	}
	else if (location == "compcache") {
		if (this.getRequest) this.getRequest.cancel();
		this.getRequest = false;
	}
};

ProfileSaveAssistant.prototype.saveAsProfileButtonPressed = function(event)
{
	var params =
	{
		name: this.profileModel.name,
		governor: this.governorModel.value,
		settingsStandard: [],
		settingsSpecific: [],
		settingsOverride: [],
		settingsCompcache: []
	};
	
	for (var m in this.settingsModel)
	{
		if (this.settingsLocation[m] == "standard")
		{
			params.settingsStandard.push({name:m, value:String(this.settingsModel[m])});
		}
		else if (this.settingsLocation[m] == "specific")
		{
			params.settingsSpecific.push({name:m, value:String(this.settingsModel[m])});
		}
		else if (this.settingsLocation[m] == "override")
		{
			params.settingsOverride.push({name:m, value:String(this.settingsModel[m])});
		}
		else if (this.settingsLocation[m] == "compcache")
		{
			params.settingsCompcache.push({name:m, value:String(this.settingsModel[m])});
		}
	}
	
	var dup = profiles.getProfileFromName(params.name);
	
	if (dup) {
		profiles.deleteProfile(dup.id);
	}

	profiles.newProfile(params);
	
	this.saveAsProfileButtonElement.mojo.deactivate();
	this.controller.stageController.popScene();
};

ProfileSaveAssistant.prototype.errorMessage = function(title, message, stdErr, okFunction)
{
	if (stdErr && stdErr.length) {
		message = message + '<br>' + stdErr.join('<br>');
	}

	this.controller.showAlertDialog(
	{
		allowHTMLMessage:	true,
		preventCancel:		true,
	    title:				title,
	    message:			message,
	    choices:			[{label:$L("Ok"), value:'ok'}],
	    onChoose:			okFunction.bindAsEventListener(this)
    });
};

ProfileSaveAssistant.prototype.activate = function(event)
{
	if (this.controller.stageController.setWindowOrientation)
	{
    	this.controller.stageController.setWindowOrientation("up");
	}
	
	if (this.firstActivate)
	{
		
	}
	this.firstActivate = true;
};
ProfileSaveAssistant.prototype.handleCommand = function(event)
{
	if (event.type == Mojo.Event.command)
	{
		switch (event.command)
		{
			case 'do-help':
				this.controller.stageController.pushScene('help');
				break;
		}
	}
};

ProfileSaveAssistant.prototype.cleanup = function(event)
{
	
};



// Local Variables:
// tab-width: 4
// End:
