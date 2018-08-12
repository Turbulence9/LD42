let canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
let aspectRatio = 16/10;
let windowedWidth = 1024;
let windowedHeight = 640;
let playHeight = windowedHeight - 100;
canvas.width = windowedWidth;
canvas.height = windowedHeight;
let TO_RADIANS = Math.PI/180;
let smallestBox = 16;
let factoryWall = 87;
let magnet = 0;
let explosion = 0;

let forkLift = {
  x: 200,
  y: 200,
  angle: 0,
  moveSpeed: 6,
  angleSpeed: 4,
  size: 120,
  dx: 0,
  dy: 0,
  collisionPt: 0,
  collisionBox: 0
}
let fuel = {
  frameCount: 0,
  fuelsprSpd: 2,
  fuelPercent: 100,
}
let box = {
	x: 0,
	y: 0,
	xvel: 0,
	yvel: 0,
	width: 0,
	color: 0
}
//boxes[0] = x coord, boxes[1] = y coord, boxes[2] = x vel, boxes[3] = y vel, boxes[4] = width, boxes[5] = color
// boxes[6] rotation, boxes[7] corner 1, boxes[8] corner 2, boxes[9] corner3, boxes[10] corner 4, boxes[11] side1,
//boxes[12] side2, boxes[13] side3, boxes[14] side 4,
var boxes = [];
var frameCount = 0;

function update() {
  canvas.width = canvas.width;
    ctx.drawImage(background,0, 0, 1024, 540);
  drawRotatedImage(spr_forkLift,forkLift.x,forkLift.y,forkLift.angle);
  playerMovement(forkLift);
  if(frameCount % 100 == 0) {
  spawnBoxes();
  }
  if(frameCount % 500 == 0) {
	  explosion = 1;
  }
  frameCount+=1;
  if (frameCount % fuel.fuelsprSpd == 0) {
    fuel.frameCount++;
  }
  drawBoxes();
  boxCollision(forkLift);
  removeBoxes();
  drawUI();
  requestAnimationFrame(update);
}

function test() {
	var temp = Math.atan2(5, 5);
	var	tempo =  Math.sin(temp) * forkLift.speed;
	//alert("both pos" + tempo);
	temp = Math.atan2(5, -5);
	tempo = Math.sin(temp) * forkLift.speed;
	//alert("x neg" + tempo);
	temp = Math.atan2(-5, 5);
	tempo = Math.sin(temp) * forkLift.speed;
	//alert("y neg" + tempo);
	temp = Math.atan2(-5, -5);
	tempo = Math.sin(temp) * forkLift.speed;
	//alert("both neg" + tempo);
}

//corners of player are (x, y),(x + width, y), (x, y + width), (x+ width, y + width)
function boxCollision(player) {
	var splicer = [];
	for(i = 0; i < boxes.length; i++) {
		//cDst for circle hitbox
		var xDiff = boxes[i].x - player.collisionBox.x;
		var yDiff = boxes[i].y - player.collisionBox.y;
		var cDst = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2));
		if(cDst < 20) {	
			boxes[i].rotation = player.angle * TO_RADIANS;
			boxes[i].xvel = Math.cos(player.angle* TO_RADIANS) * player.moveSpeed;
			boxes[i].yvel = Math.sin(player.angle* TO_RADIANS) * player.moveSpeed;
		}
		//magnet power up
		if(magnet == 1) {
			if(cDst < 700) {
				var towardsAngle = Math.atan2(yDiff, xDiff);
				boxes[i].rotation = towardsAngle;
				boxes[i].xvel = -Math.cos(towardsAngle) * Math.pow((.999),cDst) * 3;
				boxes[i].yvel = -Math.sin(towardsAngle) * Math.pow((.999),cDst) * 3;
			}
		}
		//booom
		if(explosion == 1) {
			if(cDst < 700) {
				var towardsAngle = Math.atan2(yDiff, xDiff);
				boxes[i].rotation = towardsAngle;
				boxes[i].xvel = Math.cos(towardsAngle) * Math.pow((.99),cDst) * 80;
				boxes[i].yvel = Math.sin(towardsAngle) * Math.pow((.99),cDst) * 80;
			}
		}
		//wall collisions
		if(boxes[i].x > windowedWidth - (boxes[i].width / 2)) {
			boxes[i].x = windowedWidth - (boxes[i].width / 2) - 1;
			boxes[i].xvel *= -.5;
		} else if(boxes[i].x < (boxes[i].width / 2) + factoryWall) {
			boxes[i].x = (boxes[i].width / 2) + 8 + factoryWall;
			if(boxes[i].xvel < 0) {
				boxes[i].xvel *=-.5;
			}

		}
		if(boxes[i].y > playHeight - (boxes[i].width / 2)) {
			boxes[i].y = playHeight - (boxes[i].width / 2)- 1;
			boxes[i].yvel *= -.5;
		} else if(boxes[i].y < (boxes[i].width / 2)) {
			boxes[i].y = (boxes[i].width / 2) + 1;
			boxes[i].yvel *= -.5;
		}
		//rectangle hitbox	
		for(j = 0; j < boxes.length; j++) {
			if(i < 0 || j < 0) {
				alert('mountain momma');
			}
			var b2bDist = Math.pow(boxes[i].x - boxes[j].x, 2) + Math.pow(boxes[i].y - boxes[j].y, 2);
			if(b2bDist < 3.5*(boxes[i].width + boxes[j].width) && i != j) {
			//if(i != j && boxes.length > 20) {
				if(boxes[i].color == boxes[j].color) {
				//if(true) {
					//merge those mommas
					if(boxes[i].width < boxes[j].width) {
						boxes[i].width = (boxes[i].width / 4) + boxes[j].width;
					} else {
						boxes[i].width += boxes[j].width / 4;
					}
					boxes.splice(j, 1);
					j--;
					if(i > j) {
						i--;
					}
				} else {
				var iBoxSpeed = Math.sqrt(Math.pow(boxes[i].xvel , 2) + Math.pow(boxes[i].yvel, 2));
				var jBoxSpeed = Math.sqrt(Math.pow(boxes[j].xvel , 2) + Math.pow(boxes[j].yvel, 2));
				if(jBoxSpeed < 1 && iBoxSpeed < 1) {
					boxes[i].idleLock++;
					boxes[j].idleLock++;
					if(boxes[i].idleLock > 10 || boxes[j].idleLock > 10) {
						var xSign = Math.round(Math.random()) * 2 - 1
						var xSign = Math.round(Math.random()) * 2 - 1
						boxes[i].x += 6.6*xSign;
						boxes[j].x -= 6.6*xSign;
						boxes[i].y += 6.6*xSign;
						boxes[j].y -= 6.6*xSign;
						boxes[i].xvel = 2.6*xSign;
						boxes[i].yvel = 2.6*xSign;
						boxes[j].xvel = -2.6*xSign;
						boxes[j].yvel = 2.6*xSign;
						boxes[i].idleLock = 0;
						boxes[j].idleLock = 0;
					}
				} else if(iBoxSpeed > jBoxSpeed) {
					boxes[j].rotation = boxes[i].rotation;
					boxes[j].xvel = boxes[i].xvel;
					boxes[j].yvel = boxes[i].yvel;
					boxes[j].x += boxes[i].xvel;
					boxes[j].y += boxes[i].yvel;
					boxes[i].idleLock = 0;
					boxes[j].idleLock = 0;
				} else {
					boxes[i].rotation = boxes[j].rotation;
					boxes[i].xvel = boxes[j].xvel;
					boxes[i].yvel = boxes[j].yvel;					
					boxes[i].x += boxes[j].xvel;
					boxes[i].y += boxes[j].yvel;
					boxes[i].idleLock = 0;
					boxes[j].idleLock = 0;
				}
			}
			}
		}
	}
	if(explosion == 1) {
		explosion = 0;
	}
}

function removeBoxes() {
	for(i = boxes.length - 1; i >= 0; i--) {
		if(boxes[i].x > 889) { 
			if(boxes[i].color == 0 && boxes[i].y < 134){
				console.log('b');
				boxes.splice(i, 1);
			} else if(boxes[i].color == 1 && boxes[i].y > 202 && boxes[i].y < 333) {
				console.log('g');
				boxes.splice(i, 1);
			} else if(boxes[i].color == 2 && boxes[i].y > 404) {
				console.log('r');
				boxes.splice(i, 1);
			}
		}
	}
}

function spawnBoxes() {
	var xMin = 100;
	var xMax = 900;
	var yMin = 240;
	var yMax = 300;
	var wMin = 10;
	var wMax = 40;
	var numBoxMin = 5;
	var numBoxMax = 10;
	var xVelMin = 6;
	var xVelMax = 13;
	var yVelMin = -10;
	var yVelMax = 10;
	var numBoxes = Math.floor(Math.random()*(numBoxMax - numBoxMin)) + numBoxMin;
	for(i = 0; i < numBoxes; i++) {
		var newBox = {};
		//newBox.x = Math.floor(Math.random()*(xMax - xMin)) + xMin;
		//factor starts at 72
		newBox.x = 70.0;
		newBox.y = Math.floor(Math.random()*(yMax - yMin)) + yMin;
		//newBox[4] = Math.floor(Math.random()*(wMax - wMin)) + wMin;
		newBox.width = smallestBox;
		newBox.xvel = Math.floor(Math.random()*(xVelMax - xVelMin)) + xVelMin;
		newBox.yvel = Math.floor(Math.random()*(yVelMax - yVelMin)) + yVelMin;
		newBox.color = Math.floor(Math.random()*3);
		newBox.rotation = 0;
		newBox.idleLock = 0;
		boxes.push(newBox);
	}
}

function drawBoxes() {
	for(i = 0; i < boxes.length; i++) {
		ctx.save();
		ctx.translate(boxes[i].x, boxes[i].y);
		ctx.rotate(boxes[i].rotation);
		if(boxes[i].color == 0) {
			ctx.drawImage(spr_blueBox, -(boxes[i].width / 2), -(boxes[i].width / 2), boxes[i].width, boxes[i].width);
		} else if(boxes[i].color == 1) {
			ctx.drawImage(spr_greenBox, -(boxes[i].width / 2), -(boxes[i].width / 2), boxes[i].width, boxes[i].width);
		} else {
			ctx.drawImage(spr_redBox, -(boxes[i].width / 2), -(boxes[i].width / 2), boxes[i].width, boxes[i].width);
		}
		ctx.restore();
		//update box position for next draw
		boxes[i].x+=boxes[i].xvel;
		boxes[i].y+=boxes[i].yvel;
		boxes[i].xvel *= 0.92;
		boxes[i].yvel *= 0.92;
	}
}

let pressedKeys = [];

function playerMovement(player) {
	player.collisionPt = {x:player.x + Math.cos(player.angle*TO_RADIANS )*player.size/2, y:player.y + Math.sin(player.angle*TO_RADIANS) * player.size/2};
	player.collisionBox = {x:player.x + Math.cos(player.angle*TO_RADIANS )*player.size/3, y:player.y + Math.sin(player.angle*TO_RADIANS) * player.size/3};
  let LEFT = pressedKeys.includes(37);
  let RIGHT = pressedKeys.includes(39);
  let SPACE = pressedKeys.includes(32);
  var prevX = player.x;
  var prevY = player.y;
  if (SPACE && fuel.fuelPercent > 0) {
    player.x += Math.cos(player.angle*TO_RADIANS) * player.moveSpeed;
    player.y += Math.sin(player.angle*TO_RADIANS) * player.moveSpeed;
    fuel.fuelPercent-=0;
  }
  if (LEFT) {
    player.angle -= player.angleSpeed;
  }
  if (RIGHT) {
    player.angle += player.angleSpeed;
  }
  if(player.collisionPt.x > windowedWidth - 6) {
	  player.x = prevX;
  } else if(player.collisionPt.x < 6+factoryWall) {
	  player.x = prevX;
  }
  //87 = factory wall
  if(player.collisionPt.y > playHeight - 6) {
	  player.y = prevY;
  } else if(player.collisionPt.y < 6) {
	  player.y = prevY;
  }
}

function drawRotatedImage(image, x, y, angle) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(angle * TO_RADIANS);
	ctx.drawImage(image, -(forkLift.size/2), -(forkLift.size/2));
	if(magnet == 1) {
		ctx.rotate(90 * TO_RADIANS);
		ctx.drawImage(magnetPic, -18, -40);
	}
	ctx.restore();

}

function drawUI() {
  ctx.fillStyle="#484848";
  ctx.fillRect(0, 540, 1024, 100);
  ctx.drawImage(spr_fuel,20, 560, 64, 64);
  ctx.fillStyle="#000000";
  ctx.fillRect(95, 563, 610, 58);
  ctx.drawImage(spr_fuelMeter,(fuel.frameCount%16*600),0,600,48,100, 568, 600, 48);
  ctx.beginPath();
  ctx.moveTo(100, 568);
  ctx.lineTo(130, 568);
  ctx.lineTo(100, 598);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(670, 616);
  ctx.lineTo(700, 616);
  ctx.lineTo(700, 586);
  ctx.fill();
  ctx.fillRect(700, 568, -600*((100-fuel.fuelPercent)*0.01), 48);
}

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

function onKeyDown(event){
  var keyCode = event.keyCode;
  if (!pressedKeys.includes(keyCode)) {
    pressedKeys.push(keyCode);
  }
}

function onKeyUp(event){
  var keyCode = event.keyCode;
  if (pressedKeys.includes(keyCode)) {
    pressedKeys.splice(pressedKeys.indexOf(keyCode),1);
  }
}


window.addEventListener("load", function() {
  update();
});
