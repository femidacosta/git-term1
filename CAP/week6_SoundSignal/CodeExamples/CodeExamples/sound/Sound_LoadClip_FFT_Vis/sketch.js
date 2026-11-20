/*
Loading in a sound file
https://p5js.org/reference/#/p5.SoundFile

FFT analysis 
https://p5js.org/reference/#/p5.FFT

Sound File:
First sound every recorded in 1860. Recorded on a Phonautograph.
https://en.wikipedia.org/wiki/Phonautograph
https://www.youtube.com/playlist?list=PLy5nynGqE9jNdrKswEjr81obPhGAHgMFm
*/


let fft;
let firstSound;

async function setup() {
  //WARNING: loadSound fails if there is a space anywhere in the folder path 
  firstSound = await loadSound('Edouard-Leon-Scott-de-Martinville.ogg');

  createCanvas(400, 400);
  textAlign(CENTER);

  fft = new p5.FFT(256); //dividing frequency into 256 bins
  fft.setInput(firstSound);
}

function draw() {

  if(firstSound.isLooping()){
    background(0,255,0);
  }else{
    background(255);
  }

  fill(0);
  text("Click to Play & Pause",width/2,20);


  //fft analysis, spectrum is an array of frequency bins
  let spectrum = fft.analyze();
  drawSpectrum(spectrum);

  //waveform from fft analysis, amplitude values along the time domain
  let wave = fft.waveform(); // return an array

  //x and y position to translate to, and third param is numVertices
  drawWaveForm(width*0.25,height*0.5,wave);


}

function keyPressed(){
  if(firstSound.isPlaying()){

    if(key == 'l'){
      let toggle = !firstSound.isLooping();
      firstSound.loop(toggle);
    }

    if(key == 'r'){
      let randomplace = random(firstSound.duration());
      firstSound.jump(randomplace);

    }

  }
}

function mousePressed(){

  if(!firstSound.isPlaying()){
    firstSound.play();
  }else{
    // firstSound.stop(); // stop means play will then start from the beginning
    firstSound.pause();// pause means play will resume from where it left off
  }
}


//pass in spectrum array
function drawSpectrum(spectrum){
  push();

  noStroke();
  fill(255, 0, 255);
  for (let i = 0; i< spectrum.length; i++){
    let x = map(i, 0, spectrum.length, 0, width);
    let h = height - map(spectrum[i], 0, 0.1, height, 0, true);
    rect(x, height-h, width / spectrum.length, h );
  }
  
  pop();
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
    let vY = wave[i] * waveAmplitude;//value between -1 to 1 multiplied by height 
    
    //spline vertex in shape
    splineVertex(vX,vY);
    
  }
  endShape();
  
  pop();
}