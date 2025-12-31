const title = 'Elijah Frankle Portfolio';
const maxPoints = 8000;
const resetRatio = 0.1;
const growSpeed = 0.15;
const speedVariance = 0.5;
const fontSize = 125;
const lineWidth = 1;
const justOnce = false;

let container;
let textCanvas;
let holding = false;

let Points = [];

function setup() {
    container = document.getElementById('sketch-container');

    const mainCanvas = createCanvas(container.offsetWidth, container.offsetHeight);
    mainCanvas.parent(container);
    // stroke(255);
    stroke(0);
    strokeWeight(lineWidth);

    textCanvas = createGraphics(container.offsetWidth, container.offsetHeight);
    textCanvas.textAlign(CENTER, CENTER);
    textCanvas.fill(1);
    textCanvas.textStyle(BOLD);

    frameRate(30);

    setTextCanvas();
}

function draw() {
    // background(0, 0, 35);
    background(255, 255, 255);

    if (mouseIsPressed && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        if (!holding) {
            for (let i = 0; i < Points.length; i++) {
                Points[i].saveLine();
            }
        }
        holding = true;
    }
    else {
        if (holding) {
            for (let i = 0; i < Points.length; i++) {
                Points[i].restoreLine();
            }
        }
        holding = false;
    }

    for (let i = 0; i < Points.length; i++) {
        Points[i].update(holding);
        Points[i].draw();
    }
}

function setTextCanvas() {
    textCanvas.background(0);
    textCanvas.textSize(fontSize);
    textCanvas.text(title, width/2, height/2);
    Points = [];
    let numPoints = 0;
    let whileCount = 0;
    while (numPoints < maxPoints && whileCount < 100000) {
        const x = int(random(width));
        const y = int(random(height));
        if (red(textCanvas.get(x, y)) == 1) {
            Points.push(new Point(x, y));
            numPoints++;
        }
        whileCount++;
    }
}

function windowResized() {
    resizeCanvas(container.offsetWidth, container.offsetHeight);
    textCanvas.resizeCanvas(container.offsetWidth, container.offsetHeight);
    setTextCanvas();
}

class Point {
    constructor(x, y) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = x;
        this.y2 = y;
        this.savedX;
        this.savedY;
        this.direction = int(random(0, 4));
        this.speed = growSpeed*(1+random(-speedVariance, speedVariance));
    }

    saveLine() {
        this.savedX = this.x2;
        this.savedY = this.y2;
    }

    restoreLine() {
        this.x2 = this.savedX;
        this.y2 = this.savedY;
    }

    update(hold) {
        if ((this.x1 == this.x2) && (this.y1 == this.y2) && !hold) {
            this.direction = int(random(0, 4));
        }
        let checkX = this.x2;
        let checkY = this.y2;
        if (this.direction == 0) {
            checkY += this.speed;
        } else if (this.direction == 1) {
            checkX += this.speed;
        } else if (this.direction == 2) {
            checkY -= this.speed;
        } else if (this.direction == 3) {
            checkX -= this.speed;
        }
        if (hold || red(textCanvas.get(checkX, checkY))) {
            this.x2 = checkX;
            this.y2 = checkY;
        }
        else {
            if (!justOnce) {
                this.direction = (this.direction+2)%4;
            }
        }
    }

    draw() {
        line(this.x1, this.y1, this.x2, this.y2);
    }
}