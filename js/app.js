let canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
let aspectRatio = 16/10;
let windowedWidth = 1024;
let windowedHeight = 640;
canvas.width = windowedWidth;
canvas.height = windowedHeight;
let TO_RADIANS = Math.PI/180;
let playerSize = 60;

let forkLift = {
  x: 200,
  y: 200,
  angle: 0,
  moveSpeed: 6,
  angleSpeed: 4,
  size: 60,
  dx: 0,
  dy: 0,
  collisionPt: 0
}
//boxes[0] = x coord, boxes[1] = y coord, boxes[2] = x vel, boxes[3] = y vel, boxes[4] = width, boxes[5] = color
// boxes[6] rotation, boxes[7] corner 1, boxes[8] corner 2, boxes[9] corner3, boxes[10] corner 4, boxes[11] side1, 
//boxes[12] side2, boxes[13] side3, boxes[14] side 4,
var boxes = [];
var x = 0;

function update() {
  canvas.width = canvas.width;
  drawRotatedImage(spr_forkLift,forkLift.x,forkLift.y,forkLift.angle);
  playerMovement(forkLift);
  if(x == 0) {
	spawnBoxes();
	x+=1;
  }
  drawBoxes();
  boxCollision(forkLift);
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
		var boxCentx = boxes[i][0] + (boxes[i][4] / 2);
		var boxCenty = boxes[i][1] + (boxes[i][4] / 2);
		var xDiff = boxCentx - player.collisionPt.x;
		var yDiff = boxCenty - player.collisionPt.y;
		var cDst = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2));
		if(Math.abs(cDst) < ((boxes[i][4]+ 20) / 2) && Math.abs(yDiff) < ((boxes[i][4]+ 20) / 2)) {
			//find the closest corner
			//var angle = Math.atan2(yDiff, xDiff);
			/*if(Math.abs(angle) < 0.707) {
				//boxes[i][2] = Math.cos(angle) * player.speed;
			} else if(Math.abs(angle) > 2.356) {
				//boxes[i][3] = Math.sin(angle) * player.speed;
			} else {
				//boxes[i][2] = Math.cos(angle) * player.speed;
				//boxes[i][3] = Math.sin(angle) * player.speed;
			}*/
			boxes[i][6] = player.angle;
			boxes[i][2] = Math.cos(player.angle* TO_RADIANS) * player.speed;
			boxes[i][3] = Math.sin(player.angle* TO_RADIANS) * player.speed;
		}
	}
	/*for(i = 0; i < boxes.length; i++) {
		for(j = 1; j < boxes.length; j++) {
			var closestCorner = 0;
			var closestSide = 0;
			var closestDist = Math.pow(boxes[i][0] - boxes[j][0], 2) + Math.pow(boxes[i][1] - boxes[j][1], 2);
			for(k = 6; k < boxes[i].length - 4; k++) {
				for(l = 10; l < boxes[j].length; l++) {
					
				}
			}
		}
	}*/
}

function spawnBoxes() {
	var xMin = 100;
	var xMax = 900;
	var yMin = 100;
	var yMax = 500;
	var wMin = 10;
	var wMax = 40;
	var numBoxMin = 5;
	var numBoxMax = 10;
	var numBoxes = Math.round(Math.random()*(numBoxMax - numBoxMin)) + numBoxMin;
	for(i = 0; i < numBoxes; i++) {
		var newBox = [];
		newBox[0] = Math.round(Math.random()*(xMax - xMin)) + xMin;
		newBox[1] = Math.round(Math.random()*(yMax - yMin)) + yMin;
		//newBox[4] = Math.round(Math.random()*(wMax - wMin)) + wMin;
		newBox[4] = 16;
		newBox[2] = 0;
		newBox[3] = 0;
		newBox[5] = Math.round(Math.random()*3);
		newBox[6] = 0;
		boxes.push(newBox);
	}
}

function drawBoxes() {
	for(i = 0; i < boxes.length; i++) {
		if(boxes[i][5] == 0) {
			ctx.fillStyle="#FF0000";
		} else if(boxes[i][5] == 1) {
			ctx.fillStyle="#00FF00";
		} else {
			ctx.fillStyle="#0000FF";
		}
		ctx.save();
		ctx.translate(boxes[i][0], boxes[i][1]);
		ctx.rotate(boxes[i][6] * TO_RADIANS);
		ctx.fillRect(0,0,boxes[i][4],boxes[i][4]);
		ctx.restore();
		//update box position for next draw
		boxes[i][0]+=boxes[i][2];
		boxes[i][1]+=boxes[i][3];
		if(boxes[i][0] > windowedWidth - playerSize) {
			boxes[i][0] = windowedWidth - boxes[i][4];
			boxes[i][2] = 0;
		} else if(boxes[i][0] < 0) {
			boxes[i][0] = 0;
			boxes[i][2] = 0;
		}
		if(boxes[i][1] > windowedHeight - playerSize) {
			boxes[i][1] = windowedWidth - boxes[i][4];
			boxes[i][3] = 0;
		} else if(boxes[i][1] < 0) {
			boxes[i][1] = 0;
			boxes[i][3] = 0;
		}
		boxes[i][2] *= 0.8;
		boxes[i][3] *= 0.8;
		// corners
		/*boxes[i][7] = {x:boxes[i][0], y:boxes[i][1]};
		boxes[i][8] = {x:boxes[i][0] + boxes[i][4], y:boxes[i][1]};
		boxes[i][9] = {x:boxes[i][0], y:boxes[i][1] + boxes[i][4]};
		boxes[i][10] = {x:boxes[i][0] + boxes[i][4], y:boxes[i][1] + boxes[i][4]};
		//sides
		boxes[i][11] = {x:boxes[i][0], y:boxes[i][1] + (boxes[i][4] / 2)};
		boxes[i][12] = {x:boxes[i][0] + (boxes[i][4] / 2), y:boxes[i][1]};
		boxes[i][13] = {x:boxes[i][0] + (boxes[i][4] / 2), y:boxes[i][1] + boxes[i][4]};
		boxes[i][14] = {x:boxes[i][0] + boxes[i][4], y:boxes[i][1] + (boxes[i][4] / 2)};*/
	}
}

let pressedKeys = [];

function playerMovement(player) {
	player.collisionPt = {x:player.x + Math.cos(player.angle*TO_RADIANS )*30, y:player.y + Math.sin(player.angle*TO_RADIANS) * 30};
	/*var corners = [];
   ctx.fillStyle="#FF0000";
  corners[0] = {x:player.x, y:player.y};
  ctx.fillRect(corners[0].x,corners[0].y,2,2);
  corners[1] = {x:player.x + Math.cos(player.angle*TO_RADIANS )*40, y:player.y + Math.sin(player.angle*TO_RADIANS) * 40};
  ctx.fillRect(corners[1].x,corners[1].y,2,2);
  corners[2] = {x:player.x + -Math.cos((90 - player.angle)*TO_RADIANS )*20, y:player.y + Math.sin((90 - player.angle)*TO_RADIANS )*20};
   ctx.fillRect(corners[2].x,corners[2].y,2,2);
  corners[3] = { x:corners[1].x + corners[2].x - corners[0].x ,y:corners[1].y + corners[2].y - corners[0].y };
  ctx.fillRect(corners[3].x,corners[3].y,2,2);*/
	
	
  let LEFT = pressedKeys.includes(37);
  let UP = pressedKeys.includes(38);
  let RIGHT = pressedKeys.includes(39);
  let DOWN = pressedKeys.includes(40);
  var prevX = player.x;
  var prevY = player.y;
  if (UP) {
    player.x += Math.cos(player.angle*TO_RADIANS) * player.moveSpeed;
    player.y += Math.sin(player.angle*TO_RADIANS) * player.moveSpeed;
  }
  if (LEFT) {
    player.angle -= player.angleSpeed;
  }
  if (RIGHT) {
    player.angle += player.angleSpeed;
  }
  if (DOWN) {
    player.x -= Math.cos(player.angle*TO_RADIANS) * player.moveSpeed;
    player.y -= Math.sin(player.angle*TO_RADIANS) * player.moveSpeed;
  }
  if(player.collisionPt.x > windowedWidth - 6) {
	  player.x = prevX;
  } else if(player.collisionPt.x < 6) {
	  player.x = prevX;
  }
  if(player.collisionPt.y > windowedHeight - 6) {
	  player.y = prevY;
  } else if(player.collisionPt.y < 6) {
	  player.y = prevY;
  }
}

function drawRotatedImage(image, x, y, angle) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(angle * TO_RADIANS);
	ctx.drawImage(image,-(30),-(30));
	ctx.restore();
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
