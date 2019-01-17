Layout.prototype = new Window();

function Layout(){
	this.name = 'layout options';
	
	this.frame.height = 60;
	
	this.positionMenu = new Selection({
		buttonsTexts:[
			'forces',
			'clusters'
			],
		warnFunction:this.changeOnMenu,
		target:this,
		multiple:false,
		oneActive:true,
		vertical:false,
		space:15,
		id:'0'
	});
	
	this.allRelationsButton = new Selection({
		buttonsTexts:[
			'draw all relations'
			],
		warnFunction:this.changeOnMenu,
		target:this,
		multiple:false,
		oneActive:false,
		actives:[true],
		vertical:false,
		space:15,
		id:'1'
	});
	
}

Layout.prototype.setFrame = function(frame){
	this._setFrame(frame);
	
	this.positionMenu.x = frame.x + 75;
	this.positionMenu.y = frame.y + 5;
	
	this.allRelationsButton.x = frame.x + 10;
	this.allRelationsButton.y = frame.y + 32;
}

Layout.prototype.changeOnMenu = function(id){
	c.log('change on menu:', id);
	switch(id){
		case '0':
			changePositions(this.positionMenu.actives[0]?0:1);
			break;
		case '1':
			drawAllRelations = this.allRelationsButton.actives[0];
			if(drawAllRelations) {
				toGenerateRelationsCapture = true;
			} else {
				toGenerateRelationsCapture = false;
				captureAllRelations=null;
			}
			enterFrame();
			break;
	}
}

Layout.prototype.draw = function(){
	this._draw();
	
	setText('black', 12);
	fText('positions:', this.frame.x+5, this.frame.y+5);
	this.positionMenu.draw();
	this.allRelationsButton.draw();
	
}