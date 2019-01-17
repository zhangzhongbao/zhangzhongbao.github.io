function Panel(){
	this.frame = new Rectangle(0,0,300,0);
	
	this.bottomWindows;
}

Panel.BACKGROUND_COLOR = 'rgb(240,240,240)';

Panel.prototype.init = function(){
	header = new Header();
	dialogue = new Dialogue();
	timeWidget = new TimeWidget();
	networkInfo = new NetworkInfo();
	layout = new Layout();
	interaction = new InteractionGuide();
	
	this.windowsList = [
		header,
		dialogue,
		timeWidget,
		networkInfo,
		layout,
		interaction
	];
}

Panel.prototype.setFrame = function(frame){
	if(this.windowsList ==null) return;
	
	var y0 = 0;
	var window;
	for(var i=0; this.windowsList[i]!=null; i++){
		window = this.windowsList[i];
		window.setFrame(new Rectangle(frame.x+4, y0, frame.width - 6, window.frame.height));
		y0+=window.frame.height+Window.HEADER_HEIGHT;
	}
	
	this.bottomWindows = window.frame.getBottom();
	
	this.frame = frame;
}

Panel.prototype.draw = function(){
	this.drawBackground();
	
	for(var i=0; this.windowsList[i]!=null; i++){
		this.windowsList[i].draw();
	}
}

Panel.prototype.drawBackground = function(){
	context.fillStyle = Panel.BACKGROUND_COLOR;
	context.fillRect(this.frame.x, this.bottomWindows, this.frame.width, this.frame.height-this.bottomWindows);
	
	return;
	
	context.fillStyle = 'white';
	context.fillRect(this.frame.x, this.frame.y, this.frame.width, this.frame.height);
	
	context.strokeStyle = 'black';
	context.lineWidth = 4;
	context.beginPath();
	context.moveTo(this.frame.x, this.frame.y);
	context.lineTo(this.frame.x, this.frame.getBottom());
	context.stroke();
}