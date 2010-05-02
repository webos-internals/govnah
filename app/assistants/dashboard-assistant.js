function DashboardAssistant()
{
	dataHandler.setDashAssistant(this);
}

DashboardAssistant.prototype.setup = function()
{
	this.dashboardElement =			this.controller.get('dashboard');
	this.dashboardTitleElement =	this.controller.get('dashboardTitle');
	this.dashboardTextElement =		this.controller.get('dashboardText');
	this.iconActionElement =		this.controller.get('iconAction');
	this.textActionElement =		this.controller.get('textAction');
	
	this.dashTapHandler =	this.dashTapped.bindAsEventListener(this);
	
	// to whole thing for tap
	Mojo.Event.listen(this.dashboardElement, Mojo.Event.tap, this.dashTapHandler);
}

DashboardAssistant.prototype.dashTapped = function(event)
{
}

DashboardAssistant.prototype.cleanup = function(event)
{
	Mojo.Event.stopListening(this.dashboardElement, Mojo.Event.tap, this.dashTapHandler);
	dataHandler.closeDash();
}
