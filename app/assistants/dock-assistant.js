function DockAssistant()
{
	this.isVisible = false;
};

DockAssistant.prototype.setup = function()
{
	this.controller.document.body.className = "dock";
	
};

DockAssistant.prototype.activate = function(event)
{
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
DockAssistant.prototype.visible = function(event)
{
	if (!this.isVisible)
	{
		this.isVisible = true;
	}
};
DockAssistant.prototype.invisible = function(event)
{
	this.isVisible = false;
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
