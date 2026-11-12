/*

Add an array for storing random values, use them to set the height of the rectangle

Extra challenge, add a circle that moves behind the stripes on the x axis 

You can check the CopyMe solution which you can download
Or watch the lab video recording. 

Test yourself by following the steps in the comments below
 
*/

let x = -50;//circle x
let diam = 100;// circle diameter

let numElements = 5;
let spacing;

let randomNumbers = []; // empty array

function setup() {
  createCanvas(400, 400);
  
  rectMode(CENTER);
  spacing = width / numElements;

  //controls random values
 // randomSeed(200);

  //Step 1: fill your randomNumbers array with random values


}

function draw() {
  background(220);
  noStroke();

  //Moving circle
  x = x + 3;
    
  if(x > (width+diam/2)){
    x = 0-diam/2;
  }
  
  noStroke();
  fill(255,0,0);
  circle(x, height/2, diam);

  //Step 2: loop through your randomNumbers array. 
  //HINT can you use array length instead of numElements
  for(let i = 0; i < numElements; i++){

    //Step 3: use your random numbers from the array for y height
    let yHeight = 200;
    
    fill(0);
    rect((i * spacing)+spacing*0.5, height/2, spacing * 0.5, yHeight);

  }

}

function mousePressed() {

  //Extra Challenge
  //Step 4. On mouse pressed empty your array and get different random numbers

}
