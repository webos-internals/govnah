function SettingsCpufreqAssistant()
{
	// setup menu
	this.menuModel =
	{
		visible: true,
		items:
		[
			{
				label: $L("Help"),
				command: 'do-help'
			}
		]
	};
	
	this.governorModel = 
	{
		value: dataHandler.governor,
		choices: []
	};
	
	this.settingsModel = {};
	this.settingsLocation = {};
	
	this.scalingFrequencyChoices = [];
	if (Mojo.Environment.DeviceInfo.modelNameAscii == "Pixi") {
		this.scalingFrequencyChoices.push({label:'122.88 MHz', value:122880});
		this.scalingFrequencyChoices.push({label:'245.76 MHz', value:245760});
		this.scalingFrequencyChoices.push({label:'320.00 MHz', value:320000});
		this.scalingFrequencyChoices.push({label:'480.00 MHz', value:480000});
		this.scalingFrequencyChoices.push({label:'600.00 MHz', value:600000});
	}
	
	this.samplingRates = {min:false, max:false}; 
	
	this.samplingDownChoices = [];
	for (var x = 1; x <= 10; x++)
	{
		this.samplingDownChoices.push({label:x, value:x});
	}
			
	this.percentChoices = [];
	for (var x = 0; x <= 100; x = x + 5)
	{
		this.percentChoices.push({label:x + ' %', value:x});
	}
	
	this.powersaveChoices = [];
	for (var x = 0; x <= 10; x++)
	{
		this.powersaveChoices.push({label:x, value:x});
	}
	for (var x = 20; x <= 1000; x = x + 10)
	{
		this.powersaveChoices.push({label:x, value:x});
	}
			
	this.windowChoices = [];
	for (var x = 1; x <= 10; x++)
	{
		this.windowChoices.push({label:x + " Sec", value:x*1000});
	}
			
};

SettingsCpufreqAssistant.prototype.setup = function()
{
	// setup menu
	this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);

	// setup governor list
	this.controller.setupWidget
	(
		'governor',
		{
			label: $L('Governor')
		},
		this.governorModel
	);
	this.governorChange = this.governorChange.bindAsEventListener(this);
	this.controller.listen('governor', Mojo.Event.propertyChange, this.governorChange);
	
	this.controller.setupWidget
	(
		'saveButton',
		{
			type: Mojo.Widget.activityButton
		},
		{
			buttonLabel: 'Apply Settings'
		}
	);
	this.saveButtonElement = this.controller.get('saveButton');
	this.saveButtonPressed = this.saveButtonPressed.bindAsEventListener(this);
	this.controller.listen('saveButton', Mojo.Event.tap, this.saveButtonPressed);
	
	this.forms = new Array();
	this.forms['standard']  = this.controller.get('governor_freq');
	this.forms['specific']  = this.controller.get('governor_params');

	this.groups = new Array();
	this.groups['standard'] = this.controller.get('frequency_group');
	this.groups['standard'].style.display = 'block';
	this.groups['specific'] = this.controller.get('governor_group');
	this.groups['specific'].style.display = 'none';

	this.onGetParamsStandard  = this.onGetParams.bindAsEventListener(this, "standard");
	this.onGetParamsSpecific  = this.onGetParams.bindAsEventListener(this, "specific");

	this.saveCompleteCpufreq   = this.saveCompleteCpufreq.bindAsEventListener(this);
	
	this.onSetParams = this.onSetParams.bindAsEventListener(this);
	
	this.getRequest = false;
	this.setRequest = false;

	// make it so nothing is selected by default
	this.controller.setInitialFocusedElement(null);

	this.reloadSettings();
};


SettingsCpufreqAssistant.prototype.governorChange = function(event)
{
	//alert('===========');
	//for (e in event) alert(e+' : '+event[e]);
	
	//alert(event.value);
	this.governorModel.value = event.value;
	if (this.setRequest) this.setRequest.cancel();
	this.setRequest = service.set_cpufreq_params(this.onSetParams, [{name:'scaling_governor', value:this.governorModel.value}], []);
};

SettingsCpufreqAssistant.prototype.onSetParams = function(payload)
{
	//alert('===========');
	//for (p in payload) alert(p+' : '+payload[p]);
	
	if (payload.errorCode != undefined) {
		this.errorMessage("Govnah", payload.errorText, payload.stdErr, function(){});
	}

	this.reloadSettings();
};

SettingsCpufreqAssistant.prototype.reloadSettings = function()
{
	this.settingsModel = {};
	this.settingsLocation = {};
	
	if (this.getRequest) this.getRequest.cancel();
	this.getRequest  = service.get_cpufreq_params(this.onGetParamsStandard);
};

SettingsCpufreqAssistant.prototype.onGetParams = function(payload, location)
{
	if (payload.errorCode != undefined) {
		this.errorMessage("Govnah", payload.errorText, payload.stdErr, function(){});
	}
	
	/*
	alert('=========== ' + location);
	for (var p in payload) {
		if (p == "params") {
			alert('params:');
			for (var a = 0; a < payload.params.length; a++) {
				tmpParam = payload.params[a];
				for (var b in tmpParam) {
					alert('    ' + b + " : " + tmpParam[b]);
				}
			}
		} else {
			alert(p+' : '+payload[p]);
		}
	}
	*/
	
	var newHTML = '';
	var newCount = 0;

	if (payload.params)
	{
		// initial loop
		for (var param = 0; param < payload.params.length; param++)
		{
			tmpParam = payload.params[param];
			
			//alert('-----');
			//for (p in tmpParam) alert(p + " : " + tmpParam[p]);

			switch(tmpParam.name)
			{
				case 'scaling_available_governors':
					this.governorModel.choices = [];
					var data = tmpParam.value.split(" ");
					if (data.length > 0)
					{
						for (d = 0; d < data.length; d++)
						{
							var tmpGov = trim(data[d]);
							if (tmpGov != "")
							{
								this.governorModel.choices.push({label:$L(tmpGov), value:tmpGov});
							}
						}
					}
					this.controller.modelChanged(this.governorModel);
					break;
				case 'scaling_governor':
					this.governorModel.value = "";
					this.governorModel.value = trim(tmpParam.value);
					this.controller.modelChanged(this.governorModel);
					break;
				
				case 'scaling_min_freq':
					dataHandler.currentLimits.min = trim(tmpParam.value);
					break;
				
				case 'scaling_max_freq':
					dataHandler.currentLimits.max = trim(tmpParam.value);
					break;
				
				case 'scaling_available_frequencies':
					this.scalingFrequencyChoices = [];
					var data = tmpParam.value.split(" ");
					if (data.length > 0)
					{
						for (d = 0; d < data.length; d++)
						{
							var tmpFreq = parseInt(trim(data[d]));
							if (tmpFreq)
							{
								this.scalingFrequencyChoices.push({label:(tmpFreq/1000) + ' MHz', value:tmpFreq});
							}
						}
					}
					break;
					
				case 'sampling_rate_max':
					this.samplingRates.max = parseInt(trim(tmpParam.value));
					//alert(this.samplingRates.max);
					break;
				case 'sampling_rate_min':
					this.samplingRates.min = parseInt(trim(tmpParam.value));
					//alert(this.samplingRates.min);
					break;
			}
		}
		
		
		// second loop
		for (var param = 0; param < payload.params.length; param++)
		{
			tmpParam = payload.params[param];

			if (tmpParam.writeable && tmpParam.name != 'scaling_governor')
			{
				//alert('-----');
				//for (p in tmpParam) alert(p + " : " + tmpParam[p]);
				
				if (profilesModel.settings[tmpParam.name] && !prefs.get().manualEntry)
				{
					switch(profilesModel.settings[tmpParam.name].type)
					{
						case 'listFreq':
							newHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'settings/listselect-widget'});
							newCount++;
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = location;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: profilesModel.settingLabel(tmpParam.name),
									modelProperty: tmpParam.name,
									choices: this.scalingFrequencyChoices
								},
								this.settingsModel
							);
							break;
						case 'listPcnt':
							newHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'settings/listselect-widget'});
							newCount++;
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = location;

							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: profilesModel.settingLabel(tmpParam.name),
									modelProperty: tmpParam.name,
									choices: this.percentChoices
								},
								this.settingsModel
							);
							break;
						case 'listPowr':
							newHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'settings/listselect-widget'});
							newCount++;
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = location;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: profilesModel.settingLabel(tmpParam.name),
									modelProperty: tmpParam.name,
									choices: this.powersaveChoices
								},
								this.settingsModel
							);
							break;
						case 'listSamp':
							newHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'settings/listselect-widget'});
							newCount++;
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = location;
							var samplingChoices = [];
							if (this.samplingRates.max !== false && this.samplingRates.min !== false)
							{
								for (var s = this.samplingRates.min; s <= 2000000; s = s + 100000)
								{
									var sec = (s / 1000000);
									var display = sec+' Sec';
									samplingChoices.push({label:display, value:s});
								}
								for (var s = 3000000; s <= 10000000; s = s + 1000000)
								{
									var sec = (s / 1000000);
									var display = sec+' Sec';
									samplingChoices.push({label:display, value:s});
								}
								for (var s = 20000000; s <= this.samplingRates.max; s = s + 10000000)
								{
									var min = 0;
									var sec = (s / 1000000);
									if (sec / 60 >= 1)
									{
										min = Math.floor(sec / 60);
										sec = (sec % 60);
									}
									var display = '';
									if (min > 0) display += min+' Min';
									display += ' ';
									if (sec > 0) display += sec+' Sec';
									samplingChoices.push({label:display, value:s});
								}
							}
							else
							{
								samplingChoices.push({label:$L(tmpParam.value), value:tmpParam.value});
							}
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: profilesModel.settingLabel(tmpParam.name),
									modelProperty: tmpParam.name,
									choices: samplingChoices
								},
								this.settingsModel
							);
							break;
						case 'listSampDown':
							newHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'settings/listselect-widget'});
							newCount++;
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = location;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: profilesModel.settingLabel(tmpParam.name),
									modelProperty: tmpParam.name,
									choices: this.samplingDownChoices
								},
								this.settingsModel
							);
							break;
						case 'listMem':
							newHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'settings/listselect-widget'});
							newCount++;
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = location;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: profilesModel.settingLabel(tmpParam.name),
									modelProperty: tmpParam.name,
									choices: this.memoryChoices
								},
								this.settingsModel
							);
							break;
							
						case 'toggleTF':
							newHTML += Mojo.View.render({object: {label:profilesModel.settingLabel(tmpParam.name), id: tmpParam.name}, template: 'settings/toggle-widget'});
							newCount++;
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = location;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
						  			trueLabel: $L('True'),
									trueValue: '1',
						 			falseLabel: $L('False'),
									falseValue: '0',
									modelProperty: tmpParam.name
								},
								this.settingsModel
							);
							break;

						case 'listWindow':
							newHTML += Mojo.View.render({object: {id: tmpParam.name}, template: 'settings/listselect-widget'});
							newCount++;
							this.settingsModel[tmpParam.name] = tmpParam.value;
							this.settingsLocation[tmpParam.name] = location;
							this.controller.setupWidget
							(
								tmpParam.name,
								{
									label: profilesModel.settingLabel(tmpParam.name),
									modelProperty: tmpParam.name,
									choices: this.windowChoices
								},
								this.settingsModel
							);
							break;
					}
				}
				else
				{
					newHTML += Mojo.View.render({object: {label:tmpParam.name.replace(/_/g, " "), id: tmpParam.name}, template: 'settings/textfield-widget'});
					newCount++;
					this.settingsModel[tmpParam.name] = tmpParam.value;
					this.settingsLocation[tmpParam.name] = location;
					this.controller.setupWidget
					(
						tmpParam.name,
						{
							modelProperty: tmpParam.name,
							multiline: false,
							enterSubmits: false,
							changeOnKeyPress: true,
							maxLength: 25,
							textCase: Mojo.Widget.steModeLowerCase,
							focusMode: Mojo.Widget.focusSelectMode,
							modifierState: Mojo.Widget.numLock,
							charsAllow: this.onlyNumbers.bind(this)
						},
						this.settingsModel
					);
				}
			}
		}
	}

	this.forms[location].innerHTML = newHTML;
	this.groups[location].style.display = ((newCount == 0)?'none':'block');
	this.controller.instantiateChildWidgets(this.forms[location]);		
		
	// update form styles so list looks OK
	var rows = this.forms[location].querySelectorAll('div.palm-row');
	for (var r = 0; r < rows.length; r++) {
		if (r == 0) rows[r].className = 'palm-row first';
		else if (r == rows.length-1) rows[r].className = 'palm-row last';
		else rows[r].className = 'palm-row';
	}

	if (location == "standard") {
		if (this.getRequest) this.getRequest.cancel();
		this.getRequest  = service.get_cpufreq_params(this.onGetParamsSpecific, this.governorModel.value);
	}
	else if (location == "specific") {
		if (this.getRequest) this.getRequest.cancel();
		this.getRequest = false;
	}
};

SettingsCpufreqAssistant.prototype.saveButtonPressed = function(event)
{
	//alert('-------');
	//for (var m in this.settingsModel) alert(m+" : "+this.settingsModel[m]);
	//for (var m in this.settingsLocation) alert(m+" : "+this.settingsLocation[m]);
	
	var standardParams = [];
	var specificParams = [];
	
	standardParams.push({name:"scaling_governor", value:this.governorModel.value});

	for (var m in this.settingsModel)
	{
		if (this.settingsLocation[m] == "standard")
		{
			if ((m == "scaling_min_freq") &&
				(parseFloat(this.settingsModel[m]) > parseFloat(dataHandler.currentLimits.max))) {
				alert("newmin: "+this.settingsModel[m]+" greater than oldmax: "+dataHandler.currentLimits.max);
				// Push the max frequency first to allow for the new min
				standardParams.push({name:"scaling_max_freq", value:String(this.settingsModel["scaling_max_freq"])});
			}
			if ((m == "scaling_max_freq") &&
				(parseFloat(this.settingsModel[m]) < parseFloat(dataHandler.currentLimits.min))) {
				alert("newmmax: "+this.settingsModel[m]+" less than oldmin: "+dataHandler.currentLimits.min);
				// Push the min frequency first to allow for the new max
				standardParams.push({name:"scaling_min_freq", value:String(this.settingsModel["scaling_min_freq"])});
			}
			standardParams.push({name:m, value:String(this.settingsModel[m])});
		}
		else if (this.settingsLocation[m] == "specific")
		{
			specificParams.push({name:m, value:String(this.settingsModel[m])});
		}
	}
	
	if (this.setRequest) this.setRequest.cancel();
	this.setRequest = service.set_cpufreq_params(this.saveCompleteCpufreq, standardParams, specificParams);
};

