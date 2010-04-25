function GraphAssistant()
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
};

GraphAssistant.prototype.setup = function()
{
	this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
	
	this.canvasElement = this.controller.get('graphCanvas');
	
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
	
	graphHandler.setGraphAssistant(this);
};

GraphAssistant.prototype.gestureStartHandler = function(event)
{
};
GraphAssistant.prototype.gestureChangeHandler = function(event)
{
};
GraphAssistant.prototype.gestureEndHandler = function(event)
{
};

GraphAssistant.prototype.flickHandler = function(event)
{
};
GraphAssistant.prototype.dragStartHandler = function(event)
{
};
GraphAssistant.prototype.draggingHandler = function(event)
{
};
GraphAssistant.prototype.dragEndHandler = function(event)
{
};

GraphAssistant.prototype.activate = function(event)
{
	if (this.firstActivate)
	{
		
	}
	else
	{
		
	}
	this.firstActivate = true;
};
GraphAssistant.prototype.deactivate = function(event)
{
};

GraphAssistant.prototype.handleCommand = function(event)
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

GraphAssistant.prototype.cleanup = function(event)
{
    this.controller.StopListening(this.canvasElement, 'gesturestart',		this.gestureStartHandler);
    this.controller.StopListening(this.canvasElement, 'gesturechange',		this.gestureChangeHandler);
    this.controller.StopListening(this.canvasElement, 'gestureend',			this.gestureEndHandler);
	this.controller.StopListening(this.canvasElement, Mojo.Event.flick,		this.flickHandler);
	this.controller.StopListening(this.canvasElement, Mojo.Event.dragStart,	this.dragStartHandler);
	this.controller.StopListening(this.canvasElement, Mojo.Event.dragging,	this.draggingHandler);
	this.controller.StopListening(this.canvasElement, Mojo.Event.dragEnd,	this.dragEndHandler);
};

// Local Variables:
// tab-width: 4
// End:
