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
			type: 'listFreq',
		},
		'scaling_max_freq':
		{
			type: 'listFreq',
		},
		'scaling_setspeed':
		{
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
		}
	};
	
	this.governorModel = 
	{
		value: governor,
		choices: []
	};
	
	this.scalingFrequencyChoices = [];
	
	this.percentChoices = [];
	for (x = 0; x <= 100; x = x + 5)
	{
		this.percentChoices.push({label:$L(x+'%'), value:x});
	}
	
	this.powersaveChoices = [];
	for (x = 0; x <= 1000; x = x + 10)
	{
		this.percentChoices.push({label:$L(x+'%'), value:x});
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
	
	
	this.settingsForm = this.controller.get('settings');
	
    this.onGetParams = this.onGetParams.bindAsEventListener(this);
    this.onSetParams = this.onSetParams.bindAsEventListener(this);
	
	service.get_cpufreq_params(this.onGetParams);
	service.get_cpufreq_params(this.onGetParams, this.governorModel.value);
	
};

GovernorAssistant.prototype.onGetParams = function(payload)
{
	// initial loop
	for (var param = 0; param < payload.params.length; param++)
	{
		tmpParam = payload.params[param];
		
		alert('-----');
		for (p in tmpParam) alert(p + " : " + tmpParam[p]);

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
						var tmpFreq = trim(data[d]);
						this.scalingFrequencyChoices.push({label:$L(tmpFreq), value:tmpFreq});
					}
				}
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
						this.controller.setupWidget
						(
							tmpParam.name,
							{
								label: tmpParam.name,
								choices: this.scalingFrequencyChoices
							},
							{
								value: tmpParam.value
							}
						);
						break;
					case 'listPcnt':
						this.settingsForm.innerHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'governor/listselect-widget'});
						this.controller.setupWidget
						(
							tmpParam.name,
							{
								label: tmpParam.name,
								choices: this.percentChoices
							},
							{
								value: tmpParam.value
							}
						);
						break;
				}
			}
			else
			{
				this.settingsForm.innerHTML += Mojo.View.render({object: {label:tmpParam.name, id: tmpParam.name}, template: 'governor/textfield-widget'});
				this.controller.setupWidget
				(
					tmpParam.name,
					{
						multiline: false,
						enterSubmits: false,
						maxLength: 25,
						textCase: Mojo.Widget.steModeLowerCase,
						focusMode: Mojo.Widget.focusSelectMode
					},
					{
						value: tmpParam.value
					}
				);
			}
		}
	}
	
	this.controller.instantiateChildWidgets(this.settingsForm);
}

GovernorAssistant.prototype.governorChange = function(event)
{
	//alert('===========');
	//for (e in event) alert(e+' : '+event[e]);
	
	//alert(event.value);
	this.governorModel.value = event.value;
	service.set_cpufreq_params(this.onSetParams, [{name:'scaling_governor',value:this.governorModel.value}])
}

GovernorAssistant.prototype.onSetParams = function(payload)
{
	//alert('===========');
	//for (p in payload) alert(p+' : '+payload[p]);
	
	this.settingsForm.innerHTML = '';
	
	service.get_cpufreq_params(this.onGetParams);
	service.get_cpufreq_params(this.onGetParams, this.governorModel.value);
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

GovernorAssistant.prototype.cleanup = function(event)
{
	
};

// Local Variables:
// tab-width: 4
// End:
