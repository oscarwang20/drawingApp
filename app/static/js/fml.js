const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
let height = canvas.height;
let width = canvas.width;

// keeps track of frame and image data
let currFrame = 0;
let loadedFrame = 0;
let frames = {};
let framesDataURL = [];
let intervalID = 0;
let frameSaves = document.getElementById("frameSaves");

// keeps track of drawing history
let history = [];
let step = -1;

function pushHistory() {
    step++;
    history.push(canvas.toDataURL());
    console.log("pushed " + step);
}

function undo() {
    if (step > 0) {
        step--;
        console.log("after -- is " + step);
        var img = new Image();
        img.src = history[step];
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
        console.log(step);
    }
}

function redo() {
    if (step < history.length - 1) {
        step++;
        var img = new Image();
        img.src = history[step];
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
        console.log(step);
    }
}

let loadFrame = () => {
    console.log("import successful");
}

function saveDrawing(e) {
    console.log("save attempted");
    currFrame++;
    let reference = document.createElement("button");
    let data = ctx.getImageData(0, 0, width, height);
    reference.className = "button";
    reference.innerHTML = currFrame;
    // reference.width = 50;
    // reference.height = 50;
    // let refCtx = reference.getContext("2d");
    // refCtx.putImageData(data, 0, 0);
    frames[currFrame] = data;
    console.log(frames);
    const i = currFrame;
    document.cookie = "currFrame=" + currFrame + ";" + "path=/" + ";" + "sameSite=Strict";
    document.cookie = "frames=" + frames + ";" + "path=/" + ";" + "sameSite=Strict";
    reference.addEventListener("click", function () {
        restore(i);
    });
    frameSaves.appendChild(reference);
    history = new Array();
}

// restores the drawing using putImageData()
let restore = function (i) {
    console.log("restore attempted")
    ctx.putImageData(frames[i], 0, 0);
}

let frameData = function () {
    return frames;
}


// drawing variables
let color;
let penWidth;
let eraserWidth;
let erase = false;
let initialize = false;
let corner1 = true;
let center = true;
let rectDone = false;
let data;
let x1, x2, y1, y2;
let requestID;
// This is the flag that we are going to use to
// trigger drawing
let mode = "paint";
let paint = false;

let col = document.getElementById("penColor");
let penSlider = document.getElementById("penSize");

// Stores the initial position of the cursor
let coord = { x: 0, y: 0 };

function getPosition(event) {
    var rect = canvas.getBoundingClientRect();
    coord.x = event.clientX - rect.left;
    coord.y = event.clientY - rect.top;
}

// The following functions toggle the flag to start
// and stop drawing
function mouseDown(event) {
    if (mode == "paint") {
        paint = true;
        getPosition(event);
        initialize = false;
    }
    if (mode == "erase") {
        erase = true;
        getPosition(event);
    }

}


function drawRect(event) {
    if (mode == "rect" && !corner1) {
        clear();
        ctx.putImageData(data, 0, 0);
        ctx.beginPath();
        getPosition(event);
        let a = coord.x;
        let b = coord.y;
        ctx.rect(x1, y1, a - x1, b - y1);
        ctx.stroke();
        // console.log('animate');
        // window.cancelAnimationFrame(requestID);
    }

}

function drawCircle(event) {
    if (mode == "circle" && !center) {
        clear();
        ctx.putImageData(data, 0, 0);
        ctx.beginPath();
        getPosition(event);
        let a = coord.x;
        let b = coord.y;
        let radius = Math.sqrt(Math.pow(a - x1, 2) + Math.pow(b - y1, 2));
        ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
        ctx.stroke();
        // console.log('animate');
        // window.cancelAnimationFrame(requestID);
    }

}


function mouseClick() {
    if (mode == "circle") {
        ctx.beginPath();
        ctx.lineWidth = penWidth;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;
        if (!center) {
            getPosition(event);
            x2 = coord.x;
            y2 = coord.y;
            let radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
            ctx.stroke();
            center = true;
            return;
        }
        if (center) {
            getPosition(event);
            x1 = coord.x;
            y1 = coord.y;
            center = false;
            data = ctx.getImageData(0, 0, width, height);
            // console.log("center");

            return;
        }

    }
    if (mode == "rect") {
        ctx.beginPath();
        ctx.lineWidth = penWidth;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;
        if (!corner1) {
            getPosition(event);
            x2 = coord.x;
            y2 = coord.y;
            ctx.rect(x1, y1, x2 - x1, y2 - y1);
            ctx.stroke();
            corner1 = true;
            // console.log("cor2");
            return;
        }
        if (corner1) {
            getPosition(event);
            x1 = coord.x;
            y1 = coord.y;
            corner1 = false;
            data = ctx.getImageData(0, 0, width, height);
            // console.log("cor1");

            return;
        }

    }
}

function mouseUp() {
    pushHistory();
    erase = false;
    paint = false;
}

function sketch(event) {
    ctx.beginPath();
    if (paint) {
        ctx.lineWidth = penWidth;
        // Sets the end of the lines drawn
        // to a round shape.
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        // The cursor to start drawing
        // moves to this coordinate
        ctx.moveTo(coord.x, coord.y);
        // The position of the cursor
        // gets updated as we move the
        // mouse around.
        getPosition(event);
        // A line is traced from start
        // coordinate to this coordinate
        ctx.lineTo(coord.x, coord.y);
        // Draws the line.
        ctx.stroke();  
    }
    if (erase) {
        ctx.lineWidth = penWidth;
        ctx.lineCap = "round";
        ctx.strokeStyle = "white";
        ctx.moveTo(coord.x, coord.y);
        getPosition(event);
        ctx.lineTo(coord.x, coord.y);
        ctx.stroke();
       
    }
    if (mode == "rect") {
        drawRect(event);
    }
    if (mode == "circle") {
        drawCircle(event);
    }

}



// clears the canvas
function clear(e) {
    // console.log("clear attempted");
    ctx.clearRect(0, 0, width, height);
}

function penOn() {
    mode = "paint";
    erase = false;
    // console.log("draw");
}

function eraseOn() {
    mode = "erase";
    paint = false;
    // console.log("erase");
}

function rectOn() {
    mode = "rect";
    requestID = window.requestAnimationFrame(drawRect);

    // console.log("rect")
}

function circleOn() {
    mode = "circle";
    requestID = window.requestAnimationFrame(drawCircle);

    // console.log("circle")
}
//changes the pen color according to user input
function penCol() {
    // let as = document.forms[0].penColor.value;
    color = col.options[col.selectedIndex].text;
    // console.log(color);
}

penSlider.oninput = function () {
    penWidth = penSlider.value;
    // console.log(penWidth);
}

// initialize canvas variables


// drawing variables
// This is the flag that we are going to use to
// trigger drawing

// HTML references
let canvasSpace = document.getElementById("canvas");
let saveBtn = document.getElementById("save");
let clearBtn = document.getElementById("clear");
let eraserBtn = document.getElementById("eraser");
let penBtn = document.getElementById("pen");
let rectBtn = document.getElementById("rect");
let circleBtn = document.getElementById("circle");
let eraserSlider = document.getElementById("eraserSize");
let undoBtn = document.getElementById("undo");
let redoBtn = document.getElementById("redo");


let animateBtn = document.getElementById("animate");
let clearCanvas = document.getElementById("refresh");
let publish = document.getElementById("publish");

// Stores the initial position of the cursor

// wait for the content of the window element
// to load, then performs the operations.
window.addEventListener('load', () => {

    pushHistory();
    canvas.addEventListener('mousedown', mouseDown);
    canvas.addEventListener('mouseup', mouseUp);
    canvas.addEventListener('mousemove', sketch);

});

col.onchange = penCol;
penCol();

let animationFrameCount = 1;

function test() {
    return frameData();
};

function animateFrame(frameNumber) {
    ctx.clearRect(0, 0, width, height);
    restore(frameNumber)

};

let draw = () => {
    if (Object.keys(frames).length < 1 || animationFrameCount > Object.keys(frames).length){
        clearInterval(intervalID)
        return; //breaks with condition
    }
    animateFrame(animationFrameCount)
    animationFrameCount += 1;
};



function animateCanvas() {
    console.log("buttonworks");
    animationFrameCount = 1;
    intervalID = setInterval(draw, 500)

};

var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

function convertObject(frame){
    var frameConverted = jQuery.extend(frameConverted,frame)
    return frameConverted;
}

function frame2JSON(frame){
    convertedFrameRef = convertObject(frame);
    return JSON.stringify(convertedFrameRef);
}

function convertFrameSet(frameSet){
    frameSetDupe = frameSet;
    for (let frameCount = 1; frameCount <= Object.keys(frameSetDupe).length; frameCount++){
        frameSetDupe[frameCount] = convertObject(frameSetDupe[frameCount])
    }

    return frameSetDupe;

}

function frameSet2JSON(frameSet){
    convertedFrameSetRef = convertFrameSet(frameSet);
    return JSON.stringify(convertedFrameSetRef);
}

function u8ToHex(u8){
    var decoder = new TextDecoder('utf8');
    var b64encoded = btoa(unescape(encodeURIComponent(decoder.decode(u8))));

    return b64encoded;
}

function hexToU8(b64encoded){
    var u8_2 = new Uint8ClampedArray(decodeURIComponent(escape(atob(b64encoded))).split("").map(function (c) {
        return c.charCodeAt(0);
    }));

    return u8_2;
}

function frame_from_hex(hex_data){
    let u8_2_data = hexToU8(hex_data);
    return new ImageData(u8_2_data, 600, 600);
}

function frameSetList(framesDict){
    u8List = [];
    for (const [key, value] of Object.entries(framesDict)) {
        console.log(key,value);
        u8List.push(u8ToHex(value.data))
    }

    return u8List;

}

function export2JSON(){
    u8List = frameSetList(frames);

    return JSON.stringify(u8List);
}

function loadJSONPayload(JSONPayload){
    let unpackagedJSON = JSON.parse(JSONPayload);
    frames = {};

    for(let frameNumber = 0; frameNumber < unpackagedJSON.length; frameNumber++){
        frameObject = frame_from_hex(unpackagedJSON[frameNumber]);

        frames[frameNumber + 1] = frameObject;
    }
    return frames;
}

function postPayload(title,frameJSON, user){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        user : user,
        title: title,
        animation : frameJSON
    }));
}

function sendAnimation(title,user){
    postPayload(title,export2JSON(),user)
}

function sendAnimationAuto(){
    let text = document.getElementById("animationTitle");
    let title = text.value;
    let username = document.getElementById("username");
    username = username.innerText;
    sendAnimation(title,username)
    alert("Published!")
}

function refresh(){
    window.location.reload();
    history = new Array();
}

function logSomething(){
    console.log("Something has been logged.");
}

animateBtn.addEventListener("click", animateCanvas, false);
clearCanvas.addEventListener("click", refresh, false);

publish.addEventListener('click',sendAnimationAuto);
canvasSpace.addEventListener("click", mouseClick);
rectBtn.addEventListener("click", rectOn);

circleBtn.addEventListener("click", circleOn);
penBtn.addEventListener("click", penOn);
eraserBtn.addEventListener("click", eraseOn);

saveBtn.addEventListener("click", saveDrawing, false);

clearBtn.addEventListener("click", clear, false);
animate.addEventListener("click",animateCanvas,false);
clearCanvas.addEventListener("click",refresh,false);
undoBtn.addEventListener("click",undo,false);
redoBtn.addEventListener("click",redo,false);

console.log(test())
