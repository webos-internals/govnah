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
	
	this.lines.push(tmpLine);
}
lineGraph.prototype.clearLines = function()
{
	this.lines = [];
}

lineGraph.prototype.render = function()
{
  	this.canvas.clearRect(0, 0, 480, 480);
	this.canvas.save();
	
	for (var line = 0; line < this.lines.length; line++)
	{
		this.canvas.strokeStyle = this.lines[line].strokeStyle;
		this.canvas.fillStyle = this.lines[line].fillStyle;
		this.canvas.lineWidth = this.lines[line].lineWidth;
		
		this.graphHeight = (this.height - (this.paddingTop + this.paddingLeft));
		this.graphWidth = (this.width - (this.paddingLeft + this.paddingRight));
		
		var segmentLength = this.graphWidth / this.lines[line].data.length;
		
		var first = false
		var start = 0;
		while (first === false && start < this.lines[line].data.length)
		{
			first = this.lines[line].data[start];
			start++;
		}
		start--;
		
		if (start < this.lines[line].data.length)
		{
			this.canvas.beginPath();
			this.canvas.moveTo((start * segmentLength) + this.paddingLeft, (this.graphHeight - (this.graphHeight / (this.lines[line].vertical.top - this.lines[line].vertical.bottom)) * (first.value - this.lines[line].vertical.bottom)) + this.paddingTop);
			
			var last = first;
			for (var d = start; d < this.lines[line].data.length; d++)
			{
				var crnt = this.lines[line].data[d];
				if (crnt !== false)
				{
					this.canvas.lineTo(((d * segmentLength) + segmentLength) + this.paddingLeft, (this.graphHeight - (this.graphHeight / (this.lines[line].vertical.top - this.lines[line].vertical.bottom)) * (crnt.value - this.lines[line].vertical.bottom)) + this.paddingTop);
					last = crnt;
				}
			}
			
			if (this.lines[line].fillStyle)
			{
				this.canvas.lineTo(this.graphWidth+5 + this.paddingLeft, (this.graphHeight - (this.graphHeight / (this.lines[line].vertical.top - this.lines[line].vertical.bottom)) * (last.value - this.lines[line].vertical.bottom)) + this.paddingTop);
				this.canvas.lineTo(this.graphWidth+5 + this.paddingLeft, this.graphHeight+5+this.paddingTop);
				this.canvas.lineTo((start * segmentLength) + this.paddingLeft, this.graphHeight+5+this.paddingTop);
				this.canvas.fill();
			}
			this.canvas.stroke();
		}
		
		if (this.paddingLeft || this.paddingTop || this.paddingRight || this.paddingBottom)
		{
			this.canvas.clearRect(0, 0, this.width, this.paddingTop);
			this.canvas.clearRect(0, 0, this.paddingLeft, this.height);
			this.canvas.clearRect(this.width-this.paddingRight, 0, this.paddingRight, this.height);
			this.canvas.clearRect(0, this.height-this.paddingBottom, this.width, this.paddingBottom);
		}
		
	}
	
  	this.canvas.restore();
};


// Local Variables:
// tab-width: 4
// End:
