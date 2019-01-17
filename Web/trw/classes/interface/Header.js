Header.prototype = new Window();

function Header(){
	this.frame.height = 140;
	
	this.tB = new TextFieldHTML({
		text:"<ff"+LOADED_FONT+"><fs24><b>"+configuration.title+"</b></f><br><fs14>"+configuration.subtitle+"</f></f>",
		x:-2000,
		y:20
	});
	this.tB.draw();
}

Header.prototype.setFrame = function(frame){
	this._setFrame(frame);
	this.tB.x = frame.x+10;
	this.tB.y = frame.y+10;
	this.tB.width = frame.width-20;
}

Header.prototype.draw = function(){
	this._draw();
	
	this.tB.draw();
	
	return;
	
	DrawTexts.setContextTextProperties('black', 24, LOADED_FONT, null, null, 'bold');
	context.fillText(configuration.title, this.frame.x+5, this.frame.y+5);
	
	if(configuration.subtitle!=null){
		DrawTexts.setContextTextProperties('black', 14, LOADED_FONT);
		context.fillText(configuration.subtitle, this.frame.x+5, this.frame.y+28);
	}
}
