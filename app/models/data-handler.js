function dataHandlerModel()
{
	
	this.mainAssistant = false;
	this.graphAssistant = false;
	this.dashAssistant = false;
	
	this.currentMode = "card";
	
	this.governor = false;
	this.profile = false;
	this.settingsStandard = [];
	this.settingsSpecific = [];
	
	this.iconDirty = false;
	
	this.lineData = $H();
	this.barData = {};
	
	this.timer = false;
	this.rate = parseInt(prefs.get().cardPollSpeed) * 1000;
	this.cutoff = 300;
	
	this.timerHandler = this.timerFunction.bind(this);
	
	this.tempHandler =  this.tempHandler.bindAsEventListener(this);
    this.freqHandler =  this.freqHandler.bindAsEventListener(this);
    this.loadHandler =  this.loadHandler.bindAsEventListener(this);
    this.timeHandler =  this.timeHandler.bindAsEventListener(this);
    this.transHandler = this.transHandler.bindAsEventListener(this);
	
	this.tempGraph = false;
	this.freqGraph = false;
	this.loadGraph = false;
	this.timeGraph = false;
	
	this.fullGraph = false;
	
	
	//service.get_trans_table(this.transHandler);
	//service.get_total_trans(this.transHandler);
	
    this.getParamsHandler1 = this.getParamsHandler.bindAsEventListener(this, 1);
    this.getParamsHandler2 = this.getParamsHandler.bindAsEventListener(this, 2);
	
	//this.updateParams();
	
};

dataHandlerModel.prototype.start = function()
{
	//this.timer = setInterval(this.timerHandler, this.rate);
	this.timerHandler();
};

dataHandlerModel.prototype.setMainAssistant = function(assistant)
{
	this.mainAssistant = assistant;
	this.currentMode = "card";
	this.rate = parseInt(prefs.get().cardPollSpeed) * 1000;
	
	
	this.tempGraph = new lineGraph
	(
		this.mainAssistant.controller.get('tempCanvas'),
		{
			renderWidth: 320,
			renderHeight: 30
		}
	)
	this.freqGraph = new lineGraph
	(
		this.mainAssistant.controller.get('freqCanvas'),
		{
			renderWidth: 320,
			renderHeight: 30
		}
	);
	this.loadGraph = new lineGraph
	(
		this.mainAssistant.controller.get('loadCanvas'),
		{
			renderWidth: 320,
			renderHeight: 30
		}
	);
	this.timeGraph = new barGraph
	(
		this.mainAssistant.controller.get('timeCanvas'),
		{
			height: 27,
			width: 320
		}
	);
}
dataHandlerModel.prototype.setGraphAssistant = function(assistant)
{
	this.graphAssistant = assistant;
	
	this.fullGraph = new lineGraph
	(
		this.graphAssistant.controller.get('graphCanvas'),
		{
			renderWidth: 320,
			renderHeight: 452,
			padding:
			{
				top:	52,
				bottom:	30,
				left:	50
			}
		}
	);
}
dataHandlerModel.prototype.setDashAssistant = function(assistant)
{
	this.dashAssistant = assistant;
	this.currentMode = "dash";
	this.rate = parseInt(prefs.get().dashPollSpeed) * 1000;
}

dataHandlerModel.prototype.updateParams = function(num)
{
	if (!num)
	{
		this.governor = false;
		this.profile = false;
		this.settingsStandard = [];
		this.settingsSpecific = [];
		
		if (this.mainAssistant && this.mainAssistant.controller)
		{
			//this.mainAssistant.profileCurrent.innerHTML = '...';
			//this.mainAssistant.governorCurrent.innerHTML = '...';
		}
		
		service.get_cpufreq_params(this.getParamsHandler1);
	}
	else if (num == 1)
	{
		service.get_cpufreq_params(this.getParamsHandler2, this.governor);
	}
	else if (num == 2)
	{
		this.profile = profiles.findProfile(this.governor, this.settingsStandard, this.settingsSpecific);
		if (this.mainAssistant && this.mainAssistant.controller)
		{
			if (this.profile)
			{
				this.mainAssistant.profileCurrent.innerHTML = this.profile.name;
			}
			else
			{
				this.mainAssistant.profileCurrent.innerHTML = '<span class="unknown">Unknown</span>';
			}
		}
	}
}
dataHandlerModel.prototype.getParamsHandler = function(payload, num)
{
	if (payload.params)
	{
		for (var param = 0; param < payload.params.length; param++)
		{
			tmpParam = payload.params[param];
			
			if (tmpParam.name == 'scaling_governor')
			{
				this.governor = trim(tmpParam.value);
				if (this.mainAssistant && this.mainAssistant.controller)
				{
					this.mainAssistant.governorCurrent.innerHTML = this.governor;
				}
			}
			else if (tmpParam.writeable)
			{
				if (num == 1)
				{
					this.settingsStandard.push({name:tmpParam.name, value:String(tmpParam.value)});
				}
				else if (num == 2)
				{
					this.settingsSpecific.push({name:tmpParam.name, value:String(tmpParam.value)});
				}
			}
		}
	}
	else
	{
		//error
	}
	
	this.updateParams(num);
	
};

