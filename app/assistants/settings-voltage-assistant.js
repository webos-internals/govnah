function SettingsVoltageAssistant(param, parent)
{
	this.param =	param;
	this.parent =	parent;
	
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
