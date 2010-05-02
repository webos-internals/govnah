// get the cookies
var prefs = new preferenceCookie();

// stage names
var mainStageName = 'govnah-main';
var dashStageName = 'govnah-dash';

var prefs = new preferenceCookie();
var dataHandler = new dataHandlerModel();

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
		else if (params.type == 'dash-open')
		{
			dataHandler.openDash(true);
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

AppAssistant.prototype.cleanup = function(event)
{
	alert('AppAssistant#cleanup');
};


// Local Variables:
// tab-width: 4
// End:
