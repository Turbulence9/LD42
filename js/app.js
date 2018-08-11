let canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
let aspectRatio = 16/10;
let windowedWidth = 1024;
let windowedHeight = 640;
canvas.width = windowedWidth;
canvas.height = windowedHeight;

let forkLift = {
  x: 200,
  y: 200,
<<<<<<< HEAD
  speed: 10,
}
//boxes[0] = x coord, boxes[1] = y coord, boxes[2] = x vel, boxes[3] = y vel, boxes[4] = width, boxes[5] = color
var boxes = [];
var x = 0;
function update() {
  canvas.width = canvas.width;
  ctx.fillRect(forkLift.x,forkLift.y,20,20);
  if(x %2 == 0) {
	  
  spawnBoxes();
  }
  //ctx.fillRect(boxes[0][0],boxes[0][1],boxes[0][4],boxes[0][4]);
  drawBoxes();
  x+=1;
  requestAnimationFrame(update);
}

function boxCollision(box1, box2) {
	
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
	}
=======
  speed: 1,
}

let pressedKeys = [];

function update() {
  canvas.width = canvas.width;
  ctx.fillRect(forkLift.x,forkLift.y,20,20);
  playerMovement(forkLift);
  requestAnimationFrame(update);
}

function playerMovement(player) {
  let LEFT = pressedKeys.includes(37);
  let UP = pressedKeys.includes(38);
  let RIGHT = pressedKeys.includes(39);
  let DOWN = pressedKeys.includes(40);
  let rootSpd = Math.sqrt(player.speed)
  if (UP && !LEFT && !RIGHT) {
    player.y -=player.speed;
  }
  if (UP && LEFT) {
    player.y -= rootSpd;
    player.x -= rootSpd;
  }
  if (UP && RIGHT) {
    player.y -= rootSpd;
    player.x += rootSpd;
  }
  if (DOWN && !LEFT && !RIGHT) {
    player.y +=player.speed;
  }
  if (DOWN && LEFT) {
    player.y += rootSpd;
    player.x -= rootSpd;
  }
  if (DOWN && RIGHT) {
    player.y += rootSpd;
    player.x += rootSpd;
  }
  if (LEFT && !UP && !DOWN) {
    player.x -=player.speed;
  }
  if (RIGHT && !UP && !DOWN) {
    player.x +=player.speed;
  }
>>>>>>> 2ceb1805d5b42cdb7831c55d52d4d46b0fdc5c1b
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
