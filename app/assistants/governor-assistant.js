function GovernorAssistant(governor)
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
	
	
	
	this.settings = 
	{
		'scaling_min_freq':
		{
			nice: 'min freq',
			type: 'listFreq',
		},
		'scaling_max_freq':
		{
			nice: 'max freq',
			type: 'listFreq',
		},
		'scaling_setspeed':
		{
			nice: 'setspeed',
			type: 'listFreq',
		},
		'up_threshold':
		{
			type: 'listPcnt',
		},
		'down_threshold':
		{
			type: 'listPcnt',
		},
		'freq_step':
		{
			type: 'listPcnt',
		},
		'sampling_rate':
		{
			type: 'listSamp',
		},
		'sampling_down_factor':
		{
			type: 'listSampDown',
		},
		'powersave_bias':
		{
			type: 'listPowr',
		},
		'ignore_nice_load':
		{
			type: 'toggleTF',
		}
	};
	
	this.governorModel = 
	{
		value: governor,
		choices: []
	};
	
	this.settingsModel = {};
	this.settingsLocation = {};
	
	this.scalingFrequencyChoices = [];
	
	this.samplingRates = {min:false, max:false}; 
	
	this.samplingDownChoices = [];
	for (var x = 1; x <= 10; x++)
	{
		this.samplingDownChoices.push({label:x, value:x});
	}
			
	this.percentChoices = [];
	for (var x = 0; x <= 100; x = x + 5)
	{
		this.percentChoices.push({label:x, value:x});
	}
	
	this.powersaveChoices = [];
	for (var x = 0; x <= 1000; x = x + 10)
	{
		this.powersaveChoices.push({label:x, value:x});
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
			buttonLabel: 'Save'
		}
	);
	this.saveButtonElement = this.controller.get('saveButton');
	this.saveButtonPressed = this.saveButtonPressed.bindAsEventListener(this);
    this.saveComplete = this.saveComplete.bindAsEventListener(this);
	this.controller.listen('saveButton', Mojo.Event.tap, this.saveButtonPressed);
	
	
	this.settingsForm = this.controller.get('settings');
	
    this.onGetParams = this.onGetParams.bindAsEventListener(this);
    this.onSetParams = this.onSetParams.bindAsEventListener(this);
	
	service.get_cpufreq_params(this.onGetParams);
	service.get_cpufreq_params(this.onGetParams, this.governorModel.value);
	
};

GovernorAssistant.prototype.onGetParams = function(payload)
{
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
							this.scalingFrequencyChoices.push({label:(tmpFreq/1000) + ' MHz', value:tmpFreq});
						}
					}
					break;
					
				case 'sampling_rate_max':
					this.samplingRates.max = parseInt(trim(tmpParam.value));
					break;
				case 'sampling_rate_min':
					this.samplingRates.min = parseInt(trim(tmpParam.value));
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
				
				if (this.settings[tmpParam.name])
				{
					switch(this.settings[tmpParam.name].type)
					{
						case 'listFreq':
							this.settingsForm.innerHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'governor/listselect-widget'});
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = payload.governor;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: (this.settings[tmpParam.name].nice ? this.settings[tmpParam.name].nice : tmpParam.name.replace(/_/g, " ")),
									modelProperty: tmpParam.name,
									choices: this.scalingFrequencyChoices
								},
								this.settingsModel
							);
							break;
						case 'listPcnt':
							this.settingsForm.innerHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'governor/listselect-widget'});
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = payload.governor;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: (this.settings[tmpParam.name].nice ? this.settings[tmpParam.name].nice : tmpParam.name.replace(/_/g, " ")),
									modelProperty: tmpParam.name,
									choices: this.powersaveChoices
								},
								this.settingsModel
							);
							break;
						case 'listPowr':
							this.settingsForm.innerHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'governor/listselect-widget'});
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = payload.governor;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: (this.settings[tmpParam.name].nice ? this.settings[tmpParam.name].nice : tmpParam.name.replace(/_/g, " ")),
									modelProperty: tmpParam.name,
									choices: this.percentChoices
								},
								this.settingsModel
							);
							break;
						case 'listSamp':
							this.settingsForm.innerHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'governor/listselect-widget'});
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = payload.governor;
							var samplingChoices = [];
							if (this.samplingRates.max !== false && this.samplingRates.min !== false)
							{
								for (var s = this.samplingRates.min; s <= this.samplingRates.max; s = s + 10000000)
								{
									samplingChoices.push({label:s, value:s});
								}
								if (s > this.samplingRates.max && s - 10000000 < this.samplingRates.max)
									samplingChoices.push({label:this.samplingRates.max, value:this.samplingRates.max});
							}
							else
							{
								samplingChoices.push({label:$L(tmpParam.value), value:tmpParam.value});
							}
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: (this.settings[tmpParam.name].nice ? this.settings[tmpParam.name].nice : tmpParam.name.replace(/_/g, " ")),
									modelProperty: tmpParam.name,
									choices: samplingChoices
								},
								this.settingsModel
							);
							break;
						case 'listSampDown':
							this.settingsForm.innerHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'governor/listselect-widget'});
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = payload.governor;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: (this.settings[tmpParam.name].nice ? this.settings[tmpParam.name].nice : tmpParam.name.replace(/_/g, " ")),
									modelProperty: tmpParam.name,
									choices: this.samplingDownChoices
								},
								this.settingsModel
							);
							break;
							
						case 'toggleTF':
							this.settingsForm.innerHTML += Mojo.View.render({object: {label:(this.settings[tmpParam.name].nice ? this.settings[tmpParam.name].nice : tmpParam.name.replace(/_/g, " ")), id: tmpParam.name}, template: 'governor/toggle-widget'});
							this.settingsModel[tmpParam.name] = parseInt(tmpParam.value);
							this.settingsLocation[tmpParam.name] = payload.governor;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
						  			trueLabel: $L('True'),
									trueValue: 1,
						 			falseLabel: $L('False'),
									falseValue: 0,
									modelProperty: tmpParam.name
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
					this.settingsLocation[tmpParam.name] = payload.governor;
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
}

GovernorAssistant.prototype.governorChange = function(event)
{
	//alert('===========');
	//for (e in event) alert(e+' : '+event[e]);
	
	//alert(event.value);
	this.governorModel.value = event.value;
	service.set_cpufreq_params(this.onSetParams, [{name:'scaling_governor', value:this.governorModel.value}]);
}

GovernorAssistant.prototype.onSetParams = function(payload)
{
	//alert('===========');
	//for (p in payload) alert(p+' : '+payload[p]);
	
	this.settingsForm.innerHTML = '';
	this.settingsModel = {};
	this.settingsLocation = {};
	
	service.get_cpufreq_params(this.onGetParams);
	service.get_cpufreq_params(this.onGetParams, this.governorModel.value);
}

GovernorAssistant.prototype.saveButtonPressed = function(event)
{
	//alert('-------');
	//for (var m in this.settingsModel) alert(m+" : "+this.settingsModel[m]);
	//for (var m in this.settingsLocation) alert(m+" : "+this.settingsLocation[m]);
	
	var params = [];
	
	for (var m in this.settingsModel)
	{
		if (!this.settingsLocation[m])
		{
			params.push({name:m, value:this.settingsModel[m]});
		}
	}
	
	service.set_cpufreq_params(this.saveComplete, params);
	
	
	var params = [];
	
	for (var m in this.settingsModel)
	{
		if (this.settingsLocation[m])
		{
			params.push({name:m, value:this.settingsModel[m]});
		}
	}
	
	service.set_cpufreq_params(this.saveComplete, params, this.governorModel.value);	
}

GovernorAssistant.prototype.saveComplete = function(payload)
{
	//alert('===========');
	//for (p in payload) alert(p+' : '+payload[p]);
	
	this.saveButtonElement.mojo.deactivate();
}

GovernorAssistant.prototype.activate = function(event)
{
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