dataHandlerModel.prototype.openDash = function(skipBanner)
{
	try
	{
		Mojo.Controller.appController.removeBanner('govnahBanner');
		if (!skipBanner)
		{
			Mojo.Controller.appController.showBanner
			(
				{
					icon: 'icon.png',
					messageText: "Govnah: Opening Dashboard",
					soundClass: ""
				},
				{
					type: 'dash-close'
				},
				'govnahBanner'
			);
		}
		
		this.dashController = Mojo.Controller.appController.getStageController(dashStageName);
	    if (this.dashController) 
		{
			
		}
		else
		{
			Mojo.Controller.appController.createStageWithCallback({name: dashStageName, lightweight: true}, this.openDashCallback.bind(this), "dashboard");
		}
	}
	catch (e)
	{
		Mojo.Log.logException(e, "dataHandlerModel#openDash");
	}
}
dataHandlerModel.prototype.openDashCallback = function(controller)
{
	controller.pushScene('dashboard', this);
}
dataHandlerModel.prototype.closeDash = function(skipBanner)
{
	Mojo.Controller.appController.removeBanner('govnahBanner');
	if (!skipBanner)
	{
		Mojo.Controller.appController.showBanner
		(
			{
				icon: 'icon.png',
				messageText: "Closing Dashboard - Tap To Cancel",
				soundClass: ""
			},
			{
				type: 'dash-open'
			},
			'govnahBanner'
		);
	}
	else
	{
		if (this.dashAssistant && this.dashAssistant.controller)
		{
			this.dashAssistant.skipClose = true;
		}
	}
	Mojo.Controller.appController.closeStage(dashStageName);
}

dataHandlerModel.prototype.timerFunction = function()
{

	var keys = this.lineData.keys();
	if (keys.length > this.cutoff)
	{
		for (var k = 0; k < keys.length - this.cutoff; k++)
		{
			this.lineData.unset(keys[k]);
		}
	}
	
	this.renderGraph();
	
	service.get_omap34xx_temp(this.tempHandler);
	
	if (this.currentMode == "card")
	{ // we really only need these when in card mode...
		service.get_scaling_cur_freq(this.freqHandler);
		service.get_proc_loadavg(this.loadHandler);
		service.get_time_in_state(this.timeHandler);
	}
	
	this.timer = setTimeout(this.timerHandler, this.rate);
};

