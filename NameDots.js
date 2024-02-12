let textCanvas;
let Points = [];
let range;
let wind;
let size
let holding = false;

const title = "Elijah Frankle";
const margin = 0.8;
const chaos = 0.3;
const dampening = 0.9;
const initialOffset = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(50);
  
  textCanvas = createGraphics(windowWidth, windowHeight);
  textCanvas.textAlign(CENTER, CENTER);
  textCanvas.fill(0);
  textCanvas.textStyle(BOLD);
  
  setPoints();
}

function draw() {
  background(0, 0, 35);
  fill(255);
  noStroke();

  if (holding) {
    let index = int(random(Points.length));
    Points[index].pos.x = mouseX;
    Points[index].pos.y = mouseY;
  }
  
  for (let i = 0; i < Points.length; i++) {
    Points[i].update(0);
    Points[i].draw();
  }
}

function mousePressed() {
    if (!["A", "BUTTON"].includes(event.target.nodeName)) {
      holding = true;
    }
}

function mouseReleased() {
  holding = false;
}

function setPoints() {
  range = windowWidth*0.2;
  wind = windowWidth*0.0007;
  size = windowWidth*0.0025;

  textCanvas.background(255);
  textCanvas.textSize(getMaxSize());
  textCanvas.text(title, windowWidth*0.5, windowHeight*0.4);
  let numPoints = 0;
  const maxPoints = width*2;
  Points = [];
  while (numPoints < maxPoints) {
    const x = int(random(windowWidth));
    const y = int(random(windowHeight));
    if (red(textCanvas.get(x, y)) == 0) {
      Points.push(new Point(x, y));
      numPoints++;
    }
  }
}

function getMaxSize() {
  let size = 0;
  let fontS = 0;
  while(size < windowWidth*margin) {
    fontS++;
    textSize(fontS);
    size = textWidth(title);
  }
  return fontS;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setPoints();
}

class Point {
  constructor(x, y) {
    this.anchor = createVector(x, y);
    this.pos = createVector(x+random(-initialOffset, initialOffset), y+random(-initialOffset, initialOffset));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.color = color(255, 255, 255);
  }
  
  update() {
    this.acc.x = this.anchor.x-this.pos.x + random(-wind, wind);
    this.acc.y = this.anchor.y-this.pos.y + random(-wind, wind);
    const d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    if (d <= range) {
      const amt = pow(range-d, 1.1);
      const xMove = amt*random(-chaos, chaos);
      const yMove = amt*random(-chaos, chaos);
      this.acc.x += xMove;
      this.acc.y += yMove;
      this.color = lerpColor(color(255, 130, 50), color(255, 255, 255), d/range);
    } else {
      this.color = color(255, 255, 255);
    }
    this.acc.mult(0.05);
    this.vel = p5.Vector.add(this.acc, this.vel);
    this.vel.mult(0.9);
    this.pos = p5.Vector.add(this.vel, this.pos);
  }
  
  draw() {
    fill(this.color);
    circle(this.pos.x, this.pos.y, size);
  }
}