/*
Whenever you use p5.sound you should always make sure that the user is starting the audio element (so this works in all browers all of the time)

Example using the micrphone: 
https://p5js.org/reference/p5.sound/p5.AudioIn/

Geting the volume / level / amplitude using p5.Amplitude getLevel:
https://p5js.org/reference/p5.sound/p5.Amplitude/


*/

let micOn = false;
let mic;
let amp;


function setup() {
  createCanvas(400, 400);
  textAlign(CENTER);
  noStroke();

 
  mic = new p5.AudioIn();// microphone
  amp = new p5.Amplitude();// for getting volume

  //prevent feedback by disconnecting mic and connecting to amplitude object
  mic.disconnect();
  mic.connect(amp);

}

function draw() {

  if(micOn == true){
    background(0,15);

    //smooth the volume values
    // let smoothing = map(mouseX, 0, width, 0, 0.9,true);//test values
    let smoothing = 0.8;
    amp.smooth(smoothing);

    //get the current volume value
    let curVol = amp.getLevel();
    console.log(curVol);
    
    let circleSize = map(curVol,0,1,30,100);

    // if the volume is greate than the threshold value draw circle else rect
    if( curVol < 0.2){
      circle(width/2,height/2,circleSize);
    
    }else{
      fill(255,0,0);
      rectMode(CENTER);
      rect(width/2,height/2,circleSize,circleSize);
    }
    
      
    fill(255);
    text("Sing!", width/2,height-20);
    
  }else{
    
    background(255);
    fill(0);
    text("Click to Sing", width/2,height/2);
    
  }


}

function mousePressed(){
  //user starts audio on mouse pressed
  if(micOn == false){
    micOn = true;

    mic.start();
    
  }
}