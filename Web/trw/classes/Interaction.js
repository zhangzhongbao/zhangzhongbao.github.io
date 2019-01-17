var nFDown=0;
var mousePressed = false;
var mPPressed;
var nodePressed;
var nodeSelected;
var nodeSelectedForConnection;
var nodeConnected;
var onButton = false;
var wheelTimer;
var zooming = false;

onMouse = function(e){
	var node;
	var i;
	
	//if(onButton || mX>frame.width) return;
	if(mX>frame.width) return;
	
	switch(e.type){
		case 'mousedown':
			if(!cycleActive){
				enterFrame();
				reStartCycle();
			}
			
			mousePressed = true;
			dragging = true;
			followingSelected = false;
			
			mPPressed = mP.clone();
			
			var doubleClick = nF-nFDown<8;
			nFDown = nF;
			
			if(doubleClick){
				scaleFinal = scale*(q*0.2+1);
				qFinal=0;
				reScaling = true;
			}
			
			nodePressed = nodeOver;
			break;
		case 'mouseup':
			mousePressed = false;
			dragging = false;
			
			if(selecting && nodeOver!=null && nodeOver!=nodeSelectedForConnection){
				nodeConnected = nodeOver;
				connected = true;
				dialogue.setNodes(nodeSelectedForConnection, nodeConnected);
			}
			
			selecting = false;
			
			var fastClick = nF<nFDown+5;
			
			if(fastClick){
				connected = false;
				dialogue.setNodes();
			} else {
				if(drawAllRelations) toGenerateRelationsCapture = true;
			}
			
			if(nodeOver!=null && nodeOver==nodePressed && fastClick){
				followingSelected = true;
				nodeSelected = nodeOver;
				nodesMoving = true;
				
				var angle;
				var r0;
				var r1;
				var R;
				
				if(configuration.nLevels==1){
					r0 = 110;
					R = 150;
				} else {
					r0 = 80;
					r1 = 160;
					R = 190;
				}
				
				var related = new List();
				var currentAngles = new NumberList();
				var radius = new NumberList();
				
				for(i=0; nodeOver.nodeList[i]!=null; i++){
					node = nodeOver.nodeList[i];
					if(node!=nodeOver && related.indexOf(node)==-1){
						related.push(node);
						radius.push(node.r+4);
						currentAngles.push(Math.atan2(node.ty-nodeOver.ty, node.tx - nodeOver.tx));
					}
				}
				
				related = ListOperators.sortListByNumberList(related, currentAngles, false);
				radius = ListOperators.sortListByNumberList(radius, currentAngles, false);
				
				var aFactor = TwoPi/radius.getSum();
				
				var relatedB = new Array();
				var a = -Math.PI;
				var dA;
				
				for(i=0; related[i]!=null; i++){
					node = related[i];
					dA = radius[i]*aFactor;
					node.fx = nodeOver.tx + r0*Math.cos(a+0.5*dA);
					node.fy = nodeOver.ty + r0*Math.sin(a+0.5*dA);
					
					a += dA;
					 
					relatedB = relatedB.concat(node.nodeList);
				}
				
				if(configuration.nLevels>1){
					relatedB = List.fromArray(relatedB);
					relatedB = relatedB.getWithoutRepetitions();
					
					relatedB.removeElement(nodeOver);
					
					for(i=0; related[i]!=null; i++){
						relatedB.removeElement(related[i]);
					}
					
					dA = TwoPi/relatedB.length;
						
					for(i=0; relatedB[i]!=null; i++){
						node = relatedB[i];
						node.fx = nodeOver.tx + r1*Math.cos(i*dA-Math.PI);
						node.fy = nodeOver.ty + r1*Math.sin(i*dA-Math.PI);
					}
				} else {
					relatedB = new List();
				}
				
				for(i=0; network.nodeList[i]!=null; i++){
					node = network.nodeList[i];
					if(node!=nodeOver && related.indexOf(node)==-1 && relatedB.indexOf(node)==-1){
						angle = Math.atan2(node.y-nodeOver.ty, node.x-nodeOver.tx);
						node.fx = node.x + R*Math.cos(angle);
						node.fy = node.y + R*Math.sin(angle);
					}
				}
				
				var degrees = NetworkOperators.degreesFromNodeToNodes(network, nodeOver, network.nodeList);
				
				newColorsFromDegrees(degrees);
				
			} else {
				if(fastClick){
					nodeSelected = null;
					for(i=0; network.nodeList[i]!=null; i++){
						node = network.nodeList[i];
						node.fx = node.x;
						node.fy = node.y;
					}
					newColorsFromDegrees(null);
				}
			}
			
			break;
	}
}

wheel=function(e){
	switch(mousePressed){
		case true:
			dragging = false;
			if(q>0 || e.value<0){
				q2 = Math.min(Math.max(q2*(1-0.03*e.value), 1), 21);
				q = q2-1;
			} else if(q==0 && e.value>0){
				//changeScaleByWheel(e.value);
			}
			break;
		case false:
			changeScaleByWheel(e.value);
			break;
	}
}

changeScaleByWheel = function(wheelValue){
	space2D.factorScaleFromPoint(new Point(mX-centerX, mY-centerY), (1-0.03*wheelValue));
	toGenerateRelationsCapture = false;
	zooming = true;
	
	clearTimeout(wheelTimer);
	if(!timeWidget.animationActive) wheelTimer = setTimeout(scaleChanged, 500);
}
scaleChanged = function(){
	zooming = false;
	if(drawAllRelations) toGenerateRelationsCapture = true;
}

checkButtons=function(e){
	onButton = timeWidget.onButton;
	if(onButton) canvas.style.cursor = 'pointer';
}
