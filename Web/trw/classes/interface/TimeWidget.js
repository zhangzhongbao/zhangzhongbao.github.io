TimeWidget.prototype = new Window();

function TimeWidget(){
	this.name = 'time simulation';
	
	this.animationActive = false;
	
	this.onButton;
	this.frame = new Rectangle(0,0,0,30);
	
	this.s = 10;
	
	this.maxHeight = 500;
	
	this.t = timeMin;
	this.tV = 1000*60*15;
	
	this.textBoxes;
	
	this.speedScroll = new SpeedScroll();
	
	addInteractionEventListener('mousedown', this.onMouse, this);
}

TimeWidget.prototype.preProcess = function(){
	this.distribution = ListGenerators.createListWithSameElement(100, 0);
	var index;
	for(var i=0;tweetsTimes[i]!=null; i++){
		index = Math.floor(99.99*(tweetsTimes[i]-timeMin)/(timeMax-timeMin))
		this.distribution[index]++;
	}
	
	this.distribution = this.distribution.getNormalizedToMax();
	this.distributionColors = new ColorList();
	for(i=0; this.distribution[i]!=null; i++){
		this.distributionColors[i] = 'rgb('+Math.floor(255*(1-this.distribution[i]))+','+Math.floor(255*(1-this.distribution[i]))+','+Math.floor(255*(1-this.distribution[i]))+')'
	}
		
}

TimeWidget.prototype.onMouse = function(e){
	if(this.onStop){
		subRelations = new RelationList();
		this.animationActive = false;
		cycleOnMouseMovement(true);
		startCycle();
	} else if(this.onPlay){
		this.t = timeMin;
		this.animationActive = true;
		cycleOnMouseMovement(false);
		startCycle();
	}
	
	this.frame.height = this.animationActive?this.maxHeight:30;
	this.changeHeight();
}

TimeWidget.prototype.changedSubtweets = function(subTweets){
	var wT = this.frame.width;
	var y0 = this.frame.y + 40;
	this.textBoxes = new List();
	var textBox;
	for(var i=0; subTweets[i]!=null; i++){
		textBox = new TextBox({
			text:subTweets[i],
			fontSize:12,
			width:wT-15,
			x:this.frame.x+15,
			y:y0
		});
		y0+=textBox.height+20;
		this.textBoxes.push(textBox);
		if(y0>this.frame.getBottom()) break;
	}
}

TimeWidget.prototype.draw = function(){
	this._draw();
	
	this.onStop = this.drawStop();
	this.onPlay = this.drawPlay();
	
	this.onButton = this.onStop || this.onPlay;
	
	this.speedScroll.x = this.frame.x + 50;
	this.speedScroll.y = this.frame.y + 11;
	this.speedScroll.draw();
	
	if(!this.animationActive || sortedRelations==null) return;
	
	
	///////play
	
	this.tV = this.speedScroll.t*2000*60*15;
	
	//subNodes = new NodeList();
	subRelations = new RelationList();
	var subTweets = new StringList();
	
	var node0;
	var node1;
	var index=-1;
	var y;
	var subRelation;
	
	var H = this.frame.height-50;
	
	var dY = H/100;
	
	for(var i=0; this.distribution[i]!=null; i++){
		context.fillStyle = this.distributionColors[i];
		fRect(this.frame.x, this.frame.y + 40 + i*dY, 5, dY);
	}
	
	setStroke('rgba(0,0,0,0.05)');
	setLW(0.2);
	for(i=0;tweetsTimes[i]!=null; i++){
		if(index==-1 && this.t<tweetsTimes[i]){
			index = i;
			break;
		}
	}
	
	var limit = Math.min(sortedRelations.length, index+25);
	
	setStroke('red');
	setLW(1);
	y = Math.floor(H*(this.t-timeMin)/(timeMax-timeMin)+this.frame.y)+40.5;
	line(this.frame.x-2, y,
			this.frame.x+8, y);
			
	y = Math.floor(H*(tweetsTimes[limit-1]-timeMin)/(timeMax-timeMin)+this.frame.y)+40.5;
	line(this.frame.x-2, y,
			this.frame.x+8, y);
	
	for(i=index; i<limit; i++){
		subRelation = sortedRelations[i];
		subRelations.push(subRelation);
		
		node0 = subRelation.node0;
		node1 = subRelation.node1;
		
		node0.tx = 0.99*node0.tx + 0.01*node1.tx;
		node0.ty = 0.99*node0.ty + 0.01*node1.ty;
		
		node1.tx = 0.98*node1.tx + 0.02*node0.tx;
		node1.ty = 0.98*node1.ty + 0.02*node0.ty;
		
		//if(i<3) subNodes.push(node0);
		subTweets.push(tweets[i]);
	}
	
	var date = new Date(tweetsTimes[index]);
	var minutes = String(date.getMinutes());
	if(minutes.length==1) minutes = "0"+minutes;
	
	setText('black', 10);
	fText(DateOperators.dateToString(date)+" "+(date.getHours()+1)+":"+minutes, this.frame.x + 170, this.frame.y + 5);
	
	this.t+=this.tV;
	if(this.t>timeMax) this.t = timeMin;
	
	this.changedSubtweets(subTweets);
	
	setStroke('black');
	var textBox;
	for(var i=0; this.textBoxes[i]!=null; i++){
		textBox = this.textBoxes[i];
		textBox.draw();
		
		context.lineWidth = 1;
		line(this.frame.x+15, textBox.y - 4.5, this.frame.getRight(), textBox.y - 4.5);
	}
}

TimeWidget.prototype.drawStop = function(){
	context.fillStyle = 'gray';
	context.fillRect(this.frame.x+10, this.frame.y+5, this.s, this.s);
	return mY>this.frame.y+5 && mY<this.frame.y+5+this.s && mX>this.frame.x+10 && mX<this.frame.x+this.s+10;
}

TimeWidget.prototype.drawPlay = function(){
	var x = this.frame.x+this.s*1.3+10;
	context.fillStyle = this.animationActive?'orange':'gray';
	context.beginPath();
	Draw.drawEquilateralTriangle(context, x+this.s*0.5, this.frame.y+5+this.s*0.5, this.s*0.5, 0);
	context.fill();
	
	return mY>this.frame.y+5 && mY<this.frame.y+5+this.s && mX>x && mX<x+this.s;
}