function MainAssistant()
{
	// subtitle random list
	this.randomSub = 
	[
		{weight: 1, text: $L('Insert Witty Tagline Here...')}
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
	this.canvas = this.canvasElement.getContext('2d');
	
	this.scaleElement = this.controller.get('scale');
	//this.scaleElement.hide();
	this.vertTop = this.controller.get('vertTop');
	this.vertBot = this.controller.get('vertBot');
	
	this.canvasWidth  = 320;
	this.canvasHeight = 100;
	
	this.horzScale = 64;
	this.pinchScale = 1;
	this.pinching = false;
	this.pinchingScale = 1;
	
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
}
MainAssistant.prototype.onTemp = function(payload)
{
	//alert(payload.stdOut);
	AppAssistant.updateIcon(payload.stdOut);
	this.iconElement.className = 'icon temp-' + payload.stdOut;
	
	this.temps.push({date:new Date(), value:payload.stdOut})
	this.renderGraph();
}

MainAssistant.prototype.renderGraph = function()
{
  	this.canvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight+1);
	this.canvas.save();
	
	this.canvas.strokeStyle = "rgba(0, 0, 0, 1)";
	this.canvas.lineWidth = 2;
	
	/*
	this.canvas.beginPath();
	this.canvas.moveTo(0, 0);
	this.canvas.lineTo(320, 100);
	this.canvas.stroke();
	*/
	
	var vertTop = 0;
	var vertBot = 100;
	
	var pointAvg = 1;
	
	var curHorzScale = (this.horzScale * this.pinchScale);
	if (this.pinching)
		curHorzScale = (curHorzScale * this.pinchingScale);
	
	while (curHorzScale > this.canvasWidth)
	{
		curHorzScale = curHorzScale - this.canvasWidth;
		if (curHorzScale < this.horzScale) curHorzScale = this.horzScale;
		pointAvg++;
	}
	
	curHorzScale = Math.round(curHorzScale);
	
	//this.scaleElement.innerHTML = curHorzScale + ' : ' + pointAvg;
	
	var totalPoints = Math.round(this.temps.length / pointAvg);
	
	var segWidth = this.canvasWidth / curHorzScale;
	var segStart = Math.round(totalPoints < curHorzScale ? curHorzScale - totalPoints : 0);
	var startPoint = Math.round(totalPoints > (curHorzScale * pointAvg) ? this.temps.length - (curHorzScale * pointAvg) : 0);
	
	for (var p = startPoint; p < this.temps.length; p++)
	{
		if (vertTop < this.temps[p].value) vertTop = this.temps[p].value;
		if (vertBot > this.temps[p].value) vertBot = this.temps[p].value;
	}
	
	var vertSplit = vertTop - vertBot;
	if (vertSplit < 5)
	{
		vertTop = parseInt(vertTop) + (5 - (vertSplit % 5));
		vertSplit = vertTop - vertBot;
	}
	
	this.vertTop.innerHTML = vertTop + '&deg;';
	this.vertBot.innerHTML = vertBot + '&deg;';
	
	var num = segStart;
	
	var last = parseInt(this.temps[startPoint].value);
	
	for (var p = startPoint; p < this.temps.length; p = p + pointAvg)
	{
		var crnTotal = 0;
		var display = true;
		for (var a = pointAvg; a >= 1; a--)
		{
			if (this.temps[p-a])
			{
				crnTotal = crnTotal + parseInt(this.temps[p-a].value);
			}
			else
			{
				crnTotal = crnTotal + parseInt(this.temps[p].value);
				var display = false;
			}
		}
		var crnt = crnTotal / pointAvg;
		
		if (display)
		{
			this.canvas.beginPath();
			this.canvas.moveTo(num * segWidth, this.canvasHeight - (this.canvasHeight / vertSplit) * (last - vertBot));
			this.canvas.lineTo((num * segWidth) + segWidth, this.canvasHeight - (this.canvasHeight / vertSplit) * (crnt - vertBot));
			this.canvas.stroke();
		}
		var last = crnt; 
		
		num++;
	}
	
  	this.canvas.restore();
}

MainAssistant.prototype.gestureStartHandler = function(event)
{
	//this.scaleElement.show();
	
    this.scaleElement.style.left = (event.centerX - 50) + "px";
	this.scaleElement.innerHTML = Math.round((1 / (1 * event.scale)) * 100) +  "%";
	
}
MainAssistant.prototype.gestureChangeHandler = function(event)
{
	this.pinching = true;
	this.pinchingScale = 1 / (1 * event.scale);
	
    this.scaleElement.style.left = (event.pageX - 50) + "px";
	this.scaleElement.innerHTML = Math.round(this.pinchingScale * 100) +  "%";
	
	this.renderGraph();
}
MainAssistant.prototype.gestureEndHandler = function(event)
{
	this.pinching = false;
	this.pinchScale = this.pinchScale * (1 / (1 * event.scale));
	
	//this.scaleElement.hide();
	this.scaleElement.innerHTML = "100%";
	
	this.renderGraph();
}

MainAssistant.prototype.flickHandler = function(event)
{
}
MainAssistant.prototype.dragStartHandler = function(event)
{
}
MainAssistant.prototype.draggingHandler = function(event)
{
}
MainAssistant.prototype.dragEndHandler = function(event)
{
}

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
}

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
