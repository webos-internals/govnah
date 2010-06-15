function MainAssistant()
{
	// subtitle random list
	this.randomSub = 
	[
		{weight: 30, text: $L('The Advanced CPU Controller')},
		{weight: 30, text: $L('Take Control Of Your CPU')},
		{weight: 15, text: $L('Much Better Than Arnie')},
		{weight:  2, text: $L('Random Taglines Are Awesome')},
		{weight:  2, text: $L('Now With More Cowbell')}
	];
	
	// setup list model
	this.mainModel = {items:[]};
	
	// setup search model
	this.searchModel = { value: '' };
	this.searchText = '';
	
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
	
	this.isVisible = false;
};

MainAssistant.prototype.setup = function()
{
	// set theme because this can be the first scene pushed
	this.controller.document.body.className = prefs.get().theme;
	
	// get elements
	this.iconElement =		this.controller.get('icon');
	this.titleElement =		this.controller.get('main-title');
	this.versionElement =	this.controller.get('version');
	this.subTitleElement =	this.controller.get('subTitle');
	this.profileRow =		this.controller.get('profileRow');
	this.profileCurrent =	this.controller.get('profileCurrent');
	this.governorRow =		this.controller.get('governorRow');
	this.governorCurrent =	this.controller.get('governorCurrent');
	
	this.freqRow =			this.controller.get('freqRow');
	this.freqCurrent =		this.controller.get('freqCurrent');
	this.tempRow =			this.controller.get('tempRow');
	this.tempCurrent =		this.controller.get('tempCurrent');
	this.loadRow =			this.controller.get('loadRow');
	this.loadCurrent =		this.controller.get('loadCurrent');
	this.memRow =			this.controller.get('memRow');
	this.memCurrent =		this.controller.get('memCurrent');
	
	// set version string random subtitle
	this.titleElement.innerHTML = Mojo.Controller.appInfo.title;
	this.versionElement.innerHTML = "v" + Mojo.Controller.appInfo.version;
	this.subTitleElement.innerHTML = this.getRandomSubTitle();
	
	// setup menu
	this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
	
	
	this.profileTapHandler = this.profileTap.bindAsEventListener(this);
	this.governorTapHandler = this.governorTap.bindAsEventListener(this);
	
	this.controller.listen(this.profileRow, Mojo.Event.tap, this.profileTapHandler);
	this.controller.listen(this.governorRow, Mojo.Event.tap, this.governorTapHandler);
	
	this.controller.listen(this.freqRow, Mojo.Event.tap, this.graphTap.bindAsEventListener(this, 'freq'));
	this.controller.listen(this.tempRow, Mojo.Event.tap, this.graphTap.bindAsEventListener(this, 'temp'));
	this.controller.listen(this.loadRow, Mojo.Event.tap, this.graphTap.bindAsEventListener(this, 'load'));
	this.controller.listen(this.memRow,  Mojo.Event.tap, this.graphTap.bindAsEventListener(this, 'mem' ));
	
	
	this.visible = this.visible.bindAsEventListener(this);
	this.invisible = this.invisible.bindAsEventListener(this);
	this.controller.listen(this.controller.stageController.document, Mojo.Event.stageActivate,   this.visible);
	this.controller.listen(this.controller.stageController.document, Mojo.Event.stageDeactivate, this.invisible);
	
	this.visible();

	dataHandler.setMainAssistant(this);
	dataHandler.start();
	
};


MainAssistant.prototype.profileTap = function(event)
{
	this.controller.stageController.pushScene('profiles');
}
MainAssistant.prototype.governorTap = function(event)
{
	this.controller.stageController.pushScene('governor');
}
MainAssistant.prototype.graphTap = function(event, display)
{
	this.controller.stageController.pushScene({name: 'graph', disableSceneScroller: true}, display);
}

MainAssistant.prototype.activate = function(event)
{
	if (this.controller.stageController.setWindowOrientation)
	{
    	this.controller.stageController.setWindowOrientation("up");
	}
	
	if (this.firstActivate)
	{
		dataHandler.updateParams();
		dataHandler.renderGraph();
	}
	else
	{
		
	}
	this.firstActivate = true;
};
MainAssistant.prototype.deactivate = function(event)
{
};
MainAssistant.prototype.visible = function(event)
{
	if (!this.isVisible)
	{
		this.isVisible = true;
	}
	
	dataHandler.updateParams();
	dataHandler.renderGraph();
};
MainAssistant.prototype.invisible = function(event)
{
	this.isVisible = false;
};

MainAssistant.prototype.getRandomSubTitle = function()
{
	// loop to get total weight value
	var weight = 0;
	for (var r = 0; r < this.randomSub.length; r++)
	{
		weight += this.randomSub[r].weight;
	}
	
	// random weighted value
	var rand = Math.floor(Math.random() * weight);
	//alert('rand: ' + rand + ' of ' + weight);
	
	// loop through to find the random title
	for (var r = 0; r < this.randomSub.length; r++)
	{
		if (rand <= this.randomSub[r].weight)
		{
			return this.randomSub[r].text;
		}
		else
		{
			rand -= this.randomSub[r].weight;
		}
	}
	
	// if no random title was found (for whatever reason, wtf?) return first and best subtitle
	return this.randomSub[0].text;
};

MainAssistant.prototype.handleCommand = function(event)
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

MainAssistant.prototype.cleanup = function(event)
{
	this.controller.stopListening(this.profileRow, Mojo.Event.tap, this.profileTapHandler);
	this.controller.stopListening(this.governorRow, Mojo.Event.tap, this.governorTapHandler);
	
	this.controller.stopListening(this.controller.stageController.document, Mojo.Event.stageActivate,   this.visible);
	this.controller.stopListening(this.controller.stageController.document, Mojo.Event.stageDeactivate, this.invisible);
	
	if (prefs.get().useDash)
	{
		dataHandler.openDash();
	}
};

// Local Variables:
// tab-width: 4
// End:
