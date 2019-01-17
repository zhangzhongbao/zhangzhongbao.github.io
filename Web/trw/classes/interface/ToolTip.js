function ToolTip(){
	this.node;
	this.frame = new Rectangle(0,0,320,0);
	
	this.wN;
	
	
	this.textBox;
}




ToolTip.prototype.setNode = function(node){
	if(node!=this.node){
		this.node = node;
		
		this.textBox = new TextBox({
			'text':node.description==null?'':node.description,
			'width':300,
			'height':400,
			'fontSize':14
		})
		
		
		this.frame.height = this.textBox.text==''?30:this.textBox.height+30;
		
		DrawTexts.setContextTextProperties('black', 18, 'Arial');
		this.wN = context.measureText(node.longName).width;
	}
}


ToolTip.prototype.draw = function(node, x, y){
	this.setNode(node);
	
	this.frame.x = x + this.frame.height*0.5;
	this.frame.y = y - this.frame.height*0.5;
	this.frame.width = 310;
	
	this.drawBackground();
	
	DrawTexts.setContextTextProperties('black', 18, 'Arial');
	context.fillText(node.longName, this.frame.x+5, this.frame.y+3);
	
	DrawTexts.setContextTextProperties('black', 12, 'Arial');
	context.fillText('@'+node.name, this.frame.x+10+this.wN, this.frame.y+7);
	
	this.textBox.x = this.frame.x + 5;
	this.textBox.y = this.frame.y + 23;
	this.textBox.draw();
}


ToolTip.prototype.drawBackground = function(){
	context.lineWidth = 4;
	context.strokeStyle = 'rgb(80,80,80)';
	context.fillStyle = 'white';
	var hH = Math.floor(this.frame.height*0.5);
	
	var x = this.frame.x - hH;
	var y = this.frame.y + hH;
	
	context.beginPath();
	context.moveTo(x,y);
	context.lineTo(x+hH,y-hH);
	context.lineTo(x+hH+this.frame.width,y-hH);
	context.lineTo(x+hH+this.frame.width,y+hH);
	context.lineTo(x+hH,y+hH);
	context.lineTo(x,y);
	context.fill();
	context.stroke();
}
