/*

	^ |
	| |
	y |_______
	    x - >
	
	x = left
	y = top

*/

function lineGraph(element, options)
{
	this.element = element;
	this.canvas = this.element.getContext('2d');
	this.options = options || {};
	
	this.options = this.merge(options,
	{
		renderWidth:	480,
		renderHeight:	320,
		xaxis:
		{
			min:		null,
			max:		null
		},
		yaxis:
		{
			min:		null,
			max:		null
		},
		padding:
		{
			top:		0,
			bottom:		0,
			left:		0,
			right:		0
		},
		clearWidth:		480,
		clearHeight:	480
	});
	
	this.lines =		[];
	
	this.drawWidth =	0;
	this.drawHeight =	0;
	this.xScale =		0;
	this.yScale =		0;
	
	this.xaxis =
	{
		min:	0,
		max:	0
	}
	this.yaxis =
	{
		min:	0,
		max:	0
	}
	
};
lineGraph.prototype.merge = function(src, dest)
{
	var result = dest || {};
	for(var i in src){		  
		result[i] = (typeof(src[i]) == 'object' && !(src[i].constructor == Array || src[i].constructor == RegExp)) ? this.merge(src[i], dest[i]) : result[i] = src[i];		
	}
	return result;	
};

lineGraph.prototype.addLine = function(line)
{
	if (line)
	{
		var tmpLine = this.merge(line,
		{
			data:	null,
			stroke:	"rgba(0, 0, 0, .5)",
			fill:	null,
			width:	2
		});
		this.lines.push(tmpLine);
	}
};

lineGraph.prototype.clearLines = function()
{
	this.lines = [];
}
lineGraph.prototype.prepareLines = function()
{
	this.xaxis.min = this.yaxis.min = Number.MAX_VALUE;
	this.xaxis.max = this.yaxis.max = Number.MIN_VALUE;
	
	this.lines.each(function(l)
	{
		l.data.each(function(d)
		{
			if (d.x < this.xaxis.min) this.xaxis.min = d.x;
			if (d.x > this.xaxis.max) this.xaxis.max = d.x;
			if (d.y < this.yaxis.min) this.yaxis.min = d.y;
			if (d.y > this.yaxis.max) this.yaxis.max = d.y;
		}.bind(this));
	}.bind(this));
	
	if (this.options.xaxis.min !== null && this.options.xaxis.min < this.xaxis.min) this.xaxis.min = this.options.xaxis.min;
	if (this.options.xaxis.max !== null && this.options.xaxis.max < this.xaxis.max) this.xaxis.max = this.options.xaxis.max;
	if (this.options.yaxis.min !== null && this.options.yaxis.min < this.yaxis.min) this.yaxis.min = this.options.yaxis.min;
	if (this.options.yaxis.max !== null && this.options.yaxis.max < this.yaxis.max) this.yaxis.max = this.options.yaxis.max;
	
	if (this.yaxis.max - this.yaxis.min == 0) this.yaxis.max++;
	
	this.drawHeight = this.options.renderHeight - (this.options.padding.bottom + this.options.padding.top);
	this.drawWidth = this.options.renderWidth - (this.options.padding.left + this.options.padding.right);
	
	this.xScale = this.drawWidth / (this.xaxis.max - this.xaxis.min);
	this.yScale = this.drawHeight / (this.yaxis.max - this.yaxis.min);
};

lineGraph.prototype.getX = function(x)
{
	return this.options.padding.left + (x - this.xaxis.min) * this.xScale;
};
lineGraph.prototype.getY = function(y)
{
	return this.options.padding.top + this.drawHeight - (y - this.yaxis.min) * this.yScale;
};

lineGraph.prototype.render = function()
{
  	this.canvas.clearRect(0, 0, this.options.clearWidth, this.options.clearHeight);
	this.canvas.save();
	
	this.prepareLines();
	
	
	this.lines.each(function(l)
	{
		this.canvas.strokeStyle = l.stroke;
		this.canvas.fillStyle = l.fill;
		this.canvas.lineWidth = l.width;
		//this.canvas.lineJoin = 'round';
		
		this.canvas.beginPath();
		
		var first = false;
		var last = false;
		l.data.each(function(d)
		{
			if (!first)
			{
				this.canvas.moveTo(this.getX(d.x), this.getY(d.y));
				first = d;
			}
			else
			{
				this.canvas.lineTo(this.getX(d.x), this.getY(d.y));
			}
			last = d;
		}.bind(this));
		
		this.canvas.stroke();
		if (l.fill)
		{
			this.canvas.lineTo(this.getX(last.x), this.options.renderHeight);
			this.canvas.lineTo(this.getX(first.x), this.options.renderHeight);
			this.canvas.fill();
		}
		
		//this.canvas.globalCompositeOperation = 'destination-out';
		
	}.bind(this));
	
	
	if (this.options.padding.top || this.options.padding.bottom || this.options.padding.left || this.options.padding.right)
	{
		this.canvas.clearRect(0, 0, this.options.renderWidth, this.options.padding.top);
		this.canvas.clearRect(0, 0, this.options.padding.left, this.options.renderHeight);
		this.canvas.clearRect(this.options.renderWidth - this.options.padding.right, 0, this.options.padding.right, this.options.renderHeight);
		this.canvas.clearRect(0, this.options.renderHeight - this.options.padding.bottom, this.options.renderWidth, this.options.padding.bottom);
	}
	
  	this.canvas.restore();
};



/*

function lineGraph(graph, options)
{
	this.graph = graph;
	this.options = options;
	
	this.height = options.height ? options.height : 100;
	this.width = options.width ? options.width : 320;
	this.paddingLeft = options.paddingLeft ? options.paddingLeft : 0;
	this.paddingTop = options.paddingTop ? options.paddingTop : 0;
	this.paddingBottom = options.paddingBottom ? options.paddingBottom : 0;
	this.paddingRight = options.paddingRight ? options.paddingRight : 0;
	this.leftScale = options.leftScale ? options.leftScale : false;
	this.bottomScale = options.bottomScale ? options.bottomScale : false;
	this.topValue = options.topValue ? options.topValue : 0;
	this.bottomValue = options.bottomValue ? options.bottomValue : 999999;
	
	this.canvas = this.graph.getContext('2d');
	
	this.defaultLine =
	{
		strokeStyle: "rgba(0, 0, 0, 1)",
		fillStyle: false,
		lineWidth: 2
	};
	
	this.lines = []; 
	
};

lineGraph.prototype.changeDimenstions = function(width, height)
{
	this.height = height;
	this.width = width;
}
lineGraph.prototype.resetTopBottomValue = function()
{
	this.topValue = 0;
	this.bottomValue = 999999;
}

lineGraph.prototype.setLine = function(data, options)
{
	if (!options.top || !options.bottom)
	{
		var top = 0;
		var bottom = 999999;
		
		for (var d = 0; d < data.length; d++)
		{
			if (data[d] !== false)
			{
				if (top < data[d].value) top = data[d].value;
				if (bottom > data[d].value) bottom = data[d].value;
			}
		}
	
		if (this.topValue < top) this.topValue = top;
		if (this.bottomValue > bottom) this.bottomValue = bottom;
	}
	else
	{
		if (this.topValue < options.top) this.topValue = options.top;
		if (this.bottomValue > options.bottom) this.bottomValue = options.bottom;
	}
	
	
	
	var tmpLine =
	{
		data: data,
		vertical:
		{
			top: options.top ? options.top : top,
			bottom: options.bottom ? options.bottom : bottom
		},
		strokeStyle: options.strokeStyle ? options.strokeStyle : this.defaultLine.strokeStyle,
		fillStyle: options.fillStyle ? options.fillStyle : this.defaultLine.fillStyle,
		lineWidth: options.lineWidth ? options.lineWidth : this.defaultLine.lineWidth
	};
	
	if (this.topValue == this.bottomValue)
		this.topValue++;
	
	this.lines.push(tmpLine);
}
lineGraph.prototype.clearLines = function()
{
	this.lines = [];
}

lineGraph.prototype.scaleData = function()
{
}

lineGraph.prototype.render = function()
{
  	this.canvas.clearRect(0, 0, 480, 480);
	this.canvas.save();
	
	this.graphHeight = (this.height - (this.paddingTop + this.paddingBottom));
	this.graphWidth = (this.width - (this.paddingLeft + this.paddingRight));
	
	this.scaleData();
	
	for (var line = 0; line < this.lines.length; line++)
	{
		this.canvas.strokeStyle = this.lines[line].strokeStyle;
		this.canvas.fillStyle = this.lines[line].fillStyle;
		this.canvas.lineWidth = this.lines[line].lineWidth;
		
		var segmentLength = this.graphWidth / (this.lines[line].data.length-1);
		
		var first = false
		var start = 0;
		while (first === false && start < this.lines[line].data.length)
		{
			first = this.lines[line].data[start];
			start++;
		}
		
		if (start < this.lines[line].data.length)
		{
			this.canvas.beginPath();
			this.canvas.moveTo(((start-1) * segmentLength) + this.paddingLeft, (this.graphHeight - (this.graphHeight / (this.topValue - this.bottomValue)) * (first.value - this.bottomValue)) + this.paddingTop);
			
			var last = first;
			for (var d = start; d < this.lines[line].data.length; d++)
			{
				var crnt = this.lines[line].data[d];
				if (crnt !== false)
				{
					this.canvas.lineTo((((d-1) * segmentLength) + segmentLength) + this.paddingLeft, (this.graphHeight - (this.graphHeight / (this.topValue - this.bottomValue)) * (crnt.value - this.bottomValue)) + this.paddingTop);
					last = crnt;
				}
			}
			
			if (this.lines[line].fillStyle)
			{
				this.canvas.lineTo(this.graphWidth+5 + this.paddingLeft, (this.graphHeight - (this.graphHeight / (this.topValue - this.bottomValue)) * (last.value - this.bottomValue)) + this.paddingTop);
				this.canvas.lineTo(this.graphWidth+5 + this.paddingLeft, this.graphHeight+5+this.paddingTop);
				this.canvas.lineTo(((start-1) * segmentLength) + this.paddingLeft, this.graphHeight+5+this.paddingTop);
				this.canvas.fill();
			}
			this.canvas.stroke();
			
		}
		
	}
	
	if (this.paddingLeft || this.paddingTop || this.paddingRight || this.paddingBottom)
	{
		this.canvas.clearRect(0, 0, this.width, this.paddingTop);
		this.canvas.clearRect(0, 0, this.paddingLeft, this.height);
		this.canvas.clearRect(this.width-this.paddingRight, 0, this.paddingRight, this.height);
		this.canvas.clearRect(0, this.height-this.paddingBottom, this.width, this.paddingBottom);
	}
	
  	this.canvas.restore();
};

*/


// Local Variables:
// tab-width: 4
// End:
