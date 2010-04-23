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
};

GovernorAssistant.prototype.setup = function()
{
	// setup menu
	this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
	
	
	this.controller.setupWidget
	(
		'governor',
		{
			label: $L('Governor'),
			choices:
			[
				{label:$L('userspace'),		value:'userspace'},
				{label:$L('userspacea'),	value:'userspacea'},
				{label:$L('userspaceb'),	value:'userspaceb'}
			],
			modelProperty: 'governor'
		},
		{
			governor: 'userspace'
		}
	);
	
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
