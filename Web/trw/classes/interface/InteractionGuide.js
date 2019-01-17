InteractionGuide.prototype = new Window();

function InteractionGuide(){
	this.name = 'interaction guide';
	
	this.frame.height = 200;
	
}


InteractionGuide.prototype.setFrame = function(frame){
	this._setFrame(frame);
	
}

InteractionGuide.prototype.draw = function(){
	this._draw();
	
	DrawTexts.setContextTextProperties('black', 12);
	
	var y0=0;
	if(selecting){
		context.fillText('→ release on other node to see dialogues', this.frame.x+5, this.frame.y)
	} else {
		if(nodeOver==null){
			context.fillText('→ hover nodes to get info', this.frame.x+5, this.frame.y);
			context.fillText('→ click nodes to select', this.frame.x+5, this.frame.y+16);
			y0=32;
		} else {
			context.fillText('→ click to select', this.frame.x+5, this.frame.y);
			context.fillText('→ hold to see dialogues with other nodes', this.frame.x+5, this.frame.y+16);
			y0=32;
		}
		if(nodeSelected!=null){ context.fillText('→ click on space to deselect node', this.frame.x+5, this.frame.y+y0); y0+=16}
		if(connected) {context.fillText('→ click on space to release selection', this.frame.x+5, this.frame.y+y0); y0+=16};
		context.fillText('→ drag space to move', this.frame.x+5, this.frame.y+y0);
		y0+=16;
		context.fillText('→ wheel to zoom', this.frame.x+5, this.frame.y+y0);
		y0+=16;
		
	}
	
	
}