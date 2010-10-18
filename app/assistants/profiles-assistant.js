function ProfilesAssistant()
{
	this.profileListModel =
	{
		items: []
	};
	
	this.profileListElement =	false;
	
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
	}
}

ProfilesAssistant.prototype.setup = function()
{
	try
	{
		this.controller.get('profiles-scene-profiles').innerHTML = $L("Profiles");
		this.controller.get('profiles-scene-advanced-settings').innerHTML = $L("Advanced Settings");
		
		// set view
		this.controller.get('profileList').className = prefs.get().profileList;
		
		this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
		
		this.advancedRow =			this.controller.get('advancedRow');
		this.profileListElement =	this.controller.get('profileList');
		
		this.advancedTapHandler =	this.advancedTap.bindAsEventListener(this);
		this.listTapHandler =		this.listTapHandler.bindAsEventListener(this);
		this.listDeleteHandler =	this.listDeleteHandler.bindAsEventListener(this);
		this.listReorderHandler =	this.listReorderHandler.bindAsEventListener(this);
		
		this.updateList(true);
		this.controller.setupWidget('profileList', 
		{
			itemTemplate: "profiles/profile-row",
			swipeToDelete: true,
			preventDeleteProperty: 'locked',
			reorderable: true
		}, this.profileListModel);
		this.controller.listen(this.profileListElement, Mojo.Event.listTap,    	this.listTapHandler);
		this.controller.listen(this.profileListElement, Mojo.Event.listDelete, 	this.listDeleteHandler);
		this.controller.listen(this.profileListElement, Mojo.Event.listReorder,	this.listReorderHandler);
		
		this.controller.listen(this.advancedRow, Mojo.Event.tap, this.advancedTapHandler);
		
	} 
	catch (e) 
	{
		Mojo.Log.logException(e, 'profiles#setup');
	}
}

ProfilesAssistant.prototype.activate = function(event)
{
    profiles.controller = this.controller;

    if (this.alreadyActivated)
	{
		this.controller.get('profileList').className = prefs.get().profileList;
		this.updateList();
    }

    this.alreadyActivated = true;
}
ProfilesAssistant.prototype.advancedTap = function(event)
{
	this.controller.stageController.pushScene('settings');
}
ProfilesAssistant.prototype.updateList = function(skipUpdate)
{
	try
	{
		this.profileListModel.items = [];
		this.profileListModel.items = profiles.getListObjects();
		
		if (!skipUpdate) 
		{
			this.profileListElement.mojo.noticeUpdatedItems(0, this.profileListModel.items);
			this.profileListElement.mojo.setLength(this.profileListModel.items.length);
		}
	}
	catch (e)
	{
		Mojo.Log.logException(e, 'profiles#updateList');
	}
}
ProfilesAssistant.prototype.listTapHandler = function(event)
{
	profiles.profiles[event.item.key].apply();
	// this.controller.stageController.popScene();
}
ProfilesAssistant.prototype.listDeleteHandler = function(event)
{
	profiles.deleteProfile(event.item.id);
}
ProfilesAssistant.prototype.listReorderHandler = function(event)
{
	profiles.reorderProfiles(event.fromIndex, event.toIndex);
}

ProfilesAssistant.prototype.handleCommand = function(event)
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
}

ProfilesAssistant.prototype.deactivate = function(event)
{
    profiles.controller = false;
}
ProfilesAssistant.prototype.cleanup = function(event)
{
	this.controller.stopListening(this.profileListElement, Mojo.Event.listTap, this.listTapHandler);
	this.controller.stopListening(this.profileListElement, Mojo.Event.listDelete, this.listDeleteHandler);
}
