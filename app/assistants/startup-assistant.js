function StartupAssistant()
{
    // on first start, this message is displayed, along with the current version message from below
    this.firstMessage = $L('Here are some tips for first-timers:<ul><li>We recommend using the WebOS Internals UberKernel</li><li>Please check the Preferences screen for more options</li></ul><b>Note that overclocking your device is likely to void your warranty.<b>');
	
    this.secondMessage = $L('We hope you enjoy being able to take full control over your CPU.<br>Please consider making a <a href=http://www.webos-internals.org/wiki/WebOS_Internals:Site_support>donation</a> if you wish to show your appreciation.');
	
    // on new version start
    this.newMessages =
	[
	 // Don't forget the comma on all but the last entry
	 { version: '0.6.6',log: [ 'Added profile support for the voltage selection parameters'] },
	 { version: '0.6.4',log: [ 'Added profile support for the cpufreq override module'] },
	 { version: '0.6.3',log: [ 'Initial support for the cpufreq override module'] },
	 { version: '0.6.1',log: [ 'Rolled up all the 0.5.x alpha releases into a new public release',
				   'Major new features include current monitoring, and a revamped Advanced Settings screen now located in the Profiles area'] },
	 { version: '0.5.9',log: [ 'Renamed the battery current display and inverted the polarity again',
				   'Disabled the compcache settings scene if compcache is not available'] },
	 { version: '0.5.8',log: [ 'Fixed memory leak, suspected of causing the eventual hang bug'] },
	 { version: '0.5.7',log: [ 'Revamped current draw display, including inverting the polarity',
				   'Added io schedulers and tcp congestion control (no profile support yet)'] },
	 { version: '0.5.6',log: [ 'Improved current graphing on main screen'] },
	 { version: '0.5.5',log: [ 'First pass at adding current monitoring support'] },
	 { version: '0.5.0',log: [ 'Rolled up all the 0.4.x alpha releases into a new public release',
				   'Major new features include Pixi support, memory reporting and compcache configuration'] },
	 { version: '0.4.17',log: [ 'Added Compcache configuration to saved profiles'] },
	 { version: '0.4.16',log: [ 'Fixed the obscure bug in applying a profile ' +
				    '(new min greater than current max, new max less than current min)'] },
	 { version: '0.4.15',log: [ 'Added the UberKernel Default profile'] },
	 { version: '0.4.14',log: [ 'Fixed the duplicate profiles bug'] },
	 { version: '0.4.13',log: [ 'Set the Palm Default profile back to 600MHz max'] },
	 { version: '0.4.12',log: [ 'Added getProfiles and setProfile methods to the service'] },
	 { version: '0.4.11',log: [ 'Updates settings screen after settings are applied',
				    'Fixed serious bug in compcache enable handling',
				    'Fixed some obscure error cases ' +
				    '(new min greater than current max, new max less than current min)'] },
	 { version: '0.4.10',log: [ 'Updates main screen values whenever the card is activated',
				    'New visually segmented advanced settings screen' ] },
	 { version: '0.4.9', log: [ 'Fixed the profile save bug, please recreate any custom profiles',
				    'Added support in the service for sticky compcache settings'] },
	 { version: '0.4.8', log: [ 'Robustified parameter display and profile handling' ] },
	 { version: '0.4.7', log: [ 'Added Pixi temperature and available frequency support',
				    'Created default and fixed speed 600 profiles for Pixi'] },
	 { version: '0.4.6', log: [ 'Now detects whether configurable compcache support is available' ] },
	 { version: '0.4.5', log: [ 'Added error reporting for compcache configuration' ] },
	 { version: '0.4.4', log: [ 'Report correct compcache memory limit' ] },
	 { version: '0.4.3', log: [ 'Added memory usage and compcache control' ] },
	 { version: '0.4.2', log: [ 'Fixed the unknown profile problem' ] },
	 { version: '0.4.1', log: [ 'Added the startup splash screen and some initial default profiles' ] },
	 { version: '0.4.0', log: [ 'Select a profile to have it automatically reapplied on each clean reboot' ] },
	 { version: '0.3.1', log: [ 'Added support for launch parameters',
				    'Fixed ignore_nice_load always shows true on profile screen bug' ] },
	 { version: '0.3.0', log: [ 'Added support for profiles' ] },
	 { version: '0.2.5', log: [ 'Now only stores the latest 5 minutes of temperature data in memory' ] },
	 { version: '0.2.4', log: [ 'Graphing updates' ] },
	 { version: '0.2.3', log: [ 'Initial full-screen graphs' ] },
	 { version: '0.2.2', log: [ 'Major graphing overhaul' ] },
	 { version: '0.1.4', log: [ 'Fixed governor-specific controls, and added loadavg to the service' ] },
	 { version: '0.1.3', log: [ 'Initial version that is able to make changes' ] },
	 { version: '0.1.2', log: [ 'Update current governor on activate' ] },
	 { version: '0.1.1', log: [ 'Display of current governor and frequency' ] },
	 { version: '0.1.0', log: [ 'Fleshed out all the service methods' ] },
	 { version: '0.0.7', log: [ 'Better graphing' ] },
	 { version: '0.0.6', log: [ 'Added periodic updating when the app is open' ] },
	 { version: '0.0.5', log: [ 'First Public Release' ] }
	 ];
	
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
	
    // setup command menu
    this.cmdMenuModel =
	{
	    visible: false, 
	    items:
	    [
    {},
    {
	label: $L("Ok, I've read this. Let's continue ..."),
	command: 'do-continue'
    },
    {}
	     ]
	};
};

StartupAssistant.prototype.setup = function()
{
    // set theme because this can be the first scene pushed
    this.controller.document.body.className = prefs.get().theme;
	
    // get elements
    this.titleContainer = this.controller.get('title');
    this.dataContainer =  this.controller.get('data');
	
    // set title
    if (vers.isFirst) {
	this.titleContainer.innerHTML = $L('Welcome To Govnah');
    }
    else if (vers.isNew) {
	this.titleContainer.innerHTML = $L('Govnah Changelog');
    }
	
	
    // build data
    var html = '';
    if (vers.isFirst) {
	html += '<div class="text">' + this.firstMessage + '</div>';
    }
    if (vers.isNew) {
	html += '<div class="text">' + this.secondMessage + '</div>';
	for (var m = 0; m < this.newMessages.length; m++) {
	    html += Mojo.View.render({object: {title: 'v' + this.newMessages[m].version}, template: 'startup/changeLog'});
	    html += '<ul>';
	    for (var l = 0; l < this.newMessages[m].log.length; l++) {
		html += '<li>' + this.newMessages[m].log[l] + '</li>';
	    }
	    html += '</ul>';
	}
    }
    
    // set data
    this.dataContainer.innerHTML = html;
	
	
    // setup menu
    this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
	
    // set command menu
    this.controller.setupWidget(Mojo.Menu.commandMenu, { menuClass: 'no-fade' }, this.cmdMenuModel);
	
    // set this scene's default transition
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade);
};

StartupAssistant.prototype.activate = function(event)
{
    // start continue button timer
    this.timer = this.controller.window.setTimeout(this.showContinue.bind(this), 5 * 1000);
};

StartupAssistant.prototype.showContinue = function()
{
    // show the command menu
    this.controller.setMenuVisible(Mojo.Menu.commandMenu, true);
};

StartupAssistant.prototype.handleCommand = function(event)
{
    if (event.type == Mojo.Event.command) {
	switch (event.command) {
	case 'do-continue':
	this.controller.stageController.swapScene({name: 'main', transition: Mojo.Transition.crossFade});
	break;
			
	case 'do-prefs':
	this.controller.stageController.pushScene('preferences');
	break;
			
	case 'do-help':
	this.controller.stageController.pushScene('help');
	break;
	}
    }
}
