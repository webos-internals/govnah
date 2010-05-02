// get the cookies
var prefs = new preferenceCookie();

// stage names
var mainStageName = 'govnah-main';

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

AppAssistant.updateIcon = function(temp)
{
	try
	{
		var r = new Mojo.Service.Request
		(
			'palm://com.palm.applicationManager',
			{
				method: 'updateLaunchPointIcon',
				parameters:
				{
					launchPointId:	Mojo.appInfo.id + '_default',
					icon:			Mojo.appPath + 'images/icons/icon-' + temp + '.png'
				}
			}
		);
	}
	catch (e)
	{
		Mojo.Log.logException(e, "AppAssistant#updateIcon");
	}
}

// Local Variables:
// tab-width: 4
// End:
