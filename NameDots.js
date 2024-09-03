let textCanvas;
let Points = [];
let range;
let wind;
let size;
let holding = false;
let touching = false;
let mobile;
let setNextFrame = false;

const title = "Elijah Frankle";
const vertTitle = "Elijah\nFrankle"
const margin = 0.8;
const chaos = 0.3;
const dampening = 0.05;
const drag = 0.9;
const initialOffset = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(50);
  noStroke();
  
  textCanvas = createGraphics(windowWidth, windowHeight);
  textCanvas.textAlign(CENTER, CENTER);
  textCanvas.fill(1);
  textCanvas.textStyle(BOLD);

  checkMobile();
  
  setPoints();
}

function draw() {
  if (setNextFrame) {
    resizeCanvas(windowWidth, windowHeight);
    setPoints();
    setNextFrame = false;
  }

  background(0, 0, 35);

  if (holding) {
    for (let i = 0; i < 4; i++) {
      let index = int(random(Points.length));
      Points[index].toMouse = true;
    }
  }
  
  for (let i = 0; i < Points.length; i++) {
    Points[i].update();
    Points[i].draw();
  }
}

function checkMobile() {
  if ("ontouchstart" in window) {
    mobile = true;
  } else {
    mobile = false;
  }
}

function mousePressed() {
    if (!mobile & !["A", "BUTTON"].includes(event.target.nodeName)) {
      holding = true;
    }
}

function mouseReleased() {
  if (!mobile) {
    holding = false;
    for (let i = 0; i < Points.length; i++) {
      Points[i].toMouse = false;
    }
  }
}

function touchStarted() {
  if (mobile) {
    touching = true;
  }
}

function touchEnded() {
  if (mobile) {
    touching = false;
  }
}

function setPoints() {
  holding = false;
  touching = false;

  if (mobile) {
    range = windowWidth*0.25;
  } else {
    range = windowWidth*0.2;
  }
  wind = windowWidth*0.0007;
  if (windowWidth > windowHeight) {
    size = windowWidth*0.0025;
  } else {
    size = windowWidth*0.0045;
  }

  textCanvas.background(255);
  let maxSize = getMaxSize();
  textCanvas.textSize(maxSize);
  textCanvas.textLeading(maxSize*0.9);
  let maxPoints;
  if (windowWidth > windowHeight) {
    textCanvas.text(title, windowWidth*0.5, windowHeight*0.4);
    maxPoints = windowWidth * 2;
  } else {
    textCanvas.text(vertTitle, windowWidth*0.5, windowHeight*0.4);
    maxPoints = windowWidth * 3;
  }
  let numPoints = 0;
  Points = [];
  let whileCount = 0;
  while (numPoints < maxPoints && whileCount < 100000) {
    const x = int(random(windowWidth));
    const y = int(random(windowHeight));
    if (red(textCanvas.get(x, y)) == 1) {
      Points.push(new Point(x, y));
      numPoints++;
    }
    whileCount++;
  }
}

function getMaxSize() {
  let size = 0;
  let fontS = 0;
  while(size < windowWidth*margin) {
    fontS++;
    textSize(fontS);
    if (windowWidth > windowHeight) {
      size = textWidth(title);
    } else {
      size = textWidth(vertTitle);
    }
  }
  return fontS;
}

function windowResized() {
  setNextFrame = true;
}

class Point {
  constructor(x, y) {
    this.anchor = createVector(x, y);
    this.pos = createVector(x+random(-initialOffset, initialOffset), y+random(-initialOffset, initialOffset));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.color = color(255, 255, 255);
    this.toMouse = false;
  }
  
  update() {
    if (this.toMouse) {
      this.acc.x = mouseX-this.pos.x + random(-wind, wind);
      this.acc.y = mouseY-this.pos.y + random(-wind, wind);
    } else {
      this.acc.x = this.anchor.x-this.pos.x + random(-wind, wind);
      this.acc.y = this.anchor.y-this.pos.y + random(-wind, wind);
    }
    const d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    if ((!mobile | touching) & (d <= range)) {
      const amt = pow(range-d, 1.1);
      const xMove = amt*random(-chaos, chaos);
      const yMove = amt*random(-chaos, chaos);
      this.acc.x += xMove;
      this.acc.y += yMove;
      this.color = lerpColor(color(255, 130, 50), color(255, 255, 255), d/range);
    } else {
      this.color = color(255, 255, 255);
    }
    if (this.toMouse) {
      this.acc.mult(0.3*dampening);
    } else {
      this.acc.mult(dampening);
    }
    this.vel = p5.Vector.add(this.acc, this.vel);
    this.vel.mult(drag);
    this.pos = p5.Vector.add(this.vel, this.pos);
  }
  
  draw() {
    fill(this.color);
    circle(this.pos.x, this.pos.y, size);
  }
}