SettingsCpufreqAssistant.prototype.saveCompleteCpufreq = function(payload)
{
	//alert('===========');
	//for (p in payload) alert(p+' : '+payload[p]);
	
	if (payload.errorCode != undefined) {
		this.errorMessage("Govnah", payload.errorText, payload.stdErr, function(){});
	}
	
	this.saveButtonElement.mojo.deactivate();
	//this.reloadSettings();
	this.controller.stageController.popScene();
};

SettingsCpufreqAssistant.prototype.errorMessage = function(title, message, stdErr, okFunction)
{
	if (stdErr && stdErr.length) {
		message = message + '<br>' + stdErr.join('<br>');
	}

	this.controller.showAlertDialog(
	{
		allowHTMLMessage:	true,
		preventCancel:		true,
	    title:				title,
	    message:			message,
	    choices:			[{label:$L("Ok"), value:'ok'}],
	    onChoose:			okFunction.bindAsEventListener(this)
    });
};

SettingsCpufreqAssistant.prototype.activate = function(event)
{
	if (this.controller.stageController.setWindowOrientation)
	{
    	this.controller.stageController.setWindowOrientation("up");
	}
	
	if (this.firstActivate)
	{
		
	}
	this.firstActivate = true;
};
SettingsCpufreqAssistant.prototype.handleCommand = function(event)
{
	if (event.type == Mojo.Event.command)
	{
		switch (event.command)
		{
			case 'do-help':
				this.controller.stageController.pushScene('help');
				break;
		}
	}
};

SettingsCpufreqAssistant.prototype.onlyNumbers = function (charCode)
{
	if (charCode > 47 && charCode < 58) {
		return true;
	}
	return false;
}

SettingsCpufreqAssistant.prototype.cleanup = function(event)
{
	
};



// Local Variables:
// tab-width: 4
// End:
