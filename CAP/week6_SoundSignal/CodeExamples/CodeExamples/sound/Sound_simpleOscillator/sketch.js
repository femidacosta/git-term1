/*
  This is a simple sketch you can use to compare each oscillator wave type
  Simply change the wave type to test out one wave at a time
  Your mouse movement will change the frequency and amplitude of the oscillator
*/

let audioOn = false;

let oscillate, fft;

function setup() {
  createCanvas(800, 800);
  textAlign(CENTER);


  //////////////////CHANGE HERE///////////////////

  //Wave types: "sine", "triangle", "sawtooth", "square"
  oscillate = new p5.Oscillator("sine");
  // Change the wave type of the osc to test  e.g.  oscilate = new p5.Oscillator("triangle");

  ///////////////////////////////////////////////


  fft = new p5.FFT();
  fft.setInput(oscillate);

}

function draw() {
  background(255);
  fill(0);
  strokeWeight(2);

  if(audioOn == true){
  
    // change oscillator frequency based on mouseX
    let frequency = map(mouseX, 0, width, 40, 880);
    oscillate.freq(frequency,0.1);//smooth the transitions by 0.1 seconds

    let amplitude = map(mouseY, 0, height, 1, 0.01,true);
    oscillate.amp(amplitude);//smooth the transitions by 0.1 seconds

    let wave = fft.waveform(); // analyze the waveform
  
    //x and y position to translate to, and third param is numVertices
    drawWaveForm(width*0.25,height/2,wave);

  }else{
    text("Click to Start", width/2,height/2);
  }


}

function mousePressed(){
  //start audio on mouse user interaction
  if(audioOn == false){
    audioOn = true;

    //start all of your audio processes
    oscillate.start();
  }
}

//Using splineVertex for a smooth wave, pass in waveform array
function drawWaveForm(ox,oy,wave)
{
  let spacingX = (width*0.5)/wave.length;
  let waveAmplitude = 100;

  push();
  
  translate(ox,oy);
  
  fill(0);
  circle(0,0,10);//origin after translate at 0,0
  fill(0);
  text("0,0",-20,-5);

  stroke(0);
  strokeWeight(2);
  
  noFill();
  beginShape();
  
  for (let i = 0; i < wave.length; i++) {
    
    let vX = spacingX*i;
    let vY = wave[i]*waveAmplitude;//value between -1 to 1 multiplied by height 
    
    //spline vertex in shape
    splineVertex(vX,vY);
    
  }
  endShape();
  
  pop();
}