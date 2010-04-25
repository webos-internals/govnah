function lineGraph(graph, options)
{
	this.graph = graph;
	this.options = options;
	
	this.height = options.height ? options.height : 100;
	this.width = options.width ? options.width : 320;
	
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
		
		var segmentLength = this.width / this.lines[line].data.length;
		
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
			this.canvas.moveTo(0, this.height - (this.height / (this.lines[line].vertical.top - this.lines[line].vertical.bottom)) * (first.value - this.lines[line].vertical.bottom));
			
			var last = first;
			for (var d = start; d < this.lines[line].data.length; d++)
			{
				var crnt = this.lines[line].data[d];
				if (crnt !== false)
				{
					this.canvas.lineTo((d * segmentLength) + segmentLength, this.height - (this.height / (this.lines[line].vertical.top - this.lines[line].vertical.bottom)) * (crnt.value - this.lines[line].vertical.bottom));
					last = crnt;
				}
			}
			
			if (this.lines[line].fillStyle)
			{
				this.canvas.lineTo(this.width+5, this.height+5);
				this.canvas.lineTo(-5, this.height+5);
				this.canvas.fill();
			}
			this.canvas.stroke();
		}
	}
	
  	this.canvas.restore();
};


// Local Variables:
// tab-width: 4
// End:
