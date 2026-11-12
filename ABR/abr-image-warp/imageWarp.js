const API_KEY = "58527978-c995c8932d1d1ca3ba7843853";
const WORDS = ["nature", "photo"];
let wordIndex = 0;
let imgs = [];
const speed = 2;
const gap = -10;
let warpX;

function setup() {
  createCanvas(900, 150);
  pixelDensity(1);
  warpX = floor(width * 0.5);
  fetchImages(WORDS[wordIndex], 20);
}

function draw() {
  background(20);

  // 1. move tiles right, loop them back at the left
  for (let i = 0; i < imgs.length; i++) {
    let item = imgs[i];

    // move this tile to the right
    item.x = item.x + speed;

    // if it has gone off the right edge
    if (item.x > width) {
      // find the left-most tile (start with a big number)
      let leftMost = width;
      for (let j = 0; j < imgs.length; j++) {
        if (imgs[j].x < leftMost) {
          leftMost = imgs[j].x;
        }
      }

      // put this tile just to the left of the left-most one
      item.x = leftMost - item.w - gap;
    }

    // draw the tile
    image(item.img, item.x, 0, item.w, height);
  }
  // take the 1px column just left of the warp point
  let col = get(warpX - 1, 0, 1, height);

  //  stretch it across everything to the right (the drag)
  image(col, warpX, 0, width - warpX, height);
}

// pixabay code for fetch
function fetchImages(q, count = 100) {
  let url =
    `https://pixabay.com/api/?key=${API_KEY}` +
    `&q=${encodeURIComponent(q)}` +
    `&order=latest${count}&safesearch=true`;
  loadJSON(url, gotData, (err) => console.error(err));
}

// function gotData(data) {
//   imgs = [];
//   for (let hit of data.hits) {
//     loadImage(hit.webformatURL, (img) => {
    
//       let w = random(100, 250);
//       imgs.push({
//         img,
//         x: random(-w / 2, 50),
//         y: random(img.height),
//         w,
//         h: (w * img.height) / img.width,
//       });
//     });
//

  function gotData(data) {
  imgs = [];
  let hits = shuffle(data.hits);
  let cursor = width;
  for (let hit of data.hits) {
  loadImage(hit.webformatURL, (img) => {
   let w = height * (img.width / img.height);
   imgs.push({ img, w, x: cursor - w });
   cursor -= w + gap;
});
  }
}
