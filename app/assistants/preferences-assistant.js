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
	  			trueLabel:  $L("Yes"),
	 			falseLabel: $L("No"),
	  			fieldName:  'cardIconUpdate'
			},
			{
				value : this.prefs.cardIconUpdate,
	 			disabled: false
			}
		);
		
		this.controller.listen('cardPollSpeed', Mojo.Event.propertyChange, this.pollSpeedChanged.bindAsEventListener(this));
		this.controller.listen('cardIconUpdate', Mojo.Event.propertyChange, this.iconUpdateChanged.bindAsEventListener(this));
		
		
		// Dash Group
		this.controller.setupWidget
		(
			'useDash',
			{
	  			trueLabel:  $L("Yes"),
	 			falseLabel: $L("No"),
	  			fieldName:  'useDash'
			},
			{
				value : this.prefs.useDash,
	 			disabled: true
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
	  			trueLabel:  $L("Yes"),
	 			falseLabel: $L("No"),
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
		
		
		
		// Profiles Group
		this.controller.setupWidget
		(
			'profileList',
			{
				label: $L('Profile List'),
				choices:
				[
					{label:$L('Name Only'),		value:'name'},
					{label:$L('Governor'),		value:'governor'},
					{label:$L('All Data'),		value:'all'}
				],
				modelProperty: 'profileList'
			},
			this.prefs
		);
		
		this.controller.listen('profileList', Mojo.Event.propertyChange, this.listChangedHandler);
		
		
		
		// Governor Settings Group
		this.controller.setupWidget
		(
			'manualEntry',
			{
	  			trueLabel:  $L("Yes"),
	 			falseLabel: $L("No"),
	  			fieldName:  'manualEntry'
			},
			{
				value : this.prefs.manualEntry,
	 			disabled: false
			}
		);
		
		this.controller.listen('manualEntry', Mojo.Event.propertyChange, this.toggleChangeHandler);
		
		this.controller.get('preferences-title').innerHTML = $L("Preferences");
		this.controller.get('global-title').innerHTML = $L("Global");
		this.controller.get('card-open-title').innerHTML = $L("Card Open");
		this.controller.get('preferences-scene-update-launcher').innerHTML = $L("Update Launcher Icon");
		this.controller.get('note-cause-app-catalog').innerHTML = $L("* Causes App Catalog To Flicker.");
		this.controller.get('dashboard-title').innerHTML = $L("Dashboard");
		this.controller.get('preferences-scene-use-dashboard').innerHTML = $L("Use Dashboard");
		this.controller.get('preferences-scene-update-launcher-icon').innerHTML = $L("Update Launcher Icon");
		this.controller.get('profiles-title').innerHTML = $L("Profiles");
		this.controller.get('settings-title').innerHTML = $L("Settings");
		this.controller.get('preferences-scene-manual-entry').innerHTML = $L("Manual Entry");
		this.controller.get('note-for-experienced-users').innerHTML = $L("* For Experienced Users Only.");
		this.backElement = this.controller.get('icon');
		this.backTapHandler = this.backTap.bindAsEventListener(this);
		this.controller.listen(this.backElement, Mojo.Event.tap, this.backTapHandler);
		
	}
	catch (e)
	{
		Mojo.Log.logException(e, 'preferences#setup');
	}
	

};
PreferencesAssistant.prototype.backTap = function(event)
{
	this.controller.stageController.popScene();
};
PreferencesAssistant.prototype.listChanged = function(event)
{
	this.cookie.put(this.prefs);
};
PreferencesAssistant.prototype.themeChanged = function(event)
{
	this.controller.document.body.className = event.value;
	this.cookie.put(this.prefs);
};
PreferencesAssistant.prototype.pollSpeedChanged = function(event)
{
	dataHandler.rate = parseInt(event.value) * 1000;
	this.cookie.put(this.prefs);
};
PreferencesAssistant.prototype.iconUpdateChanged = function(event)
{
	this.toggleChanged(event);
	if (!this.prefs['cardIconUpdate'])
	{
		dataHandler.resetIcon();
	}
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
		if (Mojo.Environment.DeviceInfo.modelNameAscii != 'TouchPad' &&
			Mojo.Environment.DeviceInfo.modelNameAscii != 'Emulator')
			this.controller.stageController.setWindowOrientation("up");
	}
};

PreferencesAssistant.prototype.deactivate = function(event)
{
	// reload global storage of preferences when we get rid of this stage
	var tmp = prefs.get(true);
};

PreferencesAssistant.prototype.cleanup = function(event) {
	this.controller.stopListening(this.backElement,  Mojo.Event.tap, this.backTapHandler);
};

// Local Variables:
// tab-width: 4
// End:
