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
  drawRotatedImage(spr_forkLift,forkLift.x,forkLift.y,forkLift.angle);
  playerMovement(forkLift);
  if(frameCount % 100 == 0) {
  spawnBoxes();
  }
  frameCount+=1;
  if (frameCount % fuel.fuelsprSpd == 0) {
    fuel.frameCount++;
  }
  drawBoxes();
  boxCollision(forkLift);
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
	for(i = 0; i < boxes.length; i++) {
		//cDst for circle hitbox
		var xDiff = boxes[i].x - player.collisionBox.x;
		var yDiff = boxes[i].y - player.collisionBox.y;
		var cDst = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2));
		if(cDst < boxes[i].width) {	
			boxes[i].rotation = player.angle;
			boxes[i].xvel = Math.cos(player.angle* TO_RADIANS) * player.moveSpeed;
			boxes[i].yvel = Math.sin(player.angle* TO_RADIANS) * player.moveSpeed;
		}
		//rectangle hitbox	
		for(j = 1; j < boxes.length; j++) {
			var b2bDist = Math.pow(boxes[i].x - boxes[j].x, 2) + Math.pow(boxes[i].y - boxes[j].y, 2);
			if(b2bDist < 2.0*(boxes[i].width + boxes[j].width) && i != j) {
				if(boxes[i].color == boxes[j].color) {
					//merge those mommas
					if(boxes[i].width < boxes[j].width) {
						boxes[i].width = (boxes[i].width / 4) + boxes[j].width;
					} else {
						boxes[i].width += boxes[j].width / 4;
					}
					boxes.splice(j, 1);
					j--;
				} else {
				var iBoxSpeed = Math.sqrt(Math.pow(boxes[i].xvel , 2) + Math.pow(boxes[i].yvel, 2));
				var jBoxSpeed = Math.sqrt(Math.pow(boxes[j].xvel , 2) + Math.pow(boxes[j].yvel, 2));
				if(jBoxSpeed < 1 && iBoxSpeed < 1) {
					boxes[i].idleLock++;
					boxes[j].idleLock++;
					if(boxes[i].idleLock > 20 || boxes[j].idleLock > 20) {
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

}

function spawnBoxes() {
	var xMin = 100;
	var xMax = 900;
	var yMin = 200;
	var yMax = 400;
	var wMin = 10;
	var wMax = 40;
	var numBoxMin = 5;
	var numBoxMax = 10;
	var xVelMin = 4;
	var xVelMax = 30;
	var yVelMin = -15;
	var yVelMax = 15;
	var numBoxes = Math.floor(Math.random()*(numBoxMax - numBoxMin)) + numBoxMin;
	for(i = 0; i < numBoxes; i++) {
		var newBox = {};
		//newBox.x = Math.floor(Math.random()*(xMax - xMin)) + xMin;
		newBox.x = 0.0;
		newBox.y = Math.floor(Math.random()*(yMax - yMin)) + yMin;
		//newBox[4] = Math.floor(Math.random()*(wMax - wMin)) + wMin;
		newBox.width = smallestBox;
		newBox.xvel = Math.floor(Math.random()*(xVelMax - xVelMin)) + xVelMin;
		newBox.yvel = Math.floor(Math.random()*(yVelMax - yVelMin)) + yVelMin;
		newBox.color = Math.floor(Math.random()*3);
		newBox.rotation = 0;
		newBox.idleLock = 0;
		newBox.spawn = 1;
		boxes.push(newBox);
	}
}

function drawBoxes() {
	for(i = 0; i < boxes.length; i++) {
		ctx.save();
		ctx.translate(boxes[i].x, boxes[i].y);
		ctx.rotate(boxes[i].rotation * TO_RADIANS);
		ctx.scale(boxes[i].width / smallestBox,boxes[i].width / smallestBox)
		if(boxes[i].color == 0) {
			ctx.drawImage(spr_blueBox, -(boxes[i].width / 2), -(boxes[i].width / 2));
		} else if(boxes[i].color == 1) {
			ctx.drawImage(spr_greenBox, -(boxes[i].width / 2), -(boxes[i].width / 2));
		} else {
			ctx.drawImage(spr_redBox, -(boxes[i].width / 2), -(boxes[i].width / 2));
		}
		ctx.restore();
		//update box position for next draw
		boxes[i].x+=boxes[i].xvel;
		boxes[i].y+=boxes[i].yvel;
		if(boxes[i].spawn == 1) {
		if(boxes[i].x > windowedWidth - boxes[i].width) {
			boxes[i].x = windowedWidth - boxes[i].width - 1;
			boxes[i].xvel *= -1.1;
		} else if(boxes[i].x < boxes[i].width) {
			boxes[i].x = boxes[i].width + 1;
			boxes[i].xvel *= -1.1;
		}
		if(boxes[i].y > playHeight - boxes[i].width) {
			boxes[i].y = playHeight - boxes[i].width - 1;
			boxes[i].yvel *= -1.1;
		} else if(boxes[i].y < boxes[i].width) {
			boxes[i].y = boxes[i].width + 1;
			boxes[i].yvel *= -1.1;
		}
		} else {
			if(boxes[i].x > boxes[i].width) {
				boxes[i].spawn = 0;
			}
		}
		boxes[i].xvel *= 0.8;
		boxes[i].yvel *= 0.8;
		// corners
		/*boxes[i][7] = {x:boxes[i].x, y:boxes[i].y};
		boxes[i][8] = {x:boxes[i].x + boxes[i].width, y:boxes[i].y};
		boxes[i][9] = {x:boxes[i].x, y:boxes[i].y + boxes[i].width};
		boxes[i][10] = {x:boxes[i].x + boxes[i].width, y:boxes[i].y + boxes[i].width};
		//sides
		boxes[i][11] = {x:boxes[i].x, y:boxes[i].y + (boxes[i].width / 2)};
		boxes[i][12] = {x:boxes[i].x + (boxes[i].width / 2), y:boxes[i].y};
		boxes[i][13] = {x:boxes[i].x + (boxes[i].width / 2), y:boxes[i].y + boxes[i].width};
		boxes[i][14] = {x:boxes[i].x + boxes[i].width, y:boxes[i].y + (boxes[i].width / 2)};*/
	}
}

let pressedKeys = [];

function playerMovement(player) {
	player.collisionPt = {x:player.x + Math.cos(player.angle*TO_RADIANS )*player.size/2, y:player.y + Math.sin(player.angle*TO_RADIANS) * player.size/2};
	player.collisionBox = {x:player.x + Math.cos(player.angle*TO_RADIANS )*player.size/3, y:player.y + Math.sin(player.angle*TO_RADIANS) * player.size/3};

	/*var corners = [];
   ctx.fillStyle="#FF0000";
  corners[0] = {x:player.x, y:player.y};
  ctx.fillRect(corners[0].x,corners[0].y,2,2);
  corners[1] = {x:player.x + Math.cos(player.angle*TO_RADIANS )*40, y:player.y + Math.sin(player.angle*TO_RADIANS) * 40};
  corners[1] = {x:player.x + Math.cos(player.angle*TO_RADIANS )*40, y:player.y + Math.sin(player.angle*TO_RADIANS) * 40};
  ctx.fillRect(corners[1].x,corners[1].y,2,2);
  corners[2] = {x:player.x + -Math.cos((90 - player.angle)*TO_RADIANS )*20, y:player.y + Math.sin((90 - player.angle)*TO_RADIANS )*20};
   ctx.fillRect(corners[2].x,corners[2].y,2,2);
  corners[3] = { x:corners[1].x + corners[2].x - corners[0].x ,y:corners[1].y + corners[2].y - corners[0].y };*/
  ctx.fillRect(player.collisionBox.x,player.collisionBox.y,4,4);


  let LEFT = pressedKeys.includes(37);
  let RIGHT = pressedKeys.includes(39);
  let SPACE = pressedKeys.includes(32);
  var prevX = player.x;
  var prevY = player.y;
  if (SPACE && fuel.fuelPercent > 0) {
    player.x += Math.cos(player.angle*TO_RADIANS) * player.moveSpeed;
    player.y += Math.sin(player.angle*TO_RADIANS) * player.moveSpeed;
    fuel.fuelPercent-=0.075;
  }
  if (LEFT) {
    player.angle -= player.angleSpeed;
  }
  if (RIGHT) {
    player.angle += player.angleSpeed;
  }
  if(player.collisionPt.x > windowedWidth - 6) {
	  player.x = prevX;
  } else if(player.collisionPt.x < 6) {
	  player.x = prevX;
  }
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
