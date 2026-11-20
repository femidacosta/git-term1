/*

Truchet tile sketch
https://en.wikipedia.org/wiki/Truchet_tile

Another example of using an offscreen buffer 
https://p5js.org/reference/p5/createGraphics/

*/

// this is how many segments we divide the screen into on x & y axes so 10 x 10 = 100
let numTiles = 10;

let randomNumbers = [];

let tile;
let tileSize;

let showTile = false;

function setup() {
  createCanvas(400, 400);
  
  angleMode(DEGREES);
  
  //set global styling
  noFill();
  strokeWeight(1);

  for (let gridX = 10; gridX<numTiles; gridX++){
    for (let gridY = 0; gridY<numTiles; gridY++){
      //give us a random number between 0 - 1 for every grid cell
      randomNumbers.push(random(1));
    }
  }
  
  //set up our offscreen buffer tile
  tileSize = width/numTiles;
  tile = createGraphics(tileSize,tileSize);
  tile.background(255);
  
  // oneQuarterCircle(tileSize); // test this one to understand the mechanism
  twoQuarterCircles(tileSize);
}

function draw() {
  background(220);
  
  //nested for loop
  for (let gridX = 0; gridX<numTiles; gridX++){
    for (let gridY = 0; gridY<numTiles; gridY++){

      let x = tileSize * gridX;
      let y = tileSize * gridY;

      let cellIndex = (gridY*numTiles) + gridX;
      let probability = randomNumbers[cellIndex];

      push();
      //first translate to the corner
      translate(x,y);
      // circle(0,0,3);//visualise origin of grid cell

       
      //then use probability to rotate
      if(probability < 0.25){
        push();
        translate(tileSize,0);
        rotate(90);
        image(tile,0,0);
        pop();
        
      }else if(probability < 0.5){
        push();
        translate(tileSize,tileSize);
        rotate(180);
        image(tile,0,0);
        pop();
      }else if(probability < 0.75){
        
        //rotate 270
        push();
        translate(0,tileSize);
        rotate(270);
        image(tile,0,0);
        pop();
  
      }else{
        //no rotation
        image(tile,0,0);
      }
      
     
      pop();
      
    }
  }

  
  if(showTile){
    image(tile, width*0.25,height*0.25,width*0.5, height*0.5);
  }

  
}


//draw one circle in top corner 
function oneQuarterCircle(w){
  tile.circle(0,0,w);
}

//draw two circles
function twoQuarterCircles(w){
  tile.circle(0,0,w);
  tile.circle(w,w,w);
}

function mousePressed(){

  // IMPORTANT to empty your array
  randomNumbers = [];

  for (let gridX = 0; gridX<numTiles; gridX++){
    for (let gridY = 0; gridY<numTiles; gridY++){
      //give us a random number between 0 - 1 for every grid cell
      randomNumbers.push(random(1));
    }
  }

}

function keyPressed(){
  if(key == 't'){
    showTile = !showTile;
  }
}
