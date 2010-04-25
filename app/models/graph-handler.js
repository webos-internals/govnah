function graphHandlerModel()
{
	
	this.mainAssistant = false;
	this.graphAssistant = false;
	
	this.lineData = $H();
	this.barData = {};
	
	this.timer = false;
	this.rate = 1000; // every second
	
	this.timerHandler = this.timerFunction.bind(this);
	
	this.tempHandler = this.tempHandler.bindAsEventListener(this);
    this.freqHandler = this.freqHandler.bindAsEventListener(this);
    this.loadHandler = this.loadHandler.bindAsEventListener(this);
    this.timeHandler = this.timeHandler.bindAsEventListener(this);
	
	this.tempGraph = false;
	this.freqGraph = false;
	this.loadGraph = false;
	this.timeGraph = false;
	
};

graphHandlerModel.prototype.start = function()
{
	//this.timer = setInterval(this.timerHandler, this.rate);
	this.timerHandler();
};

graphHandlerModel.prototype.setMainAssistant = function(assistant)
{
	this.mainAssistant = assistant;
	
	this.tempGraph = new lineGraph
	(
		this.mainAssistant.controller.get('tempCanvas'),
		{
			height: 30,
			width: 320
		}
	)
	this.freqGraph = new lineGraph
	(
		this.mainAssistant.controller.get('freqCanvas'),
		{
			height: 30,
			width: 320
		}
	);
	this.loadGraph = new lineGraph
	(
		this.mainAssistant.controller.get('loadCanvas'),
		{
			height: 30,
			width: 320
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

graphHandlerModel.prototype.timerFunction = function()
{
	this.renderGraph();
	
	service.get_omap34xx_temp(this.tempHandler);
	service.get_scaling_cur_freq(this.freqHandler);
	service.get_proc_loadavg(this.loadHandler);
	service.get_time_in_state(this.timeHandler);
	
	this.timer = setTimeout(this.timerHandler, this.rate);
};


graphHandlerModel.prototype.tempHandler = function(payload)
{
	if (payload.returnValue) 
	{
		var timestamp = Math.round(new Date().getTime()/1000.0);
		var value = parseInt(payload.value);
		
		AppAssistant.updateIcon(value);
		if (this.mainAssistant && this.mainAssistant.controller && this.mainAssistant.isVisible)
		{
			this.mainAssistant.iconElement.className = 'icon temp-' + value;
			this.mainAssistant.tempCurrent.innerHTML = value + '<div class="unit">&deg;C</div>';
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
graphHandlerModel.prototype.freqHandler = function(payload)
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
graphHandlerModel.prototype.loadHandler = function(payload)
{
	if (payload.returnValue) 
	{
		var timestamp = Math.round(new Date().getTime()/1000.0);
		var valueArray = String(payload.stdOut).split(' ');
		var value = parseFloat(trim(valueArray[0]));
		
		if (this.mainAssistant && this.mainAssistant.controller && this.mainAssistant.isVisible)
		{
			this.mainAssistant.loadCurrent.innerHTML = valueArray[0] + ' ' + valueArray[1] + ' ' + valueArray[2];
		}
		
		var dataObj = this.lineData.get(timestamp)
		if (!dataObj) dataObj = {};
		if (!dataObj.load)
		{
			dataObj.load = {total:value, count:1, value:value};
		}
		if (dataObj.load && dataObj.load.count)
		{
			dataObj.load.total = dataObj.load.total + value;
			dataObj.load.count++;
			dataObj.load.value = (dataObj.load.total / dataObj.load.count);
		}
		this.lineData.set(timestamp, dataObj);
	}
}
graphHandlerModel.prototype.timeHandler = function(payload)
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

graphHandlerModel.prototype.renderGraph = function()
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
				tempData.push({key: keys[k], value: dataObj.temp.value});
			
			if (dataObj.freq)
				freqData.push({key: keys[k], value: dataObj.freq.value});
			
			if (dataObj.load)
				loadData.push({key: keys[k], value: dataObj.load.value});
		}
		
		this.tempGraph.setLine(tempData, {strokeStyle: "rgba(153, 205, 153, .4)", fillStyle: "rgba(153, 205, 153, .2)"});
		this.freqGraph.setLine(freqData, {strokeStyle: "rgba(255, 153, 153, .4)", fillStyle: "rgba(255, 153, 153, .2)"});
		this.loadGraph.setLine(loadData, {strokeStyle: "rgba(153, 153, 255, .4)", fillStyle: "rgba(153, 153, 255, .2)"});
		
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
	
};



// Local Variables:
// tab-width: 4
// End:
