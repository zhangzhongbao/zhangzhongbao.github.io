Dialogue.prototype = new Window();

function Dialogue(){
	this.name = 'dialogues';
	
	this.node0;
	this.node1;
	
	this.tweetsTable;
	
	this.textBoxes;
	
	this.path;
	
	this.image;
	
	this.to = false;
	this.from = false;
	
	this.setNodes(null, null);
}

Dialogue.prototype.setNodes = function(node0, node1){
	var prevFrame = this.frame.clone();
	this.frame = new Rectangle(0,0,this.frame.width, this.frame.height);
	
	if(node0==null || node1==null){
		this.frame.height = prevFrame.height = 80;
		
		//this.image = Draw.drawAndCapture(this.drawConversation, this.frame, this);
		this.image = drawAndcapture(this.drawConversation, this.frame.width, this.frame.height, this);
		this.frame = prevFrame;
		
		this.changeHeight();

		return;
	}
	
	this.node0 = node0;
	this.node1 = node1;
	
	this.tweetsTable = getTweetsBetweenTwoAccounts(node0, node1);
	
	this.textBoxes = new List();
	
	var wT = this.frame.width - 32;
	var y0 = this.frame.y + 70;
	var textBox;
	for(var i=0; this.tweetsTable[0][i]!=null; i++){
		textBox = new TextBox({
			text:this.tweetsTable[1][i],
			fontSize:13,
			width:wT,
			x:!this.tweetsTable[2][i]?this.frame.x:(this.frame.getRight()-wT),
			y:y0
		});
		textBox.to = this.tweetsTable[2][i];
		y0+=textBox.height+30;
		this.textBoxes.push(textBox);
	}
	
	this.frame.height = prevFrame.height = 10+y0- this.frame.y;
	
	
	
	//
	this.path = NetworkOperators.shortestPath(network, node0, node1);
	
	
	c.log("CAPTURE CONVERSATION");
	this.image = drawAndcapture(this.drawConversation, this.frame.width, this.frame.height, this);
	//this.image = Draw.drawAndCapture(this.drawConversation, this.frame, this);
	this.frame = prevFrame;
	
	this.changeHeight();
}

Dialogue.prototype.draw = function(){
	this._draw();
	if(this.image!=null) drawImage(this.image, this.frame.x, this.frame.y);
	this.drawThumbnails();
}

Dialogue.prototype.drawConversation = function(){
	
	if(!connected) {
		DrawTexts.setContextTextProperties('black', 12);
		
		context.fillText('to select a dialogue:', this.frame.x+10, this.frame.y);
		context.fillText('-hold node 0.5s', this.frame.x+10, this.frame.y+20);
		context.fillText('-drag to another node', this.frame.x+10, this.frame.y+40);
		
		return;
	}
	
	var indexTo = this.node0.toNodeList.indexOf(this.node1);
	this.to = indexTo!=-1;
	var indexFrom = this.node1.toNodeList.indexOf(this.node0);
	this.from = indexFrom!=-1;
	var relation = this.node0.toRelationList[indexTo];
	var i;
	
		
	if(this.from || this.to){
		setText(COLOR_TO, 10);
		fText(relation==null?'0':relation.weight, this.frame.x + 48, this.frame.y + 35);
		
		relation = this.node1.toRelationList[indexFrom];
		
		setText(COLOR_FROM, 10, LOADED_FONT, 'right');
		fText(relation==null?'0':relation.weight, this.frame.getRight()-47, this.frame.y + 6);

		drawRelationsBetweenImages(this.node0, this.node1, this.frame.x+45, this.frame.y+3, this.frame.getRight()-45, 42);
	}
	
	if(!this.to && !this.from){
		setText('black', 12);
		fText('no conversations', this.frame.x + 55, this.frame.y+2);
		
		var sp = ((this.frame.width - 90) - 21*this.path.length)/(this.path.length+1);
		var dX = sp+21;
		
		var x0 = this.frame.x+45-11 + dX;
		var y0 = this.frame.y+25;
		//var im;
		//setFill('rgb(200,200,200)');
		for(i=0; this.path[i]!=null; i++){
			// im = this.path[i].image;
			// if(im==null){
				// fRect(x0 + i*dX-11, y0, 21, 21);
			// } else {
				// //drawImage(this.path[i].image, x0 + i*dX-11, y0, 21, 21); //////////[!]
			// }
			if(i==0){
				drawRelationsBetweenImages(this.node0, this.path[i], this.frame.x+45, y0, this.frame.x+45+sp, 21);
			}
			drawRelationsBetweenImages(this.path[i], i<this.path.length-1?this.path[i+1]:this.node1, x0 + i*dX+11, y0, x0 + i*dX+11+sp, 21);
		}
	}
	
	
	if(this.node0.image==null){
		setFill('rgb(200,200,200)');
		fRect(this.frame.x+3, this.frame.y+3, 42, 42)
	} else {
		//context.drawImage(this.node0.image, this.frame.x+3, this.frame.y+3, 42, 42); //////////[!]
	}
	if(this.node1.image==null){
		setFill('rgb(200,200,200)');
		fRect(this.frame.getRight()-45, this.frame.y+3, 42, 42)
	} else {
		//context.drawImage(this.node1.image, this.frame.getRight()-45, this.frame.y+3, 42, 42); //////////[!]
	}
	
	context.strokeStyle = 'gray';
	
		
	var textBox;
	for(var i=0; this.textBoxes[i]!=null; i++){
		textBox = this.textBoxes[i];
		textBox.draw();
		
		if(textBox.to && this.node0.image!=null){
			//context.drawImage(this.node0.image, this.frame.x+2, textBox.y+2, 28, 28); //////////[!]
		} else if(this.node1.image!=null){
			//context.drawImage(this.node1.image, this.frame.getRight()-30, textBox.y+2, 28, 28); //////////[!]
		}
		
		context.lineWidth = 1;
		context.beginPath();
		context.moveTo(this.frame.x, textBox.y - 4.5);
		context.lineTo(this.frame.getRight(), textBox.y - 4.5);
		context.stroke();
	}
}
Dialogue.prototype.drawThumbnails = function(){
	if(!connected) return;
	
	if(!this.to && !this.from){
		
		var sp = ((this.frame.width - 90) - 21*this.path.length)/(this.path.length+1);
		var dX = sp+21;
		
		var x0 = this.frame.x+45-11 + dX;
		var y0 = this.frame.y+25;
		var im;
		setFill('rgb(200,200,200)');
		for(i=0; this.path[i]!=null; i++){
			im = this.path[i].image;
			if(im==null){
				fRect(x0 + i*dX-11, y0, 21, 21);
			} else {
				drawImage(this.path[i].image, x0 + i*dX-11, y0, 21, 21); //////////[!]
			}
		}
	}
	if(this.node0.image!=null){
		context.drawImage(this.node0.image, this.frame.x+3, this.frame.y+3, 42, 42); //////////[!]
	}
	if(this.node1.image!=null){
		context.drawImage(this.node1.image, this.frame.getRight()-45, this.frame.y+3, 42, 42); //////////[!]
	}
	var textBox;
	for(var i=0; this.textBoxes[i]!=null; i++){
		textBox = this.textBoxes[i];
		
		if(textBox.to && this.node0.image!=null){
			context.drawImage(this.node0.image, this.frame.x+2, textBox.y+2+this.frame.y, 28, 28); //////////[!]
		} else if(this.node1.image!=null){
			context.drawImage(this.node1.image, this.frame.getRight()-30, textBox.y+2+this.frame.y, 28, 28); //////////[!]
		}
	}
}
