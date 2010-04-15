// get the cookies
var prefs = new preferenceCookie();

// stage names
var mainStageName = 'govnah-main';

function AppAssistant() {}

AppAssistant.prototype.handleLaunch = function(params)
{
	var mainStageController = this.controller.getStageController(mainStageName);
	
	try
	{
		if (!params) 
		{
	        if (mainStageController) 
			{
				mainStageController.popScenesTo('main');
				mainStageController.activate();
			}
			else
			{
				this.controller.createStageWithCallback({name: mainStageName, lightweight: true}, this.launchFirstScene.bind(this));
			}
		}
	}
	catch (e)
	{
		Mojo.Log.logException(e, "AppAssistant#handleLaunch");
	}
};

AppAssistant.prototype.launchFirstScene = function(controller)
{
	controller.pushScene('main');
};

AppAssistant.prototype.cleanup = function() {};

// Local Variables:
// tab-width: 4
// End:
