function MainAssistant()
{
	// subtitle random list
	this.randomSub = 
	[
		{weight: 30, text: $L('The Advanced CPU Controller')},
		{weight: 30, text: $L('Take Control Of Your CPU')},
		{weight: 15, text: $L('Much Better Than Arnie')},
		{weight:  2, text: $L('Random Taglines Are Awesome')},
		{weight:  2, text: $L('We Know Caj2008 Loves Govnah')},
		{weight:  2, text: $L('Now With More Cowbell')}
	];
	
	// setup list model
	this.mainModel = {items:[]};
	
	// setup search model
	this.searchModel = { value: '' };
	this.searchText = '';
	
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
	
	
	this.currentGovernor = '';
	this.timer = false;
};

MainAssistant.prototype.setup = function()
{
	// get elements
	this.iconElement =		this.controller.get('icon');
	this.titleElement =		this.controller.get('main-title');
	this.versionElement =	this.controller.get('version');
	this.subTitleElement =	this.controller.get('subTitle');
	this.governorRow =		this.controller.get('governorRow');
	this.governorCurrent =	this.controller.get('governorCurrent');
	this.freqCurrent =	this.controller.get('freqCurrent');
	this.tempCurrent =	this.controller.get('tempCurrent');
	this.loadCurrent =	this.controller.get('loadCurrent');
	
	// set version string random subtitle
	this.titleElement.innerHTML = Mojo.Controller.appInfo.title;
	this.versionElement.innerHTML = "v" + Mojo.Controller.appInfo.version;
	this.subTitleElement.innerHTML = this.getRandomSubTitle();
	
	// setup menu
	this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
	
	
	this.governorHandler = this.onGovernor.bindAsEventListener(this);
	this.governorTapHandler = this.governorTap.bindAsEventListener(this);
	
	this.controller.listen(this.governorRow, Mojo.Event.tap, this.governorTapHandler);
		
	this.lineData = $H();
	this.barData = $H();
	this.rate = 1000;
	
	//this.canvasElement = this.controller.get('graphCanvas');
	//this.scaleElement = this.controller.get('scale');
	//this.scaleElement.hide();
	//this.vertTop = this.controller.get('vertTop');
	//this.vertBot = this.controller.get('vertBot');
	//this.vertTopCount = this.controller.get('vertTopCount');
	//this.vertBotCount = this.controller.get('vertBotCount');
	
	this.tempGraph = new lineGraph
	(
		this.controller.get('tempCanvas'),
		{
			height: 30,
			width: 320
		}
	)
	this.freqGraph = new lineGraph
	(
		this.controller.get('freqCanvas'),
		{
			height: 30,
			width: 320
		}
	);
	this.loadGraph = new lineGraph
	(
		this.controller.get('loadCanvas'),
		{
			height: 30,
			width: 320
		}
	);
	/*
	this.timeGraph = new lineGraph
	(
		this.controller.get('timeCanvas'),
		{
			height: 30,
			width: 320
		}
	);
	*/
	
	/*
	this.tempGraphZoom = 0;
	this.tempGraphZoomLevels = ['second','5seconds','10seconds','15seconds','30seconds','min'];
	this.tempGraphPinching = false;
	this.tempGraphPinchingZoom = this.tempGraphZoom;
	*/
	
	this.timerHandler = this.timerFunction.bind(this);
	this.tempHandler = this.tempHandler.bindAsEventListener(this);
    this.freqHandler = this.freqHandler.bindAsEventListener(this);
    this.loadHandler = this.loadHandler.bindAsEventListener(this);
    this.timeHandler = this.timeHandler.bindAsEventListener(this);
		
	//this.timer = setInterval(this.timerHandler, this.rate);
	this.timerHandler();
	
	/*
    this.gestureStartHandler =	this.gestureStartHandler.bindAsEventListener(this);
    this.gestureChangeHandler =	this.gestureChangeHandler.bindAsEventListener(this);
    this.gestureEndHandler =	this.gestureEndHandler.bindAsEventListener(this);
	this.flickHandler =			this.flickHandler.bindAsEventListener(this);
	this.dragStartHandler =		this.dragStartHandler.bindAsEventListener(this);
	this.draggingHandler =		this.draggingHandler.bindAsEventListener(this);
	this.dragEndHandler =		this.dragEndHandler.bindAsEventListener(this);
	
    this.controller.listen(this.canvasElement, 'gesturestart',			this.gestureStartHandler);
    this.controller.listen(this.canvasElement, 'gesturechange',			this.gestureChangeHandler);
    this.controller.listen(this.canvasElement, 'gestureend',			this.gestureEndHandler);
	this.controller.listen(this.canvasElement, Mojo.Event.flick,		this.flickHandler);
	this.controller.listen(this.canvasElement, Mojo.Event.dragStart,	this.dragStartHandler);
	this.controller.listen(this.canvasElement, Mojo.Event.dragging,		this.draggingHandler);
	this.controller.listen(this.canvasElement, Mojo.Event.dragEnd,		this.dragEndHandler);
	*/	
};

MainAssistant.prototype.onGovernor = function(payload)
{
	this.currentGovernor = trim(payload.value);
	this.governorCurrent.innerHTML = this.currentGovernor;
	//alert ('-----');
	//for (p in payload) alert(p+":"+payload[p]);
}
MainAssistant.prototype.governorTap = function(event)
{
	this.controller.stageController.pushScene('governor', this.currentGovernor);
}

MainAssistant.prototype.tempHandler = function(payload)
{
	if (payload.returnValue) 
	{
		var timestamp = Math.round(new Date().getTime()/1000.0);
		var value = parseInt(payload.value);
		
		AppAssistant.updateIcon(value);
		this.iconElement.className = 'icon temp-' + value;
		this.tempCurrent.innerHTML = value + '<div class="unit">&deg;C</div>';
		
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
MainAssistant.prototype.freqHandler = function(payload)
{
	if (payload.returnValue) 
	{
		var timestamp = Math.round(new Date().getTime()/1000.0);
		var value = parseInt(payload.value);
	
		this.freqCurrent.innerHTML = (value / 1000) + '<div class="unit">MHz</div>';
		
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
MainAssistant.prototype.loadHandler = function(payload)
{
	if (payload.returnValue) 
	{
		var timestamp = Math.round(new Date().getTime()/1000.0);
		var valueArray = String(payload.stdOut).split(' ');
		var value = parseFloat(trim(valueArray[0]));
		
		this.loadCurrent.innerHTML = valueArray[0] + ' ' + valueArray[1] + ' ' + valueArray[2];
		
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
MainAssistant.prototype.timeHandler = function(payload)
{
	/*
	alert ('***** TIME');
	for (p in payload) alert(p+":"+payload[p]);
	
	
	if (payload.returnValue) 
	{
		var valueArray = payload.stdOut.split(',');
		
		alert(value);
		
	}
	*/
}

MainAssistant.prototype.timerFunction = function()
{
	this.renderGraph();
	
	service.get_omap34xx_temp(this.tempHandler);
	service.get_scaling_cur_freq(this.freqHandler);
	service.get_proc_loadavg(this.loadHandler);
	//service.get_time_in_state(this.timeHandler);
	
	this.timer = setTimeout(this.timerHandler, this.rate);
};


MainAssistant.prototype.renderGraph = function()
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
	
	this.tempGraph.setLine(tempData, {strokeStyle: "rgba(153, 205, 153, .3)", fillStyle: "rgba(153, 205, 153, .1)"});
	this.freqGraph.setLine(freqData, {strokeStyle: "rgba(255, 153, 153, .3)", fillStyle: "rgba(255, 153, 153, .1)"});
	this.loadGraph.setLine(loadData, {strokeStyle: "rgba(153, 153, 255, .3)", fillStyle: "rgba(153, 153, 255, .1)"});
	
	this.tempGraph.render();
	this.freqGraph.render();
	this.loadGraph.render();
	
};

/*
MainAssistant.prototype.gestureStartHandler = function(event)
{
	this.scaleElement.show();
	
};
MainAssistant.prototype.gestureChangeHandler = function(event)
{
	this.tempGraphPinching = true;
	this.tempGraphPinchingZoom = this.tempGraphZoom;
	
	if (event.scale > 1.4 && this.tempGraphZoomLevels[this.tempGraphZoom-1])
	{
		this.tempGraphPinchingZoom--;
	}
	if (event.scale > 1.9 && this.tempGraphZoomLevels[this.tempGraphZoom-2])
	{
		this.tempGraphPinchingZoom--;
	}
	if (event.scale < .6 && this.tempGraphZoomLevels[this.tempGraphZoom+1])
	{
		this.tempGraphPinchingZoom++;
	}
	if (event.scale < .3 && this.tempGraphZoomLevels[this.tempGraphZoom+2])
	{
		this.tempGraphPinchingZoom++;
	}
	
    this.scaleElement.style.left = (event.pageX - 100) + "px";
	this.scaleElement.innerHTML = this.tempGraphZoomLevels[this.tempGraphPinchingZoom];
	
	this.renderGraph();
};
MainAssistant.prototype.gestureEndHandler = function(event)
{
	this.tempGraphPinching = false;
	
	this.scaleElement.hide();
	
	if (event.scale > 1.4 && this.tempGraphZoomLevels[this.tempGraphZoom-1])
	{
		this.tempGraphZoom--;
	}
	if (event.scale > 1.9 && this.tempGraphZoomLevels[this.tempGraphZoom-1])
	{
		this.tempGraphZoom--;
	}
	if (event.scale < .6 && this.tempGraphZoomLevels[this.tempGraphZoom+1])
	{
		this.tempGraphZoom++;
	}
	if (event.scale < .3 && this.tempGraphZoomLevels[this.tempGraphZoom+1])
	{
		this.tempGraphZoom++;
	}
	
	this.renderGraph();
};

MainAssistant.prototype.flickHandler = function(event)
{
};
MainAssistant.prototype.dragStartHandler = function(event)
{
};
MainAssistant.prototype.draggingHandler = function(event)
{
};
MainAssistant.prototype.dragEndHandler = function(event)
{
};
*/

MainAssistant.prototype.activate = function(event)
{
	if (this.firstActivate)
	{
		
	}
	else
	{
		
	}
	this.firstActivate = true;
	
	service.get_scaling_governor(this.governorHandler);
};
MainAssistant.prototype.deactivate = function(event)
{
};

MainAssistant.prototype.getRandomSubTitle = function()
{
	// loop to get total weight value
	var weight = 0;
	for (var r = 0; r < this.randomSub.length; r++)
	{
		weight += this.randomSub[r].weight;
	}
	
	// random weighted value
	var rand = Math.floor(Math.random() * weight);
	//alert('rand: ' + rand + ' of ' + weight);
	
	// loop through to find the random title
	for (var r = 0; r < this.randomSub.length; r++)
	{
		if (rand <= this.randomSub[r].weight)
		{
			return this.randomSub[r].text;
		}
		else
		{
			rand -= this.randomSub[r].weight;
		}
	}
	
	// if no random title was found (for whatever reason, wtf?) return first and best subtitle
	return this.randomSub[0].text;
};

MainAssistant.prototype.handleCommand = function(event)
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

MainAssistant.prototype.cleanup = function(event)
{
};

// Local Variables:
// tab-width: 4
// End:
