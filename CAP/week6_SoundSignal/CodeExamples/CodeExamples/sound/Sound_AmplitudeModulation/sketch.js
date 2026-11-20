/*
  This example shows the modulation of a wave using the aplitude of another wave. 

  The main settings to do that are all found in the setup. 

  EXAMPLE ADAPTED FROM:
  https://p5js.org/examples/sound-amplitude-modulation.html
*/


let audioOn = false;

let carrier; // this is the oscillator we will hear
let modulator; // this oscillator will modulate the amplitude of the carrier
let fft; // we'll visualize the waveform

function setup() {
  createCanvas(800, 800);
  textAlign(CENTER);

  carrier = new p5.Oscillator(); // connects to master output by default
  carrier.freq(220);
  carrier.amp(0.5);
  // the modulator adds to this amplitude, so 0.5 leaves room for it

  //////// CHANGE HERE TO SEE DIFFERENT MODULATION EFFECTS /////
  modulator = new p5.Oscillator('sine');
  modulator.freq(5); // try 1, 2, 5, 10, 100
  modulator.amp(1);


  ///// DON'T MISS THIS (where the magic happens) //////

  //try comment out or commenting in the following 3 lines 
  // to test / break / understand how the code
   //carrier.amp(1);//would just set the amplitude to 1

  //this means we do not hear the modulator wave 
  modulator.disconnect(); // disconnect the modulator from master output

  // Modulate the carrier's amplitude with the modulator
  carrier.amp(modulator);

  //////////////////////////////////////////////////////

  // create an fft to analyze the audio
  fft = new p5.FFT();
  fft.setInput(carrier);

}

function draw() {
  background(255);
  fill(0);
  strokeWeight(2);

  if(audioOn == true){
  
    // move the mouse to the right to hear the effect of the modulator on the carrier
    let modAmp = map(mouseX, 0, width, 0, 1,true);
    modulator.amp(modAmp); // fade time of 0.1 for smooth fading

    // analyze the waveform
    let wave = fft.waveform();

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
    carrier.start();
    modulator.start();
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