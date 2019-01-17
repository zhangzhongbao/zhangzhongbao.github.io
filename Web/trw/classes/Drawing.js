var pOver;
var nodesMoving=false;

drawNodes = function(){
	nodeOver = null;
	nodeClosest = network.nodeList[0];
	dMin = 9999999;
	var node;
	var preMoving = nodesMoving;
	nodesMoving = false;
	
	setStroke(CONNECTION_COLOR);
	setLW(1);
	
	for(var i=0; network.nodeList[i]!=null; i++){
		node = network.nodeList[i];
		
		node.tx = 0.9*node.tx + 0.1*node.fx;
		node.ty = 0.9*node.ty + 0.1*node.fy;
		
		if(Math.abs(node.fx-node.tx)>1 || Math.abs(node.fy-node.ty)>1) nodesMoving=true;
		
		if(drawNode(node, colors[i])) nodeOver=node;
	}
	nodesMoving = nodesMoving || followingSelected;
	
	if(preMoving && !nodesMoving) toGenerateRelationsCapture = true;
	
	if(dMin>2500) nodeClosest = null;
	
	drawPotentialConnection();
}

drawNode = function(node, color){
	//var p = fishEye(node.tx, node.ty);
	var px = space2D.projectX(node.tx)+centerX;//node.tx;
	var py = space2D.projectY(node.ty)+centerY;//node.ty;
	
	//if(p.y<-20  || p.x<-20 || p.y>cH+20 || p.x>frame.width+20) return;
	if(py<-20  || px<-20 || py>cH+20 || px>frame.width+20) return;
	
	//var r = nodeRadius(node, p.z);
	var r = nodeRadius(node, 1);
	
	setFill(node.twitter?color:'white'); //TODO: +efficient (create var fillColor)
	
	switch(configuration.shapeMode){
		case 0://circles
			if(node.image==null || r<4){
				//fCircle(p.x, p.y, r);
				fCircle(px, py, r);
			} else {
				//clipCircle(p.x, p.y, r);
				clipCircle(px, py, r);
				//drawImage(node.image, p.x-r, p.y-r, r*2, r*2);
				drawImage(node.image, px-r, py-r, r*2, r*2);
				restore();
				//sCircle(p.x, p.y, r);
				sCircle(px, py, r);
			}
			
			if(!node.twitter){
				setStroke(color);
				setLW(r*0.4);
				context.stroke();
			}
			break;
		case 1://squares
			if(node.image==null || r<4){
				fRect(p.x-r*0.5, p.y-r*0.5, r, r);
			} else {
				drawImage(node.image, p.x-r, p.y-r, r*2, r*2);
			}
			
			if(!node.twitter){
				//sRect(p.x-r*0.5, p.y-r*0.5, r, r);
				sRect(px-r*0.5, py-r*0.5, r, r);
			}
			break;
		
	}
	
	//var d2 = Math.pow(p.x-mX, 2)+Math.pow(p.y-mY, 2);
	var d2 = Math.pow(px-mX, 2)+Math.pow(py-mY, 2);
	if(d2<dMin){
		nodeClosest = node;
		dMin = d2;
	}
	
	var over = d2<Math.pow(r+3, 2);
	if(over){
		//pOver = new Point3D(p.x,p.y,r);
		pOver = new Point3D(px,py,r);
		canvas.style.cursor = 'pointer';
	}
	
	return over;
}

nodeRadius = function(node, z){
	return node.r*z*space2D.scale*0.4;//*(node.twitter?1:0.5)*Math.log(z+1)*space2D.scale*(subNodes.indexOf(node)==-1?1:2);
}


drawToolTip = function(){
	if(nodeOver!=null) tootlTip.draw(nodeOver, pOver.x+pOver.z*0.5, pOver.y);
}

drawLabel = function(node, x, y){
	setLW(4);
	setStroke('rgb(80,80,80)');
	
	DrawTexts.setContextTextProperties('white', 18, 'Arial');
	var wT = context.measureText(node.name).width;
	
	fsLines(
		x,y,
		x+12,y-12,
		x+20+wT,y-12,
		x+20+wT,y+12,
		x+12,y+12,
		x,y);
	
	setFillStyle('black');
	fText(node.name, x+16, y-10);
}

drawPotentialConnection = function(){
	if(connected){
		drawConnection(nodeSelectedForConnection, nodeConnected);
	} else if(selecting){
		drawConnection(nodeSelectedForConnection, nodeOver);
	}
}

drawConnection = function(node0, node1){	
	setStroke(CONNECTION_COLOR);
	setLW(6);
	
	var p = fishEye(node0.tx, node0.ty);
	var r = nodeRadius(node0, p.z);//node0.r*(node0.twitter?1:0.5)*Math.log(p.z+1)*space2D.scale*(subNodes.indexOf(node0)==-1?1:2);
	
	sCircle(p.x, p.y, r+5);
	
	if(node0!=node1){
		var a;
		
		if(node1==null){
			a = Math.atan2(mY-p.y, mX-p.x);
			line(
				p.x + (r+6)*Math.cos(a), p.y + (r+6)*Math.sin(a),
				mX, mY);
		} else {
			var p1 = fishEye(node1.tx, node1.ty);
			var r1 = nodeRadius(node1, p1.z);//node1.r*(node1.twitter?1:0.5)*Math.log(p1.z+1)*space2D.scale*(subNodes.indexOf(node1)==-1?1:2);
			
			a = Math.atan2(p1.y-p.y, p1.x-p.x);
			line(p.x + (r+6)*Math.cos(a), p.y + (r+6)*Math.sin(a),
				p1.x - (r1+6)*Math.cos(a), p1.y - (r1+6)*Math.sin(a));
			
			sCircle(p1.x, p1.y, r1+5);
		}
	}
}


drawRelations = function(){
	var relation;
	for(var i=0; network.relationList[i]!=null; i++){
		relation = network.relationList[i];
		drawRelation(relation);
	}
}

drawRelation = function(relation){
	var toRelation = nodeClosest==relation.node0;
	var fromRelation = nodeClosest==relation.node1;
	var nodeClosestRelation = toRelation || fromRelation;
	var byAnimation = subRelations.indexOf(relation)!=-1;
	
	if(!byAnimation && (!nodeClosestRelation && relation.weight<configuration.minRelationWeightToDraw)) return;
	
	var a = Math.atan2(relation.node1.ty-relation.node0.ty, relation.node1.tx - relation.node0.tx) + HalfPi;
	var r = 0.1*Math.sqrt(Math.pow(relation.node0.tx-relation.node1.tx, 2)+Math.pow(relation.node0.ty-relation.node1.ty, 2));
	var pMx = (relation.node0.tx+relation.node1.tx)*0.5 + r*Math.cos(a);
	var pMy = (relation.node0.ty+relation.node1.ty)*0.5 + r*Math.sin(a);
	
	pMx = space2D.projectX(pMx)+centerX;
	pMy = space2D.projectY(pMy)+centerY;
		
	//var p0 = fishEye(relation.node0.tx, relation.node0.ty);
	//var p1 = fishEye(relation.node1.tx, relation.node1.ty);
	var p0x = space2D.projectX(relation.node0.tx)+centerX;//relation.node0.tx;
	var p0y = space2D.projectY(relation.node0.ty)+centerY;//relation.node0.ty;
	var p1x = space2D.projectX(relation.node1.tx)+centerX;//relation.node1.tx;
	var p1y = space2D.projectY(relation.node1.ty)+centerY;//relation.node1.ty;
	
	
	
	//var pR = fishEye(pMx, pMy);
	
	var drawGray = !nodeClosestRelation || byAnimation || toGenerateRelationsCapture;
	
	if(!drawAllRelations) c.log(drawGray, !nodeClosestRelation, byAnimation, toGenerateRelationsCapture);
	
	context.strokeStyle = drawGray?DEFAULT_RELATIONS_COLOR:(toRelation?COLOR_TO:COLOR_FROM);
	context.lineWidth = relationLineWidth(relation, byAnimation);
	if(drawGray && !byAnimation) context.lineWidth*=0.1;
	
	context.beginPath();
	//context.moveTo(p0.x, p0.y);
	context.moveTo(p0x, p0y);
	//configuration.curves?context.bezierCurveTo(pR.x, pR.y, pR.x, pR.y, p1.x, p1.y):context.lineTo(p1.x, p1.y);
	configuration.curves?context.bezierCurveTo(pMx, pMy, pMx, pMy, p1x, p1y):context.lineTo(p1x, p1y);
	context.stroke();
	
	if(configuration.circlesOnRelated){
		context.beginPath();
		if(toRelation){
			//context.arc(p1.x, p1.y, relation.node1.r*Math.log(p1.z+1)*space2D.scale+2, 0, TwoPi);
			context.arc(p1x, p1y, relation.node1.r*Math.log(1+1)*space2D.scale+2, 0, TwoPi);
		} else {
			//context.arc(p0.x, p0.y, relation.node0.r*Math.log(p0.z+1)*space2D.scale+2, 0, TwoPi);
			context.arc(p0x, p0y, relation.node0.r*Math.log(1+1)*space2D.scale+2, 0, TwoPi);
		}
		context.stroke();
	}
}

relationLineWidth = function(relation, byAnimation){
	return relation.weight*configuration.relationWidthFactor + (byAnimation?2:0);// (relation.weight+0)*0.5 + byAnimation?2:0;
}

drawRelationsBetweenImages = function(node0, node1, x0, y0, x1, h){
	var hM = h*0.5;
	var xM = (x1+x0)*0.5;
	var hA = h*0.15;
	var index = node0.toNodeList.indexOf(node1);
	
	if(index!=-1){
		relation = node0.toRelationList[index];
		context.strokeStyle = COLOR_TO;
		setLW(relationLineWidth(relation)*h/42);
		bezier(x0, y0 + hM,
			xM, y0,
			xM, y0,
			x1, y0+hM
		);
		sLines(xM-hA, y0+h*0.15-hA,
			xM, y0+h*0.15,
			xM-hA, y0+h*0.15+hA
		);
	}
	
	index = node1.toNodeList.indexOf(node0);
	if(index!=-1){
		relation = node1.toRelationList[index];
		context.strokeStyle = COLOR_FROM;
		setLW(relationLineWidth(relation)*h/42);
		bezier(x0, y0 + hM,
			xM, y0+h,
			xM, y0+h,
			x1, y0+hM
		);
		sLines(xM+hA, y0+h*0.85-hA,
			xM, y0+h*0.85,
			xM+hA, y0+h*0.85+hA
		);
	}
}


//

newColorsFromDegrees = function(degrees){
	if(degrees==null){
		for(i=0; network.nodeList[i]!=null; i++){
			colors[i] = configuration.defaultNodesColor;
		}
		return;
	}
	
	var max = degrees.max;
	for(i=0; network.nodeList[i]!=null; i++){
		colors[i] = degrees[i]==-1?'rgb(0,0,0)':'rgb('+(0+Math.floor(255 - (degrees[i]*255/max)))+','+(20+Math.floor(130 - (degrees[i]*130/max)))+','+Math.floor(255*degrees[i]/max)+')';
	}
}


generateCaptureAllRelations = function(){
	var prevMin = configuration.minRelationWeightToDraw;
	configuration.minRelationWeightToDraw = 0;
    
	// context.clearRect(1,1,cW-panel.frame.width,cH-2);
// 	
	// drawRelations();
// 	
	// captureAllRelations = captureCanvas();
	// context.clearRect(0,0,cW,cH);
	c.log("CAPTURE RELATIONS");
	captureAllRelations = drawAndcapture(drawRelations, cW-panel.frame.width,cH);
	
	configuration.minRelationWeightToDraw = prevMin;
}
