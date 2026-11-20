/*
  Noise contains every frequency. A filter removes some of them to shape the sound.
  mouseX changes the filter's cutoff frequency, mouseY changes its resonance.

  https://p5js.org/reference/p5.sound/p5.Noise/
  https://p5js.org/reference/p5.sound/p5.LowPass/
*/

let audioOn = false;

let noiseSound, filter, fft;

function setup() {
  createCanvas(800, 800);
  textAlign(CENTER);

  //////////////////CHANGE HERE///////////////////

  //Noise types: "white", "pink", "brown"
  noiseSound = new p5.Noise("white");

  //Filter types: p5.LowPass, p5.HighPass, p5.BandPass
  filter = new p5.LowPass();

  ///////////////////////////////////////////////

  noiseSound.amp(0.3);//noise is loud, so keep the volume low

  //send the noise through the filter instead of straight to the speakers
  noiseSound.disconnect();
  noiseSound.connect(filter);

  fft = new p5.FFT();
  fft.setInput(filter);

}

function draw() {
  background(255);
  fill(0);
  strokeWeight(2);

  if(audioOn == true){

    // change filter cutoff frequency based on mouseX
    let cutoff = map(mouseX, 0, width, 100, 8000,true);
    filter.freq(cutoff);

    // change filter resonance based on mouseY, values near 100 can get very loud
    let resonance = map(mouseY, height, 0, 0, 20,true);
    filter.res(resonance);

    text("Cutoff: " + round(cutoff) + " Hz  Resonance: " + round(resonance), width/2,20);

    let wave = fft.waveform(); // analyze the waveform

    //x and y position to translate to, and third param is the waveform array
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
    noiseSound.start();
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
