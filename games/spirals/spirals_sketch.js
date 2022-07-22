function setup() {
	frameRate(60)
	updateFrame = 0;
	updateDelay = 1;
    canvas = createCanvas($(window).width() * 0.75,$(window).height() * 0.75);
	canvas.parent("gameholder");
	spiralBuffer = createGraphics($(window).width(),$(window).height());
	backgroundBuffer = createGraphics($(window).width(),$(window).height());
	direction = 1.0;
	directionCounter = 0;
    rad = 0.0;
	theta = 0.0;
    pointX = float(mouseX);
    pointY = float(mouseY);
	currentArray = [];
	lineArray = [];
	maxArrayLength = 64;
	lineStyleArray = [styleLine, styleQuad];
	
	//values are: current, target, min, max, namestring, hotkeystring
	redValue = 		[random(255), 	random(255),0, 255,	"Red",				"q"];
	greenValue = 	[random(255), 	random(255),0, 255,	"Green",			"w"];
	blueValue = 	[random(255), 	random(255),0, 255,	"Blue",				"e"];
	bgRedValue = 	[random(255), 	random(255),0, 255,	"Background Red",	"b"];
	bgGreenValue = 	[random(255), 	random(255),0, 255,	"Background Green",	"n"];
	bgBlueValue = 	[random(255), 	random(255),0, 255,	"Background Blue", 	"m"];
	lineThickness = [random(10),	random(10), 1, 24,	"Thickness",		"r"];
	speed = 		[6, 			6, 			1, 14,	"Speed",			"t"];
	spinSpeed =		[14, 			14, 		1, 28,	"Spinspeed",		"s"];
	maxRad = 		[16, 			16, 		8, 64,	"Max width",		"u"];
	mouseFollow =	[32, 			32, 		8, 64,	"Mouse follow speed","i"];
	lineStyle = 	[0,				0,			0,	lineStyleArray.length -1,	"Line style",		"o"];
	
	variableArray = [redValue, 
					greenValue, 
					blueValue, 
					lineThickness,
					bgRedValue,
					bgGreenValue,
					bgBlueValue,
					speed,
					spinSpeed,
					maxRad,
					mouseFollow,
					lineStyle];
	

	activeVariable = 0;
	background(bgRedValue[0], bgGreenValue[0], bgBlueValue[0])
	sliderArray = [];
	slidersVisible = 0;
	sliderOffsetMin = -120;
	sliderOffsetMax = 10;
	sliderOffset = sliderOffsetMin;
	sliderTopOffset = 30;
	sliderYMargin = 20;
	sliderWidth = 60;
	for (var i=0;i<variableArray.length;i++){
	  sliderArray[i] = (createSlider(variableArray[i][2], variableArray[i][3], variableArray[i][1]));
	  let p = createP(variableArray[i][4] + ' [' + variableArray[i][5] + ']');
	  p.parent('sliderholder');
	  sliderArray[i].parent('sliderholder');
	//   sliderArray[i].position(sliderOffset, sliderTopOffset + 10 + i * sliderYMargin);
	  sliderArray[i].style('width', '80px');
	}
}

function draw() {
	if (updateFrame == updateDelay){
		rad += (speed[0] * 0.01) * direction;
		if (abs(rad) >= maxRad[0]){
			direction = -Math.sign(rad);
		}
		theta += (spinSpeed[0] * 0.01);
		pointX += sin(theta) * rad;
		pointY += cos(theta) * rad;
	}
	
	if (mouseX > -100 && mouseX < canvas.width + 100 && mouseY > -100 && mouseY < canvas.height + 100){
		if (updateFrame == updateDelay){
			pointX += (mouseX - pointX) / mouseFollow[0];
			pointY += (mouseY - pointY) / mouseFollow[0];
		}
		
			if (mouseIsPressed == true){
				if (mouseX < sliderOffsetMax + 90 && slidersVisible == 1){
					mouseReleased()
				}
				else{
					if (currentArray.length > maxArrayLength){
						currentArray.pop();
					}
					
					currentArray.unshift(
					[pointX,
					pointY, 
					lineThickness[0], 
					redValue[0], 
					greenValue[0], 
					blueValue[0]]);
					drawSpiralBuffer();
				}
			}
		
	}

	if (updateFrame == updateDelay){
		updateFrame = 0;
	}
	else{
		updateFrame++;
	}
	if (slidersVisible == 1){
		sliderOffset += (sliderOffsetMax - sliderOffset) / 24;
	}
	else{
		sliderOffset += (sliderOffsetMin - sliderOffset) / 24;
	}
	
	
	drawBackgroundBuffer();
	image(backgroundBuffer,0,0);
	image(spiralBuffer,0,0);
}

