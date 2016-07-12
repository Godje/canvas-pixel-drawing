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

    tools = [
      "Paint", //Paints the thing
      "Eraser" //Erases the thing (to white)
    ],

    actions = {
      fill: function(){
        canvas.fillStyle = currentColor;
        canvas.fillRect(0,0,winW,winH);
        return "Filled with "+ currentColor +"";
      },
      clear: function(){
        canvas.fillStyle = "white";
        canvas.fillRect(0,0,winW,winH);
        return "Cleared";
      }
    },

    pressing = false,
    toolNow = tools[0],

    currentColor = "#ff00ff";

function Cell(){

  this.reset();
};

Cell.prototype.reset = function () {
  this.width = opts.pixelSize;
  this.height = opts.pixelSize;

  this.x = 0;
  this.y = 0;

  this.scale = 1;

  this.color = "rgba(255,255,255,1)";
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

Cell.prototype.redraw = function (arg) {
  if (arg.color){
    canvas.fillStyle = arg.color;
  } else {
    canvas.fillStyle = this.color;
  }
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

function stumpPixel(e, todo) {
  var mouseX = e.pageX,
      mouseY = e.pageY,

      color = currentColor,

      slabX = Math.round( (mouseX - (opts.pixelSize / 4)) / (winW / horizontalAmount) ),
      slabY = Math.round( (mouseY - (opts.pixelSize / 4)) / (winH / verticalAmount) );
  if (todo == "Paint") {
    pictureData[slabY][slabX].redraw({color: currentColor});;
    pictureData[slabY][slabX].color = currentColor;
  } else if (todo == "Erase") {
    pictureData[slabY][slabX].redraw("white");
    pictureData[slabY][slabX].color = "white";
  }
}

function updateColor(jscolor) {
  var color = document.getElementById("color_pick").textContent;
  currentColor = "#" + jscolor;
  console.log(currentColor);
}

// --
// EVENT CONTROLLERS
// --

canvasBody.addEventListener("mousedown", function(e){
  pressing = true;
  stumpPixel(e);
  console.log(e.pageX, e.pageY)
})

canvasBody.addEventListener("mouseup", function(e){
  pressing = false;
  console.log(e.pageX, e.pageY)
})

//If the mouse is moving and it is clicked that will call the redraw function on each Cell that is in the range
canvasBody.addEventListener("mousemove", function(e){
  if (pressing && toolNow == "Paint") {
    stumpPixel(e, "Paint")
  } else if (pressing && toolNow == "Eraser") {
    stumpPixel(e, "Erase")
  }
})


var toolBoardBody = $("#tool-wrapper"),
    toolBoardTrigger = $("#arrow"),
    toolsHolder = $("#drawing-tools"),
    tool_tool = $("#drawing-tools .tool")
    tool_paintTool = $("#paint"),
    tool_eraserTool = $("#eraser"),
    colorPick = $("#color_pick");

toolBoardTrigger.on("click", function(){
  toolBoardBody.toggleClass("opened");
});

tool_tool.on("click", function(){
  $(this).addClass("selected");
  $(this).siblings().removeClass("selected");

  toolChange($(this).attr("id"));
  console.log($(this).attr("id"))
})

function toolChange(tool){
  for (var i = 0; i < tools.length; i++) {
    if(tool == tools[i].toLowerCase()){
      toolNow = tools[i];
    }
  }
  console.log(toolNow)
}
