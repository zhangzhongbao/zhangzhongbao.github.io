NetworkInfo.prototype = new Window();

function NetworkInfo(){
	this.name = 'network and nodes metrics';
	
	this.frame.height = 125;
	this.inDegreeDistribution = new NumberList();
	this.outDegreeDistribution = new NumberList();
	
	this.maxIn;
	this.maxOut;
	this.max;
	
	this.disImage;
}

NetworkInfo.prototype.preProcess = function(){
	this.textNet = network.nodeList.length+" nodes, "+network.relationList.length+" relations";
	
	var ind;
	var out;
	
	for(var i=0; network.nodeList[i]!=null; i++){
		ind = network.nodeList[i].toNodeList.length;
		out = network.nodeList[i].fromNodeList.length;
		
		if(this.inDegreeDistribution[ind]==null){
			this.inDegreeDistribution[ind]=1;
		} else {
			this.inDegreeDistribution[ind]++;
		}
		
		if(this.outDegreeDistribution[out]==null){
			this.outDegreeDistribution[out]=1;
		} else {
			this.outDegreeDistribution[out]++;
		}
	}
	var l = Math.max(this.inDegreeDistribution.length, this.outDegreeDistribution.length);
	
	this.maxIn = 0;
	this.maxOut = 0;
	
	for(i=0; i<l; i++){
		if(this.inDegreeDistribution[i]==null) this.inDegreeDistribution[i]=0;
		if(this.outDegreeDistribution[i]==null) this.outDegreeDistribution[i]=0;
		this.maxIn  = Math.max(this.maxIn,  this.inDegreeDistribution[i]);
		this.maxOut = Math.max(this.maxOut, this.outDegreeDistribution[i]);
	}
	
	this.max = Math.max(this.maxIn, this.maxOut);
	
	setTimeout(NetworkInfo.drawDegreesDistributionBounce, 30);
	
}

NetworkInfo.drawDegreesDistributionBounce = function(){
	networkInfo.drawDegreesDistribution();
}

NetworkInfo.prototype.drawDegreesDistribution = function(){
	var frameD = new Rectangle(20, 6, this.frame.width-40, 70);
	
	var defaultContext = context;
	context = hiddenContext;
	context.canvas.setAttribute('width', frameD.getRight()+10);
    context.canvas.setAttribute('height', frameD.getBottom()+20);
	context.clearRect(0,0,frameD.getRight()+10, frameD.getBottom()+20);
	
	setStroke('black');
	setLW(0.5);
	sLines(
		frameD.x-0.5,frameD.y,
		frameD.x-0.5,frameD.getBottom()+0.5,
		frameD.getRight(),frameD.getBottom()+0.5
	);
	
	var i=1;
	var dX = frameD.width/this.inDegreeDistribution.length;
	var dY = frameD.height/Math.log(this.max);
	
	setText('rgb(120,120,120)', 9, LOADED_FONT);
	DrawTexts.fillTextRotated('degree', frameD.x+1.5, frameD.getBottom()-3.5, -HalfPi);
	
	setText('rgb(120,120,120)', 9, LOADED_FONT, 'right');
	fText('n nodes', frameD.getRight()-7.5, frameD.getBottom()-12.5);
	
	
	setText('black', 9, LOADED_FONT, 'right', 'middle');
	while(i<this.max){
		fText(String(i), frameD.x-4, frameD.getBottom() - dY*Math.log(i));
		i*=4;
	}
	fText(String(this.max), frameD.x-4, frameD.getBottom() - dY*Math.log(this.max));
	
	
	setText('black', 9, LOADED_FONT, 'center');
	var x;
	for(i=0; this.inDegreeDistribution[i]!=null; i++){
		x = i*dX+frameD.x;
		setFill(COLOR_TO);
		if(this.inDegreeDistribution[i]>0) fCircle(x, frameD.getBottom() - dY*Math.log(this.inDegreeDistribution[i]), 2);
		
		setFill(COLOR_FROM);
		if(this.outDegreeDistribution[i]>0) fCircle(x, frameD.getBottom() - dY*Math.log(this.outDegreeDistribution[i]), 2);
		
		if(i%25==0){
			setFill('black');
			fText(i, x, frameD.getBottom()+2);
		}
	}
	
	this.disImage = new Image();
	this.disImage.src = context.canvas.toDataURL();
	
	context = defaultContext;
}

NetworkInfo.prototype.draw = function(){
	this._draw();
	
	if(network==null) return;
	
	setText('black', 12);
	fText(this.textNet, this.frame.x+10, this.frame.y);
	
	//
	
	if(this.disImage!=null){
		drawImage(this.disImage, this.frame.x+10, this.frame.y+25);
	}
}