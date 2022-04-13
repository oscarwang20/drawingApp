const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
let height = canvas.height;
let width = canvas.width;

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
    if(mode == "paint"){
    paint = true;
    getPosition(event);
    initialize = false;
    }
    if (mode == "erase"){
    erase = true;
    getPosition(event);
    }

}


function drawRect(event){
    if(mode == "rect" && !corner1){
      clear();
      ctx.putImageData(data, 0, 0);
      ctx.beginPath();
      getPosition(event);
      let a = coord.x;
      let b = coord.y;
      ctx.rect(x1,y1,a-x1,b-y1);
      ctx.stroke();
      // console.log('animate');
      // window.cancelAnimationFrame(requestID);
    }

}

function drawCircle(event){
    if(mode == "circle" && !center){
      clear();
      ctx.putImageData(data, 0, 0);
      ctx.beginPath();
      getPosition(event);
      let a = coord.x;
      let b = coord.y;
      let radius = Math.sqrt(Math.pow(a-x1,2) + Math.pow(b-y1,2));
      ctx.arc(x1,y1,radius,0,2*Math.PI);
      ctx.stroke();
      // console.log('animate');
      // window.cancelAnimationFrame(requestID);
    }

}


function mouseClick(){
  if (mode == "circle"){
    ctx.beginPath();
    ctx.lineWidth = penWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    if (!center){
      getPosition(event);
      x2 = coord.x;
      y2 = coord.y;
      let radius = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
      ctx.arc(x1,y1,radius,0,2*Math.PI);
      ctx.stroke();
      center = true;
      return;
    }
    if (center){
      getPosition(event);
      x1 = coord.x;
      y1 = coord.y;
      center = false;
      data = ctx.getImageData(0, 0, width, height);
      // console.log("center");

      return;
    }

}
    if (mode == "rect"){
      ctx.beginPath();
      ctx.lineWidth = penWidth;
      ctx.lineCap = "round";
      ctx.strokeStyle = color;
      if (!corner1){
        getPosition(event);
        x2 = coord.x;
        y2 = coord.y;
        ctx.rect(x1,y1,x2-x1,y2-y1);
        ctx.stroke();
        corner1 = true;
        // console.log("cor2");
        return;
      }
      if (corner1){
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
    erase = false;
    paint = false;
}

function sketch(event) {
    ctx.beginPath();
    if (paint){
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
    if (erase){
    ctx.lineWidth = penWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
    ctx.moveTo(coord.x, coord.y);
    getPosition(event);
    ctx.lineTo(coord.x, coord.y);
    ctx.stroke();
    }
    if (mode == "rect"){
      drawRect(event);
    }
    if (mode == "circle"){
      drawCircle(event);
    }

}



// clears the canvas
function clear(e) {
    // console.log("clear attempted");
    ctx.clearRect(0, 0, width, height);
}

function penOn(){
    mode = "paint";
    erase = false;
    // console.log("draw");
}

function eraseOn(){
    mode = "erase";
    paint = false;
    // console.log("erase");
}

function rectOn(){
    mode = "rect";
    requestID = window.requestAnimationFrame(drawRect);

    // console.log("rect")
}

function circleOn(){
    mode = "circle";
    requestID = window.requestAnimationFrame(drawCircle);

    // console.log("circle")
}
//changes the pen color according to user input
function penCol(){
    // let as = document.forms[0].penColor.value;
    color = col.options[col.selectedIndex].text;
    // console.log(color);
}

penSlider.oninput = function() {
  penWidth = penSlider.value;
  // console.log(penWidth);
}

export { getPosition, mouseDown, mouseUp, sketch, clear, penOn, eraseOn, rectOn, penCol, mouseClick, drawRect, circleOn};
