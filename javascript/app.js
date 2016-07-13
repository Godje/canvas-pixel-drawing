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

        for(var i = 0; i < pictureData.length; i++) {
          pictureData[i].map( function( Cell ){ Cell.color = currentColor; Cell.redraw() });
        }

        return "Filled with "+ currentColor +"";
      },
      wipe: function(){
        canvas.clearRect(0,0,winW,winH);
        for(var i = 0; i < pictureData.length; i++) {
          pictureData[i].map( function( Cell ){ Cell.color = "rgba(0,0,0,0)"; Cell.redraw() });
        }
      },
      clear: function(){
        canvas.clearRect(0,0,winW,winH);
      }
    },

    pressing = false,
    toolNow = tools[0],

    currentColor = "#ff00ff";

function Cell(){

  this.reset();
};

Cell.prototype.reset = function (xPos, yPos) {
  this.width = opts.pixelSize;
  this.height = opts.pixelSize;

  this.x = xPos * this.width;
  this.y = yPos * this.height;

  this.scale = 1;

  this.place();

  this.color = "rgba(0,0,0,0)";
};

Cell.prototype.place = function () {
  canvas.fillStyle = this.color;
  canvas.fillRect(this.x, this.y, this.width, this.height);
};

Cell.prototype.redraw = function (arg) {
  if (arg){
    console.log(arg)
    this.color = canvas.fillStyle = arg.color;
  } else {
    canvas.fillStyle = this.color;
  }
  canvas.fillRect(this.x, this.y, this.width, this.height);
}

function startApp(vA, hA){
  for(var i = 0; i < vA; i++){
    var lineData = [];
    for( var f = 0; f < hA; f++){
      lineData.push(new Cell);
    }
    pictureData.push(lineData)
  }

  for ( var i = 0; i < vA; i++ ) {
    for( var f = 0; f < hA; f++ ) {
      pictureData[i][f].reset(f, i)
      //console.log(pictureData[i][f].startPlacement(f, i))
    }
  }
}

function restartApp(arg){
  finishApp()
  if(arg != undefined){
    console.log()
  }
  // verticalAmount = Math.floor(winH / opts.pixelSize);
  // horizontalAmount = Math.floor(winW / opts.pixelSize);
  startApp()
}

function finishApp(){
  canvas.clear();
  canvas.wipe();
  pictureData = [];
}

startApp(verticalAmount, horizontalAmount)

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
    actions.clear();
    pictureData[slabY][slabX].color = "rgba(0,0,0,0)";
    for(var i = 0; i < pictureData.length; i++){
      pictureData[i].map( function(Cell) { Cell.place() } )
    }
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
  if (pressing && toolNow == "Paint") {
    stumpPixel(e, "Paint")
  } else if (pressing && toolNow == "Eraser") {
    stumpPixel(e, "Erase")
  }
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
