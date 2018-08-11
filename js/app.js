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
