function DockAssistant()
{
	this.isVisible = true;
};

DockAssistant.prototype.setup = function()
{
	this.controller.document.body.className = "dock";
	
	this.freqRow =			this.controller.get('freqRow');
	this.freqCurrent =		this.controller.get('freqCurrent');
	this.tempRow =			this.controller.get('tempRow');
	this.tempCurrent =		this.controller.get('tempCurrent');
	this.currRow =			this.controller.get('currRow');
	this.currCurrent =		this.controller.get('currCurrent');
	this.loadRow =			this.controller.get('loadRow');
	this.loadCurrent =		this.controller.get('loadCurrent');
	this.memRow =			this.controller.get('memRow');
	this.memCurrent =		this.controller.get('memCurrent');
	
};

DockAssistant.prototype.activate = function(event)
{
	dataHandler.setDockAssistant(this);
	dataHandler.start();
	
	if (this.controller.stageController.setWindowOrientation)
	{
    	this.controller.stageController.setWindowOrientation("free");
	}
	
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
};

// Local Variables:
// tab-width: 4
// End:
