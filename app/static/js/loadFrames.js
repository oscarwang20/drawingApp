// initialize canvas variables
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
let height = canvas.height;
let width = canvas.width;

// keeps track of frame and image data
let currFrame = 0;
let loadedFrame = 0;
let frames = {};

let frameSaves = document.getElementById("frameSaves");

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
    // refCtx.putImageData(data, 0, 0, 0, 0, 50, 50);
    frames[currFrame] = data;
    console.log(frames);
    const i = currFrame;
    document.cookie = "currFrame=" + currFrame + ";" + "path=/" + ";" + "sameSite=Strict";
    document.cookie = "frames=" + frames + ";" + "path=/" + ";" + "sameSite=Strict";
    reference.addEventListener("click", function () {
        restore(i);
    });
    frameSaves.appendChild(reference);
}

// restores the drawing using putImageData()
let restore = function(i){
    console.log("restore attempted")
    ctx.putImageData(frames[i], 0, 0);
}

let frameData = function(){
    return frames;
}

export { loadFrame, saveDrawing, restore, frameData};