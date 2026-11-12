const API_KEY = "58527978-c995c8932d1d1ca3ba7843853";
let imgs = [];
let src;          // offscreen buffer the images scroll inside
let x = 0;        // slit-scan write position
const SPEED = 2;


function setup() {
  createCanvas(900, 150);
  pixelDensity(1);
  src = createGraphics(150, 150);
  src.pixelDensity(1);
   src.background(20); 
  background(20);
  fetchImages("glitch", "flowers", 20);
}

function draw() {
  // 1. scroll images up inside the buffer
  //src.background(20);
  for (let item of imgs) {
    item.y -= SPEED;
    if (item.y + item.w < 0) {
      item.y = src.width + random(0, 10);
    }
    src.image(item.img, item.x, item.y, item.w, item.h);
  }

  // 2. slit-scan: 1px column from buffer onto main canvas
  image(src, x, 0, 1, height,
        floor(src.width / 2), 0, 1, src.height);

  // 3. advance and wrap
  x++;
  if (x > width) x = 0;
}

function fetchImages(q, category = "", count = 20) {
  let url =
    `https://pixabay.com/api/?key=${API_KEY}` +
    `&q=${encodeURIComponent(q)}` +
    `&image_type=photo&per_page=${count}&safesearch=true`;
  if (category) url += `&category=${category}`;
  loadJSON(url, gotData, (err) => console.error(err));
}


function gotData(data) {
   imgs = [];
  for (let hit of data.hits) {
    loadImage(hit.webformatURL, (img) => {
      let w = random(100, 250);
      imgs.push({
        img,
        x: random(-w / 2, 50),
        y: random(src.height),
        w,
        h: (w * img.height) / img.width,
      });
    });
  }
}

//When an image has fully left the top, send it back below the bottom edge
//Store each image’s drawn height when you load it so you don’t recalculate it every frame
// then make the array of images move in 1 direction up the y axis

//add to slitscan **************
//Draw the scrolling images into an offscreen buffer (createGraphics) instead of the main canvas.
//Each frame, copy one 1px-wide column from that buffer onto the main canvas at x.
//Advance x, and don’t clear the main canvas, so the strips accumulate.
