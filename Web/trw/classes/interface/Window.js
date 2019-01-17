Window.HEADER_HEIGHT = 12;

function Window(){
	this.frame = new Rectangle();
	
	this.setFrame = this._setFrame;
	this.draw = this._draw;
}


Window.prototype._setFrame = function(frame){
	this.frame = frame;
}

Window.prototype._draw = function(){
	this.drawBackground();
}

Window.prototype.drawBackground = function(){
	
	context.fillStyle = Panel.BACKGROUND_COLOR;
	context.fillRect(this.frame.x-4, this.frame.y-6, this.frame.width+6, this.frame.height+Window.HEADER_HEIGHT);
	
	context.fillStyle = 'rgb(160,160,160)';
	context.fillRect(this.frame.x-4, this.frame.y-Window.HEADER_HEIGHT-6, this.frame.width+6, Window.HEADER_HEIGHT);
	
	if(this==header) return;
	
	DrawTexts.setContextTextProperties('white', 10, LOADED_FONT);
	context.fillText(this.name.toUpperCase(), this.frame.x, this.frame.y-Window.HEADER_HEIGHT-5);
}

Window.prototype.changeHeight = function(){
	resizeWindow();
}
