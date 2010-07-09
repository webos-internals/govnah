function dataHandlerModel()
{
	
	this.mainAssistant = false;
	this.graphAssistant = false;
	this.dashAssistant = false;
	
	this.currentMode = "card";
	
	this.updatingParams = false;
	
	this.governor = false;
	this.profile = false;
	this.settingsStandard = [];
	this.settingsSpecific = [];
	this.settingsCompcache = [];
	
	this.currentLimits = {min:false, max:false}; 
	
	this.iconDirty = false;
	
	this.lineData = $H();
	this.barData = {};
	
	this.timer = false;
	this.rate = parseInt(prefs.get().cardPollSpeed) * 1000;
	this.cutoff = 300;
	
	this.timerHandler = this.timerFunction.bind(this);
	
    this.tempHandler  = this.tempHandler.bindAsEventListener(this);
    this.freqHandler  = this.freqHandler.bindAsEventListener(this);
    this.loadHandler  = this.loadHandler.bindAsEventListener(this);
    this.memHandler   = this.memHandler.bindAsEventListener(this);
    this.stateHandler = this.stateHandler.bindAsEventListener(this);
    this.currHandler = this.currHandler.bindAsEventListener(this);
	
	this.graphs = $H();
	this.graphs["temp"] = false;
	this.graphs["freq"] = false;
	this.graphs["load"] = false;
	this.graphs["mem"] = false;
	this.graphs["state"] = false;
	this.graphs["curr"] = false;
	
	this.strokes = $H();
	this.strokes["temp"]  = "rgba(153, 205, 153, .4)";
	this.strokes["freq"]  = "rgba(255, 153, 153, .4)";
	this.strokes["load"]  = "rgba(153, 153, 255, .4)";
	this.strokes["mem"]   = "rgba(153, 153, 255, .4)";
	this.strokes["state"] = "rgba(153, 153, 153, .4)";
	this.strokes["curr"]  = "rgba(153, 205, 153, .4)";

	this.fills = $H();
	this.fills["temp"]    = "rgba(153, 205, 153, .2)";
	this.fills["freq"]    = "rgba(255, 153, 153, .2)";
	this.fills["load"]    = "rgba(153, 153, 255, .2)";
	this.fills["mem"]     = "rgba(153, 153, 255, .2)";
	this.fills["state"]   = "rgba(153, 153, 153, .2)";
	this.fills["curr"]    = "rgba(153, 205, 153, .2)";

	this.tempReq  = false;
	this.freqReq  = false;
	this.loadReq  = false;
	this.memReq   = false;
	this.stateReq = false;
	this.currReq = false;
	
	this.fullGraph = false;
	
    this.getParamsStandard  = this.getParamsHandler.bindAsEventListener(this, 1);
    this.getParamsSpecific  = this.getParamsHandler.bindAsEventListener(this, 2);
    this.getParamsCompcache = this.getParamsHandler.bindAsEventListener(this, 3);
	
};

dataHandlerModel.prototype.start = function()
{
	this.timerHandler();
};

dataHandlerModel.prototype.setMainAssistant = function(assistant)
{
	this.mainAssistant = assistant;
	this.currentMode = "card";
	this.rate = parseInt(prefs.get().cardPollSpeed) * 1000;
	
	this.graphs["temp"] = new lineGraph
	(
		this.mainAssistant.controller.get('tempCanvas'),
		{
			renderWidth: 320,
			renderHeight: 30
		}
	);
	this.graphs["freq"] = new lineGraph
	(
		this.mainAssistant.controller.get('freqCanvas'),
		{
			renderWidth: 320,
			renderHeight: 30
		}
	);
	this.graphs["load"] = new lineGraph
	(
		this.mainAssistant.controller.get('loadCanvas'),
		{
			renderWidth: 320,
			renderHeight: 30
		}
	);
	this.graphs["mem"] = new lineGraph
	(
		this.mainAssistant.controller.get('memCanvas'),
		{
			renderWidth: 320,
			renderHeight: 30
		}
	);
	this.graphs["state"] = new barGraph
	(
		this.mainAssistant.controller.get('stateCanvas'),
		{
			height: 27,
			width: 320
		}
	);
	this.graphs["curr"] = new lineGraph
	(
		this.mainAssistant.controller.get('currCanvas'),
		{
			renderWidth: 320,
			renderHeight: 30
		}
	);
};
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
};
dataHandlerModel.prototype.setDashAssistant = function(assistant)
{
	this.dashAssistant = assistant;
	this.currentMode = "dash";
	this.rate = parseInt(prefs.get().dashPollSpeed) * 1000;
};

dataHandlerModel.prototype.updateParams = function(num)
{
	if (!num)
	{
		if (!this.updatingParams)
		{
			this.updatingParams = true;
			
			this.governor = false;
			this.profile = false;
			this.settingsStandard = [];
			this.settingsSpecific = [];
			this.settingsCompcache = [];
			
			service.get_cpufreq_params(this.getParamsStandard);
		}
	}
	else if (num == 1)
	{
		service.get_cpufreq_params(this.getParamsSpecific, this.governor);
	}
	else if (num == 2)
	{
		service.get_compcache_config(this.getParamsCompcache);
	}
	else if (num == 3)
	{
		this.profile = profiles.findProfile(this.governor,
											this.settingsStandard,
											this.settingsSpecific,
											this.settingsCompcache);
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
		
		this.updatingParams = false;
	}
};
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
					if (tmpParam.name == 'scaling_min_freq') {
						this.currentLimits.min = trim(tmpParam.value);
					}
					if (tmpParam.name == 'scaling_max_freq') {
						this.currentLimits.max = trim(tmpParam.value);
					}
					this.settingsStandard.push({name:tmpParam.name, value:String(tmpParam.value)});
				}
				else if (num == 2)
				{
					this.settingsSpecific.push({name:tmpParam.name, value:String(tmpParam.value)});
				}
				else if (num == 3)
				{
					this.settingsCompcache.push({name:tmpParam.name, value:String(tmpParam.value)});
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
};
dataHandlerModel.prototype.openDashCallback = function(controller)
{
	controller.pushScene('dashboard', this);
};
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
};

dataHandlerModel.prototype.delayedTimer = function(delay)
{
	if (this.timer) clearTimeout(this.timer);
	this.timer = setTimeout(this.timerHandler, delay);
}

dataHandlerModel.prototype.timerFunction = function()
{
	if (this.tempReq)  this.tempReq.cancel();
	if (this.freqReq)  this.freqReq.cancel();
	if (this.loadReq)  this.loadReq.cancel();
	if (this.memReq)   this.memReq.cancel();
	if (this.stateReq) this.stateReq.cancel();
	if (this.currReq)  this.currReq.cancel();

	var keys = this.lineData.keys();
	if (keys.length > this.cutoff)
	{
		for (var k = 0; k < keys.length - this.cutoff; k++)
		{
			this.lineData.unset(keys[k]);
		}
	}
	
	if (Mojo.Environment.DeviceInfo.modelNameAscii == "Pixi") {
		this.tempReq = service.get_tmp105_temp(this.tempHandler);
	}
	else {
		this.tempReq = service.get_omap34xx_temp(this.tempHandler);
	}
	
	if (this.currentMode == "card")
	{ // we really only need these when in card mode...
		this.freqReq  = service.get_scaling_cur_freq(this.freqHandler);
		this.loadReq  = service.get_proc_loadavg(this.loadHandler);
		this.memReq   = service.get_proc_meminfo(this.memHandler);
		this.stateReq = service.get_time_in_state(this.stateHandler);
		this.currReq  = service.get_curr(this.currHandler);
	}
	
	this.delayedTimer(this.rate);
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

	this.renderMiniLine("temp");
	this.renderFullGraph("temp");
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

	this.renderMiniLine("freq");
	this.renderFullGraph("freq");
};
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

	this.renderMiniLine("load");
	this.renderFullGraph("load");
};
dataHandlerModel.prototype.memHandler = function(payload)
{
	if (payload.returnValue) 
	{
		var timestamp = Math.round(new Date().getTime()/1000.0);
		var MemTotal = 0;
		var MemFree = 0;
		var SwapTotal = 0;
		var SwapFree = 0;
		for (var line = 0; line < payload.stdOut.length; line++) {
			var items = payload.stdOut[line].split(":");
			if (items[0] == "MemTotal") {
				MemTotal = parseInt(items[1]);
			}
			else if (items[0] == "MemFree") {
				MemFree = parseInt(items[1]);
			}
			else if (items[0] == "SwapTotal") {
				SwapTotal = parseInt(items[1]);
			}
			else if (items[0] == "SwapFree") {
				SwapFree = parseInt(items[1]);
			}
		}
		var value = MemTotal - MemFree + SwapTotal - SwapFree;
		
		if (this.mainAssistant && this.mainAssistant.controller && this.mainAssistant.isVisible)
		{
			this.mainAssistant.memCurrent.innerHTML = Math.floor((MemTotal-MemFree)/1024) + " / " + Math.floor((SwapTotal-SwapFree)/1024) + '<div class="unit">MB</div>';
		}
		
		var dataObj = this.lineData.get(timestamp)
		if (!dataObj) dataObj = {};
		if (!dataObj.mem)
		{
			dataObj.mem =  {total:  value,  count:  1, value:  value};
		}
		if (dataObj.mem && dataObj.mem.count)
		{
			dataObj.mem.total =  dataObj.mem.total  + value;
			dataObj.mem.count++;
			dataObj.mem.value =  (dataObj.mem.total  / dataObj.mem.count);
		}
		this.lineData.set(timestamp, dataObj);
	}

	this.renderMiniLine("mem");
	this.renderFullGraph("mem");
};
dataHandlerModel.prototype.stateHandler = function(payload)
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
		this.barData.state = dataHash;
	}

	this.renderMiniBar("state");
	this.renderFullGraph("state");
};
dataHandlerModel.prototype.currHandler = function(payload)
{
	if (payload.returnValue) 
	{
		var timestamp = Math.round(new Date().getTime()/1000.0);
		var value = parseInt(payload.value);
	
		if (this.mainAssistant && this.mainAssistant.controller && this.mainAssistant.isVisible)
		{
			this.mainAssistant.currCurrent.innerHTML = (value / 1000) + '<div class="unit">mA</div>';
		}
		
		var dataObj = this.lineData.get(timestamp)
		if (!dataObj) dataObj = {};
		if (!dataObj.curr)
		{
			dataObj.curr = {total:value, count:1, value:value};
		}
		if (dataObj.curr && dataObj.curr.count)
		{
			dataObj.curr.total = dataObj.curr.total + value;
			dataObj.curr.count++;
			dataObj.curr.value = (dataObj.curr.total / dataObj.curr.count);
		}
		this.lineData.set(timestamp, dataObj);
	}

	this.renderMiniLine("curr");
	this.renderFullGraph("curr");
};

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
};
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
};

dataHandlerModel.prototype.renderMiniLine = function(item)
{
	if (this.mainAssistant && this.mainAssistant.controller && this.mainAssistant.isVisible) {

		this.graphs[item].clearLines();
		
		var data = [];
		
		var avg = 1;
		var points = 80;
		
		var keys = this.lineData.keys();
		var start = 0;
		if (keys.length > points) start = keys.length - points;
		for (var k = start; k < keys.length; k++) {
			var dataObj = this.lineData.get(keys[k]);
			
			if (item == "temp") {
				if (dataObj.temp)
					data.push({x: keys[k], y: dataObj.temp.value});
			}
			else if (item =="freq") {
				if (dataObj.freq)
					data.push({x: keys[k], y: dataObj.freq.value});
			}
			else if (item =="load") {
				if (dataObj.load)
					data.push({x: keys[k], y: dataObj.load.value1});
			}
			else if (item =="mem") {
				if (dataObj.mem)
					data.push({x: keys[k], y: dataObj.mem.value});
			}
			else if (item =="curr") {
				if (dataObj.curr)
					data.push({x: keys[k], y: dataObj.curr.value});
			}
		}
		
		var minX = Math.round(new Date().getTime()/1000.0) - (points * (this.rate / 1000));
		this.graphs[item].options.xaxis.min = minX;
		
		this.graphs[item].addLine({data: data, stroke: this.strokes[item], fill: this.fills[item]});
		
		this.graphs[item].render();
		
	}
};

dataHandlerModel.prototype.renderMiniBar = function(item)
{
	if (this.mainAssistant && this.mainAssistant.controller && this.mainAssistant.isVisible) {

		var data = [];
		
		if (this.barData.state) {
			var keys = this.barData.state.keys();
			for (var k = 0; k < keys.length; k++) {
				var value = this.barData.state.get(keys[k]);
				data.push({key: keys[k], value: value});
			}
		
			this.graphs[item].setData(data, {strokeStyle: this.strokes[item], fillStyle: this.fills[item]});
			
			this.graphs[item].render();
		}
	}
};

dataHandlerModel.prototype.renderFullGraph = function()
{
	if (this.graphAssistant && this.graphAssistant.controller && this.graphAssistant.isVisible) {

		this.fullGraph.clearLines();
		
		var fullData1 = [];
		var fullData2 = [];
		var fullData3 = [];
		
		var avg = 1;
		
		var keys = this.lineData.keys();
		for (var k = 0; k < keys.length; k++) {
			var dataObj = this.lineData.get(keys[k]);
			
			if (dataObj.temp && this.graphAssistant.display == "temp") {
				fullData1.push({x: keys[k], y: dataObj.temp.value});
			}
			
			if (dataObj.freq && this.graphAssistant.display == "freq") {
				fullData1.push({x: keys[k], y: dataObj.freq.value});
			}
			
			if (dataObj.load && this.graphAssistant.display == "load") {
				fullData1.push({x: keys[k], y: dataObj.load.value1});
				fullData2.push({x: keys[k], y: dataObj.load.value5});
				fullData3.push({x: keys[k], y: dataObj.load.value15});
			}

			if (dataObj.mem && this.graphAssistant.display == "mem") {
				fullData1.push({x: keys[k], y: dataObj.mem.value});
			}

			if (dataObj.curr && this.graphAssistant.display == "curr") {
				fullData1.push({x: keys[k], y: dataObj.curr.value});
			}
		}
		
		if (this.graphAssistant.display == "temp") {
			this.fullGraph.addLine({data: fullData1, stroke: "rgba(153, 205, 153, .4)", fill: "rgba(153, 205, 153, .2)"});
		}
		
		if (this.graphAssistant.display == "freq") {
			this.fullGraph.addLine({data: fullData1, stroke: "rgba(205, 153, 153, .4)", fill: "rgba(205, 153, 153, .2)"});
		}
		
		if (this.graphAssistant.display == "load") {
			this.fullGraph.addLine({data: fullData3, stroke: "rgba(75, 75, 205, .4)"});
			this.fullGraph.addLine({data: fullData2, stroke: "rgba(105, 105, 205, .4)"});
			this.fullGraph.addLine({data: fullData1, stroke: "rgba(135, 135, 205, .4)", fill: "rgba(135, 135, 205, .2)"});
		}
				
		if (this.graphAssistant.display == "mem") {
			this.fullGraph.addLine({data: fullData1, stroke: "rgba(75, 75, 205, .4)"});
		}
		
		if (this.graphAssistant.display == "curr") {
			this.fullGraph.addLine({data: fullData1, stroke: "rgba(153, 205, 153, .4)", fill: "rgba(153, 205, 153, .2)"});
		}		
				
		this.fullGraph.render();
	}
};



// Local Variables:
// tab-width: 4
// End:
