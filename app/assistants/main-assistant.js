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
	
	this.timer = false;
};

MainAssistant.prototype.setup = function()
{
	// get elements
	this.iconElement =		this.controller.get('icon');
	this.titleElement =		this.controller.get('main-title');
	this.versionElement =	this.controller.get('version');
	this.subTitleElement =	this.controller.get('subTitle');
	
	// set version string random subtitle
	this.titleElement.innerHTML = Mojo.Controller.appInfo.title;
	this.versionElement.innerHTML = "v" + Mojo.Controller.appInfo.version;
	this.subTitleElement.innerHTML = this.getRandomSubTitle();
	
	// setup menu
	this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
	
	
	this.temps = [];
	this.rate = 500;
	
	this.canvasElement = this.controller.get('graphCanvas');
	this.scaleElement = this.controller.get('scale');
	this.scaleElement.hide();
	this.vertTop = this.controller.get('vertTop');
	this.vertBot = this.controller.get('vertBot');
	this.vertTopCount = this.controller.get('vertTopCount');
	this.vertBotCount = this.controller.get('vertBotCount');
	
	this.tempGraph = new lineGraph
	(
		this.canvasElement,
		{
			height: 100,
			width: 320
		}
	);
	
	this.tempGraphZoom = 1;
	this.tempGraphZoomLevels = ['halfsecond','second','2seconds','5seconds','10seconds','30seconds','min'];
	this.tempGraphPinching = false;
	this.tempGraphPinchingZoom = this.tempGraphZoom;
	
	this.timerHandler = this.timerFunction.bind(this);	
	this.tempHandler = this.onTemp.bindAsEventListener(this);
	
	//this.timer = setInterval(this.timerHandler, this.rate);
	this.timer = setTimeout(this.timerHandler, this.rate);
	
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
};

MainAssistant.prototype.timerFunction = function()
{
	service.get_omap34xx_temp(this.tempHandler);
	
	this.timer = setTimeout(this.timerHandler, this.rate);
};

MainAssistant.prototype.onTemp = function(payload)
{
	if (payload.returnValue) {
		//alert(payload.value);
		AppAssistant.updateIcon(payload.value);
		this.iconElement.className = 'icon temp-' + payload.value;
	
		this.temps.push({date:new Date(), value:payload.value})
		this.renderGraph();
	}
};

MainAssistant.prototype.renderGraph = function()
{
	
	this.tempGraph.clearLines();
	
	var tmpData = [];
	
	var avg = false;
	var points = 180;
	
	switch (this.tempGraphZoomLevels[this.tempGraphPinchingZoom])
	{
		case 'halfsecond':

			if (this.temps.length < points)
			{
				for (var t = 0; t < points - (this.temps.length % points); t++)
				{
					tmpData.push(false);
				}
			}
			for (var t = (this.temps.length > points ? this.temps.length - points : 0); t < this.temps.length; t++)
			{
				tmpData.push(this.temps[t].value);
			}
			break;
		
		case 'second':
			if (avg === false) avg = 1;
		case '2seconds':
			if (avg === false) avg = 2;
		case '5seconds':
			if (avg === false) avg = 5;
		case '10seconds':
			if (avg === false) avg = 10;
		case '30seconds':
			if (avg === false) avg = 30;
		case 'min':
			if (avg === false) avg = 60;
			
			var avgData = $H();
			for (var t = 0; t < this.temps.length; t++)
			{
				var avgTime = Math.round(this.temps[t].date.getTime()/1000);
				avgTime = avgTime - (avgTime % avg);
				
				if (tmpObj = avgData.get(avgTime))
				{
					tmpObj.total = tmpObj.total + this.temps[t].value;
					tmpObj.count++;
				}
				else
				{
					var tmpObj =
					{
						total: this.temps[t].value,
						count: 1
					}
				}
				
				avgData.set(avgTime, tmpObj);
			}
			
			var tmpKeys = avgData.keys();
			if (tmpKeys.length < points)
			{
				for (var t = 0; t < points - (tmpKeys.length % points); t++)
				{
					tmpData.push(false);
				}
			}
			for (t = (tmpKeys.length > points ? tmpKeys.length - points : 0); t < tmpKeys.length; t++)
			{
				var tmpObj = avgData.get(tmpKeys[t]);
				tmpData.push(tmpObj.total / tmpObj.count);
			}
			break;
	}
	
	this.tempGraph.setLine(tmpData, {});
	
	
	this.tempGraph.render();
	
	this.vertTopCount.innerHTML = Math.round(this.tempGraph.lines[0].vertical.top) + '&deg;';
	this.vertBotCount.innerHTML = Math.round(this.tempGraph.lines[0].vertical.bottom) + '&deg;';
	
};

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
	
	//this.renderGraph();
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

MainAssistant.prototype.activate = function(event)
{
	if (this.firstActivate)
	{
		
	}
	else
	{
		
	}
	this.firstActivate = true;
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
