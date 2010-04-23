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
	
	this.governors =
	{
		conservative:
		{
			visible: false
		},
		ondemand:
		{
			visible: false
		},
		powersave:
		{
			visible: false
		},
		userspace:
		{
			visible: false
		},
		performance:
		{
			visible: false
		}
	};
	
	this.governorModel = 
	{
		value: '',
		choices: []
	};
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
	
    this.onAvailableGovernors = this.onAvailableGovernors.bindAsEventListener(this);
    this.onCurrentGovernor = this.onCurrentGovernor.bindAsEventListener(this);

	service.get_scaling_available_governors(this.onAvailableGovernors);
	
};

GovernorAssistant.prototype.onAvailableGovernors = function(payload)
{
	this.governorModel.choices = [];
	
	var data = payload.value.split(" ");
	if (data.length > 0)
	{
		for (d = 0; d < data.length; d++)
		{
			var tmpGov = trim(data[d]);
			if (tmpGov && this.governors[tmpGov])
			{
				this.governors[tmpGov].visible = true;
				this.governorModel.choices.push({label:$L(tmpGov), value:tmpGov});
			}
		}
	}
	
	this.controller.modelChanged(this.governorModel);
	
	// move on
	service.get_scaling_governor(this.onCurrentGovernor);
};

GovernorAssistant.prototype.onCurrentGovernor = function(payload)
{
	this.governorModel.value = "";
	
	this.governorModel.value = trim(payload.value);
	
	this.controller.modelChanged(this.governorModel);
	
	
};

GovernorAssistant.prototype.buildForm = function()
{
	
};


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
