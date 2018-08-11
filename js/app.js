let canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
let aspectRatio = 16/10;
let windowedWidth = 1024;
let windowedHeight = 640;
let playerSize = 20;
canvas.width = windowedWidth;
canvas.height = windowedHeight;

let forkLift = {
  x: 200,
  y: 200,
  dx: 0,
  dy: 0,
  speed: 9
}
//boxes[0] = x coord, boxes[1] = y coord, boxes[2] = x vel, boxes[3] = y vel, boxes[4] = width, boxes[5] = color
var boxes = [];
var x = 0;

function update() {
  canvas.width = canvas.width;
  //test();
  drawPlayer(forkLift);
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
	var centerx = player.x + (playerSize / 2);
	var centery = player.y + (playerSize / 2);
	for(i = 0; i < boxes.length; i++) {
		var boxCentx = boxes[i][0] + (boxes[i][4] / 2);
		var boxCenty = boxes[i][1] + (boxes[i][4] / 2);
		var xDiff = boxCentx - centerx;
		var yDiff = boxCenty - centery;
		if(Math.abs(xDiff) < ((boxes[i][4]+ playerSize) / 2) && Math.abs(yDiff) < ((boxes[i][4]+ playerSize) / 2)) {
			//find the closest corner
			
			var angle = Math.atan2(yDiff, xDiff);
			if(Math.abs(angle) < 0.707) {
				boxes[i][2] = Math.cos(angle) * player.speed;
			} else if(Math.abs(angle) > 2.356) {
				boxes[i][3] = Math.sin(angle) * player.speed;
			} else {
				boxes[i][2] = Math.cos(angle) * player.speed;
				boxes[i][3] = Math.sin(angle) * player.speed;
			}
		}
	}
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
		newBox[4] = Math.round(Math.random()*(wMax - wMin)) + wMin;
		newBox[2] = 0;
		newBox[3] = 0;
		newBox[5] = Math.round(Math.random()*3);
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
		ctx.fillRect(boxes[i][0],boxes[i][1],boxes[i][4],boxes[i][4]);
		//update box position for next draw
		boxes[i][0]+=boxes[i][2];
		boxes[i][1]+=boxes[i][3];
		boxes[i][2] *= 0.8;
		boxes[i][3] *= 0.8;
	}
}

let pressedKeys = [];

function drawPlayer(player) {
	ctx.fillRect(player.x,player.y,playerSize,playerSize);
	player.x += player.dx;
	if(player.x > windowedWidth - playerSize) {
	  player.x = windowedWidth - playerSize;
	} else if(player.x < 0) {
	  player.x = 0;
	}
	player.y += player.dy;
	if(player.y > windowedHeight - playerSize) {
	  player.y = windowedHeight - playerSize;
	} else if(player.y < 0) {
	  player.y = 0;
	}
}

function playerMovement(player) {
  let LEFT = pressedKeys.includes(37);
  let UP = pressedKeys.includes(38);
  let RIGHT = pressedKeys.includes(39);
  let DOWN = pressedKeys.includes(40);
  let rootSpd = 0.7071067811865 * player.speed;
  player.dy = 0;
  player.dx = 0;
  if (UP && !LEFT && !RIGHT) {
	player.dy = -player.speed;
  }
  if (UP && LEFT) {
	player.dy = -rootSpd;
    player.dx = -rootSpd;
  }
  if (UP && RIGHT) {
    player.dy = -rootSpd;
    player.dx = rootSpd;
  }
  if (DOWN && !LEFT && !RIGHT) {
    player.dy = player.speed;
  }
  if (DOWN && LEFT) {
    player.dy = rootSpd;
    player.dx = -rootSpd;
  }
  if (DOWN && RIGHT) {
    player.dy = rootSpd;
    player.dx = rootSpd;
  }
  if (LEFT && !UP && !DOWN) {
    player.dx = -player.speed;
  }
  if (RIGHT && !UP && !DOWN) {
    player.dx = player.speed;
  }
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
