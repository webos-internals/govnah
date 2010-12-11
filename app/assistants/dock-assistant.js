function DockAssistant()
{
	this.isVisible = true;
};

DockAssistant.prototype.setup = function()
{
	this.controller.document.body.className = "dock";
	
	this.loadCurrent =	this.controller.get('loadCurrent');
	this.memCurrent =	this.controller.get('memCurrent');
	
};

DockAssistant.prototype.activate = function(event)
{
	dataHandler.setDockAssistant(this);
	dataHandler.start();
	
	if (this.notFirstActivate)
	{
		
	}
	else
	{
		
	}
	this.notFirstActivate = true;
};
DockAssistant.prototype.deactivate = function(event)
{
};

DockAssistant.prototype.handleCommand = function(event)
{
};

DockAssistant.prototype.cleanup = function(event)
{
	this.controller.stopListening(this.controller.stageController.document, Mojo.Event.stageActivate,   this.visible);
	this.controller.stopListening(this.controller.stageController.document, Mojo.Event.stageDeactivate, this.invisible);
};

// Local Variables:
// tab-width: 4
// End:
