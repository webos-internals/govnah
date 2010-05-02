function DashboardAssistant()
{
}

DashboardAssistant.prototype.setup = function()
{
	this.dashboardElement =			this.controller.get('dashboard');
	this.dashboardTitleElement =	this.controller.get('dashboardTitle');
	this.dashboardTextElement =		this.controller.get('dashboardText');
	this.iconActionElement =		this.controller.get('iconAction');
	this.textActionElement =		this.controller.get('textAction');
	this.iconElement = 				this.controller.get('dashboardIcon');
	
	this.dashTapHandler =	this.dashTapped.bindAsEventListener(this);
	Mojo.Event.listen(this.dashboardElement, Mojo.Event.tap, this.dashTapHandler);
	
	dataHandler.setDashAssistant(this);
	dataHandler.rate = parseInt(prefs.get().dashPollSpeed) * 1000;
}

DashboardAssistant.prototype.dashTapped = function(event)
{
}

DashboardAssistant.prototype.cleanup = function(event)
{
	Mojo.Event.stopListening(this.dashboardElement, Mojo.Event.tap, this.dashTapHandler);
	dataHandler.closeDash();
}
