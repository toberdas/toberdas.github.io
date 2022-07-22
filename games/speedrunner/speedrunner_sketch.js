
function setup() {
    canvas = createCanvas(620,340);
	canvas.parent("gameholder")
	wallSideLength = 32;
	difficulty = .3;
	difficultyIncrement = .05;
	minDifficulty = .1;
	maxDifficulty = .5;
	generateWallGrid();
	spawnPlayer();
	speedIncrement = 0.4;
	playerWidth = 12;
	playerHeight = 12;
	playerSpeed = 3;
	playerX = 0;
	playerY = 0;
	horizontalMomentum = 0.0;
	horizontalSpeed = 0;
	verticalMomentum = 0.0;
	verticalSpeed = 0;
	gravity = 0.5;
	jumpSpeed = 7;
	jump = 0;
	inAir = 1;
	graceFrames = 16;
	graceFrameCounter = 0;
	turnFrameCounter = 0;
	turnFrames = 20;
	savedMomentum = 0;
	frameRate(60)
	openFullscreen();
	won = false;
}

function draw() {
	background(233);
	drawWallGrid();
	drawPlayer();
	getPlayerInput();
	updateMovement();
	movePlayer();
}

function generateWallGrid(){
	if (difficulty < 1){
		noiseSeed(random(99));
		wallArray = [];
		for (i = 0; i<floor(canvas.width / wallSideLength); i++){
			wallArray[i] = [];
			for (j = 0; j<floor(canvas.height / wallSideLength); j++){
				var localNoise = noise(i * wallSideLength, j * wallSideLength);
				if (localNoise - (0.8 - (j / floor(canvas.height / wallSideLength))) > difficulty){
					wallArray[i][j] = 1;
				}
				else{
					wallArray[i][j] = 0;
				}
			}
		}
	}
	else{
		won = true;
	}
	return false;
}

function drawPlayer(){
	stroke(125);
	rect(playerX,playerY,playerWidth,playerHeight);
	return false;
}

function spawnPlayer() {
	for (i = 0; i<floor(canvas.width / wallSideLength); i++){
		for (j = 0; j<floor(canvas.height / wallSideLength); j++){
			if (wallArray[i][j] == 1){
				playerX = i * wallSideLength;
				playerY = (j - 1) * wallSideLength;
				i = floor(canvas.width / wallSideLength);
				break;
			}
		}
	}
	return false;
}

function drawWallGrid(){
	stroke(0);
	for (i = 0; i<floor(canvas.width / wallSideLength); i++){
		for (j = 0; j<floor(canvas.height / wallSideLength); j++){
			if (wallArray[i][j] == 1){
				square(i*wallSideLength, j*wallSideLength, wallSideLength);
			}
		}
	}
	return false;
}

function getPlayerInput() {
	keyRight = 0;
	keyLeft = 0;
	keySpace = 0;
	keyDown = 0;
	if (keyIsDown(65)) {
		keyLeft = 1;
	}

	if (keyIsDown(68)) {
		keyRight = 1;
	}

	if (keyIsDown(32)) {
		keySpace = 1;
	}

	if (keyIsDown(DOWN_ARROW)) {
		keyDown = 1;
	}
	return false;
}

function keyTyped() {
	if (key === 'r') {
	  generateWallGrid();
	  spawnPlayer();
	}
}

function updateMovement(){
	horizontalDirection = keyRight - keyLeft;
	verticalDirection = keyDown - keySpace;
	
	if (inAir == 1){
		if (graceFrameCounter > 0){
			graceFrameCounter--;
		}
	}

	if (horizontalDirection != 0){
		if (Math.sign(horizontalMomentum) != Math.sign(horizontalDirection)){
			if (turnFrameCounter != 0){
				turnFrameCounter = turnFrameCounter;
				savedMomentum = horizontalMomentum;
				horizontalMomentum = 0;
			}
		}
		horizontalMomentum += speedIncrement * (1 - inAir) * horizontalDirection;
	}
	else{
		horizontalMomentum -= (Math.sign(horizontalMomentum) * 0.4);
	}
	
	if (turnFrameCounter > 0){
		turnFrameCounter -= 1;
	}
	else{
		savedMomentum = 0;
	}
	
	
	if (inAir - Math.sign(graceFrameCounter) == 0){
		if (keySpace == 1)
		{
			jump = jumpSpeed + (abs((horizontalMomentum + savedMomentum) * 0.5));
			horizontalMomentum -= keySpace * (horizontalMomentum * 0.10) + savedMomentum;
			graceFrameCounter = 0;
		}
	}
	else{
		jump = 0;
	}
	
	verticalMomentum += gravity - jump;
	if (keySpace == 1 && verticalMomentum < 0){
		verticalMomentum -= 0.2;
	}
	horizontalSpeed = (playerSpeed * horizontalDirection) + Math.trunc(horizontalMomentum);
	verticalSpeed = Math.trunc(verticalMomentum);
	
	checkCollision();
}

function movePlayer() {
	playerX += horizontalSpeed;
	playerY += verticalSpeed;
	return false;
}

function checkCollision(){
	xCheck();
	yCheck();
	return false;
}

function xCheck(){
	if (playerX + horizontalSpeed> canvas.width - wallSideLength){
	  if (difficulty < maxDifficulty){
		  difficulty += difficultyIncrement;
	  }
		generateWallGrid();
		spawnPlayer();
		return false;
	}
	
	if (playerX < 0){
	 	horizontalSpeed = 0;
		horizontalMomentum = 0;
		playerX = 1;
	}
	var xcheck = 0;
	if (horizontalSpeed >= 0){
		xcheck = playerX + playerWidth + horizontalSpeed;
	}
	if (horizontalSpeed < 0){
		xcheck = playerX + horizontalSpeed;
	}
	if (xcheck != 0){
		var xx = div(xcheck,wallSideLength);
		var yytop = div(playerY,wallSideLength);
		var yybot = div(playerY + playerHeight - 1,wallSideLength);
		var colchecktop = wallArray[xx][yytop];
		var colcheckbot = wallArray[xx][yybot];
		if (colcheckbot + colchecktop > 0){
			if (horizontalSpeed >= 0){
				playerX += (xx * 32) - (playerX + playerWidth + 1);
			}
			if (horizontalSpeed < 0){
				playerX += ((xx - Math.sign(horizontalSpeed)) * 32 + 1) - (playerX + 1);
			}
			horizontalSpeed = 0;
			horizontalMomentum /= 2;
		}
	}
	return false;
}

function yCheck(){
	if (playerY > canvas.height){
		if (difficulty > minDifficulty){
		  difficulty -= difficultyIncrement;
	  }
	  	playerY = 0;
		horizontalMomentum = 0;
		verticalMomentum = 0;
		generateWallGrid();
		spawnPlayer();
		return false;
	}
/* 	if (playerY < 0){
		difficulty -= 0.1;
		horizontalMomentum = 0;
		verticalMomentum = 0;
		generateWallGrid();
		spawnPlayer();
		return false;
	} */
	var ycheck = 0;
	if (verticalSpeed >= 0){
		ycheck = playerY + playerHeight + (verticalSpeed);
	}
	if (verticalSpeed <= 0){
		ycheck = playerY + verticalSpeed;
	}
	if (ycheck != 0){
		var yy = div(ycheck,wallSideLength);
		
		var xxleft = div(playerX,wallSideLength);
		var xxright = div(playerX + playerWidth,wallSideLength);
		var colcheckleft = wallArray[xxleft][yy];
		var colcheckright = wallArray[xxright][yy];
		if (colcheckleft + colcheckright > 0){
			if (verticalSpeed >= 0){
				playerY += (yy * 32) - (playerY + playerHeight + 1);
				landing();
			}
			if (verticalSpeed < 0){
				playerY += playerY - ((yy + 1) * 32);
			}
			verticalSpeed = 0;
			verticalMomentum = 0;
		}
		else{
			inAir = 1;
		}
	}
	return false;
}

function landing(){
	inAir = 0;
	graceFrameCounter = graceFrames;
	if (horizontalDirection != Math.sign(horizontalMomentum)){
		horizontalMomentum = 0;
	}
}

function openFullscreen() {
	if (canvas.requestFullscreen) {
		canvas.requestFullscreen();
	} else if (canvas.mozRequestFullScreen) { /* Firefox */
		canvas.mozRequestFullScreen();
	} else if (canvas.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
		canvas.webkitRequestFullscreen();
	} else if (canvas.msRequestFullscreen) { /* IE/Edge */
		canvas.msRequestFullscreen();
	}
}

function div(x, y) {
  var div = Math.trunc(x/y);
  return div;
}