function mouseReleased(){
	currentArray.length = 0;
}

function keyPressed() {
	if (keyCode === ENTER){
			for (i=0;i<sliderArray.length;i++){
				sliderArray[i].value(random(variableArray[i][2], variableArray[i][3]));
			}
	}
	if (keyCode === SHIFT){
		slidersVisible = 1 - slidersVisible;
	}
	if (keyCode === DELETE){
		spiralBuffer.clear();
	}
	if (keyCode === BACKSPACE){
		spiralBuffer.clear();
	}
}

function keyTyped() {
	for (i=0;i<variableArray.length;i++){
		if (key === variableArray[i][5]){
		  activeVariable = i;
		}
	}
	if (key === 'z'){ //randomize line color variables
		for (i=0;i<3;i++){
			sliderArray[i].value(random(variableArray[i][2], variableArray[i][3]));
		}
	}
	if (key === 'x'){ //randomize background color variables
		for (i=4;i<7;i++){
			sliderArray[i].value(random(variableArray[i][2], variableArray[i][3]));
		}
	}
	if (key === 'c'){ //randomize movement variables
		for (i=7;i<11;i++){
			sliderArray[i].value(random(variableArray[i][2], variableArray[i][3]));
		}
	}
	if (key === 'v'){ //randomize all
		for (i=0;i<sliderArray.length;i++){
			sliderArray[i].value(random(variableArray[i][2], variableArray[i][3]));
		}
	}
}

function mouseWheel(event) {
	sliderArray[activeVariable].value(sliderArray[activeVariable].value() + event.delta / 100);
	return false;
}

function drawSpiralBuffer(){
	lineStyleArray[lineStyle[1]]()
}

function drawBackgroundBuffer(){
	backgroundBuffer.background(bgRedValue[0], bgGreenValue[0], bgBlueValue[0]);
	for (i=0;i<variableArray.length;i++){
		variableArray[i][1] = sliderArray[i].value();
		// sliderArray[i].position(sliderOffset,sliderTopOffset + 10 + i * sliderYMargin)
		if (i == activeVariable){
			backgroundBuffer.strokeWeight(0);
			backgroundBuffer.textSize(13);
			backgroundBuffer.textStyle(BOLD);
		}
		else{
			backgroundBuffer.strokeWeight(0);
			backgroundBuffer.textSize(12);
			backgroundBuffer.textStyle(NORMAL);
		}
		backgroundBuffer.text(variableArray[i][4]+" ["+variableArray[i][5]+"]",sliderOffset,sliderTopOffset + i * sliderYMargin);
		variableArray[i][0] += (variableArray[i][1] - variableArray[i][0]) / 36;
	}
	backgroundBuffer.stroke(redValue[0],
	greenValue[0],
	blueValue[0]);
	backgroundBuffer.strokeWeight(lineThickness[0]);
	backgroundBuffer.point(pointX, pointY);
}

function styleLine(){
	for (i=0;i<currentArray.length - 1;i++){
		spiralBuffer.stroke(currentArray[i][3],
		currentArray[i][4],
		currentArray[i][5]);
		spiralBuffer.strokeWeight(currentArray[i][2]);
		spiralBuffer.line(currentArray[i][0],
		currentArray[i][1],
		currentArray[i + 1][0],
		currentArray[i + 1][1]);
	}
}

function styleCurve(){
	var thick = round(currentArray[0][2])
	for (i=0;i<currentArray.length - thick;i++){
		spiralBuffer.fill(currentArray[i][3],
		currentArray[i][4],
		currentArray[i][5]);
		
		spiralBuffer.strokeWeight(0);
		spiralBuffer.curve(
		currentArray[i + 0][0],
		currentArray[i + 0][1],
		currentArray[i + round(thick/3)][0],
		currentArray[i + round(thick/3)][1],
		currentArray[i + round(thick/2)][0],
		currentArray[i + round(thick/2)][1],
		currentArray[i + thick][0],
		currentArray[i + thick][1]);
	}
}

function styleQuad(){
	var thick = round(currentArray[0][2])
	for (i=0;i<currentArray.length - thick;i++){
		spiralBuffer.fill(currentArray[i][3],
		currentArray[i][4],
		currentArray[i][5]);
		spiralBuffer.strokeWeight(0);
		spiralBuffer.quad(
		currentArray[i + thick][0],
		currentArray[i + thick][1],
		currentArray[i + round(thick / 2)][0],
		currentArray[i + round(thick / 2)][1],
		currentArray[i + round(thick / 3)][0],
		currentArray[i + round(thick / 3)][1],
		currentArray[i + 0][0],
		currentArray[i + 0][1]);
	}
}

