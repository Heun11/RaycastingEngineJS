var canvas;
var ctx;
var runLoop;
const fps = 60;

function engineKeyDown(e)
{
    gKeyDown(e);
}

function engineKeyUp(e)
{
    gKeyUp(e);
}

addEventListener("keydown", engineKeyDown);
addEventListener("keyup", engineKeyUp);

function engineRGBToHex(r, g, b)
{
    return "#"+r.toString(16)+g.toString(16)+b.toString(16);
}

function engineMap(x, in_min, in_max, out_min, out_max) 
{
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function engineNormalize(x, y)
{
    let mag = Math.sqrt((x**2)+(y**2));
    return {x:x/mag, y:y/mag};
}

function engineToRad(degrees, precision = 4)
{
    return parseFloat(((parseFloat(degrees) * Math.PI) / 180).toFixed(precision));
}

function engineToDeg(radians, precision = 4)
{
    return parseFloat(parseFloat(radians) * (180 / Math.PI).toFixed(precision));
}

function engineInit()
{
    canvas = document.getElementById("gameCanvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    ctx = canvas.getContext("2d");
    runLoop = true;
}

function engineDrawLine(x1, y1, x2,y2, stroke = 'black', width = 2) 
{
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.stroke();
}

function engineDrawRectangle(x, y, width, height, color) 
{
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function engineDrawText(text, x, y, size)
{
    ctx.font = size+"px Arial";
    ctx.fillText(text, x, y);
}

function engineUpdate()
{
    engineDrawRectangle(0,0,canvas.width, canvas.height, "#161616");
    gUpdate()
}

function engineLoop()
{
    if(runLoop){
        engineUpdate();
        setTimeout(engineLoop, 1000/fps);
    }
}

engineInit();
engineLoop();

var engineMousePos = { x: 0, y: 0 };
canvas.addEventListener("click", async () => {
    if(!document.pointerLockElement) {
      await canvas.requestPointerLock({
        unadjustedMovement: true,
      });
    }
});
document.addEventListener("pointerlockchange", lockChangeAlert, false);

function lockChangeAlert() {
  if (document.pointerLockElement === canvas) {
    console.log("The pointer lock status is now locked");
    document.addEventListener("mousemove", engineMousePosition, false);
  } else {
    console.log("The pointer lock status is now unlocked");
    document.removeEventListener("mousemove", engineMousePosition, false);
  }
}

function engineMousePosition(e)
{
    function updateCoord(pos, delta, max) {
        pos += delta;
        pos %= max;
        if (pos < 0) {
          pos += max;
        }
        return pos;
      }
    
    engineMousePos.x = updateCoord(engineMousePos.x, e.movementX, canvas.width);
    engineMousePos.y = updateCoord(engineMousePos.y, e.movementY, canvas.height);

    // console.log(engineMousePos);
}