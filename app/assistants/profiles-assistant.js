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
		]
	}
}

ProfilesAssistant.prototype.setup = function()
{
	try
	{
		// set theme
		this.controller.document.body.className = prefs.get().theme;
		
		this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
		
		this.profileListElement =	this.controller.get('profileList');
		
		this.listTapHandler =		this.listTapHandler.bindAsEventListener(this);
		this.listDeleteHandler =	this.listDeleteHandler.bindAsEventListener(this);
		
		this.updateList(true);
		this.controller.setupWidget('profileList', 
		{
			itemTemplate: "profiles/profile-row",
			swipeToDelete: true,
			reorderable: false
		}, this.profileListModel);
		Mojo.Event.listen(this.profileListElement, Mojo.Event.listTap, this.listTapHandler);
		Mojo.Event.listen(this.profileListElement, Mojo.Event.listDelete, this.listDeleteHandler);	
		
	} 
	catch (e) 
	{
		Mojo.Log.logException(e, 'profiles#setup');
	}
}

ProfilesAssistant.prototype.activate = function(event)
{
	if (this.alreadyActivated)
	{
		this.updateList();
	}
	
	this.alreadyActivated = true;
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
}
ProfilesAssistant.prototype.listDeleteHandler = function(event)
{
	profiles.deleteProfile(event.item.id);
}

ProfilesAssistant.prototype.handleCommand = function(event)
{
	if (event.type == Mojo.Event.command)
	{
		switch (event.command)
		{
		}
	}
}

ProfilesAssistant.prototype.deactivate = function(event) {}
ProfilesAssistant.prototype.cleanup = function(event)
{
	Mojo.Event.stopListening(this.profileListElement, Mojo.Event.listTap, this.listTapHandler);
	Mojo.Event.stopListening(this.profileListElement, Mojo.Event.listDelete, this.listDeleteHandler);
}
