function PreferencesAssistant()
{
	// setup default preferences in the preferenceCookie.js model
	this.cookie = new preferenceCookie();
	this.prefs = this.cookie.get();
	
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
	}

};

PreferencesAssistant.prototype.setup = function()
{
	try
	{
		this.controller.get('preferences-global').innerHTML = $L('Global');

		// setup menu
		this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
		
		// set this scene's default transition
		this.controller.setDefaultTransition(Mojo.Transition.zoomFade);
		
		// setup handlers for preferences
		this.toggleChangeHandler = this.toggleChanged.bindAsEventListener(this);
		this.listChangedHandler  = this.listChanged.bindAsEventListener(this);
		
		// Global Group
		this.controller.setupWidget
		(
			'theme',
			{
				label: $L('Theme'),
				choices:
				[
					{label:$L('Palm Default'),	value:'palm-default'},
					{label:$L('Palm Dark'),		value:'palm-dark'}
				],
				modelProperty: 'theme'
			},
			this.prefs
		);
		
		this.controller.listen('theme', Mojo.Event.propertyChange, this.themeChanged.bindAsEventListener(this));
		
		
		// Card Group
		this.controller.setupWidget
		(
			'cardPollSpeed',
			{
				label: $L('Poll Speed'),
				choices:
				[
					{label:$L('1 Second'),		value:1},
					{label:$L('2 Seconds'),		value:2},
					{label:$L('5 Seconds'),		value:5},
					{label:$L('10 Seconds'),	value:10},
					{label:$L('15 Seconds'),	value:15},
					{label:$L('30 Seconds'),	value:30},
					{label:$L('1 Minute'),		value:60}
				],
				modelProperty: 'cardPollSpeed'
			},
			this.prefs
		);
		this.controller.setupWidget
		(
			'cardIconUpdate',
			{
	  			trueLabel:  'Yes',
	 			falseLabel: 'No',
	  			fieldName:  'cardIconUpdate'
			},
			{
				value : this.prefs.cardIconUpdate,
	 			disabled: false
			}
		);
		
		this.controller.listen('cardPollSpeed', Mojo.Event.propertyChange, this.pollSpeedChanged.bindAsEventListener(this));
		this.controller.listen('cardIconUpdate', Mojo.Event.propertyChange, this.toggleChangeHandler);
		
		
		// Dash Group
		this.controller.setupWidget
		(
			'useDash',
			{
	  			trueLabel:  'Yes',
	 			falseLabel: 'No',
	  			fieldName:  'useDash'
			},
			{
				value : this.prefs.useDash,
	 			disabled: false
			}
		);
		this.controller.setupWidget
		(
			'dashPollSpeed',
			{
				label: $L('Poll Speed'),
				choices:
				[
					{label:$L('1 Second'),		value:1},
					{label:$L('2 Seconds'),		value:2},
					{label:$L('5 Seconds'),		value:5},
					{label:$L('10 Seconds'),	value:10},
					{label:$L('15 Seconds'),	value:15},
					{label:$L('30 Seconds'),	value:30},
					{label:$L('1 Minute'),		value:60}
				],
				modelProperty: 'dashPollSpeed'
			},
			this.prefs
		);
		this.controller.setupWidget
		(
			'dashIconUpdate',
			{
	  			trueLabel:  'Yes',
	 			falseLabel: 'No',
	  			fieldName:  'dashIconUpdate'
			},
			{
				value : this.prefs.dashIconUpdate,
	 			disabled: false
			}
		);
		
		this.useDashChanged(false);
		this.controller.listen('useDash', Mojo.Event.propertyChange, this.useDashChanged.bindAsEventListener(this));
		this.controller.listen('dashPollSpeed', Mojo.Event.propertyChange, this.listChangedHandler);
		this.controller.listen('dashIconUpdate', Mojo.Event.propertyChange, this.toggleChangeHandler);
		
		
		
		
		
		// Governor Settings Group
		this.controller.setupWidget
		(
			'manualEntry',
			{
	  			trueLabel:  'Yes',
	 			falseLabel: 'No',
	  			fieldName:  'manualEntry'
			},
			{
				value : this.prefs.manualEntry,
	 			disabled: false
			}
		);
		
		this.controller.listen('manualEntry', Mojo.Event.propertyChange, this.toggleChangeHandler);
		
	}
	catch (e)
	{
		Mojo.Log.logException(e, 'preferences#setup');
	}

};

PreferencesAssistant.prototype.listChanged = function(event)
{
	this.cookie.put(this.prefs);
};
PreferencesAssistant.prototype.themeChanged = function(event)
{
	// set the theme right away with the body class
	this.controller.document.body.className = event.value;
	this.cookie.put(this.prefs);
};
PreferencesAssistant.prototype.pollSpeedChanged = function(event)
{
	// set the rate right away with the new value
	dataHandler.rate = parseInt(event.value) * 1000;
	this.cookie.put(this.prefs);
};
PreferencesAssistant.prototype.useDashChanged = function(event)
{
	if (event) 
	{
		this.toggleChanged(event);
	}
	if (this.prefs['useDash'])
	{
		this.controller.get('useDashContainer').className = 'palm-row first';
		this.controller.get('dashSettings').style.display = '';
	}
	else
	{
		this.controller.get('useDashContainer').className = 'palm-row single';
		this.controller.get('dashSettings').style.display = 'none';
		dataHandler.closeDash(true);
	}	
}
PreferencesAssistant.prototype.toggleChanged = function(event)
{
	this.prefs[event.target.id] = event.value;
	this.cookie.put(this.prefs);
};

PreferencesAssistant.prototype.handleCommand = function(event)
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

PreferencesAssistant.prototype.activate = function(event)
{
	if (this.controller.stageController.setWindowOrientation)
	{
    	this.controller.stageController.setWindowOrientation("up");
	}
};

PreferencesAssistant.prototype.deactivate = function(event)
{
	// reload global storage of preferences when we get rid of this stage
	var tmp = prefs.get(true);
};

PreferencesAssistant.prototype.cleanup = function(event) {};

// Local Variables:
// tab-width: 4
// End:
