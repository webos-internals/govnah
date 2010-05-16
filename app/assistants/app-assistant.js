// get the cookies
var prefs = new preferenceCookie();

// stage names
var mainStageName = 'govnah-main';
var dashStageName = 'govnah-dash';

var prefs = new preferenceCookie();
var dataHandler = new dataHandlerModel();
var profiles = new profilesModel();

function AppAssistant() {}

AppAssistant.prototype.handleLaunch = function(params)
{
	var mainStageController = this.controller.getStageController(mainStageName);
	
	try
	{
		// launch from launcher tap
		if (!params) 
		{
			dataHandler.closeDash(true);
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
		// relaunch dash
		else if (params.type == 'dash-open')
		{
			dataHandler.openDash(true);
		}
		// launch and return parameters
		else if (params.type == 'get-profiles' && params.returnid != '')
		{
			var profs = [];
			if (profiles.profiles.length > 0)
			{
				for (var p = 0; p < profiles.profiles.length; p++)
				{
					profs.push({id: profiles.profiles[p].id, name: profiles.profiles[p].name});
				}
			}
			var req = new Mojo.Service.Request
			(
				'palm://com.palm.applicationManager',
				{
					method: 'launch',
					parameters:
					{
						id: params.returnid,
						params:
						{
							type: 'govnah-profiles',
							profiles: profs
						}
					}
				}
			);
		}
		else if (params.type == 'set-profile')
		{
			var prof = false;
			if (params.profileid)
			{
				prof = profiles.getProfileFromId(params.profileid);
			}
			else if (params.profilename)
			{
				prof = profiles.getProfileFromName(params.profilename);
			}
			if (prof)
			{
				prof.apply();
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

AppAssistant.prototype.cleanup = function(event)
{
	dataHandler.resetIcon();
	alert('AppAssistant#cleanup');
};


// Local Variables:
// tab-width: 4
// End:
