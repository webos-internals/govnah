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
	this.canvasWidth  = 320;
	this.canvasHeight = 100;
	
	this.horzScale = 62;
	this.pinchScale = 1;
	this.pinching = false;
	this.pinchingScale = 1;
	
	this.timerHandler = this.timerFunction.bind(this);	
	this.tempHandler = this.onTemp.bindAsEventListener(this);
	
	//this.timer = setInterval(this.timerHandler, this.rate);
	this.timer = setTimeout(this.timerHandler, this.rate);
	
	
	
    this.controller.listen(this.canvasElement, 'gesturestart', this.handleGestureStart.bind(this));
    this.controller.listen(this.canvasElement, 'gesturechange', this.handleGestureChange.bind(this));
    this.controller.listen(this.canvasElement, 'gestureend', this.handleGestureEnd.bind(this));
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
  	this.canvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
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
	
	var curHorzScale = (this.horzScale * this.pinchScale);
	if (this.pinching)
		curHorzScale = (curHorzScale * this.pinchingScale);

	var segStart = Math.round(this.temps.length < curHorzScale ? curHorzScale - this.temps.length : 0);
	//var segWidth = this.canvasWidth / (this.temps.length > curHorzScale ? curHorzScale : this.temps.length); // auto-sizing width with 0 segStart
	var segWidth = this.canvasWidth / curHorzScale; // fixed for graph-draw-in from side instead of sizing
	var startPoint = Math.round(this.temps.length > curHorzScale ? this.temps.length-curHorzScale : 0);
	
	//alert(segWidth + ' : ' + segStart);
	
	for (p = startPoint; p < this.temps.length; p++)
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
	
	//alert(vertTop + " - " + vertBot + " : " + vertSplit);
	this.controller.get('vertTop').innerHTML = vertTop + '&deg;';
	this.controller.get('vertBot').innerHTML = vertBot + '&deg;';
	
	var num = segStart;
	
	for (p = startPoint; p < this.temps.length; p++)
	{
		var last = (this.temps[p-1] ? this.temps[p-1].value : this.temps[p].value);
		var crnt = this.temps[p].value;
		
		//alert((num * segWidth) + " - " + ((num * segWidth) + segWidth));
		
		this.canvas.beginPath();
		this.canvas.moveTo(num * segWidth, this.canvasHeight - (this.canvasHeight / vertSplit) * (last - vertBot));
		this.canvas.lineTo((num * segWidth) + segWidth, this.canvasHeight - (this.canvasHeight / vertSplit) * (crnt - vertBot));
		this.canvas.stroke();
		num++;
	}
	
  	this.canvas.restore();
}

MainAssistant.prototype.handleGestureStart = function(event)
{
	// always 1
	//alert(1 / (1 * event.scale));
}
MainAssistant.prototype.handleGestureChange = function(event)
{
	//alert(1 / (1 * event.scale));
	this.pinching = true;
	this.pinchingScale = 1 / (1 * event.scale);
	this.renderGraph();
}
MainAssistant.prototype.handleGestureEnd = function(event)
{
	//alert(1 / (1 * event.scale));
	this.pinching = false;
	this.pinchScale = this.pinchScale * (1 / (1 * event.scale));
	this.renderGraph();
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
