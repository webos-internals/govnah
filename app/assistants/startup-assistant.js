function StartupAssistant()
{
    // on first start, this message is displayed, along with the current version message from below
    this.firstMessage = $L('Here are some tips for first-timers:<ul><li>We recommend using the WebOS Internals UberKernel</li><li>Please check the Preferences screen for more options</li></ul><b>Note that overclocking your device is likely to void your warranty.<b>');
	
    this.secondMessage = $L('We hope you enjoy being able to take full control over your CPU.<br>Please consider making a <a href=http://www.webos-internals.org/wiki/WebOS_Internals:Site_support>donation</a> if you wish to show your appreciation.');
	
    // on new version start
    this.newMessages =
	[
	 // Don't forget the comma on all but the last entry
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
