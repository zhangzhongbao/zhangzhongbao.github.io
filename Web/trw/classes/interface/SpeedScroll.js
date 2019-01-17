function SpeedScroll(){
	this.x;
	this.y;
	
	this.width = 100;
	
	this.t = 0.2;
	
	this.mouseOn;
	
	this.dragDetection = new DragDetection({
		listenerFunction:this.dragging, 
		target:this, 
		areaVerificationFunction:this.areaVerificationFunction
	});
	
	this.inactive = false;
}


SpeedScroll.prototype.draw = function(){
	if(this.inactive) return;
	
	context.strokeStyle = 'black';
	context.lineWidth = 1;
	
	context.beginPath();
	context.moveTo(this.x, this.y);
	context.lineTo(this.x+this.width, this.y);
	context.stroke();
	
	context.fillStyle = 'rgb(100,100,100)';
	context.beginPath();
	context.arc(this.x + this.t*this.width, this.y, 4, 0, TwoPi);
	context.fill();
	
	this.mouseOn = this.mouseOnScroll();
	if(this.mouseOn) canvas.style.cursor = 'pointer';
}


SpeedScroll.prototype.mouseOnScroll = function(){
	return mY>this.y-4 && mY<this.y+4 && mX>this.x-4 && mX <this.x+this.width+4;
}


SpeedScroll.prototype.dragging = function(){
	this.t = Math.max(Math.min((mX-this.x)/this.width, 1), 0);
	
	c.log(this.t);
}
SpeedScroll.prototype.areaVerificationFunction = function(){
	return this.mouseOn;
}