var nTLoad;
var nLoading=1;

startLoadingData = function(){
	c.log('configurationUrl', configurationUrl);
	
//alert(configurationUrl);
	Loader.loadData(configurationUrl, onLoadConfiguration, this);
}

onLoadConfiguration = function(e){
	alert(e.result);
	configuration = JSON.parse(e.result);
//	var data={
//	"title":"Twitter Company",
//	"subtitle":"One week of conversations at Twitter Co. from 2/15/13 to 2/22/13 <fs11><br><br>sample demo of Newk vβ0.1, network visualization software being developed by <ehttp://moebio.com*Santiago Ortiz></f>",
//	"urlCsv":"resources/twitterCompanyData/twitterTeam3.csv",
//	"urlGml":"resources/twitterCompanyData/TwitterTeam.gml",
//	"urlTweets":"resources/twitterCompanyData/twitterTweets.txt",
//	"urlClusters":"resources/twitterCompanyData/clustersTwitter.txt",
//	"nLevels":2,
//	"curves":true,
//	"backGroundColor":"#000000",
//	"defaultNodesColor":"rgb(200,200,200)",
//	"defaultRelationsColor":"rgba(255,255,255,0.8)",
//	"loadThumbnails":true,
//	"zoomMode":1,
//	"initialFishEye":0,
//	"initialScale":1,
//	"minRelationWeightToDraw":999,
//	"circlesOnRelated":false,
//	"minNodesRadius":3,
//	"maxNodesRadius":42,
//	"shapeMode":0,
//	"relationWidthFactor":1,
//	"nodesWeightProperty":"inDegree"
//};
//configuration = data;
	c.log('configuration', configuration);
	
	nTLoad = Number(configuration.urlCsv!='')+1;
	
	loadingMessage = 'loading 1/'+nTLoad+' files';
	
	DEFAULT_RELATIONS_COLOR = configuration.defaultRelationsColor=='null'?'black':configuration.defaultRelationsColor;
	
	BACKGROUND_COLOR = configuration.backGroundColor==null?'white':configuration.backGroundColor;
	
	setBackgroundColor(BACKGROUND_COLOR);
	
	CONNECTION_COLOR = configuration.connectionColor==null?ColorOperators.invertColor(BACKGROUND_COLOR):configuration.connectionColor;
	
	configuration.urlCsv==''?Loader.loadData(configuration.urlGml, onLoadGml, this):Loader.loadData(configuration.urlCsv, onLoadCsv, this);
	
	initWithData();
	
	enterFrame();
}

onLoadCsv = function(e){
	nLoading++;
	loadingMessage = 'loading '+nLoading+'/'+nTLoad+' files';
	//alert(e.result);
	table = TableEncodings.CSVtoTable(e.result);
	
	//table = TableEncodings.CSVtoTable('./resources/twitterCompanyData/twitterTeam3.csv');
	
	Loader.loadData(configuration.urlGml, onLoadGml, this);
	
	enterFrame();
}



onLoadGml = function(e){
	
	network = NetworkEncodings.decodeGML(e.result);
	
	if(PRINT_SIMPLE_GML){
		c.log(NetworkEncodings.encodeGML(network, ['x', 'y', 'twitter'], ['weight']));
	}
	
	process(network);
	
	if(configuration.urlClusters!=null){
		Loader.loadData(configuration.urlClusters, onLoadClusters, this);
	} else {
		if(configuration.urlTweets!=null) Loader.loadData(configuration.urlTweets, onLoadTweets, this);
	}
	
	enterFrame();
}

onLoadClusters = function(e){
	
	processClusters(e.result);
	
	if(configuration.urlTweets!=null) Loader.loadData(configuration.urlTweets, onLoadTweets, this);
	
	enterFrame();
}

onLoadTweets = function(e){
	
	processTweets(e.result);
	
	resizeWindow();
	
	toGenerateRelationsCapture = true;
	
	dialogue.setNodes(null, null);
	
	enterFrame();
}
