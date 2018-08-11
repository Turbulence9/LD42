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
  speed: 2,
}

function update() {
  canvas.width = canvas.width;
  ctx.fillRect(forkLift.x,forkLift.y,20,20);
  requestAnimationFrame(update);
}

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

function onKeyDown(event){
  var keyCode = event.keyCode;
  if(keyCode == 37) {
    forkLift.x-= forkLift.speed;
  }
  if(keyCode == 38) {
    forkLift.y-= forkLift.speed;
  }
  if(keyCode == 39) {
    forkLift.x+= forkLift.speed;
  }
  if(keyCode == 40) {
    forkLift.y+= forkLift.speed;
  }
}

function onKeyUp(event){
  var keyCode = event.keyCode;
  if(keyCode == 32) {

  }
}

window.addEventListener("load", function() {
  update();
});
