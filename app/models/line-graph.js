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
		lineWidth: 2
	};
	
	this.lines = []; 
	
};

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
				if (top < data[d]) top = data[d];
				if (bottom > data[d]) bottom = data[d];
			}
		}
		
		var split = top - bottom;
		if (split < 5) // hard 5 minimum?
		{
			top = top + (5 - (split % 5));
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
  	this.canvas.clearRect(0, 0, this.width, this.height+1);
	this.canvas.save();
	
	for (var line = 0; line < this.lines.length; line++)
	{
	
		this.canvas.fillStyle = "rgba(170, 170, 170, .15)";
		for (var v = 1; v < (this.lines[line].vertical.top - this.lines[line].vertical.bottom); v = v + 2)
		{
			this.canvas.fillRect(0, (this.height / (this.lines[line].vertical.top - this.lines[line].vertical.bottom)) * v,
								this.width, (this.height / (this.lines[line].vertical.top - this.lines[line].vertical.bottom)));
		}
		
		this.canvas.strokeStyle = this.lines[line].strokeStyle;
		this.canvas.lineWidth = this.lines[line].lineWidth;
		
		var segmentLength = this.width / this.lines[line].data.length;
		
		var last = this.lines[line].data[0];
		for (var d = 0; d < this.lines[line].data.length; d++)
		{
			var crnt = this.lines[line].data[d];
			if (crnt !== false && last !== false)
			{
				this.canvas.beginPath();
				this.canvas.moveTo(d * segmentLength, this.height - (this.height / (this.lines[line].vertical.top - this.lines[line].vertical.bottom)) * (last - this.lines[line].vertical.bottom));
				this.canvas.lineTo((d * segmentLength) + segmentLength, this.height - (this.height / (this.lines[line].vertical.top - this.lines[line].vertical.bottom)) * (crnt - this.lines[line].vertical.bottom));
				this.canvas.stroke();
			}
			last = crnt;
		}
	}
	
  	this.canvas.restore();
};


// Local Variables:
// tab-width: 4
// End:
