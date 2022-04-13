//rerieve node in DOM via ID
var c = document.getElementById("canvas");
console.log(c);

//instantiate a CanvassRenderingContext2D object
var ctx = c.getContext("2d");
console.log(ctx)

//init global state variable
let frame = 0;
let getFrames = document.getElementById("getFrames");

//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations

//draw();

let restore = function (i) {
    console.log("restore attempted")
    ctx.putImageData(frames[i], 0, 0);
}

function clear(e) {
    console.log("clear attempted");
    ctx.clearRect(0, 0, width, height);
}

function getLocalFrames(){
    console.log(JSON.parse(sessionStorage.getItem("frameData")));
}