dataHandlerModel.prototype.tempHandler = function(payload)
{
	if (payload.returnValue) 
	{
		var timestamp = Math.round(new Date().getTime()/1000.0);
		var value = parseInt(payload.value);
		
		this.updateIcon(value);
		if (this.mainAssistant && this.mainAssistant.controller && this.mainAssistant.isVisible)
		{
			this.mainAssistant.iconElement.className = 'icon temp-' + value;
			this.mainAssistant.tempCurrent.innerHTML = value + '<div class="unit">&deg;C</div>';
		}
		if (this.dashAssistant && this.dashAssistant.controller && this.dashAssistant.isVisible)
		{
			this.dashAssistant.iconElement.className = 'palm-dashboard-icon temp-' + value;
		}
		
		var dataObj = this.lineData.get(timestamp)
		if (!dataObj) dataObj = {};
		if (!dataObj.temp)
		{
			dataObj.temp = {total:value, count:1, value:value};
		}
		if (dataObj.temp && dataObj.temp.count)
		{
			dataObj.temp.total = dataObj.temp.total + value;
			dataObj.temp.count++;
			dataObj.temp.value = (dataObj.temp.total / dataObj.temp.count);
		}
		this.lineData.set(timestamp, dataObj);
	}
};
dataHandlerModel.prototype.freqHandler = function(payload)
{
	if (payload.returnValue) 
	{
		var timestamp = Math.round(new Date().getTime()/1000.0);
		var value = parseInt(payload.value);
	
		if (this.mainAssistant && this.mainAssistant.controller && this.mainAssistant.isVisible)
		{
			this.mainAssistant.freqCurrent.innerHTML = (value / 1000) + '<div class="unit">MHz</div>';
		}
		
		var dataObj = this.lineData.get(timestamp)
		if (!dataObj) dataObj = {};
		if (!dataObj.freq)
		{
			dataObj.freq = {total:value, count:1, value:value};
		}
		if (dataObj.freq && dataObj.freq.count)
		{
			dataObj.freq.total = dataObj.freq.total + value;
			dataObj.freq.count++;
			dataObj.freq.value = (dataObj.freq.total / dataObj.freq.count);
		}
		this.lineData.set(timestamp, dataObj);
	}
}
dataHandlerModel.prototype.loadHandler = function(payload)
{
	if (payload.returnValue) 
	{
		var timestamp = Math.round(new Date().getTime()/1000.0);
		var valueArray = String(payload.stdOut).split(' ');
		var value1 =  parseFloat(trim(valueArray[0]));
		var value5 =  parseFloat(trim(valueArray[1]));
		var value15 = parseFloat(trim(valueArray[2]));
		
		if (this.mainAssistant && this.mainAssistant.controller && this.mainAssistant.isVisible)
		{
			this.mainAssistant.loadCurrent.innerHTML = value1 + ' ' + value5 + ' ' + value15;
		}
		
		var dataObj = this.lineData.get(timestamp)
		if (!dataObj) dataObj = {};
		if (!dataObj.load)
		{
			dataObj.load = {total1:  value1,  count1:  1, value1:  value1,
							total5:  value5,  count5:  1, value5:  value5,
							total15: value15, count15: 1, value15: value15};
		}
		if (dataObj.load && dataObj.load.count1)
		{
			dataObj.load.total1 =  dataObj.load.total1  + value1;
			dataObj.load.total5 =  dataObj.load.total5  + value5;
			dataObj.load.total15 = dataObj.load.total15 + value15;
			dataObj.load.count1++;
			dataObj.load.count5++;
			dataObj.load.count15++;
			dataObj.load.value1 =  (dataObj.load.total1  / dataObj.load.count1);
			dataObj.load.value5 =  (dataObj.load.total5  / dataObj.load.count5);
			dataObj.load.value15 = (dataObj.load.total15 / dataObj.load.count15);
		}
		this.lineData.set(timestamp, dataObj);
	}
}
dataHandlerModel.prototype.timeHandler = function(payload)
{
	if (payload.returnValue) 
	{
		var dataHash = $H();
		var valueArray = String(payload.stdOut).split(',');
		for (var v = 0; v < valueArray.length; v++)
		{
			if (valueArray[v])
			{
				var dataArray = valueArray[v].split(' ');
				dataHash.set(parseInt(dataArray[0]), parseInt(dataArray[1]));
			}
		}
		this.barData.time = dataHash;
	}
}
dataHandlerModel.prototype.transHandler = function(payload)
{
	if (payload.returnValue) 
	{
		
	}
	
	alert('===============');
	for (var p in payload) alert(p+' : '+payload[p]);
	alert('===============');
}

dataHandlerModel.prototype.updateIcon = function(temp)
{
	if ((this.currentMode == "card" && prefs.get().cardIconUpdate) ||
		(this.currentMode == "dash" && prefs.get().dashIconUpdate))
	{
		this.iconDirty = true;
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
	else if (this.iconDirty)
	{
		this.iconDirty = false;
		this.resetIcon();
	}
}
dataHandlerModel.prototype.resetIcon = function()
{
	var r = new Mojo.Service.Request
	(
		'palm://com.palm.applicationManager',
		{
			method: 'updateLaunchPointIcon',
			parameters:
			{
				launchPointId:	Mojo.appInfo.id + '_default',
				icon:			Mojo.appPath + 'icon.png'
			}
		}
	);
}

dataHandlerModel.prototype.renderGraph = function()
{

	if (this.mainAssistant && this.mainAssistant.controller && this.mainAssistant.isVisible)
	{
		this.tempGraph.clearLines();
		this.freqGraph.clearLines();
		this.loadGraph.clearLines();
		
		var tempData = [];
		var freqData = [];
		var loadData = [];
		
		var avg = 1;
		var points = 80;
		
		var keys = this.lineData.keys();
		var start = 0;
		if (keys.length > points) start = keys.length - points;
		for (var k = start; k < keys.length; k++)
		{
			var dataObj = this.lineData.get(keys[k]);
			
			if (dataObj.temp)
				tempData.push({x: keys[k], y: dataObj.temp.value});
			
			if (dataObj.freq)
				freqData.push({x: keys[k], y: dataObj.freq.value});
			
			if (dataObj.load)
				loadData.push({x: keys[k], y: dataObj.load.value1});
		}
		
		var minX = Math.round(new Date().getTime()/1000.0) - (points * (this.rate / 1000));
		this.tempGraph.options.xaxis.min = minX;
		this.freqGraph.options.xaxis.min = minX;
		this.loadGraph.options.xaxis.min = minX;
		
		this.tempGraph.addLine({data: tempData, stroke: "rgba(153, 205, 153, .4)", fill: "rgba(153, 205, 153, .2)"});
		this.freqGraph.addLine({data: freqData, stroke: "rgba(255, 153, 153, .4)", fill: "rgba(255, 153, 153, .2)"});
		this.loadGraph.addLine({data: loadData, stroke: "rgba(153, 153, 255, .4)", fill: "rgba(153, 153, 255, .2)"});
		
		this.tempGraph.render();
		this.freqGraph.render();
		this.loadGraph.render();
		
		var timeData = [];
		
		if (this.barData.time)
		{
			var keys = this.barData.time.keys();
			for (var k = 0; k < keys.length; k++)
			{
				var value = this.barData.time.get(keys[k]);
				timeData.push({key: keys[k], value: value});
			}
		
			this.timeGraph.setData(timeData, {strokeStyle: "rgba(153, 153, 153, .4)", fillStyle: "rgba(153, 153, 153, .2)"});
			
			this.timeGraph.render();
		}
	}
	
	
	
	if (this.graphAssistant && this.graphAssistant.controller && this.graphAssistant.isVisible)
	{
		this.fullGraph.clearLines();
		
		var fullData =  [];
		var fullData2 = [];
		var fullData3 = [];
		
		var avg = 1;
		
		var keys = this.lineData.keys();
		for (var k = 0; k < keys.length; k++)
		{
			var dataObj = this.lineData.get(keys[k]);
			
			if (dataObj.temp && this.graphAssistant.display == "temp")
				fullData.push({x: keys[k], y: dataObj.temp.value});
			
			if (dataObj.freq && this.graphAssistant.display == "freq")
				fullData.push({x: keys[k], y: dataObj.freq.value});
			
			if (dataObj.load && this.graphAssistant.display == "load")
			{
				fullData.push({x: keys[k], y: dataObj.load.value1});
				fullData2.push({x: keys[k], y: dataObj.load.value5});
				fullData3.push({x: keys[k], y: dataObj.load.value15});
			}
		}
		
		if (this.graphAssistant.display == "temp")
			this.fullGraph.addLine({data: fullData, stroke: "rgba(153, 205, 153, .4)", fill: "rgba(153, 205, 153, .2)"});
		
		if (this.graphAssistant.display == "freq")
			this.fullGraph.addLine({data: fullData, stroke: "rgba(205, 153, 153, .4)", fill: "rgba(205, 153, 153, .2)"});
		
		if (this.graphAssistant.display == "load")
		{
			this.fullGraph.addLine({data: fullData3, stroke: "rgba(75, 75, 205, .4)"});
			this.fullGraph.addLine({data: fullData2, stroke: "rgba(105, 105, 205, .4)"});
			this.fullGraph.addLine({data: fullData, stroke: "rgba(135, 135, 205, .4)", fill: "rgba(135, 135, 205, .2)"});
		}
				
		this.fullGraph.render();
	}
	
	
	
};



// Local Variables:
// tab-width: 4
// End:
