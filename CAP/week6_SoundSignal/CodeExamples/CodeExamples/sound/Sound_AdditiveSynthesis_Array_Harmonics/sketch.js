/*
  Additive Synthesis using an array of oscillators. Using harmonic sounds.

  This works a bit like a piano. Keys 1 to 9 each play one harmonic while you hold them down.
  Hold down several keys at once to add the sounds together.

  https://p5js.org/reference/p5.sound/p5.Oscillator/
  https://p5js.org/reference/p5.sound/#p5.Envelope

*/

let audioOn = false;

let oscillators = [];
let envelopes = [];
let fft;

//we multiply the base frequency by a value to get a scale of harmonic sounds
const BASE_FREQ = 110;

function setup() {
  createCanvas(800, 800);
  textAlign(CENTER);

  fft = new p5.FFT();

  //one oscillator and envelope for each of our 9 keys
  for (let i = 1; i <= 9; i++) {
    //harmonic frequencies are multiples of the base frequency, so we multiply by i
    let o = new p5.Oscillator(BASE_FREQ * i);

    //Parameters: attack, decay, sustain, release
    let env = new p5.Envelope(0.1, 0, 1, 1);
    o.amp(0.2);//quiet enough to hold many keys at once

    //send the oscillator through an envelope instead of straight to the speakers
    o.disconnect();
    o.connect(env);
    fft.setInput(env);

    oscillators.push(o);//add our oscilattor to our array of oscillators
    envelopes.push(env);//add our envelope to our array of envelopes
  }

}

function draw() {
  background(255);
  fill(0);
  strokeWeight(2);

  if(audioOn == true){

    let wave = fft.waveform(); // analyze the waveform

    //x and y position to translate to, and third param is numVertices
    drawWaveForm(width*0.25,height/2,wave);

  }else{
    text("Click to Start, Hold Keys 1 to 9 to Play", width/2,height/2);
  }


}

function mousePressed(){
  //start audio on mouse user interaction
  if(audioOn == false){
    audioOn = true;

    //start all of your audio processes, they stay silent until a key is pressed
    for (let i = 0; i < oscillators.length; i++) {
      oscillators[i].start();
    }
  }
}

function keyPressed(){
  let n = int(key);//turn the key into a number/integer

  //arrays start at 0, so key 1 is index 0 which we get by subtracting 1 from n the key number
  if(n >= 1 && n <= 9){
    envelopes[n-1].triggerAttack();
  }
}

//event is the parameter that contains information about the key that was released
function keyReleased(event){
  // key could be a different one that is still held down!
  // so we use event.key which is the key just released 
  let n = int(event.key);

  //if key is in our range of 1 to 9, stop the sound for that key / frequency
  if(n >= 1 && n <= 9){
    envelopes[n-1].triggerRelease();
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