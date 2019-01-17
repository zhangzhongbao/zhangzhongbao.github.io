var prev_mX = 0;
var prev_mY = 0;
var follow_mX = 0;
var follow_mY = 0;

var dragging = false;
var reScaling = false;
var followingSelected = false;
var selecting = false;
var connected = false;

var frame = new Rectangle();

var q = 0;
var q2 = q+1;
var k = 0.03;
var qFinal;

var centerX;
var centerY;

var space2D;

initSpace = function(){
	q = configuration.initialFishEye==null?0:configuration.initialFishEye;
	q2 = q+1;
	
	space2D = new Space2D();
	space2D.scale = configuration.initialScale;
}

cycleSpace = function(){
	if(reScaling){
		q = 0.8*q + 0.2*qFinal;
		q2 = q+1;
		if(Math.abs(scale-scaleFinal)<0.01) reScaling=false;
	}
	
	if(dragging){
		
		space2D.move(new Point(mX-prev_mX, mY-prev_mY), true);
		follow_mX = mX;
		follow_mY = mY;
		
		if(nodeOver!=null && mPPressed.distanceToPoint(mP)<2 && nF-nFDown>5){
			selecting = true;
			nodeSelectedForConnection = nodeOver;
			dragging = false;
			connected = false;
			dialogue.setNodes();
		}
		
	} else {
		if(followingSelected){
			space2D.center.x = 0.95*space2D.center.x + 0.05*nodeSelected.tx;
			space2D.center.y = 0.95*space2D.center.y + 0.05*nodeSelected.ty;
			
			if(Math.pow(space2D.center.x-nodeSelected.tx,2)+Math.pow(space2D.center.y-nodeSelected.ty,2)<1) followingSelected=false;
		}
		
		follow_mX = 0.8*follow_mX + 0.2*mX;
		follow_mY = 0.8*follow_mY + 0.2*mY;
	}
	
	prev_mX = mX;
	prev_mY = mY;
}

changePositions = function(newMode){
	c.log('newMode:', newMode);
	
	if(positionsMode==newMode) return;
	positionsMode = newMode;
	
	//var polygon = positionsMode=='0'?positionsForces.clone():positionsClusters.clone();
	
	switch(positionsMode){
		case 0:
			for(var i=0; network.nodeList[i]!=null; i++){
				network.nodeList[i].x = network.nodeList[i].fx = network.nodeList[i].forcesPosition.x;
				network.nodeList[i].y = network.nodeList[i].fy = network.nodeList[i].forcesPosition.y;
			}
			break;
		case 1:
			for(var i=0; network.nodeList[i]!=null; i++){
				network.nodeList[i].x = network.nodeList[i].fx = network.nodeList[i].clusterPosition.x;
				network.nodeList[i].y = network.nodeList[i].fy = network.nodeList[i].clusterPosition.y;
			}
			break;
	}
	
	nodeSelected = null;
	followingSelected = false;
	newColorsFromDegrees(null);
}



//transformation

fishEye = function(x, y){
	x = space2D.projectX(x);
	y = space2D.projectY(y);
	
	var vx = x+centerX-follow_mX;
	var vy = y+centerY-follow_mY;
	var norm = Math.sqrt(Math.pow(vx, 2)+Math.pow(vy, 2));
	var factor = (norm + (q*norm/(1+(Math.pow(k*norm,2)))))/norm;
	
	return new Point3D(follow_mX+vx*factor, follow_mY+vy*factor, factor);
}