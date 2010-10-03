function SettingsVoltageAssistant(param, parent)
{
	this.param =	param;
	this.parent =	parent;
	
	
	this.voltages = this.param.value.split(' ');
	this.voltageModel = {};
	
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
	
};

SettingsVoltageAssistant.prototype.setup = function()
{
	// setup menu
	this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
	
	this.controller.get('voltage-title').update(dataHandler.settingLabel(this.param.name));
	
	this.group = this.controller.get('freq_group');
	this.group.update('');
	
	for (var num = 0; num < this.parent.scalingFrequencyChoices.length; num++)
	{
		alert('----');
		for (var x in this.parent.scalingFrequencyChoices[num]) alert(x+': '+this.parent.scalingFrequencyChoices[num][x]);
		
		this.group.insert({bottom: Mojo.View.render({object: {id: 'freq_'+num, rowClass: (num == 0 ? 'first' : (num == this.parent.scalingFrequencyChoices.length-1 ? 'last' : ''))}, template: 'settings/listselect-widget'})});
		this.voltageModel['freq_'+num] = this.voltages[num];
		
		var voltageChoices = [];
		if (this.parent.voltageLimits.max !== false && this.parent.voltageLimits.min !== false)
		{
			for (var s = this.parent.voltageLimits.min; s <= this.parent.voltageLimits.max; s = s + 1)
			{
				var display = ((s * 12.5) + 600) +' mV';
				voltageChoices.push({label: display, value: s});
			}
		}
		else
		{
			var display = ((this.voltages[num] * 12.5) + 600) +' mV';
			voltageChoices.push({label: display, value: this.voltages[num]});
		}
		
		this.controller.setupWidget
		(
			'freq_'+num,
			{
				label: this.parent.scalingFrequencyChoices[num].label,
				modelProperty: 'freq_'+num,
				choices: voltageChoices
			},
			this.voltageModel
		);
	}
	
};


SettingsVoltageAssistant.prototype.activate = function(event)
{
	
};
SettingsVoltageAssistant.prototype.handleCommand = function(event)
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

SettingsVoltageAssistant.prototype.cleanup = function(event)
{
	this.parent.settingsModel[this.param.name] = this.param.value;
};



// Local Variables:
// tab-width: 4
// End:
