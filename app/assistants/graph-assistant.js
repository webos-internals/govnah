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
	
	this.isVisible = true;
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
	
	
	this.visible = this.visible.bindAsEventListener(this);
	this.invisible = this.invisible.bindAsEventListener(this);
	this.controller.listen(this.controller.stageController.document, Mojo.Event.stageActivate,   this.visible);
	this.controller.listen(this.controller.stageController.document, Mojo.Event.stageDeactivate, this.invisible);
	
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

GraphAssistant.prototype.orientationChanged = function(orientation)
{
	switch (orientation)
	{
		case 'left':
		case 'right':
			graphHandler.fullGraph.changeDimenstions(480, 320);
			break;
			
		case 'up':
		case 'down':
			graphHandler.fullGraph.changeDimenstions(320, 480);
			break;
	}
}
GraphAssistant.prototype.activate = function(event)
{
	if (this.controller.stageController.setWindowOrientation)
	{
    	this.controller.stageController.setWindowOrientation("free");
	}
	
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

GraphAssistant.prototype.visible = function(event)
{
	if (!this.isVisible)
	{
		this.isVisible = true;
	}
};
GraphAssistant.prototype.invisible = function(event)
{
	this.isVisible = false;
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
		
	this.controller.stopListening(this.controller.stageController.document, Mojo.Event.stageActivate,   this.visible);
	this.controller.stopListening(this.controller.stageController.document, Mojo.Event.stageDeactivate, this.invisible);
};

// Local Variables:
// tab-width: 4
// End:
