
var N_IMAGES_LOADED = 0;

process = function(network){
	colors = new ColorList();
	
	var i;
	var j;
	var node;
	//var parts;

	//c.log("2. table.length, table", table.length, table);
	//return;
	
	if(table!=null){
		for(i=0; table[0][i]!=null; i++){
			node = network.nodeList.getNodeById(String(table[0][i]));
			if(node!=null){
				node.longName = table[2][i];
				node.description = table[6][i];
				node.nFollowers = Number(table[3][i]);
				//if(table[9]!=null){
				if(table[10]!=null){
					//node.thumbnailUrl = table[9][i];
					
					
					node.thumbnailUrl = table[10][i];

					//node.thumbnailUrl = table[10][i].split('/'); 
					//node.thumbnailUrl =  "https://www.intuitionanalytics.com/other/newk/resources/twitterCompanyData/thumbnails_images/" + node.thumbnailUrl[node.thumbnailUrl.length-1];
					// c.log('••••••••••• node.thumbnailUrl:', node.thumbnailUrl);

					//https://www.intuitionanalytics.com/other/newk/resources/twitterCompanyData/thumbnails_images/0_rnYxr0_bigger.jpeg

					//node.thumbnailUrl = node.thumbnailUrl.replace("http://a0.twimg.com/", "http://pbs.twimg.com/"); //adjustemnt done on 3/02/14 after Twitter changed thumbnails server

					// parts = table[9][i].split("/");
					// node.thumbnailUrl = "./resources/twitterCompanyData/thumbnails_images/"+parts[parts.length-1];
					// c.log(node.thumbnailUrl);

					//node.thumbnailUrl = (node.thumbnailUrl!=null && node.thumbnailUrl.indexOf("http:")==0)?node.thumbnailUrl:('resources/twitterCompanyData/thumbnails_images/'+node.thumbnailUrl);

					if(node.thumbnailUrl!=null && node.thumbnailUrl.indexOf("http")!=0) node.thumbnailUrl = 'resources/twitterCompanyData/thumbnails_images/'+node.thumbnailUrl;
					node.loadImage = function(){
						Loader.loadImage(this.thumbnailUrl, function(e){
							this.image = e.result;
							if(this.image!=null){
								N_IMAGES_LOADED++;
								//c.log("+++++++++++++ ++++++++++++ ++++++++++++ ++++++++++++ ++++++++++++ ++++++++++++ ++++++++++++ ++++++++++++ ++++++++++++ N IMAGES LOADED:", N_IMAGES_LOADED);
							}
						},
						this);
					}
				}
			}
		}
	}
	
	var maxWeight=0;
	
	for(i=0; network.nodeList[i]!=null; i++){
		node = network.nodeList[i];
		
		node.twitter = node.twitter=="true";
		
		node.tx = node.fx = node.x;
		node.ty = node.fy = node.y;
		
		node.forcesPosition = new Point(node.x, node.y);
		
		node.nFollowers = Number(node.nFollowers);
		node.longName = node.longName==null?'':node.longName;
		
		switch(configuration.nodesWeightProperty){
			case 'degree':
				node.weight = node.relationList.length;
				break;
			case 'inDegree':
				node.weight = node.fromRelationList.length;
				break;
			case 'outDegree':
				node.weight = node.toRelationList.length;
				break;
			case 'weighedInDegree':
				node.weight = 0;
				for(j=0; node.fromRelationList[j]!=null; j++){
					node.weight+=node.fromRelationList[j].weight;
				}
				break;
			default:
				node.weight = node[configuration.nodesWeightProperty];
				node.weight = node.weight==null?0:node.weight;
				break;
		}
		
		maxWeight = Math.max(maxWeight, node.weight);
		colors[i] = configuration.defaultNodesColor;
	}
	
	if(configuration.loadThumbnails){
		var nodeListSorted = network.nodeList.getSortedByProperty('weight', false);
		for(i=0; nodeListSorted[i]!=null; i++){
			node = nodeListSorted[i];
			if(node.thumbnailUrl!=null && node.weight>1) node.loadImage();
		}
	}
	
	networkMetrics.maxWeight = maxWeight;
	
	for(i=0; network.nodeList[i]!=null; i++){
		node = network.nodeList[i];
		node.r = (configuration.minNodesRadius + (Math.sqrt(node.weight)*(configuration.maxNodesRadius-configuration.minNodesRadius))/Math.sqrt(networkMetrics.maxWeight));
	}
	
}

processTweets = function(text){
	var lines = text.split("\n");
	var parts;
	
	idsRelation = new StringList();
	tweets = new StringList();
	tweetsTimes = new NumberList();
	sortedRelations = new RelationList();
	
	timeMin = 9999999999999;
	timeMax = -9999999999999;
	
	for(var i=0; lines[i]!=null; i++){
		parts = lines[i].split("|");
		tweetsTimes[i] = Number(parts[0]);
		timeMin = Math.min(timeMin, tweetsTimes[i]);
		timeMax = Math.max(timeMax, tweetsTimes[i]);
		idsRelation[i] = parts[1];
		tweets[i] = parts[2];
		sortedRelations[i] = network.relationList.getNodeById(idsRelation[i]);
	}
	
	sortedRelations = sortedRelations.getSortedByList(tweetsTimes, true);
	tweets = tweets.getSortedByList(tweetsTimes, true);
	idsRelation = idsRelation.getSortedByList(tweetsTimes, true);
	tweets = tweets.getSortedByList(tweetsTimes, true);
	tweetsTimes = tweetsTimes.getSortedByList(tweetsTimes, true);
	
	timeWidget.preProcess();
	networkInfo.preProcess();
}

processClusters = function(text){
	var blocks = StringOperators.splitByEnter(text);
	var ids;
	clusters = new Table();
	for(var i=0; blocks[i]!=null; i++){
		clusters[i] = network.nodeList.getNodesByIds(blocks[i].split(","));
	}
	circlesFromClusters(clusters, new Rectangle(-500, -500, 1000, 1000));
}
circlesFromClusters = function(clustersTable, frame){
	var weights = new NumberList();
	
	var circles;
	
	var degreesTable = new NumberTable();
	
	for(var i=0; clustersTable[i]!=null; i++){
		degreesTable[i] = clustersTable[i].getWeights().add(0.01);
		weights[i] = degreesTable[i].getSum();
	}
	
	clustersTable = clustersTable.getSortedByList(weights, false);
	degreesTable = degreesTable.getSortedByList(weights, false);
	weights = weights.getSorted(false);
	
	
	
	var bigCircles = CirclesVisOperators.circlesCloud(weights, frame, 10);
	
	var cluster;
	
	//var circlesTable = new Table();
	var circle;
	var circles;
	var r;
	
	for(i=0; clustersTable[i]!=null; i++){
		cluster = clustersTable[i];
		
		weights = degreesTable[i];
		cluster = cluster.getSortedByList(weights, false);
		weights = weights.getSorted(false);
		
		circle = bigCircles[i];
		r = circle.z;//+1;
		circles = CirclesVisOperators.circlesCloud(weights, new Rectangle(circle.x-r, circle.y-r, r*2, r*2), 2);
		
		for(j=0; cluster[j]!=null; j++){
			cluster[j].clusterPosition = new Point(circles[j].x, circles[j].y);
		}
		
	}
}


getTweetsBetweenTwoAccounts = function(node0, node1){
	//c.log('getTweetsBetweenTwoAccounts, sortedRelations:', sortedRelations);
	var times = new NumberList();
	var tws = new StringList();
	var to = new List();//BooleanList();
	var tweetsTable = new Table();
	tweetsTable[0] = times;
	tweetsTable[1] = tws;
	tweetsTable[2] = to;
	
	for(var i=0; sortedRelations[i]!=null; i++){
		if(sortedRelations[i].node0==node0 && sortedRelations[i].node1==node1){
			times.push(tweetsTimes[i]);
			tws.push(tweets[i]);
			to.push(true);
		} else if(sortedRelations[i].node0==node1 && sortedRelations[i].node1==node0){
			times.push(tweetsTimes[i]);
			tws.push(tweets[i]);
			to.push(false);
		}
	}
	
	return tweetsTable;
}
