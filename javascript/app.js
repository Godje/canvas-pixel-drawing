var canvasBody = window.document.getElementById("canvas"),
    canvas = canvasBody.getContext("2d"),

    winW = canvasBody.width = window.innerWidth,
    winH = canvasBody.height = window.innerHeight,

    opts = {
      pixelSize: 20,
    },

    verticalAmount = Math.floor(winH / opts.pixelSize);
    horizontalAmount = Math.floor(winW / opts.pixelSize);

    pictureData = [],

    drawing = false,

    currentColor = "#ff00ff";

function Cell(){

  this.reset();
};

Cell.prototype.reset = function () {
  this.width = opts.pixelSize;
  this.height = opts.pixelSize;

  this.x = 0;
  this.y = 0;

  this.color = "rgba(0,0,0,0)";
};

Cell.prototype.startPlacement = function (xPos, yPos) {
  this.x = xPos * this.width;
  this.y = yPos * this.height;

  this.place();

  return this;
};

Cell.prototype.place = function () {
  canvas.fillStyle = this.color;
  canvas.fillRect(this.x, this.y, this.width, this.height);
};

Cell.prototype.redraw = function (color) {
  canvas.fillStyle = color;
  canvas.fillRect(this.x, this.y, this.width, this.height);
}

function startApp(){
  for(var i = 0; i < verticalAmount; i++){
    var lineData = [];
    for( var f = 0; f < horizontalAmount; f++){
      lineData.push(new Cell);
    }
    pictureData.push(lineData)
  }

  for ( var i = 0; i < verticalAmount; i++ ) {
    for( var f = 0; f < horizontalAmount; f++ ) {
      pictureData[i][f].startPlacement(f, i)
      //console.log(pictureData[i][f].startPlacement(f, i))
    }
  }
}

startApp()

canvasBody.addEventListener("mousedown", function(e){
  drawing = true;
  stumpPixel(e);
  console.log(e.pageX, e.pageY)
})

canvasBody.addEventListener("mouseup", function(e){
  drawing = false;
  console.log(e.pageX, e.pageY)
})

canvasBody.addEventListener("mousemove", function(e){
  if (drawing) {
    stumpPixel(e)
  }
})

function stumpPixel(e) {
  var mouseX = e.pageX,
      mouseY = e.pageY,

      color = currentColor,

      slabX = Math.round( (mouseX - (opts.pixelSize / 4)) / (winW / horizontalAmount) ),
      slabY = Math.round( (mouseY - (opts.pixelSize / 4)) / (winH / verticalAmount) );

  pictureData[slabY][slabX].redraw(currentColor);;
  pictureData[slabY][slabX].color = currentColor;
}

function updateColor(jscolor) {
  var color = document.getElementById("color_pick").value;
  currentColor = "#" + color;
  console.log(color);
}
