function SettingsAssistant()
{	
	this.listModel = {items:[]};
	
	// setup menu
	this.menuModel =
	{
		visible: true,
		items:
		[
			{
				label: $L("Preferences"),
				command: 'do-prefs'
			},
			{
				label: $L("Help"),
				command: 'do-help'
			}
		]
	};
};

SettingsAssistant.prototype.setup = function()
{
	// set theme because this can be the first scene pushed
	this.controller.document.body.className = prefs.get().theme;
	
	// get elements
	this.listElement =		this.controller.get('list');
	
	// setup menu
	this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
	
	this.rowTapHandler = this.rowTap.bindAsEventListener(this);
	
	// update list
	this.updateList(true);
	
	// setup widget
	this.controller.setupWidget('list', { itemTemplate: "settings/row", swipeToDelete: false, reorderable: false }, this.listModel);
	this.controller.listen(this.listElement, Mojo.Event.listTap, this.rowTapHandler);
	
	this.controller.get('advanced-settings-title').innerHTML = $L("Advanced Settings");
	this.backElement = this.controller.get('header');
	this.backTapHandler = this.backTap.bindAsEventListener(this);
	this.controller.listen(this.backElement, Mojo.Event.tap, this.backTapHandler);
};
SettingsAssistant.prototype.backTap = function(event)
{
	if (Mojo.Environment.DeviceInfo.modelNameAscii == 'TouchPad') this.controller.stageController.popScene();
};
SettingsAssistant.prototype.rowTap = function(event)
{
	if (event.item.scene)
	{
		this.controller.stageController.pushScene(event.item.scene);
	}
}

SettingsAssistant.prototype.updateList = function(skipUpdate)
{
	try 
	{
		// clear main list model of its items
		this.listModel.items = [];
		
		this.listModel.items.push(
		{
			name:	$L("CPU Frequency"),
			data:	dataHandler.governor,
			scene:	'settings-cpufreq'
		});
		
		this.listModel.items.push(
		{
			rowClass:	(dataHandler.compcache == false) ? 'disabled' : '',
			name:		$L("Compressed Swap"),
			data:		(dataHandler.compcache == false) ? "N/A" : dataHandler.compcache,
			scene:		(dataHandler.compcache == false) ? false : 'settings-compcache'
		});

		this.listModel.items.push(
		{
			name:	$L("I/O Scheduler"),
			data:	dataHandler.scheduler,
			scene:	'settings-iosched'
		});
		
		this.listModel.items.push(
		{
			name:	$L("TCP Congestion"),
			data:	dataHandler.congestion,
			scene:	'settings-tcpcong'
		});
		
		this.listModel.items.push(
		{
			name:	$L("Save As New Profile"),
			scene:	'profile-save'
		});
		
		if (!skipUpdate) 
		{
			// update list widget
			this.listElement.mojo.noticeUpdatedItems(0, this.listModel.items);
			this.listElement.mojo.setLength(this.listModel.items.length);
		}
		
	}
	catch (e)
	{
		Mojo.Log.logException(e, 'settings#updateList');
	}
};

SettingsAssistant.prototype.activate = function(event)
{
	dataHandler.setSettingsAssistant(this);
	
	if (this.alreadyActivated)
	{
		dataHandler.updateParams();
		// once the setting scene go through the dataHandler, we dont need the above, and will only need the below
		//this.updateList();
	}
	else
	{
		
	}
	this.alreadyActivated = true;
};
SettingsAssistant.prototype.handleCommand = function(event)
{
	if (event.type == Mojo.Event.command)
	{
		switch (event.command)
		{
			case 'do-prefs':
				this.controller.stageController.pushScene('preferences');
				break;
				
			case 'do-help':
				this.controller.stageController.pushScene('help');
				break;
		}
	}
};

SettingsAssistant.prototype.cleanup = function(event)
{
	
};

// Local Variables:
// tab-width: 4
// End:
