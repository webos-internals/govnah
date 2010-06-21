function GovernorAssistant()
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
	
	this.scalingFrequencyChoices = [];
	if (Mojo.Environment.DeviceInfo.modelNameAscii == "Pixi") {
		this.scalingFrequencyChoices.push({label:'122.88 MHz', value:122880});
		this.scalingFrequencyChoices.push({label:'245.76 MHz', value:245760});
		this.scalingFrequencyChoices.push({label:'320.00 MHz', value:320000});
		this.scalingFrequencyChoices.push({label:'480.00 MHz', value:480000});
		this.scalingFrequencyChoices.push({label:'600.00 MHz', value:600000});
	}
	
	this.samplingRates = {min:false, max:false}; 
	
	this.samplingDownChoices = [];
	for (var x = 1; x <= 10; x++)
	{
		this.samplingDownChoices.push({label:x, value:x});
	}
			
	this.percentChoices = [];
	for (var x = 0; x <= 100; x = x + 5)
	{
		this.percentChoices.push({label:x + ' %', value:x});
	}
	
	this.powersaveChoices = [];
	for (var x = 0; x <= 10; x++)
	{
		this.powersaveChoices.push({label:x, value:x});
	}
	for (var x = 20; x <= 1000; x = x + 10)
	{
		this.powersaveChoices.push({label:x, value:x});
	}

	this.memoryChoices = [];
	this.memoryChoices.push({label: "16MB", value: 16*1024});
	this.memoryChoices.push({label: "24MB", value: 24*1024});
	this.memoryChoices.push({label: "32MB", value: 32*1024});
	this.memoryChoices.push({label: "48MB", value: 48*1024});
	this.memoryChoices.push({label: "64MB", value: 64*1024});
	this.memoryChoices.push({label: "96MB", value: 96*1024});
	this.memoryChoices.push({label:"128MB", value:128*1024});
			
	this.windowChoices = [];
	for (var x = 1; x <= 10; x++)
	{
		this.windowChoices.push({label:x + " Sec", value:x*1000});
	}
			
};

GovernorAssistant.prototype.setup = function()
{
	// setup menu
	this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);

	// setup governor list
	this.controller.setupWidget
	(
		'governor',
		{
			label: $L('Governor')
		},
		this.governorModel
	);
	this.governorChange = this.governorChange.bindAsEventListener(this);
	this.controller.listen('governor', Mojo.Event.propertyChange, this.governorChange);
	
	this.controller.setupWidget
	(
		'saveButton',
		{
			type: Mojo.Widget.activityButton
		},
		{
			buttonLabel: 'Apply Settings'
		}
	);
	this.saveButtonElement = this.controller.get('saveButton');
	this.saveButtonPressed = this.saveButtonPressed.bindAsEventListener(this);
    this.saveComplete = this.saveComplete.bindAsEventListener(this);
	this.controller.listen('saveButton', Mojo.Event.tap, this.saveButtonPressed);
	
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
			buttonLabel: 'Save As New Profile'
		}
	);
	this.saveAsProfileButtonElement = this.controller.get('saveAsProfileButton');
	this.saveAsProfileButtonPressed = this.saveAsProfileButtonPressed.bindAsEventListener(this);
	this.controller.listen('saveAsProfileButton', Mojo.Event.tap, this.saveAsProfileButtonPressed);
	
	
	this.settingsForm = this.controller.get('settings');
	
    this.onGetParamsGeneric   = this.onGetParams.bindAsEventListener(this, "generic");
    this.onGetParamsSpecific  = this.onGetParams.bindAsEventListener(this, "governor");
    this.onGetParamsCompcache = this.onGetParams.bindAsEventListener(this, "compcache");
    this.onSetParams = this.onSetParams.bindAsEventListener(this);
	
	service.get_cpufreq_params(this.onGetParamsGeneric);
	service.get_cpufreq_params(this.onGetParamsSpecific, this.governorModel.value);
	service.get_compcache_config(this.onGetParamsCompcache);
	
	// make it so nothing is selected by default
	this.controller.setInitialFocusedElement(null);
};


GovernorAssistant.prototype.governorChange = function(event)
{
	//alert('===========');
	//for (e in event) alert(e+' : '+event[e]);
	
	//alert(event.value);
	this.governorModel.value = event.value;
	service.set_cpufreq_params(this.onSetParams, [{name:'scaling_governor', value:this.governorModel.value}], []);
};

GovernorAssistant.prototype.onGetParams = function(payload, location)
{
	if (payload.errorCode != undefined) {
		this.errorMessage("Govnah", payload.errorText + '<br>' + payload.stdErr?payload.stdErr.join('<br>'):"", function(){});
	}
	
	if (payload.params)
	{
		// initial loop
		for (var param = 0; param < payload.params.length; param++)
		{
			tmpParam = payload.params[param];
			
			//alert('-----');
			//for (p in tmpParam) alert(p + " : " + tmpParam[p]);
	
			switch(tmpParam.name)
			{
				case 'scaling_available_governors':
					this.governorModel.choices = [];
					var data = tmpParam.value.split(" ");
					if (data.length > 0)
					{
						for (d = 0; d < data.length; d++)
						{
							var tmpGov = trim(data[d]);
							if (tmpGov != "")
							{
								this.governorModel.choices.push({label:$L(tmpGov), value:tmpGov});
							}
						}
					}
					this.controller.modelChanged(this.governorModel);
					break;
				case 'scaling_governor':
					this.governorModel.value = "";
					this.governorModel.value = trim(tmpParam.value);
					this.controller.modelChanged(this.governorModel);
					break;
				
				case 'scaling_available_frequencies':
					this.scalingFrequencyChoices = [];
					var data = tmpParam.value.split(" ");
					if (data.length > 0)
					{
						for (d = 0; d < data.length; d++)
						{
							var tmpFreq = parseInt(trim(data[d]));
							if (tmpFreq)
							{
								this.scalingFrequencyChoices.push({label:(tmpFreq/1000) + ' MHz', value:tmpFreq});
							}
						}
					}
					break;
					
				case 'sampling_rate_max':
					this.samplingRates.max = parseInt(trim(tmpParam.value));
					//alert(this.samplingRates.max);
					break;
				case 'sampling_rate_min':
					this.samplingRates.min = parseInt(trim(tmpParam.value));
					//alert(this.samplingRates.min);
					break;
			}
		}
		
		
		// second loop
		for (var param = 0; param < payload.params.length; param++)
		{
			tmpParam = payload.params[param];
			
			if (tmpParam.writeable && tmpParam.name != 'scaling_governor')
			{
				//alert('-----');
				//for (p in tmpParam) alert(p + " : " + tmpParam[p]);
				
				if (profilesModel.settings[tmpParam.name] && !prefs.get().manualEntry)
				{
					switch(profilesModel.settings[tmpParam.name].type)
					{
						case 'listFreq':
							this.settingsForm.innerHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'governor/listselect-widget'});
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = location;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: profilesModel.settingLabel(tmpParam.name),
									modelProperty: tmpParam.name,
									choices: this.scalingFrequencyChoices
								},
								this.settingsModel
							);
							break;
						case 'listPcnt':
							this.settingsForm.innerHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'governor/listselect-widget'});
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = location;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: profilesModel.settingLabel(tmpParam.name),
									modelProperty: tmpParam.name,
									choices: this.percentChoices
								},
								this.settingsModel
							);
							break;
						case 'listPowr':
							this.settingsForm.innerHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'governor/listselect-widget'});
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = location;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: profilesModel.settingLabel(tmpParam.name),
									modelProperty: tmpParam.name,
									choices: this.powersaveChoices
								},
								this.settingsModel
							);
							break;
						case 'listSamp':
							this.settingsForm.innerHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'governor/listselect-widget'});
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = location;
							var samplingChoices = [];
							if (this.samplingRates.max !== false && this.samplingRates.min !== false)
							{
								for (var s = this.samplingRates.min; s <= 2000000; s = s + 100000)
								{
									var sec = (s / 1000000);
									var display = sec+' Sec';
									samplingChoices.push({label:display, value:s});
								}
								for (var s = 3000000; s <= 10000000; s = s + 1000000)
								{
									var sec = (s / 1000000);
									var display = sec+' Sec';
									samplingChoices.push({label:display, value:s});
								}
								for (var s = 20000000; s <= this.samplingRates.max; s = s + 10000000)
								{
									var min = 0;
									var sec = (s / 1000000);
									if (sec / 60 >= 1)
									{
										min = Math.floor(sec / 60);
										sec = (sec % 60);
									}
									var display = '';
									if (min > 0) display += min+' Min';
									display += ' ';
									if (sec > 0) display += sec+' Sec';
									samplingChoices.push({label:display, value:s});
								}
							}
							else
							{
								samplingChoices.push({label:$L(tmpParam.value), value:tmpParam.value});
							}
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: profilesModel.settingLabel(tmpParam.name),
									modelProperty: tmpParam.name,
									choices: samplingChoices
								},
								this.settingsModel
							);
							break;
						case 'listSampDown':
							this.settingsForm.innerHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'governor/listselect-widget'});
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = location;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: profilesModel.settingLabel(tmpParam.name),
									modelProperty: tmpParam.name,
									choices: this.samplingDownChoices
								},
								this.settingsModel
							);
							break;
						case 'listMem':
							this.settingsForm.innerHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'governor/listselect-widget'});
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = location;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: profilesModel.settingLabel(tmpParam.name),
									modelProperty: tmpParam.name,
									choices: this.memoryChoices
								},
								this.settingsModel
							);
							break;
							
						case 'toggleTF':
							this.settingsForm.innerHTML += Mojo.View.render({object: {label:profilesModel.settingLabel(tmpParam.name), id: tmpParam.name}, template: 'governor/toggle-widget'});
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = location;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
						  			trueLabel: $L('True'),
									trueValue: '1',
						 			falseLabel: $L('False'),
									falseValue: '0',
									modelProperty: tmpParam.name
								},
								this.settingsModel
							);
							break;

						case 'listWindow':
							this.settingsForm.innerHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'governor/listselect-widget'});
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = location;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: profilesModel.settingLabel(tmpParam.name),
									modelProperty: tmpParam.name,
									choices: this.windowChoices
								},
								this.settingsModel
							);
							break;
					}
				}
				else
				{
					this.settingsForm.innerHTML += Mojo.View.render({object: {label:tmpParam.name.replace(/_/g, " "), id: tmpParam.name}, template: 'governor/textfield-widget'});
					this.settingsModel[tmpParam.name] = tmpParam.value;
					this.settingsLocation[tmpParam.name] = location;
					this.controller.setupWidget
					(
						tmpParam.name,
						{
							modelProperty: tmpParam.name,
							multiline: false,
							enterSubmits: false,
							changeOnKeyPress: true,
							maxLength: 25,
							textCase: Mojo.Widget.steModeLowerCase,
							focusMode: Mojo.Widget.focusSelectMode,
							modifierState: Mojo.Widget.numLock,
							charsAllow: this.onlyNumbers.bind(this)
						},
						this.settingsModel
					);
				}
			}
		}
		
		this.controller.instantiateChildWidgets(this.settingsForm);
		
		// update form styles so list looks OK
		var rows = this.settingsForm.querySelectorAll('div.palm-row');
		for (var r = 0; r < rows.length; r++)
		{
			if (r == 0) rows[r].className = 'palm-row first';
			else if (r == rows.length-1) rows[r].className = 'palm-row last';
			else rows[r].className = 'palm-row';
		}
	}
	else
	{
		//error
	}

};
GovernorAssistant.prototype.onSetParams = function(payload)
{
	//alert('===========');
	//for (p in payload) alert(p+' : '+payload[p]);
	
	if (payload.errorCode != undefined) {
		this.errorMessage("Govnah", payload.errorText + '<br>' + payload.stdErr?payload.stdErr.join('<br>'):"", function(){});
	}
		
	this.settingsForm.innerHTML = '';
	this.settingsModel = {};
	this.settingsLocation = {};
	
	service.get_cpufreq_params(this.onGetParamsGeneric);
	service.get_cpufreq_params(this.onGetParamsSpecific, this.governorModel.value);
	service.get_compcache_config(this.onGetParamsCompcache);
};

GovernorAssistant.prototype.saveButtonPressed = function(event)
{
	//alert('-------');
	//for (var m in this.settingsModel) alert(m+" : "+this.settingsModel[m]);
	//for (var m in this.settingsLocation) alert(m+" : "+this.settingsLocation[m]);
	
	var genericParams = [];
	var governorParams = [];
	
	genericParams.push({name:"scaling_governor", value:this.governorModel.value});

	for (var m in this.settingsModel)
	{
		if (this.settingsLocation[m] == "generic")
		{
			genericParams.push({name:m, value:String(this.settingsModel[m])});
		}
		else if (this.settingsLocation[m] == "governor")
		{
			governorParams.push({name:m, value:String(this.settingsModel[m])});
		}
	}
	
	service.set_cpufreq_params(this.saveComplete, genericParams, governorParams);

	var compcacheConfig = [];
	
	for (var m in this.settingsModel)
	{
		if (this.settingsLocation[m] == "compcache")
		{
			compcacheConfig.push({name:m, value:String(this.settingsModel[m])});
		}
	}

	if (compcacheConfig.length) {
		service.set_compcache_config(this.saveComplete, compcacheConfig);
	}
};

GovernorAssistant.prototype.saveComplete = function(payload)
{
	//alert('===========');
	//for (p in payload) alert(p+' : '+payload[p]);
	
	if (payload.errorCode != undefined) {
		this.errorMessage("Govnah", payload.errorText + '<br>' + payload.stdErr?payload.stdErr.join('<br>'):"", function(){});
	}
		
	this.saveButtonElement.mojo.deactivate();
};

GovernorAssistant.prototype.saveAsProfileButtonPressed = function(event)
{
	var params =
	{
		name: this.profileModel.name,
		governor: this.governorModel.value,
		settingsStandard: [],
		settingsSpecific: [],
		settingsCompcache: []
	};
	
	for (var m in this.settingsModel)
	{
		if (this.settingsLocation[m] == "generic")
		{
			params.settingsStandard.push({name:m, value:String(this.settingsModel[m])});
		}
		else if (this.settingsLocation[m] == "governor")
		{
			params.settingsSpecific.push({name:m, value:String(this.settingsModel[m])});
		}
		else if (this.settingsLocation[m] == "compcache")
		{
			params.settingsCompcache.push({name:m, value:String(this.settingsModel[m])});
		}
	}
	
	profiles.newProfile(params);
	
	this.saveAsProfileButtonElement.mojo.deactivate();
	
	this.profileModel = {name: 'Profile ' + (profiles.cookieData.serial + 1)};
	this.controller.get('profileName').mojo.setValue('Profile ' + (profiles.cookieData.serial + 1));
};

GovernorAssistant.prototype.errorMessage = function(title, message, okFunction)
{
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

GovernorAssistant.prototype.activate = function(event)
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
GovernorAssistant.prototype.handleCommand = function(event)
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

GovernorAssistant.prototype.onlyNumbers = function (charCode)
{
	if (charCode > 47 && charCode < 58) {
		return true;
	}
	return false;
}

GovernorAssistant.prototype.cleanup = function(event)
{
	
};



// Local Variables:
// tab-width: 4
// End:
