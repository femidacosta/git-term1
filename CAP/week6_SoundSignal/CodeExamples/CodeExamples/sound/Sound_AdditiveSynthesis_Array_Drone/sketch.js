/*
  Additive Synthesis using an array of oscillators.

  Every key release plays a random sound. We have a bank of 20 oscillators and envelopes
  and use the next one in the array each time, so many sounds can play and add together.

  https://p5js.org/reference/p5.sound/p5.Oscillator/
  https://p5js.org/reference/p5.sound/#p5.Envelope

  Is this sketch running slowly? 
  If yes, try reducing the number of oscillators in the array from 20 to 10 or 5.
  Change numSounds to 10 or 5 in the code below.
  This will mean sounds are more likely to be cut off when you play many keys in a row, 
  but it will run faster.
*/

let audioOn = false;

let oscillators = [];
let envelopes = [];
let nextSound = 0;//the next oscillator and envelope in our arrays to use
let fft;

//play() starts the release after 1 sec (the sustain), so keep attackTime at 1 or less
let attackTime = 1;
let releaseTime = 5;


let numSounds = 20;//number of oscillators and envelopes in our arrays

//ratios pick the harmonic, freqs pick the tuning
let ratios = [0.25, 0.5, 0.75];
let freqs = [220, 222, 233];

//TEST THESE INSTEAD, comment out arrays above and uncomment arrays below to test, press several keys quickly to layer sounds

//1. Blending: the same notes as keys 1, 2 and 3 in the harmonics sketch (110, 220, 330 Hz)
// let ratios = [0.25, 0.5, 0.75];
// let freqs = [440];

//2. Pulsing: 
// 110 and 112 Hz are 2 Hz apart, so they pulse every half second
// let ratios = [0.5];
// let freqs = [220, 224];

// 110 and 111 Hz are 1 Hz apart, so they pulse once per second
// let ratios = [0.5];
// let freqs = [220, 222];


//3. Wobble: 110 and 123.5 Hz are a whole tone apart, the gap is too wide to pulse slowly
// let ratios = [0.5];
// let freqs = [220, 247];

//4. Everything: many more combinations for a richer, less predictable drone
// let ratios = [0.25, 0.3, 0.33, 0.375, 0.4, 0.5, 0.505, 0.6, 0.667, 0.75];
// let freqs = [146.8, 165, 196, 220, 221, 247, 293.6, 296, 330, 440];


function setup() {
  createCanvas(800, 800);
  textAlign(CENTER);

  fft = new p5.FFT();

  //our bank of 20 oscillators and envelopes
  for (let i = 0; i < numSounds; i++) {
    let o = new p5.Oscillator("sine");//oscillator object

    //Parameters: attack, decay, sustain, release
    let env = new p5.Envelope(attackTime, 0, 1, releaseTime);
    o.amp(0.2);//quiet enough to play many sounds at once

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
  
    //x and y position to translate to, and third param is the waveform array
    drawWaveForm(width*0.25,height/2,wave);

  }else{
    text("Click to Start, Press and Release Keys to Play", width/2,height/2);
  }


}

function mousePressed(){
  //start audio on mouse user interaction
  if(audioOn == false){
    audioOn = true;

    //start all of your audio processes, they stay silent until a key is released
    for (let i = 0; i < oscillators.length; i++) {
      oscillators[i].start();
    }
  }
}

//change this think about ways to make more complex
//we use keyReleased because holding a key down can call keyPressed many times
function keyReleased(){
  if(audioOn == true){
    let randomFreqIndex = int(random(freqs.length));
    let randomRatioIndex = int(random(ratios.length));
    let f = freqs[randomFreqIndex] * ratios[randomRatioIndex];

    oscillators[nextSound].freq(f);
    envelopes[nextSound].play();
    console.log(nextSound, f);

    //move to the next one, going back to the start when we reach the end
    nextSound++;
    if(nextSound == oscillators.length){
      nextSound = 0;
    }
  }
}

//Using splineVertex for a smooth wave, pass in waveform array
function drawWaveForm(ox,oy,wave){
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