var table;
var network;

var idsRelation;
var tweetsDates;
var tweets;
var sortedRelations;

var networkMetrics = new Object();

//
var loadingMessage='';

var nodeOver;
var degrees;
var nodeClosest;

var subRelations = new List();
var subNodes = new List();

var clusters;

var positionsForces;
var positionsClusters;
var positionsMode = 0; //0:forces | 1:clusters

var drawAllRelations = true;

var dMin;

var colors;

var timeMin;
var timeMax;

//interface
var panel;
var header;
var timeWidget;
var layout;
var interaction;

var toolTip;

//configuration
var configurationUrl;
var configuration;

var COLOR_TO = 'rgba(0,100,255,0.8)';
var COLOR_FROM = 'rgba(255,0,100,0.8)';

var DEFAULT_RELATIONS_COLOR;
var CONNECTION_COLOR;
var BACKGROUND_COLOR;

var captureAllRelations;
var toGenerateRelationsCapture = false;

var PRINT_SIMPLE_GML = false;//this shouldn't be here, simple GML should be produced elsewhere

init=function(){
	cycleOnMouseMovement(true);
	END_CYCLE_DELAY = 6000;
    alert("aaaa");
	if(hashTag!=null && hashTag!=""){
		configurationUrl = './configurations/'+decodeURI(hashTag.substr(1));
	} else {
		configurationUrl ='./configurations/twitterCompany.json';//'file:///C:/Users/Administrator/Desktop/trw/configurations/twitterCompany.json';// 
	}
	//http://moebio.com/newk/twitter/configurations/twitterCompany.json
	window.addEventListener('hashchange', function(){
		location.reload();
	}, false);
	
	startLoadingData();
	
	panel = new Panel();
	
	resizeWindow();
}

initWithData=function(){
	c.log('initWithData');
	
	panel.init();
	initSpace();
	
	tootlTip = new ToolTip();
		
	addInteractionEventListener('mousedown', onMouse, this);
	addInteractionEventListener('mouseup', onMouse, this);
	addInteractionEventListener('mousewheel', wheel, this);
}



resizeWindow = function(){
	frame.width = cW-panel.frame.width;
	frame.height = cH;
	centerX = Math.floor(frame.width*0.5);
	centerY = Math.floor(frame.height*0.5);
	panel.setFrame(new Rectangle(frame.width-3, 3, panel.frame.width, cH-4));
}


cycle = function(){
	if(toGenerateRelationsCapture && drawAllRelations){
		generateCaptureAllRelations();
		toGenerateRelationsCapture = false;
	}
	
	
	if(mX<frame.width){
		canvas.style.cursor = 'move';
	} else {
		canvas.style.cursor = 'default';
	}
	checkButtons();
	
	if(network==null){
		DrawTexts.setContextTextProperties('rgb(120,120,120)', 24, 'Arial');
		context.fillText(loadingMessage, 20, 20);
		return;
	}
	
	cycleSpace();
	
	if(!dragging && !timeWidget.animationActive && !zooming &&!nodesMoving && captureAllRelations!=null) drawImage(captureAllRelations,0,0);
	
	//draw relations
	drawRelations();
	
	//draw nodes
	drawNodes();
	
	if(dragging || mousePressed) canvas.style.cursor = 'hand';
	
	//interface
	panel.draw();
	
	drawToolTip();
}